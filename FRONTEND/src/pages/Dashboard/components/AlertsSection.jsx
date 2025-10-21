// src/pages/Dashboard/components/AlertsSection.jsx

import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Chip, Divider } from '@mui/material'
import { 
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { ALERT_TYPES, ALERT_COLORS, ALERT_ICONS } from '../constants/dashboardConstants'

/**
 * AlertsSection - Seção de alertas e notificações
 * 
 * Funcionalidades:
 * - Lista de alertas por tipo (crítico, aviso, info, sucesso)
 * - Cores e ícones dinâmicos por tipo
 * - Contador de alertas por categoria
 * - Botão para ver todos os alertas
 * - Lista compacta e escaneável
 */
function AlertsSection({ alerts = [] }) {
  const theme = useTheme()
  const navigate = useNavigate()

  // Se não tiver alertas, usa dados mockados
  const alertsData = alerts.length > 0 ? alerts : [
    {
      id: 1,
      type: ALERT_TYPES.CRITICAL,
      title: '3 tarefas atrasadas',
      description: 'Limpar geladeira (há 5 dias)',
      timestamp: '2024-01-15'
    },
    {
      id: 2,
      type: ALERT_TYPES.CRITICAL,
      title: 'Tarefa muito atrasada',
      description: 'Organizar armário (há 10 dias)',
      timestamp: '2024-01-10'
    },
    {
      id: 3,
      type: ALERT_TYPES.WARNING,
      title: '2 tarefas vencem hoje',
      description: 'Lavar roupas (hoje às 18h)',
      timestamp: '2024-01-20'
    },
    {
      id: 4,
      type: ALERT_TYPES.INFO,
      title: 'Lembrete semanal',
      description: 'Trocar lençóis (tarefa recorrente)',
      timestamp: '2024-01-20'
    },
    {
      id: 5,
      type: ALERT_TYPES.SUCCESS,
      title: 'Meta alcançada!',
      description: '25 tarefas concluídas esta semana',
      timestamp: '2024-01-20'
    }
  ]

  // Contar alertas por tipo
  const countByType = (type) => {
    return alertsData.filter(alert => alert.type === type).length
  }

  // Ícone baseado no tipo
  const getIconByType = (type) => {
    switch (type) {
      case ALERT_TYPES.CRITICAL:
        return <ErrorIcon />
      case ALERT_TYPES.WARNING:
        return <WarningIcon />
      case ALERT_TYPES.INFO:
        return <InfoIcon />
      case ALERT_TYPES.SUCCESS:
        return <CheckCircleIcon />
      default:
        return <InfoIcon />
    }
  }

  // Handler para ver todos os alertas
  const handleVerTodos = () => {
    navigate('/alertas')
  }

  // Handler para clicar em um alerta específico
  const handleAlertClick = (alert) => {
    // Navegar para a tarefa ou ação relacionada
    if (alert.type === ALERT_TYPES.CRITICAL || alert.type === ALERT_TYPES.WARNING) {
      navigate('/tarefas')
    }
  }

  return (
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
      {/* Header da Seção */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" sx={{ fontSize: '1.75rem' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Alertas e Notificações
          </Typography>
        </Box>

        {/* Contador Total */}
        <Chip
          label={alertsData.length}
          size="small"
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Resumo por Tipo */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {countByType(ALERT_TYPES.CRITICAL) > 0 && (
          <Chip
            label={`${ALERT_ICONS[ALERT_TYPES.CRITICAL]} ${countByType(ALERT_TYPES.CRITICAL)} crítico${countByType(ALERT_TYPES.CRITICAL) > 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: `${ALERT_COLORS[ALERT_TYPES.CRITICAL]}20`,
              color: ALERT_COLORS[ALERT_TYPES.CRITICAL],
              fontWeight: 600
            }}
          />
        )}
        {countByType(ALERT_TYPES.WARNING) > 0 && (
          <Chip
            label={`${ALERT_ICONS[ALERT_TYPES.WARNING]} ${countByType(ALERT_TYPES.WARNING)} aviso${countByType(ALERT_TYPES.WARNING) > 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: `${ALERT_COLORS[ALERT_TYPES.WARNING]}20`,
              color: ALERT_COLORS[ALERT_TYPES.WARNING],
              fontWeight: 600
            }}
          />
        )}
        {countByType(ALERT_TYPES.INFO) > 0 && (
          <Chip
            label={`${ALERT_ICONS[ALERT_TYPES.INFO]} ${countByType(ALERT_TYPES.INFO)} info`}
            size="small"
            sx={{
              bgcolor: `${ALERT_COLORS[ALERT_TYPES.INFO]}20`,
              color: ALERT_COLORS[ALERT_TYPES.INFO],
              fontWeight: 600
            }}
          />
        )}
        {countByType(ALERT_TYPES.SUCCESS) > 0 && (
          <Chip
            label={`${ALERT_ICONS[ALERT_TYPES.SUCCESS]} ${countByType(ALERT_TYPES.SUCCESS)} sucesso${countByType(ALERT_TYPES.SUCCESS) > 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: `${ALERT_COLORS[ALERT_TYPES.SUCCESS]}20`,
              color: ALERT_COLORS[ALERT_TYPES.SUCCESS],
              fontWeight: 600
            }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lista de Alertas */}
      {alertsData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.5, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Nenhum alerta no momento
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {alertsData.slice(0, 5).map((alert, index) => (
            <Box key={alert.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: `${ALERT_COLORS[alert.type]}10`
                  }
                }}
                onClick={() => handleAlertClick(alert)}
              >
                {/* Ícone do Alerta */}
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: `${ALERT_COLORS[alert.type]}20`,
                      color: ALERT_COLORS[alert.type]
                    }}
                  >
                    {getIconByType(alert.type)}
                  </Box>
                </ListItemIcon>

                {/* Conteúdo do Alerta */}
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="bold">
                      {alert.title}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        mt: 0.5
                      }}
                    >
                      {alert.description}
                    </Typography>
                  }
                />

                {/* Emoji Visual */}
                <Typography sx={{ fontSize: '1.25rem', ml: 1 }}>
                  {ALERT_ICONS[alert.type]}
                </Typography>
              </ListItem>
              
              {/* Divider entre itens (exceto último) */}
              {index < Math.min(alertsData.length, 5) - 1 && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </Box>
          ))}
        </List>
      )}

      {/* Botão Ver Todos (se tiver mais de 5 alertas) */}
      {alertsData.length > 5 && (
        <Button
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={handleVerTodos}
          sx={{
            mt: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.05)'
            }
          }}
        >
          Ver Todos os Alertas ({alertsData.length})
        </Button>
      )}
    </Paper>
  )
}

export default AlertsSection