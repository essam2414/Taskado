package bham.team.repository;

import bham.team.domain.ProductivityReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ProductivityReportRepositoryWithBagRelationships {
    Optional<ProductivityReport> fetchBagRelationships(Optional<ProductivityReport> productivityReport);

    List<ProductivityReport> fetchBagRelationships(List<ProductivityReport> productivityReports);

    Page<ProductivityReport> fetchBagRelationships(Page<ProductivityReport> productivityReports);
}
