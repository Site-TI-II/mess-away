// src/pages/Dashboard/Dashboard.jsx

import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import CasasSection from './components/CasasSection'
import AlertsSection from './components/AlertsSection'
import QuickActionsSection from './components/QuickActionsSection'
import MotivationalSection from './components/MotivationalSection'
import AchievementsSection from './components/AchievementsSection'
import { listarCasas } from '../../api/casas'
import { getCasaAchievements } from '../../api/achievements'

/**
 * Dashboard - Página principal do sistema
 * 
 * Estrutura:
 * 1. QuickActionsSection - Ações rápidas (botões grandes)
 * 2. CasasSection - Cards de casas (full-width)
 * 3. Grid Layout (1:3 + 2:3):
 *    - AlertsSection (4 cols - 1/3) - Lista de alertas
 *    - MotivationalSection (8 cols - 2/3) - Progresso semanal
 * 4. AchievementsSection - Conquistas da casa
 */
function Dashboard() {
  const theme = useTheme()
  const navigate = useNavigate()

  // Estados para dados (preparado para integração com API)
  const [casas, setCasas] = useState([])
  const [alerts, setAlerts] = useState([])
  const [weeklyData, setWeeklyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [casaAtualId, setCasaAtualId] = useState(null)

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

      // Carregar casas do usuário (via USUARIO_CASA ou idConta se existir)
      let casasData = []
      
      if (user.idConta) {
        try {
          const casasResponse = await listarCasas(user.idConta)
          casasData = casasResponse?.data || []
        } catch (e) {
          console.warn('Erro ao listar por conta:', e)
        }
      }
      
      // Fallback: listar casas por usuário
      if (!casasData.length && user.id) {
        try {
          const response = await fetch(`http://localhost:4567/api/usuarios/${user.id}/casas`)
          casasData = await response.json()
        } catch (e) {
          console.error('Erro ao listar casas por usuário:', e)
        }
      }

      if (casasData.length) {
        // Carregar tarefas reais para cada casa
        const casasComTarefas = await Promise.all(casasData.map(async (casa) => {
          try {
            const tarefasResponse = await fetch(`http://localhost:4567/api/casas/${casa.id}/tarefas`)
            const tarefas = await tarefasResponse.json()
            
            const tarefasConcluidas = tarefas.filter(t => t.concluida === true).length
            const tarefasPendentes = tarefas.filter(t => t.concluida === false).length
            const totalTarefas = tarefas.length
            
            return {
              id: casa.id,
              nome: casa.nome,
              imagem: casa.imagem,
              tarefasPendentes,
              tarefasConcluidas,
              totalTarefas,
              pontos: casa.pontos || 0
            }
          } catch (e) {
            console.error(`Erro ao carregar tarefas da casa ${casa.nome}:`, e)
            return {
              id: casa.id,
              nome: casa.nome,
              imagem: casa.imagem,
              tarefasPendentes: 0,
              tarefasConcluidas: 0,
              totalTarefas: 0,
              pontos: casa.pontos || 0
            }
          }
        }))

        setCasas(casasComTarefas)

        // Carregar points, achievements, alertas e stats da primeira casa
        if (casasData.length > 0) {
          const currentCasa = casasData[0]
          setCasaAtualId(currentCasa.id)
          setTotalPoints(currentCasa.pontos || 0)
          
          // Carregar achievements da casa
          try {
            const achievementsResponse = await getCasaAchievements(currentCasa.id)
            if (Array.isArray(achievementsResponse?.data)) {
              setAchievements(achievementsResponse.data)
            } else if (Array.isArray(achievementsResponse)) {
              setAchievements(achievementsResponse)
            } else {
              setAchievements([])
            }
          } catch (achieveError) {
            console.error('Erro ao carregar conquistas da casa:', achieveError)
            setAchievements([])
          }

          // Carregar alertas da casa
          try {
            const alertsResponse = await fetch(`http://localhost:4567/api/casas/${currentCasa.id}/alertas`)
            if (alertsResponse.ok) {
              const alertsData = await alertsResponse.json()
              setAlerts(Array.isArray(alertsData) ? alertsData : [])
            }
          } catch (alertError) {
            console.error('Erro ao carregar alertas:', alertError)
          }

          // Carregar estatísticas semanais
          try {
            const statsResponse = await fetch(`http://localhost:4567/api/casas/${currentCasa.id}/stats/weekly`)
            if (statsResponse.ok) {
              const statsData = await statsResponse.json()
              setWeeklyData(statsData)
            }
          } catch (statsError) {
            console.error('Erro ao carregar estatísticas semanais:', statsError)
          }
        }
      }
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

        {/* 1. Ações Rápidas */}
        <QuickActionsSection />

        {/* 2. Casas Section (full-width) */}
        <CasasSection casas={casas} />

        {/* 3. Grid: Alertas (1/3) + Progresso Semanal (2/3) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Alertas - 4 colunas (1/3) */}
          <Grid item xs={12} md={4}>
            <AlertsSection alerts={alerts} />
          </Grid>

          {/* Progresso Semanal - 8 colunas (2/3) */}
          <Grid item xs={12} md={8}>
            <MotivationalSection weeklyData={weeklyData} />
          </Grid>
        </Grid>

        {/* 4. Achievements Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AchievementsSection 
              achievements={achievements} 
              totalPoints={totalPoints}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard