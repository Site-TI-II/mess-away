package com.messaway.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static final String URL = System.getenv("MESSAWAY_DB_URL") != null 
        ? System.getenv("MESSAWAY_DB_URL") 
        : "jdbc:postgresql://localhost:5432/postgres";
    private static final String USER = System.getenv("MESSAWAY_DB_USER") != null 
        ? System.getenv("MESSAWAY_DB_USER") 
        : "postgres";
    private static final String PASSWORD = System.getenv("MESSAWAY_DB_PASSWORD") != null 
        ? System.getenv("MESSAWAY_DB_PASSWORD") 
        : "postgres";

    public static Connection connect() throws SQLException {
        return getConnection();
    }

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("PostgreSQL JDBC driver not found", e);
        }
    }
}
