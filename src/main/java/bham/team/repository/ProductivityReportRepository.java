package bham.team.repository;

import bham.team.domain.ProductivityReport;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductivityReport entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductivityReportRepository extends JpaRepository<ProductivityReport, Long> {
    @Query(
        "select productivityReport from ProductivityReport productivityReport where productivityReport.user.login = ?#{authentication.name}"
    )
    List<ProductivityReport> findByUserIsCurrentUser();
}
