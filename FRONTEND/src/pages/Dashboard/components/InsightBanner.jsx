
import { useState } from 'react'
import { Box, Typography, Button, IconButton, Paper } from '@mui/material'
import { Close as CloseIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { getRandomInsight } from '../constants/dashboardConstants'

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
  
  // Usa insight passado por prop ou pega um aleatório
  const insight = propInsight || getRandomInsight()

  // Handler para fechar o banner
  const handleClose = () => {
    setIsVisible(false)
    // Aqui poderia salvar no localStorage que o usuário fechou hoje
    localStorage.setItem('insightBannerClosed', new Date().toDateString())
  }

  // Se não está visível, não renderiza nada
  if (!isVisible) return null

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