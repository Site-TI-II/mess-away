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

        // Example: Generate smart insight for casa
        post("/MessAway/ai/casa-insight", (req, res) -> {
            res.type("application/json");
            try {
                if (!aiService.isConfigured()) {
                    res.status(503);
                    return gson.toJson(AIResponse.error("AI service not configured"));
                }

                var body = gson.fromJson(req.body(), java.util.Map.class);
                String casaName = (String) body.get("casaName");
                Integer totalTasks = body.get("totalTasks") != null 
                    ? ((Double) body.get("totalTasks")).intValue() 
                    : 0;
                Integer completedTasks = body.get("completedTasks") != null 
                    ? ((Double) body.get("completedTasks")).intValue() 
                    : 0;

                AIRequest request = new AIRequest();
                request.setContext("You are a helpful home management assistant. Provide brief, actionable insights.");
                request.setPrompt(String.format(
                    "Casa '%s' has %d total tasks with %d completed. Give a brief, encouraging insight about their progress (max 2 sentences).",
                    casaName, totalTasks, completedTasks
                ));
                request.setMaxTokens(150);
                request.setTemperature(0.7);

                AIResponse response = aiService.generate(request);
                res.status(response.isSuccess() ? 200 : 500);
                return gson.toJson(response);
            } catch (Exception e) {
                res.status(400);
                return gson.toJson(AIResponse.error("Invalid request: " + e.getMessage()));
            }
        });
    }
}
