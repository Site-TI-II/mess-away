// src/pages/Dashboard/components/MotivationalSection.jsx

import { Box, Typography, Paper, LinearProgress, Grid, Chip } from '@mui/material'
import { 
  EmojiEvents as TrophyIcon,
  Whatshot as FireIcon,
  TrendingUp as TrendingUpIcon 
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { 
  getMotivationalMessage, 
  ACHIEVEMENTS, 
  PROGRESS_THRESHOLDS 
} from '../constants/dashboardConstants'

/**
 * MotivationalSection - Seção de progresso e gamificação
 * 
 * Funcionalidades:
 * - Barra de progresso semanal
 * - Mensagem motivacional dinâmica
 * - Streak (dias consecutivos)
 * - Conquistas/badges recentes
 * - Estatísticas visuais
 * - Cores dinâmicas baseadas em performance
 */
function MotivationalSection({ weeklyData = null }) {
  const theme = useTheme()

  // Dados mockados se não passar props
  const data = weeklyData || {
    tarefasConcluidas: 26,
    tarefasTotais: 40,
    streak: 5,
    conquistasRecentes: ['productive-week', 'early-bird']
  }

  // Calcular porcentagem
  const progresso = Math.round((data.tarefasConcluidas / data.tarefasTotais) * 100)

  // Determinar cor baseada no progresso
  const getProgressColor = () => {
    if (progresso >= PROGRESS_THRESHOLDS.EXCELLENT) return theme.palette.success.main
    if (progresso >= PROGRESS_THRESHOLDS.GOOD) return theme.palette.primary.main
    if (progresso >= PROGRESS_THRESHOLDS.MEDIUM) return theme.palette.warning.main
    return theme.palette.error.main
  }

  const progressColor = getProgressColor()

  // Mensagem motivacional
  const mensagem = getMotivationalMessage(progresso, data.streak > 0)

  // Pegar conquistas pelo ID
  const conquistasDesbloqueadas = ACHIEVEMENTS.filter(
    achievement => data.conquistasRecentes.includes(achievement.id)
  )

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${progressColor}15 0%, ${progressColor}25 100%)`,
        border: `1px solid ${progressColor}30`,
        boxShadow: `0 4px 20px ${progressColor}20`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Padrão decorativo de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${progressColor}20 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Header da Seção */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, position: 'relative' }}>
        <TrophyIcon sx={{ fontSize: '1.75rem', color: progressColor }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Progresso Semanal
        </Typography>
      </Box>

      {/* Progress Bar Principal */}
      <Box sx={{ mb: 3, position: 'relative' }}>
        {/* Label acima da barra */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            {data.tarefasConcluidas} de {data.tarefasTotais} tarefas
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: progressColor }}>
            {progresso}%
          </Typography>
        </Box>

        {/* Barra de Progresso */}
        <LinearProgress
          variant="determinate"
          value={progresso}
          sx={{
            height: 16,
            borderRadius: 2,
            bgcolor: `${progressColor}20`,
            '& .MuiLinearProgress-bar': {
              bgcolor: progressColor,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}dd 100%)`
            }
          }}
        />
      </Box>

      {/* Mensagem Motivacional */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          mb: 3,
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            color: progressColor,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          {mensagem}
        </Typography>
      </Box>

      {/* Grid: Streak + Conquistas */}
      <Grid container spacing={3}>
        {/* Streak Card */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              textAlign: 'center'
            }}
          >
            <FireIcon sx={{ fontSize: '2.5rem', color: '#ff6f00', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="#ff6f00">
              {data.streak}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="600">
              Dias Consecutivos
            </Typography>
          </Box>
        </Grid>

        {/* Conquistas Card */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Conquistas Recentes
              </Typography>
            </Box>

            {conquistasDesbloqueadas.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Complete tarefas para desbloquear conquistas!
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {conquistasDesbloqueadas.map((achievement) => (
                  <Box
                    key={achievement.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Ícone da Conquista */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f57f17 0%, #ff9800 100%)',
                        fontSize: '1.25rem',
                        boxShadow: '0 2px 8px rgba(245, 127, 23, 0.3)'
                      }}
                    >
                      {achievement.icon}
                    </Box>

                    {/* Info da Conquista */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        {achievement.description}
                      </Typography>
                    </Box>

                    {/* Badge "Novo" */}
                    <Chip
                      label="Novo!"
                      size="small"
                      sx={{
                        bgcolor: progressColor,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default MotivationalSection