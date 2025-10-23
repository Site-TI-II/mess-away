// src/pages/Casas/components/AddPessoaDialog.jsx

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * AddPessoaDialog - Dialog para adicionar nova pessoa
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - onAdd: function(nomePessoa)
 * - casaNome: string (nome da casa atual)
 */
function AddPessoaDialog({ open, onClose, onAdd, casaNome }) {
  const theme = useTheme()
  const [nomePessoa, setNomePessoa] = useState('')

  const handleAdd = () => {
    if (nomePessoa.trim()) {
      onAdd(nomePessoa)
      setNomePessoa('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') onClose()
  }

  const handleClose = () => {
    setNomePessoa('')
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)'
            }}
          >
            <PersonAddIcon sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Adicionar Pessoa
            </Typography>
            {casaNome && (
              <Typography variant="caption" color="text.secondary">
                Em: {casaNome}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Pessoa"
          type="text"
          fullWidth
          variant="outlined"
          value={nomePessoa}
          onChange={(e) => setNomePessoa(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: João Silva, Maria..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleAdd}
          variant="contained"
          disabled={!nomePessoa.trim()}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)'
            }
          }}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPessoaDialog