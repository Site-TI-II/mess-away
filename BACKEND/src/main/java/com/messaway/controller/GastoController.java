package com.messaway.controller;

import com.google.gson.JsonObject;
import com.messaway.db.Database;
import com.messaway.model.Gasto;
import com.messaway.util.JsonUtil;
import spark.Request;
import spark.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GastoController {
    public static String getAllGastosByCasa(Request request, Response response) {
        int idCasa = Integer.parseInt(request.params(":idCasa"));
        List<Gasto> gastos = new ArrayList<>();

        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT * FROM GASTO WHERE id_casa = ? ORDER BY data_criacao DESC";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idCasa);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Gasto gasto = new Gasto(
                            rs.getInt("id_gasto"),
                            rs.getInt("id_casa"),
                            rs.getString("nome"),
                            rs.getDouble("valor"),
                            rs.getTimestamp("data_criacao")
                        );
                        gastos.add(gasto);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao buscar gastos");
        }

        return JsonUtil.toJson(gastos);
    }

    public static String createGasto(Request request, Response response) {
        JsonObject body = JsonUtil.parse(request.body()).getAsJsonObject();
        int idCasa = body.get("idCasa").getAsInt();
        String nome = body.get("nome").getAsString();
        double valor = body.get("valor").getAsDouble();

        try (Connection conn = Database.getConnection()) {
            String sql = "INSERT INTO GASTO (id_casa, nome, valor) VALUES (?, ?, ?) RETURNING *";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idCasa);
                stmt.setString(2, nome);
                stmt.setDouble(3, valor);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Gasto gasto = new Gasto(
                            rs.getInt("id_gasto"),
                            rs.getInt("id_casa"),
                            rs.getString("nome"),
                            rs.getDouble("valor"),
                            rs.getTimestamp("data_criacao")
                        );
                        return JsonUtil.toJson(gasto);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao criar gasto");
        }

        return null;
    }

    public static String deleteGasto(Request request, Response response) {
        int idGasto = Integer.parseInt(request.params(":idGasto"));

        try (Connection conn = Database.getConnection()) {
            String sql = "DELETE FROM GASTO WHERE id_gasto = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idGasto);
                int rowsAffected = stmt.executeUpdate();

                if (rowsAffected > 0) {
                    return JsonUtil.toJson("Gasto removido com sucesso");
                } else {
                    response.status(404);
                    return JsonUtil.toJson("Gasto não encontrado");
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao remover gasto");
        }
    }

    public static String setMetaGasto(Request request, Response response) {
        JsonObject body = JsonUtil.parse(request.body()).getAsJsonObject();
        int idCasa = body.get("idCasa").getAsInt();
        double valor = body.get("valor").getAsDouble();

        try (Connection conn = Database.getConnection()) {
            // First deactivate any active goals
            String updateSql = "UPDATE META_GASTO SET ativo = false WHERE id_casa = ? AND ativo = true";
            try (PreparedStatement stmt = conn.prepareStatement(updateSql)) {
                stmt.setInt(1, idCasa);
                stmt.executeUpdate();
            }

            // Then insert the new goal
            String sql = "INSERT INTO META_GASTO (id_casa, valor, data_inicio, data_fim) VALUES (?, ?, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month') RETURNING *";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idCasa);
                stmt.setDouble(2, valor);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        JsonObject result = new JsonObject();
                        result.addProperty("idMetaGasto", rs.getInt("id_meta_gasto"));
                        result.addProperty("valor", rs.getDouble("valor"));
                        return JsonUtil.toJson(result);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao definir meta de gastos");
        }

        return null;
    }

    public static String getMetaGasto(Request request, Response response) {
        int idCasa = Integer.parseInt(request.params(":idCasa"));

        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT * FROM META_GASTO WHERE id_casa = ? AND ativo = true ORDER BY data_inicio DESC LIMIT 1";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idCasa);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        JsonObject result = new JsonObject();
                        result.addProperty("idMetaGasto", rs.getInt("id_meta_gasto"));
                        result.addProperty("valor", rs.getDouble("valor"));
                        return JsonUtil.toJson(result);
                    } else {
                        response.status(404);
                        return JsonUtil.toJson("Nenhuma meta de gastos ativa encontrada");
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao buscar meta de gastos");
        }
    }

    // =========================
    // Gastos por Usuário (novo)
    // =========================
    public static String getAllGastosByUsuario(Request request, Response response) {
        int idUsuario = Integer.parseInt(request.params(":idUsuario"));
        java.util.List<java.util.Map<String, Object>> gastos = new java.util.ArrayList<>();
        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT id_gasto_usuario, nome, valor, data_criacao FROM GASTO_USUARIO WHERE id_usuario = ? ORDER BY data_criacao DESC";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idUsuario);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        java.util.Map<String, Object> item = new java.util.HashMap<>();
                        item.put("idGasto", rs.getInt("id_gasto_usuario"));
                        item.put("nome", rs.getString("nome"));
                        item.put("valor", rs.getDouble("valor"));
                        item.put("dataCriacao", rs.getTimestamp("data_criacao"));
                        gastos.add(item);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao buscar gastos do usuário");
        }
        return JsonUtil.toJson(gastos);
    }

    public static String createGastoUsuario(Request request, Response response) {
        var body = JsonUtil.parse(request.body()).getAsJsonObject();
        int idUsuario = body.get("idUsuario").getAsInt();
        String nome = body.get("nome").getAsString();
        double valor = body.get("valor").getAsDouble();
        try (Connection conn = Database.getConnection()) {
            String sql = "INSERT INTO GASTO_USUARIO (id_usuario, nome, valor) VALUES (?, ?, ?) RETURNING id_gasto_usuario, nome, valor, data_criacao";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idUsuario);
                stmt.setString(2, nome);
                stmt.setDouble(3, valor);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        java.util.Map<String, Object> item = new java.util.HashMap<>();
                        item.put("idGasto", rs.getInt("id_gasto_usuario"));
                        item.put("nome", rs.getString("nome"));
                        item.put("valor", rs.getDouble("valor"));
                        item.put("dataCriacao", rs.getTimestamp("data_criacao"));
                        return JsonUtil.toJson(item);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao criar gasto do usuário");
        }
        response.status(400);
        return JsonUtil.toJson("Não foi possível criar gasto do usuário");
    }

    public static String deleteGastoUsuario(Request request, Response response) {
        int idGastoUsuario = Integer.parseInt(request.params(":idGastoUsuario"));
        try (Connection conn = Database.getConnection()) {
            String sql = "DELETE FROM GASTO_USUARIO WHERE id_gasto_usuario = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idGastoUsuario);
                int rows = stmt.executeUpdate();
                if (rows > 0) {
                    response.status(204);
                    return "";
                } else {
                    response.status(404);
                    return JsonUtil.toJson("Gasto do usuário não encontrado");
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao remover gasto do usuário");
        }
    }

    public static String setMetaGastoUsuario(Request request, Response response) {
        var body = JsonUtil.parse(request.body()).getAsJsonObject();
        int idUsuario = body.get("idUsuario").getAsInt();
        double valor = body.get("valor").getAsDouble();
        try (Connection conn = Database.getConnection()) {
            // deactivate active goals for this user
            try (PreparedStatement pst = conn.prepareStatement("UPDATE META_GASTO_USUARIO SET ativo = false WHERE id_usuario = ? AND ativo = true")) {
                pst.setInt(1, idUsuario);
                pst.executeUpdate();
            }
            // insert new goal (1 month window)
            String sql = "INSERT INTO META_GASTO_USUARIO (id_usuario, valor, data_inicio, data_fim) VALUES (?, ?, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month') RETURNING id_meta_gasto_usuario, valor";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idUsuario);
                stmt.setDouble(2, valor);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        JsonObject result = new JsonObject();
                        result.addProperty("idMetaGasto", rs.getInt("id_meta_gasto_usuario"));
                        result.addProperty("valor", rs.getDouble("valor"));
                        return JsonUtil.toJson(result);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao definir meta de gastos do usuário");
        }
        response.status(400);
        return JsonUtil.toJson("Não foi possível definir meta de gastos do usuário");
    }

    public static String getMetaGastoUsuario(Request request, Response response) {
        int idUsuario = Integer.parseInt(request.params(":idUsuario"));
        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT id_meta_gasto_usuario, valor FROM META_GASTO_USUARIO WHERE id_usuario = ? AND ativo = true ORDER BY data_inicio DESC LIMIT 1";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idUsuario);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        JsonObject result = new JsonObject();
                        result.addProperty("idMetaGasto", rs.getInt("id_meta_gasto_usuario"));
                        result.addProperty("valor", rs.getDouble("valor"));
                        return JsonUtil.toJson(result);
                    } else {
                        response.status(404);
                        return JsonUtil.toJson("Nenhuma meta de gastos ativa encontrada para o usuário");
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
            response.status(500);
            return JsonUtil.toJson("Erro ao buscar meta de gastos do usuário");
        }
    }
}