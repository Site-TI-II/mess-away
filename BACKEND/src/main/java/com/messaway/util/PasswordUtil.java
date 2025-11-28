package com.messaway.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Utilities for secure password handling using BCrypt
 */
public class PasswordUtil {
    
    // BCrypt work factor (cost parameter)
    // 12 provides good security while maintaining reasonable performance
    private static final int WORK_FACTOR = 12;
    
    /**
     * Hash a password using BCrypt
     * @param plainPassword The plain text password
     * @return The hashed password
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(WORK_FACTOR));
    }
    
    /**
     * Verify a password against its hash
     * @param plainPassword The plain text password to verify
     * @param hashedPassword The stored hashed password
     * @return true if the password matches, false otherwise
     */
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (IllegalArgumentException e) {
            // Invalid hash format or other BCrypt errors
            return false;
        }
    }
    
    /**
     * Check if a password meets minimum security requirements
     * @param password The password to validate
     * @return true if password is valid, false otherwise
     */
    public static boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }
        
        // Minimum requirements:
        // - At least 6 characters
        // - Contains at least one number or special character (optional for now)
        return password.length() >= 6;
    }
    
    /**
     * Check if a string looks like a BCrypt hash
     * @param password The string to check
     * @return true if it looks like a BCrypt hash, false otherwise
     */
    public static boolean isBCryptHash(String password) {
        return password != null && password.startsWith("$2a$") && password.length() == 60;
    }
}