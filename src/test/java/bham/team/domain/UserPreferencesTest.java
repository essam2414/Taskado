package bham.team.domain;

import static bham.team.domain.UserPreferencesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserPreferencesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserPreferences.class);
        UserPreferences userPreferences1 = getUserPreferencesSample1();
        UserPreferences userPreferences2 = new UserPreferences();
        assertThat(userPreferences1).isNotEqualTo(userPreferences2);

        userPreferences2.setId(userPreferences1.getId());
        assertThat(userPreferences1).isEqualTo(userPreferences2);

        userPreferences2 = getUserPreferencesSample2();
        assertThat(userPreferences1).isNotEqualTo(userPreferences2);
    }
}
