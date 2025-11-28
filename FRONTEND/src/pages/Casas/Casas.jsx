// src/pages/Casas/Casas.jsx

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Button, Paper, CircularProgress } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useLocation } from 'react-router-dom'
import { listarCasas, criarCasa, deletarCasa, listUsuariosByCasa, addMoradorToCasa } from '../../api/casas'
// Componentes
import AddCasaDialog from './components/AddCasaDialog'
import AddPessoaDialog from './components/AddPessoaDialog'
import CasaCard from './components/CasaCard'
import CasaDetails from './components/CasaDetails'

function Casas() {
  const theme = useTheme()
  const location = useLocation()
  
  // Estados
  const [casas, setCasas] = useState([])
  const [casaSelecionadaId, setCasaSelecionadaId] = useState(null)
  const [addPessoaDialogOpen, setAddPessoaDialogOpen] = useState(false)
  const [addCasaDialogOpen, setAddCasaDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const casaAtual = casas.find(c => c.id === casaSelecionadaId)

  // Carregar casas
  useEffect(() => {
    loadCasas()
  }, [])

  const loadCasas = async () => {
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      console.log('DEBUG loadCasas - user from localStorage:', user)
      console.log('DEBUG loadCasas - user?.idConta:', user?.idConta)
      const res = await listarCasas(user?.idConta)
      const casasBase = (res.data || []).map(c => ({ ...c, pessoas: [] }))
      
      // Carregar pessoas de cada casa
      const carregadas = await Promise.all(
        casasBase.map(async (c) => {
          try {
            const pessoas = await listUsuariosByCasa(c.id)
            const norm = (pessoas || [])
              .map(p => ({ id: p.idUsuario, nome: p.nome, papel: p.permissao || 'Membro' }))
              .filter(p => !!p.id)
              .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
            return { ...c, pessoas: norm }
          } catch {
            return c
          }
        })
      )
      
      setCasas(carregadas)

      // Selecionar casa
      const casaIdFromDashboard = location.state?.casaSelecionadaId
      if (casaIdFromDashboard && carregadas.some(c => c.id === casaIdFromDashboard)) {
        setCasaSelecionadaId(casaIdFromDashboard)
      } else if (carregadas.length > 0) {
        setCasaSelecionadaId(carregadas[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar casas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-selecionar primeira casa
  useEffect(() => {
    if (!casas.find(c => c.id === casaSelecionadaId) && casas.length > 0) {
      setCasaSelecionadaId(casas[0].id)
    } else if (casas.length === 0) {
      setCasaSelecionadaId(null)
    }
  }, [casas, casaSelecionadaId])

  // Handlers
  const handleAdicionarCasa = async (nome) => {
    if (!nome.trim()) return
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      console.log('DEBUG criarCasa - user from localStorage:', user)
      console.log('DEBUG criarCasa - user?.idConta:', user?.idConta)
      await criarCasa({ nome }, user?.idConta)
      setAddCasaDialogOpen(false)
      await loadCasas()
      
      // Notificar o Navbar que uma casa foi criada
      window.dispatchEvent(new CustomEvent('casaCreated'))
    } catch (error) {
      console.error('Erro ao criar casa:', error)
      alert('Erro ao criar casa. Tente novamente.')
    }
  }

  const handleDeletarCasa = async (casaId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta casa?")) return
    
    try {
      await deletarCasa(casaId)
      await loadCasas()
    } catch (error) {
      console.error('Erro ao deletar casa:', error)
      alert('Erro ao deletar casa.')
    }
  }

  const handleAdicionarPessoa = async (nome) => {
  if (!nome.trim()) return
  
  try {
    if (!casaAtual?.id) {
      alert('Selecione uma casa primeiro')
      return
    }

    // Gerar email temporário baseado no nome
    const emailTemp = `${nome.toLowerCase().replace(/\s+/g, '.')}@messaway.temp`
    
    console.log('🔧 Criando morador:', { nome, emailTemp, casaId: casaAtual.id })
    
    // Criar usuário REAL no banco + associar à casa
    const resultado = await addMoradorToCasa(casaAtual.id, {
      nome: nome.trim(),
      email: emailTemp,
      senha: '123456',
      permissao: 'Membro'
    })
    
    console.log('✅ Morador criado:', resultado)
    
    // Recarregar lista de casas e pessoas
    await loadCasas()
    setAddPessoaDialogOpen(false)
  } catch (error) {
    console.error('❌ Erro ao adicionar pessoa:', error)
    const msg = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao adicionar pessoa.'
    alert(msg)
  }
}

  const handleRemoverPessoa = async (pessoaId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      await deleteUsuarioFromConta(user.idConta, pessoaId)
      
      const novasCasas = casas.map(casa => {
        if (casa.id === casaSelecionadaId) {
          const pessoas = (casa.pessoas || []).filter(p => p.id !== pessoaId)
          return { ...casa, pessoas }
        }
        return casa
      })
      
      setCasas(novasCasas)
    } catch (error) {
      console.error('Erro ao remover pessoa:', error)
      alert('Erro ao remover pessoa.')
    }
  }

  const handleEditarCasaNome = (casaId, novoNome) => {
    setCasas(prev => prev.map(c => 
      c.id === casaId ? { ...c, nome: novoNome } : c
    ))
  }

  const handleEditarPessoaNome = (pessoaId, novoNome) => {
    setCasas(prev => prev.map(c => {
      if (c.id !== casaSelecionadaId) return c
      const pessoas = (c.pessoas || []).map(p => 
        p.id === pessoaId ? { ...p, nome: novoNome } : p
      )
      return { ...c, pessoas }
    }))
  }

  // Loading
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 80px)' 
      }}>
        <CircularProgress />
      </Box>
    )
  }

  // Estado vazio
  if (casas.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 80px)',
          py: 4,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h2" sx={{ mb: 1, fontSize: '4rem' }}>
              🏠
            </Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Nenhuma casa cadastrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Comece adicionando sua primeira casa
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setAddCasaDialogOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: theme.palette.gradients.heroPrimary,
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Adicionar Primeira Casa
            </Button>
          </Paper>
        </Container>

        <AddCasaDialog
          open={addCasaDialogOpen}
          onClose={() => setAddCasaDialogOpen(false)}
          onAdd={handleAdicionarCasa}
        />
      </Box>
    )
  }

  // Layout principal
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        py: 4,
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 1 
          }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: theme.palette.gradientText.heroPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Minhas Casas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddCasaDialogOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                background: theme.palette.gradients.heroPrimary,
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Nova Casa
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gerencie suas casas e as pessoas que moram nelas
          </Typography>
        </Box>

        {/* Layout 2 Colunas */}
        <Grid container spacing={3}>
          {/* Coluna Esquerda - Grid de Casas */}
          <Grid item xs={12} lg={5}>
            <Grid container spacing={2}>
              {casas.map((casa) => (
                <Grid item xs={12} sm={6} md={6} key={casa.id}>
                  <CasaCard
                    casa={casa}
                    isSelected={casa.id === casaSelecionadaId}
                    onClick={() => setCasaSelecionadaId(casa.id)}
                    onDelete={handleDeletarCasa}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Coluna Direita - Detalhes */}
          <Grid item xs={12} lg={7}>
            {casaAtual && (
              <CasaDetails
                casa={casaAtual}
                onEditCasaNome={handleEditarCasaNome}
                onEditPessoaNome={handleEditarPessoaNome}
                onDeletePessoa={handleRemoverPessoa}
                onAddPessoaClick={() => setAddPessoaDialogOpen(true)}
              />
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs */}
      <AddCasaDialog
        open={addCasaDialogOpen}
        onClose={() => setAddCasaDialogOpen(false)}
        onAdd={handleAdicionarCasa}
      />

      <AddPessoaDialog
        open={addPessoaDialogOpen}
        onClose={() => setAddPessoaDialogOpen(false)}
        onAdd={handleAdicionarPessoa}
        casaNome={casaAtual?.nome}
      />
    </Box>
  )
}

export default Casas