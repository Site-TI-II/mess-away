package com.messaway.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.messaway.db.Database;
import com.messaway.model.ErrorResponse;
import spark.Request;
import spark.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static spark.Spark.*;

public class ComodoController {
    private static final Gson gson = new Gson();

    public static void registerRoutes() {
        // CORS já está configurado no Main.java
        
        before("/api/comodos/*", (req, res) -> res.type("application/json"));
        before("/api/casas/*/comodos", (req, res) -> res.type("application/json"));
        before("/api/categorias", (req, res) -> res.type("application/json"));

        // GET: Listar cômodos de uma casa
        get("/api/casas/:id/comodos", ComodoController::listarComodosDaCasa);
        
        // POST: Criar novo cômodo
        post("/api/comodos", ComodoController::criarComodo);
        
        // GET: Listar todas as categorias
        get("/api/categorias", ComodoController::listarCategorias);
    }

    private static Object listarComodosDaCasa(Request req, Response res) {
        try {
            long idCasa = Long.parseLong(req.params(":id"));
            List<Map<String, Object>> comodos = new ArrayList<>();
            
            try (Connection conn = Database.connect()) {
                String sql = """
                    SELECT 
                        id_comodo as idComodo,
                        nome,
                        descricao
                    FROM COMODO
                    WHERE id_casa = ? AND ativo = true
                    ORDER BY nome
                """;
                
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();
                    
                    while (rs.next()) {
                        Map<String, Object> comodo = new HashMap<>();
                        comodo.put("idComodo", rs.getLong("idComodo"));
                        comodo.put("nome", rs.getString("nome"));
                        comodo.put("descricao", rs.getString("descricao"));
                        comodos.add(comodo);
                    }
                }
            }
            
            res.status(200);
            return gson.toJson(comodos);
            
        } catch (Exception e) {
            System.err.println("[ComodoController] Erro ao listar cômodos: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar cômodos: " + e.getMessage()));
        }
    }

    private static Object criarComodo(Request req, Response res) {
        try {
            JsonObject json = JsonParser.parseString(req.body()).getAsJsonObject();
            
            String nome = json.get("nome").getAsString();
            String descricao = json.has("descricao") ? json.get("descricao").getAsString() : "";
            long idCasa = json.get("idCasa").getAsLong();
            
            try (Connection conn = Database.connect()) {
                String sql = """
                    INSERT INTO COMODO (nome, descricao, id_casa, ativo)
                    VALUES (?, ?, ?, true)
                    RETURNING id_comodo
                """;
                
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, nome);
                    stmt.setString(2, descricao);
                    stmt.setLong(3, idCasa);
                    
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        long idComodo = rs.getLong("id_comodo");
                        Map<String, Object> result = new HashMap<>();
                        result.put("idComodo", idComodo);
                        result.put("nome", nome);
                        result.put("message", "Cômodo criado com sucesso");
                        
                        res.status(201);
                        return gson.toJson(result);
                    }
                }
            }
            
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao criar cômodo"));
            
        } catch (Exception e) {
            System.err.println("[ComodoController] Erro ao criar cômodo: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao criar cômodo: " + e.getMessage()));
        }
    }

    private static Object listarCategorias(Request req, Response res) {
        try {
            List<Map<String, Object>> categorias = new ArrayList<>();
            
            try (Connection conn = Database.connect()) {
                String sql = """
                    SELECT 
                        id_categoria as idCategoria,
                        nome,
                        descricao
                    FROM CATEGORIA
                    ORDER BY nome
                """;
                
                try (Statement stmt = conn.createStatement()) {
                    ResultSet rs = stmt.executeQuery(sql);
                    
                    while (rs.next()) {
                        Map<String, Object> categoria = new HashMap<>();
                        categoria.put("idCategoria", rs.getLong("idCategoria"));
                        categoria.put("nome", rs.getString("nome"));
                        categoria.put("descricao", rs.getString("descricao"));
                        categorias.add(categoria);
                    }
                }
            }
            
            res.status(200);
            return gson.toJson(categorias);
            
        } catch (Exception e) {
            System.err.println("[ComodoController] Erro ao listar categorias: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar categorias: " + e.getMessage()));
        }
    }
}
