package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final JWTUtility jwtUtility;

    public AuthController(UserRepository userRepository, JWTUtility jwtUtility) {
        this.userRepository = userRepository;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists!");
        }

        // ✅ FIXED: Check if email already exists (correct repository method)
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use!");
        }

        // Validate required fields
        if (user.getFirstName() == null || user.getLastName() == null || user.getEmail() == null ||
                user.getFirstName().trim().isEmpty() || user.getLastName().trim().isEmpty() || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All fields are required.");
        }

        // Validate password
        if (!PasswordValidator(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid password. It must meet complexity requirements.");
        }

        // Hash password and save user
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        userRepository.save(user);

        // Create JWT Authentication Token
        String token = jwtUtility.generateToken(user.getUsername());

        return ResponseEntity.ok(token);
    }


    public static boolean PasswordValidator(String password) {
        if (password == null) {
            System.out.println("Password Field is Empty");
            return false;
        }
        if (password.length() < 8) {
            System.out.println("Password is too short! Please enter a password between 8 characters to 20 characters!");
            return false;
        }
        if (password.length() > 20) {
            System.out.println("Password is too long! Please enter a password between 8 characters to 20 characters!");
            return false;
        }
        return true;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> sqlUser = userRepository.findByUsername(user.getUsername());

        if (sqlUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User not found");
        }

        boolean passwordCheck = BCrypt.checkpw(user.getPassword(), sqlUser.get().getPassword());
        if (!passwordCheck) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Incorrect Password");
        }

        String token = jwtUtility.generateToken(user.getUsername());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset(@RequestBody User user) {
        System.out.println("[DEBUG] Password reset requested for username: " + user.getUsername());
        System.out.println("[DEBUG] Provided (raw) password: " + user.getPassword());

        Optional<User> sqlUser = userRepository.findByUsername(user.getUsername());

        if (sqlUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User not found");
        }

        if (BCrypt.checkpw(user.getPassword(), sqlUser.get().getPassword())) {
            System.out.println("[ERROR] New password matches the old one (after hashing check).");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Password must be different");
        }

        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        sqlUser.get().setPassword(hashedPassword);
        userRepository.save(sqlUser.get());

        System.out.println("[SUCCESS] Password has been updated for user: " + user.getUsername());
        System.out.println("[DEBUG] New (hashed) password stored: " + hashedPassword);
        return ResponseEntity.ok("Password has been changed");
    }

    @GetMapping("/returnProfile")
    public ResponseEntity<?> getProfile(@RequestParam String token) {
        String username = jwtUtility.getUsernameFromToken(token);
        if(username == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Map<String, Object> profileInfo = new HashMap<>();
        profileInfo.put("firstName", user.get().getFirstName());
        profileInfo.put("lastName", user.get().getLastName());
        profileInfo.put("email", user.get().getEmail());
        profileInfo.put("password", user.get().getPassword());

        return ResponseEntity.ok(profileInfo);
    }
}
