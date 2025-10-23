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
                // Optional: bind casa to a Conta if idConta is provided in the JSON body
                Long idContaFromBody = null;
                try {
                    var parsed = com.google.gson.JsonParser.parseString(req.body()).getAsJsonObject();
                    if (parsed.has("idConta") && !parsed.get("idConta").isJsonNull()) {
                        idContaFromBody = parsed.get("idConta").getAsLong();
                    }
                } catch (Exception ignore) {}
                System.out.println("Casa objeto: " + gson.toJson(casa));
                
                try (Connection conn = Database.connect()) {
                    // Novo modelo: multi-casas por conta (CASA.id_conta)
                    PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO CASA (nome, descricao, endereco, ativo, data_criacao, id_conta) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
                        Statement.RETURN_GENERATED_KEYS
                    );
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setBoolean(4, true);
                    if (idContaFromBody != null) stmt.setLong(5, idContaFromBody); else stmt.setNull(5, Types.INTEGER);
                    
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
            String contaIdParam = req.queryParams("contaId");
            try (Connection conn = Database.connect()) {
                if (contaIdParam != null && !contaIdParam.isEmpty()) {
                    boolean isAdmin = false;
                    try (PreparedStatement p = conn.prepareStatement("SELECT is_admin FROM CONTA WHERE id_conta = ?")) {
                        p.setInt(1, Integer.parseInt(contaIdParam));
                        try (ResultSet r = p.executeQuery()) {
                            if (r.next()) isAdmin = r.getBoolean(1);
                        }
                    }
                    if (isAdmin) {
                        try (PreparedStatement pst = conn.prepareStatement("SELECT * FROM CASA WHERE ativo = true ORDER BY data_criacao DESC")) {
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    } else {
                        try (PreparedStatement pst = conn.prepareStatement("SELECT * FROM CASA WHERE ativo = true AND id_conta = ? ORDER BY data_criacao DESC")) {
                            pst.setInt(1, Integer.parseInt(contaIdParam));
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    }
                } else {
                    // Default: list all active casas
                    ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM CASA WHERE ativo = true");
                    while (rs.next()) {
                        Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                        casa.setDescricao(rs.getString("descricao"));
                        casa.setEndereco(rs.getString("endereco"));
                        casa.setAtivo(rs.getBoolean("ativo"));
                        casas.add(casa);
                    }
                }
            }
            return gson.toJson(casas);
        });

        delete("/MessAway/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                // Soft delete para evitar violação de FK
                try (PreparedStatement stmt = conn.prepareStatement("UPDATE CASA SET ativo = false WHERE id_casa = ?")) {
                    stmt.setLong(1, id);
                    int updated = stmt.executeUpdate();
                    if (updated == 0) {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Casa não encontrada"));
                    }
                }
                res.status(204);
                return "";
            } catch (SQLException e) {
                System.err.println("[CasaController] Erro ao deletar casa (MessAway): " + e.getMessage());
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao deletar casa: " + e.getMessage()));
            }
        });

        // Aliases /api (duplicated handlers for compatibility)
        post("/api/casas", (req, res) -> {
            res.type("application/json");
            try {
                System.out.println("Headers: " + req.headers());
                System.out.println("Body recebido: " + req.body());
                Casa casa = gson.fromJson(req.body(), Casa.class);
                Long idContaFromBody = null;
                try {
                    var parsed = com.google.gson.JsonParser.parseString(req.body()).getAsJsonObject();
                    if (parsed.has("idConta") && !parsed.get("idConta").isJsonNull()) {
                        idContaFromBody = parsed.get("idConta").getAsLong();
                    }
                } catch (Exception ignore) {}
                System.out.println("Casa objeto: " + gson.toJson(casa));

                try (Connection conn = Database.connect()) {
                    PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO CASA (nome, descricao, endereco, ativo, data_criacao, id_conta) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)",
                        Statement.RETURN_GENERATED_KEYS
                    );
                    stmt.setString(1, casa.getNome());
                    stmt.setString(2, casa.getDescricao() != null ? casa.getDescricao() : "");
                    stmt.setString(3, casa.getEndereco() != null ? casa.getEndereco() : "");
                    stmt.setBoolean(4, true);
                    if (idContaFromBody != null) stmt.setLong(5, idContaFromBody); else stmt.setNull(5, Types.INTEGER);

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
            String contaIdParam = req.queryParams("contaId");
            try (Connection conn = Database.connect()) {
                if (contaIdParam != null && !contaIdParam.isEmpty()) {
                    boolean isAdmin = false;
                    try (PreparedStatement p = conn.prepareStatement("SELECT is_admin FROM CONTA WHERE id_conta = ?")) {
                        p.setInt(1, Integer.parseInt(contaIdParam));
                        try (ResultSet r = p.executeQuery()) {
                            if (r.next()) isAdmin = r.getBoolean(1);
                        }
                    }
                    if (isAdmin) {
                        try (PreparedStatement pst = conn.prepareStatement("SELECT * FROM CASA WHERE ativo = true ORDER BY data_criacao DESC")) {
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    } else {
                        try (PreparedStatement pst = conn.prepareStatement("SELECT * FROM CASA WHERE ativo = true AND id_conta = ? ORDER BY data_criacao DESC")) {
                            pst.setInt(1, Integer.parseInt(contaIdParam));
                            try (ResultSet rs = pst.executeQuery()) {
                                while (rs.next()) {
                                    Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                                    casa.setDescricao(rs.getString("descricao"));
                                    casa.setEndereco(rs.getString("endereco"));
                                    casa.setAtivo(rs.getBoolean("ativo"));
                                    casas.add(casa);
                                }
                            }
                        }
                    }
                } else {
                    ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM CASA WHERE ativo = true");
                    while (rs.next()) {
                        Casa casa = new Casa(rs.getLong("id_casa"), rs.getString("nome"));
                        casa.setDescricao(rs.getString("descricao"));
                        casa.setEndereco(rs.getString("endereco"));
                        casa.setAtivo(rs.getBoolean("ativo"));
                        casas.add(casa);
                    }
                }
            }
            return gson.toJson(casas);
        });

        delete("/api/casas/:id", (req, res) -> {
            long id = Long.parseLong(req.params(":id"));
            try (Connection conn = Database.connect()) {
                try (PreparedStatement stmt = conn.prepareStatement("UPDATE CASA SET ativo = false WHERE id_casa = ?")) {
                    stmt.setLong(1, id);
                    int updated = stmt.executeUpdate();
                    if (updated == 0) {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Casa não encontrada"));
                    }
                }
                res.status(204);
                return "";
            } catch (SQLException e) {
                System.err.println("[CasaController] Erro ao deletar casa (/api): " + e.getMessage());
                e.printStackTrace();
                res.status(500);
                return gson.toJson(new ErrorResponse("Erro ao deletar casa: " + e.getMessage()));
            }
        });
    }
}
