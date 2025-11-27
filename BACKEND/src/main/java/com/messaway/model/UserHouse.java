package com.messaway.model;

import java.sql.Timestamp;

/**
 * UserHouse model for simplified schema
 * Replaces: UsuarioCasa with enhanced role management
 */
public class UserHouse {
    private Integer id;
    private Integer userId;
    private Integer houseId;
    private String role; // owner, admin, member
    private String nickname;
    private String color;
    private Integer points;
    private Timestamp joinedAt;
    private Boolean active;

    // Constructors
    public UserHouse() {}

    public UserHouse(Integer userId, Integer houseId, String role) {
        this.userId = userId;
        this.houseId = houseId;
        this.role = role != null ? role : "member";
        this.color = "#6366f1";
        this.points = 0;
        this.active = true;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getHouseId() {
        return houseId;
    }

    public void setHouseId(Integer houseId) {
        this.houseId = houseId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Timestamp getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Timestamp joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    // Legacy compatibility methods
    public Long getIdUsuarioCasa() {
        return id != null ? id.longValue() : null;
    }

    public void setIdUsuarioCasa(Long idUsuarioCasa) {
        this.id = idUsuarioCasa != null ? idUsuarioCasa.intValue() : null;
    }

    public Long getIdUsuario() {
        return userId != null ? userId.longValue() : null;
    }

    public void setIdUsuario(Long idUsuario) {
        this.userId = idUsuario != null ? idUsuario.intValue() : null;
    }

    public Long getIdCasa() {
        return houseId != null ? houseId.longValue() : null;
    }

    public void setIdCasa(Long idCasa) {
        this.houseId = idCasa != null ? idCasa.intValue() : null;
    }

    public String getPermissao() {
        return role;
    }

    public void setPermissao(String permissao) {
        this.role = permissao;
    }

    public String getApelido() {
        return nickname;
    }

    public void setApelido(String apelido) {
        this.nickname = apelido;
    }

    public String getCor() {
        return color;
    }

    public void setCor(String cor) {
        this.color = cor;
    }

    public Timestamp getDataAssociacao() {
        return joinedAt;
    }

    public void setDataAssociacao(Timestamp dataAssociacao) {
        this.joinedAt = dataAssociacao;
    }
}