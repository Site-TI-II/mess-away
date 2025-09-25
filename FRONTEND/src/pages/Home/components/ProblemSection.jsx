import { Box, Typography, Container, Grid } from '@mui/material'
import { Schedule, TrendingUp, WarningAmber } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { SectionCard } from '../../../components/common/Card'

/**
 * ProblemSection - Seção que apresenta os problemas que o app resolve
 * 
 * Funcionalidades:
 * - 3 cards explicando dores dos usuários
 * - Layout responsivo em grid
 * - Ícones temáticos com cores diferenciadas
 * - Fundo cinza claro para contraste
 */
function ProblemSection() {
  const theme = useTheme()
  
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 },  // Padding vertical responsivo
      // Usando gradiente do theme
      background: theme.palette.gradients.problemSection,
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        {/* Título da seção */}
        <Typography 
          variant="h3" 
          component="h2"        // H2 semântico
          textAlign="center" 
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            // Gradiente no texto para harmonizar com o design
            background: theme.palette.gradientText.heroPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          O Problema que Resolvemos
        </Typography>
        
        {/* Grid de 3 cards responsivo com alinhamento horizontal */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
          {/* Card 1 - Dificuldade de Organização */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={Schedule}
              title="Dificuldade de Organização"
              description="Dificuldade em organizar e gerenciar tarefas cotidianas de forma eficiente"
              iconColor="primary.main"
              variant="problem"
            />
          </Grid>

          {/* Card 2 - Rotinas Agitadas */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={TrendingUp}
              title="Rotinas Agitadas"
              description="No meio de trabalho e estudo, as tarefas de casa são negligenciadas e se tornam maiores"
              iconColor="warning.main"
              variant="problem"
            />
          </Grid>

          {/* Card 3 - Esquecimentos */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={WarningAmber}
              title="Esquecimentos"
              description="Não lembrar onde colocou algo ou de fazer algo importante causa estresse"
              iconColor="error.main"
              variant="problem"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ProblemSection
