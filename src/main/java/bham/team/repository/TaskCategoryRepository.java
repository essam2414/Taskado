package bham.team.repository;

import bham.team.domain.TaskCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TaskCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskCategoryRepository extends JpaRepository<TaskCategory, Long> {}
