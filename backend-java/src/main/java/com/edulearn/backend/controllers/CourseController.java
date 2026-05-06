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
@CrossOrigin(origins = "http://localhost:8081", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<?> getAllCourses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        
        List<Course> allCourses = courseRepository.findAll();
        
        // Manual filtering for simplicity in this dev environment
        List<Course> filtered = allCourses.stream()
            .filter(c -> {
                if (search == null || search.isEmpty()) return true;
                return (c.getTitle() != null && c.getTitle().toLowerCase().contains(search.toLowerCase())) ||
                       (c.getDescription() != null && c.getDescription().toLowerCase().contains(search.toLowerCase()));
            })
            .filter(c -> {
                if (category == null || category.isEmpty() || "All".equals(category)) return true;
                return category.equals(c.getCategory());
            })
            .collect(java.util.stream.Collectors.toList());

        int totalCourses = filtered.size();
        int totalPages = (int) Math.ceil((double) totalCourses / limit);
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, totalCourses);
        
        List<Course> paginated = (start < totalCourses) ? filtered.subList(start, end) : new java.util.ArrayList<>();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("courses", paginated);
        response.put("totalPages", totalPages);
        response.put("totalCourses", totalCourses);
        response.put("currentPage", page);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<String> categories = courseRepository.findAll().stream()
            .map(Course::getCategory)
            .filter(java.util.Objects::nonNull)
            .distinct()
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(categories);
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
