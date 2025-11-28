# 🤖 Guia de Integração da IA - MessAway

## 📖 Índice
1. [O que é e o que faz](#o-que-é)
2. [Como funciona](#como-funciona)
3. [Configuração passo a passo](#configuração)
4. [Uso no Dashboard](#uso-no-dashboard)
5. [APIs disponíveis](#apis-disponíveis)
6. [Custos e limites](#custos)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 O que é e o que faz {#o-que-é}

### **Integração com Claude Sonnet 4.5**

A IA do MessAway usa o **Claude Sonnet 4.5** da Anthropic, um dos modelos de IA mais avançados do mundo, para gerar:

✨ **Insights Personalizados**: Analisa o progresso da sua casa e oferece feedback motivacional
📊 **Análise de Performance**: Identifica padrões nas suas tarefas
💡 **Sugestões Inteligentes**: Recomendações baseadas no histórico de tarefas
🎯 **Mensagens Motivacionais**: Incentivo personalizado baseado no seu desempenho

### **Onde aparece no sistema?**

1. **Dashboard Principal**: Seção "Insights de IA" que mostra análises em tempo real
2. **Página de Tarefas**: Card compacto com dicas de priorização e organização
3. **Mensagens Personalizadas**: Feedback sobre progresso semanal
4. **API REST**: Endpoints para integrar IA em outras partes do app

---

## ⚙️ Como funciona {#como-funciona}

### **Arquitetura**

```
Frontend (React)          Backend (Java)           API Externa
     │                         │                        │
     │  1. Casa + Tarefas      │                        │
     ├────────────────────────>│                        │
     │                         │  2. Monta contexto     │
     │                         │  (casa, progresso)     │
     │                         │                        │
     │                         │  3. Envia prompt       │
     │                         ├───────────────────────>│
     │                         │     (Claude API)       │
     │                         │                        │
     │                         │  4. Recebe insight     │
     │                         │<───────────────────────┤
     │  5. Exibe insight       │                        │
     │<────────────────────────┤                        │
```

### **Fluxo de Funcionamento**

1. **Frontend coleta dados**: Nome da casa, total de tarefas, tarefas concluídas
2. **Backend monta o prompt**: Cria uma solicitação inteligente para a IA
3. **Claude processa**: IA analisa os dados e gera resposta personalizada
4. **Backend retorna**: JSON com o insight gerado
5. **Frontend exibe**: Insight aparece no Dashboard com animações

---

## 🔧 Configuração (Passo a Passo) {#configuração}

### **Passo 1: Criar conta na Anthropic**

1. Acesse: https://console.anthropic.com/
2. Clique em **"Sign Up"**
3. Complete o cadastro com seu email
4. Verifique seu email e faça login

### **Passo 2: Obter chave da API**

1. No console da Anthropic, vá em **"API Keys"** no menu lateral
2. Clique em **"Create Key"**
3. Dê um nome para a chave (ex: "MessAway Development")
4. Copie a chave (começa com `sk-ant-`)
   
   ⚠️ **IMPORTANTE**: Guarde essa chave em local seguro! Ela não será mostrada novamente.

### **Passo 3: Adicionar créditos (opcional para testes)**

- Anthropic oferece **$5 de crédito grátis** para novos usuários
- Isso é suficiente para ~1.600 insights (muito para desenvolvimento)
- Se precisar de mais, adicione cartão de crédito no console

### **Passo 4: Configurar no Backend**

#### **Opção A: Variável de Ambiente (Recomendado)**

**Linux/Mac:**
```bash
export ANTHROPIC_API_KEY='sk-ant-sua-chave-aqui'
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY='sk-ant-sua-chave-aqui'
```

**Windows (CMD):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

#### **Opção B: Arquivo .env (Mais Prático)**

1. Crie um arquivo `.env` na pasta `BACKEND/`:
   ```bash
   cd BACKEND
   nano .env  # ou use seu editor favorito
   ```

2. Adicione a chave:
   ```env
   ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
   ```

3. Adicione ao `.gitignore` (NUNCA commite a chave!):
   ```bash
   echo ".env" >> .gitignore
   ```

4. Configure o Maven para carregar o .env (opcional):
   ```xml
   <!-- pom.xml - adicione no plugin exec-maven-plugin -->
   <environmentVariables>
     <ANTHROPIC_API_KEY>${env.ANTHROPIC_API_KEY}</ANTHROPIC_API_KEY>
   </environmentVariables>
   ```

### **Passo 5: Iniciar o Backend**

```bash
cd BACKEND
mvn clean package
mvn exec:java
```

Procure no log:
```
🚀 Servidor Spark iniciado na porta 4567
```

### **Passo 6: Verificar Configuração**

Teste se a IA está ativa:

```bash
curl http://localhost:4567/MessAway/ai/status
```

**Resposta esperada:**
```json
{
  "configured": true,
  "model": "claude-sonnet-4-20250514",
  "status": "ready"
}
```

✅ Se aparecer `"configured": true`, está tudo certo!
❌ Se aparecer `"configured": false`, a chave não foi configurada

---

## 🖥️ Uso no Dashboard {#uso-no-dashboard}

### **Seção de Insights de IA**

Quando tudo estiver configurado, você verá no Dashboard:

```
┌──────────────────────────────────────────────────┐
│ ✨ Insights de IA                         🔄     │
├──────────────────────────────────────────────────┤
│                                                  │
│  Excelente progresso! Você completou 83% das   │
│  tarefas na Casa da Daniela. Continue assim    │
│  e você alcançará 100% em breve!               │
│                                                  │
│          🧠 Powered by Claude Sonnet 4.5        │
└──────────────────────────────────────────────────┘
```

### **Funcionalidades**

- **🔄 Botão Refresh**: Clique para gerar um novo insight
- **⚡ Carregamento rápido**: Resposta em 1-2 segundos
- **💬 Mensagens personalizadas**: Cada insight é único para sua casa
- **🎨 Visual moderno**: Gradientes e animações suaves

### **Estados possíveis**

| Estado | Descrição | Visual |
|--------|-----------|--------|
| ✅ Sucesso | IA retornou insight | Mostra texto gerado |
| ⏳ Carregando | Aguardando resposta | Spinner + "Analisando com IA..." |
| ⚠️ Erro | Falha na geração | Alerta amarelo com mensagem |
| 🔒 Não configurado | API key ausente | Card cinza + instruções |

---

## 🔌 APIs Disponíveis {#apis-disponíveis}

### **1. Verificar Status da IA**

```http
GET /MessAway/ai/status
```

**Resposta:**
```json
{
  "configured": true,
  "model": "claude-sonnet-4-20250514",
  "status": "ready"
}
```

---

### **2. Gerar Insight de Casa**

```http
POST /MessAway/ai/casa-insight
Content-Type: application/json

{
  "casaName": "Casa da Daniela",
  "totalTasks": 30,
  "completedTasks": 25
}
```

**Resposta de Sucesso:**
```json
{
  "content": "Excelente trabalho! Você completou 83% das tarefas. Continue assim!",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 42,
  "success": true
}
```

**Resposta de Erro:**
```json
{
  "error": "ANTHROPIC_API_KEY environment variable not set",
  "success": false
}
```

---

### **3. Gerar Resposta Personalizada**

```http
POST /MessAway/ai/generate
Content-Type: application/json

{
  "prompt": "Dê 3 dicas para organizar uma cozinha",
  "context": "Você é um especialista em organização doméstica",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Resposta:**
```json
{
  "content": "Aqui estão 3 dicas eficazes:\n\n1. **Organização por Zonas**...",
  "model": "claude-sonnet-4-20250514",
  "tokensUsed": 156,
  "success": true
}
```

**Parâmetros:**
- `prompt` (obrigatório): Pergunta ou solicitação
- `context` (opcional): Contexto/papel da IA
- `maxTokens` (opcional): Limite de tokens (padrão: 1024)
- `temperature` (opcional): Criatividade 0-1 (padrão: 1.0)

---

### **Exemplo de uso no JavaScript**

```javascript
import { generateCasaInsight } from './api/ai'

// Gerar insight
const response = await generateCasaInsight({
  casaName: 'Minha Casa',
  totalTasks: 50,
  completedTasks: 35
})

if (response.success) {
  console.log('Insight:', response.content)
  console.log('Tokens usados:', response.tokensUsed)
} else {
  console.error('Erro:', response.error)
}
```

---

## ⚡ Performance e Tempo de Resposta

### **Velocidade do Claude Sonnet 4.5**

| Métrica | Tempo |
|---------|-------|
| **Tempo médio de resposta** | 1-3 segundos |
| **Tempo mínimo** | 0.8 segundos |
| **Tempo máximo** | 5 segundos (casos raros) |

### **Fatores que influenciam a velocidade:**

✅ **Mais rápido:**
- Prompts curtos e objetivos
- `maxTokens` baixo (150-200)
- Boa conexão com internet
- Horários de baixa demanda

❌ **Mais lento:**
- Prompts muito longos
- `maxTokens` alto (>500)
- Conexão instável
- Horários de pico (servidores sobrecarregados)

### **Otimizações implementadas:**

1. **Prompts compactos**: Apenas dados essenciais
2. **maxTokens limitado**: 150 tokens para insights rápidos
3. **Requisições assíncronas**: Não bloqueia a interface
4. **Loading states**: Feedback visual enquanto processa
5. **Error handling**: Timeout de 10 segundos

---

## 💰 Custos e Limites {#custos}

### **Precificação da Anthropic (Claude Sonnet 4)**

| Métrica | Preço |
|---------|-------|
| **Tokens de entrada** | $3,00 por 1M tokens |
| **Tokens de saída** | $15,00 por 1M tokens |

### **Estimativa de Custos**

**1 insight de casa:**
- Entrada: ~50 tokens
- Saída: ~50 tokens
- **Custo**: ~$0.001 (um décimo de centavo)

**Uso mensal estimado:**
- 100 usuários × 10 insights/dia × 30 dias = 30.000 insights
- **Custo total**: ~$30/mês

### **Crédito Grátis**

- 🎁 **$5 grátis** para novos usuários
- Equivale a ~1.600 insights
- Suficiente para desenvolvimento e testes

### **Otimização de Custos**

✅ **Faça:**
- Use `maxTokens` baixo para respostas curtas
- Configure `temperature=0` para respostas determinísticas (pode cachear)
- Implemente cache de respostas comuns
- Monitore uso no console Anthropic

❌ **Evite:**
- Fazer múltiplas chamadas desnecessárias
- Usar `maxTokens` muito alto
- Gerar insights a cada refresh de página

---

## 🔍 Troubleshooting {#troubleshooting}

### **Problema 1: "AI não configurada"**

**Sintoma:** Card cinza no Dashboard com mensagem de erro

**Solução:**
```bash
# Verificar se variável está setada
echo $ANTHROPIC_API_KEY

# Se não aparecer nada, configure:
export ANTHROPIC_API_KEY='sk-ant-sua-chave-aqui'

# Reinicie o backend
cd BACKEND
mvn exec:java
```

---

### **Problema 2: "authentication_error: invalid x-api-key"**

**Causa:** Chave da API inválida ou expirada

**Solução:**
1. Acesse https://console.anthropic.com/
2. Vá em "API Keys"
3. Verifique se a chave ainda está ativa
4. Se necessário, gere uma nova chave
5. Atualize a variável de ambiente

---

### **Problema 3: "rate_limit_error"**

**Causa:** Muitas requisições em pouco tempo

**Solução:**
- Aguarde alguns segundos
- Implemente delay entre requisições
- Considere upgrade do plano Anthropic

---

### **Problema 4: Insight não aparece no Dashboard**

**Checklist:**
- [ ] Backend está rodando? (`http://localhost:4567/MessAway/ai/status`)
- [ ] Frontend está rodando? (`http://localhost:5173`)
- [ ] Existe casa selecionada com tarefas?
- [ ] Console do navegador mostra erros? (F12)
- [ ] Endpoint retorna sucesso no Postman/curl?

---

### **Problema 5: Resposta muito lenta**

**Causas possíveis:**
- `maxTokens` muito alto
- Conexão lenta com API Anthropic
- Backend sobrecarregado

**Soluções:**
- Reduza `maxTokens` para 150-200
- Verifique latência da rede
- Implemente timeout de 10 segundos

---

## 🚀 Próximos Passos

### **Funcionalidades futuras planejadas:**

1. **Sugestão de Tarefas**: IA sugere tarefas baseadas no histórico
2. **Resumo Semanal**: Relatório automático de progresso
3. **Dicas Personalizadas**: Recomendações específicas por cômodo
4. **Análise de Padrões**: IA identifica tendências nas suas tarefas
5. **Chat com IA**: Converse sobre organização doméstica

### **Integrações adicionais:**

- [ ] Notificações push com insights
- [ ] Relatórios PDF gerados por IA
- [ ] Assistente de voz para adicionar tarefas
- [ ] Análise de imagens (identificar bagunça)

---

## 📚 Recursos Úteis

- **Documentação Anthropic**: https://docs.anthropic.com/
- **Console Anthropic**: https://console.anthropic.com/
- **Status da API**: https://status.anthropic.com/
- **Repositório MessAway**: https://github.com/Site-TI-II/mess-away
- **Guia original (EN)**: `BACKEND/AI_INTEGRATION.md`

---

## 🔐 Segurança

### **Boas práticas:**

✅ **Faça:**
- Armazene chave em variável de ambiente
- Adicione `.env` ao `.gitignore`
- Rotacione chaves periodicamente
- Monitore uso no console Anthropic
- Use HTTPS em produção

❌ **NUNCA:**
- Commite chaves no Git
- Exponha chaves no frontend
- Compartilhe chaves publicamente
- Use a mesma chave em múltiplos ambientes

---

## 📞 Suporte

**Problemas com a integração?**
- Abra uma issue no GitHub: https://github.com/Site-TI-II/mess-away/issues
- Consulte o guia original: `BACKEND/AI_INTEGRATION.md`

**Problemas com a API Anthropic?**
- Documentação: https://docs.anthropic.com/
- Suporte: support@anthropic.com

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0  
**Modelo de IA:** Claude Sonnet 4.5 (claude-sonnet-4-20250514)
