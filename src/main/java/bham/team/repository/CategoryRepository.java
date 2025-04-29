package bham.team.repository;

import bham.team.domain.Category;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("select category from Category category where category.user.login = ?#{authentication.name}")
    List<Category> findByUserIsCurrentUser();
}
