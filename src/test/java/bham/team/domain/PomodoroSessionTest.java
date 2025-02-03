package bham.team.domain;

import static bham.team.domain.PomodoroSessionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PomodoroSessionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PomodoroSession.class);
        PomodoroSession pomodoroSession1 = getPomodoroSessionSample1();
        PomodoroSession pomodoroSession2 = new PomodoroSession();
        assertThat(pomodoroSession1).isNotEqualTo(pomodoroSession2);

        pomodoroSession2.setId(pomodoroSession1.getId());
        assertThat(pomodoroSession1).isEqualTo(pomodoroSession2);

        pomodoroSession2 = getPomodoroSessionSample2();
        assertThat(pomodoroSession1).isNotEqualTo(pomodoroSession2);
    }
}
