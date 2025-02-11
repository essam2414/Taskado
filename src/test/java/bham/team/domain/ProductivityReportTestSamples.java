package bham.team.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProductivityReportTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ProductivityReport getProductivityReportSample1() {
        return new ProductivityReport().id(1L).tasksPlanned(1).tasksCompleted(1).pomodoroSessions(1).distractionsCount(1);
    }

    public static ProductivityReport getProductivityReportSample2() {
        return new ProductivityReport().id(2L).tasksPlanned(2).tasksCompleted(2).pomodoroSessions(2).distractionsCount(2);
    }

    public static ProductivityReport getProductivityReportRandomSampleGenerator() {
        return new ProductivityReport()
            .id(longCount.incrementAndGet())
            .tasksPlanned(intCount.incrementAndGet())
            .tasksCompleted(intCount.incrementAndGet())
            .pomodoroSessions(intCount.incrementAndGet())
            .distractionsCount(intCount.incrementAndGet());
    }
}
