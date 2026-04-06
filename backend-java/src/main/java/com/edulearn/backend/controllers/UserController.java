package com.edulearn.backend.controllers;

import com.edulearn.backend.models.Course;
import com.edulearn.backend.repositories.CourseRepository;
import com.edulearn.backend.models.User;
import com.edulearn.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private String getUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(27); // extract from "Bearer fake-jwt-token-for-"
        }
        return null;
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(null));
    }

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<?> enroll(@PathVariable String courseId, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (userOpt.isPresent() && courseOpt.isPresent()) {
            User user = userOpt.get();
            Course course = courseOpt.get();

            if (user.getEnrolledCourses() == null) user.setEnrolledCourses(new ArrayList<>());
            
            if (user.getEnrolledCourses().contains(courseId)) {
                return ResponseEntity.status(400).body(Map.of("message", "Already enrolled"));
            }

            user.getEnrolledCourses().add(courseId);
            course.setStudentsEnrolled(course.getStudentsEnrolled() + 1);
            
            userRepository.save(user);
            courseRepository.save(course);
            return ResponseEntity.ok(Map.of("message", "Enrolled successfully", "user", user));
        }
        return ResponseEntity.status(404).body(Map.of("message", "User or Course not found"));
    }

    @PostMapping("/complete/{courseId}")
    public ResponseEntity<?> complete(@PathVariable String courseId, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);

        if (userOpt.isPresent() && courseOpt.isPresent()) {
            User user = userOpt.get();
            Course course = courseOpt.get();

            if (user.getCompletedCourses() == null) user.setCompletedCourses(new ArrayList<>());
            if (user.getCompletedCourses().contains(courseId)) {
                return ResponseEntity.status(400).body(Map.of("message", "Already completed"));
            }

            // Remove from enrolled
            if (user.getEnrolledCourses() != null) {
                user.getEnrolledCourses().remove(courseId);
            }
            user.getCompletedCourses().add(courseId);

            // Add certificate
            if (user.getCertificates() == null) user.setCertificates(new ArrayList<>());
            User.Certificate cert = new User.Certificate();
            cert.setCourseId(courseId);
            cert.setCourseName(course.getTitle());
            cert.setCompletedDate(LocalDateTime.now());
            user.getCertificates().add(cert);

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Course completed", "user", user));
        }
        return ResponseEntity.status(404).body(Map.of("message", "User or Course not found"));
    }

    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(@RequestBody Map<String, Object> progressData, @RequestHeader("Authorization") String authHeader) {
        String userId = getUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Double hours = Double.parseDouble(progressData.get("hours").toString());
            user.setLearningHours(user.getLearningHours() + hours.intValue());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Progress updated", "learningHours", user.getLearningHours()));
        }
        return ResponseEntity.status(404).body(Map.of("message", "User not found"));
    }
}
