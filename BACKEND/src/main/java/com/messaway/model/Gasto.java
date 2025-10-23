package com.messaway.model;

import java.sql.Timestamp;

public class Gasto {
    private int idGasto;
    private int idCasa;
    private String nome;
    private double valor;
    private Timestamp dataCriacao;

    public Gasto() {
        this.idGasto = -1;
        this.idCasa = -1;
        this.nome = "";
        this.valor = 0.0;
    }

    public Gasto(int idGasto, int idCasa, String nome, double valor, Timestamp dataCriacao) {
        this.idGasto = idGasto;
        this.idCasa = idCasa;
        this.nome = nome;
        this.valor = valor;
        this.dataCriacao = dataCriacao;
    }

    public int getIdGasto() {
        return this.idGasto;
    }

    public void setIdGasto(int idGasto) {
        this.idGasto = idGasto;
    }

    public int getIdCasa() {
        return this.idCasa;
    }

    public void setIdCasa(int idCasa) {
        this.idCasa = idCasa;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getValor() {
        return this.valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public Timestamp getDataCriacao() {
        return this.dataCriacao;
    }

    public void setDataCriacao(Timestamp dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    @Override
    public String toString() {
        return "Gasto [idGasto=" + idGasto + ", idCasa=" + idCasa + ", nome=" + nome + ", valor=" + valor + ", dataCriacao="
                + dataCriacao + "]";
    }
}