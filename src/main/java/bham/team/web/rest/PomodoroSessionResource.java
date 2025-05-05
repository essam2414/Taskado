package bham.team.web.rest;

import bham.team.domain.PomodoroSession;
import bham.team.domain.User;
import bham.team.repository.PomodoroSessionRepository;
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
@RequestMapping("/api/pomodoro-sessions")
@Transactional
public class PomodoroSessionResource {

    private static final Logger LOG = LoggerFactory.getLogger(PomodoroSessionResource.class);

    private static final String ENTITY_NAME = "pomodoroSession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PomodoroSessionRepository pomodoroSessionRepository;
    private final UserRepository userRepository;

    public PomodoroSessionResource(PomodoroSessionRepository pomodoroSessionRepository, UserRepository userRepository) {
        this.pomodoroSessionRepository = pomodoroSessionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("")
    public ResponseEntity<PomodoroSession> createPomodoroSession(@Valid @RequestBody PomodoroSession pomodoroSession)
        throws URISyntaxException {
        LOG.debug("REST request to save PomodoroSession : {}", pomodoroSession);
        if (pomodoroSession.getId() != null) {
            throw new BadRequestAlertException("A new pomodoroSession cannot already have an ID", ENTITY_NAME, "idexists");
        }

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();
        pomodoroSession.setUser(user);

        pomodoroSession = pomodoroSessionRepository.save(pomodoroSession);
        return ResponseEntity.created(new URI("/api/pomodoro-sessions/" + pomodoroSession.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString()))
            .body(pomodoroSession);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PomodoroSession> updatePomodoroSession(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PomodoroSession pomodoroSession
    ) throws URISyntaxException {
        LOG.debug("REST request to update PomodoroSession : {}, {}", id, pomodoroSession);
        if (pomodoroSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoroSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PomodoroSession existingSession = pomodoroSessionRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (existingSession.getUser() == null || !existingSession.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this session", ENTITY_NAME, "unauthorized");
        }

        pomodoroSession.setUser(existingSession.getUser());
        pomodoroSession = pomodoroSessionRepository.save(pomodoroSession);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString()))
            .body(pomodoroSession);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PomodoroSession> partialUpdatePomodoroSession(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PomodoroSession pomodoroSession
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PomodoroSession : {}, {}", id, pomodoroSession);
        if (pomodoroSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoroSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!pomodoroSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PomodoroSession existingSession = pomodoroSessionRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingSession.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this session", ENTITY_NAME, "unauthorized");
        }

        Optional<PomodoroSession> result = Optional.of(existingSession)
            .map(session -> {
                if (pomodoroSession.getName() != null) session.setName(pomodoroSession.getName());
                if (pomodoroSession.getDuration() != null) session.setDuration(pomodoroSession.getDuration());
                if (pomodoroSession.getBreakDuration() != null) session.setBreakDuration(pomodoroSession.getBreakDuration());
                if (pomodoroSession.getLongBreakDuration() != null) session.setLongBreakDuration(pomodoroSession.getLongBreakDuration());
                if (pomodoroSession.getCycles() != null) session.setCycles(pomodoroSession.getCycles());
                if (pomodoroSession.getStartTime() != null) session.setStartTime(pomodoroSession.getStartTime());
                if (pomodoroSession.getEndTime() != null) session.setEndTime(pomodoroSession.getEndTime());
                if (pomodoroSession.getCompleted() != null) session.setCompleted(pomodoroSession.getCompleted());
                return session;
            })
            .map(pomodoroSessionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString())
        );
    }

    @GetMapping("")
    public List<PomodoroSession> getAllPomodoroSessions() {
        LOG.debug("REST request to get all PomodoroSessions");

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();

        return pomodoroSessionRepository.findAllByUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PomodoroSession> getPomodoroSession(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PomodoroSession : {}", id);
        Optional<PomodoroSession> session = pomodoroSessionRepository
            .findById(id)
            .filter(s -> s.getUser() != null && s.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")));
        return ResponseUtil.wrapOrNotFound(session);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePomodoroSession(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PomodoroSession : {}", id);

        PomodoroSession session = pomodoroSessionRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!session.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to delete this session", ENTITY_NAME, "unauthorized");
        }

        pomodoroSessionRepository.delete(session);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
