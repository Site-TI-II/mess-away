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
    }
}
