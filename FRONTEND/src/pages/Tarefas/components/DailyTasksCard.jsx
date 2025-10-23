// src/pages/Tarefas/components/DailyTasksCard.jsx

import { Box, Paper, Typography, Chip, Divider, List } from '@mui/material'
import { CalendarToday as CalendarIcon } from '@mui/icons-material'
import TaskItem from './TaskItem'

function DailyTasksCard({ lista, onComplete }) {
  // convencao: frequencia === 1 => tarefa diária
  const tarefasDiarias = lista.filter(item => Number(item.frequencia) === 1)

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
        <CalendarIcon color="secondary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
          Tarefas Diárias
        </Typography>
        <Chip
          label={tarefasDiarias.length}
          size="small"
          color="secondary"
          variant="outlined"
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {tarefasDiarias.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            Nenhuma tarefa diária
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {tarefasDiarias.map((item, idx) => (
              <TaskItem
                key={item.idTarefa || idx}
                item={item}
                index={idx}
                onComplete={onComplete}
                onDelete={() => {}}
                compact
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  )
}

export default DailyTasksCard