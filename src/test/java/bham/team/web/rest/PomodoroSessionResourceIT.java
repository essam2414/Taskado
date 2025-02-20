package bham.team.web.rest;

import static bham.team.domain.PomodoroSessionAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.PomodoroSession;
import bham.team.repository.PomodoroSessionRepository;
import bham.team.repository.UserRepository;
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
 * Integration tests for the {@link PomodoroSessionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PomodoroSessionResourceIT {

    private static final Instant DEFAULT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_STOP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_STOP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final Boolean DEFAULT_PAUSED = false;
    private static final Boolean UPDATED_PAUSED = true;

    private static final String ENTITY_API_URL = "/api/pomodoro-sessions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PomodoroSessionRepository pomodoroSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPomodoroSessionMockMvc;

    private PomodoroSession pomodoroSession;

    private PomodoroSession insertedPomodoroSession;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PomodoroSession createEntity() {
        return new PomodoroSession().start(DEFAULT_START).stop(DEFAULT_STOP).duration(DEFAULT_DURATION).paused(DEFAULT_PAUSED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PomodoroSession createUpdatedEntity() {
        return new PomodoroSession().start(UPDATED_START).stop(UPDATED_STOP).duration(UPDATED_DURATION).paused(UPDATED_PAUSED);
    }

    @BeforeEach
    public void initTest() {
        pomodoroSession = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPomodoroSession != null) {
            pomodoroSessionRepository.delete(insertedPomodoroSession);
            insertedPomodoroSession = null;
        }
    }

    @Test
    @Transactional
    void createPomodoroSession() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PomodoroSession
        var returnedPomodoroSession = om.readValue(
            restPomodoroSessionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pomodoroSession)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PomodoroSession.class
        );

        // Validate the PomodoroSession in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPomodoroSessionUpdatableFieldsEquals(returnedPomodoroSession, getPersistedPomodoroSession(returnedPomodoroSession));

        insertedPomodoroSession = returnedPomodoroSession;
    }

    @Test
    @Transactional
    void createPomodoroSessionWithExistingId() throws Exception {
        // Create the PomodoroSession with an existing ID
        pomodoroSession.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPomodoroSessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pomodoroSession)))
            .andExpect(status().isBadRequest());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pomodoroSession.setStart(null);

        // Create the PomodoroSession, which fails.

        restPomodoroSessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pomodoroSession)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPomodoroSessions() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        // Get all the pomodoroSessionList
        restPomodoroSessionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pomodoroSession.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].stop").value(hasItem(DEFAULT_STOP.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].paused").value(hasItem(DEFAULT_PAUSED.booleanValue())));
    }

    @Test
    @Transactional
    void getPomodoroSession() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        // Get the pomodoroSession
        restPomodoroSessionMockMvc
            .perform(get(ENTITY_API_URL_ID, pomodoroSession.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pomodoroSession.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.stop").value(DEFAULT_STOP.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.paused").value(DEFAULT_PAUSED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingPomodoroSession() throws Exception {
        // Get the pomodoroSession
        restPomodoroSessionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPomodoroSession() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pomodoroSession
        PomodoroSession updatedPomodoroSession = pomodoroSessionRepository.findById(pomodoroSession.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPomodoroSession are not directly saved in db
        em.detach(updatedPomodoroSession);
        updatedPomodoroSession.start(UPDATED_START).stop(UPDATED_STOP).duration(UPDATED_DURATION).paused(UPDATED_PAUSED);

        restPomodoroSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPomodoroSession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPomodoroSession))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPomodoroSessionToMatchAllProperties(updatedPomodoroSession);
    }

    @Test
    @Transactional
    void putNonExistingPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pomodoroSession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pomodoroSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pomodoroSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pomodoroSession)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePomodoroSessionWithPatch() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pomodoroSession using partial update
        PomodoroSession partialUpdatedPomodoroSession = new PomodoroSession();
        partialUpdatedPomodoroSession.setId(pomodoroSession.getId());

        partialUpdatedPomodoroSession.stop(UPDATED_STOP).duration(UPDATED_DURATION).paused(UPDATED_PAUSED);

        restPomodoroSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoroSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPomodoroSession))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroSession in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPomodoroSessionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPomodoroSession, pomodoroSession),
            getPersistedPomodoroSession(pomodoroSession)
        );
    }

    @Test
    @Transactional
    void fullUpdatePomodoroSessionWithPatch() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pomodoroSession using partial update
        PomodoroSession partialUpdatedPomodoroSession = new PomodoroSession();
        partialUpdatedPomodoroSession.setId(pomodoroSession.getId());

        partialUpdatedPomodoroSession.start(UPDATED_START).stop(UPDATED_STOP).duration(UPDATED_DURATION).paused(UPDATED_PAUSED);

        restPomodoroSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoroSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPomodoroSession))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroSession in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPomodoroSessionUpdatableFieldsEquals(
            partialUpdatedPomodoroSession,
            getPersistedPomodoroSession(partialUpdatedPomodoroSession)
        );
    }

    @Test
    @Transactional
    void patchNonExistingPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pomodoroSession.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pomodoroSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pomodoroSession))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPomodoroSession() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pomodoroSession.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroSessionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(pomodoroSession)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PomodoroSession in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePomodoroSession() throws Exception {
        // Initialize the database
        insertedPomodoroSession = pomodoroSessionRepository.saveAndFlush(pomodoroSession);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the pomodoroSession
        restPomodoroSessionMockMvc
            .perform(delete(ENTITY_API_URL_ID, pomodoroSession.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return pomodoroSessionRepository.count();
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

    protected PomodoroSession getPersistedPomodoroSession(PomodoroSession pomodoroSession) {
        return pomodoroSessionRepository.findById(pomodoroSession.getId()).orElseThrow();
    }

    protected void assertPersistedPomodoroSessionToMatchAllProperties(PomodoroSession expectedPomodoroSession) {
        assertPomodoroSessionAllPropertiesEquals(expectedPomodoroSession, getPersistedPomodoroSession(expectedPomodoroSession));
    }

    protected void assertPersistedPomodoroSessionToMatchUpdatableProperties(PomodoroSession expectedPomodoroSession) {
        assertPomodoroSessionAllUpdatablePropertiesEquals(expectedPomodoroSession, getPersistedPomodoroSession(expectedPomodoroSession));
    }
}
