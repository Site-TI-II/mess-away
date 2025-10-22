package com.messaway.model;

public class Insight {
    private long id;
    private String type;
    private String icon;
    private String title;
    private String message;
    private String color;
    private boolean active;
    private String dataCriacao;

    public Insight() {}

    public Insight(long id, String type, String icon, String title, 
                  String message, String color, boolean active, String dataCriacao) {
        this.id = id;
        this.type = type;
        this.icon = icon;
        this.title = title;
        this.message = message;
        this.color = color;
        this.active = active;
        this.dataCriacao = dataCriacao;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}