package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.dao.AchievementDAO;
import com.messaway.model.Achievement;

import java.sql.SQLException;

import static spark.Spark.*;

public class AchievementController {
    
    public static void registerRoutes() {
        Gson gson = new Gson();
        AchievementDAO dao = new AchievementDAO();

        // Listar todas as conquistas
        get("/MessAway/achievements", (req, res) -> {
            try {
                return gson.toJson(dao.listAll());
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // Obter conquista específica
        get("/MessAway/achievements/:id", (req, res) -> {
            try {
                long id = Long.parseLong(req.params(":id"));
                Achievement achievement = dao.findById(id);
                if (achievement == null) {
                    res.status(404);
                    return "";
                }
                return gson.toJson(achievement);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // Listar conquistas de um usuário
        get("/MessAway/usuarios/:id/achievements", (req, res) -> {
            try {
                long userId = Long.parseLong(req.params(":id"));
                return gson.toJson(dao.listUserAchievements(userId));
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // Listar conquistas de uma casa
        get("/MessAway/casas/:id/achievements", (req, res) -> {
            try {
                long casaId = Long.parseLong(req.params(":id"));
                return gson.toJson(dao.listCasaAchievements(casaId));
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // Criar nova conquista (admin)
        post("/MessAway/achievements", (req, res) -> {
            try {
                Achievement achievement = gson.fromJson(req.body(), Achievement.class);
                Achievement created = dao.create(achievement);
                res.status(201);
                return gson.toJson(created);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });

        // Desbloquear conquista para um usuário
        post("/MessAway/usuarios/:userId/achievements/:achievementId/unlock", (req, res) -> {
            try {
                long userId = Long.parseLong(req.params(":userId"));
                long achievementId = Long.parseLong(req.params(":achievementId"));
                
                boolean unlocked = dao.unlockAchievement(userId, achievementId);
                if (unlocked) {
                    res.status(201);
                    return gson.toJson(java.util.Map.of("status", "unlocked"));
                } else {
                    res.status(400);
                    return gson.toJson(java.util.Map.of("status", "failed"));
                }
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(java.util.Map.of("error", "DB error: " + e.getMessage()));
            }
        });
    }
}