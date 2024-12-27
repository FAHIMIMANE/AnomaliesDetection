package com.ace.userservice;

import com.ace.userservice.entity.Role;
import com.ace.userservice.entity.User;
import com.ace.userservice.repository.RoleRepository;
import com.ace.userservice.repository.UserRepository;
import com.ace.userservice.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.Set;

@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }





    @Bean
    public CommandLineRunner setupDefaultUsers(
            UserRepository userRepository,
            RoleRepository roleRepository,
            AuthService authService,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // Ensure roles exist
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");
            if (adminRole == null) {
                adminRole = roleRepository.save(new Role("ROLE_ADMIN"));
            }

            Role userRole = roleRepository.findByName("ROLE_USER");
            if (userRole == null) {
                userRole = roleRepository.save(new Role("ROLE_USER"));
            }

            // Check if "admin" user exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("123456789"));
                admin.setRoles(Set.of(adminRole));
                authService.saveUser(admin);
                System.out.println("Admin user created: admin / 123456789");
            }

            // Check if "user1", "user2", "user3" exist
            List<String> usernames = List.of("user1", "user2", "user3");
            for (String username : usernames) {
                if (userRepository.findByUsername(username).isEmpty()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setPassword(passwordEncoder.encode("123456789"));
                    user.setRoles(Set.of(userRole));
                    authService.saveUser(user);
                    System.out.println("User created: " + username);
                }
            }
        };
    }

}
