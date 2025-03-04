package bham.team.web.rest;

import bham.team.domain.PomodoroSession;
import bham.team.repository.PomodoroSessionRepository;
import bham.team.service.dto.PomodoroSessionDTO;
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
 * REST controller for managing {@link bham.team.domain.PomodoroSession}.
 */
@RestController
@RequestMapping("/api/pomodoro-sessions")
@Transactional
public class PomodoroSessionResource {

    private static final Logger LOG = LoggerFactory.getLogger(PomodoroSessionResource.class);

    private static final String ENTITY_NAME = "pomodoroSession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PomodoroSessionRepository pomodoroSessionRepository;

    public PomodoroSessionResource(PomodoroSessionRepository pomodoroSessionRepository) {
        this.pomodoroSessionRepository = pomodoroSessionRepository;
    }

    /**
     * {@code POST  /pomodoro-sessions} : Create a new pomodoroSession.
     *
     * @param pomodoroSession the pomodoroSession to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pomodoroSession, or with status {@code 400 (Bad Request)} if the pomodoroSession has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PomodoroSession> createPomodoroSession(@Valid @RequestBody PomodoroSession pomodoroSession)
        throws URISyntaxException {
        LOG.debug("REST request to save PomodoroSession : {}", pomodoroSession);
        if (pomodoroSession.getId() != null) {
            throw new BadRequestAlertException("A new pomodoroSession cannot already have an ID", ENTITY_NAME, "idexists");
        }
        pomodoroSession = pomodoroSessionRepository.save(pomodoroSession);
        return ResponseEntity.created(new URI("/api/pomodoro-sessions/" + pomodoroSession.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString()))
            .body(pomodoroSession);
    }

    /**
     * {@code PUT  /pomodoro-sessions/:id} : Updates an existing pomodoroSession.
     *
     * @param id the id of the pomodoroSession to save.
     * @param pomodoroSession the pomodoroSession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoroSession,
     * or with status {@code 400 (Bad Request)} if the pomodoroSession is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pomodoroSession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
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

        pomodoroSession = pomodoroSessionRepository.save(pomodoroSession);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString()))
            .body(pomodoroSession);
    }

    /**
     * {@code PATCH  /pomodoro-sessions/:id} : Partial updates given fields of an existing pomodoroSession, field will ignore if it is null
     *
     * @param id the id of the pomodoroSession to save.
     * @param pomodoroSession the pomodoroSession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoroSession,
     * or with status {@code 400 (Bad Request)} if the pomodoroSession is not valid,
     * or with status {@code 404 (Not Found)} if the pomodoroSession is not found,
     * or with status {@code 500 (Internal Server Error)} if the pomodoroSession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PomodoroSession> partialUpdatePomodoroSession(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PomodoroSession pomodoroSession
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PomodoroSession partially : {}, {}", id, pomodoroSession);
        if (pomodoroSession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoroSession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroSessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PomodoroSession> result = pomodoroSessionRepository
            .findById(pomodoroSession.getId())
            .map(existingPomodoroSession -> {
                if (pomodoroSession.getStart() != null) {
                    existingPomodoroSession.setStart(pomodoroSession.getStart());
                }
                if (pomodoroSession.getStop() != null) {
                    existingPomodoroSession.setStop(pomodoroSession.getStop());
                }

                return existingPomodoroSession;
            })
            .map(pomodoroSessionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroSession.getId().toString())
        );
    }

    /**
     * {@code GET  /pomodoro-sessions} : get all the pomodoroSessions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pomodoroSessions in body.
     */
    @GetMapping("")
    public List<PomodoroSessionDTO> getAllPomodoroSessions() {
        LOG.debug("REST request to get all PomodoroSessions");
        //return pomodoroSessionRepository.findAll();

        return pomodoroSessionRepository
            .findAll()
            .stream()
            .map(session ->
                new PomodoroSessionDTO(
                    session.getId(),
                    session.getStart(),
                    session.getStop(),
                    session.getDuration(), // Automatically computed in pomodorosession.java
                    session.getUser() != null ? session.getUser().getId() : null
                )
            )
            .toList();
    }

    /**
     * {@code GET  /pomodoro-sessions/:id} : get the "id" pomodoroSession.
     *
     * @param id the id of the pomodoroSession to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pomodoroSession, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PomodoroSessionDTO> getPomodoroSession(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PomodoroSession : {}", id);
        //Optional<PomodoroSession> pomodoroSession = pomodoroSessionRepository.findById(id);
        //return ResponseUtil.wrapOrNotFound(pomodoroSession);
        Optional<PomodoroSession> session = pomodoroSessionRepository.findById(id);

        return session
            .map(s ->
                ResponseEntity.ok(
                    new PomodoroSessionDTO(
                        s.getId(),
                        s.getStart(),
                        s.getStop(),
                        s.getDuration(),
                        s.getUser() != null ? s.getUser().getId() : null
                    )
                )
            )
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * {@code DELETE  /pomodoro-sessions/:id} : delete the "id" pomodoroSession.
     *
     * @param id the id of the pomodoroSession to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePomodoroSession(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PomodoroSession : {}", id);
        pomodoroSessionRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
