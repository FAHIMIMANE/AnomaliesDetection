package com.ace.userservice.config;

import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Set;

@Component
public class JwtUtils {

    // Use a longer and more secure secret key
    private static final String SECRET_KEY = "your-secure-long-secret-key-32-characters-or-more"; 

    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Generate a JWT token with username and roles
    public String generateToken(String username, Set<?> roles) {
        long expirationTime = 1000 * 60 * 60; // 1 hour
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256) // Use the secure signing key
                .compact();
    }

    // Validate a JWT token and extract the claims
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY) // Use the secure signing key
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
