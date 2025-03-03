package bham.team.web.rest;

import bham.team.domain.Notification;
import bham.team.repository.NotificationRepository;
import bham.team.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.Notification}.
 */
@RestController
@RequestMapping("/api/notifications")
@Transactional
public class NotificationResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationResource.class);
    private static final String ENTITY_NAME = "notification";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotificationRepository notificationRepository;

    public NotificationResource(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * {@code POST  /notifications} : Create a new notification.
     */
    @PostMapping("")
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody Notification notification) throws URISyntaxException {
        LOG.debug("REST request to save Notification : {}", notification);

        if (notification.getId() != null) {
            throw new BadRequestAlertException("A new notification cannot already have an ID", ENTITY_NAME, "idexists");
        }

        validateNotification(notification);

        notification = notificationRepository.save(notification);
        return ResponseEntity.created(new URI("/api/notifications/" + notification.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, notification.getId().toString()))
            .body(notification);
    }

    /**
     * {@code PUT  /notifications/:id} : Updates an existing notification.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Notification notification
    ) throws URISyntaxException {
        LOG.debug("REST request to update Notification : {}, {}", id, notification);

        if (notification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!notificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        validateNotification(notification);

        notification = notificationRepository.save(notification);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, notification.getId().toString()))
            .body(notification);
    }

    /**
     * {@code PATCH  /notifications/:id} : Partial update an existing notification.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Notification> partialUpdateNotification(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Notification notification
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Notification : {}, {}", id, notification);

        if (!Objects.equals(id, notification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!notificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Notification> result = notificationRepository
            .findById(notification.getId())
            .map(existingNotification -> {
                if (notification.getMessage() != null) {
                    if (notification.getMessage().length() < 5) {
                        throw new BadRequestAlertException("Message must be at least 5 characters", ENTITY_NAME, "shortMessage");
                    }
                    existingNotification.setMessage(notification.getMessage());
                }
                if (notification.getTimestamp() != null) {
                    if (notification.getTimestamp().isAfter(Instant.now())) {
                        throw new BadRequestAlertException("Timestamp cannot be in the future", ENTITY_NAME, "invalidTimestamp");
                    }
                    existingNotification.setTimestamp(notification.getTimestamp());
                }
                if (notification.getPriority() != null) {
                    existingNotification.setPriority(notification.getPriority());
                }
                if (notification.getRead() != null) {
                    existingNotification.setRead(notification.getRead());
                }
                if (notification.getStatus() != null) {
                    existingNotification.setStatus(notification.getStatus());
                }
                if (notification.getExpirationDate() != null) {
                    existingNotification.setExpirationDate(notification.getExpirationDate());
                }
                if (notification.getActionURL() != null) {
                    existingNotification.setActionURL(notification.getActionURL());
                }
                if (notification.getIcon() != null) {
                    existingNotification.setIcon(notification.getIcon());
                }
                if (notification.getIsRecurring() != null) {
                    existingNotification.setIsRecurring(notification.getIsRecurring());
                }
                if (notification.getRecurrencePattern() != null) {
                    existingNotification.setRecurrencePattern(notification.getRecurrencePattern());
                }
                if (notification.getSentVia() != null) {
                    existingNotification.setSentVia(notification.getSentVia());
                }

                return existingNotification;
            })
            .map(notificationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, notification.getId().toString())
        );
    }

    /**
     * {@code GET  /notifications} : get all notifications.
     */
    @GetMapping("")
    public List<Notification> getAllNotifications() {
        LOG.debug("REST request to get all Notifications");
        return notificationRepository.findAll();
    }

    /**
     * {@code GET  /notifications/:id} : get a notification by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotification(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Notification : {}", id);
        Optional<Notification> notification = notificationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(notification);
    }

    /**
     * {@code DELETE  /notifications/:id} : delete a notification by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Notification : {}", id);
        if (!notificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Notification not found", ENTITY_NAME, "idnotfound");
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * Validate Notification fields.
     */
    private void validateNotification(Notification notification) {
        if (notification.getMessage() != null && notification.getMessage().length() < 5) {
            throw new BadRequestAlertException("Message must be at least 5 characters", ENTITY_NAME, "shortMessage");
        }
        if (notification.getTimestamp() != null && notification.getTimestamp().isAfter(Instant.now())) {
            throw new BadRequestAlertException("Timestamp cannot be in the future", ENTITY_NAME, "invalidTimestamp");
        }
    }
}
