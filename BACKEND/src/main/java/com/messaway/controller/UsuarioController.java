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
                // Handle duplicate email error gracefully
                if (e.getMessage().contains("duplicate key value violates unique constraint") && 
                    e.getMessage().contains("users_email_key")) {
                    res.status(409); // Conflict
                    return gson.toJson(java.util.Map.of(
                        "error", "email_already_exists", 
                        "message", "Este email já está em uso. Por favor, use outro email."
                    ));
                }
                // Handle other database errors
                res.status(500);
                return gson.toJson(java.util.Map.of(
                    "error", "database_error", 
                    "message", "Erro interno do servidor. Tente novamente."
                ));
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
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        get("/MessAway/usuarios", (req, res) -> {
            try {
                List<Usuario> users = dao.listAll();
                return gson.toJson(users);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // trocar senha por email (simples, sem token)
        post("/MessAway/usuarios/trocar-senha", (req, res) -> {
            try {
                java.util.Map<String, Object> body = gson.fromJson(req.body(), java.util.Map.class);
                String email = (String) body.get("email");
                String newPassword = (String) body.get("newPassword");
                
                // Validate password strength
                if (!com.messaway.util.PasswordUtil.isValidPassword(newPassword)) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("success", false, "error", "A senha deve ter pelo menos 6 caracteres"));
                }

                // Hash the new password
                String hashedPassword = com.messaway.util.PasswordUtil.hashPassword(newPassword);
                
                // Find user by email and update password
                Conta conta = contaDAO.findByEmail(email);
                if (conta == null) {
                    res.status(404);
                    return gson.toJson(java.util.Map.of("success", false, "error", "Usuário não encontrado"));
                }
                
                boolean ok = contaDAO.updatePassword(conta.getIdConta(), hashedPassword);
                if (ok) {
                    res.status(200);
                    return gson.toJson(java.util.Map.of("status", "ok"));
                } else {
                    res.status(404);
                    return gson.toJson(java.util.Map.of("status", "not_found"));
                }
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
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

                // Validate password strength
                if (!com.messaway.util.PasswordUtil.isValidPassword(password)) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("error", "password_too_weak", "message", "A senha deve ter pelo menos 6 caracteres"));
                }

                // Hash the password securely
                String hashedPassword = com.messaway.util.PasswordUtil.hashPassword(password);

                // Simple registration always creates CONTA (and function handles users table)
                String insertContaSql = "INSERT INTO CONTA (nome, email, senha) VALUES (?, ?, ?) RETURNING id_conta";
                Integer createdContaId;
                try (PreparedStatement pst = conn.prepareStatement(insertContaSql)) {
                    pst.setString(1, nome);
                    pst.setString(2, email);
                    pst.setString(3, hashedPassword);
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



                conn.commit();

                // Return created user
                Usuario createdUser = new Usuario(createdContaId, nome, email, password);
                res.status(201);
                
                // Use HashMap instead of Map.of() to allow null values
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("usuario", createdUser);
                response.put("idConta", createdContaId);
                return gson.toJson(response);
            } catch (SQLException e) {
                e.printStackTrace();
                System.err.println("SQL Error: " + e.getMessage());
                System.err.println("SQL State: " + e.getSQLState());
                
                // Handle duplicate email errors specifically
                String errorMsg = e.getMessage();
                if (errorMsg.contains("duplicate key value violates unique constraint")) {
                    if (errorMsg.contains("users_email_key") || errorMsg.contains("email")) {
                        // Extract email from error message if possible
                        String conflictEmail = "email desconhecido"; // fallback
                        if (errorMsg.contains("Key (email)=(") && errorMsg.contains(") already exists")) {
                            try {
                                int start = errorMsg.indexOf("Key (email)=(") + 13;
                                int end = errorMsg.indexOf(")", start);
                                conflictEmail = errorMsg.substring(start, end);
                            } catch (Exception ignored) {}
                        }
                        
                        res.status(409); // Conflict
                        return gson.toJson(java.util.Map.of(
                            "error", "email_already_exists", 
                            "message", "O email '" + conflictEmail + "' já está em uso. Por favor, use outro email."
                        ));
                    }
                }
                
                // Handle other specific database errors
                if (errorMsg.contains("foreign key") || errorMsg.contains("violates foreign key constraint")) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of(
                        "error", "invalid_reference", 
                        "message", "Referência inválida nos dados."
                    ));
                }
                
                // Generic database error
                res.status(500);
                return gson.toJson(java.util.Map.of(
                    "error", "database_error", 
                    "message", "Erro interno do servidor: " + e.getMessage()
                ));
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

                if (u == null) {
                    res.status(401);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }

                // Check if password is hashed (new) or plain text (legacy)
                boolean passwordMatches;
                if (com.messaway.util.PasswordUtil.isBCryptHash(u.getSenha())) {
                    // New secure hashed password
                    passwordMatches = com.messaway.util.PasswordUtil.verifyPassword(password, u.getSenha());
                } else {
                    // Legacy plain text password - migrate to hash after successful login
                    passwordMatches = password.equals(u.getSenha());
                    if (passwordMatches) {
                        // Migrate to hashed password
                        try {
                            String hashedPassword = com.messaway.util.PasswordUtil.hashPassword(password);
                            contaDAO.updatePassword(u.getIdConta(), hashedPassword);
                        } catch (Exception e) {
                            System.err.println("Failed to migrate password to hash for user: " + email);
                        }
                    }
                }

                if (!passwordMatches) {
                    res.status(401);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }

                res.status(200);
                return gson.toJson(u);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", e.getMessage()));
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
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });
    }
}
