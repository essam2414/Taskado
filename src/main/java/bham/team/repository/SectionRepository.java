package bham.team.repository;

import bham.team.domain.Section;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Section entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    @Query("select section from Section section where section.user.login = ?#{authentication.name}")
    List<Section> findByUserIsCurrentUser();
}
