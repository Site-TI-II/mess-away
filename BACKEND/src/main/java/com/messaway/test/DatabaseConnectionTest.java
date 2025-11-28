package com.messaway.test;

import com.messaway.db.Database;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class DatabaseConnectionTest {
    public static void main(String[] args) {
        System.out.println("🔍 Testing Azure Database Connection...");
        
        try {
            // Test the connection
            Connection conn = Database.connect();
            System.out.println("✅ Connected to Azure PostgreSQL successfully!");
            
            // Test a simple query to verify schema
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
            
            if (rs.next()) {
                int tableCount = rs.getInt("table_count");
                System.out.println("📊 Tables found: " + tableCount);
                
                if (tableCount == 8) {
                    System.out.println("🎉 Perfect! All 8 optimized tables are ready!");
                } else {
                    System.out.println("⚠️  Expected 8 tables, found " + tableCount);
                }
            }
            
            // Test users table specifically
            rs = stmt.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name");
            System.out.println("\n📋 Available tables:");
            while (rs.next()) {
                System.out.println("  - " + rs.getString("table_name"));
            }
            
            conn.close();
            System.out.println("\n✅ Database connection test completed successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Database connection failed:");
            e.printStackTrace();
        }
    }
}