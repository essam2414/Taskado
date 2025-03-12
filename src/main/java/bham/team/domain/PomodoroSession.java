package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PomodoroSession.
 */
@Entity
@Table(name = "pomodoro_session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PomodoroSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @NotNull
    @Column(name = "break_duration", nullable = false)
    private Integer breakDuration;

    @Column(name = "long_break_duration")
    private Integer longBreakDuration;

    @NotNull
    @Column(name = "cycles", nullable = false)
    private Integer cycles;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @NotNull
    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PomodoroSession id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public PomodoroSession name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public PomodoroSession duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getBreakDuration() {
        return this.breakDuration;
    }

    public PomodoroSession breakDuration(Integer breakDuration) {
        this.setBreakDuration(breakDuration);
        return this;
    }

    public void setBreakDuration(Integer breakDuration) {
        this.breakDuration = breakDuration;
    }

    public Integer getLongBreakDuration() {
        return this.longBreakDuration;
    }

    public PomodoroSession longBreakDuration(Integer longBreakDuration) {
        this.setLongBreakDuration(longBreakDuration);
        return this;
    }

    public void setLongBreakDuration(Integer longBreakDuration) {
        this.longBreakDuration = longBreakDuration;
    }

    public Integer getCycles() {
        return this.cycles;
    }

    public PomodoroSession cycles(Integer cycles) {
        this.setCycles(cycles);
        return this;
    }

    public void setCycles(Integer cycles) {
        this.cycles = cycles;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public PomodoroSession startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public PomodoroSession endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public PomodoroSession completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PomodoroSession user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PomodoroSession)) {
            return false;
        }
        return getId() != null && getId().equals(((PomodoroSession) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PomodoroSession{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", duration=" + getDuration() +
            ", breakDuration=" + getBreakDuration() +
            ", longBreakDuration=" + getLongBreakDuration() +
            ", cycles=" + getCycles() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", completed='" + getCompleted() + "'" +
            "}";
    }
}
