package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JWTUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/exp")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final JWTUtility jwtUtility;

    @Autowired
    public ExpController(ExpenseRepository expenseRepository, UserRepository userRepository, JWTUtility jwtUtility) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/returnExpenses")
    public ResponseEntity<List<Expense>> getAllExpenses(@RequestParam String token) {
        String username = jwtUtility.getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Expense> expenses = expenseRepository.findByUser(user.get());
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/addExpense")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense, @RequestParam String token) {
        String username = jwtUtility.getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        expense.setUser(user.get());
        expenseRepository.save(expense);
        return ResponseEntity.ok(expense);
    }

    @PostMapping("/removeMultiple")
    public boolean removeMultipleExpenses(@RequestBody List<Long> ids, @RequestParam String token) {
        String username = jwtUtility.getUsernameFromToken(token);
        if (username == null) {
            throw new RuntimeException("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        ids.forEach(id -> {
            Optional<Expense> exp = expenseRepository.findById(id);
            exp.ifPresent(e -> {
                if (e.getUser().getId() != null && e.getUser().getId().equals(user.getId())) {
                    expenseRepository.delete(e);
                }
            });
        });

        return true;
    }
}
