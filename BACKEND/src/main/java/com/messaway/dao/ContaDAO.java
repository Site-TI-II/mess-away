package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Conta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ContaDAO {
    public Conta findByEmail(String email) throws SQLException {
        String sql = "select id_conta, nome, email, senha, data_criacao, id_casa, ativo from conta WHERE email = ?";

        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Conta(rs.getInt("id_conta"),  rs.getString("nome"), rs.getString("email"),
                            rs.getString("senha"), rs.getTimestamp("data_criacao"), rs.getInt("id_casa"),
                            rs.getBoolean("ativo"));
                }

                return null;
            }
        }
    }

    /**
     * Update user password with a new hashed password
     * @param idConta The account ID
     * @param hashedPassword The new hashed password
     * @return true if update was successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean updatePassword(int idConta, String hashedPassword) throws SQLException {
        String sql = "UPDATE CONTA SET senha = ? WHERE id_conta = ?";

        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, hashedPassword);
            stmt.setInt(2, idConta);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}
