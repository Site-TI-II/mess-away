
import { useState, useEffect } from 'react'
import { Box, Typography, Button, IconButton, Paper, CircularProgress } from '@mui/material'
import { Close as CloseIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { listInsights } from '../../../api/insights'

/**
 * InsightBanner - Banner destacado com insight inteligente do dia
 * 
 * Funcionalidades:
 * - Exibe insight inteligente baseado em dados
 * - Design destacado mas não intrusivo
 * - Pode ser fechado pelo usuário
 * - Glass morphism com gradiente suave
 * - Ícone visual representativo
 * 
 * @param {Object} insight - Objeto com o insight (opcional, usa random se não fornecido)
 */
function InsightBanner({ insight: propInsight }) {
  const theme = useTheme()
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [insights, setInsights] = useState([])
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)
  
  // Carrega insights do backend
  useEffect(() => {
    if (!propInsight) {
      setLoading(true)
      listInsights()
        .then(data => {
          setInsights(data)
          setError(null)
        })
        .catch(err => {
          console.error('Erro ao carregar insights:', err)
          setError('Não foi possível carregar os insights.')
        })
        .finally(() => setLoading(false))
    }
  }, [propInsight])

  // Rotaciona insights a cada 30 segundos
  useEffect(() => {
    if (insights.length > 1) {
      const timer = setInterval(() => {
        setCurrentInsightIndex(current => 
          current + 1 >= insights.length ? 0 : current + 1)
      }, 30000)
      return () => clearInterval(timer)
    }
  }, [insights.length])

  // Usa insight passado por prop ou um dos carregados
  const insight = propInsight || (insights.length > 0 ? insights[currentInsightIndex] : null)

  // Handler para fechar o banner
  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('insightBannerClosed', new Date().toDateString())
  }

  // Se não está visível, não renderiza nada
  if (!isVisible) return null

  // Mostra loading
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    )
  }

  // Mostra erro
  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        {error}
      </Paper>
    )
  }

  // Se não tem insight, não renderiza nada
  if (!insight) return null

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
        borderRadius: 3,
        // Gradiente suave de fundo baseado no tipo de insight
        background: `linear-gradient(135deg, 
          ${insight.color}15 0%, 
          ${insight.color}25 100%
        )`,
        // Glass morphism
        backdropFilter: 'blur(10px)',
        border: `1px solid ${insight.color}30`,
        boxShadow: `0 4px 20px ${insight.color}20`,
        // Animação de entrada
        animation: 'slideDown 0.5s ease-out',
        '@keyframes slideDown': {
          from: {
            opacity: 0,
            transform: 'translateY(-20px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      {/* Padrão decorativo de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          opacity: 0.05,
          background: `radial-gradient(circle at 50% 50%, ${insight.color} 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <Box
        sx={{
          position: 'relative',
          p: { xs: 2, md: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 3 }
        }}
      >
        {/* Ícone Grande do Insight */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: 60, md: 80 },
            minHeight: { xs: 60, md: 80 },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${insight.color}30, ${insight.color}50)`,
            fontSize: { xs: '2rem', md: '3rem' },
            boxShadow: `0 4px 12px ${insight.color}30`
          }}
        >
          {insight.icon}
        </Box>

        {/* Conteúdo Principal */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Label "Insight do Dia" */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <TrendingUpIcon 
              sx={{ 
                fontSize: '1.25rem', 
                color: insight.color 
              }} 
            />
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: insight.color,
                letterSpacing: '0.1em'
              }}
            >
              Insight do Dia
            </Typography>
          </Box>

          {/* Título do Insight */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 0.5,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: 'text.primary'
            }}
          >
            {insight.title}
          </Typography>

          {/* Mensagem do Insight */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.95rem', md: '1rem' },
              lineHeight: 1.6
            }}
          >
            {insight.message}
          </Typography>

          {/* Botão Ver Detalhes (opcional) */}
          <Button
            size="small"
            sx={{
              mt: 2,
              color: insight.color,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: `${insight.color}10`
              }
            }}
          >
            Ver Detalhes →
          </Button>
        </Box>

        {/* Botão Fechar */}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default InsightBanner