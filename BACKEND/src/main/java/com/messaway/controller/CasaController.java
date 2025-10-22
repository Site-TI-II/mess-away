package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.db.Database;
import com.messaway.model.Casa;
import spark.Request;
import spark.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.*;

public class CasaController {
    public static void registerRoutes() {
        Gson gson = new Gson();

        post("/MessAway/casas", (req, res) -> {
            Casa casa = gson.fromJson(req.body(), Casa.class);
            try (Connection conn = Database.connect()) {
                PreparedStatement stmt = conn.prepareStatement("INSERT INTO CASA (nome) VALUES (?)", Statement.RETURN_GENERATED_KEYS);
                stmt.setString(1, casa.getNome());
                stmt.executeUpdate();
                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    casa.setId(rs.getLong(1));
                }
                res.status(201);
                return gson.toJson(casa);
            }
        });

        get("/MessAway/casas", (req, res) -> {
            List<Casa> casas = new ArrayList<>();
            try (Connection conn = Database.connect()) {
                ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM CASA");
                while (rs.next()) {
                    casas.add(new Casa(rs.getLong("id"), rs.getString("nome")));
                }
            }
            return gson.toJson(casas);
        });

        delete("/MessAway/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                PreparedStatement stmt = conn.prepareStatement("DELETE FROM CASA WHERE id = ?");
                stmt.setLong(1, id);
                stmt.executeUpdate();
                res.status(204);
                return "";
            }
        });
    }
}
