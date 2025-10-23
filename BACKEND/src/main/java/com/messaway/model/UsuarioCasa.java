package com.messaway.model;

public class UsuarioCasa {
    // id_usuario_casa (primary key)
    private Long id;
    // id_usuario referencing USUARIO.id_usuario
    private Long idUsuario;
    // id_casa referencing CASA.id_casa
    private Long idCasa;
    // permissao/role
    private String permissao;
    // optional display name (apelido)
    private String apelido;

    public UsuarioCasa() {}

    public UsuarioCasa(Long id, Long idUsuario, Long idCasa, String permissao, String apelido) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idCasa = idCasa;
        this.permissao = permissao;
        this.apelido = apelido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdCasa() {
        return idCasa;
    }

    public void setIdCasa(Long idCasa) {
        this.idCasa = idCasa;
    }

    public String getPermissao() {
        return permissao;
    }

    public void setPermissao(String permissao) {
        this.permissao = permissao;
    }

    public String getApelido() {
        return apelido;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }
}
