package com.messaway.test;

import com.messaway.db.Database;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Simple test to verify Azure PostgreSQL connection with new optimized schema
 */
public class TestAzureConnection {
    public static void main(String[] args) {
        System.out.println("🔍 Testing Azure PostgreSQL Connection...");
        
        try (Connection conn = Database.connect()) {
            System.out.println("✅ Connection successful!");
            
            // Test the new optimized schema
            try (Statement stmt = conn.createStatement()) {
                // Check if our 8 tables exist
                String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name";
                ResultSet rs = stmt.executeQuery(sql);
                
                System.out.println("\n📋 Tables in optimized schema:");
                int count = 0;
                while (rs.next()) {
                    count++;
                    System.out.println("   " + count + ". " + rs.getString("table_name"));
                }
                
                if (count == 8) {
                    System.out.println("\n🎉 SUCCESS: All 8 optimized tables found!");
                } else {
                    System.out.println("\n⚠️  Expected 8 tables, found " + count);
                }
                
                // Test a simple query on users table
                ResultSet userCount = stmt.executeQuery("SELECT COUNT(*) FROM users");
                if (userCount.next()) {
                    System.out.println("👥 Users in database: " + userCount.getInt(1));
                }
                
                System.out.println("\n🚀 Azure database is ready for MessAway application!");
                
            }
        } catch (Exception e) {
            System.err.println("❌ Connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}