package bham.team.repository;

import bham.team.domain.PomodoroSession;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PomodoroSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
    @Query("select p from PomodoroSession p where p.user.login = ?#{authentication.name}")
    List<PomodoroSession> findByUserIsCurrentUser();

    // Optional: used in controller for custom login-based queries
    @Query("select p from PomodoroSession p where p.user.login = :login")
    List<PomodoroSession> findAllByUserLogin(@Param("login") String login);
}
