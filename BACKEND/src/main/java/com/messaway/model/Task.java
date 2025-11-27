package com.messaway.model;

import java.sql.Timestamp;
import java.util.Map;

/**
 * Task model for simplified schema
 * Replaces: Tarefa with enhanced status and metadata
 */
public class Task {
    private Integer id;
    private Integer roomId;
    private Integer assignedUserId;
    private String title;
    private String description;
    private String status; // pending, in_progress, completed, cancelled
    private Integer priority; // 1-5 (1=highest, 5=lowest)
    private Timestamp dueDate;
    private Timestamp completedAt;
    private Integer pointsValue;
    private Integer frequencyDays;
    private Map<String, Object> metadata;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public Task() {}

    public Task(Integer roomId, String title, Integer assignedUserId) {
        this.roomId = roomId;
        this.title = title;
        this.assignedUserId = assignedUserId;
        this.status = "pending";
        this.priority = 2;
        this.pointsValue = 10;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Integer assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Timestamp getDueDate() {
        return dueDate;
    }

    public void setDueDate(Timestamp dueDate) {
        this.dueDate = dueDate;
    }

    public Timestamp getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Timestamp completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getPointsValue() {
        return pointsValue;
    }

    public void setPointsValue(Integer pointsValue) {
        this.pointsValue = pointsValue;
    }

    public Integer getFrequencyDays() {
        return frequencyDays;
    }

    public void setFrequencyDays(Integer frequencyDays) {
        this.frequencyDays = frequencyDays;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Legacy compatibility methods for old API
    public String getNome() {
        return title;
    }

    public void setNome(String nome) {
        this.title = nome;
    }

    public String getDescricao() {
        return description;
    }

    public void setDescricao(String descricao) {
        this.description = descricao;
    }

    public boolean isConcluida() {
        return "completed".equals(status);
    }

    public void setConcluida(boolean concluida) {
        this.status = concluida ? "completed" : "pending";
        if (concluida && completedAt == null) {
            this.completedAt = new Timestamp(System.currentTimeMillis());
        }
    }

    public boolean isAtivo() {
        return !"cancelled".equals(status);
    }

    public void setAtivo(boolean ativo) {
        if (!ativo) {
            this.status = "cancelled";
        }
    }

    public long getIdTarefa() {
        return id != null ? id.longValue() : 0L;
    }

    public void setIdTarefa(long idTarefa) {
        this.id = (int) idTarefa;
    }

    public Integer getIdComodo() {
        return roomId;
    }

    public void setIdComodo(Integer idComodo) {
        this.roomId = idComodo;
    }

    public Integer getIdUsuario() {
        return assignedUserId;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.assignedUserId = idUsuario;
    }

    public Timestamp getDataCriacao() {
        return createdAt;
    }

    public void setDataCriacao(Timestamp dataCriacao) {
        this.createdAt = dataCriacao;
    }

    public Timestamp getDataEstimada() {
        return dueDate;
    }

    public void setDataEstimada(Timestamp dataEstimada) {
        this.dueDate = dataEstimada;
    }

    public Integer getFrequencia() {
        return frequencyDays;
    }

    public void setFrequencia(Integer frequencia) {
        this.frequencyDays = frequencia;
    }
}