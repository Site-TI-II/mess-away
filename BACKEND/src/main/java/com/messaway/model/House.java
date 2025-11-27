package com.messaway.model;

import java.sql.Timestamp;
import java.util.Map;

/**
 * House model for simplified schema
 * Replaces: Casa with embedded settings
 */
public class House {
    private Integer id;
    private String name;
    private String description;
    private String address;
    private Integer ownerId;
    private Map<String, Object> settings;
    private Integer totalPoints;
    private String imageUrl;
    private Timestamp createdAt;
    private Boolean active;

    // Constructors
    public House() {}

    public House(String name, String description, Integer ownerId) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.active = true;
        this.totalPoints = 0;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    // Legacy compatibility methods for old API
    public String getNome() {
        return name;
    }

    public void setNome(String nome) {
        this.name = nome;
    }

    public String getEndereco() {
        return address;
    }

    public void setEndereco(String endereco) {
        this.address = endereco;
    }

    public Integer getPontos() {
        return totalPoints;
    }

    public void setPontos(Integer pontos) {
        this.totalPoints = pontos;
    }

    public long getIdCasa() {
        return id != null ? id.longValue() : 0L;
    }

    public void setIdCasa(long idCasa) {
        this.id = (int) idCasa;
    }

    public String getImagem() {
        return imageUrl;
    }

    public void setImagem(String imagem) {
        this.imageUrl = imagem;
    }
}