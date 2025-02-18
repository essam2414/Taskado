package bham.team.web.rest;

import static bham.team.domain.TaskCategoryAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.TaskCategory;
import bham.team.repository.TaskCategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TaskCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TaskCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/task-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TaskCategoryRepository taskCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaskCategoryMockMvc;

    private TaskCategory taskCategory;

    private TaskCategory insertedTaskCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaskCategory createEntity() {
        return new TaskCategory().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaskCategory createUpdatedEntity() {
        return new TaskCategory().name(UPDATED_NAME);
    }

    @BeforeEach
    public void initTest() {
        taskCategory = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTaskCategory != null) {
            taskCategoryRepository.delete(insertedTaskCategory);
            insertedTaskCategory = null;
        }
    }

    @Test
    @Transactional
    void createTaskCategory() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TaskCategory
        var returnedTaskCategory = om.readValue(
            restTaskCategoryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskCategory)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TaskCategory.class
        );

        // Validate the TaskCategory in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTaskCategoryUpdatableFieldsEquals(returnedTaskCategory, getPersistedTaskCategory(returnedTaskCategory));

        insertedTaskCategory = returnedTaskCategory;
    }

    @Test
    @Transactional
    void createTaskCategoryWithExistingId() throws Exception {
        // Create the TaskCategory with an existing ID
        taskCategory.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskCategory)))
            .andExpect(status().isBadRequest());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        taskCategory.setName(null);

        // Create the TaskCategory, which fails.

        restTaskCategoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskCategory)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTaskCategories() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        // Get all the taskCategoryList
        restTaskCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getTaskCategory() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        // Get the taskCategory
        restTaskCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, taskCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(taskCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTaskCategory() throws Exception {
        // Get the taskCategory
        restTaskCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTaskCategory() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskCategory
        TaskCategory updatedTaskCategory = taskCategoryRepository.findById(taskCategory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTaskCategory are not directly saved in db
        em.detach(updatedTaskCategory);
        updatedTaskCategory.name(UPDATED_NAME);

        restTaskCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTaskCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTaskCategory))
            )
            .andExpect(status().isOk());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTaskCategoryToMatchAllProperties(updatedTaskCategory);
    }

    @Test
    @Transactional
    void putNonExistingTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, taskCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(taskCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(taskCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(taskCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTaskCategoryWithPatch() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskCategory using partial update
        TaskCategory partialUpdatedTaskCategory = new TaskCategory();
        partialUpdatedTaskCategory.setId(taskCategory.getId());

        partialUpdatedTaskCategory.name(UPDATED_NAME);

        restTaskCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaskCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTaskCategory))
            )
            .andExpect(status().isOk());

        // Validate the TaskCategory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTaskCategoryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTaskCategory, taskCategory),
            getPersistedTaskCategory(taskCategory)
        );
    }

    @Test
    @Transactional
    void fullUpdateTaskCategoryWithPatch() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the taskCategory using partial update
        TaskCategory partialUpdatedTaskCategory = new TaskCategory();
        partialUpdatedTaskCategory.setId(taskCategory.getId());

        partialUpdatedTaskCategory.name(UPDATED_NAME);

        restTaskCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTaskCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTaskCategory))
            )
            .andExpect(status().isOk());

        // Validate the TaskCategory in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTaskCategoryUpdatableFieldsEquals(partialUpdatedTaskCategory, getPersistedTaskCategory(partialUpdatedTaskCategory));
    }

    @Test
    @Transactional
    void patchNonExistingTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, taskCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(taskCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(taskCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTaskCategory() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        taskCategory.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskCategoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(taskCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TaskCategory in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTaskCategory() throws Exception {
        // Initialize the database
        insertedTaskCategory = taskCategoryRepository.saveAndFlush(taskCategory);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the taskCategory
        restTaskCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, taskCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return taskCategoryRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected TaskCategory getPersistedTaskCategory(TaskCategory taskCategory) {
        return taskCategoryRepository.findById(taskCategory.getId()).orElseThrow();
    }

    protected void assertPersistedTaskCategoryToMatchAllProperties(TaskCategory expectedTaskCategory) {
        assertTaskCategoryAllPropertiesEquals(expectedTaskCategory, getPersistedTaskCategory(expectedTaskCategory));
    }

    protected void assertPersistedTaskCategoryToMatchUpdatableProperties(TaskCategory expectedTaskCategory) {
        assertTaskCategoryAllUpdatablePropertiesEquals(expectedTaskCategory, getPersistedTaskCategory(expectedTaskCategory));
    }
}
