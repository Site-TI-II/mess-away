package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.db.Database;
import com.messaway.model.UsuarioCasa;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.*;

public class UsuarioCasaController {
    public static void registerRoutes() {
        Gson gson = new Gson();

        post("/MessAway/casas/:id/usuarios", (req, res) -> {
            long casaId = Long.parseLong(req.params(":id"));
            UsuarioCasa usuario = gson.fromJson(req.body(), UsuarioCasa.class);
            try (Connection conn = Database.connect()) {
                PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO USUARIO_CASA (nome, papel, casa_id) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
                );
                stmt.setString(1, usuario.getNome());
                stmt.setString(2, usuario.getPapel());
                stmt.setLong(3, casaId);
                stmt.executeUpdate();
                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    usuario.setId(rs.getLong(1));
                    usuario.setCasaId(casaId);
                }
                res.status(201);
                return gson.toJson(usuario);
            }
        });

        delete("/MessAway/casas/:id/usuarios/:usuarioId", (req, res) -> {
            long usuarioId = Long.parseLong(req.params(":usuarioId"));
            try (Connection conn = Database.connect()) {
                PreparedStatement stmt = conn.prepareStatement("DELETE FROM USUARIO_CASA WHERE id = ?");
                stmt.setLong(1, usuarioId);
                stmt.executeUpdate();
                res.status(204);
                return "";
            }
        });
    }
}
