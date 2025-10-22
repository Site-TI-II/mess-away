package com.messaway.model;

public class Achievement {
    private long id;
    private String name;
    private String icon;
    private String description;
    private String requirementType;
    private int requirementValue;
    private String dataCriacao;

    public Achievement() {}

    public Achievement(long id, String name, String icon, String description, 
                      String requirementType, int requirementValue, String dataCriacao) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.requirementType = requirementType;
        this.requirementValue = requirementValue;
        this.dataCriacao = dataCriacao;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirementType() {
        return requirementType;
    }

    public void setRequirementType(String requirementType) {
        this.requirementType = requirementType;
    }

    public int getRequirementValue() {
        return requirementValue;
    }

    public void setRequirementValue(int requirementValue) {
        this.requirementValue = requirementValue;
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}