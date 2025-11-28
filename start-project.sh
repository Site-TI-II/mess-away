#!/bin/bash
# MessAway - Script de Inicialização Completa

set -e

echo "🚀 Iniciando MessAway..."
echo ""

# Verificar autenticação Azure
echo "🔧 Configurando Azure AAD Authentication..."

# Verificar se Azure CLI está logado
if ! az account show > /dev/null 2>&1; then
    echo "   ⚠️  Azure CLI não está logado! Execute: az login"
    exit 1
fi
echo "   ✅ Azure CLI autenticado"

# Configurar variáveis de ambiente do Azure
echo "🔑 Configurando variáveis Azure PostgreSQL..."
export PGHOST=messawaypuc.postgres.database.azure.com
export PGUSER=732307@sga.pucminas.br
export PGPORT=5432
export PGDATABASE=postgres

# Obter token AAD
echo "   Obtendo token de acesso..."
export PGPASSWORD="$(az account get-access-token --resource https://ossrdbms-aad.database.windows.net --query accessToken --output tsv)"

# Configurar para o Java também
export AZURE_DB_HOST=$PGHOST
export AZURE_DB_PORT=$PGPORT
export AZURE_DB_NAME=$PGDATABASE  
export AZURE_DB_USER=$PGUSER
export AZURE_DB_PASSWORD=$PGPASSWORD

if [ -n "$PGPASSWORD" ]; then
    echo "   ✅ Token AAD obtido com sucesso"
else
    echo "   ❌ Erro ao obter token AAD"
    exit 1
fi
echo "   ✅ Variáveis Azure configuradas"

# Verificar portas
echo "🔍 Verificando portas..."
if lsof -Pi :4567 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  Porta 4567 ocupada, matando processo..."
    sudo kill -9 $(lsof -t -i:4567)
fi
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  Porta 5173 ocupada, matando processo..."
    sudo kill -9 $(lsof -t -i:5173)
fi

# Criar pasta logs
mkdir -p logs

# FORÇAR RECOMPILAÇÃO DO BACKEND
echo "🔨 Recompilando Backend..."
cd BACKEND
mvn clean compile -q
cd ..
echo "   ✅ Backend recompilado"

# Instalar dependências frontend se necessário
if [ ! -d "FRONTEND/node_modules" ]; then
    echo "📦 Instalando dependências do Frontend..."
    cd FRONTEND
    npm install --silent
    cd ..
fi

# Criar arquivo de PIDs
PID_FILE=".messaway.pid"
rm -f $PID_FILE

# Iniciar Backend
echo "🔧 Iniciando Backend..."
cd BACKEND
mvn exec:java > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID >> ../$PID_FILE
cd ..
echo "   ✅ Backend iniciando (PID: $BACKEND_PID)"

# Aguardar backend
echo "⏳ Aguardando backend iniciar..."
for i in {1..30}; do
    if curl -s http://localhost:4567/MessAway/casas > /dev/null 2>&1; then
        echo "   ✅ Backend pronto!"
        break
    fi
    sleep 1
done

# Iniciar Frontend
echo "🎨 Iniciando Frontend..."
cd FRONTEND
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID >> ../$PID_FILE
cd ..
echo "   ✅ Frontend iniciando (PID: $FRONTEND_PID)"

sleep 3

echo ""
echo "========================================="
echo "✅ MessAway iniciado com sucesso!"
echo "========================================="
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4567"
echo ""
echo "🔑 Credenciais:"
echo "   Email: teste@email.com"
echo "   Senha: 123456"
echo ""
echo "📊 Processos:"
echo "   Backend:  PID $BACKEND_PID"
echo "   Frontend: PID $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 Para parar:"
echo "   ./stop-project.sh"
echo ""
echo "========================================="
