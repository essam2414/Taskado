package bham.team.domain;

import static bham.team.domain.CategoryTestSamples.*;
import static bham.team.domain.ProductivityReportTestSamples.*;
import static bham.team.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Task.class);
        Task task1 = getTaskSample1();
        Task task2 = new Task();
        assertThat(task1).isNotEqualTo(task2);

        task2.setId(task1.getId());
        assertThat(task1).isEqualTo(task2);

        task2 = getTaskSample2();
        assertThat(task1).isNotEqualTo(task2);
    }

    @Test
    void categoryTest() {
        Task task = getTaskRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        task.setCategory(categoryBack);
        assertThat(task.getCategory()).isEqualTo(categoryBack);

        task.category(null);
        assertThat(task.getCategory()).isNull();
    }

    @Test
    void productivityReportTest() {
        Task task = getTaskRandomSampleGenerator();
        ProductivityReport productivityReportBack = getProductivityReportRandomSampleGenerator();

        task.addProductivityReport(productivityReportBack);
        assertThat(task.getProductivityReports()).containsOnly(productivityReportBack);
        assertThat(productivityReportBack.getCompletedTasks()).containsOnly(task);

        task.removeProductivityReport(productivityReportBack);
        assertThat(task.getProductivityReports()).doesNotContain(productivityReportBack);
        assertThat(productivityReportBack.getCompletedTasks()).doesNotContain(task);

        task.productivityReports(new HashSet<>(Set.of(productivityReportBack)));
        assertThat(task.getProductivityReports()).containsOnly(productivityReportBack);
        assertThat(productivityReportBack.getCompletedTasks()).containsOnly(task);

        task.setProductivityReports(new HashSet<>());
        assertThat(task.getProductivityReports()).doesNotContain(productivityReportBack);
        assertThat(productivityReportBack.getCompletedTasks()).doesNotContain(task);
    }
}
