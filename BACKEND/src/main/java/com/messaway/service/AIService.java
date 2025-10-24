package com.messaway.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.messaway.model.AIRequest;
import com.messaway.model.AIResponse;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Service for interacting with Claude Sonnet 4.5 via Anthropic API
 * Configured globally for all clients
 */
public class AIService {
    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String API_KEY = System.getenv("ANTHROPIC_API_KEY");
    private static final String MODEL = System.getenv("AI_MODEL") != null 
        ? System.getenv("AI_MODEL") 
        : "claude-sonnet-4-20250514"; // Latest Claude Sonnet 4.5 model
    private static final int DEFAULT_MAX_TOKENS = 1024;
    private static final double DEFAULT_TEMPERATURE = 1.0;
    
    private final Gson gson = new Gson();

    /**
     * Generate AI response using Claude Sonnet 4.5
     * @param request The AI request containing prompt and optional context
     * @return AIResponse with generated content
     */
    public AIResponse generate(AIRequest request) {
        if (API_KEY == null || API_KEY.isEmpty()) {
            return AIResponse.error("ANTHROPIC_API_KEY environment variable not set");
        }

        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            return AIResponse.error("Prompt cannot be empty");
        }

        try {
            // Build the request payload
            JsonObject payload = new JsonObject();
            payload.addProperty("model", MODEL);
            payload.addProperty("max_tokens", 
                request.getMaxTokens() != null ? request.getMaxTokens() : DEFAULT_MAX_TOKENS);
            
            // Add system message if context is provided
            if (request.getContext() != null && !request.getContext().isEmpty()) {
                payload.addProperty("system", request.getContext());
            }
            
            // Add user message
            JsonArray messages = new JsonArray();
            JsonObject userMessage = new JsonObject();
            userMessage.addProperty("role", "user");
            userMessage.addProperty("content", request.getPrompt());
            messages.add(userMessage);
            payload.add("messages", messages);
            
            // Optional: temperature
            if (request.getTemperature() != null) {
                payload.addProperty("temperature", request.getTemperature());
            } else {
                payload.addProperty("temperature", DEFAULT_TEMPERATURE);
            }

            // Make HTTP request
            URL url = new URL(ANTHROPIC_API_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("x-api-key", API_KEY);
            conn.setRequestProperty("anthropic-version", "2023-06-01");
            conn.setDoOutput(true);

            // Send request
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = payload.toString().getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Read response
            int responseCode = conn.getResponseCode();
            StringBuilder response = new StringBuilder();
            
            BufferedReader reader;
            if (responseCode >= 200 && responseCode < 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            }
            
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            if (responseCode >= 200 && responseCode < 300) {
                // Parse successful response
                JsonObject jsonResponse = gson.fromJson(response.toString(), JsonObject.class);
                
                String content = "";
                if (jsonResponse.has("content") && jsonResponse.get("content").isJsonArray()) {
                    JsonArray contentArray = jsonResponse.getAsJsonArray("content");
                    if (contentArray.size() > 0) {
                        JsonObject firstContent = contentArray.get(0).getAsJsonObject();
                        if (firstContent.has("text")) {
                            content = firstContent.get("text").getAsString();
                        }
                    }
                }
                
                int tokensUsed = 0;
                if (jsonResponse.has("usage")) {
                    JsonObject usage = jsonResponse.getAsJsonObject("usage");
                    if (usage.has("output_tokens")) {
                        tokensUsed = usage.get("output_tokens").getAsInt();
                    }
                }
                
                return new AIResponse(content, MODEL, tokensUsed);
            } else {
                // Parse error response
                String errorMessage = "API request failed with status " + responseCode;
                try {
                    JsonObject errorJson = gson.fromJson(response.toString(), JsonObject.class);
                    if (errorJson.has("error")) {
                        JsonObject error = errorJson.getAsJsonObject("error");
                        if (error.has("message")) {
                            errorMessage = error.get("message").getAsString();
                        }
                    }
                } catch (Exception e) {
                    errorMessage += ": " + response.toString();
                }
                return AIResponse.error(errorMessage);
            }
        } catch (Exception e) {
            return AIResponse.error("Error calling Anthropic API: " + e.getMessage());
        }
    }

    /**
     * Check if AI service is properly configured
     * @return true if API key is set
     */
    public boolean isConfigured() {
        return API_KEY != null && !API_KEY.isEmpty();
    }

    /**
     * Get the current model being used
     * @return Model name
     */
    public String getModel() {
        return MODEL;
    }
}
