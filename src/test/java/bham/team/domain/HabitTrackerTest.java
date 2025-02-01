package bham.team.domain;

import static bham.team.domain.HabitTrackerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HabitTrackerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HabitTracker.class);
        HabitTracker habitTracker1 = getHabitTrackerSample1();
        HabitTracker habitTracker2 = new HabitTracker();
        assertThat(habitTracker1).isNotEqualTo(habitTracker2);

        habitTracker2.setId(habitTracker1.getId());
        assertThat(habitTracker1).isEqualTo(habitTracker2);

        habitTracker2 = getHabitTrackerSample2();
        assertThat(habitTracker1).isNotEqualTo(habitTracker2);
    }
}
