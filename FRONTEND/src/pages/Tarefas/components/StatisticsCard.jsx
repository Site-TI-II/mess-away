// src/pages/Tarefas/components/StatisticsCard.jsx

import { Box, Paper, Typography, Chip, Divider } from '@mui/material'
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { coresPorResponsavel } from '../constants/taskConstants'

function StatisticsCard({ lista }) {
  const contarPorResponsavel = () => {
    const contagem = {}
    lista.forEach(({ responsavel, concluida }) => {
      if (concluida) {
        contagem[responsavel] = (contagem[responsavel] || 0) + 1
      }
    })
    return contagem
  }

  const estatisticas = contarPorResponsavel()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        minHeight: '280px',
        maxHeight: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUpIcon color="success" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Estatísticas
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {lista.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            Adicione tarefas para ver estatísticas
          </Typography>
        ) : Object.entries(estatisticas).length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            Nenhuma tarefa concluída ainda
          </Typography>
        ) : (
          <Box>
            {Object.entries(estatisticas).map(([nome, quantidade]) => (
              <Box
                key={nome}
                sx={{
                  bgcolor: coresPorResponsavel[nome],
                  borderRadius: 2,
                  p: 2,
                  mb: 1.5,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {nome}
                </Typography>
                <Chip
                  label={`${quantidade} concluída${quantidade > 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default StatisticsCard