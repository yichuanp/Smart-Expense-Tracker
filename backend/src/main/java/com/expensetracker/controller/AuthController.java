package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        // TODO: add password encryption here
        if(PasswordValidator(user.getPassword())) {
            String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
            user.setPassword(hashedPassword);
            userRepository.save(user);
            System.out.println();
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Invalid Password");

    }

    public static boolean PasswordValidator(String password){
        if(password == null){
            System.out.println("Password Field is Empty");
            return false;
        }
        if(password.length() < 8){
            System.out.println("Password is too short! Please enter a password between 8 characters to 20 characters!");
            return false;
        }
        if(password.length() > 20){
            System.out.println("Password is too long! Please enter a password between 8 characters to 20 characters!");
            return false;
        }

        return true;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){

        Optional<User> sqlUser = userRepository.findByUsername(user.getUsername());

        if(sqlUser.isEmpty()){ // Case where username not found
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User not found");
        }

        boolean passwordCheck = BCrypt.checkpw(user.getPassword(), sqlUser.get().getPassword());
        if(!passwordCheck){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Incorrect Password");
        }

        JWTUtility jwtUtility = new JWTUtility();
        String token = jwtUtility.generateToken(user.getUsername());

        return ResponseEntity.ok(token);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> reset(@RequestBody User user){
        System.out.println("[DEBUG] Password reset requested for username: " + user.getUsername());
        System.out.println("[DEBUG] Provided (raw) password: " + user.getPassword());
        Optional<User> sqlUser = userRepository.findByUsername(user.getUsername());

        if(sqlUser.isEmpty()){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("User not found");
        }
        if(BCrypt.checkpw(user.getPassword(), sqlUser.get().getPassword())){
            System.out.println("[ERROR] New password matches the old one (after hashing check).");
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Password must be different");
        }
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        sqlUser.get().setPassword(hashedPassword);
        userRepository.save(sqlUser.get());

        System.out.println("[SUCCESS] Password has been updated for user: " + user.getUsername());
        System.out.println("[DEBUG] New (hashed) password stored: " + hashedPassword);
        return ResponseEntity.ok("Password has been changed");
    }

}
