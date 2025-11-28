package com.messaway.model;

import java.sql.Timestamp;

/**
 * Room model for simplified schema
 * Replaces: Comodo + Categoria
 */
public class Room {
    private Integer id;
    private Integer houseId;
    private String name;
    private String category;
    private String description;
    private String color;
    private Timestamp createdAt;
    private Boolean active;

    // Constructors
    public Room() {}

    public Room(Integer houseId, String name, String category) {
        this.houseId = houseId;
        this.name = name;
        this.category = category != null ? category : "general";
        this.color = "#6366f1";
        this.active = true;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getHouseId() {
        return houseId;
    }

    public void setHouseId(Integer houseId) {
        this.houseId = houseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    // Legacy compatibility methods
    public String getNome() {
        return name;
    }

    public void setNome(String nome) {
        this.name = nome;
    }

    public long getIdComodo() {
        return id != null ? id.longValue() : 0L;
    }

    public void setIdComodo(long idComodo) {
        this.id = (int) idComodo;
    }

    public Integer getIdCasa() {
        return houseId;
    }

    public void setIdCasa(Integer idCasa) {
        this.houseId = idCasa;
    }
}