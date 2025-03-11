package bham.team.domain;

import static bham.team.domain.CategoryTestSamples.*;
import static bham.team.domain.HabitTestSamples.*;
import static bham.team.domain.ProductivityReportTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
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

    @Test
    void categoryTest() {
        Habit habit = getHabitRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        habit.setCategory(categoryBack);
        assertThat(habit.getCategory()).isEqualTo(categoryBack);

        habit.category(null);
        assertThat(habit.getCategory()).isNull();
    }

    @Test
    void productivityReportTest() {
        Habit habit = getHabitRandomSampleGenerator();
        ProductivityReport productivityReportBack = getProductivityReportRandomSampleGenerator();

        habit.addProductivityReport(productivityReportBack);
        assertThat(habit.getProductivityReports()).containsOnly(productivityReportBack);
        assertThat(productivityReportBack.getCompletedHabits()).containsOnly(habit);

        habit.removeProductivityReport(productivityReportBack);
        assertThat(habit.getProductivityReports()).doesNotContain(productivityReportBack);
        assertThat(productivityReportBack.getCompletedHabits()).doesNotContain(habit);

        habit.productivityReports(new HashSet<>(Set.of(productivityReportBack)));
        assertThat(habit.getProductivityReports()).containsOnly(productivityReportBack);
        assertThat(productivityReportBack.getCompletedHabits()).containsOnly(habit);

        habit.setProductivityReports(new HashSet<>());
        assertThat(habit.getProductivityReports()).doesNotContain(productivityReportBack);
        assertThat(productivityReportBack.getCompletedHabits()).doesNotContain(habit);
    }
}
