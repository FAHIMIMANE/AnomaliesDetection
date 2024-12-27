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

    // Secret key to sign the JWT (must match with Gateway)
    private static final String SECRET_KEY = "ana"; // Make sure it's the same as used in the Gateway

    // Generate a JWT token with username and roles
    public String generateToken(String username, Set<?> roles) {
        long expirationTime = 1000 * 60 * 60; // 1 hour
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    // Validate a JWT token and extract the claims
    public Claims validateToken(String token) {
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)); // Get the signing key
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody(); // Validate the token
    }
}
