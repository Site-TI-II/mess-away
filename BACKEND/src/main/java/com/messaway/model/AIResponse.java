package com.messaway.model;

/**
 * Model for AI generation responses
 */
public class AIResponse {
    private String content;
    private String model;
    private int tokensUsed;
    private boolean success;
    private String error;

    public AIResponse() {
    }

    public AIResponse(String content, String model, int tokensUsed) {
        this.content = content;
        this.model = model;
        this.tokensUsed = tokensUsed;
        this.success = true;
    }

    public static AIResponse error(String errorMessage) {
        AIResponse response = new AIResponse();
        response.success = false;
        response.error = errorMessage;
        return response;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getTokensUsed() {
        return tokensUsed;
    }

    public void setTokensUsed(int tokensUsed) {
        this.tokensUsed = tokensUsed;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
