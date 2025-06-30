package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ExpControllerTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpController expController;

    private JWTUtility jwtUtility;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        jwtUtility = new JWTUtility();
        expController = new ExpController(expenseRepository, userRepository, jwtUtility);
    }

    @Test
    public void testGetAllExpenses_Success() {
        String username = "testuser";
        String token = jwtUtility.generateToken(username);

        User user = new User();
        user.setUsername(username);
        user.setId(1L);

        Expense expense = new Expense();
        expense.setId(100L);
        expense.setUser(user);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(expenseRepository.findByUser(user)).thenReturn(List.of(expense));

        ResponseEntity<List<Expense>> response = expController.getAllExpenses(token);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    public void testGetAllExpenses_UserNotFound() {
        String token = jwtUtility.generateToken("unknown");

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        ResponseEntity<List<Expense>> response = expController.getAllExpenses(token);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testAddExpense_Success() {
        String username = "testuser";
        String token = jwtUtility.generateToken(username);

        User user = new User();
        user.setUsername(username);
        user.setId(1L);

        Expense expense = new Expense();
        expense.setTitle("Lunch");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        ResponseEntity<Expense> response = expController.addExpense(expense, token);

        assertEquals(200, response.getStatusCodeValue());
        verify(expenseRepository, times(1)).save(expense);
    }

    @Test
    public void testAddExpense_UserNotFound() {
        String token = jwtUtility.generateToken("unknown");
        Expense expense = new Expense();

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        ResponseEntity<Expense> response = expController.addExpense(expense, token);

        assertEquals(401, response.getStatusCodeValue());
        verify(expenseRepository, never()).save(any());
    }

    @Test
    public void testRemoveMultiple_Success() {
        String username = "testuser";
        String token = jwtUtility.generateToken(username);

        User user = new User();
        user.setUsername(username);
        user.setId(1L);

        Expense exp1 = new Expense();
        exp1.setId(1L);
        exp1.setUser(user);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(exp1));

        boolean result = expController.removeMultipleExpenses(List.of(1L), token);

        assertTrue(result);
        verify(expenseRepository, times(1)).delete(exp1);
    }

    @Test
    public void testRemoveMultiple_UserNotFound() {
        String token = jwtUtility.generateToken("unknown");

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> expController.removeMultipleExpenses(List.of(1L), token));
    }
}
