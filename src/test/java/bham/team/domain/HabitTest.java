package bham.team.domain;

import static bham.team.domain.HabitTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HabitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Habit.class);
        Habit habit1 = getHabitSample1();
        Habit habit2 = new Habit();
        assertThat(habit1).isNotEqualTo(habit2);

        habit2.setId(habit1.getId());
        assertThat(habit1).isEqualTo(habit2);

        habit2 = getHabitSample2();
        assertThat(habit1).isNotEqualTo(habit2);
    }
}
