package com.edulearn.backend.repositories;

import com.edulearn.backend.models.SystemConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SystemConfigRepository extends MongoRepository<SystemConfig, String> {
    Optional<SystemConfig> findByKey(String key);
}
