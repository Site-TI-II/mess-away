// src/pages/Dashboard/Dashboard.jsx

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import InsightBanner from './components/InsightBanner'
import CasasSection from './components/CasasSection'
import AlertsSection from './components/AlertsSection'
import QuickActionsSection from './components/QuickActionsSection'
import MotivationalSection from './components/MotivationalSection'
import { listarCasas } from '../../api/casas'

/**
 * Dashboard - Página principal do sistema
 * 
 * Estrutura REORGANIZADA:
 * 1. InsightBanner - Banner destacado com insight do dia
 * 2. QuickActionsSection - Ações rápidas (botões grandes)
 * 3. CasasSection - Cards de casas (full-width)
 * 4. Grid Layout (1:3 + 2:3):
 *    - AlertsSection (4 cols - 1/3) - Lista de alertas
 *    - MotivationalSection (8 cols - 2/3) - Progresso semanal
 */
function Dashboard() {
  const theme = useTheme()
  const navigate = useNavigate()

  // Estados para dados (preparado para integração com API)
  const [casas, setCasas] = useState([])
  const [alerts, setAlerts] = useState([])
  const [weeklyData, setWeeklyData] = useState(null)
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)

  // Simular carregamento de dados (substituir por chamada à API)
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      // Buscar usuário logado
      const userJson = localStorage.getItem('user')
      if (!userJson) {
        navigate('/login')
        return
      }

      const user = JSON.parse(userJson)
      const idConta = user?.idConta

      if (!idConta) {
        console.warn('Conta não encontrada no usuário')
        setLoading(false)
        return
      }

      // Carregar casas reais do banco
      const casasResponse = await listarCasas(idConta)
      const casasComTarefas = casasResponse.data.map(casa => ({
        id: casa.id,
        nome: casa.nome,
        imagem: casa.imagem,
        // Simular contagem de tarefas (depois pode vir do backend)
        tarefasPendentes: Math.floor(Math.random() * 15),
        tarefasConcluidas: Math.floor(Math.random() * 20) + 10,
        totalTarefas: 30
      }))

      setCasas(casasComTarefas)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        py: 4,
        background: `linear-gradient(180deg, 
          ${theme.palette.grey[50]} 0%, 
          ${theme.palette.grey[100]} 100%
        )`
      }}
    >
      <Container maxWidth="lg">
        {/* Header do Dashboard */}
        <Box sx={{ mb: 4 }}>
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
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visão geral das suas tarefas e casas
          </Typography>
        </Box>

        {/* 1. Insight Banner (destaque máximo) */}
        <InsightBanner insight={insight} />

        {/* 2. Ações Rápidas (destaque alto) */}
        <QuickActionsSection />

        {/* 3. Casas Section (full-width) */}
        <CasasSection casas={casas} />

        {/* 4. Grid REORGANIZADO: Alertas (1/3) + Progresso Semanal (2/3) */}
        <Grid container spacing={3}>
          {/* Alertas - 4 colunas (1/3) */}
          <Grid item xs={12} md={4}>
            <AlertsSection alerts={alerts} />
          </Grid>

          {/* Progresso Semanal - 8 colunas (2/3) */}
          <Grid item xs={12} md={8}>
            <MotivationalSection weeklyData={weeklyData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard