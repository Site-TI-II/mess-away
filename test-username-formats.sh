#!/bin/bash

echo "🔧 Testing Different Azure Username Formats..."
echo "Server: messawaypuc.postgres.database.azure.com"
echo "Your IP that needs firewall access: 191.185.78.47"
echo ""

# Test different username formats
USERNAMES=(
    "1549373"
    "1549373@messawaypuc" 
    "1549373@sga.pucminas.br"
)

read -s -p "Enter your Azure database password: " PASSWORD
echo ""

for USER in "${USERNAMES[@]}"; do
    echo ""
    echo "🧪 Testing username: $USER"
    
    if PGSSLMODE=require psql -h messawaypuc.postgres.database.azure.com -p 5432 -U "$USER" -d postgres -c "SELECT 'SUCCESS!' as result;" 2>/dev/null; then
        echo "✅ SUCCESS with username: $USER"
        echo "🎉 Use this format for your connection!"
        break
    else
        echo "❌ Failed with username: $USER"
    fi
done

echo ""
echo "🚨 If all failed, check:"
echo "   1. Add your IP (191.185.78.47) to Azure firewall"
echo "   2. Verify your password is correct"
echo "   3. Check username in Azure Portal"