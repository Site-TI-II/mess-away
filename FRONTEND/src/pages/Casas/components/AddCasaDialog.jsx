// src/pages/Casas/components/AddCasaDialog.jsx

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
import { Home as HomeIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * AddCasaDialog - Dialog para adicionar nova casa
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - onAdd: function(nomeCasa)
 */
function AddCasaDialog({ open, onClose, onAdd }) {
  const theme = useTheme()
  const [nomeCasa, setNomeCasa] = useState('')

  const handleAdd = () => {
    if (nomeCasa.trim()) {
      onAdd(nomeCasa)
      setNomeCasa('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') onClose()
  }

  const handleClose = () => {
    setNomeCasa('')
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
              background: theme.palette.gradients.heroPrimary
            }}
          >
            <HomeIcon sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Adicionar Nova Casa
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Casa"
          type="text"
          fullWidth
          variant="outlined"
          value={nomeCasa}
          onChange={(e) => setNomeCasa(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Casa Principal, Casa de Praia..."
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
          disabled={!nomeCasa.trim()}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            background: theme.palette.gradients.heroPrimary,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
            }
          }}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCasaDialog