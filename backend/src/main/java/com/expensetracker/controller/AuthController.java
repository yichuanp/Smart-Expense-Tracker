package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
        profileInfo.put("username", user.get().getUsername());
        profileInfo.put("profilePicture", user.get().getProfilePicture());

        return ResponseEntity.ok(profileInfo);
    }

    @PutMapping(value = "/updateProfile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestParam("token") String token,
            @RequestParam("username") String newUsername,
            @RequestParam("firstName") String newFirstName,
            @RequestParam("lastName") String newLastName,
            @RequestParam("email") String newEmail,
            @RequestParam(value = "newPassword", required = false) String newPassword,
            @RequestParam(value = "confirmPassword", required = false) String confirmPassword,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture
    ) {
        String usernameFromToken = jwtUtility.getUsernameFromToken(token);
        if (usernameFromToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        Optional<User> userOptional = userRepository.findByUsername(usernameFromToken);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOptional.get();

        // Validate basic fields
        if (newFirstName == null || newLastName == null || newEmail == null || newUsername == null ||
                newFirstName.trim().isEmpty() || newLastName.trim().isEmpty() || newEmail.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All required fields must be filled.");
        }

        // Check for email conflict
        if (!newEmail.equals(user.getEmail())) {
            if (userRepository.findByEmail(newEmail).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use.");
            }
        }

        // Check for username conflict
        if (!newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already in use.");
            }
        }

        // Update password if present
        if (newPassword != null && !newPassword.isEmpty()) {
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
            }

            if (!PasswordValidator(newPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password does not meet requirements.");
            }

            String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            user.setPassword(hashedPassword);
        }

        // Save profile picture if present
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String fileName = user.getUsername() + "_" + System.currentTimeMillis() + "_" + profilePicture.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");
            try {
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
                Files.copy(profilePicture.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                user.setProfilePicture(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
            }
        }

        user.setFirstName(newFirstName);
        user.setLastName(newLastName);
        user.setEmail(newEmail);
        user.setUsername(newUsername);
        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully.");
    }



}
