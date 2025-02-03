package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HabitTracker.
 */
@Entity
@Table(name = "habit_tracker")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HabitTracker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "repeat_frequency", nullable = false)
    private String repeatFrequency;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "streak")
    private Integer streak;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HabitTracker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public HabitTracker name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRepeatFrequency() {
        return this.repeatFrequency;
    }

    public HabitTracker repeatFrequency(String repeatFrequency) {
        this.setRepeatFrequency(repeatFrequency);
        return this;
    }

    public void setRepeatFrequency(String repeatFrequency) {
        this.repeatFrequency = repeatFrequency;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public HabitTracker startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Integer getStreak() {
        return this.streak;
    }

    public HabitTracker streak(Integer streak) {
        this.setStreak(streak);
        return this;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HabitTracker)) {
            return false;
        }
        return getId() != null && getId().equals(((HabitTracker) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HabitTracker{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", repeatFrequency='" + getRepeatFrequency() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", streak=" + getStreak() +
            "}";
    }
}
