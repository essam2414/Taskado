package bham.team.domain;

import bham.team.domain.enumeration.PomodoroType;
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

    @Column(name = "jhi_end")
    private Instant end;

    @Column(name = "duration")
    private Integer duration;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private PomodoroType type;

    @Column(name = "paused")
    private Boolean paused;

    @Column(name = "observations")
    private String observations;

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

    public Instant getEnd() {
        return this.end;
    }

    public PomodoroSession end(Instant end) {
        this.setEnd(end);
        return this;
    }

    public void setEnd(Instant end) {
        this.end = end;
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

    public PomodoroType getType() {
        return this.type;
    }

    public PomodoroSession type(PomodoroType type) {
        this.setType(type);
        return this;
    }

    public void setType(PomodoroType type) {
        this.type = type;
    }

    public Boolean getPaused() {
        return this.paused;
    }

    public PomodoroSession paused(Boolean paused) {
        this.setPaused(paused);
        return this;
    }

    public void setPaused(Boolean paused) {
        this.paused = paused;
    }

    public String getObservations() {
        return this.observations;
    }

    public PomodoroSession observations(String observations) {
        this.setObservations(observations);
        return this;
    }

    public void setObservations(String observations) {
        this.observations = observations;
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
            ", end='" + getEnd() + "'" +
            ", duration=" + getDuration() +
            ", type='" + getType() + "'" +
            ", paused='" + getPaused() + "'" +
            ", observations='" + getObservations() + "'" +
            "}";
    }
}
