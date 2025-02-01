package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class HabitTrackerTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static HabitTracker getHabitTrackerSample1() {
        return new HabitTracker().id(1L).name("name1").repeatFrequency("repeatFrequency1").streak(1);
    }

    public static HabitTracker getHabitTrackerSample2() {
        return new HabitTracker().id(2L).name("name2").repeatFrequency("repeatFrequency2").streak(2);
    }

    public static HabitTracker getHabitTrackerRandomSampleGenerator() {
        return new HabitTracker()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .repeatFrequency(UUID.randomUUID().toString())
            .streak(intCount.incrementAndGet());
    }
}
