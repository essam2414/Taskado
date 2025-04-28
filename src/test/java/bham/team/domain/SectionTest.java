package bham.team.domain;

import static bham.team.domain.SectionTestSamples.*;
import static bham.team.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Section.class);
        Section section1 = getSectionSample1();
        Section section2 = new Section();
        assertThat(section1).isNotEqualTo(section2);

        section2.setId(section1.getId());
        assertThat(section1).isEqualTo(section2);

        section2 = getSectionSample2();
        assertThat(section1).isNotEqualTo(section2);
    }

    @Test
    void tasksTest() {
        Section section = getSectionRandomSampleGenerator();
        Task taskBack = getTaskRandomSampleGenerator();

        section.addTasks(taskBack);
        assertThat(section.getTasks()).containsOnly(taskBack);
        assertThat(taskBack.getSection()).isEqualTo(section);

        section.removeTasks(taskBack);
        assertThat(section.getTasks()).doesNotContain(taskBack);
        assertThat(taskBack.getSection()).isNull();

        section.tasks(new HashSet<>(Set.of(taskBack)));
        assertThat(section.getTasks()).containsOnly(taskBack);
        assertThat(taskBack.getSection()).isEqualTo(section);

        section.setTasks(new HashSet<>());
        assertThat(section.getTasks()).doesNotContain(taskBack);
        assertThat(taskBack.getSection()).isNull();
    }
}
