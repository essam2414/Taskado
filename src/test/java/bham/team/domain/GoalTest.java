package bham.team.domain;

import static bham.team.domain.GoalTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GoalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Goal.class);
        Goal goal1 = getGoalSample1();
        Goal goal2 = new Goal();
        assertThat(goal1).isNotEqualTo(goal2);

        goal2.setId(goal1.getId());
        assertThat(goal1).isEqualTo(goal2);

        goal2 = getGoalSample2();
        assertThat(goal1).isNotEqualTo(goal2);
    }
}
