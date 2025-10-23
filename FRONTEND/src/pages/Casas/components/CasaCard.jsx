// src/pages/Casas/components/CasaCard.jsx

import { Box, Paper, Avatar, Typography, IconButton, Chip } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * CasaCard - Card individual de casa no grid
 * 
 * Props:
 * - casa: { id, nome, imagem, pessoas }
 * - isSelected: boolean
 * - onClick: function
 * - onDelete: function(casaId)
 */
function CasaCard({ casa, isSelected, onClick, onDelete }) {
  const theme = useTheme()

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Tem certeza que deseja deletar "${casa.nome}" e todas as pessoas nela?`)) {
      onDelete(casa.id)
    }
  }

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 2.5,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isSelected 
          ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: isSelected 
          ? `2px solid ${theme.palette.primary.main}` 
          : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isSelected 
          ? `0 4px 20px ${theme.palette.primary.main}30`
          : '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette.primary.main}40`
        }
      }}
    >
      {/* Botão Deletar */}
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            color: 'error.main'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Avatar da Casa */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Avatar
  src={casa.imagem} // Vai ser null, então mostra inicial
  alt={casa.nome}
  sx={{
    width: 80,
    height: 80,
    bgcolor: casa.cor || theme.palette.primary.main, // ✅ Usar cor personalizada
    fontSize: '2rem', // ✅ Tamanho da letra
    fontWeight: 'bold',
    border: isSelected ? `3px solid ${theme.palette.primary.main}` : 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }}
>
  {casa.nome.charAt(0).toUpperCase()} {/* ✅ Primeira letra */}
</Avatar>

        {/* Nome da Casa */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            color: isSelected ? 'primary.main' : 'text.primary'
          }}
        >
          {casa.nome}
        </Typography>

        {/* Contador de Pessoas */}
        <Chip
          label={`${casa.pessoas.length} pessoa${casa.pessoas.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: isSelected ? `${theme.palette.primary.main}20` : 'rgba(0, 0, 0, 0.08)',
            color: isSelected ? 'primary.main' : 'text.secondary',
            fontWeight: 600
          }}
        />
      </Box>
    </Paper>
  )
}

export default CasaCard