// src/pages/Dashboard/components/AIInsightSection.jsx

import { useState, useEffect } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, IconButton } from '@mui/material'
import { 
  AutoAwesome as SparkleIcon,
  Refresh as RefreshIcon,
  Psychology as BrainIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { generateCasaInsight, checkAIStatus } from '../../../api/ai'

/**
 * AIInsightSection - Seção de insights gerados por IA
 * 
 * Funcionalidades:
 * - Gera insights personalizados usando Claude Sonnet 4.5
 * - Analisa progresso e oferece sugestões
 * - Botão para regenerar insights
 * - Animações suaves e visual moderno
 * - Tratamento de erros (IA não configurada)
 */
function AIInsightSection({ casa, weeklyData }) {
  const theme = useTheme()
  const [aiInsight, setAiInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    checkAIAvailability()
  }, [])

  useEffect(() => {
    if (isConfigured && casa && weeklyData) {
      loadAIInsight()
    }
  }, [isConfigured, casa, weeklyData])

  // Verificar se IA está configurada
  const checkAIAvailability = async () => {
    try {
      const status = await checkAIStatus()
      setIsConfigured(status.configured === true)
      
      if (!status.configured) {
        setError('IA não configurada. Configure ANTHROPIC_API_KEY no backend.')
      }
    } catch (err) {
      console.error('Erro ao verificar status da IA:', err)
      setIsConfigured(false)
      setError('Não foi possível conectar ao serviço de IA.')
    }
  }

  // Carregar insight da IA
  const loadAIInsight = async () => {
    if (!casa || !weeklyData) return

    setLoading(true)
    setError(null)

    try {
      const response = await generateCasaInsight({
        casaName: casa.nome,
        totalTasks: weeklyData.tarefasTotais || 0,
        completedTasks: weeklyData.tarefasConcluidas || 0
      })

      if (response.success) {
        setAiInsight(response.content)
      } else {
        setError(response.error || 'Erro ao gerar insight')
      }
    } catch (err) {
      console.error('Erro ao carregar insight da IA:', err)
      setError('Não foi possível gerar insight. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Não renderizar se não tiver dados necessários
  if (!casa || !weeklyData) {
    return null
  }

  // Renderizar erro se IA não estiver configurada
  if (!isConfigured && !loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
          border: `1px solid ${theme.palette.grey[300]}`,
          opacity: 0.7
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BrainIcon sx={{ fontSize: '1.75rem', color: theme.palette.grey[500] }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.grey[600] }}>
            Insights de IA
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          IA não configurada. Configure a chave da API Anthropic no backend para ativar insights inteligentes.
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}15 0%, 
          ${theme.palette.secondary.main}25 100%
        )`,
        border: `1px solid ${theme.palette.primary.main}30`,
        boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Padrão decorativo de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Header com botão de refresh */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SparkleIcon 
            sx={{ 
              fontSize: '1.75rem', 
              color: theme.palette.primary.main,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 }
              }
            }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Insights de IA
          </Typography>
        </Box>

        <IconButton
          onClick={loadAIInsight}
          disabled={loading}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              transform: 'rotate(180deg)'
            },
            transition: 'all 0.5s ease'
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Conteúdo do insight */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body1" color="text.secondary">
              Analisando com IA...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : aiInsight ? (
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: theme.palette.text.primary,
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {aiInsight}
            </Typography>
            
            {/* Badge "Powered by Claude" */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 0.5,
                mt: 2,
                opacity: 0.6
              }}
            >
              <BrainIcon sx={{ fontSize: '0.9rem' }} />
              <Typography variant="caption" fontWeight="600">
                Powered by Claude Sonnet 4.5
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nenhum insight disponível
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default AIInsightSection
