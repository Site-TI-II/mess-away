package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.dao.InsightDAO;
import com.messaway.model.Insight;

import java.sql.SQLException;

import static spark.Spark.*;

public class InsightController {
    
    public static void registerRoutes() {
        Gson gson = new Gson();
        InsightDAO dao = new InsightDAO();

        // Listar todos os insights ativos
        get("/MessAway/insights", (req, res) -> {
            try {
                String type = req.queryParams("type");
                if (type != null && !type.isEmpty()) {
                    return gson.toJson(dao.listByType(type));
                }
                return gson.toJson(dao.listAll());
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        // Obter insight específico
        get("/MessAway/insights/:id", (req, res) -> {
            try {
                long id = Long.parseLong(req.params(":id"));
                Insight insight = dao.findById(id);
                if (insight == null) {
                    res.status(404);
                    return "";
                }
                return gson.toJson(insight);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });

        // Criar novo insight
        post("/MessAway/insights", (req, res) -> {
            try {
                Insight insight = gson.fromJson(req.body(), Insight.class);
                Insight created = dao.create(insight);
                res.status(201);
                return gson.toJson(created);
            } catch (SQLException e) {
                res.status(500);
                return gson.toJson(new Error("DB error: " + e.getMessage()));
            }
        });
    }
}