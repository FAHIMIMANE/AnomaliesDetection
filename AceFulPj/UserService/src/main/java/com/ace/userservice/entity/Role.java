package com.ace.userservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles") // Explicit table name for clarity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // Role name must be unique and non-null
    private String name;

    // Default constructor required by JPA
    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
