package bham.team.service.dto;

import java.time.Instant;

/**
 * A DTO for the {@link bham.team.domain.PomodoroSession} entity.
 * This ensures `duration` is included in API responses.
 */
public class PomodoroSessionDTO {

    private Long id;
    private Instant start;
    private Instant stop;
    private Integer duration; // Computed duration
    private Long userId;

    public PomodoroSessionDTO(Long id, Instant start, Instant stop, Integer duration, Long userId) {
        this.id = id;
        this.start = start;
        this.stop = stop;
        this.duration = duration;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public Instant getStart() {
        return start;
    }

    public Instant getStop() {
        return stop;
    }

    public Integer getDuration() {
        return duration;
    }

    public Long getUserId() {
        return userId;
    }
}
