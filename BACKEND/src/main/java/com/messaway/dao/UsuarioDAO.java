package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Usuario;


import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    public Usuario create(Usuario usuario) throws SQLException {
        // NEW SCHEMA: users table with simplified structure
        String sql = "INSERT INTO users (email, password_hash, full_name, display_name) VALUES (?, ?, ?, ?)";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, usuario.getEmail());
            stmt.setString(2, usuario.getPassword());
            stmt.setString(3, usuario.getNome());
            stmt.setString(4, usuario.getNome()); // Use same name for display
            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    usuario.setId(rs.getLong(1));
                }
            }
            return usuario;
        }
    }

    public Usuario findById(long id) throws SQLException {
        // NEW SCHEMA: Query users table
        String sql = "SELECT id, email, password_hash, full_name FROM users WHERE id = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(rs.getLong("id"), rs.getString("full_name"), rs.getString("email"), rs.getString("password_hash"));
                }
                return null;
            }
        }
    }

    public Usuario findByEmail(String email) throws SQLException {
        // NEW SCHEMA: Query users table
        String sql = "SELECT id, email, password_hash, full_name FROM users WHERE email = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(rs.getLong("id"), rs.getString("full_name"), rs.getString("email"), rs.getString("password_hash"));
                }
                return null;
            }
        }
    }

    public List<Usuario> listAll() throws SQLException {
        // NEW SCHEMA: Query users table
        String sql = "SELECT id, email, password_hash, full_name FROM users WHERE active = TRUE ORDER BY id";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
            List<Usuario> users = new ArrayList<>();
            while (rs.next()) {
                users.add(new Usuario(rs.getLong("id"), rs.getString("full_name"), rs.getString("email"), rs.getString("password_hash")));
            }
            return users;
        }
    }

    public boolean update(Usuario usuario) throws SQLException {
        // NEW SCHEMA: Update users table
        String sql = "UPDATE users SET full_name = ?, email = ?, password_hash = ?, last_active = CURRENT_TIMESTAMP WHERE id = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getPassword());
            stmt.setLong(4, usuario.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean delete(long id) throws SQLException {
        // NEW SCHEMA: Soft delete by setting active = FALSE
        String sql = "UPDATE users SET active = FALSE WHERE id = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean changePasswordByEmail(String email, String newPassword) throws SQLException {
        // NEW SCHEMA: Update password in users table
        String sql = "UPDATE users SET password_hash = ?, last_active = CURRENT_TIMESTAMP WHERE email = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, newPassword);
            stmt.setString(2, email);
            return stmt.executeUpdate() > 0;
        }
    }
}
