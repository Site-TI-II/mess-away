package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Usuario;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    public Usuario create(Usuario usuario) throws SQLException {
        // Database schema uses table USUARIO with columns (id_usuario, nome, email, senha)
        String sql = "INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?)";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getPassword());
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
        String sql = "SELECT id_usuario, nome, email, senha FROM USUARIO WHERE id_usuario = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(rs.getLong("id_usuario"), rs.getString("nome"), rs.getString("email"), rs.getString("senha"));
                }
                return null;
            }
        }
    }

    public Usuario findByEmail(String email) throws SQLException {
        String sql = "SELECT id_usuario, nome, email, senha FROM USUARIO WHERE email = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(rs.getLong("id_usuario"), rs.getString("nome"), rs.getString("email"), rs.getString("senha"));
                }
                return null;
            }
        }
    }

    public List<Usuario> listAll() throws SQLException {
        String sql = "SELECT id_usuario, nome, email, senha FROM USUARIO ORDER BY id_usuario";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
            List<Usuario> users = new ArrayList<>();
            while (rs.next()) {
                users.add(new Usuario(rs.getLong("id_usuario"), rs.getString("nome"), rs.getString("email"), rs.getString("senha")));
            }
            return users;
        }
    }

    public boolean update(Usuario usuario) throws SQLException {
        String sql = "UPDATE USUARIO SET nome = ?, email = ?, senha = ? WHERE id_usuario = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getPassword());
            stmt.setLong(4, usuario.getId());
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean delete(long id) throws SQLException {
        String sql = "DELETE FROM USUARIO WHERE id_usuario = ?";
        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
}
