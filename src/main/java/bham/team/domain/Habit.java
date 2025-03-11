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
    @Column(name = "repeat_type", nullable = false)
    private String repeatType;

    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    @Column(name = "repeat_days")
    private String repeatDays;

    @Column(name = "repeat_times")
    private String repeatTimes;

    @NotNull
    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "streak")
    private Integer streak;

    @Column(name = "completion_rate")
    private Float completionRate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "completedHabits")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pomodoroSessions", "user", "completedTasks", "completedHabits" }, allowSetters = true)
    private Set<ProductivityReport> productivityReports = new HashSet<>();

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

    public Boolean getCompleted() {
        return this.completed;
    }

    public Habit completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
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

    public Set<ProductivityReport> getProductivityReports() {
        return this.productivityReports;
    }

    public void setProductivityReports(Set<ProductivityReport> productivityReports) {
        if (this.productivityReports != null) {
            this.productivityReports.forEach(i -> i.removeCompletedHabits(this));
        }
        if (productivityReports != null) {
            productivityReports.forEach(i -> i.addCompletedHabits(this));
        }
        this.productivityReports = productivityReports;
    }

    public Habit productivityReports(Set<ProductivityReport> productivityReports) {
        this.setProductivityReports(productivityReports);
        return this;
    }

    public Habit addProductivityReport(ProductivityReport productivityReport) {
        this.productivityReports.add(productivityReport);
        productivityReport.getCompletedHabits().add(this);
        return this;
    }

    public Habit removeProductivityReport(ProductivityReport productivityReport) {
        this.productivityReports.remove(productivityReport);
        productivityReport.getCompletedHabits().remove(this);
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
            ", repeatType='" + getRepeatType() + "'" +
            ", repeatInterval=" + getRepeatInterval() +
            ", repeatDays='" + getRepeatDays() + "'" +
            ", repeatTimes='" + getRepeatTimes() + "'" +
            ", completed='" + getCompleted() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", streak=" + getStreak() +
            ", completionRate=" + getCompletionRate() +
            "}";
    }
}
