// src/pages/Tarefas/Tarefas.jsx

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import DailyTasksCard from './components/DailyTasksCard'
import StatisticsCard from './components/StatisticsCard'

// API imports
import { listarTarefas, criarTarefa, concluirTarefa, removerTarefa } from '../../api/tarefas'
import { listarComodos, listarCategorias } from '../../api/comodos'
import { listUsuariosByCasa, listarCasas } from '../../api/casas'

/**
 * Tarefas - Sistema de gerenciamento de tarefas domésticas
 *
 * Funcionalidades:
 * - Adicionar tarefas com responsável, prazo, cômodo e categoria
 * - Marcar tarefas como concluídas
 * - Filtro por prazo (Diárias)
 * - Estatísticas por responsável
 * - Design moderno com glass morphism
 * - Integração completa com backend e database
 */
function Tarefas() {
  const theme = useTheme()
  
  // Estado do formulário
  const [tarefa, setTarefa] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [prazo, setPrazo] = useState('')
  // (sem inputs de cômodo e categoria na UI — usaremos defaults)
  
  // Dados da API
  const [lista, setLista] = useState([])
  const [pessoas, setPessoas] = useState([])
  const [comodos, setComodos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [casaAtual, setCasaAtual] = useState(null)
  
  // Estado de carregamento e erros
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

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
      const casas = casasResponse?.data || []
      if (!casas.length) {
        setError('Nenhuma casa encontrada. Cadastre uma casa primeiro.')
        return
      }
      const casa = casas[0]
      setCasaAtual(casa)

      // 3) Dados da casa em paralelo com tolerância a falhas
      const results = await Promise.allSettled([
        listarTarefas(casa.id),
        listUsuariosByCasa(casa.id),
        listarComodos(casa.id),
        listarCategorias()
      ])

      const [rTarefas, rPessoas, rComodos, rCategorias] = results

      if (rTarefas.status === 'fulfilled') setLista(rTarefas.value)
      else {
        console.warn('Falha ao carregar tarefas:', rTarefas.reason)
        setLista([])
      }

      if (rPessoas.status === 'fulfilled') setPessoas(rPessoas.value)
      else {
        console.warn('Falha ao carregar usuários da casa:', rPessoas.reason)
        setPessoas([])
      }

      if (rComodos.status === 'fulfilled') setComodos(rComodos.value)
      else {
        console.warn('Falha ao carregar cômodos:', rComodos.reason)
        setComodos([])
      }

      if (rCategorias.status === 'fulfilled') setCategorias(rCategorias.value)
      else {
        console.warn('Falha ao carregar categorias:', rCategorias.reason)
        setCategorias([])
      }

      // Se tudo falhar, mostre erro geral
      if (
        rTarefas.status === 'rejected' &&
        rPessoas.status === 'rejected' &&
        rComodos.status === 'rejected' &&
        rCategorias.status === 'rejected'
      ) {
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
    if (!tarefa.trim() || !responsavel || !prazo) return

    // Seleciona defaults: primeiro cômodo e primeira categoria carregados
    const defaultComodoId = comodos?.[0]?.idComodo
    const defaultCategoriaId = categorias?.[0]?.idCategoria
    if (!defaultComodoId || !defaultCategoriaId) {
      setError('Configure ao menos um cômodo e uma categoria para a casa antes de criar tarefas.')
      return
    }

    try {
      const novaTarefa = {
        nome: tarefa,
        descricao: '',
        idComodo: defaultComodoId,
        idUsuario: responsavel,
        idCategoria: defaultCategoriaId,
        dataEstimada: prazo, // formato ISO string
        frequencia: 1
      }

      await criarTarefa(novaTarefa)
      
      // Recarregar lista de tarefas
      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      setLista(tarefasAtualizadas)

      // Limpar formulário
      setTarefa('')
      setResponsavel('')
      setPrazo('')

    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err)
      setError('Erro ao adicionar tarefa. Tente novamente.')
    }
  }

  const removerTarefaHandler = async (idTarefa) => {
    try {
      await removerTarefa(idTarefa)
      
      // Atualizar lista
      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      setLista(tarefasAtualizadas)
    } catch (err) {
      console.error('Erro ao remover tarefa:', err)
      setError('Erro ao remover tarefa. Tente novamente.')
    }
  }

  const marcarComoConcluida = async (idTarefa) => {
    try {
      await concluirTarefa(idTarefa)
      
      // Atualizar lista
      const tarefasAtualizadas = await listarTarefas(casaAtual.id)
      setLista(tarefasAtualizadas)
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              background: theme.palette.gradientText.heroPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Gerenciador de Tarefas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {casaAtual ? `Casa: ${casaAtual.nome}` : 'Organize e acompanhe suas tarefas domésticas'}
          </Typography>
        </Box>

        {/* Formulário */}
        <TaskForm
          tarefa={tarefa}
          setTarefa={setTarefa}
          responsavel={responsavel}
          setResponsavel={setResponsavel}
          prazo={prazo}
          setPrazo={setPrazo}
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