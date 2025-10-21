// src/pages/Tarefas/Tarefas.jsx

import { useState } from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import DailyTasksCard from './components/DailyTasksCard'
import StatisticsCard from './components/StatisticsCard'

/**
 * Tarefas - Sistema de gerenciamento de tarefas domésticas
 *
 * Funcionalidades:
 * - Adicionar tarefas com responsável e prazo
 * - Marcar tarefas como concluídas
 * - Filtro por prazo (Diárias)
 * - Estatísticas por responsável
 * - Design moderno com glass morphism
 */
function Tarefas() {
  const theme = useTheme()
  const [tarefa, setTarefa] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [prazo, setPrazo] = useState('')
  const [lista, setLista] = useState([])

  const adicionarTarefa = () => {
    if (tarefa.trim() && responsavel.trim() && prazo.trim()) {
      setLista([...lista, { tarefa, responsavel, prazo, concluida: false }])
      setTarefa('')
      setResponsavel('')
      setPrazo('')
    }
  }

  const removerTarefa = (index) => {
    setLista(lista.filter((_, i) => i !== index))
  }

  const marcarComoConcluida = (index) => {
    const novaLista = [...lista]
    novaLista[index].concluida = true
    setLista(novaLista)
  }

  // src/pages/Tarefas/Tarefas.jsx

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
            Organize e acompanhe suas tarefas domésticas
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
        />

        {/* Layout Principal - CSS GRID (Mais Confiável) */}
        <Box
          sx={{
            display: 'grid',          // ✅ Usando CSS Grid aqui em vez de MUI Grid
            gridTemplateColumns: { 
              xs: '1fr',              // Mobile: 1 coluna
              md: '2fr 1fr'           // Desktop: 2:1 (66% + 33%)
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
              onDelete={removerTarefa}
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