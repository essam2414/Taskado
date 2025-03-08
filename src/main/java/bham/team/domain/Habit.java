package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Habit.
 */
@Entity
@Table(name = "habit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Habit implements Serializable {

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
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "streak")
    private Integer streak;

    @Column(name = "completion_rate")
    private Float completionRate;

    @NotNull
    @Column(name = "repeat_type", nullable = false)
    private String repeatType;

    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    @Column(name = "repeat_days")
    private String repeatDays;

    @Column(name = "repeat_times")
    private String repeatTimes;

    @Lob
    @Column(name = "completed_dates")
    private String completedDates;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Habit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Habit name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Habit startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Integer getStreak() {
        return this.streak;
    }

    public Habit streak(Integer streak) {
        this.setStreak(streak);
        return this;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public Float getCompletionRate() {
        return this.completionRate;
    }

    public Habit completionRate(Float completionRate) {
        this.setCompletionRate(completionRate);
        return this;
    }

    public void setCompletionRate(Float completionRate) {
        this.completionRate = completionRate;
    }

    public String getRepeatType() {
        return this.repeatType;
    }

    public Habit repeatType(String repeatType) {
        this.setRepeatType(repeatType);
        return this;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }

    public Integer getRepeatInterval() {
        return this.repeatInterval;
    }

    public Habit repeatInterval(Integer repeatInterval) {
        this.setRepeatInterval(repeatInterval);
        return this;
    }

    public void setRepeatInterval(Integer repeatInterval) {
        this.repeatInterval = repeatInterval;
    }

    public String getRepeatDays() {
        return this.repeatDays;
    }

    public Habit repeatDays(String repeatDays) {
        this.setRepeatDays(repeatDays);
        return this;
    }

    public void setRepeatDays(String repeatDays) {
        this.repeatDays = repeatDays;
    }

    public String getRepeatTimes() {
        return this.repeatTimes;
    }

    public Habit repeatTimes(String repeatTimes) {
        this.setRepeatTimes(repeatTimes);
        return this;
    }

    public void setRepeatTimes(String repeatTimes) {
        this.repeatTimes = repeatTimes;
    }

    public String getCompletedDates() {
        return this.completedDates;
    }

    public Habit completedDates(String completedDates) {
        this.setCompletedDates(completedDates);
        return this;
    }

    public void setCompletedDates(String completedDates) {
        this.completedDates = completedDates;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Habit category(Category category) {
        this.setCategory(category);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Habit user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Habit)) {
            return false;
        }
        return getId() != null && getId().equals(((Habit) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Habit{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", streak=" + getStreak() +
            ", completionRate=" + getCompletionRate() +
            ", repeatType='" + getRepeatType() + "'" +
            ", repeatInterval=" + getRepeatInterval() +
            ", repeatDays='" + getRepeatDays() + "'" +
            ", repeatTimes='" + getRepeatTimes() + "'" +
            ", completedDates='" + getCompletedDates() + "'" +
            "}";
    }
}
