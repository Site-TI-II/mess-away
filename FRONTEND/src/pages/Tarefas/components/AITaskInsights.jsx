// src/pages/Tarefas/components/AITaskInsights.jsx

import { useState, useEffect } from 'react'
import { Box, Typography, Paper, CircularProgress, IconButton, Collapse, Chip } from '@mui/material'
import { 
  AutoAwesome as SparkleIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  Psychology as BrainIcon,
  TipsAndUpdates as LightbulbIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { generateAIResponse, checkAIStatus } from '../../../api/ai'

/**
 * AITaskInsights - Insights de IA para tarefas
 * 
 * Funcionalidades:
 * - Analisa tarefas e gera sugestões inteligentes
 * - Identifica padrões e prioridades
 * - Oferece dicas de organização
 * - Compacto e colapsável para não ocupar muito espaço
 * - Tempo médio de resposta: 1-3 segundos
 */
function AITaskInsights({ lista, casaNome }) {
  const theme = useTheme()
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    checkAIAvailability()
  }, [])

  useEffect(() => {
    if (isConfigured && lista && lista.length > 0 && expanded) {
      loadInsight()
    }
  }, [isConfigured, lista, expanded])

  const checkAIAvailability = async () => {
    try {
      const status = await checkAIStatus()
      setIsConfigured(status.configured === true)
    } catch (err) {
      setIsConfigured(false)
    }
  }

  const loadInsight = async () => {
    if (!lista || lista.length === 0) {
      setInsight('Adicione tarefas para receber insights personalizados da IA!')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Análise das tarefas
      const totalTasks = lista.length
      const completedTasks = lista.filter(t => t.concluida || t.status === 'completed').length
      const pendingTasks = totalTasks - completedTasks
      const urgentTasks = lista.filter(t => {
        if (t.concluida || t.status === 'completed') return false
        if (!t.dataEstimada && !t.prazo) return false
        const prazoDate = new Date(t.dataEstimada || t.prazo)
        const hoje = new Date()
        const diffDays = Math.ceil((prazoDate - hoje) / (1000 * 60 * 60 * 24))
        return diffDays <= 2
      }).length

      // Criar prompt contextual
      const prompt = `Analise estas informações sobre tarefas domésticas e dê UMA dica prática e motivacional (máximo 2 frases):

Casa: ${casaNome || 'Casa'}
Total de tarefas: ${totalTasks}
Concluídas: ${completedTasks}
Pendentes: ${pendingTasks}
Urgentes (próximas 48h): ${urgentTasks}

Seja breve, motivador e dê uma dica específica de organização ou priorização.`

      const response = await generateAIResponse({
        prompt,
        context: 'Você é um assistente de organização doméstica. Seja conciso, motivador e prático.',
        maxTokens: 150,
        temperature: 0.8
      })

      if (response.success) {
        setInsight(response.content)
      } else {
        setError('Não foi possível gerar insight')
      }
    } catch (err) {
      console.error('Erro ao gerar insight:', err)
      setError('Erro ao gerar insight')
    } finally {
      setLoading(false)
    }
  }

  if (!isConfigured) {
    return null // Não mostrar nada se IA não estiver configurada
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.info.main}08 0%, ${theme.palette.primary.main}15 100%)`,
        border: `1px solid ${theme.palette.primary.main}20`,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header Compacto */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.02)'
          }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon 
            sx={{ 
              fontSize: '1.3rem', 
              color: theme.palette.warning.main,
              animation: expanded ? 'pulse 2s ease-in-out infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 }
              }
            }} 
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Insights de IA
          </Typography>
          <Chip 
            label="Beta" 
            size="small" 
            sx={{ 
              height: 18, 
              fontSize: '0.65rem',
              bgcolor: theme.palette.info.main,
              color: 'white',
              fontWeight: 600
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!loading && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                loadInsight()
              }}
              size="small"
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)'
                }
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Conteúdo Colapsável */}
      <Collapse in={expanded}>
        <Box
          sx={{
            p: 2,
            pt: 0,
            minHeight: 60
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Analisando tarefas...
              </Typography>
            </Box>
          ) : error ? (
            <Typography variant="body2" color="error" sx={{ fontSize: '0.875rem' }}>
              {error}
            </Typography>
          ) : insight ? (
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: theme.palette.text.primary,
                  mb: 1
                }}
              >
                {insight}
              </Typography>
              
              {/* Badge discreto */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  opacity: 0.5
                }}
              >
                <BrainIcon sx={{ fontSize: '0.75rem' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  Claude Sonnet 4.5
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
              Clique no botão de refresh para gerar insights
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

export default AITaskInsights
