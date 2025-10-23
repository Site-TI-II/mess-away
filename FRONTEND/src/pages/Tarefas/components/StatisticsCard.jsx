// src/pages/Tarefas/components/StatisticsCard.jsx

import { Box, Paper, Typography, Chip, Divider, LinearProgress } from '@mui/material'
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { coresPorResponsavel } from '../constants/taskConstants'

function getColorForName(name) {
  if (coresPorResponsavel && coresPorResponsavel[name]) return coresPorResponsavel[name]
  // fallback: hash the name to a hue
  const hash = (name || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const hue = hash % 360
  return `hsl(${hue}, 60%, 40%)`
}

function StatisticsCard({ lista }) {
  const totalTarefas = Array.isArray(lista) ? lista.length : 0
  const concluidas = Array.isArray(lista) ? lista.filter(t => t.concluida).length : 0
  const percent = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0

  // Diárias (frequencia === 1)
  const diarias = Array.isArray(lista) ? lista.filter(t => Number(t.frequencia) === 1) : []
  const diariasTotal = diarias.length
  const diariasConcluidas = diarias.filter(t => t.concluida).length
  const diariasPercent = diariasTotal > 0 ? Math.round((diariasConcluidas / diariasTotal) * 100) : 0

  const contarPorResponsavel = () => {
    const contagem = {}
    lista.forEach((item) => {
      // incluir tarefas concluídas nas estatísticas
      if (item.concluida) {
        const nome = item.nomeResponsavel || 'Desconhecido'
        contagem[nome] = (contagem[nome] || 0) + 1
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

      {/* Resumo geral de conclusão */}
      {totalTarefas === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 4 }}
        >
          Adicione tarefas para ver estatísticas
        </Typography>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Tarefas concluídas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {concluidas} de {totalTarefas} • {percent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 8, borderRadius: 1.5 }}
          />
        </Box>
      )}

      {/* Resumo de diárias */}
      {diariasTotal > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Diárias concluídas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {diariasConcluidas} de {diariasTotal} • {diariasPercent}%
            </Typography>
          </Box>
          <LinearProgress
            color="secondary"
            variant="determinate"
            value={diariasPercent}
            sx={{ height: 8, borderRadius: 1.5 }}
          />
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {totalTarefas === 0 ? null : Object.entries(estatisticas).length === 0 ? (
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
                  bgcolor: getColorForName(nome),
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