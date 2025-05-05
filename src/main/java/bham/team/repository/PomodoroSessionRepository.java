package bham.team.repository;

import bham.team.domain.PomodoroSession;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PomodoroSession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
    @Query("select pomodoroSession from PomodoroSession pomodoroSession where pomodoroSession.user.login = ?#{authentication.name}")
    List<PomodoroSession> findByUserIsCurrentUser();

    @Query("select p from PomodoroSession p where p.user.login = ?#{authentication.name}")
    List<PomodoroSession> findAllByUserLogin(String login);
}
