package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Reminder.
 */
@Entity
@Table(name = "reminder")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reminder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "reminder_date", nullable = false)
    private Instant reminderDate;

    @Column(name = "repeat_type")
    private String repeatType;

    @Column(name = "repeat_interval")
    private Integer repeatInterval;

    @Column(name = "linked_entity_type")
    private String linkedEntityType;

    @Column(name = "linked_entity_id")
    private Long linkedEntityId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reminder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Reminder title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Reminder description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getReminderDate() {
        return this.reminderDate;
    }

    public Reminder reminderDate(Instant reminderDate) {
        this.setReminderDate(reminderDate);
        return this;
    }

    public void setReminderDate(Instant reminderDate) {
        this.reminderDate = reminderDate;
    }

    public String getRepeatType() {
        return this.repeatType;
    }

    public Reminder repeatType(String repeatType) {
        this.setRepeatType(repeatType);
        return this;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }

    public Integer getRepeatInterval() {
        return this.repeatInterval;
    }

    public Reminder repeatInterval(Integer repeatInterval) {
        this.setRepeatInterval(repeatInterval);
        return this;
    }

    public void setRepeatInterval(Integer repeatInterval) {
        this.repeatInterval = repeatInterval;
    }

    public String getLinkedEntityType() {
        return this.linkedEntityType;
    }

    public Reminder linkedEntityType(String linkedEntityType) {
        this.setLinkedEntityType(linkedEntityType);
        return this;
    }

    public void setLinkedEntityType(String linkedEntityType) {
        this.linkedEntityType = linkedEntityType;
    }

    public Long getLinkedEntityId() {
        return this.linkedEntityId;
    }

    public Reminder linkedEntityId(Long linkedEntityId) {
        this.setLinkedEntityId(linkedEntityId);
        return this;
    }

    public void setLinkedEntityId(Long linkedEntityId) {
        this.linkedEntityId = linkedEntityId;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Reminder user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reminder)) {
            return false;
        }
        return getId() != null && getId().equals(((Reminder) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reminder{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", reminderDate='" + getReminderDate() + "'" +
            ", repeatType='" + getRepeatType() + "'" +
            ", repeatInterval=" + getRepeatInterval() +
            ", linkedEntityType='" + getLinkedEntityType() + "'" +
            ", linkedEntityId=" + getLinkedEntityId() +
            "}";
    }
}
