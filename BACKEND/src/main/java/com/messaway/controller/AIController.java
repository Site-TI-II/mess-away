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

        // Smart task priority classifier - analyzes and categorizes tasks automatically
        post("/MessAway/ai/classify-task", (req, res) -> {
            res.type("application/json");
            try {
                if (!aiService.isConfigured()) {
                    res.status(503);
                    return gson.toJson(AIResponse.error("AI service not configured"));
                }

                var body = gson.fromJson(req.body(), java.util.Map.class);
                String taskName = (String) body.get("taskName");
                String description = (String) body.get("description");
                String dueDate = (String) body.get("dueDate");
                Integer casaId = body.get("casaId") != null ? ((Double) body.get("casaId")).intValue() : null;

                if (taskName == null || taskName.trim().isEmpty()) {
                    res.status(400);
                    return gson.toJson(AIResponse.error("Nome da tarefa é obrigatório"));
                }

                // Get context about existing tasks if casaId provided
                StringBuilder contextData = new StringBuilder();
                if (casaId != null) {
                    try (var conn = com.messaway.db.Database.getConnection()) {
                        String contextQuery = """
                            SELECT nome, prioridade, status, 
                                   CASE WHEN data_estimada < CURRENT_TIMESTAMP THEN 'ATRASADA' ELSE 'NO_PRAZO' END as situacao
                            FROM TAREFA 
                            WHERE id_casa = ? 
                            ORDER BY data_criacao DESC 
                            LIMIT 10
                        """;
                        
                        try (var stmt = conn.prepareStatement(contextQuery)) {
                            stmt.setInt(1, casaId);
                            try (var rs = stmt.executeQuery()) {
                                contextData.append("Contexto das tarefas existentes na casa:\n");
                                while (rs.next()) {
                                    contextData.append(String.format("- %s (Prioridade: %d, %s)\n",
                                        rs.getString("nome"), rs.getInt("prioridade"), rs.getString("situacao")));
                                }
                            }
                        }
                    }
                }

                AIRequest request = new AIRequest();
                request.setContext("""
                    Você é um especialista em gestão doméstica que classifica tarefas por prioridade e urgência.
                    
                    REGRAS DE CLASSIFICAÇÃO:
                    - PRIORIDADE 3 (ALTA): Visitas, eventos, segurança, higiene crítica, prazos urgentes
                    - PRIORIDADE 2 (MÉDIA): Limpeza geral, organização, manutenção regular
                    - PRIORIDADE 1 (BAIXA): Decoração, otimizações, tarefas sem prazo específico
                    
                    FATORES DE URGÊNCIA:
                    - Prazo próximo (hoje/amanhã) = +1 prioridade
                    - Palavras como "visita", "chegando", "urgente", "importante" = +1 prioridade
                    - Tarefas básicas atrasadas (louça, lixo) = prioridade 2 mínima
                    
                    Responda apenas com JSON: {"priority": 1-3, "reasoning": "explicação breve", "recommendations": ["dica1", "dica2"]}
                    """);

                String prompt = String.format("""
                    Classifique esta tarefa:
                    
                    TAREFA: "%s"
                    DESCRIÇÃO: "%s"
                    PRAZO: %s
                    
                    %s
                    
                    Considere:
                    - O nome indica urgência ou evento especial?
                    - O prazo está próximo ou já passou?
                    - É uma tarefa básica de higiene/limpeza?
                    - Tem impacto social (visitas, eventos)?
                    """, 
                    taskName, 
                    description != null ? description : "Não informada",
                    dueDate != null ? dueDate : "Não informado",
                    contextData.toString()
                );

                request.setPrompt(prompt);
                request.setMaxTokens(300);
                request.setTemperature(0.3); // Baixa temperatura para classificação consistente

                AIResponse response = aiService.generate(request);
                res.status(response.isSuccess() ? 200 : 500);
                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return gson.toJson(AIResponse.error("Erro ao classificar tarefa: " + e.getMessage()));
            }
        });

        // Enhanced smart insight for casa with intelligent task analysis
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

                // Gather comprehensive house data
                StringBuilder analysisData = new StringBuilder();
                
                try (var conn = com.messaway.db.Database.getConnection()) {
                    // 1. User workload analysis
                    String userTasksQuery = """
                        SELECT 
                            c.nome as usuario_nome,
                            COUNT(CASE WHEN t.ativo = false THEN 1 END) as tarefas_pendentes,
                            COUNT(CASE WHEN t.ativo = true THEN 1 END) as tarefas_concluidas,
                            COUNT(CASE WHEN t.ativo = false AND t.data_estimada < CURRENT_TIMESTAMP THEN 1 END) as atrasadas,
                            AVG(CASE WHEN t.ativo = false THEN t.prioridade END) as prioridade_media
                        FROM CONTA c
                        LEFT JOIN TAREFA t ON c.id_conta = t.id_usuario_responsavel
                        WHERE c.id_casa = ? OR EXISTS (
                            SELECT 1 FROM houses h WHERE h.id = ? AND h.owner_id IN (
                                SELECT u.id FROM users u WHERE u.email = c.email
                            )
                        )
                        GROUP BY c.id_conta, c.nome
                        ORDER BY tarefas_pendentes DESC
                    """;
                    
                    try (var stmt = conn.prepareStatement(userTasksQuery)) {
                        stmt.setInt(1, casaId);
                        stmt.setInt(2, casaId);
                        try (var rs = stmt.executeQuery()) {
                            analysisData.append("DISTRIBUIÇÃO DE TRABALHO:\n");
                            
                            while (rs.next()) {
                                String nome = rs.getString("usuario_nome");
                                int pendentes = rs.getInt("tarefas_pendentes");
                                int concluidas = rs.getInt("tarefas_concluidas");
                                int atrasadas = rs.getInt("atrasadas");
                                double prioMedia = rs.getDouble("prioridade_media");
                                
                                analysisData.append(String.format(
                                    "- %s: %d pendentes (%d atrasadas), %d concluídas, prioridade média %.1f\n", 
                                    nome, pendentes, atrasadas, concluidas, prioMedia
                                ));
                            }
                        }
                    }
                    
                    // 2. Critical tasks analysis
                    String criticalTasksQuery = """
                        SELECT nome, prioridade, 
                               CASE WHEN data_estimada < CURRENT_TIMESTAMP THEN 'ATRASADA' 
                                    WHEN data_estimada < CURRENT_TIMESTAMP + INTERVAL '1 day' THEN 'URGENTE'
                                    ELSE 'NO_PRAZO' END as urgencia
                        FROM TAREFA 
                        WHERE id_casa = ? AND ativo = false
                        AND (prioridade >= 3 OR data_estimada < CURRENT_TIMESTAMP + INTERVAL '2 days')
                        ORDER BY prioridade DESC, data_estimada ASC
                        LIMIT 5
                    """;
                    
                    try (var stmt = conn.prepareStatement(criticalTasksQuery)) {
                        stmt.setInt(1, casaId);
                        try (var rs = stmt.executeQuery()) {
                            analysisData.append("\nTAREFAS CRÍTICAS/URGENTES:\n");
                            boolean hasCritical = false;
                            
                            while (rs.next()) {
                                hasCritical = true;
                                String nome = rs.getString("nome");
                                int prioridade = rs.getInt("prioridade");
                                String urgencia = rs.getString("urgencia");
                                
                                analysisData.append(String.format("- %s (Prioridade %d, %s)\n", nome, prioridade, urgencia));
                            }
                            
                            if (!hasCritical) {
                                analysisData.append("- Nenhuma tarefa crítica identificada\n");
                            }
                        }
                    }
                    
                    // 3. Priority distribution and patterns
                    String priorityStatsQuery = """
                        SELECT 
                            prioridade,
                            COUNT(*) as total,
                            COUNT(CASE WHEN ativo = false THEN 1 END) as pendentes,
                            COUNT(CASE WHEN ativo = false AND data_estimada < CURRENT_TIMESTAMP THEN 1 END) as atrasadas
                        FROM TAREFA 
                        WHERE id_casa = ?
                        GROUP BY prioridade
                        ORDER BY prioridade DESC
                    """;
                    
                    try (var stmt = conn.prepareStatement(priorityStatsQuery)) {
                        stmt.setInt(1, casaId);
                        try (var rs = stmt.executeQuery()) {
                            analysisData.append("\nESTATÍSTICAS DE PRIORIDADE:\n");
                            
                            while (rs.next()) {
                                int prioridade = rs.getInt("prioridade");
                                int total = rs.getInt("total");
                                int pendentes = rs.getInt("pendentes");
                                int atrasadas = rs.getInt("atrasadas");
                                
                                String prioText = switch(prioridade) {
                                    case 1 -> "Baixa";
                                    case 2 -> "Média"; 
                                    case 3 -> "Alta";
                                    default -> "Indefinida";
                                };
                                
                                analysisData.append(String.format("- %s: %d total (%d pendentes, %d atrasadas)\n", 
                                    prioText, total, pendentes, atrasadas));
                            }
                        }
                    }
                }

                AIRequest request = new AIRequest();
                request.setContext("""
                    Você é um consultor especialista em gestão doméstica e produtividade. 
                    Analise os dados e identifique problemas específicos com soluções práticas.
                    
                    FOQUE EM:
                    - Desequilíbrio de tarefas entre pessoas
                    - Prioridades mal gerenciadas
                    - Padrões de atraso
                    - Recomendações específicas e acionáveis
                    
                    Seja direto, use nomes das pessoas e números concretos. Máximo 3 frases em português do Brasil.
                    """);
                
                String prompt = String.format("""
                    Analise esta casa '%s' e identifique os principais problemas de gestão:
                    
                    %s
                    
                    Dê 1-2 insights específicos com soluções práticas. Mencione nomes e números quando relevante.
                    Identifique padrões problemáticos e sugira ações concretas.
                    """, casaName != null ? casaName : "Casa", analysisData.toString());
                
                request.setPrompt(prompt);
                request.setMaxTokens(250);
                request.setTemperature(0.7);

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
