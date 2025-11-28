package com.messaway.controller;

import com.google.gson.JsonObject;
import com.messaway.db.Database;
import com.messaway.model.Conta;
import com.messaway.model.ContaUsuario;
import com.messaway.util.JsonUtil;
import spark.Request;
import spark.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static spark.Spark.*;

public class ContaController {
    public static void registerRoutes() {
        // Support both /MessAway and /api paths
        post("/MessAway/contas", (req, res) -> createConta(req, res));
        post("/MessAway/contas/:id/usuarios", (req, res) -> addUsuarioToConta(req, res));
        get("/MessAway/contas/:id/usuarios", (req, res) -> listUsuariosByConta(req, res));
        post("/MessAway/contas/:id/admin", (req, res) -> toggleAdmin(req, res));
        delete("/MessAway/contas/:id/usuarios/:contaUsuarioId", (req, res) -> deleteUsuarioFromConta(req, res));

        post("/api/contas", (req, res) -> createConta(req, res));
        post("/api/contas/:id/usuarios", (req, res) -> addUsuarioToConta(req, res));
        get("/api/contas/:id/usuarios", (req, res) -> listUsuariosByConta(req, res));
        post("/api/contas/:id/admin", (req, res) -> toggleAdmin(req, res));
        delete("/api/contas/:id/usuarios/:contaUsuarioId", (req, res) -> deleteUsuarioFromConta(req, res));
    }

    public static String createConta(Request req, Response res) {
        try (Connection conn = Database.getConnection()) {
            JsonObject body = JsonUtil.parse(req.body()).getAsJsonObject();
            String nome = body.get("nome").getAsString();
            String email = body.get("email").getAsString();
            String senha = body.get("senha").getAsString();
            Integer idCasa = body.has("idCasa") && !body.get("idCasa").isJsonNull() ? body.get("idCasa").getAsInt() : null;

            String sql = "INSERT INTO CONTA (nome, email, senha, id_casa) VALUES (?, ?, ?, ?) RETURNING *";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, nome);
                stmt.setString(2, email);
                stmt.setString(3, senha);
                if (idCasa != null) stmt.setInt(4, idCasa); else stmt.setNull(4, Types.INTEGER);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Conta conta = new Conta(
                            rs.getInt("id_conta"),
                            rs.getString("nome"),
                            rs.getString("email"),
                            rs.getString("senha"),
                            rs.getTimestamp("data_criacao"),
                            rs.getObject("id_casa") != null ? rs.getInt("id_casa") : null,
                            rs.getBoolean("ativo")
                        );
                        res.status(201);
                        return JsonUtil.toJson(conta);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.status(500);
            return JsonUtil.toJson("Erro ao criar conta");
        }
        res.status(400);
        return JsonUtil.toJson("Não foi possível criar a conta");
    }

    public static String addUsuarioToConta(Request req, Response res) {
        int idConta = Integer.parseInt(req.params(":id"));
        try (Connection conn = Database.getConnection()) {
            JsonObject body = JsonUtil.parse(req.body()).getAsJsonObject();
            Integer idUsuario = body.has("idUsuario") && !body.get("idUsuario").isJsonNull() ? body.get("idUsuario").getAsInt() : null;
            String apelido = body.has("apelido") ? body.get("apelido").getAsString() : null;
            String cor = body.has("cor") ? body.get("cor").getAsString() : null;
            String permissao = body.has("permissao") ? body.get("permissao").getAsString() : null;

            // Enforce max 7 profiles per conta
            try (PreparedStatement chk = conn.prepareStatement("SELECT COUNT(*) FROM CONTA_USUARIO WHERE id_conta = ?")) {
                chk.setInt(1, idConta);
                try (ResultSet crs = chk.executeQuery()) {
                    if (crs.next() && crs.getInt(1) >= 7) {
                        res.status(400);
                        return JsonUtil.toJson(java.util.Map.of("error", "limite_conta_usuarios", "message", "A conta atingiu o limite de 7 usuários"));
                    }
                }
            }


            String sql = "INSERT INTO CONTA_USUARIO (id_conta, id_usuario, apelido, cor, permissao) VALUES (?, ?, ?, ?, ?) RETURNING *";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idConta);
                if (idUsuario != null) stmt.setInt(2, idUsuario); else stmt.setNull(2, Types.INTEGER);
                stmt.setString(3, apelido);
                stmt.setString(4, cor);
                stmt.setString(5, permissao);

                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Integer rsIdUsuario = rs.getObject("id_usuario") != null ? rs.getInt("id_usuario") : null;
                        ContaUsuario cu = new ContaUsuario(
                            rs.getInt("id_conta_usuario"),
                            rs.getInt("id_conta"),
                            rsIdUsuario,
                            rs.getString("apelido"),
                            rs.getString("cor"),
                            rs.getString("permissao"),
                            rs.getTimestamp("data_associacao")
                        );
                        res.status(201);
                        return JsonUtil.toJson(cu);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.status(500);
            return JsonUtil.toJson("Erro ao associar usuário à conta");
        }
        res.status(400);
        return JsonUtil.toJson("Não foi possível associar usuário");
    }

    public static String listUsuariosByConta(Request req, Response res) {
        int idConta = Integer.parseInt(req.params(":id"));
        List<ContaUsuario> list = new ArrayList<>();
        try (Connection conn = Database.getConnection()) {
            String sql = "SELECT * FROM CONTA_USUARIO WHERE id_conta = ? ORDER BY data_associacao DESC";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idConta);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Integer rsIdUsuario = rs.getObject("id_usuario") != null ? rs.getInt("id_usuario") : null;
                        ContaUsuario cu = new ContaUsuario(
                            rs.getInt("id_conta_usuario"),
                            rs.getInt("id_conta"),
                            rsIdUsuario,
                            rs.getString("apelido"),
                            rs.getString("cor"),
                            rs.getString("permissao"),
                            rs.getTimestamp("data_associacao")
                        );
                        list.add(cu);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.status(500);
            return JsonUtil.toJson("Erro ao listar usuários da conta");
        }
        return JsonUtil.toJson(list);
    }

    public static String toggleAdmin(Request req, Response res) {
        int idConta = Integer.parseInt(req.params(":id"));
        try (Connection conn = Database.getConnection()) {
            JsonObject body = JsonUtil.parse(req.body()).getAsJsonObject();
            boolean isAdmin = body.has("isAdmin") && !body.get("isAdmin").isJsonNull() && body.get("isAdmin").getAsBoolean();
            try (PreparedStatement stmt = conn.prepareStatement("UPDATE CONTA SET is_admin = ? WHERE id_conta = ?")) {
                stmt.setBoolean(1, isAdmin);
                stmt.setInt(2, idConta);
                int updated = stmt.executeUpdate();
                if (updated > 0) {
                    JsonObject resp = new JsonObject();
                    resp.addProperty("idConta", idConta);
                    resp.addProperty("isAdmin", isAdmin);
                    res.status(200);
                    return JsonUtil.toJson(resp);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.status(500);
            return JsonUtil.toJson("Erro ao atualizar privilégio de admin");
        }
        res.status(404);
        return JsonUtil.toJson("Conta não encontrada");
    }

    public static String deleteUsuarioFromConta(Request req, Response res) {
        int idConta = Integer.parseInt(req.params(":id"));
        int contaUsuarioId = Integer.parseInt(req.params(":contaUsuarioId"));
        try (Connection conn = Database.getConnection()) {
            String sql = "DELETE FROM CONTA_USUARIO WHERE id_conta_usuario = ? AND id_conta = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, contaUsuarioId);
                stmt.setInt(2, idConta);
                int affected = stmt.executeUpdate();
                if (affected > 0) {
                    res.status(204);
                    return "";
                } else {
                    res.status(404);
                    return JsonUtil.toJson("Associação usuário-conta não encontrada");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.status(500);
            return JsonUtil.toJson("Erro ao remover usuário da conta");
        }
    }
}
