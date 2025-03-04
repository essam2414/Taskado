package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GoalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Goal getGoalSample1() {
        return new Goal().id(1L).title("title1").description("description1").progress(1);
    }

    public static Goal getGoalSample2() {
        return new Goal().id(2L).title("title2").description("description2").progress(2);
    }

    public static Goal getGoalRandomSampleGenerator() {
        return new Goal()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .progress(intCount.incrementAndGet());
    }
}
