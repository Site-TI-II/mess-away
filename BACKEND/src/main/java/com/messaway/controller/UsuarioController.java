package com.messaway.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.messaway.dao.ContaDAO;
import com.messaway.dao.UsuarioDAO;
import com.messaway.db.Database;
import com.messaway.model.Conta;
import com.messaway.model.Usuario;
import com.messaway.util.JsonUtil;

import java.sql.SQLException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.List;

import static spark.Spark.*;
import spark.Route;

public class UsuarioController {
    public static void registerRoutes() {
        Gson gson = new Gson();
        UsuarioDAO dao = new UsuarioDAO();
        ContaDAO contaDAO = new ContaDAO();

        post("/MessAway/usuarios", (req, res) -> {
            Usuario usuario = gson.fromJson(req.body(), Usuario.class);
            try {
                Usuario created = dao.create(usuario);
                res.status(201);
                return gson.toJson(created);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        get("/MessAway/usuarios/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try {
                Usuario u = dao.findById(id);
                if (u == null) {
                    res.status(404);
                    return "";
                }
                return gson.toJson(u);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        get("/MessAway/usuarios", (req, res) -> {
            try {
                List<Usuario> users = dao.listAll();
                return gson.toJson(users);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        // trocar senha por email (simples, sem token)
        post("/MessAway/usuarios/trocar-senha", (req, res) -> {
            try {
                var body = gson.fromJson(req.body(), java.util.Map.class);
                String email = (String) body.get("email");
                String newPassword = (String) body.get("newPassword");
                boolean ok = dao.changePasswordByEmail(email, newPassword);
                if (ok) {
                    res.status(200);
                    return gson.toJson(java.util.Map.of("status", "ok"));
                } else {
                    res.status(404);
                    return gson.toJson(java.util.Map.of("status", "not_found"));
                }
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        // Registro (cria usuário e opcionalmente uma conta ou associa a conta existente)
        Route registerRoute = (req, res) -> {
            try (var conn = Database.getConnection()) {
                conn.setAutoCommit(false);
                JsonObject body = JsonUtil.parse(req.body()).getAsJsonObject();

                String nome = body.has("nome") ? body.get("nome").getAsString() : null;
                String email = body.has("email") ? body.get("email").getAsString() : null;
                String password = body.has("password") ? body.get("password").getAsString() : null;

                if (nome == null || email == null || password == null) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("error", "missing_fields"));
                }

                // Create user
                String insertUserSql = "INSERT INTO USUARIO (nome, email, senha) VALUES (?, ?, ?) RETURNING id_usuario";
                int createdUserId;
                try (PreparedStatement pst = conn.prepareStatement(insertUserSql)) {
                    pst.setString(1, nome);
                    pst.setString(2, email);
                    pst.setString(3, password);
                    try (ResultSet rs = pst.executeQuery()) {
                        if (rs.next()) {
                            createdUserId = rs.getInt(1);
                        } else {
                            conn.rollback();
                            res.status(500);
                            return gson.toJson(java.util.Map.of("error", "failed_create_user"));
                        }
                    }
                }

                Integer createdContaId = null;
                boolean createProfile = false;
                // If request asks to create conta
                if (body.has("conta") && body.getAsJsonObject("conta").has("create") && body.getAsJsonObject("conta").get("create").getAsBoolean()) {
                    JsonObject contaObj = body.getAsJsonObject("conta");
                    String contaNome = contaObj.has("nome") ? contaObj.get("nome").getAsString() : nome + "'s conta";
                    String contaEmail = contaObj.has("email") ? contaObj.get("email").getAsString() : email;
                    String contaSenha = contaObj.has("senha") ? contaObj.get("senha").getAsString() : password;
                    Integer idCasa = contaObj.has("idCasa") && !contaObj.get("idCasa").isJsonNull() ? contaObj.get("idCasa").getAsInt() : null;
                    // optional flag to create initial profile mapping
                    if (contaObj.has("createProfile")) {
                        createProfile = contaObj.get("createProfile").getAsBoolean();
                    }

                    // If no idCasa provided, create a new CASA and set its id to the conta
                    if (idCasa == null) {
                        String insertCasaSql = "INSERT INTO CASA (nome, descricao, endereco) VALUES (?, ?, ?) RETURNING id_casa";
                        try (PreparedStatement pstCasa = conn.prepareStatement(insertCasaSql)) {
                            pstCasa.setString(1, contaNome);
                            pstCasa.setString(2, null);
                            pstCasa.setString(3, null);
                            try (ResultSet rsCasa = pstCasa.executeQuery()) {
                                if (rsCasa.next()) {
                                    idCasa = rsCasa.getInt(1);
                                } else {
                                    conn.rollback();
                                    res.status(500);
                                    return gson.toJson(java.util.Map.of("error", "failed_create_casa"));
                                }
                            }
                        }
                    }

                    String insertContaSql = "INSERT INTO CONTA (nome, email, senha, id_casa) VALUES (?, ?, ?, ?) RETURNING id_conta";
                    try (PreparedStatement pst = conn.prepareStatement(insertContaSql)) {
                        pst.setString(1, contaNome);
                        pst.setString(2, contaEmail);
                        pst.setString(3, contaSenha);
                        if (idCasa != null) pst.setInt(4, idCasa); else pst.setNull(4, Types.INTEGER);
                        try (ResultSet rs = pst.executeQuery()) {
                            if (rs.next()) {
                                createdContaId = rs.getInt(1);
                            } else {
                                conn.rollback();
                                res.status(500);
                                return gson.toJson(java.util.Map.of("error", "failed_create_conta"));
                            }
                        }
                    }
                } else if (body.has("idConta")) {
                    createdContaId = body.get("idConta").getAsInt();
                }

                // If we have a conta id (created or existing), associate user to conta
                if (createdContaId != null && (createProfile || body.has("apelido"))) {
                    String apelido = body.has("apelido") ? body.get("apelido").getAsString() : nome;
                    String cor = body.has("cor") ? body.get("cor").getAsString() : null;
                    String permissao = body.has("permissao") ? body.get("permissao").getAsString() : "morador";

                    String insertMapSql = "INSERT INTO CONTA_USUARIO (id_conta, id_usuario, apelido, cor, permissao) VALUES (?, ?, ?, ?, ?)";
                    try (PreparedStatement pst = conn.prepareStatement(insertMapSql)) {
                        pst.setInt(1, createdContaId);
                        pst.setInt(2, createdUserId);
                        pst.setString(3, apelido);
                        pst.setString(4, cor);
                        pst.setString(5, permissao);
                        pst.executeUpdate();
                    }
                }

                conn.commit();

                // Return created user (fetching via DAO to map fields)
                Usuario createdUser = new Usuario(createdUserId, nome, email, password);
                res.status(201);
                return gson.toJson(java.util.Map.of("usuario", createdUser, "idConta", createdContaId));
            } catch (SQLException e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        };
        // Support both /MessAway and /api paths (backward compatibility)
        post("/MessAway/auth/register", registerRoute);
        post("/api/auth/register", registerRoute);

    // login simples: verifica email+password, seta cookie userId
        Route loginRoute = (req, res) -> {
            try {
                java.util.Map<String, Object> body = gson.fromJson(req.body(), java.util.Map.class);
                String email = (String) body.get("email");
                String password = (String) body.get("password");

                // Invalid args
                if (email == null || password == null) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("authenticated", false, "reason", "missing_fields"));
                }

                Conta u = contaDAO.findByEmail(email);

                if (u == null || !password.equals(u.getSenha())) {
                    res.status(401);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }

                res.status(200);
                return gson.toJson(u);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        };
        // Support both /MessAway and /api paths
        post("/MessAway/auth/login", loginRoute);
        post("/api/auth/login", loginRoute);

        // logout: remove cookie
        post("/MessAway/logout", (req, res) -> {
            res.removeCookie("userId");
            res.status(204);
            return "";
        });

        // check auth status: returns { authenticated: boolean, usuario?: {...} }
        get("/MessAway/auth/status", (req, res) -> {
            try {
                String userId = req.cookie("userId");
                if (userId == null) {
                    res.status(200);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }
                long id = Long.parseLong(userId);
                Usuario u = dao.findById(id);
                if (u == null) {
                    res.status(200);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }
                res.status(200);
                return gson.toJson(java.util.Map.of("authenticated", true, "usuario", u));
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });
    }
}
