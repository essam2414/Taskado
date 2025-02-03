package bham.team.repository;

import bham.team.domain.PomodoroSession;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PomodoroSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {}
