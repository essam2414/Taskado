package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class HabitTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Habit getHabitSample1() {
        return new Habit()
            .id(1L)
            .name("name1")
            .repeatType("repeatType1")
            .repeatInterval(1)
            .repeatDays("repeatDays1")
            .repeatTimes("repeatTimes1")
            .streak(1);
    }

    public static Habit getHabitSample2() {
        return new Habit()
            .id(2L)
            .name("name2")
            .repeatType("repeatType2")
            .repeatInterval(2)
            .repeatDays("repeatDays2")
            .repeatTimes("repeatTimes2")
            .streak(2);
    }

    public static Habit getHabitRandomSampleGenerator() {
        return new Habit()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .repeatType(UUID.randomUUID().toString())
            .repeatInterval(intCount.incrementAndGet())
            .repeatDays(UUID.randomUUID().toString())
            .repeatTimes(UUID.randomUUID().toString())
            .streak(intCount.incrementAndGet());
    }
}
