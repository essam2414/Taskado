package bham.team.web.rest;

import bham.team.domain.HabitTracker;
import bham.team.repository.HabitTrackerRepository;
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
 * REST controller for managing {@link bham.team.domain.HabitTracker}.
 */
@RestController
@RequestMapping("/api/habit-trackers")
@Transactional
public class HabitTrackerResource {

    private static final Logger LOG = LoggerFactory.getLogger(HabitTrackerResource.class);

    private static final String ENTITY_NAME = "habitTracker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitTrackerRepository habitTrackerRepository;

    public HabitTrackerResource(HabitTrackerRepository habitTrackerRepository) {
        this.habitTrackerRepository = habitTrackerRepository;
    }

    /**
     * {@code POST  /habit-trackers} : Create a new habitTracker.
     *
     * @param habitTracker the habitTracker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habitTracker, or with status {@code 400 (Bad Request)} if the habitTracker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<HabitTracker> createHabitTracker(@Valid @RequestBody HabitTracker habitTracker) throws URISyntaxException {
        LOG.debug("REST request to save HabitTracker : {}", habitTracker);
        if (habitTracker.getId() != null) {
            throw new BadRequestAlertException("A new habitTracker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        habitTracker = habitTrackerRepository.save(habitTracker);
        return ResponseEntity.created(new URI("/api/habit-trackers/" + habitTracker.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, habitTracker.getId().toString()))
            .body(habitTracker);
    }

    /**
     * {@code PUT  /habit-trackers/:id} : Updates an existing habitTracker.
     *
     * @param id the id of the habitTracker to save.
     * @param habitTracker the habitTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitTracker,
     * or with status {@code 400 (Bad Request)} if the habitTracker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habitTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<HabitTracker> updateHabitTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HabitTracker habitTracker
    ) throws URISyntaxException {
        LOG.debug("REST request to update HabitTracker : {}, {}", id, habitTracker);
        if (habitTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        habitTracker = habitTrackerRepository.save(habitTracker);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitTracker.getId().toString()))
            .body(habitTracker);
    }

    /**
     * {@code PATCH  /habit-trackers/:id} : Partial updates given fields of an existing habitTracker, field will ignore if it is null
     *
     * @param id the id of the habitTracker to save.
     * @param habitTracker the habitTracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitTracker,
     * or with status {@code 400 (Bad Request)} if the habitTracker is not valid,
     * or with status {@code 404 (Not Found)} if the habitTracker is not found,
     * or with status {@code 500 (Internal Server Error)} if the habitTracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HabitTracker> partialUpdateHabitTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HabitTracker habitTracker
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update HabitTracker partially : {}, {}", id, habitTracker);
        if (habitTracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitTracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitTrackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HabitTracker> result = habitTrackerRepository
            .findById(habitTracker.getId())
            .map(existingHabitTracker -> {
                if (habitTracker.getName() != null) {
                    existingHabitTracker.setName(habitTracker.getName());
                }
                if (habitTracker.getRepeatFrequency() != null) {
                    existingHabitTracker.setRepeatFrequency(habitTracker.getRepeatFrequency());
                }
                if (habitTracker.getStartDate() != null) {
                    existingHabitTracker.setStartDate(habitTracker.getStartDate());
                }
                if (habitTracker.getStreak() != null) {
                    existingHabitTracker.setStreak(habitTracker.getStreak());
                }

                return existingHabitTracker;
            })
            .map(habitTrackerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habitTracker.getId().toString())
        );
    }

    /**
     * {@code GET  /habit-trackers} : get all the habitTrackers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habitTrackers in body.
     */
    @GetMapping("")
    public List<HabitTracker> getAllHabitTrackers() {
        LOG.debug("REST request to get all HabitTrackers");
        return habitTrackerRepository.findAll();
    }

    /**
     * {@code GET  /habit-trackers/:id} : get the "id" habitTracker.
     *
     * @param id the id of the habitTracker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habitTracker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HabitTracker> getHabitTracker(@PathVariable("id") Long id) {
        LOG.debug("REST request to get HabitTracker : {}", id);
        Optional<HabitTracker> habitTracker = habitTrackerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(habitTracker);
    }

    /**
     * {@code DELETE  /habit-trackers/:id} : delete the "id" habitTracker.
     *
     * @param id the id of the habitTracker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitTracker(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete HabitTracker : {}", id);
        habitTrackerRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
