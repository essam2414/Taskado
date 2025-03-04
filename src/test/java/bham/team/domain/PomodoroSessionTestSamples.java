package bham.team.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class PomodoroSessionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PomodoroSession getPomodoroSessionSample1() {
        return new PomodoroSession().id(1L);
    }

    public static PomodoroSession getPomodoroSessionSample2() {
        return new PomodoroSession().id(2L);
    }

    public static PomodoroSession getPomodoroSessionRandomSampleGenerator() {
        return new PomodoroSession().id(longCount.incrementAndGet());
    }
}
