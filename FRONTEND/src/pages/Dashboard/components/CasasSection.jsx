// src/pages/Dashboard/components/CasasSection.jsx

import { Box, Typography, Paper, LinearProgress, Button, Grid, Chip } from '@mui/material'
import { Add as AddIcon, Home as HomeIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { getHouseStatus, HOUSE_STATUS_CONFIG } from '../constants/dashboardConstants'

/**
 * CasasSection - Seção com cards de casas
 * 
 * Funcionalidades:
 * - Exibe cards de todas as casas cadastradas
 * - Mostra status visual de cada casa
 * - Progress bar de conclusão de tarefas
 * - Botão para adicionar nova casa
 * - Cards responsivos em grid
 */
function CasasSection({ casas = [] }) {
  const theme = useTheme()
  const navigate = useNavigate()

  // Se não tiver casas, usa dados mockados para exemplo
  const casasData = casas.length > 0 ? casas : [
    {
      id: 1,
      nome: 'Casa Principal',
      tarefasPendentes: 12,
      tarefasConcluidas: 18,
      totalTarefas: 30,
      foto: null
    },
    {
      id: 2,
      nome: 'Casa de Praia',
      tarefasPendentes: 3,
      tarefasConcluidas: 27,
      totalTarefas: 30,
      foto: null
    }
  ]

  // Calcular porcentagem de conclusão
  const calcularProgresso = (casa) => {
    if (casa.totalTarefas === 0) return 0
    return Math.round((casa.tarefasConcluidas / casa.totalTarefas) * 100)
  }

  // Handler para navegar para detalhes da casa
  const handleVerDetalhes = (casaId) => {
    navigate(`/casas/${casaId}`)
  }

  // Handler para adicionar nova casa
  const handleAdicionarCasa = () => {
    navigate('/casas/nova')
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header da Seção */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HomeIcon color="primary" sx={{ fontSize: '1.75rem' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Minhas Casas
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdicionarCasa}
          sx={{
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Nova Casa
        </Button>
      </Box>

      {/* Grid de Cards de Casas */}
      <Grid container spacing={3}>
        {casasData.map((casa) => {
          const progresso = calcularProgresso(casa)
          const status = getHouseStatus(progresso)
          const statusConfig = HOUSE_STATUS_CONFIG[status]

          return (
            <Grid item xs={12} sm={6} md={4} key={casa.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                  }
                }}
                onClick={() => handleVerDetalhes(casa.id)}
              >
                {/* Ícone e Nome da Casa */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      background: `${statusConfig.color}20`,
                      fontSize: '1.5rem'
                    }}
                  >
                    🏠
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {casa.nome}
                    </Typography>
                    
                    {/* Chip de Status */}
                    <Chip
                      label={statusConfig.label}
                      size="small"
                      icon={<span>{statusConfig.icon}</span>}
                      sx={{
                        mt: 0.5,
                        bgcolor: `${statusConfig.color}20`,
                        color: statusConfig.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: statusConfig.color
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Informações de Tarefas */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {casa.tarefasPendentes} pendentes
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={statusConfig.color}>
                      {progresso}%
                    </Typography>
                  </Box>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={progresso}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: `${statusConfig.color}20`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: statusConfig.color,
                        borderRadius: 1
                      }
                    }}
                  />

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {casa.tarefasConcluidas} de {casa.totalTarefas} tarefas concluídas
                  </Typography>
                </Box>

                {/* Botão Ver Detalhes */}
                <Button
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: statusConfig.color,
                    '&:hover': {
                      bgcolor: `${statusConfig.color}10`
                    }
                  }}
                >
                  Ver Detalhes
                </Button>
              </Paper>
            </Grid>
          )
        })}

        {/* Card "Adicionar Nova Casa" */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'grey.300',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(25, 118, 210, 0.05)'
              }
            }}
            onClick={handleAdicionarCasa}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'white',
                mb: 2
              }}
            >
              <AddIcon sx={{ fontSize: '2rem' }} />
            </Box>
            
            <Typography variant="h6" color="text.secondary" fontWeight="bold">
              Adicionar Casa
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
              Crie uma nova casa para organizar
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CasasSection