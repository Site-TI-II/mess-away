// src/pages/Dashboard/components/CasasSection.jsx

import { Box, Typography, Paper, LinearProgress, Grid, Chip } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'
import { getHouseStatus, HOUSE_STATUS_CONFIG } from '../constants/dashboardConstants'

/**
 * CasasSection - Seção com cards de casas
 * 
 * Funcionalidades:
 * - Exibe cards de todas as casas cadastradas do usuário logado
 * - Mostra status visual de cada casa
 * - Progress bar de conclusão de tarefas
 * - Botão para adicionar nova casa
 * - Cards responsivos em grid
 * - Ao clicar em "Ver Detalhes", navega para a casa selecionada em /casas
 */
function CasasSection({ casas = [] }) {

  // Se não tiver casas, mostra apenas o card de adicionar
  const casasData = casas.length > 0 ? casas : []

  // Calcular porcentagem de conclusão
  const calcularProgresso = (casa) => {
    if (casa.totalTarefas === 0) return 0
    return Math.round((casa.tarefasConcluidas / casa.totalTarefas) * 100)
  }

  // Removido: navegação e criação de casa a partir do dashboard

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
        
        {/* Removido: Botão "Nova Casa" */}
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
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
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

                {/* Removido: Botão "Ver Detalhes" */}
              </Paper>
            </Grid>
          )
        })}
        {/* Removido: Card "Adicionar Nova Casa" */}
      </Grid>
    </Box>
  )
}

export default CasasSection