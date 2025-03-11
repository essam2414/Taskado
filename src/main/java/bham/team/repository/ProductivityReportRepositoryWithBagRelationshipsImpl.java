package bham.team.repository;

import bham.team.domain.ProductivityReport;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProductivityReportRepositoryWithBagRelationshipsImpl implements ProductivityReportRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String PRODUCTIVITYREPORTS_PARAMETER = "productivityReports";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ProductivityReport> fetchBagRelationships(Optional<ProductivityReport> productivityReport) {
        return productivityReport.map(this::fetchCompletedTasks).map(this::fetchCompletedHabits);
    }

    @Override
    public Page<ProductivityReport> fetchBagRelationships(Page<ProductivityReport> productivityReports) {
        return new PageImpl<>(
            fetchBagRelationships(productivityReports.getContent()),
            productivityReports.getPageable(),
            productivityReports.getTotalElements()
        );
    }

    @Override
    public List<ProductivityReport> fetchBagRelationships(List<ProductivityReport> productivityReports) {
        return Optional.of(productivityReports)
            .map(this::fetchCompletedTasks)
            .map(this::fetchCompletedHabits)
            .orElse(Collections.emptyList());
    }

    ProductivityReport fetchCompletedTasks(ProductivityReport result) {
        return entityManager
            .createQuery(
                "select productivityReport from ProductivityReport productivityReport left join fetch productivityReport.completedTasks where productivityReport.id = :id",
                ProductivityReport.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<ProductivityReport> fetchCompletedTasks(List<ProductivityReport> productivityReports) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, productivityReports.size()).forEach(index -> order.put(productivityReports.get(index).getId(), index));
        List<ProductivityReport> result = entityManager
            .createQuery(
                "select productivityReport from ProductivityReport productivityReport left join fetch productivityReport.completedTasks where productivityReport in :productivityReports",
                ProductivityReport.class
            )
            .setParameter(PRODUCTIVITYREPORTS_PARAMETER, productivityReports)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    ProductivityReport fetchCompletedHabits(ProductivityReport result) {
        return entityManager
            .createQuery(
                "select productivityReport from ProductivityReport productivityReport left join fetch productivityReport.completedHabits where productivityReport.id = :id",
                ProductivityReport.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<ProductivityReport> fetchCompletedHabits(List<ProductivityReport> productivityReports) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, productivityReports.size()).forEach(index -> order.put(productivityReports.get(index).getId(), index));
        List<ProductivityReport> result = entityManager
            .createQuery(
                "select productivityReport from ProductivityReport productivityReport left join fetch productivityReport.completedHabits where productivityReport in :productivityReports",
                ProductivityReport.class
            )
            .setParameter(PRODUCTIVITYREPORTS_PARAMETER, productivityReports)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
