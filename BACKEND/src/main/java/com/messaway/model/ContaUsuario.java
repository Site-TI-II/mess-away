package com.messaway.model;

import java.sql.Timestamp;

public class ContaUsuario {
    private int id;
    private int idConta;
    private int idUsuario;
    private String apelido;
    private String cor;
    private String permissao;
    private Timestamp dataAssociacao;

    public ContaUsuario() {}

    public ContaUsuario(int id, int idConta, int idUsuario, String apelido, String cor, String permissao, Timestamp dataAssociacao) {
        this.id = id;
        this.idConta = idConta;
        this.idUsuario = idUsuario;
        this.apelido = apelido;
        this.cor = cor;
        this.permissao = permissao;
        this.dataAssociacao = dataAssociacao;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdConta() {
        return idConta;
    }

    public void setIdConta(int idConta) {
        this.idConta = idConta;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getApelido() {
        return apelido;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getPermissao() {
        return permissao;
    }

    public void setPermissao(String permissao) {
        this.permissao = permissao;
    }

    public Timestamp getDataAssociacao() {
        return dataAssociacao;
    }

    public void setDataAssociacao(Timestamp dataAssociacao) {
        this.dataAssociacao = dataAssociacao;
    }
}