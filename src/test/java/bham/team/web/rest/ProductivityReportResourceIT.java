package bham.team.web.rest;

import static bham.team.domain.ProductivityReportAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.ProductivityReport;
import bham.team.repository.ProductivityReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ProductivityReportResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductivityReportResourceIT {

    private static final Integer DEFAULT_TASKS_PLANNED = 1;
    private static final Integer UPDATED_TASKS_PLANNED = 2;

    private static final Integer DEFAULT_TASKS_COMPLETED = 1;
    private static final Integer UPDATED_TASKS_COMPLETED = 2;

    private static final Float DEFAULT_TASK_AVG_COMPLETION_TIME = 1F;
    private static final Float UPDATED_TASK_AVG_COMPLETION_TIME = 2F;

    private static final Float DEFAULT_TASK_EFFICIENCY = 1F;
    private static final Float UPDATED_TASK_EFFICIENCY = 2F;

    private static final Integer DEFAULT_POMODORO_SESSIONS = 1;
    private static final Integer UPDATED_POMODORO_SESSIONS = 2;

    private static final Integer DEFAULT_DISTRACTIONS_COUNT = 1;
    private static final Integer UPDATED_DISTRACTIONS_COUNT = 2;

    private static final Float DEFAULT_FOCUS_TIME = 1F;
    private static final Float UPDATED_FOCUS_TIME = 2F;

    private static final Float DEFAULT_FOCUS_SCORE = 1F;
    private static final Float UPDATED_FOCUS_SCORE = 2F;

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/productivity-reports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProductivityReportRepository productivityReportRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductivityReportMockMvc;

    private ProductivityReport productivityReport;

    private ProductivityReport insertedProductivityReport;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductivityReport createEntity() {
        return new ProductivityReport()
            .tasksPlanned(DEFAULT_TASKS_PLANNED)
            .tasksCompleted(DEFAULT_TASKS_COMPLETED)
            .taskAvgCompletionTime(DEFAULT_TASK_AVG_COMPLETION_TIME)
            .taskEfficiency(DEFAULT_TASK_EFFICIENCY)
            .pomodoroSessions(DEFAULT_POMODORO_SESSIONS)
            .distractionsCount(DEFAULT_DISTRACTIONS_COUNT)
            .focusTime(DEFAULT_FOCUS_TIME)
            .focusScore(DEFAULT_FOCUS_SCORE)
            .timestamp(DEFAULT_TIMESTAMP);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductivityReport createUpdatedEntity() {
        return new ProductivityReport()
            .tasksPlanned(UPDATED_TASKS_PLANNED)
            .tasksCompleted(UPDATED_TASKS_COMPLETED)
            .taskAvgCompletionTime(UPDATED_TASK_AVG_COMPLETION_TIME)
            .taskEfficiency(UPDATED_TASK_EFFICIENCY)
            .pomodoroSessions(UPDATED_POMODORO_SESSIONS)
            .distractionsCount(UPDATED_DISTRACTIONS_COUNT)
            .focusTime(UPDATED_FOCUS_TIME)
            .focusScore(UPDATED_FOCUS_SCORE)
            .timestamp(UPDATED_TIMESTAMP);
    }

    @BeforeEach
    public void initTest() {
        productivityReport = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProductivityReport != null) {
            productivityReportRepository.delete(insertedProductivityReport);
            insertedProductivityReport = null;
        }
    }

    @Test
    @Transactional
    void createProductivityReport() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ProductivityReport
        var returnedProductivityReport = om.readValue(
            restProductivityReportMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productivityReport)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ProductivityReport.class
        );

        // Validate the ProductivityReport in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProductivityReportUpdatableFieldsEquals(
            returnedProductivityReport,
            getPersistedProductivityReport(returnedProductivityReport)
        );

        insertedProductivityReport = returnedProductivityReport;
    }

    @Test
    @Transactional
    void createProductivityReportWithExistingId() throws Exception {
        // Create the ProductivityReport with an existing ID
        productivityReport.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductivityReportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productivityReport)))
            .andExpect(status().isBadRequest());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFocusScoreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productivityReport.setFocusScore(null);

        // Create the ProductivityReport, which fails.

        restProductivityReportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productivityReport)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTimestampIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        productivityReport.setTimestamp(null);

        // Create the ProductivityReport, which fails.

        restProductivityReportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productivityReport)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductivityReports() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        // Get all the productivityReportList
        restProductivityReportMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productivityReport.getId().intValue())))
            .andExpect(jsonPath("$.[*].tasksPlanned").value(hasItem(DEFAULT_TASKS_PLANNED)))
            .andExpect(jsonPath("$.[*].tasksCompleted").value(hasItem(DEFAULT_TASKS_COMPLETED)))
            .andExpect(jsonPath("$.[*].taskAvgCompletionTime").value(hasItem(DEFAULT_TASK_AVG_COMPLETION_TIME.doubleValue())))
            .andExpect(jsonPath("$.[*].taskEfficiency").value(hasItem(DEFAULT_TASK_EFFICIENCY.doubleValue())))
            .andExpect(jsonPath("$.[*].pomodoroSessions").value(hasItem(DEFAULT_POMODORO_SESSIONS)))
            .andExpect(jsonPath("$.[*].distractionsCount").value(hasItem(DEFAULT_DISTRACTIONS_COUNT)))
            .andExpect(jsonPath("$.[*].focusTime").value(hasItem(DEFAULT_FOCUS_TIME.doubleValue())))
            .andExpect(jsonPath("$.[*].focusScore").value(hasItem(DEFAULT_FOCUS_SCORE.doubleValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getProductivityReport() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        // Get the productivityReport
        restProductivityReportMockMvc
            .perform(get(ENTITY_API_URL_ID, productivityReport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productivityReport.getId().intValue()))
            .andExpect(jsonPath("$.tasksPlanned").value(DEFAULT_TASKS_PLANNED))
            .andExpect(jsonPath("$.tasksCompleted").value(DEFAULT_TASKS_COMPLETED))
            .andExpect(jsonPath("$.taskAvgCompletionTime").value(DEFAULT_TASK_AVG_COMPLETION_TIME.doubleValue()))
            .andExpect(jsonPath("$.taskEfficiency").value(DEFAULT_TASK_EFFICIENCY.doubleValue()))
            .andExpect(jsonPath("$.pomodoroSessions").value(DEFAULT_POMODORO_SESSIONS))
            .andExpect(jsonPath("$.distractionsCount").value(DEFAULT_DISTRACTIONS_COUNT))
            .andExpect(jsonPath("$.focusTime").value(DEFAULT_FOCUS_TIME.doubleValue()))
            .andExpect(jsonPath("$.focusScore").value(DEFAULT_FOCUS_SCORE.doubleValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProductivityReport() throws Exception {
        // Get the productivityReport
        restProductivityReportMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductivityReport() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productivityReport
        ProductivityReport updatedProductivityReport = productivityReportRepository.findById(productivityReport.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProductivityReport are not directly saved in db
        em.detach(updatedProductivityReport);
        updatedProductivityReport
            .tasksPlanned(UPDATED_TASKS_PLANNED)
            .tasksCompleted(UPDATED_TASKS_COMPLETED)
            .taskAvgCompletionTime(UPDATED_TASK_AVG_COMPLETION_TIME)
            .taskEfficiency(UPDATED_TASK_EFFICIENCY)
            .pomodoroSessions(UPDATED_POMODORO_SESSIONS)
            .distractionsCount(UPDATED_DISTRACTIONS_COUNT)
            .focusTime(UPDATED_FOCUS_TIME)
            .focusScore(UPDATED_FOCUS_SCORE)
            .timestamp(UPDATED_TIMESTAMP);

        restProductivityReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductivityReport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProductivityReport))
            )
            .andExpect(status().isOk());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProductivityReportToMatchAllProperties(updatedProductivityReport);
    }

    @Test
    @Transactional
    void putNonExistingProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productivityReport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productivityReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(productivityReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(productivityReport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductivityReportWithPatch() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productivityReport using partial update
        ProductivityReport partialUpdatedProductivityReport = new ProductivityReport();
        partialUpdatedProductivityReport.setId(productivityReport.getId());

        partialUpdatedProductivityReport
            .tasksPlanned(UPDATED_TASKS_PLANNED)
            .tasksCompleted(UPDATED_TASKS_COMPLETED)
            .pomodoroSessions(UPDATED_POMODORO_SESSIONS)
            .focusTime(UPDATED_FOCUS_TIME)
            .timestamp(UPDATED_TIMESTAMP);

        restProductivityReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductivityReport.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductivityReport))
            )
            .andExpect(status().isOk());

        // Validate the ProductivityReport in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductivityReportUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProductivityReport, productivityReport),
            getPersistedProductivityReport(productivityReport)
        );
    }

    @Test
    @Transactional
    void fullUpdateProductivityReportWithPatch() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the productivityReport using partial update
        ProductivityReport partialUpdatedProductivityReport = new ProductivityReport();
        partialUpdatedProductivityReport.setId(productivityReport.getId());

        partialUpdatedProductivityReport
            .tasksPlanned(UPDATED_TASKS_PLANNED)
            .tasksCompleted(UPDATED_TASKS_COMPLETED)
            .taskAvgCompletionTime(UPDATED_TASK_AVG_COMPLETION_TIME)
            .taskEfficiency(UPDATED_TASK_EFFICIENCY)
            .pomodoroSessions(UPDATED_POMODORO_SESSIONS)
            .distractionsCount(UPDATED_DISTRACTIONS_COUNT)
            .focusTime(UPDATED_FOCUS_TIME)
            .focusScore(UPDATED_FOCUS_SCORE)
            .timestamp(UPDATED_TIMESTAMP);

        restProductivityReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductivityReport.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProductivityReport))
            )
            .andExpect(status().isOk());

        // Validate the ProductivityReport in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProductivityReportUpdatableFieldsEquals(
            partialUpdatedProductivityReport,
            getPersistedProductivityReport(partialUpdatedProductivityReport)
        );
    }

    @Test
    @Transactional
    void patchNonExistingProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productivityReport.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productivityReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(productivityReport))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductivityReport() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        productivityReport.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductivityReportMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(productivityReport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductivityReport in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductivityReport() throws Exception {
        // Initialize the database
        insertedProductivityReport = productivityReportRepository.saveAndFlush(productivityReport);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the productivityReport
        restProductivityReportMockMvc
            .perform(delete(ENTITY_API_URL_ID, productivityReport.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return productivityReportRepository.count();
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

    protected ProductivityReport getPersistedProductivityReport(ProductivityReport productivityReport) {
        return productivityReportRepository.findById(productivityReport.getId()).orElseThrow();
    }

    protected void assertPersistedProductivityReportToMatchAllProperties(ProductivityReport expectedProductivityReport) {
        assertProductivityReportAllPropertiesEquals(expectedProductivityReport, getPersistedProductivityReport(expectedProductivityReport));
    }

    protected void assertPersistedProductivityReportToMatchUpdatableProperties(ProductivityReport expectedProductivityReport) {
        assertProductivityReportAllUpdatablePropertiesEquals(
            expectedProductivityReport,
            getPersistedProductivityReport(expectedProductivityReport)
        );
    }
}
