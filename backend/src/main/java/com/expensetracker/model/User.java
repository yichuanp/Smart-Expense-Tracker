package com.expensetracker.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String username;

    private String password;
    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Expense> expenses;

    public User(){}

    // PASSWORD
    public String getPassword(){
        return this.password;
    }
    public void setPassword(String password){
        this.password = password;
    }

    // USERNAME
    public String getUsername(){
        return this.username;
    }
    public void setUsername(String username){
        this.username = username;
    }

    // ID
    public Long getId() {
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }

    // FIRST NAME
    public String getFirstName(){return this.firstName;}
    public void setFirstName(String firstName){this.firstName = firstName;}

    // LAST NAME
    public String getLastName(){return this.lastName;}
    public void setLastName(String lastName){this.lastName = lastName;}

    // EMAIL
    public String getEmail(){return this.email;}
    public void setEmail(String email){this.email = email;}
}
