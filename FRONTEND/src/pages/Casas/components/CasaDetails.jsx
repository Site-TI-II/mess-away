// src/pages/Casas/components/CasaDetails.jsx

import { useState } from 'react'
import {
    Box,
    Paper,
    Avatar,
    Typography,
    IconButton,
    Chip,
    List,
    ListItemButton,
    Button,
    TextField,
    Divider
} from '@mui/material'
import {
    Edit as EditIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import PessoaItem from './PessoaItem'

/**
 * CasaDetails - Detalhes completos da casa selecionada
 * 
 * Props:
 * - casa: { id, nome, imagem, pessoas }
 * - onEditCasaNome: function(casaId, novoNome)
 * - onEditPessoaNome: function(pessoaId, novoNome)
 * - onDeletePessoa: function(pessoaId)
 * - onAddPessoaClick: function
 */
function CasaDetails({ casa, onEditCasaNome, onEditPessoaNome, onDeletePessoa, onAddPessoaClick }) {
    const theme = useTheme()
    const [isEditingCasa, setIsEditingCasa] = useState(false)
    const [editCasaText, setEditCasaText] = useState(casa.nome)

    const handleStartEditCasa = () => {
        setIsEditingCasa(true)
        setEditCasaText(casa.nome)
    }

    const handleCancelEditCasa = () => {
        setIsEditingCasa(false)
        setEditCasaText(casa.nome)
    }

    const handleSaveEditCasa = () => {
        if (editCasaText.trim()) {
            onEditCasaNome(casa.id, editCasaText.trim())
            setIsEditingCasa(false)
        } else {
            handleCancelEditCasa()
        }
    }

    const handleKeyDownCasa = (e) => {
        if (e.key === 'Enter') handleSaveEditCasa()
        if (e.key === 'Escape') handleCancelEditCasa()
    }

    // Linhas vazias para preencher até 8 pessoas
    const numeroDeLinhasVazias = Math.max(0, 8 - casa.pessoas.length)

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
            }}
        >
            {/* Header com Avatar e Nome */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}20 100%)`
                }}
            >
                <Avatar
                    src={casa.imagem}
                    alt={casa.nome}
                    sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        border: `4px solid white`,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}
                />

                {/* Nome da Casa (editável) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isEditingCasa ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                value={editCasaText}
                                onChange={(e) => setEditCasaText(e.target.value)}
                                onKeyDown={handleKeyDownCasa}
                                autoFocus
                                size="small"
                                variant="standard"
                                sx={{
                                    '& input': {
                                        textAlign: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />
                            <IconButton size="small" onClick={handleSaveEditCasa} color="success">
                                <CheckIcon />
                            </IconButton>
                            <IconButton size="small" onClick={handleCancelEditCasa} color="error">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <Chip
                                label={casa.nome}
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    height: 36,
                                    px: 1
                                }}
                            />
                            <IconButton size="small" onClick={handleStartEditCasa}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Box>

                {/* Contador de Pessoas */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {casa.pessoas.length} pessoa{casa.pessoas.length !== 1 ? 's' : ''} cadastrada{casa.pessoas.length !== 1 ? 's' : ''}
                </Typography>
            </Box>

            <Divider />

            {/* Lista de Pessoas */}
            <List sx={{ p: 0 }}>
                {casa.pessoas.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <PersonAddIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Nenhuma pessoa cadastrada
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Adicione pessoas para gerenciar esta casa
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={onAddPessoaClick}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)'
                            }}
                        >
                            Adicionar Primeira Pessoa
                        </Button>
                    </Box>
                ) : (
                    <>
                        {casa.pessoas.map((pessoa) => (
                            <PessoaItem
                                key={pessoa.id}
                                pessoa={pessoa}
                                onEdit={onEditPessoaNome}
                                onDelete={onDeletePessoa}
                            />
                        ))}

                        {/* Botão Adicionar Pessoa */}
                        <ListItemButton
                            onClick={onAddPessoaClick}
                            sx={{
                                borderTop: '1px solid #eeeeee',
                                p: '12px 16px',
                                bgcolor: 'rgba(156, 39, 176, 0.05)',
                                '&:hover': {
                                    bgcolor: 'rgba(156, 39, 176, 0.1)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#9c27b0' }}>
                                <PersonAddIcon sx={{ mr: 1.5 }} />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Adicionar Pessoa
                                </Typography>
                            </Box>
                        </ListItemButton>

                        {/* Linhas Vazias (design) */}
                        {Array.from({ length: numeroDeLinhasVazias }).map((_, index) => (
                            <Box
                                key={`empty-${index}`}
                                sx={{
                                    height: '48px',
                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                    borderTop: '1px solid #eeeeee'
                                }}
                            />
                        ))}
                    </>
                )}
            </List>
        </Paper>
    )
}

export default CasaDetails