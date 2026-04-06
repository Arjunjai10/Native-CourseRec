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
