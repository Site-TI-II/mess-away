// src/pages/Tarefas/components/TaskItem.jsx

import { Box, Typography, Chip, IconButton, ListItem } from '@mui/material'
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { coresPorResponsavel } from '../constants/taskConstants'

function TaskItem({ item, index, onComplete, onDelete, compact = false }) {
  return (
    <ListItem
      sx={{
        bgcolor: coresPorResponsavel[item.responsavel],
        color: 'white',
        mb: compact ? 1 : 1.5,
        borderRadius: 2,
        p: compact ? 1.5 : 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        opacity: item.concluida ? 0.6 : 1,
        ...(!compact && {
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        })
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant={compact ? 'body2' : 'body1'}
          sx={{
            fontWeight: 600,
            textDecoration: item.concluida ? 'line-through' : 'none',
            mb: compact ? 0 : 0.5,
            overflow: compact ? 'hidden' : 'visible',
            textOverflow: compact ? 'ellipsis' : 'clip',
            whiteSpace: compact ? 'nowrap' : 'normal'
          }}
        >
          {item.tarefa}
        </Typography>

        {compact ? (
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {item.responsavel}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={item.responsavel}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip
              label={item.prazo}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: compact ? 0 : 1 }}>
        <IconButton
          size={compact ? 'small' : 'medium'}
          onClick={() => onComplete(index)}
          disabled={item.concluida}
          sx={{
            color: 'white',
            bgcolor: item.concluida ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(76, 175, 80, 0.4)'
            }
          }}
        >
          <CheckIcon fontSize={compact ? 'small' : 'medium'} />
        </IconButton>

        {!compact && (
          <IconButton
            onClick={() => onDelete(index)}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.4)'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </ListItem>
  )
}

export default TaskItem