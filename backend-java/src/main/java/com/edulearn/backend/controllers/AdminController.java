package com.edulearn.backend.controllers;

import com.edulearn.backend.models.Course;
import com.edulearn.backend.repositories.CourseRepository;
import com.edulearn.backend.models.User;
import com.edulearn.backend.repositories.UserRepository;
import com.edulearn.backend.models.SystemConfig;
import com.edulearn.backend.repositories.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8081", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    private String getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // For development, extracting from "Bearer fake-jwt-token-for-ID"
            return authHeader.replace("Bearer fake-jwt-token-for-", "");
        }
        return null;
    }

    private boolean isAdmin(String authHeader) {
        String userId = getUserId(authHeader);
        if (userId == null) return false;
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && "admin".equals(user.get().getRole());
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("message", "Access denied"));

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.count(); // Simplified for now
        long totalCourses = courseRepository.count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", totalUsers);
        analytics.put("activeUsers", activeUsers);
        analytics.put("totalCourses", totalCourses);
        analytics.put("growthData", List.of());
        analytics.put("categoryDistribution", List.of());

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        return ResponseEntity.ok(systemConfigRepository.findAll());
    }

    @PostMapping("/settings")
    public ResponseEntity<?> saveSetting(@RequestBody Map<String, Object> body, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("message", "Access denied"));

        String key = (String) body.get("key");
        Object value = body.get("value");

        SystemConfig config = systemConfigRepository.findByKey(key).orElse(new SystemConfig());
        config.setKey(key);
        config.setValue(value);
        config.setUpdatedAt(LocalDateTime.now());

        systemConfigRepository.save(config);
        return ResponseEntity.ok(Map.of("message", "Setting saved successfully", "setting", config));
    }

    @DeleteMapping("/settings/{id}")
    public ResponseEntity<?> deleteSetting(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        systemConfigRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Setting deleted successfully"));
    }
}
