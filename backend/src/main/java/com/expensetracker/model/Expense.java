package com.expensetracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="expense")
public class Expense {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private Double amount;
    private String category;
    private LocalDate date;
    private Boolean recurring;

    @ManyToOne
    private User user;

    // Setters
    public void setUser(User user){
        this.user = user;
    }
    public void setId(Long id){
        this.id = id;
    }
    public void setTitle(String title){
        this.title = title;
    }
    public void setAmount(Double amount){
        this.amount = amount;
    }
    public void setCategory(String category){
        this.category = category;
    }
    public void setDate(LocalDate date){
        this.date = date;
    }
    public void setRecurring(Boolean recurring){
        this.recurring = recurring;
    }

    // Getters
    public User getUser(){
        return this.user;
    }
    public Long getId(){
        return this.id;
    }
    public String getTitle(){
        return this.title;
    }
    public Double getAmount(){
        return this.amount;
    }
    public String getCategory(){
        return this.category;
    }
    public LocalDate getDate(){
        return this.date;
    }
    public Boolean getRecurring(){
        return this.recurring;
    }

}
