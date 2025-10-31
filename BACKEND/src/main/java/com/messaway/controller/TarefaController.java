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

public class TarefaController {
    private static final Gson gson = new Gson();

    public static void registerRoutes() {
        // CORS já está configurado no Main.java

        before("/api/tarefas/*", (req, res) -> res.type("application/json"));
        before("/api/casas/*/tarefas", (req, res) -> res.type("application/json"));

        // GET: Listar tarefas de uma casa
        get("/api/casas/:id/tarefas", TarefaController::listarTarefasDaCasa);

        // POST: Criar nova tarefa
        post("/api/tarefas", TarefaController::criarTarefa);

        // PUT: Atualizar tarefa
        put("/api/tarefas/:id", TarefaController::atualizarTarefa);

        // DELETE: Remover tarefa
        delete("/api/tarefas/:id", TarefaController::removerTarefa);

        // PUT: Marcar tarefa como concluída
        put("/api/tarefas/:id/concluir", TarefaController::concluirTarefa);
    }

    private static Object listarTarefasDaCasa(Request req, Response res) {
        try {
            long idCasa = Long.parseLong(req.params(":id"));
            List<Map<String, Object>> tarefas = new ArrayList<>();

            try (Connection conn = Database.connect()) {
                String sql = """
                            SELECT
                                t.id_tarefa as idTarefa,
                                t.nome,
                                t.descricao,
                                t.data_criacao as dataCriacao,
                                t.data_estimada as dataEstimada,
                                t.frequencia,
                                t.ativo as concluida,
                                c.nome as nomeComodo,
                                u.nome as nomeResponsavel,
                                cat.nome as nomeCategoria
                            FROM TAREFA t
                            JOIN COMODO c ON t.id_comodo = c.id_comodo
                            LEFT JOIN USUARIO u ON t.id_usuario_responsavel = u.id_usuario
                            JOIN CATEGORIA cat ON t.id_categoria = cat.id_categoria
                            WHERE t.id_casa = ? AND t.ativo = false
                            ORDER BY t.data_criacao DESC
                        """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    while (rs.next()) {
                        Map<String, Object> tarefa = new HashMap<>();
                        tarefa.put("id", rs.getLong("idTarefa"));  // ✅ Frontend espera "id"
                        tarefa.put("nome", rs.getString("nome"));
                        tarefa.put("descricao", rs.getString("descricao"));
                        tarefa.put("dataCriacao", rs.getTimestamp("dataCriacao"));
                        tarefa.put("dataEstimada", rs.getTimestamp("dataEstimada"));
                        tarefa.put("frequencia", rs.getInt("frequencia"));
                        tarefa.put("concluida", rs.getBoolean("concluida"));
                        tarefa.put("nomeComodo", rs.getString("nomeComodo"));
                        tarefa.put("nomeResponsavel", rs.getString("nomeResponsavel"));
                        tarefa.put("nomeCategoria", rs.getString("nomeCategoria"));
                        tarefas.add(tarefa);
                    }
                }
            }

            res.status(200);
            return gson.toJson(tarefas);

        } catch (Exception e) {
            System.err.println("[TarefaController] Erro ao listar tarefas: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar tarefas: " + e.getMessage()));
        }
    }

    private static Object criarTarefa(Request req, Response res) {
        try {
            // LOG DO BODY RECEBIDO
            System.out.println("========================================");
            System.out.println("📥 BODY RECEBIDO:");
            System.out.println(req.body());
            System.out.println("========================================");

            JsonObject json = JsonParser.parseString(req.body()).getAsJsonObject();

            // LOG DO JSON PARSEADO
            System.out.println("📦 JSON PARSEADO:");
            System.out.println("  - nome: " + (json.has("nome") ? json.get("nome") : "NULL"));
            System.out.println("  - descricao: " + (json.has("descricao") ? json.get("descricao") : "NULL"));
            System.out.println("  - idUsuario: " + (json.has("idUsuario") ? json.get("idUsuario") : "NULL"));
            System.out.println("  - idCasa: " + (json.has("idCasa") ? json.get("idCasa") : "NULL"));
            System.out.println("  - dataEstimada: " + (json.has("dataEstimada") ? json.get("dataEstimada") : "NULL"));
            System.out.println("  - frequencia: " + (json.has("frequencia") ? json.get("frequencia") : "NULL"));
            System.out.println("========================================");

            String nome = json.get("nome").getAsString();
            String descricao = json.has("descricao") ? json.get("descricao").getAsString() : "";
            Long idComodo = json.has("idComodo") && !json.get("idComodo").isJsonNull()
                    ? json.get("idComodo").getAsLong()
                    : null;
            long idUsuario = json.get("idUsuario").getAsLong();
            Long idCategoria = json.has("idCategoria") && !json.get("idCategoria").isJsonNull()
                    ? json.get("idCategoria").getAsLong()
                    : null;
            Long idCasa = json.has("idCasa") && !json.get("idCasa").isJsonNull()
                    ? json.get("idCasa").getAsLong()
                    : null;

            String dataEstimada = null;
            if (json.has("dataEstimada") && !json.get("dataEstimada").isJsonNull()) {
                dataEstimada = json.get("dataEstimada").getAsString();
                if (dataEstimada != null && dataEstimada.length() == 10) {
                    dataEstimada = dataEstimada + "T09:00:00";
                }
            }

            int frequencia = json.has("frequencia") ? json.get("frequencia").getAsInt() : 1;

            try (Connection conn = Database.connect()) {
                // Resolver defaults se comodo/categoria não forem informados
                if (idComodo == null) {
                    if (idCasa == null) {
                        res.status(400);
                        return gson.toJson(new ErrorResponse("idCasa é obrigatório quando idComodo não é informado"));
                    }
                    // tentar encontrar um cômodo 'Geral' na casa; se não existir, criar
                    try (PreparedStatement ps = conn.prepareStatement(
                            "SELECT id_comodo FROM COMODO WHERE id_casa = ? AND LOWER(nome) = 'geral' LIMIT 1")) {
                        ps.setLong(1, idCasa);
                        try (ResultSet rs = ps.executeQuery()) {
                            if (rs.next()) {
                                idComodo = rs.getLong(1);
                            }
                        }
                    }
                    if (idComodo == null) {
                        try (PreparedStatement ps = conn.prepareStatement(
                                "INSERT INTO COMODO (id_casa, nome, descricao, ativo) VALUES (?, 'Geral', 'Padrão', true) RETURNING id_comodo")) {
                            ps.setLong(1, idCasa);
                            try (ResultSet rs = ps.executeQuery()) {
                                if (rs.next())
                                    idComodo = rs.getLong(1);
                            }
                        }
                    }
                }

                if (idCategoria == null) {
                    // tentar encontrar uma categoria 'Geral'; se não existir, criar
                    try (PreparedStatement ps = conn.prepareStatement(
                            "SELECT id_categoria FROM CATEGORIA WHERE LOWER(nome) = 'geral' LIMIT 1")) {
                        try (ResultSet rs = ps.executeQuery()) {
                            if (rs.next()) {
                                idCategoria = rs.getLong(1);
                            }
                        }
                    }
                    if (idCategoria == null) {
                        try (PreparedStatement ps = conn.prepareStatement(
                                "INSERT INTO CATEGORIA (nome, descricao) VALUES ('Geral', 'Padrão') RETURNING id_categoria")) {
                            try (ResultSet rs = ps.executeQuery()) {
                                if (rs.next())
                                    idCategoria = rs.getLong(1);
                            }
                        }
                    }
                }

                String sql = """
                            INSERT INTO TAREFA
                            (nome, descricao, id_comodo, id_usuario_responsavel, id_categoria, id_casa, data_estimada, frequencia, ativo)
                            VALUES (?, ?, ?, ?, ?, ?, ?::timestamp, ?, false)
                            RETURNING id_tarefa
                        """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, nome);
                    stmt.setString(2, descricao);
                    stmt.setLong(3, idComodo);
                    stmt.setLong(4, idUsuario);
                    stmt.setLong(5, idCategoria);
                    stmt.setLong(6, idCasa);

                    if (dataEstimada != null && !dataEstimada.isEmpty()) {
                        stmt.setString(7, dataEstimada);
                    } else {
                        stmt.setNull(7, Types.TIMESTAMP);
                    }

                    stmt.setInt(8, frequencia);

                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        long idTarefa = rs.getLong("id_tarefa");
                        Map<String, Object> result = new HashMap<>();
                        result.put("idTarefa", idTarefa); // ✅ Correto!
                        result.put("nome", nome);
                        result.put("message", "Tarefa criada com sucesso");

                        res.status(201);
                        return gson.toJson(result);
                    }
                }
            }

            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao criar tarefa"));

        } catch (Exception e) {
            System.err.println("[TarefaController] Erro ao criar tarefa: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao criar tarefa: " + e.getMessage()));
        }
    }

    private static Object atualizarTarefa(Request req, Response res) {
        try {
            long idTarefa = Long.parseLong(req.params(":id"));
            JsonObject json = JsonParser.parseString(req.body()).getAsJsonObject();

            try (Connection conn = Database.connect()) {
                String sql = """
                            UPDATE TAREFA
                            SET nome = ?,
                                descricao = ?,
                                id_comodo = ?,
                                id_usuario_responsavel = ?,
                                id_categoria = ?,
                                data_estimada = ?::timestamp,
                                frequencia = ?
                            WHERE id_tarefa = ?
                        """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, json.get("nome").getAsString());
                    stmt.setString(2, json.has("descricao") ? json.get("descricao").getAsString() : "");
                    stmt.setLong(3, json.get("idComodo").getAsLong());
                    stmt.setLong(4, json.get("idUsuario").getAsLong());
                    stmt.setLong(5, json.get("idCategoria").getAsLong());

                    String dataEstimada = null;
                    if (json.has("dataEstimada") && !json.get("dataEstimada").isJsonNull()) {
                        dataEstimada = json.get("dataEstimada").getAsString();
                        if (dataEstimada != null && dataEstimada.length() == 10) {
                            dataEstimada = dataEstimada + "T09:00:00";
                        }
                    }
                    if (dataEstimada != null && !dataEstimada.isEmpty()) {
                        stmt.setString(6, dataEstimada);
                    } else {
                        stmt.setNull(6, Types.TIMESTAMP);
                    }

                    stmt.setInt(7, json.has("frequencia") ? json.get("frequencia").getAsInt() : 1);
                    stmt.setLong(8, idTarefa);

                    int updated = stmt.executeUpdate();

                    if (updated > 0) {
                        res.status(200);
                        return gson.toJson(Map.of("message", "Tarefa atualizada com sucesso"));
                    } else {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Tarefa não encontrada"));
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("[TarefaController] Erro ao atualizar tarefa: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao atualizar tarefa: " + e.getMessage()));
        }
    }

    private static Object removerTarefa(Request req, Response res) {
        try {
            long idTarefa = Long.parseLong(req.params(":id"));

            try (Connection conn = Database.connect()) {
                String sql = "DELETE FROM TAREFA WHERE id_tarefa = ?";

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idTarefa);
                    int deleted = stmt.executeUpdate();

                    if (deleted > 0) {
                        res.status(200);
                        return gson.toJson(Map.of("message", "Tarefa removida com sucesso"));
                    } else {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Tarefa não encontrada"));
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("[TarefaController] Erro ao remover tarefa: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao remover tarefa: " + e.getMessage()));
        }
    }

    private static Object concluirTarefa(Request req, Response res) {
        try {
            long idTarefa = Long.parseLong(req.params(":id"));

            try (Connection conn = Database.connect()) {
                String sql = "UPDATE TAREFA SET ativo = true WHERE id_tarefa = ?";

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idTarefa);
                    int updated = stmt.executeUpdate();

                    if (updated > 0) {
                        res.status(200);
                        return gson.toJson(Map.of("message", "Tarefa concluída com sucesso"));
                    } else {
                        res.status(404);
                        return gson.toJson(new ErrorResponse("Tarefa não encontrada"));
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("[TarefaController] Erro ao concluir tarefa: " + e.getMessage());
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao concluir tarefa: " + e.getMessage()));
        }
    }
}