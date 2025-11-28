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
        
        // GET: Buscar alertas de tarefas de uma casa
        get("/api/casas/:id/alertas", TarefaController::buscarAlertasDaCasa);
        
        // GET: Buscar estatísticas semanais de uma casa
        get("/api/casas/:id/stats/weekly", TarefaController::buscarEstatisticasSemanais);
        
        // GET: Buscar conquistas da casa
        get("/api/casas/:id/conquistas", TarefaController::buscarConquistasDaCasa);
    }

    private static Object buscarConquistasDaCasa(Request req, Response res) {
        try {
            long idCasa = Long.parseLong(req.params(":id"));
            List<Map<String, Object>> conquistas = new ArrayList<>();

            try (Connection conn = Database.connect()) {
                // Buscar estatísticas da casa para determinar conquistas
                String sql = """
                    SELECT 
                        COUNT(*) FILTER (WHERE t.status = 'completed') as totalConcluidas,
                        COUNT(DISTINCT DATE(t.completed_at)) FILTER (WHERE t.status = 'completed' AND t.completed_at >= CURRENT_DATE - INTERVAL '7 days') as diasConsecutivos,
                        COUNT(*) FILTER (WHERE t.status = 'completed' AND t.completed_at >= CURRENT_DATE - INTERVAL '7 days') as concluidasEstaSemana,
                        MAX(t.completed_at) as ultimaConclusao
                    FROM tasks t
                    JOIN rooms r ON t.room_id = r.id
                    JOIN houses h ON r.house_id = h.id
                    WHERE h.id = ?
                """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    if (rs.next()) {
                        int totalConcluidas = rs.getInt("totalConcluidas");
                        int diasConsecutivos = rs.getInt("diasConsecutivos");
                        int concluidasEstaSemana = rs.getInt("concluidasEstaSemana");

                        // Conquista: Primeira tarefa
                        if (totalConcluidas >= 1) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 1);
                            conquista.put("name", "Primeira Tarefa!");
                            conquista.put("description", "Complete sua primeira tarefa");
                            conquista.put("icon", "🎯");
                            conquista.put("requirementValue", 10);
                            conquistas.add(conquista);
                        }

                        // Conquista: 5 tarefas
                        if (totalConcluidas >= 5) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 2);
                            conquista.put("name", "Começando Bem!");
                            conquista.put("description", "Complete 5 tarefas");
                            conquista.put("icon", "⭐");
                            conquista.put("requirementValue", 50);
                            conquistas.add(conquista);
                        }

                        // Conquista: 10 tarefas
                        if (totalConcluidas >= 10) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 3);
                            conquista.put("name", "Produtivo!");
                            conquista.put("description", "Complete 10 tarefas");
                            conquista.put("icon", "🚀");
                            conquista.put("requirementValue", 100);
                            conquistas.add(conquista);
                        }

                        // Conquista: 25 tarefas
                        if (totalConcluidas >= 25) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 4);
                            conquista.put("name", "Semana Produtiva!");
                            conquista.put("description", "Complete 25 tarefas");
                            conquista.put("icon", "🔥");
                            conquista.put("requirementValue", 250);
                            conquistas.add(conquista);
                        }

                        // Conquista: Streak de 3 dias
                        if (diasConsecutivos >= 3) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 5);
                            conquista.put("name", "Continuidade!");
                            conquista.put("description", "Complete tarefas por 3 dias seguidos");
                            conquista.put("icon", "📅");
                            conquista.put("requirementValue", 150);
                            conquistas.add(conquista);
                        }

                        // Conquista: Streak de 7 dias
                        if (diasConsecutivos >= 7) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 6);
                            conquista.put("name", "Semana Completa!");
                            conquista.put("description", "Mantenha a continuidade por 7 dias");
                            conquista.put("icon", "🏆");
                            conquista.put("requirementValue", 350);
                            conquistas.add(conquista);
                        }

                        // Conquista: 50 tarefas
                        if (totalConcluidas >= 50) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 7);
                            conquista.put("name", "Meio Centenário!");
                            conquista.put("description", "Complete 50 tarefas no total");
                            conquista.put("icon", "💎");
                            conquista.put("requirementValue", 500);
                            conquistas.add(conquista);
                        }

                        // Conquista: 100 tarefas
                        if (totalConcluidas >= 100) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 8);
                            conquista.put("name", "Centenário!");
                            conquista.put("description", "Complete 100 tarefas no total");
                            conquista.put("icon", "👑");
                            conquista.put("requirementValue", 1000);
                            conquistas.add(conquista);
                        }

                        // Conquista: Semana intensa (20+ tarefas em 7 dias)
                        if (concluidasEstaSemana >= 20) {
                            Map<String, Object> conquista = new HashMap<>();
                            conquista.put("id", 9);
                            conquista.put("name", "Semana Intensa!");
                            conquista.put("description", "Complete 20+ tarefas em uma semana");
                            conquista.put("icon", "⚡");
                            conquista.put("requirementValue", 200);
                            conquistas.add(conquista);
                        }
                    }
                }

                res.status(200);
                return gson.toJson(conquistas);
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar conquistas: " + e.getMessage()));
        }
    }

    private static Object buscarEstatisticasSemanais(Request req, Response res) {
        try {
            long idCasa = Long.parseLong(req.params(":id"));
            Map<String, Object> stats = new HashMap<>();

            try (Connection conn = Database.connect()) {
                // Buscar tarefas da última semana
                String sql = """
                    SELECT 
                        COUNT(*) FILTER (WHERE t.status = 'completed' AND t.completed_at >= CURRENT_DATE - INTERVAL '7 days') as tarefasConcluidas,
                        COUNT(*) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '7 days') as tarefasTotais,
                        COUNT(DISTINCT DATE(t.completed_at)) FILTER (WHERE t.status = 'completed' AND t.completed_at >= CURRENT_DATE - INTERVAL '7 days') as diasAtivos
                    FROM tasks t
                    JOIN rooms r ON t.room_id = r.id
                    JOIN houses h ON r.house_id = h.id
                    WHERE h.id = ?
                """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    if (rs.next()) {
                        int concluidas = rs.getInt("tarefasConcluidas");
                        int totais = rs.getInt("tarefasTotais");
                        int diasAtivos = rs.getInt("diasAtivos");
                        
                        // Se não houver tarefas criadas esta semana, considerar total como 40 (média)
                        if (totais == 0) {
                            totais = 40;
                        }

                        stats.put("tarefasConcluidas", concluidas);
                        stats.put("tarefasTotais", totais);
                        stats.put("streak", diasAtivos);
                        stats.put("conquistasRecentes", new ArrayList<>()); // Placeholder para conquistas
                    }
                }

                res.status(200);
                return gson.toJson(stats);
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar estatísticas: " + e.getMessage()));
        }
    }

    private static Object buscarAlertasDaCasa(Request req, Response res) {
        try {
            long idCasa = Long.parseLong(req.params(":id"));
            List<Map<String, Object>> alertas = new ArrayList<>();

            try (Connection conn = Database.connect()) {
                // Buscar tarefas atrasadas e que vencem hoje
                String sql = """
                    SELECT 
                        t.id as id,
                        t.title as titulo,
                        t.description as descricao,
                        t.due_date as dataVencimento,
                        t.status as status,
                        t.priority as prioridade,
                        u.full_name as responsavel,
                        r.name as comodo,
                        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - t.due_date)) as diasAtrasado
                    FROM tasks t
                    JOIN rooms r ON t.room_id = r.id
                    JOIN houses h ON r.house_id = h.id
                    LEFT JOIN users u ON t.assigned_user_id = u.id
                    WHERE h.id = ?
                    AND t.status != 'completed'
                    AND t.due_date IS NOT NULL
                    AND (
                        t.due_date < CURRENT_TIMESTAMP 
                        OR DATE(t.due_date) = CURRENT_DATE
                    )
                    ORDER BY 
                        CASE 
                            WHEN t.due_date < CURRENT_TIMESTAMP THEN 1
                            ELSE 2
                        END,
                        t.due_date ASC
                """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    // Contadores para agregação
                    int tarefasAtrasadas = 0;
                    int tarefasVencemHoje = 0;
                    List<String> tarefasCriticas = new ArrayList<>();

                    while (rs.next()) {
                        Timestamp dataVencimento = rs.getTimestamp("dataVencimento");
                        long diasAtrasado = rs.getLong("diasAtrasado");
                        String titulo = rs.getString("titulo");
                        
                        if (diasAtrasado > 0) {
                            tarefasAtrasadas++;
                            if (diasAtrasado >= 5) {
                                tarefasCriticas.add(titulo + " (há " + diasAtrasado + " dias)");
                            }
                        } else {
                            tarefasVencemHoje++;
                        }
                    }

                    // Criar alertas agregados
                    // Alerta crítico: tarefas muito atrasadas
                    if (!tarefasCriticas.isEmpty()) {
                        Map<String, Object> alerta = new HashMap<>();
                        alerta.put("id", 1);
                        alerta.put("type", "critical");
                        alerta.put("title", tarefasCriticas.size() + " tarefa" + (tarefasCriticas.size() > 1 ? "s" : "") + " muito atrasada" + (tarefasCriticas.size() > 1 ? "s" : ""));
                        alerta.put("description", tarefasCriticas.get(0));
                        alerta.put("timestamp", new Timestamp(System.currentTimeMillis()));
                        alertas.add(alerta);
                    }

                    // Alerta crítico: outras tarefas atrasadas
                    if (tarefasAtrasadas > tarefasCriticas.size()) {
                        Map<String, Object> alerta = new HashMap<>();
                        alerta.put("id", 2);
                        alerta.put("type", "critical");
                        int outras = tarefasAtrasadas - tarefasCriticas.size();
                        alerta.put("title", outras + " tarefa" + (outras > 1 ? "s" : "") + " atrasada" + (outras > 1 ? "s" : ""));
                        alerta.put("description", "Verifique suas tarefas pendentes");
                        alerta.put("timestamp", new Timestamp(System.currentTimeMillis()));
                        alertas.add(alerta);
                    }

                    // Alerta de aviso: tarefas que vencem hoje
                    if (tarefasVencemHoje > 0) {
                        Map<String, Object> alerta = new HashMap<>();
                        alerta.put("id", 3);
                        alerta.put("type", "warning");
                        alerta.put("title", tarefasVencemHoje + " tarefa" + (tarefasVencemHoje > 1 ? "s" : "") + " vence" + (tarefasVencemHoje > 1 ? "m" : "") + " hoje");
                        alerta.put("description", "Complete antes do fim do dia");
                        alerta.put("timestamp", new Timestamp(System.currentTimeMillis()));
                        alertas.add(alerta);
                    }

                    // Se não houver alertas, adicionar mensagem positiva
                    if (alertas.isEmpty()) {
                        Map<String, Object> alerta = new HashMap<>();
                        alerta.put("id", 4);
                        alerta.put("type", "success");
                        alerta.put("title", "Tudo em dia!");
                        alerta.put("description", "Nenhuma tarefa atrasada");
                        alerta.put("timestamp", new Timestamp(System.currentTimeMillis()));
                        alertas.add(alerta);
                    }
                }

                res.status(200);
                return gson.toJson(alertas);
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alertas: " + e.getMessage()));
        }
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
                            WHERE t.id_casa = ?
                            ORDER BY t.ativo ASC, t.data_criacao DESC
                        """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setLong(1, idCasa);
                    ResultSet rs = stmt.executeQuery();

                    while (rs.next()) {
                        Map<String, Object> tarefa = new HashMap<>();
                        tarefa.put("id", rs.getLong("idTarefa"));
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