package com.messaway.model;

public class UsuarioCasa {
    private long id;
    private String nome;
    private String papel;
    private long casaId;

    public UsuarioCasa() {}

    public UsuarioCasa(long id, String nome, String papel, long casaId) {
        this.id = id;
        this.nome = nome;
        this.papel = papel;
        this.casaId = casaId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPapel() {
        return papel;
    }

    public void setPapel(String papel) {
        this.papel = papel;
    }

    public long getCasaId() {
        return casaId;
    }

    public void setCasaId(long casaId) {
        this.casaId = casaId;
    }
}
