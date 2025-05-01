package bham.team.web.rest;

import static bham.team.domain.UserPreferencesAsserts.*;
import static bham.team.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import bham.team.IntegrationTest;
import bham.team.domain.User;
import bham.team.domain.UserPreferences;
import bham.team.repository.UserPreferencesRepository;
import bham.team.repository.UserRepository;
import bham.team.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserPreferencesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserPreferencesResourceIT {

    private static final Boolean DEFAULT_DARK_MODE = false;
    private static final Boolean UPDATED_DARK_MODE = true;

    private static final String DEFAULT_SIDEBAR_COLOR_LIGHT = "AAAAAAAAAA";
    private static final String UPDATED_SIDEBAR_COLOR_LIGHT = "BBBBBBBBBB";

    private static final String DEFAULT_SIDEBAR_COLOR_DARK = "AAAAAAAAAA";
    private static final String UPDATED_SIDEBAR_COLOR_DARK = "BBBBBBBBBB";

    private static final String DEFAULT_ACCENT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_ACCENT_COLOR = "BBBBBBBBBB";

    private static final Integer DEFAULT_FONT_SIZE_LEVEL = 1;
    private static final Integer UPDATED_FONT_SIZE_LEVEL = 2;

    private static final Boolean DEFAULT_DYSLEXIA_MODE = false;
    private static final Boolean UPDATED_DYSLEXIA_MODE = true;

    private static final Boolean DEFAULT_HIGH_CONTRAST = false;
    private static final Boolean UPDATED_HIGH_CONTRAST = true;

    private static final Boolean DEFAULT_REDUCE_MOTION = false;
    private static final Boolean UPDATED_REDUCE_MOTION = true;

    private static final String DEFAULT_DASHBOARD_WIDGETS_JSON = "AAAAAAAAAA";
    private static final String UPDATED_DASHBOARD_WIDGETS_JSON = "BBBBBBBBBB";

    private static final String DEFAULT_DASHBOARD_THEME = "AAAAAAAAAA";
    private static final String UPDATED_DASHBOARD_THEME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-preferences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private UserPreferencesRepository userPreferencesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPreferencesMockMvc;

    private UserPreferences userPreferences;

    private UserPreferences insertedUserPreferences;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPreferences createEntity(EntityManager em) {
        UserPreferences userPreferences = new UserPreferences()
            .darkMode(DEFAULT_DARK_MODE)
            .sidebarColorLight(DEFAULT_SIDEBAR_COLOR_LIGHT)
            .sidebarColorDark(DEFAULT_SIDEBAR_COLOR_DARK)
            .accentColor(DEFAULT_ACCENT_COLOR)
            .fontSizeLevel(DEFAULT_FONT_SIZE_LEVEL)
            .dyslexiaMode(DEFAULT_DYSLEXIA_MODE)
            .highContrast(DEFAULT_HIGH_CONTRAST)
            .reduceMotion(DEFAULT_REDUCE_MOTION)
            .dashboardWidgetsJson(DEFAULT_DASHBOARD_WIDGETS_JSON)
            .dashboardTheme(DEFAULT_DASHBOARD_THEME);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        userPreferences.setUser(user);
        return userPreferences;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPreferences createUpdatedEntity(EntityManager em) {
        UserPreferences updatedUserPreferences = new UserPreferences()
            .darkMode(UPDATED_DARK_MODE)
            .sidebarColorLight(UPDATED_SIDEBAR_COLOR_LIGHT)
            .sidebarColorDark(UPDATED_SIDEBAR_COLOR_DARK)
            .accentColor(UPDATED_ACCENT_COLOR)
            .fontSizeLevel(UPDATED_FONT_SIZE_LEVEL)
            .dyslexiaMode(UPDATED_DYSLEXIA_MODE)
            .highContrast(UPDATED_HIGH_CONTRAST)
            .reduceMotion(UPDATED_REDUCE_MOTION)
            .dashboardWidgetsJson(UPDATED_DASHBOARD_WIDGETS_JSON)
            .dashboardTheme(UPDATED_DASHBOARD_THEME);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        updatedUserPreferences.setUser(user);
        return updatedUserPreferences;
    }

    @BeforeEach
    public void initTest() {
        userPreferences = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedUserPreferences != null) {
            userPreferencesRepository.delete(insertedUserPreferences);
            insertedUserPreferences = null;
        }
    }

    @Test
    @Transactional
    void createUserPreferences() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UserPreferences
        var returnedUserPreferences = om.readValue(
            restUserPreferencesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreferences)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UserPreferences.class
        );

        // Validate the UserPreferences in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertUserPreferencesUpdatableFieldsEquals(returnedUserPreferences, getPersistedUserPreferences(returnedUserPreferences));

        assertUserPreferencesMapsIdRelationshipPersistedValue(userPreferences, returnedUserPreferences);

        insertedUserPreferences = returnedUserPreferences;
    }

    @Test
    @Transactional
    void createUserPreferencesWithExistingId() throws Exception {
        // Create the UserPreferences with an existing ID
        userPreferences.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPreferencesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreferences)))
            .andExpect(status().isBadRequest());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void updateUserPreferencesMapsIdAssociationWithNewId() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Add a new parent entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();

        // Load the userPreferences
        UserPreferences updatedUserPreferences = userPreferencesRepository.findById(userPreferences.getId()).orElseThrow();
        assertThat(updatedUserPreferences).isNotNull();
        // Disconnect from session so that the updates on updatedUserPreferences are not directly saved in db
        em.detach(updatedUserPreferences);

        // Update the User with new association value
        updatedUserPreferences.setUser(user);

        // Update the entity
        restUserPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPreferences.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedUserPreferences))
            )
            .andExpect(status().isOk());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        /**
         * Validate the id for MapsId, the ids must be same
         * Uncomment the following line for assertion. However, please note that there is a known issue and uncommenting will fail the test.
         * Please look at https://github.com/jhipster/generator-jhipster/issues/9100. You can modify this test as necessary.
         * assertThat(testUserPreferences.getId()).isEqualTo(testUserPreferences.getUser().getId());
         */
    }

    @Test
    @Transactional
    void getAllUserPreferences() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        // Get all the userPreferencesList
        restUserPreferencesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPreferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].darkMode").value(hasItem(DEFAULT_DARK_MODE.booleanValue())))
            .andExpect(jsonPath("$.[*].sidebarColorLight").value(hasItem(DEFAULT_SIDEBAR_COLOR_LIGHT)))
            .andExpect(jsonPath("$.[*].sidebarColorDark").value(hasItem(DEFAULT_SIDEBAR_COLOR_DARK)))
            .andExpect(jsonPath("$.[*].accentColor").value(hasItem(DEFAULT_ACCENT_COLOR)))
            .andExpect(jsonPath("$.[*].fontSizeLevel").value(hasItem(DEFAULT_FONT_SIZE_LEVEL)))
            .andExpect(jsonPath("$.[*].dyslexiaMode").value(hasItem(DEFAULT_DYSLEXIA_MODE.booleanValue())))
            .andExpect(jsonPath("$.[*].highContrast").value(hasItem(DEFAULT_HIGH_CONTRAST.booleanValue())))
            .andExpect(jsonPath("$.[*].reduceMotion").value(hasItem(DEFAULT_REDUCE_MOTION.booleanValue())))
            .andExpect(jsonPath("$.[*].dashboardWidgetsJson").value(hasItem(DEFAULT_DASHBOARD_WIDGETS_JSON.toString())))
            .andExpect(jsonPath("$.[*].dashboardTheme").value(hasItem(DEFAULT_DASHBOARD_THEME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserPreferencesWithEagerRelationshipsIsEnabled() throws Exception {
        when(userPreferencesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserPreferencesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userPreferencesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserPreferencesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userPreferencesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserPreferencesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userPreferencesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserPreferences() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        // Get the userPreferences
        restUserPreferencesMockMvc
            .perform(get(ENTITY_API_URL_ID, userPreferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPreferences.getId().intValue()))
            .andExpect(jsonPath("$.darkMode").value(DEFAULT_DARK_MODE.booleanValue()))
            .andExpect(jsonPath("$.sidebarColorLight").value(DEFAULT_SIDEBAR_COLOR_LIGHT))
            .andExpect(jsonPath("$.sidebarColorDark").value(DEFAULT_SIDEBAR_COLOR_DARK))
            .andExpect(jsonPath("$.accentColor").value(DEFAULT_ACCENT_COLOR))
            .andExpect(jsonPath("$.fontSizeLevel").value(DEFAULT_FONT_SIZE_LEVEL))
            .andExpect(jsonPath("$.dyslexiaMode").value(DEFAULT_DYSLEXIA_MODE.booleanValue()))
            .andExpect(jsonPath("$.highContrast").value(DEFAULT_HIGH_CONTRAST.booleanValue()))
            .andExpect(jsonPath("$.reduceMotion").value(DEFAULT_REDUCE_MOTION.booleanValue()))
            .andExpect(jsonPath("$.dashboardWidgetsJson").value(DEFAULT_DASHBOARD_WIDGETS_JSON.toString()))
            .andExpect(jsonPath("$.dashboardTheme").value(DEFAULT_DASHBOARD_THEME));
    }

    @Test
    @Transactional
    void getNonExistingUserPreferences() throws Exception {
        // Get the userPreferences
        restUserPreferencesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserPreferences() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreferences
        UserPreferences updatedUserPreferences = userPreferencesRepository.findById(userPreferences.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUserPreferences are not directly saved in db
        em.detach(updatedUserPreferences);
        updatedUserPreferences
            .darkMode(UPDATED_DARK_MODE)
            .sidebarColorLight(UPDATED_SIDEBAR_COLOR_LIGHT)
            .sidebarColorDark(UPDATED_SIDEBAR_COLOR_DARK)
            .accentColor(UPDATED_ACCENT_COLOR)
            .fontSizeLevel(UPDATED_FONT_SIZE_LEVEL)
            .dyslexiaMode(UPDATED_DYSLEXIA_MODE)
            .highContrast(UPDATED_HIGH_CONTRAST)
            .reduceMotion(UPDATED_REDUCE_MOTION)
            .dashboardWidgetsJson(UPDATED_DASHBOARD_WIDGETS_JSON)
            .dashboardTheme(UPDATED_DASHBOARD_THEME);

        restUserPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPreferences.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedUserPreferences))
            )
            .andExpect(status().isOk());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUserPreferencesToMatchAllProperties(updatedUserPreferences);
    }

    @Test
    @Transactional
    void putNonExistingUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPreferences.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userPreferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userPreferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userPreferences)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPreferencesWithPatch() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreferences using partial update
        UserPreferences partialUpdatedUserPreferences = new UserPreferences();
        partialUpdatedUserPreferences.setId(userPreferences.getId());

        partialUpdatedUserPreferences
            .accentColor(UPDATED_ACCENT_COLOR)
            .fontSizeLevel(UPDATED_FONT_SIZE_LEVEL)
            .highContrast(UPDATED_HIGH_CONTRAST)
            .reduceMotion(UPDATED_REDUCE_MOTION)
            .dashboardWidgetsJson(UPDATED_DASHBOARD_WIDGETS_JSON);

        restUserPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPreferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserPreferences))
            )
            .andExpect(status().isOk());

        // Validate the UserPreferences in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserPreferencesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUserPreferences, userPreferences),
            getPersistedUserPreferences(userPreferences)
        );
    }

    @Test
    @Transactional
    void fullUpdateUserPreferencesWithPatch() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userPreferences using partial update
        UserPreferences partialUpdatedUserPreferences = new UserPreferences();
        partialUpdatedUserPreferences.setId(userPreferences.getId());

        partialUpdatedUserPreferences
            .darkMode(UPDATED_DARK_MODE)
            .sidebarColorLight(UPDATED_SIDEBAR_COLOR_LIGHT)
            .sidebarColorDark(UPDATED_SIDEBAR_COLOR_DARK)
            .accentColor(UPDATED_ACCENT_COLOR)
            .fontSizeLevel(UPDATED_FONT_SIZE_LEVEL)
            .dyslexiaMode(UPDATED_DYSLEXIA_MODE)
            .highContrast(UPDATED_HIGH_CONTRAST)
            .reduceMotion(UPDATED_REDUCE_MOTION)
            .dashboardWidgetsJson(UPDATED_DASHBOARD_WIDGETS_JSON)
            .dashboardTheme(UPDATED_DASHBOARD_THEME);

        restUserPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPreferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserPreferences))
            )
            .andExpect(status().isOk());

        // Validate the UserPreferences in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserPreferencesUpdatableFieldsEquals(
            partialUpdatedUserPreferences,
            getPersistedUserPreferences(partialUpdatedUserPreferences)
        );
    }

    @Test
    @Transactional
    void patchNonExistingUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPreferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userPreferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userPreferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userPreferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPreferencesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(userPreferences)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPreferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPreferences() throws Exception {
        // Initialize the database
        insertedUserPreferences = userPreferencesRepository.saveAndFlush(userPreferences);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the userPreferences
        restUserPreferencesMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPreferences.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return userPreferencesRepository.count();
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

    protected UserPreferences getPersistedUserPreferences(UserPreferences userPreferences) {
        return userPreferencesRepository.findById(userPreferences.getId()).orElseThrow();
    }

    protected void assertPersistedUserPreferencesToMatchAllProperties(UserPreferences expectedUserPreferences) {
        assertUserPreferencesAllPropertiesEquals(expectedUserPreferences, getPersistedUserPreferences(expectedUserPreferences));
    }

    protected void assertPersistedUserPreferencesToMatchUpdatableProperties(UserPreferences expectedUserPreferences) {
        assertUserPreferencesAllUpdatablePropertiesEquals(expectedUserPreferences, getPersistedUserPreferences(expectedUserPreferences));
    }
}
