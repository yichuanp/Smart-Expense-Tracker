package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthController authController;
    private UserRepository userRepository;
    private JWTUtility jwtUtility;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
        jwtUtility = new JWTUtility();  // Real instance — no mock!

        authController = new AuthController(userRepository, jwtUtility);
    }

    @Test
    void testRegister_Success() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("validPass123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        ResponseEntity<?> response = authController.register(user);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof User);
    }

    @Test
    void testRegister_UsernameConflict() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(new User()));

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("validPass123");

        ResponseEntity<?> response = authController.register(user);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Username already exists", response.getBody());
    }

    @Test
    void testRegister_InvalidPassword() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("short");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.register(user);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Invalid Password", response.getBody());
    }

    @Test
    void testLogin_Success() {
        User dbUser = new User();
        dbUser.setUsername("testuser");
        dbUser.setPassword(BCrypt.hashpw("correctPass", BCrypt.gensalt()));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(dbUser));

        User inputUser = new User();
        inputUser.setUsername("testuser");
        inputUser.setPassword("correctPass");

        ResponseEntity<?> response = authController.login(inputUser);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof String);  // Token string
    }

    @Test
    void testLogin_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        User inputUser = new User();
        inputUser.setUsername("unknown");
        inputUser.setPassword("somePass");

        ResponseEntity<?> response = authController.login(inputUser);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testLogin_IncorrectPassword() {
        User dbUser = new User();
        dbUser.setUsername("testuser");
        dbUser.setPassword(BCrypt.hashpw("correctPass", BCrypt.gensalt()));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(dbUser));

        User inputUser = new User();
        inputUser.setUsername("testuser");
        inputUser.setPassword("wrongPass");

        ResponseEntity<?> response = authController.login(inputUser);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Incorrect Password", response.getBody());
    }

    @Test
    void testReset_Success() {
        User dbUser = new User();
        dbUser.setUsername("testuser");
        dbUser.setPassword(BCrypt.hashpw("oldPass", BCrypt.gensalt()));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(dbUser));
        when(userRepository.save(any(User.class))).thenReturn(dbUser);

        User inputUser = new User();
        inputUser.setUsername("testuser");
        inputUser.setPassword("newPass123");

        ResponseEntity<?> response = authController.reset(inputUser);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Password has been changed", response.getBody());
    }

    @Test
    void testReset_UserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        User inputUser = new User();
        inputUser.setUsername("unknown");
        inputUser.setPassword("newPass123");

        ResponseEntity<?> response = authController.reset(inputUser);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testReset_SamePassword() {
        String hashed = BCrypt.hashpw("samePass", BCrypt.gensalt());
        User dbUser = new User();
        dbUser.setUsername("testuser");
        dbUser.setPassword(hashed);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(dbUser));

        User inputUser = new User();
        inputUser.setUsername("testuser");
        inputUser.setPassword("samePass");

        ResponseEntity<?> response = authController.reset(inputUser);

        assertEquals(409, response.getStatusCodeValue());
        assertEquals("Password must be different", response.getBody());
    }
}
