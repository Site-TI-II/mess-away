#!/bin/bash
# MessAway - Script de Inicialização Completa

set -e  # Parar se houver erro

echo "🚀 Iniciando MessAway..."
echo ""

# Verificar se está na pasta raiz do projeto
if [ ! -d "BACKEND" ] || [ ! -d "FRONTEND" ]; then
    echo "❌ Erro: Execute este script da pasta raiz do projeto"
    exit 1
fi

# 1. Verificar PostgreSQL
echo "📦 Verificando PostgreSQL..."
if ! systemctl is-active --quiet postgresql 2>/dev/null; then
    echo "   Iniciando PostgreSQL..."
    sudo systemctl start postgresql
    sleep 2
fi
echo "   ✅ PostgreSQL rodando"

# 2. Verificar se banco existe
echo "🗄️  Verificando banco de dados..."
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw gestao_casas; then
    echo "   ⚠️  Banco não encontrado! Execute primeiro:"
    echo "   ./BACKEND/DATABASE/install.sh"
    exit 1
fi
echo "   ✅ Banco configurado"

# 3. Configurar variáveis de ambiente
echo "🔧 Configurando variáveis de ambiente..."
export MESSAWAY_DB_URL="jdbc:postgresql://localhost:5432/gestao_casas"
export MESSAWAY_DB_USER="messaway"
export MESSAWAY_DB_PASSWORD="messaway123"
echo "   ✅ Variáveis configuradas"

# 4. Verificar se portas estão livres
echo "🔍 Verificando portas..."
if lsof -Pi :4567 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  Porta 4567 (Backend) já está em uso"
    echo "   Deseja matar o processo? (s/n)"
    read -r resposta
    if [ "$resposta" = "s" ]; then
        sudo kill -9 $(lsof -t -i:4567)
        echo "   ✅ Processo anterior encerrado"
    else
        exit 1
    fi
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  Porta 5173 (Frontend) já está em uso"
    echo "   Deseja matar o processo? (s/n)"
    read -r resposta
    if [ "$resposta" = "s" ]; then
        sudo kill -9 $(lsof -t -i:5173)
        echo "   ✅ Processo anterior encerrado"
    else
        exit 1
    fi
fi

# 5. Compilar Backend (se necessário)
if [ ! -d "BACKEND/target" ]; then
    echo "🔨 Compilando Backend (primeira vez)..."
    cd BACKEND
    mvn clean install -q
    cd ..
    echo "   ✅ Backend compilado"
fi

# 6. Instalar dependências Frontend (se necessário)
if [ ! -d "FRONTEND/node_modules" ]; then
    echo "📦 Instalando dependências do Frontend (primeira vez)..."
    cd FRONTEND
    npm install --silent
    cd ..
    echo "   ✅ Dependências instaladas"
fi

# 7. Criar arquivo de PIDs
PID_FILE=".messaway.pid"
rm -f $PID_FILE

# 8. Iniciar Backend
echo "🔧 Iniciando Backend..."
cd BACKEND
mvn exec:java > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID >> ../$PID_FILE
cd ..
echo "   ✅ Backend iniciando (PID: $BACKEND_PID)"

# Aguardar backend iniciar
echo "⏳ Aguardando backend iniciar..."
for i in {1..30}; do
    if curl -s http://localhost:4567/MessAway/casas > /dev/null 2>&1; then
        echo "   ✅ Backend pronto!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "   ❌ Backend demorou muito para iniciar"
        echo "   Verifique logs/backend.log"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# 9. Iniciar Frontend
echo "🎨 Iniciando Frontend..."
cd FRONTEND
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID >> ../$PID_FILE
cd ..
echo "   ✅ Frontend iniciando (PID: $FRONTEND_PID)"

# Aguardar frontend iniciar
echo "⏳ Aguardando frontend iniciar..."
sleep 3

# 10. Mensagem final
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
echo "   ou: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "========================================="
