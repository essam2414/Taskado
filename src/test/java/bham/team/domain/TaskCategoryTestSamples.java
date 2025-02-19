package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TaskCategoryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TaskCategory getTaskCategorySample1() {
        return new TaskCategory().id(1L).name("name1").color("color1");
    }

    public static TaskCategory getTaskCategorySample2() {
        return new TaskCategory().id(2L).name("name2").color("color2");
    }

    public static TaskCategory getTaskCategoryRandomSampleGenerator() {
        return new TaskCategory().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).color(UUID.randomUUID().toString());
    }
}
