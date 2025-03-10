package bham.team.service;

import bham.team.domain.ProductivityReport;
import bham.team.repository.ProductivityReportRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link bham.team.domain.ProductivityReport}.
 */
@Service
@Transactional
public class ProductivityReportService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductivityReportService.class);

    private final ProductivityReportRepository productivityReportRepository;

    public ProductivityReportService(ProductivityReportRepository productivityReportRepository) {
        this.productivityReportRepository = productivityReportRepository;
    }

    /**
     * Save a productivityReport.
     *
     * @param productivityReport the entity to save.
     * @return the persisted entity.
     */
    public ProductivityReport save(ProductivityReport productivityReport) {
        LOG.debug("Request to save ProductivityReport : {}", productivityReport);
        return productivityReportRepository.save(productivityReport);
    }

    /**
     * Update a productivityReport.
     *
     * @param productivityReport the entity to save.
     * @return the persisted entity.
     */
    public ProductivityReport update(ProductivityReport productivityReport) {
        LOG.debug("Request to update ProductivityReport : {}", productivityReport);
        return productivityReportRepository.save(productivityReport);
    }

    /**
     * Partially update a productivityReport.
     *
     * @param productivityReport the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductivityReport> partialUpdate(ProductivityReport productivityReport) {
        LOG.debug("Request to partially update ProductivityReport : {}", productivityReport);

        return productivityReportRepository
            .findById(productivityReport.getId())
            .map(existingProductivityReport -> {
                if (productivityReport.getTasksPlanned() != null) {
                    existingProductivityReport.setTasksPlanned(productivityReport.getTasksPlanned());
                }
                if (productivityReport.getTaskCompleted() != null) {
                    existingProductivityReport.setTaskCompleted(productivityReport.getTaskCompleted());
                }
                if (productivityReport.getTaskAvgCompletionTime() != null) {
                    existingProductivityReport.setTaskAvgCompletionTime(productivityReport.getTaskAvgCompletionTime());
                }
                if (productivityReport.getTaskEfficiency() != null) {
                    existingProductivityReport.setTaskEfficiency(productivityReport.getTaskEfficiency());
                }
                if (productivityReport.getFocusTime() != null) {
                    existingProductivityReport.setFocusTime(productivityReport.getFocusTime());
                }
                if (productivityReport.getFocusScore() != null) {
                    existingProductivityReport.setFocusScore(productivityReport.getFocusScore());
                }
                if (productivityReport.getHabitCompletionRate() != null) {
                    existingProductivityReport.setHabitCompletionRate(productivityReport.getHabitCompletionRate());
                }
                if (productivityReport.getHabitStreakImpact() != null) {
                    existingProductivityReport.setHabitStreakImpact(productivityReport.getHabitStreakImpact());
                }
                if (productivityReport.getTimestamp() != null) {
                    existingProductivityReport.setTimestamp(productivityReport.getTimestamp());
                }

                return existingProductivityReport;
            })
            .map(productivityReportRepository::save);
    }

    /**
     * Get all the productivityReports.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProductivityReport> findAll() {
        LOG.debug("Request to get all ProductivityReports");
        return productivityReportRepository.findAll();
    }

    /**
     * Get all the productivityReports with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProductivityReport> findAllWithEagerRelationships(Pageable pageable) {
        return productivityReportRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one productivityReport by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProductivityReport> findOne(Long id) {
        LOG.debug("Request to get ProductivityReport : {}", id);
        return productivityReportRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the productivityReport by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ProductivityReport : {}", id);
        productivityReportRepository.deleteById(id);
    }
}
