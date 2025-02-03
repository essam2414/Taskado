package bham.team.domain;

import bham.team.domain.enumeration.NotificationChannel;
import bham.team.domain.enumeration.NotificationStatus;
import bham.team.domain.enumeration.NotificationType;
import bham.team.domain.enumeration.Priority;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Notification.
 */
@Entity
@Table(name = "notification")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Notification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "message", nullable = false)
    private String message;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "linked_entity_type")
    private String linkedEntityType;

    @NotNull
    @Column(name = "read", nullable = false)
    private Boolean read;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private NotificationStatus status;

    @Column(name = "expiration_date")
    private Instant expirationDate;

    @Column(name = "action_url")
    private String actionURL;

    @Column(name = "icon")
    private String icon;

    @NotNull
    @Column(name = "is_recurring", nullable = false)
    private Boolean isRecurring;

    @Column(name = "recurrence_pattern")
    private String recurrencePattern;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "sent_via", nullable = false)
    private NotificationChannel sentVia;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Notification id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return this.message;
    }

    public Notification message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getNotificationType() {
        return this.notificationType;
    }

    public Notification notificationType(NotificationType notificationType) {
        this.setNotificationType(notificationType);
        return this;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Notification timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getLinkedEntityType() {
        return this.linkedEntityType;
    }

    public Notification linkedEntityType(String linkedEntityType) {
        this.setLinkedEntityType(linkedEntityType);
        return this;
    }

    public void setLinkedEntityType(String linkedEntityType) {
        this.linkedEntityType = linkedEntityType;
    }

    public Boolean getRead() {
        return this.read;
    }

    public Notification read(Boolean read) {
        this.setRead(read);
        return this;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public Priority getPriority() {
        return this.priority;
    }

    public Notification priority(Priority priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public NotificationStatus getStatus() {
        return this.status;
    }

    public Notification status(NotificationStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public Instant getExpirationDate() {
        return this.expirationDate;
    }

    public Notification expirationDate(Instant expirationDate) {
        this.setExpirationDate(expirationDate);
        return this;
    }

    public void setExpirationDate(Instant expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getActionURL() {
        return this.actionURL;
    }

    public Notification actionURL(String actionURL) {
        this.setActionURL(actionURL);
        return this;
    }

    public void setActionURL(String actionURL) {
        this.actionURL = actionURL;
    }

    public String getIcon() {
        return this.icon;
    }

    public Notification icon(String icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getIsRecurring() {
        return this.isRecurring;
    }

    public Notification isRecurring(Boolean isRecurring) {
        this.setIsRecurring(isRecurring);
        return this;
    }

    public void setIsRecurring(Boolean isRecurring) {
        this.isRecurring = isRecurring;
    }

    public String getRecurrencePattern() {
        return this.recurrencePattern;
    }

    public Notification recurrencePattern(String recurrencePattern) {
        this.setRecurrencePattern(recurrencePattern);
        return this;
    }

    public void setRecurrencePattern(String recurrencePattern) {
        this.recurrencePattern = recurrencePattern;
    }

    public NotificationChannel getSentVia() {
        return this.sentVia;
    }

    public Notification sentVia(NotificationChannel sentVia) {
        this.setSentVia(sentVia);
        return this;
    }

    public void setSentVia(NotificationChannel sentVia) {
        this.sentVia = sentVia;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Notification)) {
            return false;
        }
        return getId() != null && getId().equals(((Notification) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Notification{" +
            "id=" + getId() +
            ", message='" + getMessage() + "'" +
            ", notificationType='" + getNotificationType() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", linkedEntityType='" + getLinkedEntityType() + "'" +
            ", read='" + getRead() + "'" +
            ", priority='" + getPriority() + "'" +
            ", status='" + getStatus() + "'" +
            ", expirationDate='" + getExpirationDate() + "'" +
            ", actionURL='" + getActionURL() + "'" +
            ", icon='" + getIcon() + "'" +
            ", isRecurring='" + getIsRecurring() + "'" +
            ", recurrencePattern='" + getRecurrencePattern() + "'" +
            ", sentVia='" + getSentVia() + "'" +
            "}";
    }
}
