# MessAway Azure Deployment Guide
## Export Optimized Database to Microsoft Azure

**Date:** November 27, 2025  
**Schema:** 8-table optimized design  
**Target:** Azure Database for PostgreSQL Flexible Server

---

## 🎯 **Step-by-Step Azure Deployment**

### **Phase 1: Create Azure Resources**
### **Phase 2: Deploy Database Schema** 
### **Phase 3: Configure Connection**
### **Phase 4: Test & Verify**

---

## 🔧 **Phase 1: Create Azure Resources**

### **1.1 Create Azure Account (if needed)**
```bash
# Go to: https://portal.azure.com
# Sign up for free account ($200 credit)
# Or use existing Microsoft account
```

### **1.2 Create Resource Group**
```bash
# In Azure Portal:
1. Click "Resource groups" 
2. Click "+ Create"
3. Resource group name: "messaway-resources"
4. Region: "East US" (or your preferred region)
5. Click "Review + Create"
```

### **1.3 Create PostgreSQL Database**
```bash
# In Azure Portal:
1. Click "+ Create a resource"
2. Search "Azure Database for PostgreSQL"  
3. Select "Flexible server"
4. Click "Create"

# Configuration:
- Resource group: messaway-resources
- Server name: messaway-db-server (must be globally unique)
- Region: East US (same as resource group)
- PostgreSQL version: 14 or 15
- Compute + storage: Basic (1 vCore, 32GB) for development
- Authentication: PostgreSQL authentication
- Admin username: messaway_admin
- Password: [CREATE STRONG PASSWORD - SAVE IT!]
```

### **1.4 Configure Networking**
```bash
# In the "Networking" tab:
1. Connectivity method: "Public access (allowed IP addresses)"
2. Click "Add current client IP address"
3. Allow access to Azure services: YES
4. Click "Review + Create"
5. Wait 5-10 minutes for deployment
```

---

## 📤 **Phase 2: Deploy Database Schema**

### **2.1 Get Connection Information**
```bash
# After PostgreSQL server is created:
1. Go to your PostgreSQL server in Azure Portal
2. Click "Connection strings" in left menu
3. Copy the JDBC connection string:

# Example:
jdbc:postgresql://messaway-db-server.postgres.database.azure.com:5432/postgres?sslmode=require&user=messaway_admin&password={your_password}
```

### **2.2 Connect via Command Line**
```bash
# Install PostgreSQL client (if not installed)
# Ubuntu/Debian:
sudo apt-get install postgresql-client

# macOS:
brew install postgresql

# Connect to Azure database:
psql "host=messaway-db-server.postgres.database.azure.com port=5432 dbname=postgres user=messaway_admin password=YOUR_PASSWORD sslmode=require"
```

### **2.3 Create MessAway Database**
```sql
-- Once connected to Azure PostgreSQL:
CREATE DATABASE messaway;
\c messaway;
\q
```

### **2.4 Deploy Your Optimized Schema**
```bash
# Upload your schema to Azure:
psql "host=messaway-db-server.postgres.database.azure.com port=5432 dbname=messaway user=messaway_admin password=YOUR_PASSWORD sslmode=require" < BACKEND/DATABASE/schema_simplified.sql
```

---

## ⚙️ **Phase 3: Configure Connection**

### **3.1 Update Database.java**
```java
// Update your Database.java with Azure connection:
private static String AZURE_DB_HOST = "messaway-db-server.postgres.database.azure.com";
private static String AZURE_DB_PORT = "5432";
private static String AZURE_DB_NAME = "messaway";
private static String AZURE_DB_USER = "messaway_admin";
private static String AZURE_DB_PASSWORD = "YOUR_STRONG_PASSWORD";
```

### **3.2 Create Environment Variables**
```bash
# Create .env file in BACKEND folder:
echo 'AZURE_DB_HOST=messaway-db-server.postgres.database.azure.com' > BACKEND/.env
echo 'AZURE_DB_PORT=5432' >> BACKEND/.env
echo 'AZURE_DB_NAME=messaway' >> BACKEND/.env  
echo 'AZURE_DB_USER=messaway_admin' >> BACKEND/.env
echo 'AZURE_DB_PASSWORD=YOUR_STRONG_PASSWORD' >> BACKEND/.env
echo 'AZURE_DB_SSL_MODE=require' >> BACKEND/.env
```

### **3.3 Update Maven Dependencies (if needed)**
```xml
<!-- Add to pom.xml if not present: -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
</dependency>
```

---

## 🧪 **Phase 4: Test & Verify**

### **4.1 Test Database Connection**
```bash
# Test connection from command line:
psql "host=messaway-db-server.postgres.database.azure.com port=5432 dbname=messaway user=messaway_admin password=YOUR_PASSWORD sslmode=require"

# Verify tables were created:
\dt

# Should show your 8 tables:
# users, houses, rooms, tasks, expenses, user_houses, achievements, app_settings
```

### **4.2 Test Java Application**
```bash
# Build and run your Java app:
cd BACKEND
mvn clean package
mvn exec:java

# Check logs for successful Azure connection
```

### **4.3 Verify Schema**
```sql
-- Connect and verify your tables:
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
```

---

## 💰 **Cost Optimization Tips**

### **Development Environment:**
- **Basic tier:** ~$15-25/month
- **Stop database** when not developing (save ~70%)
- **Set up alerts** for spending

### **Production Environment:**  
- **General Purpose:** Better performance (~$50-100/month)
- **Use connection pooling** (reduce connection costs)
- **Monitor queries** for performance

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Connection Refused**
```bash
# Solution: Check firewall rules
1. Azure Portal > PostgreSQL server > Networking
2. Add your current IP address  
3. Save and wait 2-3 minutes
```

### **Issue 2: SSL Certificate Error**
```bash
# Solution: Add SSL parameters to JDBC URL:
jdbc:postgresql://server.postgres.database.azure.com:5432/messaway?sslmode=require&sslcert=&sslkey=&sslrootcert=
```

### **Issue 3: Database Not Found**
```bash
# Solution: Create database first:
psql "host=...&dbname=postgres..." -c "CREATE DATABASE messaway;"
```

### **Issue 4: Authentication Failed**
```bash
# Solution: Check username format:
# Correct: messaway_admin
# Wrong: messaway_admin@servername
```

---

## ✅ **Deployment Checklist**

- [ ] **Azure account created**
- [ ] **Resource group created** 
- [ ] **PostgreSQL server deployed**
- [ ] **Firewall rules configured**
- [ ] **Database 'messaway' created**
- [ ] **Schema deployed successfully**
- [ ] **Connection string updated in code**
- [ ] **Environment variables set**
- [ ] **Java application tested**
- [ ] **All 8 tables verified**

---

## 🎉 **Success Indicators**

When everything works correctly:
- ✅ **8 tables created** in Azure PostgreSQL
- ✅ **Java app connects** to Azure database  
- ✅ **No connection errors** in logs
- ✅ **API endpoints respond** correctly
- ✅ **Database queries execute** successfully

---

## 📋 **Quick Command Summary**

```bash
# 1. Deploy schema to Azure:
psql "host=YOUR-SERVER.postgres.database.azure.com port=5432 dbname=messaway user=messaway_admin password=YOUR_PASSWORD sslmode=require" < BACKEND/DATABASE/schema_simplified.sql

# 2. Test connection:
psql "host=YOUR-SERVER.postgres.database.azure.com port=5432 dbname=messaway user=messaway_admin password=YOUR_PASSWORD sslmode=require"

# 3. Verify deployment:  
\dt

# 4. Test Java app:
cd BACKEND && mvn clean package && mvn exec:java
```

**Ready to deploy to Azure? 🚀**

Follow these steps and you'll have your optimized MessAway database running on Microsoft Azure with 50%+ cost savings!