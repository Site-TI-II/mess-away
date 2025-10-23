package com.messaway.model;

import java.sql.Timestamp;

public class Conta {
    private int idConta;
    private String nome;
    private String email;
    private String senha;
    private Timestamp dataCadastro;
    private Integer idCasa;
    private boolean ativo = true;

    public Conta() {}

    public Conta(int idConta, String nome, String email, String senha, Timestamp dataCadastro, Integer idCasa, boolean ativo) {
        this.idConta = idConta;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
        this.idCasa = idCasa;
        this.ativo = ativo;
    }

    public int getIdConta() {
        return idConta;
    }

    public void setIdConta(int idConta) {
        this.idConta = idConta;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public Timestamp getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Timestamp dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Integer getIdCasa() {
        return idCasa;
    }

    public void setIdCasa(Integer idCasa) {
        this.idCasa = idCasa;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}