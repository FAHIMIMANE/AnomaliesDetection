package com.ace.userservice.ws;

import com.ace.userservice.entity.Role;
import com.ace.userservice.entity.User;
import com.ace.userservice.repository.RoleRepository;
import com.ace.userservice.service.AuthService;
import com.ace.userservice.service.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // Persist roles first
        Set<Role> roleSet = new HashSet<>();
        for (Role role : user.getRoles()) {
            Role existingRole = roleRepository.findByName(role.getName());
            if (existingRole == null) {
                existingRole = roleRepository.save(new Role(role.getName()));
            }
            roleSet.add(existingRole);
        }
        user.setRoles(roleSet);

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        authService.saveUser(user);
        kafkaProducerService.sendMessage("user-service-topic", "User registered: " + user.getUsername());

        return "User registered successfully!";
    }
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        User user = authService.findByUsername(username);
        if (passwordEncoder.matches(password, user.getPassword())) {
            kafkaProducerService.sendMessage("user-service-topic", "User logged in: " + username);
            return "Login successful!";
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
