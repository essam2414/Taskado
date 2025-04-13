package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class UserPreferencesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static UserPreferences getUserPreferencesSample1() {
        return new UserPreferences()
            .id(1L)
            .sidebarColorLight("sidebarColorLight1")
            .sidebarColorDark("sidebarColorDark1")
            .accentColor("accentColor1")
            .fontSizeLevel(1)
            .dashboardTheme("dashboardTheme1");
    }

    public static UserPreferences getUserPreferencesSample2() {
        return new UserPreferences()
            .id(2L)
            .sidebarColorLight("sidebarColorLight2")
            .sidebarColorDark("sidebarColorDark2")
            .accentColor("accentColor2")
            .fontSizeLevel(2)
            .dashboardTheme("dashboardTheme2");
    }

    public static UserPreferences getUserPreferencesRandomSampleGenerator() {
        return new UserPreferences()
            .id(longCount.incrementAndGet())
            .sidebarColorLight(UUID.randomUUID().toString())
            .sidebarColorDark(UUID.randomUUID().toString())
            .accentColor(UUID.randomUUID().toString())
            .fontSizeLevel(intCount.incrementAndGet())
            .dashboardTheme(UUID.randomUUID().toString());
    }
}
