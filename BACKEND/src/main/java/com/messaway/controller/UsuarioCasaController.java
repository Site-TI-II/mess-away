package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.db.Database;
import com.messaway.model.UsuarioCasa;

import java.sql.*;
// imports trimmed

import static spark.Spark.*;

public class UsuarioCasaController {
    public static void registerRoutes() {
        Gson gson = new Gson();

        // Add/Remove usuários à casa (compatibilidade MessAway e API)

        post("/MessAway/casas/:id/usuarios", (req, res) -> {
            long casaId = Long.parseLong(req.params(":id"));
            UsuarioCasa usuario = gson.fromJson(req.body(), UsuarioCasa.class);
            try (Connection conn = Database.getConnection()) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO USUARIO_CASA (id_usuario, id_casa, permissao) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
                );
                stmt.setLong(1, usuario.getIdUsuario());
                stmt.setLong(2, casaId);
                stmt.setString(3, usuario.getPermissao());
                stmt.executeUpdate();
                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    usuario.setId(rs.getLong(1));
                    usuario.setIdCasa(casaId);
                }
                res.status(201);
                return gson.toJson(usuario);
            }
        });

        post("/api/casas/:id/usuarios", (req, res) -> {
            long casaId = Long.parseLong(req.params(":id"));
            UsuarioCasa usuario = gson.fromJson(req.body(), UsuarioCasa.class);
            try (Connection conn = Database.getConnection()) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO USUARIO_CASA (id_usuario, id_casa, permissao) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
                );
                stmt.setLong(1, usuario.getIdUsuario());
                stmt.setLong(2, casaId);
                stmt.setString(3, usuario.getPermissao());
                stmt.executeUpdate();
                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    usuario.setId(rs.getLong(1));
                    usuario.setIdCasa(casaId);
                }
                res.status(201);
                return gson.toJson(usuario);
            }
        });

        delete("/MessAway/casas/:id/usuarios/:usuarioId", (req, res) -> {
            long usuarioId = Long.parseLong(req.params(":usuarioId"));
            try (Connection conn = Database.getConnection()) {
                PreparedStatement stmt = conn.prepareStatement("DELETE FROM USUARIO_CASA WHERE id_usuario_casa = ?");
                stmt.setLong(1, usuarioId);
                stmt.executeUpdate();
                res.status(204);
                return "";
            }
        });

        delete("/api/casas/:id/usuarios/:usuarioId", (req, res) -> {
            long usuarioId = Long.parseLong(req.params(":usuarioId"));
            try (Connection conn = Database.getConnection()) {
                PreparedStatement stmt = conn.prepareStatement("DELETE FROM USUARIO_CASA WHERE id_usuario_casa = ?");
                stmt.setLong(1, usuarioId);
                stmt.executeUpdate();
                res.status(204);
                return "";
            }
        });
    }
}
