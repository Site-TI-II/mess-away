#!/bin/bash

# Quick Azure PostgreSQL Connection Tester
echo "🔍 Testing Azure PostgreSQL Connection..."

# Your connection details
AZURE_SERVER="messawaypuc.postgres.database.azure.com"
AZURE_PORT="5432"
AZURE_USER="1549373@sga.pucminas.br"

echo "Server: $AZURE_SERVER"
echo "Port: $AZURE_PORT"
echo "User: $AZURE_USER"
echo ""

# Prompt for password securely
read -s -p "Enter your Azure database password: " AZURE_PASSWORD
echo ""

# Test connection to postgres (default database)
echo ""
echo "Testing connection to default 'postgres' database..."
CONNECTION_STRING="host=$AZURE_SERVER port=$AZURE_PORT dbname=postgres user=$AZURE_USER password=$AZURE_PASSWORD sslmode=require"

if psql "$CONNECTION_STRING" -c "SELECT version();" 2>/dev/null; then
    echo "✅ Connection successful!"
    echo ""
    echo "📋 Available databases:"
    psql "$CONNECTION_STRING" -c "SELECT datname FROM pg_database WHERE datistemplate = false;"
else
    echo "❌ Connection failed"
    echo ""
    echo "🔧 Common fixes:"
    echo "   1. Check your password"
    echo "   2. Verify firewall allows your IP"
    echo "   3. Try username format: username@servername"
    echo "   4. Ensure SSL is enabled"
fi