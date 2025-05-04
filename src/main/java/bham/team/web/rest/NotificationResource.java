package bham.team.web.rest;

import bham.team.domain.Notification;
import bham.team.domain.User;
import bham.team.repository.NotificationRepository;
import bham.team.repository.UserRepository;
import bham.team.security.SecurityUtils;
import bham.team.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
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
    private final UserRepository userRepository;

    public NotificationResource(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("")
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody Notification notification) throws URISyntaxException {
        LOG.debug("REST request to save Notification : {}", notification);
        if (notification.getId() != null) {
            throw new BadRequestAlertException("A new notification cannot already have an ID", ENTITY_NAME, "idexists");
        }

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();
        notification.setUser(user);

        notification = notificationRepository.save(notification);
        return ResponseEntity.created(new URI("/api/notifications/" + notification.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, notification.getId().toString()))
            .body(notification);
    }

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

        Notification existingNotification = notificationRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingNotification.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this notification", ENTITY_NAME, "unauthorized");
        }

        notification.setUser(existingNotification.getUser()); // preserve user link
        notification = notificationRepository.save(notification);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, notification.getId().toString()))
            .body(notification);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Notification> partialUpdateNotification(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Notification notification
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Notification partially : {}, {}", id, notification);
        if (notification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Notification existingNotification = notificationRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingNotification.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this notification", ENTITY_NAME, "unauthorized");
        }

        Optional<Notification> result = Optional.of(existingNotification)
            .map(existing -> {
                if (notification.getMessage() != null) {
                    existing.setMessage(notification.getMessage());
                }
                if (notification.getNotificationType() != null) {
                    existing.setNotificationType(notification.getNotificationType());
                }
                if (notification.getCreatedAt() != null) {
                    existing.setCreatedAt(notification.getCreatedAt());
                }
                if (notification.getRead() != null) {
                    existing.setRead(notification.getRead());
                }
                if (notification.getPriority() != null) {
                    existing.setPriority(notification.getPriority());
                }
                if (notification.getStatus() != null) {
                    existing.setStatus(notification.getStatus());
                }
                if (notification.getSentVia() != null) {
                    existing.setSentVia(notification.getSentVia());
                }

                return existing;
            })
            .map(notificationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, notification.getId().toString())
        );
    }

    @GetMapping("")
    public List<Notification> getAllNotifications() {
        LOG.debug("REST request to get all Notifications");
        return notificationRepository.findByUserIsCurrentUser();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotification(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Notification : {}", id);
        Optional<Notification> notification = notificationRepository
            .findById(id)
            .filter(n -> n.getUser() != null && n.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")));
        return ResponseUtil.wrapOrNotFound(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Notification : {}", id);
        Notification existingNotification = notificationRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingNotification.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to delete this notification", ENTITY_NAME, "unauthorized");
        }
        notificationRepository.delete(existingNotification);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
