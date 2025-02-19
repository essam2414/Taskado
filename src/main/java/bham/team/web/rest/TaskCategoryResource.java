package bham.team.web.rest;

import bham.team.domain.TaskCategory;
import bham.team.repository.TaskCategoryRepository;
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
 * REST controller for managing {@link bham.team.domain.TaskCategory}.
 */
@RestController
@RequestMapping("/api/task-categories")
@Transactional
public class TaskCategoryResource {

    private static final Logger LOG = LoggerFactory.getLogger(TaskCategoryResource.class);

    private static final String ENTITY_NAME = "taskCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TaskCategoryRepository taskCategoryRepository;

    public TaskCategoryResource(TaskCategoryRepository taskCategoryRepository) {
        this.taskCategoryRepository = taskCategoryRepository;
    }

    /**
     * {@code POST  /task-categories} : Create a new taskCategory.
     *
     * @param taskCategory the taskCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new taskCategory, or with status {@code 400 (Bad Request)} if the taskCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TaskCategory> createTaskCategory(@Valid @RequestBody TaskCategory taskCategory) throws URISyntaxException {
        LOG.debug("REST request to save TaskCategory : {}", taskCategory);
        if (taskCategory.getId() != null) {
            throw new BadRequestAlertException("A new taskCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        taskCategory = taskCategoryRepository.save(taskCategory);
        return ResponseEntity.created(new URI("/api/task-categories/" + taskCategory.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, taskCategory.getId().toString()))
            .body(taskCategory);
    }

    /**
     * {@code PUT  /task-categories/:id} : Updates an existing taskCategory.
     *
     * @param id the id of the taskCategory to save.
     * @param taskCategory the taskCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated taskCategory,
     * or with status {@code 400 (Bad Request)} if the taskCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the taskCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskCategory> updateTaskCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TaskCategory taskCategory
    ) throws URISyntaxException {
        LOG.debug("REST request to update TaskCategory : {}, {}", id, taskCategory);
        if (taskCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, taskCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!taskCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        taskCategory = taskCategoryRepository.save(taskCategory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, taskCategory.getId().toString()))
            .body(taskCategory);
    }

    /**
     * {@code PATCH  /task-categories/:id} : Partial updates given fields of an existing taskCategory, field will ignore if it is null
     *
     * @param id the id of the taskCategory to save.
     * @param taskCategory the taskCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated taskCategory,
     * or with status {@code 400 (Bad Request)} if the taskCategory is not valid,
     * or with status {@code 404 (Not Found)} if the taskCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the taskCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TaskCategory> partialUpdateTaskCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TaskCategory taskCategory
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TaskCategory partially : {}, {}", id, taskCategory);
        if (taskCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, taskCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!taskCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TaskCategory> result = taskCategoryRepository
            .findById(taskCategory.getId())
            .map(existingTaskCategory -> {
                if (taskCategory.getName() != null) {
                    existingTaskCategory.setName(taskCategory.getName());
                }
                if (taskCategory.getColor() != null) {
                    existingTaskCategory.setColor(taskCategory.getColor());
                }

                return existingTaskCategory;
            })
            .map(taskCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, taskCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /task-categories} : get all the taskCategories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of taskCategories in body.
     */
    @GetMapping("")
    public List<TaskCategory> getAllTaskCategories() {
        LOG.debug("REST request to get all TaskCategories");
        return taskCategoryRepository.findAll();
    }

    /**
     * {@code GET  /task-categories/:id} : get the "id" taskCategory.
     *
     * @param id the id of the taskCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the taskCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskCategory> getTaskCategory(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TaskCategory : {}", id);
        Optional<TaskCategory> taskCategory = taskCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(taskCategory);
    }

    /**
     * {@code DELETE  /task-categories/:id} : delete the "id" taskCategory.
     *
     * @param id the id of the taskCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskCategory(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TaskCategory : {}", id);
        taskCategoryRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
