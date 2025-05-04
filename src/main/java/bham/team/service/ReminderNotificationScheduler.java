package bham.team.service;

import bham.team.domain.Notification;
import bham.team.domain.Reminder;
import bham.team.domain.User;
import bham.team.domain.enumeration.NotificationChannel;
import bham.team.domain.enumeration.NotificationStatus;
import bham.team.domain.enumeration.NotificationType;
import bham.team.domain.enumeration.Priority;
import bham.team.repository.NotificationRepository;
import bham.team.repository.ReminderRepository;
import bham.team.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReminderNotificationScheduler {

    private final Logger log = LoggerFactory.getLogger(ReminderNotificationScheduler.class);

    private final ReminderRepository reminderRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public ReminderNotificationScheduler(
        ReminderRepository reminderRepository,
        NotificationRepository notificationRepository,
        UserRepository userRepository
    ) {
        this.reminderRepository = reminderRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 * * * * *") // runs every minute
    @Transactional
    public void checkAndNotifyDueReminders() {
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(60); // 1-minute buffer

        List<Reminder> dueReminders = reminderRepository
            .findAll()
            .stream()
            .filter(r -> r.getReminderDate() != null && !r.getReminderDate().isBefore(windowStart) && !r.getReminderDate().isAfter(now))
            .toList();

        for (Reminder reminder : dueReminders) {
            User user = reminder.getUser();
            if (user == null) continue;

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("⏰ Reminder: " + reminder.getTitle());
            notification.setNotificationType(NotificationType.REMINDER);
            notification.setCreatedAt(now);
            notification.setRead(false);
            notification.setPriority(Priority.MEDIUM);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentVia(NotificationChannel.PUSH);

            notificationRepository.save(notification);
            log.info("🔔 Reminder notification sent for user '{}' - '{}'", user.getLogin(), reminder.getTitle());
        }
    }
}
