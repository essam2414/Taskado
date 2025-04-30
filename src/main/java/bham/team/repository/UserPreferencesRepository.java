package bham.team.repository;

import bham.team.domain.UserPreferences;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserPreferences entity.
 */
@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    default Optional<UserPreferences> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<UserPreferences> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<UserPreferences> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select userPreferences from UserPreferences userPreferences left join fetch userPreferences.user",
        countQuery = "select count(userPreferences) from UserPreferences userPreferences"
    )
    Page<UserPreferences> findAllWithToOneRelationships(Pageable pageable);

    @Query("select userPreferences from UserPreferences userPreferences left join fetch userPreferences.user")
    List<UserPreferences> findAllWithToOneRelationships();

    @Query("select userPreferences from UserPreferences userPreferences left join fetch userPreferences.user where userPreferences.id =:id")
    Optional<UserPreferences> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        "select userPreferences from UserPreferences userPreferences left join fetch userPreferences.user where userPreferences.user.id = :userId"
    )
    Optional<UserPreferences> findOneByUserId(@Param("userId") Long userId);
}
