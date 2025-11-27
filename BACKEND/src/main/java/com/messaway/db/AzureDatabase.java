package com.messaway.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 * Azure PostgreSQL Database Connection Manager
 * Optimized for Azure Database for PostgreSQL Flexible Server
 * 
 * Features:
 * - SSL/TLS support for Azure
 * - Environment-based configuration
 * - Health checks and monitoring
 * - Connection optimization for Azure
 */
public class AzureDatabase {
    
    // Azure PostgreSQL Configuration
    private static final String AZURE_SERVER = getEnv("AZURE_POSTGRES_SERVER", "localhost");
    private static final String DATABASE_NAME = getEnv("AZURE_POSTGRES_DB", "messaway_db");
    private static final String USERNAME = getEnv("AZURE_POSTGRES_USER", "postgres");
    private static final String PASSWORD = getEnv("AZURE_POSTGRES_PASSWORD", "postgres");
    private static final int PORT = Integer.parseInt(getEnv("AZURE_POSTGRES_PORT", "5432"));
    private static final boolean USE_SSL = Boolean.parseBoolean(getEnv("AZURE_POSTGRES_SSL", "true"));
    
    private static String jdbcUrl;
    private static Properties connectionProps;
    private static volatile boolean initialized = false;
    
    /**
     * Initialize the database configuration
     */
    private static synchronized void initialize() {
        if (initialized) {
            return;
        }
        
        try {
            // Load PostgreSQL driver
            Class.forName("org.postgresql.Driver");
            
            // Build connection URL
            jdbcUrl = buildJdbcUrl();
            
            // Setup connection properties
            connectionProps = new Properties();
            connectionProps.setProperty("user", USERNAME);
            connectionProps.setProperty("password", PASSWORD);
            connectionProps.setProperty("applicationName", "MessAway-Backend");
            
            // Azure-specific optimizations
            connectionProps.setProperty("connectTimeout", "30");
            connectionProps.setProperty("socketTimeout", "30");
            connectionProps.setProperty("tcpKeepAlive", "true");
            connectionProps.setProperty("prepareThreshold", "1");
            connectionProps.setProperty("reWriteBatchedInserts", "true");
            
            // SSL configuration for Azure
            if (USE_SSL) {
                connectionProps.setProperty("ssl", "true");
                connectionProps.setProperty("sslmode", "require");
            }
            
            // Verify initial connection
            verifyConnection();
            
            initialized = true;
            
            System.out.println("✅ Azure Database configuration initialized successfully");
            System.out.println("   Server: " + AZURE_SERVER);
            System.out.println("   Database: " + DATABASE_NAME);
            System.out.println("   SSL: " + (USE_SSL ? "enabled" : "disabled"));
            
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize Azure database configuration: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Azure database initialization failed", e);
        }
    }
    
    /**
     * Build JDBC URL with proper Azure configuration
     */
    private static String buildJdbcUrl() {
        StringBuilder url = new StringBuilder();
        url.append("jdbc:postgresql://");
        url.append(AZURE_SERVER);
        url.append(":").append(PORT);
        url.append("/").append(DATABASE_NAME);
        
        // Add connection parameters
        url.append("?");
        url.append("serverTimezone=UTC");
        
        if (USE_SSL) {
            url.append("&sslmode=require");
        }
        
        return url.toString();
    }
    
    /**
     * Get environment variable with fallback
     */
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        if (value == null || value.trim().isEmpty()) {
            // Try system properties as fallback
            value = System.getProperty(key, defaultValue);
        }
        return value;
    }
    
    /**
     * Verify database connection and basic functionality
     */
    private static void verifyConnection() throws SQLException {
        try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
             Statement stmt = conn.createStatement()) {
            
            // Test basic connectivity
            stmt.execute("SELECT 1");
            
            // Check PostgreSQL version
            var rs = stmt.executeQuery("SELECT version()");
            if (rs.next()) {
                System.out.println("📊 Connected to: " + rs.getString(1).substring(0, Math.min(50, rs.getString(1).length())) + "...");
            }
            
            // Check database info
            rs = stmt.executeQuery("SELECT current_database(), current_user");
            if (rs.next()) {
                System.out.println("🗄️  Database: " + rs.getString(1));
                System.out.println("👤 User: " + rs.getString(2));
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Azure database verification failed: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * Get a connection to Azure PostgreSQL
     */
    public static Connection connect() throws SQLException {
        if (!initialized) {
            initialize();
        }
        
        Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
        
        // Set connection-level optimizations
        conn.setAutoCommit(true); // Default to autocommit
        
        // Set optimal settings for Azure
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("SET timezone = 'UTC'");
            stmt.execute("SET statement_timeout = '30s'");
        } catch (SQLException e) {
            // These are optimization settings, don't fail if they can't be set
            System.out.println("⚠️  Could not set optimal settings: " + e.getMessage());
        }
        
        return conn;
    }
    
    /**
     * Get a connection (alias for compatibility)
     */
    public static Connection getConnection() throws SQLException {
        return connect();
    }
    
    /**
     * Get a connection with specified transaction isolation
     */
    public static Connection getConnection(int isolationLevel) throws SQLException {
        Connection conn = connect();
        conn.setTransactionIsolation(isolationLevel);
        return conn;
    }
    
    /**
     * Health check method for Azure database
     */
    public static boolean isHealthy() {
        if (!initialized) {
            try {
                initialize();
            } catch (Exception e) {
                return false;
            }
        }
        
        try (Connection conn = DriverManager.getConnection(jdbcUrl, connectionProps);
             Statement stmt = conn.createStatement()) {
            
            stmt.execute("SELECT 1");
            return true;
            
        } catch (SQLException e) {
            System.err.println("🔴 Azure database health check failed: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Get connection status information
     */
    public static String getConnectionInfo() {
        if (!initialized) {
            return "Azure database not initialized";
        }
        
        return String.format(
            "Azure PostgreSQL - Server: %s, Database: %s, SSL: %s",
            AZURE_SERVER,
            DATABASE_NAME,
            USE_SSL ? "enabled" : "disabled"
        );
    }
    
    /**
     * Execute a transaction with automatic rollback on error
     */
    public static <T> T executeTransaction(TransactionCallback<T> callback) throws SQLException {
        try (Connection conn = connect()) {
            conn.setAutoCommit(false);
            
            try {
                T result = callback.execute(conn);
                conn.commit();
                return result;
            } catch (Exception e) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    e.addSuppressed(rollbackEx);
                }
                throw e;
            }
        }
    }
    
    /**
     * Callback interface for transactions
     */
    @FunctionalInterface
    public interface TransactionCallback<T> {
        T execute(Connection connection) throws SQLException;
    }
    
    /**
     * Test Azure database connectivity
     */
    public static void testConnection() {
        System.out.println("🔄 Testing Azure PostgreSQL connection...");
        
        try {
            long startTime = System.currentTimeMillis();
            
            try (Connection conn = connect();
                 Statement stmt = conn.createStatement()) {
                
                // Basic connectivity test
                stmt.execute("SELECT 1");
                
                // Performance test
                var rs = stmt.executeQuery("SELECT current_timestamp, version()");
                if (rs.next()) {
                    System.out.println("⏰ Server time: " + rs.getTimestamp(1));
                    System.out.println("🔧 Version: " + rs.getString(2).split(" ")[0] + " " + rs.getString(2).split(" ")[1]);
                }
                
                // Connection info
                rs = stmt.executeQuery("SELECT inet_server_addr(), inet_server_port()");
                if (rs.next()) {
                    String serverAddr = rs.getString(1);
                    int serverPort = rs.getInt(2);
                    if (serverAddr != null) {
                        System.out.println("🌐 Server: " + serverAddr + ":" + serverPort);
                    }
                }
                
                long duration = System.currentTimeMillis() - startTime;
                System.out.println("✅ Azure PostgreSQL connection test successful (" + duration + "ms)");
                
            }
        } catch (SQLException e) {
            System.err.println("❌ Azure PostgreSQL connection test failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}