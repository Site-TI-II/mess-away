package com.messaway.model;

public class Usuario {
    private long id;
    // DB id field name used across SQL schema is `id_usuario` (int). Keep an alias for clarity.
    private Integer idUsuario;
    private String nome; // tag/name
    private String email;
    private String password;
    // Optional account linkage (if a user belongs to a conta)
    private Integer idConta;

    public Usuario() {}

    public Usuario(long id, String nome, String email, String password) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.password = password;
    }

    public Usuario(Integer idUsuario, String nome, String email, String password, Integer idConta) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.idConta = idConta;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdConta() {
        return idConta;
    }

    public void setIdConta(Integer idConta) {
        this.idConta = idConta;
    }
} 