package com.edulearn.backend.controllers;

import com.edulearn.backend.models.User;
import com.edulearn.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        return userRepository.findByEmail(email).map(user -> {
            if (encoder.matches(password, user.getPassword())) {
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
        newUser.setPassword(encoder.encode(newUser.getPassword()));
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
