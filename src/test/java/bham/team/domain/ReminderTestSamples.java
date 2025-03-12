package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ReminderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Reminder getReminderSample1() {
        return new Reminder()
            .id(1L)
            .title("title1")
            .description("description1")
            .repeatType("repeatType1")
            .repeatInterval(1)
            .linkedEntityType("linkedEntityType1")
            .linkedEntityId(1L);
    }

    public static Reminder getReminderSample2() {
        return new Reminder()
            .id(2L)
            .title("title2")
            .description("description2")
            .repeatType("repeatType2")
            .repeatInterval(2)
            .linkedEntityType("linkedEntityType2")
            .linkedEntityId(2L);
    }

    public static Reminder getReminderRandomSampleGenerator() {
        return new Reminder()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .repeatType(UUID.randomUUID().toString())
            .repeatInterval(intCount.incrementAndGet())
            .linkedEntityType(UUID.randomUUID().toString())
            .linkedEntityId(longCount.incrementAndGet());
    }
}
