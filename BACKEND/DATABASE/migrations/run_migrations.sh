#!/bin/bash

# Migration Script for Achievement System
# This script runs all necessary migrations for the achievement system

echo "=================================================="
echo "Achievement System Migration Script"
echo "=================================================="
echo ""

# Check if database connection parameters are provided
if [ -z "$1" ]; then
    echo "Usage: ./run_migrations.sh <database_name> [username] [host]"
    echo "Example: ./run_migrations.sh messaway_db postgres localhost"
    echo ""
    echo "If username and host are not provided, defaults will be used."
    exit 1
fi

DB_NAME=$1
DB_USER=${2:-postgres}
DB_HOST=${3:-localhost}

echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST"
echo ""

# Function to run a migration
run_migration() {
    local migration_file=$1
    local description=$2
    
    echo "Running: $description"
    echo "File: $migration_file"
    
    if [ -f "$migration_file" ]; then
        psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$migration_file"
        
        if [ $? -eq 0 ]; then
            echo "✓ Success"
        else
            echo "✗ Failed"
            exit 1
        fi
    else
        echo "✗ File not found: $migration_file"
        exit 1
    fi
    
    echo ""
}

# Navigate to migrations directory
cd "$(dirname "$0")"

echo "Starting migrations..."
echo ""

# Run migrations in order
run_migration "2025-10-23_add_points_and_achievements.sql" "Base points and achievements tables"
run_migration "2025-10-23_add_task_user_to_points_log.sql" "Add task and user tracking to points log"
run_migration "2025-10-23_create_casa_achievements.sql" "Create casa achievements table"
run_migration "2025-10-23_insert_casa_achievements.sql" "Insert sample achievement data"

echo "=================================================="
echo "All migrations completed successfully!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Restart your backend server"
echo "2. Test the achievements endpoint: curl http://localhost:4567/MessAway/casas/1/achievements"
echo "3. Test the points simulation: curl -X POST http://localhost:4567/MessAway/casas/1/simulate-points -H 'Content-Type: application/json' -d '{\"points\": 150}'"
echo "4. Check the dashboard to see achievements displayed"
