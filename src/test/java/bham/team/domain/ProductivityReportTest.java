package bham.team.domain;

import static bham.team.domain.ProductivityReportTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductivityReportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductivityReport.class);
        ProductivityReport productivityReport1 = getProductivityReportSample1();
        ProductivityReport productivityReport2 = new ProductivityReport();
        assertThat(productivityReport1).isNotEqualTo(productivityReport2);

        productivityReport2.setId(productivityReport1.getId());
        assertThat(productivityReport1).isEqualTo(productivityReport2);

        productivityReport2 = getProductivityReportSample2();
        assertThat(productivityReport1).isNotEqualTo(productivityReport2);
    }
}
