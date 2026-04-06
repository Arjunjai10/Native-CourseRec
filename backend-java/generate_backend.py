import os

base_dir = "src/main/java/com/edulearn/backend"
def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# models/Course.java
write_file("models/Course.java", """
package com.edulearn.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String description;
    private Instructor instructor;
    private String category;
    private List<String> tags;
    private String level;
    private Duration duration;
    private double rating;
    private int reviewsCount;
    private int studentsEnrolled;
    private String thumbnail;
    private String thumbnailColor;
    private String videoUrl;
    private List<SyllabusModule> syllabus;
    private List<Review> reviews;
    private double price;
    private String language;
    private Resources resources;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Data
    public static class Instructor {
        private String name;
        private String title;
        private String avatar;
        private double rating;
        private int students;
        private int courses;
    }

    @Data
    public static class Duration {
        private Integer hours;
        private Integer lectures;
    }

    @Data
    public static class SyllabusModule {
        private String module;
        private int lectures;
        private String duration;
        private List<Topic> topics;
    }

    @Data
    public static class Topic {
        private String title;
        private String duration;
        private String type;
    }

    @Data
    public static class Review {
        private String userId;
        private String userName;
        private int rating;
        private String comment;
        private LocalDateTime date;
    }

    @Data
    public static class Resources {
        private int videos;
        private int exercises;
        private int downloadable;
    }
}
""")

# models/User.java
write_file("models/User.java", """
package com.edulearn.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String password;
    private List<String> interests;
    private List<String> enrolledCourses;
    private List<String> completedCourses;
    private List<Certificate> certificates;
    private int learningHours;
    private String bio;
    private String profilePicture;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Data
    public static class Certificate {
        private String courseId;
        private String courseName;
        private LocalDateTime completedDate;
    }
}
""")

# repositories
write_file("repositories/CourseRepository.java", """
package com.edulearn.backend.repositories;

import com.edulearn.backend.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCategory(String category);
}
""")

write_file("repositories/UserRepository.java", """
package com.edulearn.backend.repositories;

import com.edulearn.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
""")

# controllers
write_file("controllers/CourseController.java", """
package com.edulearn.backend.controllers;

import com.edulearn.backend.models.Course;
import com.edulearn.backend.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        Optional<Course> course = courseRepository.findById(id);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        } else {
            return ResponseEntity.status(404).body(java.util.Map.of("message", "Course not found"));
        }
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId) {
        // Simple mock recommendations
        List<Course> courses = courseRepository.findAll();
        List<Course> recommendations = courses.subList(0, Math.min(6, courses.size()));
        return ResponseEntity.ok(recommendations);
    }
}
""")

write_file("controllers/AuthController.java", """
package com.edulearn.backend.controllers;

import com.edulearn.backend.models.User;
import com.edulearn.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

// Note: In a real app this uses Spring Security and JWT.
// For the purpose of the mock translation, we are writing a simple auth.
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        return userRepository.findByEmail(email).map(user -> {
            if (user.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", "fake-jwt-token-for-" + user.getId());
                Map<String, Object> safeUser = new HashMap<>();
                safeUser.put("id", user.getId());
                safeUser.put("email", user.getEmail());
                safeUser.put("fullName", user.getFullName());
                response.put("user", safeUser);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }
        }).orElse(ResponseEntity.status(404).body(Map.of("message", "User not found")));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email already exists"));
        }
        User savedUser = userRepository.save(newUser);
        Map<String, Object> response = new HashMap<>();
        response.put("token", "fake-jwt-token-for-" + savedUser.getId());
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("id", savedUser.getId());
        safeUser.put("email", savedUser.getEmail());
        safeUser.put("fullName", savedUser.getFullName());
        response.put("user", safeUser);
        return ResponseEntity.ok(response);
    }
}
""")

write_file("controllers/UserController.java", """
package com.edulearn.backend.controllers;

import com.edulearn.backend.models.User;
import com.edulearn.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(null));
    }
}
""")

print("Java backend scaffolded successfully!")
