package bham.team.domain;

import static bham.team.domain.HabitTestSamples.*;
import static bham.team.domain.PomodoroSessionTestSamples.*;
import static bham.team.domain.ProductivityReportTestSamples.*;
import static bham.team.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProductivityReportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductivityReport.class);
        ProductivityReport productivityReport1 = getProductivityReportSample1();
        ProductivityReport productivityReport2 = new ProductivityReport();
        assertThat(productivityReport1).isNotEqualTo(productivityReport2);

        productivityReport2.setId(productivityReport1.getId());
        assertThat(productivityReport1).isEqualTo(productivityReport2);

        productivityReport2 = getProductivityReportSample2();
        assertThat(productivityReport1).isNotEqualTo(productivityReport2);
    }

    @Test
    void pomodoroSessionsTest() {
        ProductivityReport productivityReport = getProductivityReportRandomSampleGenerator();
        PomodoroSession pomodoroSessionBack = getPomodoroSessionRandomSampleGenerator();

        productivityReport.addPomodoroSessions(pomodoroSessionBack);
        assertThat(productivityReport.getPomodoroSessions()).containsOnly(pomodoroSessionBack);
        assertThat(pomodoroSessionBack.getProductivityReport()).isEqualTo(productivityReport);

        productivityReport.removePomodoroSessions(pomodoroSessionBack);
        assertThat(productivityReport.getPomodoroSessions()).doesNotContain(pomodoroSessionBack);
        assertThat(pomodoroSessionBack.getProductivityReport()).isNull();

        productivityReport.pomodoroSessions(new HashSet<>(Set.of(pomodoroSessionBack)));
        assertThat(productivityReport.getPomodoroSessions()).containsOnly(pomodoroSessionBack);
        assertThat(pomodoroSessionBack.getProductivityReport()).isEqualTo(productivityReport);

        productivityReport.setPomodoroSessions(new HashSet<>());
        assertThat(productivityReport.getPomodoroSessions()).doesNotContain(pomodoroSessionBack);
        assertThat(pomodoroSessionBack.getProductivityReport()).isNull();
    }

    @Test
    void completedTasksTest() {
        ProductivityReport productivityReport = getProductivityReportRandomSampleGenerator();
        Task taskBack = getTaskRandomSampleGenerator();

        productivityReport.addCompletedTasks(taskBack);
        assertThat(productivityReport.getCompletedTasks()).containsOnly(taskBack);

        productivityReport.removeCompletedTasks(taskBack);
        assertThat(productivityReport.getCompletedTasks()).doesNotContain(taskBack);

        productivityReport.completedTasks(new HashSet<>(Set.of(taskBack)));
        assertThat(productivityReport.getCompletedTasks()).containsOnly(taskBack);

        productivityReport.setCompletedTasks(new HashSet<>());
        assertThat(productivityReport.getCompletedTasks()).doesNotContain(taskBack);
    }

    @Test
    void completedHabitsTest() {
        ProductivityReport productivityReport = getProductivityReportRandomSampleGenerator();
        Habit habitBack = getHabitRandomSampleGenerator();

        productivityReport.addCompletedHabits(habitBack);
        assertThat(productivityReport.getCompletedHabits()).containsOnly(habitBack);

        productivityReport.removeCompletedHabits(habitBack);
        assertThat(productivityReport.getCompletedHabits()).doesNotContain(habitBack);

        productivityReport.completedHabits(new HashSet<>(Set.of(habitBack)));
        assertThat(productivityReport.getCompletedHabits()).containsOnly(habitBack);

        productivityReport.setCompletedHabits(new HashSet<>());
        assertThat(productivityReport.getCompletedHabits()).doesNotContain(habitBack);
    }
}
