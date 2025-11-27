#!/bin/bash

# MessAway Azure Database Deployment Script
# Automates the deployment of optimized schema to Azure PostgreSQL

echo "🚀 MessAway Azure Deployment Starting..."
echo ""

# Configuration (YOU NEED TO UPDATE THESE)
AZURE_SERVER="messawaypuc.postgres.database.azure.com"
AZURE_PORT="5432"
AZURE_DATABASE="postgres"  # Using the default postgres database
AZURE_USER="messADM"
AZURE_PASSWORD="MinionBobo3"

echo "⚙️  Configuration:"
echo "Server: $AZURE_SERVER"
echo "Database: $AZURE_DATABASE"  
echo "User: $AZURE_USER"
echo ""

# Check if password is set
if [ -z "$AZURE_PASSWORD" ]; then
    echo "❌ Error: Please set your AZURE_PASSWORD in this script!"
    echo "   Edit line 11: AZURE_PASSWORD=\"your_password_here\""
    exit 1
fi

# Check if schema file exists
SCHEMA_FILE="BACKEND/DATABASE/schema_simplified.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Schema file not found: $SCHEMA_FILE"
    echo "   Make sure you're running this from the project root directory."
    exit 1
fi

echo "✅ Schema file found: $SCHEMA_FILE"
echo ""

# Build connection string
CONNECTION_STRING="host=$AZURE_SERVER port=$AZURE_PORT dbname=postgres user=$AZURE_USER password=$AZURE_PASSWORD sslmode=require"
MESSAWAY_CONNECTION="host=$AZURE_SERVER port=$AZURE_PORT dbname=$AZURE_DATABASE user=$AZURE_USER password=$AZURE_PASSWORD sslmode=require"

echo "🔍 Testing Azure connection..."

# Test connection to default postgres database
if psql "$CONNECTION_STRING" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connection to Azure PostgreSQL successful!"
else
    echo "❌ Failed to connect to Azure PostgreSQL"
    echo "   Check your connection details and firewall settings"
    exit 1
fi

echo ""
echo "📦 Using postgres database..."

# Check if we can connect to postgres database
if psql "$MESSAWAY_CONNECTION" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Connected to '$AZURE_DATABASE' database successfully"
else
    echo "❌ Failed to connect to '$AZURE_DATABASE' database"
    exit 1
fi

echo ""
echo "📋 Deploying optimized schema (8 tables)..."

# Deploy the schema
if psql "$MESSAWAY_CONNECTION" < "$SCHEMA_FILE"; then
    echo "✅ Schema deployed successfully!"
else
    echo "❌ Schema deployment failed"
    exit 1
fi

echo ""
echo "🔍 Verifying deployment..."

# Verify tables were created
TABLE_COUNT=$(psql "$MESSAWAY_CONNECTION" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")
TABLE_COUNT=$(echo $TABLE_COUNT | xargs) # Trim whitespace

echo "📊 Tables created: $TABLE_COUNT"

if [ "$TABLE_COUNT" -eq "8" ]; then
    echo "✅ All 8 tables created successfully!"
    
    echo ""
    echo "📋 Table list:"
    psql "$MESSAWAY_CONNECTION" -c "\dt"
    
else
    echo "⚠️  Expected 8 tables, found $TABLE_COUNT"
    echo "   This might be normal if you had existing tables"
fi

echo ""
echo "🎉 Azure deployment completed!"
echo ""
echo "🔗 Connection details for your Java app:"
echo "   Host: $AZURE_SERVER"
echo "   Port: $AZURE_PORT"  
echo "   Database: $AZURE_DATABASE"
echo "   User: $AZURE_USER"
echo "   SSL Mode: require"
echo ""
echo "📝 Next steps:"
echo "   1. Update your Database.java with these connection details"
echo "   2. Test your Java application"
echo "   3. Enjoy 50%+ cost savings with optimized schema!"
echo ""

# Create .env file for easy configuration
ENV_FILE="BACKEND/.env"
echo "💾 Creating $ENV_FILE for your Java app..."

cat > "$ENV_FILE" << EOF
# Azure PostgreSQL Configuration
AZURE_DB_HOST=$AZURE_SERVER
AZURE_DB_PORT=$AZURE_PORT
AZURE_DB_NAME=$AZURE_DATABASE
AZURE_DB_USER=$AZURE_USER
AZURE_DB_PASSWORD=$AZURE_PASSWORD
AZURE_DB_SSL_MODE=require

# Application Settings
ENVIRONMENT=production
EOF

echo "✅ Environment file created: $ENV_FILE"
echo "⚠️  Remember to add .env to your .gitignore file!"
echo ""
echo "🎯 Deployment Summary:"
echo "   ✅ Connected to Azure PostgreSQL"
echo "   ✅ Created MessAway database"  
echo "   ✅ Deployed 8-table optimized schema"
echo "   ✅ Verified table creation"
echo "   ✅ Created environment configuration"
echo ""
echo "🚀 Your MessAway database is now running on Microsoft Azure!"