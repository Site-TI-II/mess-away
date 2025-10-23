package com.messaway.model;

import com.google.gson.annotations.SerializedName;

public class Casa {
    @SerializedName("id")
    private Long id_casa; // Ajustado para corresponder ao nome da coluna no banco
    private String nome;
    private String descricao;
    private String endereco;
    private boolean ativo;
    private int pontos;

    public Casa() {
        this.ativo = true;
        this.pontos = 0;
    }

    public Casa(Long id_casa, String nome) {
        this.id_casa = id_casa;
        this.nome = nome;
        this.ativo = true;
        this.pontos = 0;
    }

    public int getPontos() {
        return pontos;
    }

    public void setPontos(int pontos) {
        this.pontos = pontos;
    }

    public Long getId() {
        return id_casa;
    }

    public void setId(Long id) {
        this.id_casa = id;
    }

    public Long getId_casa() {
        return id_casa;
    }

    public void setId_casa(Long id_casa) {
        this.id_casa = id_casa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
