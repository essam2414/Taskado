package bham.team.repository;

import bham.team.domain.Goal;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Goal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    @Query("select goal from Goal goal where goal.user.login = ?#{authentication.name}")
    List<Goal> findByUserIsCurrentUser();
}
