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
                // Enforce max 7 users per casa
                try (PreparedStatement chk = conn.prepareStatement("SELECT COUNT(*) FROM USUARIO_CASA WHERE id_casa = ?")) {
                    chk.setLong(1, casaId);
                    try (ResultSet crs = chk.executeQuery()) {
                        if (crs.next() && crs.getInt(1) >= 7) {
                            res.status(400);
                            return gson.toJson(java.util.Map.of("error", "limite_casa_usuarios", "message", "A casa atingiu o limite de 7 usuários"));
                        }
                    }
                }
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

        // Cria um novo usuário e associa à casa
        post("/api/casas/:id/usuarios/create", (req, res) -> {
            long casaId = Long.parseLong(req.params(":id"));
            var body = gson.fromJson(req.body(), java.util.Map.class);
            String nome = body != null ? (String) body.get("nome") : null;
            String email = body != null ? (String) body.get("email") : null;
            String senha = body != null ? (String) body.get("senha") : null;
            String permissao = body != null && body.get("permissao") != null ? (String) body.get("permissao") : "Membro";

            if (nome == null || nome.isBlank() || email == null || email.isBlank() || senha == null || senha.isBlank()) {
                res.status(400);
                return gson.toJson(java.util.Map.of("error", "missing_fields", "message", "nome, email e senha são obrigatórios"));
            }

            try (Connection conn = Database.getConnection()) {
                conn.setAutoCommit(false);

                // Limite de 7 usuários por casa
                try (PreparedStatement chk = conn.prepareStatement("SELECT COUNT(*) FROM USUARIO_CASA WHERE id_casa = ?")) {
                    chk.setLong(1, casaId);
                    try (ResultSet crs = chk.executeQuery()) {
                        if (crs.next() && crs.getInt(1) >= 7) {
                            conn.rollback();
                            res.status(400);
                            return gson.toJson(java.util.Map.of("error", "limite_casa_usuarios", "message", "A casa atingiu o limite de 7 usuários"));
                        }
                    }
                }

                // Verifica se email já existe
                Long existingId = null;
                try (PreparedStatement ps = conn.prepareStatement("SELECT id_usuario FROM USUARIO WHERE LOWER(email) = LOWER(?) LIMIT 1")) {
                    ps.setString(1, email);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) existingId = rs.getLong(1);
                    }
                }
                if (existingId != null) {
                    conn.rollback();
                    res.status(409);
                    return gson.toJson(java.util.Map.of("error", "usuario_ja_existe", "message", "Já existe um usuário com este e-mail"));
                }

                // Cria usuário
                Long novoUsuarioId = null;
                try (PreparedStatement ins = conn.prepareStatement(
                        "INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?) RETURNING id_usuario")) {
                    ins.setString(1, nome);
                    ins.setString(2, email);
                    ins.setString(3, senha);
                    try (ResultSet rs = ins.executeQuery()) {
                        if (rs.next()) novoUsuarioId = rs.getLong(1);
                    }
                }

                if (novoUsuarioId == null) {
                    conn.rollback();
                    res.status(500);
                    return gson.toJson(java.util.Map.of("error", "failed_create_usuario"));
                }

                // Associa à casa
                try (PreparedStatement map = conn.prepareStatement(
                        "INSERT INTO USUARIO_CASA (id_usuario, id_casa, permissao) VALUES (?, ?, ?)")) {
                    map.setLong(1, novoUsuarioId);
                    map.setLong(2, casaId);
                    map.setString(3, permissao);
                    map.executeUpdate();
                }

                conn.commit();
                res.status(201);
                return gson.toJson(java.util.Map.of(
                        "idUsuario", novoUsuarioId,
                        "nome", nome,
                        "email", email,
                        "permissao", permissao
                ));
            }
        });
        post("/api/casas/:id/usuarios", (req, res) -> {
            long casaId = Long.parseLong(req.params(":id"));
            UsuarioCasa usuario = gson.fromJson(req.body(), UsuarioCasa.class);
            try (Connection conn = Database.getConnection()) {
                // Enforce max 7 users per casa
                try (PreparedStatement chk = conn.prepareStatement("SELECT COUNT(*) FROM USUARIO_CASA WHERE id_casa = ?")) {
                    chk.setLong(1, casaId);
                    try (ResultSet crs = chk.executeQuery()) {
                        if (crs.next() && crs.getInt(1) >= 7) {
                            res.status(400);
                            return gson.toJson(java.util.Map.of("error", "limite_casa_usuarios", "message", "A casa atingiu o limite de 7 usuários"));
                        }
                    }
                }
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
