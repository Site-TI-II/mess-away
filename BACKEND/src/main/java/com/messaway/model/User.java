package com.messaway.model;

import java.sql.Timestamp;
import java.util.Map;

/**
 * User model for simplified schema
 * Replaces: Usuario, Conta, ContaUsuario
 */
public class User {
    private Integer id;
    private String email;
    private String passwordHash;
    private String fullName;
    private String displayName;
    private String avatarUrl;
    private Boolean isAdmin;
    private Map<String, Object> settings;
    private Timestamp createdAt;
    private Timestamp lastActive;
    private Boolean active;

    // Constructors
    public User() {}

    public User(String email, String passwordHash, String fullName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.active = true;
        this.isAdmin = false;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getLastActive() {
        return lastActive;
    }

    public void setLastActive(Timestamp lastActive) {
        this.lastActive = lastActive;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    // Legacy compatibility methods for old API
    public String getNome() {
        return fullName;
    }

    public void setNome(String nome) {
        this.fullName = nome;
    }

    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
    }

    public long getIdUsuario() {
        return id != null ? id.longValue() : 0L;
    }

    public void setIdUsuario(long idUsuario) {
        this.id = (int) idUsuario;
    }
}