package bham.team.service;

import bham.team.domain.*;
import bham.team.domain.enumeration.NotificationChannel;
import bham.team.domain.enumeration.NotificationStatus;
import bham.team.domain.enumeration.NotificationType;
import bham.team.domain.enumeration.Priority;
import bham.team.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DailyReportScheduler {

    private final Logger log = LoggerFactory.getLogger(DailyReportScheduler.class);

    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;
    private final PomodoroSessionRepository pomodoroRepository;
    private final ProductivityReportRepository productivityReportRepository;
    private final ProductivityReportService productivityReportService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public DailyReportScheduler(
        TaskRepository taskRepository,
        HabitRepository habitRepository,
        PomodoroSessionRepository pomodoroRepository,
        ProductivityReportRepository productivityReportRepository,
        ProductivityReportService productivityReportService,
        NotificationRepository notificationRepository,
        UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
        this.pomodoroRepository = pomodoroRepository;
        this.productivityReportRepository = productivityReportRepository;
        this.productivityReportService = productivityReportService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 00 22 * * *") // Runs daily at 10:15 PM
    @Transactional
    public void generateDailyReportsForAllUsers() {
        log.info("⏰ Scheduled job: Generating daily productivity reports...");

        ZonedDateTime now = ZonedDateTime.now(ZoneId.systemDefault());
        Instant startOfDay = now.toLocalDate().atStartOfDay(now.getZone()).toInstant();
        Instant endOfDay = now.withHour(23).withMinute(59).withSecond(59).toInstant();

        List<User> users = userRepository.findAll();
        for (User user : users) {
            List<Task> tasks = taskRepository.findAllByUser(user);
            List<Habit> habits = habitRepository.findAllByUser(user);
            List<PomodoroSession> pomodoros = pomodoroRepository.findAllByUser(user);

            List<Task> tasksToday = tasks
                .stream()
                .filter(
                    task ->
                        task.getUpdatedAt() != null && !task.getUpdatedAt().isBefore(startOfDay) && !task.getUpdatedAt().isAfter(endOfDay)
                )
                .collect(Collectors.toList());

            List<Task> completedTasksToday = tasksToday.stream().filter(Task::getCompleted).collect(Collectors.toList());

            List<Habit> completedHabitsToday = new ArrayList<>();
            String todayDate = now.toLocalDate().toString(); // "2025-05-05"

            for (Habit habit : habits) {
                String raw = habit.getCompletedDates();
                if (raw == null || raw.trim().isEmpty() || raw.trim().equals("[]")) {
                    continue;
                }

                try {
                    List<String> dateStrings = objectMapper.readValue(raw, new TypeReference<List<String>>() {});
                    for (String dateStr : dateStrings) {
                        if (dateStr.startsWith(todayDate)) {
                            completedHabitsToday.add(habit);
                            break;
                        }
                    }
                } catch (Exception e) {
                    log.warn("⚠️ Failed to parse completedDates for habit '{}': {}", habit.getName(), e.getMessage());
                }
            }

            List<PomodoroSession> pomodorosToday = pomodoros
                .stream()
                .filter(p -> p.getStartTime() != null && !p.getStartTime().isBefore(startOfDay) && !p.getStartTime().isAfter(endOfDay))
                .collect(Collectors.toList());

            List<PomodoroSession> completedPomodorosToday = pomodorosToday
                .stream()
                .filter(PomodoroSession::getCompleted)
                .collect(Collectors.toList());

            // Only generate a report if there is at least:
            // - one task in DB OR
            // - one habit in DB OR
            // - one pomodoro started today
            boolean hasPlannedTasks = !tasks.isEmpty();
            boolean hasPlannedHabits = !habits.isEmpty();
            boolean hasStartedPomodorosToday = !pomodorosToday.isEmpty();

            if (!hasPlannedTasks && !hasPlannedHabits && !hasStartedPomodorosToday) {
                log.info("ℹ️ No planned items or Pomodoros today for user '{}'. Skipping report generation.", user.getLogin());
                continue;
            }

            int tasksPlanned = tasks.size();
            int tasksCompleted = completedTasksToday.size();

            int habitsPlanned = habits.size();
            int habitsCompleted = completedHabitsToday.size();

            int pomodorosPlanned = pomodorosToday.isEmpty() ? 0 : pomodoros.size();
            int pomodorosCompleted = completedPomodorosToday.size();

            float totalFocusTime =
                (float) completedPomodorosToday.stream().mapToInt(p -> p.getDuration() != null ? p.getDuration() : 0).sum() / 60f;

            int totalPlanned = tasksPlanned + habitsPlanned + pomodorosPlanned;
            int totalCompleted = tasksCompleted + habitsCompleted + pomodorosCompleted;
            float efficiencyScore = totalPlanned > 0 ? Math.min(100f, (totalCompleted / (float) totalPlanned) * 100f) : 0f;

            ProductivityReport report = new ProductivityReport();
            report.setUser(user);
            report.setTasksPlanned(tasksPlanned);
            report.setTasksCompleted(tasksCompleted);
            report.setPomodoroSessionsCompleted(pomodorosCompleted);
            report.setTotalFocusTime(totalFocusTime);
            report.setDistractionsCount(0);
            report.setEfficiencyScore(efficiencyScore);
            report.setTimestamp(Instant.now());
            report.setCompletedTasks(new HashSet<>(completedTasksToday));
            report.setCompletedHabits(new HashSet<>(completedHabitsToday));

            productivityReportService.save(report);

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("📊 Your daily productivity report has been generated.");
            notification.setNotificationType(NotificationType.SYSTEM_UPDATE);
            notification.setCreatedAt(Instant.now());
            notification.setRead(false);
            notification.setPriority(Priority.LOW);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentVia(NotificationChannel.PUSH);

            notificationRepository.save(notification);

            log.info("✅ Report generated for user '{}'", user.getLogin());
        }
    }
}
