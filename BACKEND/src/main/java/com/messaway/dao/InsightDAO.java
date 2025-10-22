package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Insight;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class InsightDAO {
    
    public Insight create(Insight insight) throws SQLException {
        String sql = "INSERT INTO INSIGHT (type, icon, title, message, color, active) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, insight.getType());
            stmt.setString(2, insight.getIcon());
            stmt.setString(3, insight.getTitle());
            stmt.setString(4, insight.getMessage());
            stmt.setString(5, insight.getColor());
            stmt.setBoolean(6, insight.isActive());
            
            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    insight.setId(rs.getLong(1));
                }
            }
            return insight;
        }
    }

    public Insight findById(long id) throws SQLException {
        String sql = "SELECT id_insight, type, icon, title, message, color, active, data_criacao FROM INSIGHT WHERE id_insight = ?";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToInsight(rs);
                }
                return null;
            }
        }
    }

    public List<Insight> listAll() throws SQLException {
        String sql = "SELECT id_insight, type, icon, title, message, color, active, data_criacao FROM INSIGHT WHERE active = true ORDER BY data_criacao DESC";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            List<Insight> insights = new ArrayList<>();
            while (rs.next()) {
                insights.add(mapResultSetToInsight(rs));
            }
            return insights;
        }
    }

    public List<Insight> listByType(String type) throws SQLException {
        String sql = "SELECT id_insight, type, icon, title, message, color, active, data_criacao FROM INSIGHT WHERE type = ? AND active = true ORDER BY data_criacao DESC";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, type);
            try (ResultSet rs = stmt.executeQuery()) {
                List<Insight> insights = new ArrayList<>();
                while (rs.next()) {
                    insights.add(mapResultSetToInsight(rs));
                }
                return insights;
            }
        }
    }

    private Insight mapResultSetToInsight(ResultSet rs) throws SQLException {
        return new Insight(
            rs.getLong("id_insight"),
            rs.getString("type"),
            rs.getString("icon"),
            rs.getString("title"),
            rs.getString("message"),
            rs.getString("color"),
            rs.getBoolean("active"),
            rs.getString("data_criacao")
        );
    }
}