package com.messaway.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    // Azure PostgreSQL Connection - Updated for optimized schema
    private static final String URL = System.getenv("AZURE_DB_HOST") != null 
        ? String.format("jdbc:postgresql://%s:%s/%s?sslmode=require", 
            System.getenv("AZURE_DB_HOST"), 
            System.getenv("AZURE_DB_PORT"),
            System.getenv("AZURE_DB_NAME"))
        : "jdbc:postgresql://messawaypuc.postgres.database.azure.com:5432/postgres?sslmode=require";
    private static final String USER = System.getenv("AZURE_DB_USER") != null 
        ? System.getenv("AZURE_DB_USER") 
        : "messADM";
    private static final String PASSWORD = System.getenv("AZURE_DB_PASSWORD") != null 
        ? System.getenv("AZURE_DB_PASSWORD") 
        : "MinionBobo3";

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
