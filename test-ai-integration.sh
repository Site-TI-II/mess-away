#!/bin/bash

# Script de teste para verificar configuração da IA
# Uso: ./test-ai-integration.sh

echo "🤖 Testando Integração da IA - MessAway"
echo "========================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base do backend
BASE_URL="http://localhost:4567/MessAway"

echo "📡 Verificando se o backend está rodando..."
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/ai/status" | grep -q "200\|503"; then
    echo -e "${RED}❌ Backend não está rodando!${NC}"
    echo "   Execute: cd BACKEND && mvn exec:java"
    exit 1
fi
echo -e "${GREEN}✅ Backend está rodando${NC}"
echo ""

echo "🔑 Testando status da IA..."
STATUS=$(curl -s "$BASE_URL/ai/status")
echo "$STATUS" | jq '.' 2>/dev/null || echo "$STATUS"
echo ""

CONFIGURED=$(echo "$STATUS" | jq -r '.configured' 2>/dev/null)

if [ "$CONFIGURED" = "true" ]; then
    echo -e "${GREEN}✅ IA está configurada!${NC}"
    MODEL=$(echo "$STATUS" | jq -r '.model' 2>/dev/null)
    echo "   Modelo: $MODEL"
    echo ""
    
    echo "💬 Testando geração de insight..."
    INSIGHT=$(curl -s -X POST "$BASE_URL/ai/casa-insight" \
        -H "Content-Type: application/json" \
        -d '{
            "casaName": "Casa de Teste",
            "totalTasks": 20,
            "completedTasks": 15
        }')
    
    SUCCESS=$(echo "$INSIGHT" | jq -r '.success' 2>/dev/null)
    
    if [ "$SUCCESS" = "true" ]; then
        echo -e "${GREEN}✅ Insight gerado com sucesso!${NC}"
        echo ""
        echo "📝 Insight:"
        echo "---"
        echo "$INSIGHT" | jq -r '.content' 2>/dev/null
        echo "---"
        echo ""
        TOKENS=$(echo "$INSIGHT" | jq -r '.tokensUsed' 2>/dev/null)
        echo "   Tokens usados: $TOKENS"
        echo ""
        echo -e "${GREEN}🎉 Tudo funcionando perfeitamente!${NC}"
    else
        echo -e "${RED}❌ Erro ao gerar insight${NC}"
        ERROR=$(echo "$INSIGHT" | jq -r '.error' 2>/dev/null)
        echo "   Erro: $ERROR"
    fi
else
    echo -e "${YELLOW}⚠️  IA não está configurada${NC}"
    echo ""
    echo "📋 Para configurar:"
    echo "   1. Obtenha sua chave em: https://console.anthropic.com/"
    echo "   2. Execute: export ANTHROPIC_API_KEY='sk-ant-sua-chave-aqui'"
    echo "   3. Reinicie o backend: cd BACKEND && mvn exec:java"
    echo ""
    echo "📖 Consulte: GUIA_IA_INTEGRATION.md"
fi

echo ""
echo "========================================"
echo "Teste concluído!"
