#!/bin/bash
# MessAway - Parar Aplicação

echo "🛑 Parando MessAway..."

PID_FILE=".messaway.pid"

if [ -f "$PID_FILE" ]; then
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            echo "   Parando processo $pid..."
            kill $pid
        fi
    done < $PID_FILE
    rm -f $PID_FILE
    echo "✅ Processos encerrados"
else
    echo "⚠️  Arquivo de PIDs não encontrado"
    echo "   Tentando parar pelas portas..."
    pkill -f "mvn exec:java"
    pkill -f "vite"
fi

# Limpar portas se ainda estiverem ocupadas
if lsof -Pi :4567 -sTCP:LISTEN -t >/dev/null 2>&1; then
    sudo kill -9 $(lsof -t -i:4567) 2>/dev/null
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    sudo kill -9 $(lsof -t -i:5173) 2>/dev/null
fi

echo "✅ MessAway parado"
