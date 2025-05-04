package bham.team.web.rest;

import bham.team.domain.Reminder;
import bham.team.domain.User;
import bham.team.repository.ReminderRepository;
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

@RestController
@RequestMapping("/api/reminders")
@Transactional
public class ReminderResource {

    private static final Logger LOG = LoggerFactory.getLogger(ReminderResource.class);

    private static final String ENTITY_NAME = "reminder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public ReminderResource(ReminderRepository reminderRepository, UserRepository userRepository) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("")
    public ResponseEntity<Reminder> createReminder(@Valid @RequestBody Reminder reminder) throws URISyntaxException {
        LOG.debug("REST request to save Reminder : {}", reminder);
        if (reminder.getId() != null) {
            throw new BadRequestAlertException("A new reminder cannot already have an ID", ENTITY_NAME, "idexists");
        }

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();
        reminder.setUser(user);

        reminder = reminderRepository.save(reminder);
        return ResponseEntity.created(new URI("/api/reminders/" + reminder.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, reminder.getId().toString()))
            .body(reminder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Reminder reminder
    ) throws URISyntaxException {
        LOG.debug("REST request to update Reminder : {}, {}", id, reminder);
        if (reminder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reminder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Reminder existingReminder = reminderRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingReminder.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this reminder", ENTITY_NAME, "unauthorized");
        }

        reminder.setUser(existingReminder.getUser()); // preserve user
        reminder = reminderRepository.save(reminder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reminder.getId().toString()))
            .body(reminder);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Reminder> partialUpdateReminder(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Reminder reminder
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Reminder partially : {}, {}", id, reminder);
        if (reminder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reminder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Reminder existingReminder = reminderRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingReminder.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this reminder", ENTITY_NAME, "unauthorized");
        }

        Optional<Reminder> result = Optional.of(existingReminder)
            .map(existing -> {
                if (reminder.getTitle() != null) {
                    existing.setTitle(reminder.getTitle());
                }
                if (reminder.getDescription() != null) {
                    existing.setDescription(reminder.getDescription());
                }
                if (reminder.getReminderDate() != null) {
                    existing.setReminderDate(reminder.getReminderDate());
                }
                if (reminder.getRepeatType() != null) {
                    existing.setRepeatType(reminder.getRepeatType());
                }
                if (reminder.getRepeatInterval() != null) {
                    existing.setRepeatInterval(reminder.getRepeatInterval());
                }
                if (reminder.getLinkedEntityType() != null) {
                    existing.setLinkedEntityType(reminder.getLinkedEntityType());
                }
                if (reminder.getLinkedEntityId() != null) {
                    existing.setLinkedEntityId(reminder.getLinkedEntityId());
                }

                return existing;
            })
            .map(reminderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reminder.getId().toString())
        );
    }

    @GetMapping("")
    public List<Reminder> getAllReminders() {
        LOG.debug("REST request to get all Reminders");
        return reminderRepository.findByUserIsCurrentUser();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminder(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Reminder : {}", id);
        Optional<Reminder> reminder = reminderRepository
            .findById(id)
            .filter(r -> r.getUser() != null && r.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")));
        return ResponseUtil.wrapOrNotFound(reminder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Reminder : {}", id);
        Reminder existingReminder = reminderRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingReminder.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to delete this reminder", ENTITY_NAME, "unauthorized");
        }
        reminderRepository.delete(existingReminder);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
