package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Conta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ContaDAO {
    public Conta findByEmail(String email) throws SQLException {
        String sql = "select id_conta, nome, email, senha, data_cadastro, id_casa, ativo from conta WHERE email = ?";

        try (Connection conn = Database.connect(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Conta(rs.getInt("id_conta"),  rs.getString("nome"), rs.getString("email"),
                            rs.getString("senha"), rs.getTimestamp("data_cadastro"), rs.getInt("id_casa"),
                            rs.getBoolean("ativo"));
                }

                return null;
            }
        }
    }
}
