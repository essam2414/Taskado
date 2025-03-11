package bham.team.web.rest;

import static bham.team.domain.ReminderAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.Reminder;
import bham.team.repository.ReminderRepository;
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
 * Integration tests for the {@link ReminderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReminderResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_REMINDER_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REMINDER_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_REPEAT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_REPEAT_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_REPEAT_INTERVAL = 1;
    private static final Integer UPDATED_REPEAT_INTERVAL = 2;

    private static final String DEFAULT_LINKED_ENTITY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_LINKED_ENTITY_TYPE = "BBBBBBBBBB";

    private static final Long DEFAULT_LINKED_ENTITY_ID = 1L;
    private static final Long UPDATED_LINKED_ENTITY_ID = 2L;

    private static final String ENTITY_API_URL = "/api/reminders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReminderMockMvc;

    private Reminder reminder;

    private Reminder insertedReminder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reminder createEntity() {
        return new Reminder()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .reminderDate(DEFAULT_REMINDER_DATE)
            .repeatType(DEFAULT_REPEAT_TYPE)
            .repeatInterval(DEFAULT_REPEAT_INTERVAL)
            .linkedEntityType(DEFAULT_LINKED_ENTITY_TYPE)
            .linkedEntityId(DEFAULT_LINKED_ENTITY_ID);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reminder createUpdatedEntity() {
        return new Reminder()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .reminderDate(UPDATED_REMINDER_DATE)
            .repeatType(UPDATED_REPEAT_TYPE)
            .repeatInterval(UPDATED_REPEAT_INTERVAL)
            .linkedEntityType(UPDATED_LINKED_ENTITY_TYPE)
            .linkedEntityId(UPDATED_LINKED_ENTITY_ID);
    }

    @BeforeEach
    public void initTest() {
        reminder = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedReminder != null) {
            reminderRepository.delete(insertedReminder);
            insertedReminder = null;
        }
    }

    @Test
    @Transactional
    void createReminder() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Reminder
        var returnedReminder = om.readValue(
            restReminderMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Reminder.class
        );

        // Validate the Reminder in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertReminderUpdatableFieldsEquals(returnedReminder, getPersistedReminder(returnedReminder));

        insertedReminder = returnedReminder;
    }

    @Test
    @Transactional
    void createReminderWithExistingId() throws Exception {
        // Create the Reminder with an existing ID
        reminder.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReminderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder)))
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reminder.setTitle(null);

        // Create the Reminder, which fails.

        restReminderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkReminderDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reminder.setReminderDate(null);

        // Create the Reminder, which fails.

        restReminderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReminders() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        // Get all the reminderList
        restReminderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reminder.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].reminderDate").value(hasItem(DEFAULT_REMINDER_DATE.toString())))
            .andExpect(jsonPath("$.[*].repeatType").value(hasItem(DEFAULT_REPEAT_TYPE)))
            .andExpect(jsonPath("$.[*].repeatInterval").value(hasItem(DEFAULT_REPEAT_INTERVAL)))
            .andExpect(jsonPath("$.[*].linkedEntityType").value(hasItem(DEFAULT_LINKED_ENTITY_TYPE)))
            .andExpect(jsonPath("$.[*].linkedEntityId").value(hasItem(DEFAULT_LINKED_ENTITY_ID.intValue())));
    }

    @Test
    @Transactional
    void getReminder() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        // Get the reminder
        restReminderMockMvc
            .perform(get(ENTITY_API_URL_ID, reminder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reminder.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.reminderDate").value(DEFAULT_REMINDER_DATE.toString()))
            .andExpect(jsonPath("$.repeatType").value(DEFAULT_REPEAT_TYPE))
            .andExpect(jsonPath("$.repeatInterval").value(DEFAULT_REPEAT_INTERVAL))
            .andExpect(jsonPath("$.linkedEntityType").value(DEFAULT_LINKED_ENTITY_TYPE))
            .andExpect(jsonPath("$.linkedEntityId").value(DEFAULT_LINKED_ENTITY_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingReminder() throws Exception {
        // Get the reminder
        restReminderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReminder() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reminder
        Reminder updatedReminder = reminderRepository.findById(reminder.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReminder are not directly saved in db
        em.detach(updatedReminder);
        updatedReminder
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .reminderDate(UPDATED_REMINDER_DATE)
            .repeatType(UPDATED_REPEAT_TYPE)
            .repeatInterval(UPDATED_REPEAT_INTERVAL)
            .linkedEntityType(UPDATED_LINKED_ENTITY_TYPE)
            .linkedEntityId(UPDATED_LINKED_ENTITY_ID);

        restReminderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReminder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedReminder))
            )
            .andExpect(status().isOk());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReminderToMatchAllProperties(updatedReminder);
    }

    @Test
    @Transactional
    void putNonExistingReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reminder.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reminder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reminder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReminderWithPatch() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reminder using partial update
        Reminder partialUpdatedReminder = new Reminder();
        partialUpdatedReminder.setId(reminder.getId());

        partialUpdatedReminder.description(UPDATED_DESCRIPTION).reminderDate(UPDATED_REMINDER_DATE).repeatInterval(UPDATED_REPEAT_INTERVAL);

        restReminderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReminder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReminder))
            )
            .andExpect(status().isOk());

        // Validate the Reminder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReminderUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedReminder, reminder), getPersistedReminder(reminder));
    }

    @Test
    @Transactional
    void fullUpdateReminderWithPatch() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reminder using partial update
        Reminder partialUpdatedReminder = new Reminder();
        partialUpdatedReminder.setId(reminder.getId());

        partialUpdatedReminder
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .reminderDate(UPDATED_REMINDER_DATE)
            .repeatType(UPDATED_REPEAT_TYPE)
            .repeatInterval(UPDATED_REPEAT_INTERVAL)
            .linkedEntityType(UPDATED_LINKED_ENTITY_TYPE)
            .linkedEntityId(UPDATED_LINKED_ENTITY_ID);

        restReminderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReminder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReminder))
            )
            .andExpect(status().isOk());

        // Validate the Reminder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReminderUpdatableFieldsEquals(partialUpdatedReminder, getPersistedReminder(partialUpdatedReminder));
    }

    @Test
    @Transactional
    void patchNonExistingReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reminder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reminder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reminder))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReminder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reminder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReminderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reminder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reminder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReminder() throws Exception {
        // Initialize the database
        insertedReminder = reminderRepository.saveAndFlush(reminder);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reminder
        restReminderMockMvc
            .perform(delete(ENTITY_API_URL_ID, reminder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reminderRepository.count();
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

    protected Reminder getPersistedReminder(Reminder reminder) {
        return reminderRepository.findById(reminder.getId()).orElseThrow();
    }

    protected void assertPersistedReminderToMatchAllProperties(Reminder expectedReminder) {
        assertReminderAllPropertiesEquals(expectedReminder, getPersistedReminder(expectedReminder));
    }

    protected void assertPersistedReminderToMatchUpdatableProperties(Reminder expectedReminder) {
        assertReminderAllUpdatablePropertiesEquals(expectedReminder, getPersistedReminder(expectedReminder));
    }
}
