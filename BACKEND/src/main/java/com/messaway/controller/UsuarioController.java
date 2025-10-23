package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.dao.UsuarioDAO;
import com.messaway.model.Usuario;

import java.sql.SQLException;
import java.util.List;

import static spark.Spark.*;

public class UsuarioController {
    public static void registerRoutes() {
        Gson gson = new Gson();
        UsuarioDAO dao = new UsuarioDAO();

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

        // login simples: verifica email+password, seta cookie userId
        post("/api/auth/login", (req, res) -> {
            try {
                java.util.Map body = gson.fromJson(req.body(), java.util.Map.class);
                String email = (String) body.get("email");
                String password = (String) body.get("password");
                if (email == null || password == null) {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("authenticated", false, "reason", "missing_fields"));
                }
                Usuario u = dao.findByEmail(email);
                if (u == null || !password.equals(u.getPassword())) {
                    res.status(401);
                    return gson.toJson(java.util.Map.of("authenticated", false));
                }
                // set cookie (simple session)
                res.cookie("userId", String.valueOf(u.getId()));
                res.status(200);
                return gson.toJson(java.util.Map.of("authenticated", true, "usuario", u));
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

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
