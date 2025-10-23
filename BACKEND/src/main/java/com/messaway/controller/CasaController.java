package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.db.Database;
import com.messaway.model.Casa;
import com.messaway.model.ErrorResponse;
import spark.Request;
import spark.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.*;

public class CasaController {
    public static void registerRoutes() {
        Gson gson = new Gson();
        
        // Defer CORS header management to Main.java (global before filter).
        // Still respond to OPTIONS preflight requests here if required by specific routes.
        options("/*", (request, response) -> {
            // Let Main.java set the standard CORS headers. For preflight, reply OK.
            response.status(200);
            return "OK";
        });

        // Set default response content type for this controller's routes
        before((request, response) -> {
            response.type("application/json");
        });

        post("/MessAway/casas", (req, res) -> {
            res.type("application/json");
            try {
                System.out.println("Headers: " + req.headers());
                System.out.println("Body recebido: " + req.body());
                Casa casa = gson.fromJson(req.body(), Casa.class);
                System.out.println("Casa objeto: " + gson.toJson(casa));
                
                try (Connection conn = Database.connect()) {
                    // Ajustando para corresponder ao schema do banco de dados
                    PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO CASA (nome, descricao, endereco, ativo, data_criacao) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                        Statement.RETURN_GENERATED_KEYS
                    );
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setBoolean(4, true);
                    
                    System.out.println("Executando query: INSERT INTO CASA (nome, descricao, endereco, ativo) VALUES ('"
                        + casa.getNome() + "', '"
                        + (casa.getDescricao() != null ? casa.getDescricao() : "") + "', '"
                        + (casa.getEndereco() != null ? casa.getEndereco() : "") + "', true)");
                    
                    int affectedRows = stmt.executeUpdate();
                    if (affectedRows == 0) {
                        throw new SQLException("Creating casa failed, no rows affected.");
                    }
                    
                    ResultSet rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        casa.setId(rs.getLong(1));
                        System.out.println("Casa criada com sucesso. ID: " + casa.getId());
                    } else {
                        throw new SQLException("Creating casa failed, no ID obtained.");
                    }
                    
                    res.status(201);
                    return gson.toJson(casa);
                } catch (SQLException e) {
                    System.err.println("Erro ao criar casa no banco: " + e.getMessage());
                    e.printStackTrace(); // Adiciona stack trace completo
                    res.status(500);
                    return gson.toJson(new ErrorResponse("Erro ao criar casa: " + e.getMessage()));
                }
            } catch (Exception e) {
                System.err.println("Erro ao processar requisição: " + e.getMessage());
                e.printStackTrace(); // Adiciona stack trace completo
                res.status(400);
                return gson.toJson(new ErrorResponse("Erro ao processar requisição: " + e.getMessage()));
            }
        });

        get("/MessAway/casas", (req, res) -> {
            List<Casa> casas = new ArrayList<>();
            try (Connection conn = Database.connect()) {
                ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM CASA WHERE ativo = true");
                while (rs.next()) {
                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                    casa.setDescricao(rs.getString("descricao"));
                    casa.setEndereco(rs.getString("endereco"));
                    casa.setAtivo(rs.getBoolean("ativo"));
                    casas.add(casa);
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

        // Aliases /api (duplicated handlers for compatibility)
        post("/api/casas", (req, res) -> {
            res.type("application/json");
            try {
                System.out.println("Headers: " + req.headers());
                System.out.println("Body recebido: " + req.body());
                Casa casa = gson.fromJson(req.body(), Casa.class);
                System.out.println("Casa objeto: " + gson.toJson(casa));

                try (Connection conn = Database.connect()) {
                    PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO CASA (nome, descricao, endereco, ativo, data_criacao) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                        Statement.RETURN_GENERATED_KEYS
                    );
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setBoolean(4, true);

                    int affectedRows = stmt.executeUpdate();
                    if (affectedRows == 0) {
                        throw new SQLException("Creating casa failed, no rows affected.");
                    }

                    ResultSet rs = stmt.getGeneratedKeys();
                    if (rs.next()) {
                        casa.setId(rs.getLong(1));
                        System.out.println("Casa criada com sucesso. ID: " + casa.getId());
                    } else {
                        throw new SQLException("Creating casa failed, no ID obtained.");
                    }

                    res.status(201);
                    return gson.toJson(casa);
                } catch (SQLException e) {
                    System.err.println("Erro ao criar casa no banco: " + e.getMessage());
                    e.printStackTrace();
                    res.status(500);
                    return gson.toJson(new ErrorResponse("Erro ao criar casa: " + e.getMessage()));
                }
            } catch (Exception e) {
                System.err.println("Erro ao processar requisição: " + e.getMessage());
                e.printStackTrace();
                res.status(400);
                return gson.toJson(new ErrorResponse("Erro ao processar requisição: " + e.getMessage()));
            }
        });

        get("/api/casas", (req, res) -> {
            List<Casa> casas = new ArrayList<>();
            try (Connection conn = Database.connect()) {
                ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM CASA WHERE ativo = true");
                while (rs.next()) {
                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                    casa.setDescricao(rs.getString("descricao"));
                    casa.setEndereco(rs.getString("endereco"));
                    casa.setAtivo(rs.getBoolean("ativo"));
                    casas.add(casa);
                }
            }
            return gson.toJson(casas);
        });

        delete("/api/casas/:id", (req, res) -> {
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
