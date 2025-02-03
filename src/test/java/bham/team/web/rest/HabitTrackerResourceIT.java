package bham.team.web.rest;

import static bham.team.domain.HabitTrackerAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.HabitTracker;
import bham.team.repository.HabitTrackerRepository;
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
 * Integration tests for the {@link HabitTrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HabitTrackerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_REPEAT_FREQUENCY = "AAAAAAAAAA";
    private static final String UPDATED_REPEAT_FREQUENCY = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_STREAK = 1;
    private static final Integer UPDATED_STREAK = 2;

    private static final String ENTITY_API_URL = "/api/habit-trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private HabitTrackerRepository habitTrackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHabitTrackerMockMvc;

    private HabitTracker habitTracker;

    private HabitTracker insertedHabitTracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HabitTracker createEntity() {
        return new HabitTracker()
            .name(DEFAULT_NAME)
            .repeatFrequency(DEFAULT_REPEAT_FREQUENCY)
            .startDate(DEFAULT_START_DATE)
            .streak(DEFAULT_STREAK);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HabitTracker createUpdatedEntity() {
        return new HabitTracker()
            .name(UPDATED_NAME)
            .repeatFrequency(UPDATED_REPEAT_FREQUENCY)
            .startDate(UPDATED_START_DATE)
            .streak(UPDATED_STREAK);
    }

    @BeforeEach
    public void initTest() {
        habitTracker = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedHabitTracker != null) {
            habitTrackerRepository.delete(insertedHabitTracker);
            insertedHabitTracker = null;
        }
    }

    @Test
    @Transactional
    void createHabitTracker() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the HabitTracker
        var returnedHabitTracker = om.readValue(
            restHabitTrackerMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            HabitTracker.class
        );

        // Validate the HabitTracker in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertHabitTrackerUpdatableFieldsEquals(returnedHabitTracker, getPersistedHabitTracker(returnedHabitTracker));

        insertedHabitTracker = returnedHabitTracker;
    }

    @Test
    @Transactional
    void createHabitTrackerWithExistingId() throws Exception {
        // Create the HabitTracker with an existing ID
        habitTracker.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHabitTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isBadRequest());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        habitTracker.setName(null);

        // Create the HabitTracker, which fails.

        restHabitTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRepeatFrequencyIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        habitTracker.setRepeatFrequency(null);

        // Create the HabitTracker, which fails.

        restHabitTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        habitTracker.setStartDate(null);

        // Create the HabitTracker, which fails.

        restHabitTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHabitTrackers() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        // Get all the habitTrackerList
        restHabitTrackerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(habitTracker.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].repeatFrequency").value(hasItem(DEFAULT_REPEAT_FREQUENCY)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].streak").value(hasItem(DEFAULT_STREAK)));
    }

    @Test
    @Transactional
    void getHabitTracker() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        // Get the habitTracker
        restHabitTrackerMockMvc
            .perform(get(ENTITY_API_URL_ID, habitTracker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(habitTracker.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.repeatFrequency").value(DEFAULT_REPEAT_FREQUENCY))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.streak").value(DEFAULT_STREAK));
    }

    @Test
    @Transactional
    void getNonExistingHabitTracker() throws Exception {
        // Get the habitTracker
        restHabitTrackerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHabitTracker() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the habitTracker
        HabitTracker updatedHabitTracker = habitTrackerRepository.findById(habitTracker.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHabitTracker are not directly saved in db
        em.detach(updatedHabitTracker);
        updatedHabitTracker
            .name(UPDATED_NAME)
            .repeatFrequency(UPDATED_REPEAT_FREQUENCY)
            .startDate(UPDATED_START_DATE)
            .streak(UPDATED_STREAK);

        restHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHabitTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedHabitTrackerToMatchAllProperties(updatedHabitTracker);
    }

    @Test
    @Transactional
    void putNonExistingHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, habitTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(habitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(habitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHabitTrackerWithPatch() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the habitTracker using partial update
        HabitTracker partialUpdatedHabitTracker = new HabitTracker();
        partialUpdatedHabitTracker.setId(habitTracker.getId());

        partialUpdatedHabitTracker.name(UPDATED_NAME).streak(UPDATED_STREAK);

        restHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the HabitTracker in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHabitTrackerUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedHabitTracker, habitTracker),
            getPersistedHabitTracker(habitTracker)
        );
    }

    @Test
    @Transactional
    void fullUpdateHabitTrackerWithPatch() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the habitTracker using partial update
        HabitTracker partialUpdatedHabitTracker = new HabitTracker();
        partialUpdatedHabitTracker.setId(habitTracker.getId());

        partialUpdatedHabitTracker
            .name(UPDATED_NAME)
            .repeatFrequency(UPDATED_REPEAT_FREQUENCY)
            .startDate(UPDATED_START_DATE)
            .streak(UPDATED_STREAK);

        restHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHabitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHabitTracker))
            )
            .andExpect(status().isOk());

        // Validate the HabitTracker in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHabitTrackerUpdatableFieldsEquals(partialUpdatedHabitTracker, getPersistedHabitTracker(partialUpdatedHabitTracker));
    }

    @Test
    @Transactional
    void patchNonExistingHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, habitTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(habitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(habitTracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHabitTracker() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        habitTracker.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHabitTrackerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(habitTracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HabitTracker in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHabitTracker() throws Exception {
        // Initialize the database
        insertedHabitTracker = habitTrackerRepository.saveAndFlush(habitTracker);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the habitTracker
        restHabitTrackerMockMvc
            .perform(delete(ENTITY_API_URL_ID, habitTracker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return habitTrackerRepository.count();
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

    protected HabitTracker getPersistedHabitTracker(HabitTracker habitTracker) {
        return habitTrackerRepository.findById(habitTracker.getId()).orElseThrow();
    }

    protected void assertPersistedHabitTrackerToMatchAllProperties(HabitTracker expectedHabitTracker) {
        assertHabitTrackerAllPropertiesEquals(expectedHabitTracker, getPersistedHabitTracker(expectedHabitTracker));
    }

    protected void assertPersistedHabitTrackerToMatchUpdatableProperties(HabitTracker expectedHabitTracker) {
        assertHabitTrackerAllUpdatablePropertiesEquals(expectedHabitTracker, getPersistedHabitTracker(expectedHabitTracker));
    }
}
