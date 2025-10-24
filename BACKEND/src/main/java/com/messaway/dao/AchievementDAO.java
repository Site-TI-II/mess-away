package com.messaway.dao;

import com.messaway.db.Database;
import com.messaway.model.Achievement;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AchievementDAO {
    
    public Achievement create(Achievement achievement) throws SQLException {
        String sql = "INSERT INTO ACHIEVEMENT (name, icon, description, requirement_type, requirement_value) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, achievement.getName());
            stmt.setString(2, achievement.getIcon());
            stmt.setString(3, achievement.getDescription());
            stmt.setString(4, achievement.getRequirementType());
            stmt.setInt(5, achievement.getRequirementValue());
            
            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    achievement.setId(rs.getLong(1));
                }
            }
            return achievement;
        }
    }

    public Achievement findById(long id) throws SQLException {
        String sql = "SELECT id_achievement, name, icon, description, requirement_type, requirement_value, data_criacao FROM ACHIEVEMENT WHERE id_achievement = ?";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToAchievement(rs);
                }
                return null;
            }
        }
    }

    public List<Achievement> listAll() throws SQLException {
        String sql = "SELECT id_achievement, name, icon, description, requirement_type, requirement_value, data_criacao FROM ACHIEVEMENT ORDER BY id_achievement";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            List<Achievement> achievements = new ArrayList<>();
            while (rs.next()) {
                achievements.add(mapResultSetToAchievement(rs));
            }
            return achievements;
        }
    }

    public List<Achievement> listUserAchievements(long userId) throws SQLException {
        String sql = """
            SELECT a.id_achievement, a.name, a.icon, a.description, 
                   a.requirement_type, a.requirement_value, a.data_criacao
            FROM ACHIEVEMENT a
            INNER JOIN USUARIO_ACHIEVEMENT ua ON ua.id_achievement = a.id_achievement
            WHERE ua.id_usuario = ?
            ORDER BY ua.data_obtencao DESC
        """;
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                List<Achievement> achievements = new ArrayList<>();
                while (rs.next()) {
                    achievements.add(mapResultSetToAchievement(rs));
                }
                return achievements;
            }
        }
    }

    public List<Achievement> listCasaAchievements(long casaId) throws SQLException {
        String sql = """
            SELECT a.id_achievement, a.name, a.icon, a.description, 
                   a.requirement_type, a.requirement_value, a.data_criacao
            FROM ACHIEVEMENT a
            INNER JOIN CASA_ACHIEVEMENT ca ON ca.id_achievement = a.id_achievement
            WHERE ca.id_casa = ?
            ORDER BY a.requirement_value ASC
        """;
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, casaId);
            try (ResultSet rs = stmt.executeQuery()) {
                List<Achievement> achievements = new ArrayList<>();
                while (rs.next()) {
                    achievements.add(mapResultSetToAchievement(rs));
                }
                return achievements;
            }
        }
    }

    public boolean unlockAchievement(long userId, long achievementId) throws SQLException {
        String sql = "INSERT INTO USUARIO_ACHIEVEMENT (id_usuario, id_achievement) VALUES (?, ?)";
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            stmt.setLong(2, achievementId);
            return stmt.executeUpdate() > 0;
        }
    }

    public void awardAchievements(long casaId, int delta, long taskId, long userId) throws SQLException {
        String sql = """
            INSERT INTO CASA_POINTS_LOG (id_casa, delta, reason, task_id, user_id)
            VALUES ( ?, ?, 'task_completion', ?, ? );

            -- Atomically update and get new total
            WITH updated AS (
              UPDATE CASA
              SET pontos = pontos + ? 
              WHERE id_casa = ? 
              RETURNING pontos
            )
            SELECT pontos FROM updated;
            -- (use the returned pontos value in next steps)

            -- Then find achievements to award:
            INSERT INTO CASA_ACHIEVEMENT (id_casa, id_achievement)
            SELECT ?, a.id_achievement
            FROM ACHIEVEMENT a
            WHERE a.requirement_type = 'HOUSE_POINTS' AND a.requirement_value <= ?
              AND NOT EXISTS (
                SELECT 1 FROM CASA_ACHIEVEMENT ca WHERE ca.id_casa = ? AND ca.id_achievement = a.id_achievement
              );
        """;
        try (Connection conn = Database.connect();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            conn.setAutoCommit(false);
            
            stmt.setLong(1, casaId);
            stmt.setInt(2, delta);
            stmt.setLong(3, taskId);
            stmt.setLong(4, userId);
            stmt.setInt(5, delta);
            stmt.setLong(6, casaId);
            stmt.setLong(7, casaId);
            stmt.setInt(8, delta);
            stmt.setLong(9, casaId);
            
            stmt.executeUpdate();
            conn.commit();
        } catch (SQLException e) {
            e.printStackTrace();
            throw e;
        }
    }

    private Achievement mapResultSetToAchievement(ResultSet rs) throws SQLException {
        return new Achievement(
            rs.getLong("id_achievement"),
            rs.getString("name"),
            rs.getString("icon"),
            rs.getString("description"),
            rs.getString("requirement_type"),
            rs.getInt("requirement_value"),
            rs.getString("data_criacao")
        );
    }

    public int simulatePoints(long casaId, int points) throws SQLException {
        String sql = """
            WITH point_log AS (
                INSERT INTO CASA_POINTS_LOG (id_casa, delta, reason)
                VALUES (?, ?, 'manual_simulation')
            ),
            updated AS (
                UPDATE CASA
                SET pontos = pontos + ?
                WHERE id_casa = ?
                RETURNING pontos
            )
            SELECT pontos FROM updated;
        """;

        String awardSql = """
            INSERT INTO CASA_ACHIEVEMENT (id_casa, id_achievement)
            SELECT ?, a.id_achievement
            FROM ACHIEVEMENT a
            WHERE a.requirement_type = 'HOUSE_POINTS' 
            AND a.requirement_value <= (SELECT pontos FROM CASA WHERE id_casa = ?)
            AND NOT EXISTS (
                SELECT 1 FROM CASA_ACHIEVEMENT ca 
                WHERE ca.id_casa = ? AND ca.id_achievement = a.id_achievement
            );
        """;

        try (Connection conn = Database.connect()) {
            conn.setAutoCommit(false);
            
            // First add points and log
            int finalPoints;
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setLong(1, casaId);
                stmt.setInt(2, points);
                stmt.setInt(3, points);
                stmt.setLong(4, casaId);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    rs.next();
                    finalPoints = rs.getInt("pontos");
                }
            }

            // Then award achievements
            try (PreparedStatement stmt = conn.prepareStatement(awardSql)) {
                stmt.setLong(1, casaId);
                stmt.setLong(2, casaId);
                stmt.setLong(3, casaId);
                stmt.executeUpdate();
            }

            conn.commit();
            return finalPoints;
        }
    }
}