package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
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

    @Column(name = "tasks_planned")
    private Integer tasksPlanned;

    @Column(name = "tasks_completed")
    private Integer tasksCompleted;

    @Column(name = "task_avg_completion_time")
    private Float taskAvgCompletionTime;

    @Column(name = "task_efficiency")
    private Float taskEfficiency;

    @Column(name = "pomodoro_sessions")
    private Integer pomodoroSessions;

    @Column(name = "distractions_count")
    private Integer distractionsCount;

    @Column(name = "focus_time")
    private Float focusTime;

    @NotNull
    @Column(name = "focus_score", nullable = false)
    private Float focusScore;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

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

    public Float getTaskAvgCompletionTime() {
        return this.taskAvgCompletionTime;
    }

    public ProductivityReport taskAvgCompletionTime(Float taskAvgCompletionTime) {
        this.setTaskAvgCompletionTime(taskAvgCompletionTime);
        return this;
    }

    public void setTaskAvgCompletionTime(Float taskAvgCompletionTime) {
        this.taskAvgCompletionTime = taskAvgCompletionTime;
    }

    public Float getTaskEfficiency() {
        return this.taskEfficiency;
    }

    public ProductivityReport taskEfficiency(Float taskEfficiency) {
        this.setTaskEfficiency(taskEfficiency);
        return this;
    }

    public void setTaskEfficiency(Float taskEfficiency) {
        this.taskEfficiency = taskEfficiency;
    }

    public Integer getPomodoroSessions() {
        return this.pomodoroSessions;
    }

    public ProductivityReport pomodoroSessions(Integer pomodoroSessions) {
        this.setPomodoroSessions(pomodoroSessions);
        return this;
    }

    public void setPomodoroSessions(Integer pomodoroSessions) {
        this.pomodoroSessions = pomodoroSessions;
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

    public Float getFocusTime() {
        return this.focusTime;
    }

    public ProductivityReport focusTime(Float focusTime) {
        this.setFocusTime(focusTime);
        return this;
    }

    public void setFocusTime(Float focusTime) {
        this.focusTime = focusTime;
    }

    public Float getFocusScore() {
        return this.focusScore;
    }

    public ProductivityReport focusScore(Float focusScore) {
        this.setFocusScore(focusScore);
        return this;
    }

    public void setFocusScore(Float focusScore) {
        this.focusScore = focusScore;
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
            ", taskAvgCompletionTime=" + getTaskAvgCompletionTime() +
            ", taskEfficiency=" + getTaskEfficiency() +
            ", pomodoroSessions=" + getPomodoroSessions() +
            ", distractionsCount=" + getDistractionsCount() +
            ", focusTime=" + getFocusTime() +
            ", focusScore=" + getFocusScore() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
