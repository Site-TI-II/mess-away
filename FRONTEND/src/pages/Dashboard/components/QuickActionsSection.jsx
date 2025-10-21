// src/pages/Dashboard/components/QuickActionsSection.jsx

import { Box, Typography, Paper, Grid, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { QUICK_ACTIONS } from '../constants/dashboardConstants'

/**
 * QuickActionsSection - Seção de ações rápidas
 * 
 * Funcionalidades:
 * - Grid de botões grandes e visuais
 * - 5 ações principais do sistema
 * - Cores personalizadas por ação
 * - Ícones grandes (emojis)
 * - Navegação direta para cada seção
 * - Hover effects com elevação
 */
function QuickActionsSection() {
  const theme = useTheme()
  const navigate = useNavigate()

  // Handler para clicar em uma ação
  const handleActionClick = (action) => {
    navigate(action.path)
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header da Seção */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🎯 Ações Rápidas
        </Typography>
      </Box>

      {/* Grid de Botões de Ação */}
      <Grid container spacing={2}>
        {QUICK_ACTIONS.map((action) => (
          <Grid item xs={6} sm={4} md={2.4} key={action.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}25 100%)`,
                border: `1px solid ${action.color}30`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${action.color}40`,
                  background: `linear-gradient(135deg, ${action.color}25 0%, ${action.color}35 100%)`
                }
              }}
              onClick={() => handleActionClick(action)}
            >
              {/* Ícone Grande */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: `${action.color}30`,
                  fontSize: '1.75rem',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px ${action.color}30`
                }}
              >
                {action.icon}
              </Box>

              {/* Label da Ação */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'text.primary',
                  fontSize: { xs: '0.85rem', md: '0.95rem' }
                }}
              >
                {action.label}
              </Typography>

              {/* Descrição (visível apenas em desktop) */}
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  display: { xs: 'none', lg: 'block' },
                  lineHeight: 1.3
                }}
              >
                {action.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default QuickActionsSection