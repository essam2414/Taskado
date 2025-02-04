package bham.team.web.rest;

import bham.team.domain.ProductivityReport;
import bham.team.repository.ProductivityReportRepository;
import bham.team.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.ProductivityReport}.
 */
@RestController
@RequestMapping("/api/productivity-reports")
@Transactional
public class ProductivityReportResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductivityReportResource.class);

    private static final String ENTITY_NAME = "productivityReport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductivityReportRepository productivityReportRepository;

    public ProductivityReportResource(ProductivityReportRepository productivityReportRepository) {
        this.productivityReportRepository = productivityReportRepository;
    }

    /**
     * {@code POST  /productivity-reports} : Create a new productivityReport.
     *
     * @param productivityReport the productivityReport to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productivityReport, or with status {@code 400 (Bad Request)} if the productivityReport has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductivityReport> createProductivityReport(@Valid @RequestBody ProductivityReport productivityReport)
        throws URISyntaxException {
        LOG.debug("REST request to save ProductivityReport : {}", productivityReport);
        if (productivityReport.getId() != null) {
            throw new BadRequestAlertException("A new productivityReport cannot already have an ID", ENTITY_NAME, "idexists");
        }
        productivityReport = productivityReportRepository.save(productivityReport);
        return ResponseEntity.created(new URI("/api/productivity-reports/" + productivityReport.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, productivityReport.getId().toString()))
            .body(productivityReport);
    }

    /**
     * {@code PUT  /productivity-reports/:id} : Updates an existing productivityReport.
     *
     * @param id the id of the productivityReport to save.
     * @param productivityReport the productivityReport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productivityReport,
     * or with status {@code 400 (Bad Request)} if the productivityReport is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productivityReport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductivityReport> updateProductivityReport(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductivityReport productivityReport
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProductivityReport : {}, {}", id, productivityReport);
        if (productivityReport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productivityReport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productivityReportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        productivityReport = productivityReportRepository.save(productivityReport);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, productivityReport.getId().toString()))
            .body(productivityReport);
    }

    /**
     * {@code PATCH  /productivity-reports/:id} : Partial updates given fields of an existing productivityReport, field will ignore if it is null
     *
     * @param id the id of the productivityReport to save.
     * @param productivityReport the productivityReport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productivityReport,
     * or with status {@code 400 (Bad Request)} if the productivityReport is not valid,
     * or with status {@code 404 (Not Found)} if the productivityReport is not found,
     * or with status {@code 500 (Internal Server Error)} if the productivityReport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductivityReport> partialUpdateProductivityReport(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductivityReport productivityReport
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProductivityReport partially : {}, {}", id, productivityReport);
        if (productivityReport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productivityReport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productivityReportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductivityReport> result = productivityReportRepository
            .findById(productivityReport.getId())
            .map(existingProductivityReport -> {
                if (productivityReport.getTasksPlanned() != null) {
                    existingProductivityReport.setTasksPlanned(productivityReport.getTasksPlanned());
                }
                if (productivityReport.getTasksCompleted() != null) {
                    existingProductivityReport.setTasksCompleted(productivityReport.getTasksCompleted());
                }
                if (productivityReport.getTaskAvgCompletionTime() != null) {
                    existingProductivityReport.setTaskAvgCompletionTime(productivityReport.getTaskAvgCompletionTime());
                }
                if (productivityReport.getTaskEfficiency() != null) {
                    existingProductivityReport.setTaskEfficiency(productivityReport.getTaskEfficiency());
                }
                if (productivityReport.getPomodoroSuccessRate() != null) {
                    existingProductivityReport.setPomodoroSuccessRate(productivityReport.getPomodoroSuccessRate());
                }
                if (productivityReport.getFocusTime() != null) {
                    existingProductivityReport.setFocusTime(productivityReport.getFocusTime());
                }
                if (productivityReport.getFocusScore() != null) {
                    existingProductivityReport.setFocusScore(productivityReport.getFocusScore());
                }
                if (productivityReport.getDistractionsCount() != null) {
                    existingProductivityReport.setDistractionsCount(productivityReport.getDistractionsCount());
                }
                if (productivityReport.getTimestamp() != null) {
                    existingProductivityReport.setTimestamp(productivityReport.getTimestamp());
                }

                return existingProductivityReport;
            })
            .map(productivityReportRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, productivityReport.getId().toString())
        );
    }

    /**
     * {@code GET  /productivity-reports} : get all the productivityReports.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productivityReports in body.
     */
    @GetMapping("")
    public List<ProductivityReport> getAllProductivityReports() {
        LOG.debug("REST request to get all ProductivityReports");
        return productivityReportRepository.findAll();
    }

    /**
     * {@code GET  /productivity-reports/:id} : get the "id" productivityReport.
     *
     * @param id the id of the productivityReport to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productivityReport, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductivityReport> getProductivityReport(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProductivityReport : {}", id);
        Optional<ProductivityReport> productivityReport = productivityReportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productivityReport);
    }

    /**
     * {@code DELETE  /productivity-reports/:id} : delete the "id" productivityReport.
     *
     * @param id the id of the productivityReport to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductivityReport(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ProductivityReport : {}", id);
        productivityReportRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
