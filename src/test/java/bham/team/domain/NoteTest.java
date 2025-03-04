package bham.team.domain;

import static bham.team.domain.CategoryTestSamples.*;
import static bham.team.domain.NoteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NoteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Note.class);
        Note note1 = getNoteSample1();
        Note note2 = new Note();
        assertThat(note1).isNotEqualTo(note2);

        note2.setId(note1.getId());
        assertThat(note1).isEqualTo(note2);

        note2 = getNoteSample2();
        assertThat(note1).isNotEqualTo(note2);
    }

    @Test
    void categoryTest() {
        Note note = getNoteRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        note.setCategory(categoryBack);
        assertThat(note.getCategory()).isEqualTo(categoryBack);

        note.category(null);
        assertThat(note.getCategory()).isNull();
    }
}
