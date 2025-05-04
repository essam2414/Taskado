package bham.team.web.rest;

import bham.team.domain.ProductivityReport;
import bham.team.domain.User;
import bham.team.repository.ProductivityReportRepository;
import bham.team.repository.UserRepository;
import bham.team.security.SecurityUtils;
import bham.team.service.ProductivityReportService;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link bham.team.domain.ProductivityReport}.
 */
@RestController
@RequestMapping("/api/productivity-reports")
public class ProductivityReportResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductivityReportResource.class);

    private static final String ENTITY_NAME = "productivityReport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductivityReportService productivityReportService;

    private final ProductivityReportRepository productivityReportRepository;

    private final UserRepository userRepository;

    public ProductivityReportResource(
        ProductivityReportService productivityReportService,
        ProductivityReportRepository productivityReportRepository,
        UserRepository userRepository
    ) {
        this.productivityReportService = productivityReportService;
        this.productivityReportRepository = productivityReportRepository;
        this.userRepository = userRepository;
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

        // 🔐 Get current user
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        User user = userRepository.findOneByLogin(login).orElseThrow();
        productivityReport.setUser(user); // ✅ Assign user to report

        productivityReport = productivityReportService.save(productivityReport);
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

        productivityReport = productivityReportService.update(productivityReport);
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

        Optional<ProductivityReport> result = productivityReportService.partialUpdate(productivityReport);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, productivityReport.getId().toString())
        );
    }

    /**
     * {@code GET  /productivity-reports} : get all the productivityReports.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productivityReports in body.
     */
    @GetMapping("")
    public List<ProductivityReport> getAllProductivityReports(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all ProductivityReports");
        return productivityReportRepository.findByUserIsCurrentUser();
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

        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        Optional<ProductivityReport> productivityReport = productivityReportRepository
            .findById(id)
            .filter(report -> report.getUser() != null && report.getUser().getLogin().equals(login));

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

        ProductivityReport report = productivityReportRepository.findByIdWithUser(id).orElseThrow();
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        if (!report.getUser().getLogin().equals(login)) {
            throw new BadRequestAlertException("You do not have permission to delete this report", ENTITY_NAME, "unauthorized");
        }

        productivityReportService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
