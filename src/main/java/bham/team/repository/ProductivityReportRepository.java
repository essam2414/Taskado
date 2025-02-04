package bham.team.repository;

import bham.team.domain.ProductivityReport;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductivityReport entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductivityReportRepository extends JpaRepository<ProductivityReport, Long> {}
