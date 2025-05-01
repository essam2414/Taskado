package bham.team.web.rest;

import bham.team.repository.PomodoroSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Transactional
public class PomodoroSessionHistoryResource {

    private final Logger log = LoggerFactory.getLogger(PomodoroSessionHistoryResource.class);
    private final PomodoroSessionRepository repo;

    public PomodoroSessionHistoryResource(PomodoroSessionRepository repo) {
        this.repo = repo;
    }

    /**
     * {@code GET  /pomodoro/completed-count} : return the total number of saved PomodoroSession entities.
     */
    @GetMapping("/pomodoro/completed-count")
    public ResponseEntity<Long> getCompletedSessionsCount() {
        log.debug("REST request to get total completed pomodoros");
        long count = repo.count();
        return ResponseEntity.ok(count);
    }
}
