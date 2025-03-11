package bham.team.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductivityReport.
 */
@Entity
@Table(name = "productivity_report")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductivityReport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "tasks_planned", nullable = false)
    private Integer tasksPlanned;

    @NotNull
    @Min(value = 0)
    @Column(name = "tasks_completed", nullable = false)
    private Integer tasksCompleted;

    @NotNull
    @Min(value = 0)
    @Column(name = "pomodoro_sessions_completed", nullable = false)
    private Integer pomodoroSessionsCompleted;

    @DecimalMin(value = "0")
    @Column(name = "total_focus_time")
    private Float totalFocusTime;

    @Min(value = 0)
    @Column(name = "distractions_count")
    private Integer distractionsCount;

    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "efficiency_score")
    private Float efficiencyScore;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "productivityReport")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "productivityReport" }, allowSetters = true)
    private Set<PomodoroSession> pomodoroSessions = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_productivity_report__completed_tasks",
        joinColumns = @JoinColumn(name = "productivity_report_id"),
        inverseJoinColumns = @JoinColumn(name = "completed_tasks_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category", "user", "productivityReports" }, allowSetters = true)
    private Set<Task> completedTasks = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_productivity_report__completed_habits",
        joinColumns = @JoinColumn(name = "productivity_report_id"),
        inverseJoinColumns = @JoinColumn(name = "completed_habits_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "category", "user", "productivityReports" }, allowSetters = true)
    private Set<Habit> completedHabits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductivityReport id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTasksPlanned() {
        return this.tasksPlanned;
    }

    public ProductivityReport tasksPlanned(Integer tasksPlanned) {
        this.setTasksPlanned(tasksPlanned);
        return this;
    }

    public void setTasksPlanned(Integer tasksPlanned) {
        this.tasksPlanned = tasksPlanned;
    }

    public Integer getTasksCompleted() {
        return this.tasksCompleted;
    }

    public ProductivityReport tasksCompleted(Integer tasksCompleted) {
        this.setTasksCompleted(tasksCompleted);
        return this;
    }

    public void setTasksCompleted(Integer tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public Integer getPomodoroSessionsCompleted() {
        return this.pomodoroSessionsCompleted;
    }

    public ProductivityReport pomodoroSessionsCompleted(Integer pomodoroSessionsCompleted) {
        this.setPomodoroSessionsCompleted(pomodoroSessionsCompleted);
        return this;
    }

    public void setPomodoroSessionsCompleted(Integer pomodoroSessionsCompleted) {
        this.pomodoroSessionsCompleted = pomodoroSessionsCompleted;
    }

    public Float getTotalFocusTime() {
        return this.totalFocusTime;
    }

    public ProductivityReport totalFocusTime(Float totalFocusTime) {
        this.setTotalFocusTime(totalFocusTime);
        return this;
    }

    public void setTotalFocusTime(Float totalFocusTime) {
        this.totalFocusTime = totalFocusTime;
    }

    public Integer getDistractionsCount() {
        return this.distractionsCount;
    }

    public ProductivityReport distractionsCount(Integer distractionsCount) {
        this.setDistractionsCount(distractionsCount);
        return this;
    }

    public void setDistractionsCount(Integer distractionsCount) {
        this.distractionsCount = distractionsCount;
    }

    public Float getEfficiencyScore() {
        return this.efficiencyScore;
    }

    public ProductivityReport efficiencyScore(Float efficiencyScore) {
        this.setEfficiencyScore(efficiencyScore);
        return this;
    }

    public void setEfficiencyScore(Float efficiencyScore) {
        this.efficiencyScore = efficiencyScore;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public ProductivityReport timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Set<PomodoroSession> getPomodoroSessions() {
        return this.pomodoroSessions;
    }

    public void setPomodoroSessions(Set<PomodoroSession> pomodoroSessions) {
        if (this.pomodoroSessions != null) {
            this.pomodoroSessions.forEach(i -> i.setProductivityReport(null));
        }
        if (pomodoroSessions != null) {
            pomodoroSessions.forEach(i -> i.setProductivityReport(this));
        }
        this.pomodoroSessions = pomodoroSessions;
    }

    public ProductivityReport pomodoroSessions(Set<PomodoroSession> pomodoroSessions) {
        this.setPomodoroSessions(pomodoroSessions);
        return this;
    }

    public ProductivityReport addPomodoroSessions(PomodoroSession pomodoroSession) {
        this.pomodoroSessions.add(pomodoroSession);
        pomodoroSession.setProductivityReport(this);
        return this;
    }

    public ProductivityReport removePomodoroSessions(PomodoroSession pomodoroSession) {
        this.pomodoroSessions.remove(pomodoroSession);
        pomodoroSession.setProductivityReport(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProductivityReport user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Task> getCompletedTasks() {
        return this.completedTasks;
    }

    public void setCompletedTasks(Set<Task> tasks) {
        this.completedTasks = tasks;
    }

    public ProductivityReport completedTasks(Set<Task> tasks) {
        this.setCompletedTasks(tasks);
        return this;
    }

    public ProductivityReport addCompletedTasks(Task task) {
        this.completedTasks.add(task);
        return this;
    }

    public ProductivityReport removeCompletedTasks(Task task) {
        this.completedTasks.remove(task);
        return this;
    }

    public Set<Habit> getCompletedHabits() {
        return this.completedHabits;
    }

    public void setCompletedHabits(Set<Habit> habits) {
        this.completedHabits = habits;
    }

    public ProductivityReport completedHabits(Set<Habit> habits) {
        this.setCompletedHabits(habits);
        return this;
    }

    public ProductivityReport addCompletedHabits(Habit habit) {
        this.completedHabits.add(habit);
        return this;
    }

    public ProductivityReport removeCompletedHabits(Habit habit) {
        this.completedHabits.remove(habit);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductivityReport)) {
            return false;
        }
        return getId() != null && getId().equals(((ProductivityReport) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductivityReport{" +
            "id=" + getId() +
            ", tasksPlanned=" + getTasksPlanned() +
            ", tasksCompleted=" + getTasksCompleted() +
            ", pomodoroSessionsCompleted=" + getPomodoroSessionsCompleted() +
            ", totalFocusTime=" + getTotalFocusTime() +
            ", distractionsCount=" + getDistractionsCount() +
            ", efficiencyScore=" + getEfficiencyScore() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
