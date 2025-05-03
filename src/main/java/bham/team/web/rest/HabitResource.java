package bham.team.web.rest;

import bham.team.domain.Habit;
import bham.team.domain.User;
import bham.team.repository.HabitRepository;
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
 * REST controller for managing {@link bham.team.domain.Habit}.
 */
@RestController
@RequestMapping("/api/habits")
@Transactional
public class HabitResource {

    private static final Logger LOG = LoggerFactory.getLogger(HabitResource.class);

    private static final String ENTITY_NAME = "habit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitRepository habitRepository;

    private final UserRepository userRepository;

    public HabitResource(HabitRepository habitRepository, UserRepository userRepository) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /habits} : Create a new habit.
     *
     * @param habit the habit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habit, or with status {@code 400 (Bad Request)} if the habit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Habit> createHabit(@Valid @RequestBody Habit habit) throws URISyntaxException {
        LOG.debug("REST request to save Habit : {}", habit);
        if (habit.getId() != null) {
            throw new BadRequestAlertException("A new habit cannot already have an ID", ENTITY_NAME, "idexists");
        }

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();
        habit.setUser(user);

        habit = habitRepository.save(habit);
        return ResponseEntity.created(new URI("/api/habits/" + habit.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, habit.getId().toString()))
            .body(habit);
    }

    /**
     * {@code PUT  /habits/:id} : Updates an existing habit.
     *
     * @param id the id of the habit to save.
     * @param habit the habit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habit,
     * or with status {@code 400 (Bad Request)} if the habit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Habit habit)
        throws URISyntaxException {
        LOG.debug("REST request to update Habit : {}, {}", id, habit);
        if (habit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Habit existingHabit = habitRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (existingHabit.getUser() == null || !existingHabit.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this habit", ENTITY_NAME, "unauthorized");
        }

        habit = habitRepository.save(habit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habit.getId().toString()))
            .body(habit);
    }

    /**
     * {@code PATCH  /habits/:id} : Partial updates given fields of an existing habit, field will ignore if it is null
     *
     * @param id the id of the habit to save.
     * @param habit the habit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habit,
     * or with status {@code 400 (Bad Request)} if the habit is not valid,
     * or with status {@code 404 (Not Found)} if the habit is not found,
     * or with status {@code 500 (Internal Server Error)} if the habit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Habit> partialUpdateHabit(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Habit habit
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Habit partially : {}, {}", id, habit);
        if (habit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Habit existingHabit = habitRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingHabit.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to update this habit", ENTITY_NAME, "unauthorized");
        }

        Optional<Habit> result = habitRepository
            .findById(habit.getId())
            .map(habitToUpdate -> {
                if (habit.getName() != null) {
                    habitToUpdate.setName(habit.getName());
                }
                if (habit.getStartDate() != null) {
                    habitToUpdate.setStartDate(habit.getStartDate());
                }
                if (habit.getStreak() != null) {
                    habitToUpdate.setStreak(habit.getStreak());
                }
                if (habit.getCompletionRate() != null) {
                    habitToUpdate.setCompletionRate(habit.getCompletionRate());
                }
                if (habit.getRepeatType() != null) {
                    habitToUpdate.setRepeatType(habit.getRepeatType());
                }
                if (habit.getRepeatInterval() != null) {
                    habitToUpdate.setRepeatInterval(habit.getRepeatInterval());
                }
                if (habit.getRepeatDays() != null) {
                    habitToUpdate.setRepeatDays(habit.getRepeatDays());
                }
                if (habit.getRepeatTimes() != null) {
                    habitToUpdate.setRepeatTimes(habit.getRepeatTimes());
                }
                if (habit.getCompletedDates() != null) {
                    habitToUpdate.setCompletedDates(habit.getCompletedDates());
                }

                return habitToUpdate;
            })
            .map(habitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, habit.getId().toString())
        );
    }

    /**
     * {@code GET  /habits} : get all the habits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habits in body.
     */
    @GetMapping("")
    public List<Habit> getAllHabits() {
        LOG.debug("REST request to get all Habits");
        return habitRepository.findByUserIsCurrentUser();
    }

    /**
     * {@code GET  /habits/:id} : get the "id" habit.
     *
     * @param id the id of the habit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabit(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Habit : {}", id);
        Optional<Habit> habit = habitRepository
            .findById(id)
            .filter(h -> h.getUser() != null && h.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse("")));
        return ResponseUtil.wrapOrNotFound(habit);
    }

    /**
     * {@code DELETE  /habits/:id} : delete the "id" habit.
     *
     * @param id the id of the habit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Habit : {}", id);

        Habit existingHabit = habitRepository.findById(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!existingHabit.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to delete this habit", ENTITY_NAME, "unauthorized");
        }
        habitRepository.delete(existingHabit);

        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
