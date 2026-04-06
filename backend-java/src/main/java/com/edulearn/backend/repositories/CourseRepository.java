package com.edulearn.backend.repositories;

import com.edulearn.backend.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByCategory(String category);
}
