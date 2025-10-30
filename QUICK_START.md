# 🚀 MessAway - Quick Start

## Instalação (Uma Vez)
```bash
# 1. Instalar banco de dados
./BACKEND/DATABASE/install.sh

# 2. Pronto! Banco configurado
```

## Uso Diário

### Iniciar aplicação:
```bash
./start-project.sh
```

### Parar aplicação:
```bash
./stop-project.sh
```

### Ver logs:
```bash
tail -f logs/backend.log   # Backend
tail -f logs/frontend.log  # Frontend
```

## Acesso

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4567
- **Login:** `teste@email.com` / `123456`

## Troubleshooting

### Resetar banco:
```bash
./BACKEND/DATABASE/install.sh
```

### Porta ocupada:
```bash
./stop-project.sh
./start-project.sh
```

### Logs com erro:
```bash
cat logs/backend.log
cat logs/frontend.log
```
