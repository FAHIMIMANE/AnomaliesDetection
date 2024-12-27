package com.ace.userservice.ws;

import com.ace.userservice.entity.Role;
import com.ace.userservice.entity.User;
import com.ace.userservice.config.JwtUtils;
import com.ace.userservice.repository.RoleRepository;
import com.ace.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Initialize roles if null
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                throw new IllegalArgumentException("At least one role is required for registration.");
            }

            // Convert roles (as strings) to Role entities and save them if they do not exist
            Set<Role> roleSet = new HashSet<>();
            for (Role role : user.getRoles()) {
                if (role.getName() == null || role.getName().isEmpty()) {
                    return ResponseEntity.badRequest().body("Role name cannot be null or empty.");
                }
                Role existingRole = roleRepository.findByName(role.getName());
                if (existingRole == null) {
                    existingRole = roleRepository.save(new Role(role.getName()));
                }
                roleSet.add(existingRole);
            }
            user.setRoles(roleSet);

            // Save user
            userService.saveUser(user);
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username cannot be null or empty."));
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password cannot be null or empty."));
            }

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found."));
            }

            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtils.generateToken(username, user.getRoles());
                return ResponseEntity.ok(Map.of("token", token, "roles", user.getRoles()));
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials."));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An error occurred during login."));
        }
    }

}
