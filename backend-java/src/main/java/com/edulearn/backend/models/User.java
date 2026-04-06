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
