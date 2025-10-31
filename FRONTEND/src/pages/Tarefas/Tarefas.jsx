// src/pages/Tarefas/Tarefas.jsx

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Alert, CircularProgress, Select, MenuItem, FormControl } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import DailyTasksCard from './components/DailyTasksCard'
import StatisticsCard from './components/StatisticsCard'

// API imports
import { listarTarefas, criarTarefa, concluirTarefa, removerTarefa } from '../../api/tarefas'
import { listUsuariosByCasa, listarCasas, addUsuarioToCasa } from '../../api/casas'

/**
 * Tarefas - Sistema de gerenciamento de tarefas domésticas
 */
function Tarefas() {
  const theme = useTheme()

  // Estado do formulário
  const [tarefa, setTarefa] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [prazo, setPrazo] = useState('')
  const [diaria, setDiaria] = useState(false)

  // Dados da API
  const [lista, setLista] = useState([])
  const [pessoas, setPessoas] = useState([])
  const [casaAtual, setCasaAtual] = useState(null)
  const [casas, setCasas] = useState([])

  // Estado de carregamento e erros
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  const handleCasaChange = async (idCasa) => {
    const novaCasa = casas.find(c => c.id === idCasa)
    if (!novaCasa) return
    
    setCasaAtual(novaCasa)
    setLoading(true)
    
    try {
      // Recarregar dados da nova casa
      const [tarefasResponse, pessoasResponse] = await Promise.allSettled([
        listarTarefas(novaCasa.id),
        listUsuariosByCasa(novaCasa.id)
      ])
      
      if (tarefasResponse.status === 'fulfilled') {
        const tarefasData = tarefasResponse.value?.data || tarefasResponse.value || []
        setLista(Array.isArray(tarefasData) ? tarefasData : [])
      }
      
      if (pessoasResponse.status === 'fulfilled') {
        let pessoasVal = pessoasResponse.value || []
        if (Array.isArray(pessoasVal)) {
          const seen = new Set()
          pessoasVal = pessoasVal.filter(p => {
            const id = p?.idUsuario
            if (!id) return false
            if (seen.has(id)) return false
            seen.add(id)
            return true
          })
          pessoasVal.sort((a, b) => (a?.nome || '').localeCompare(b?.nome || ''))
        }
        setPessoas(pessoasVal)
      }
    } catch (err) {
      console.error('Erro ao trocar de casa:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1) Usuário e conta
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        setError('Usuário não encontrado. Faça login novamente.')
        return
      }
      const idConta = user.idConta
      if (!idConta) {
        setError('Conta não encontrada para este usuário.')
        return
      }

      // 2) Casas
      const casasResponse = await listarCasas(idConta)
      const casasData = casasResponse?.data || []
      if (!casasData.length) {
        setError('Nenhuma casa encontrada. Cadastre uma casa primeiro.')
        return
      }
      setCasas(casasData)
      const casa = casasData[0]
      setCasaAtual(casa)

      // 3) Dados da casa em paralelo
      let results = await Promise.allSettled([
        listarTarefas(casa.id),
        listUsuariosByCasa(casa.id)
      ])

      const [rTarefas, rPessoas] = results

      if (rTarefas.status === 'fulfilled') {
        const tarefasData = rTarefas.value?.data || rTarefas.value || []
        setLista(Array.isArray(tarefasData) ? tarefasData : [])
      } else {
        console.warn('Falha ao carregar tarefas:', rTarefas.reason)
        setLista([])
      }

      if (rPessoas.status === 'fulfilled') {
        let pessoasVal = rPessoas.value || []

        // Dedupe por idUsuario
        if (Array.isArray(pessoasVal)) {
          const seen = new Set()
          pessoasVal = pessoasVal.filter(p => {
            const id = p?.idUsuario
            if (!id) return false
            if (seen.has(id)) return false
            seen.add(id)
            return true
          })
          pessoasVal.sort((a, b) => (a?.nome || '').localeCompare(b?.nome || ''))
        }

        // Se não houver pessoas, associar usuário atual
        if (pessoasVal.length === 0) {
          const idUsuarioAtual = user.idUsuario || user.id || user.id_usuario
          if (idUsuarioAtual) {
            try {
              await addUsuarioToCasa(casa.id, { idUsuario: idUsuarioAtual, permissao: 'Membro' })
              pessoasVal = await listUsuariosByCasa(casa.id)
              if (Array.isArray(pessoasVal)) {
                const seen2 = new Set()
                pessoasVal = pessoasVal.filter(p => {
                  const id = p?.idUsuario
                  if (!id) return false
                  if (seen2.has(id)) return false
                  seen2.add(id)
                  return true
                })
                pessoasVal.sort((a, b) => (a?.nome || '').localeCompare(b?.nome || ''))
              }
            } catch (e) {
              console.warn('Não foi possível associar o usuário atual à casa:', e)
            }
          }
        }
        setPessoas(pessoasVal)
      } else {
        console.warn('Falha ao carregar usuários da casa:', rPessoas.reason)
        setPessoas([])
      }

      if (rTarefas.status === 'rejected' && rPessoas.status === 'rejected') {
        setError('Erro ao carregar dados. Verifique se o servidor backend está em execução.')
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const adicionarTarefa = async () => {
    if (!tarefa.trim() || !responsavel || !prazo) {
      console.warn('⚠️ Campos obrigatórios não preenchidos')
      return
    }

    if (!casaAtual?.id) {
      console.error('❌ Casa atual não está definida!')
      setError('Erro: Casa não encontrada. Recarregue a página.')
      return
    }

    try {
      const novaTarefa = {
        nome: tarefa,
        descricao: '',
        idUsuario: responsavel,
        idCasa: casaAtual.id,
        dataEstimada: prazo,
        frequencia: diaria ? 1 : 0
      }

      await criarTarefa(novaTarefa)

      // Recarregar lista de tarefas
      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      const tarefasData = tarefasAtualizadas?.data || tarefasAtualizadas || []
      setLista(Array.isArray(tarefasData) ? tarefasData : [])

      // Limpar formulário
      setTarefa('')
      setResponsavel('')
      setPrazo('')
      setDiaria(false)

    } catch (err) {
      console.error('❌ Erro ao adicionar tarefa:', err)
      setError('Erro ao adicionar tarefa. Tente novamente.')
    }
  }

  const removerTarefaHandler = async (idTarefa) => {
    try {
      await removerTarefa(casaAtual.id, idTarefa)

      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      const tarefasData = tarefasAtualizadas?.data || tarefasAtualizadas || []
      setLista(Array.isArray(tarefasData) ? tarefasData : [])
    } catch (err) {
      console.error('Erro ao remover tarefa:', err)
      setError('Erro ao remover tarefa. Tente novamente.')
    }
  }

  const marcarComoConcluida = async (idTarefa) => {
    try {
      await concluirTarefa(casaAtual.id, idTarefa)

      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      const tarefasData = tarefasAtualizadas?.data || tarefasAtualizadas || []
      setLista(Array.isArray(tarefasData) ? tarefasData : [])
    } catch (err) {
      console.error('Erro ao concluir tarefa:', err)
      setError('Erro ao concluir tarefa. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        py: 4,
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textAlign: 'center',
              background: theme.palette.gradientText.heroPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Gerenciador de Tarefas
          </Typography>

          {/* Seletor de Casa */}
          {casas.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Casa:
              </Typography>
              <FormControl sx={{ minWidth: 250 }}>
                <Select
                  value={casaAtual?.id || ''}
                  onChange={(e) => handleCasaChange(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.dark
                    }
                  }}
                >
                  {casas.map((casa) => (
                    <MenuItem key={casa.id} value={casa.id}>
                      🏠 {casa.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Formulário */}
        <TaskForm
          tarefa={tarefa}
          setTarefa={setTarefa}
          responsavel={responsavel}
          setResponsavel={setResponsavel}
          prazo={prazo}
          setPrazo={setPrazo}
          diaria={diaria}
          setDiaria={setDiaria}
          onAdd={adicionarTarefa}
          pessoas={pessoas}
        />

        {/* Layout Principal */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr'
            },
            gap: 3,
            width: '100%',
            alignItems: 'start'
          }}
        >
          {/* Coluna Esquerda - Lista Completa */}
          <Box>
            <TaskList
              lista={lista}
              onComplete={marcarComoConcluida}
              onDelete={removerTarefaHandler}
            />
          </Box>

          {/* Coluna Direita - Cards Laterais */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DailyTasksCard lista={lista} onComplete={marcarComoConcluida} />
            <StatisticsCard lista={lista} />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Tarefas