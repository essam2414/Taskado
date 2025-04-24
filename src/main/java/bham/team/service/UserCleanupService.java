package bham.team.service;

import bham.team.domain.User;
import bham.team.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UserCleanupService {

    private final UserRepository userRepository;

    public UserCleanupService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(fixedRate = 3600000)
    public void deleteOldGuestAccounts() {
        Instant now = Instant.now();
        List<User> expiredGuests = userRepository.findAllByIsGuestTrueAndGuestExpiresAtBefore(now);
        for (User guest : expiredGuests) {
            userRepository.delete(guest);
        }
    }
}
