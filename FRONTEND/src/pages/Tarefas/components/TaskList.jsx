// src/pages/Tarefas/components/TaskList.jsx

import { Box, Paper, Typography, Chip, Divider, List } from '@mui/material'
import { Assignment as AssignmentIcon } from '@mui/icons-material'
import TaskItem from './TaskItem'

function TaskList({ lista, onComplete, onDelete }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        minHeight: '500px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssignmentIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
          Todas as Tarefas
        </Typography>
        <Chip
          label={`${lista.length} tarefa${lista.length !== 1 ? 's' : ''}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lista */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {lista.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary'
            }}
          >
            <AssignmentIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6">Nenhuma tarefa adicionada</Typography>
            <Typography variant="body2">
              Adicione sua primeira tarefa acima
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {lista.map((item, index) => (
              <TaskItem
                key={index}
                item={item}
                index={index}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  )
}

export default TaskList