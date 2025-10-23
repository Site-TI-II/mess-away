// src/pages/Casas/components/PessoaItem.jsx

import { useState } from 'react'
import {
  ListItem,
  Box,
  Avatar,
  Chip,
  IconButton,
  TextField
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material'

/**
 * PessoaItem - Item individual de pessoa na lista
 * 
 * Props:
 * - pessoa: { id, nome, papel }
 * - onEdit: function(pessoaId, novoNome)
 * - onDelete: function(pessoaId)
 */
function PessoaItem({ pessoa, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(pessoa.nome)

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditText(pessoa.nome)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditText(pessoa.nome)
  }

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(pessoa.id, editText.trim())
      setIsEditing(false)
    } else {
      handleCancelEdit()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit()
    if (e.key === 'Escape') handleCancelEdit()
  }

  return (
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #eeeeee',
        p: '12px 16px',
        transition: 'background 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.02)'
        }
      }}
    >
      {/* Lado Esquerdo: Avatar + Nome + Papel */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            mr: 2,
            bgcolor: '#9c27b0'
          }} 
        >
          {pessoa.nome.charAt(0).toUpperCase()}
        </Avatar>

        {isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              size="small"
              variant="standard"
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={handleSaveEdit} color="success">
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCancelEdit} color="error">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <Chip
              label={pessoa.nome}
              size="small"
              sx={{
                bgcolor: '#9c27b0',
                color: 'white',
                fontWeight: 600,
                maxWidth: '150px'
              }}
            />
            <Chip
              label={pessoa.papel}
              size="small"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                fontWeight: 500
              }}
            />
          </Box>
        )}
      </Box>

      {/* Lado Direito: Botões de Ação */}
      {!isEditing && (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            onClick={handleStartEdit}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                color: 'primary.main'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(pessoa.id)}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                color: 'error.main'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </ListItem>
  )
}

export default PessoaItem