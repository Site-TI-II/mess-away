package com.messaway.controller;

import com.google.gson.Gson;
import com.messaway.model.AIRequest;
import com.messaway.model.AIResponse;
import com.messaway.service.AIService;

import static spark.Spark.*;

/**
 * Controller for AI-powered features using Claude Sonnet 4.5
 * Enabled globally for all clients
 */
public class AIController {
    
    public static void registerRoutes() {
        Gson gson = new Gson();
        AIService aiService = new AIService();

        // Health check endpoint
        get("/MessAway/ai/status", (req, res) -> {
            res.type("application/json");
            boolean configured = aiService.isConfigured();
            return gson.toJson(java.util.Map.of(
                "configured", configured,
                "model", aiService.getModel(),
                "status", configured ? "ready" : "not_configured"
            ));
        });

        // Generate AI response
        post("/MessAway/ai/generate", (req, res) -> {
            res.type("application/json");
            try {
                if (!aiService.isConfigured()) {
                    res.status(503);
                    return gson.toJson(AIResponse.error("AI service not configured. Set ANTHROPIC_API_KEY environment variable."));
                }

                AIRequest request = gson.fromJson(req.body(), AIRequest.class);
                AIResponse response = aiService.generate(request);
                
                if (response.isSuccess()) {
                    res.status(200);
                } else {
                    res.status(500);
                }
                
                return gson.toJson(response);
            } catch (Exception e) {
                res.status(400);
                return gson.toJson(AIResponse.error("Invalid request: " + e.getMessage()));
            }
        });

        // Enhanced smart insight for casa with detailed analysis
        post("/MessAway/ai/casa-insight", (req, res) -> {
            res.type("application/json");
            try {
                if (!aiService.isConfigured()) {
                    res.status(503);
                    return gson.toJson(AIResponse.error("AI service not configured"));
                }

                var body = gson.fromJson(req.body(), java.util.Map.class);
                Integer casaId = body.get("casaId") != null 
                    ? ((Double) body.get("casaId")).intValue() 
                    : null;
                String casaName = (String) body.get("casaName");

                if (casaId == null) {
                    res.status(400);
                    return gson.toJson(AIResponse.error("casaId é obrigatório para análise detalhada"));
                }

                // Buscar dados detalhados da casa do banco
                StringBuilder analysisData = new StringBuilder();
                
                try (var conn = com.messaway.db.Database.getConnection()) {
                    // 1. Buscar usuários da casa e suas tarefas
                    String userTasksQuery = """
                        SELECT 
                            c.nome as usuario_nome,
                            COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as tarefas_pendentes,
                            COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as tarefas_concluidas,
                            COUNT(t.id_tarefa) as total_tarefas
                        FROM CONTA c
                        LEFT JOIN TAREFA t ON c.id_conta = t.id_usuario_responsavel
                        WHERE c.id_casa = ? OR EXISTS (
                            SELECT 1 FROM houses h WHERE h.id = ? AND h.owner_id IN (
                                SELECT u.id FROM users u WHERE u.email = c.email
                            )
                        )
                        GROUP BY c.id_conta, c.nome
                        ORDER BY total_tarefas DESC
                    """;
                    
                    try (var stmt = conn.prepareStatement(userTasksQuery)) {
                        stmt.setInt(1, casaId);
                        stmt.setInt(2, casaId);
                        try (var rs = stmt.executeQuery()) {
                            analysisData.append("USUÁRIOS DA CASA:\n");
                            int totalUsers = 0;
                            int usersWithTasks = 0;
                            
                            while (rs.next()) {
                                String nome = rs.getString("usuario_nome");
                                int pendentes = rs.getInt("tarefas_pendentes");
                                int concluidas = rs.getInt("tarefas_concluidas");
                                int total = rs.getInt("total_tarefas");
                                
                                totalUsers++;
                                if (total > 0) usersWithTasks++;
                                
                                analysisData.append(String.format(
                                    "- %s: %d tarefas (%d pendentes, %d concluídas)\n", 
                                    nome, total, pendentes, concluidas
                                ));
                            }
                            
                            if (totalUsers == 0) {
                                analysisData.append("- Nenhum usuário encontrado\n");
                            }
                        }
                    }
                    
                    // 2. Buscar tarefas por prioridade e status
                    String taskAnalysisQuery = """
                        SELECT 
                            status,
                            prioridade,
                            COUNT(*) as quantidade
                        FROM TAREFA t
                        WHERE t.id_casa = ?
                        GROUP BY status, prioridade
                        ORDER BY prioridade DESC, status
                    """;
                    
                    try (var stmt = conn.prepareStatement(taskAnalysisQuery)) {
                        stmt.setInt(1, casaId);
                        try (var rs = stmt.executeQuery()) {
                            analysisData.append("\nTAREFAS POR PRIORIDADE:\n");
                            boolean hasData = false;
                            
                            while (rs.next()) {
                                hasData = true;
                                String status = rs.getString("status");
                                int prioridade = rs.getInt("prioridade");
                                int quantidade = rs.getInt("quantidade");
                                
                                String prioText = switch(prioridade) {
                                    case 1 -> "Baixa";
                                    case 2 -> "Média"; 
                                    case 3 -> "Alta";
                                    default -> "Não definida";
                                };
                                
                                analysisData.append(String.format(
                                    "- %s prioridade (%s): %d tarefas\n",
                                    prioText, status, quantidade
                                ));
                            }
                            
                            if (!hasData) {
                                analysisData.append("- Nenhuma tarefa encontrada\n");
                            }
                        }
                    }
                    
                    // 3. Buscar tarefas atrasadas
                    String overdueQuery = """
                        SELECT COUNT(*) as atrasadas
                        FROM TAREFA 
                        WHERE id_casa = ? 
                        AND status = 'pending' 
                        AND data_estimada < CURRENT_TIMESTAMP
                    """;
                    
                    try (var stmt = conn.prepareStatement(overdueQuery)) {
                        stmt.setInt(1, casaId);
                        try (var rs = stmt.executeQuery()) {
                            if (rs.next()) {
                                int atrasadas = rs.getInt("atrasadas");
                                analysisData.append(String.format("\nTAREFAS ATRASADAS: %d\n", atrasadas));
                            }
                        }
                    }
                }

                // Criar prompt inteligente para a IA
                AIRequest request = new AIRequest();
                request.setContext("Você é um assistente inteligente de gerenciamento doméstico. Analise os dados e dê insights práticos e específicos em português do Brasil. Seja direto, útil e personalizado.");
                
                String prompt = String.format("""
                    Analise esta casa '%s' e dê 1-2 insights específicos e úteis:
                    
                    %s
                    
                    Foque em:
                    - Distribuição desigual de tarefas entre usuários
                    - Sugestões práticas de organização
                    - Prioridades mal distribuídas
                    - Problemas de produtividade
                    
                    Seja específico com nomes e números. Máximo 2 frases diretas.
                    """, casaName, analysisData.toString());
                
                request.setPrompt(prompt);
                request.setMaxTokens(200);
                request.setTemperature(0.8);

                AIResponse response = aiService.generate(request);
                res.status(response.isSuccess() ? 200 : 500);
                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(AIResponse.error("Erro ao analisar dados da casa: " + e.getMessage()));
            }
        });
    }
}
