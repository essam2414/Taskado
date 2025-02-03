package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class NotificationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Notification getNotificationSample1() {
        return new Notification()
            .id(1L)
            .message("message1")
            .linkedEntityType("linkedEntityType1")
            .actionURL("actionURL1")
            .icon("icon1")
            .recurrencePattern("recurrencePattern1");
    }

    public static Notification getNotificationSample2() {
        return new Notification()
            .id(2L)
            .message("message2")
            .linkedEntityType("linkedEntityType2")
            .actionURL("actionURL2")
            .icon("icon2")
            .recurrencePattern("recurrencePattern2");
    }

    public static Notification getNotificationRandomSampleGenerator() {
        return new Notification()
            .id(longCount.incrementAndGet())
            .message(UUID.randomUUID().toString())
            .linkedEntityType(UUID.randomUUID().toString())
            .actionURL(UUID.randomUUID().toString())
            .icon(UUID.randomUUID().toString())
            .recurrencePattern(UUID.randomUUID().toString());
    }
}
