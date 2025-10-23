package com.messaway.model;

import java.sql.Timestamp;

public class ContaUsuario {
    private Integer id;
    private Integer idConta;
    private Integer idUsuario;
    private String apelido;
    private String cor;
    private String permissao;
    private Timestamp dataAssociacao;

    public ContaUsuario() {}

    public ContaUsuario(Integer id, Integer idConta, Integer idUsuario, String apelido, String cor, String permissao, Timestamp dataAssociacao) {
        this.id = id;
        this.idConta = idConta;
        this.idUsuario = idUsuario;
        this.apelido = apelido;
        this.cor = cor;
        this.permissao = permissao;
        this.dataAssociacao = dataAssociacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
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