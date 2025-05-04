package bham.team.repository;

import bham.team.domain.ProductivityReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductivityReport entity.
 *
 * When extending this class, extend ProductivityReportRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface ProductivityReportRepository
    extends ProductivityReportRepositoryWithBagRelationships, JpaRepository<ProductivityReport, Long> {
    @Query(
        "select productivityReport from ProductivityReport productivityReport where productivityReport.user.login = ?#{authentication.name}"
    )
    List<ProductivityReport> findByUserIsCurrentUser();

    @Query("SELECT r FROM ProductivityReport r JOIN FETCH r.user WHERE r.id = :id")
    Optional<ProductivityReport> findByIdWithUser(@Param("id") Long id);

    default Optional<ProductivityReport> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<ProductivityReport> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<ProductivityReport> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
