package bham.team.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @NotNull
    @Column(name = "start", nullable = false)
    private Instant start;

    @Column(name = "stop")
    private Instant stop;

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

    public Instant getStart() {
        return this.start;
    }

    public PomodoroSession start(Instant start) {
        this.setStart(start);
        return this;
    }

    public void setStart(Instant start) {
        this.start = start;
    }

    public Instant getStop() {
        return this.stop;
    }

    public PomodoroSession stop(Instant stop) {
        this.setStop(stop);
        return this;
    }

    public void setStop(Instant stop) {
        if (stop != null && start != null && stop.isBefore(start)) {
            throw new IllegalArgumentException("Stop time must be after start time.");
        }
        this.stop = stop;
    }

    @JsonProperty("duration")
    public Integer getDuration() {
        if (start != null && stop != null) {
            return (int) java.time.Duration.between(start, stop).toMinutes();
        }
        return null; // Return null if session is ongoing
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
            ", start='" + getStart() + "'" +
            ", stop='" + getStop() + "'" +
            "}";
    }
}
