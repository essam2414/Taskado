package bham.team.repository;

import bham.team.domain.HabitTracker;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HabitTracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HabitTrackerRepository extends JpaRepository<HabitTracker, Long> {}
