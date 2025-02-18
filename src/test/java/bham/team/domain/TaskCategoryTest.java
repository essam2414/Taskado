package bham.team.domain;

import static bham.team.domain.TaskCategoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TaskCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskCategory.class);
        TaskCategory taskCategory1 = getTaskCategorySample1();
        TaskCategory taskCategory2 = new TaskCategory();
        assertThat(taskCategory1).isNotEqualTo(taskCategory2);

        taskCategory2.setId(taskCategory1.getId());
        assertThat(taskCategory1).isEqualTo(taskCategory2);

        taskCategory2 = getTaskCategorySample2();
        assertThat(taskCategory1).isNotEqualTo(taskCategory2);
    }
}
