import { Box, Typography, Container, Grid } from '@mui/material'
import { Home as HomeIcon, Schedule, Psychology, Star } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { SectionCard } from '../../../components/common/Card'

/**
 * AudienceSection - Seção apresentando as personas/target audience
 * 
 * Funcionalidades:
 * - 4 personas bem definidas
 * - Layout responsivo: mobile(1), tablet(2), desktop(4)
 * - Ícones representativos com cores variadas
 * - Papers elegantes para cada persona
 */
function AudienceSection() {
  const theme = useTheme()
  
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 },
      // Usando gradiente do theme para dar consistência visual
      background: theme.palette.gradients.problemSecundarySection,
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
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
          Nosso Público
        </Typography>
        
        {/* Grid 4 cards responsivo com alinhamento horizontal */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
          {/* Persona 1 - Recém Mudados */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={HomeIcon}
              title="Recém Mudados"
              description="Pessoas que recentemente se mudaram"
              iconColor="primary.main"
              variant="audience"
            />
          </Grid>

          {/* Persona 2 - Rotinas Agitadas */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={Schedule}
              title="Rotinas Agitadas"
              description="Pessoas com rotinas de trabalho e estudo"
              iconColor="secondary.main"
              variant="audience"
            />
          </Grid>

          {/* Persona 3 - Gestão Doméstica */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={Psychology}
              title="Gestão Doméstica"
              description="Indivíduos com dificuldade de gerenciamento"
              iconColor="success.main"
              variant="audience"
            />
          </Grid>

          {/* Persona 4 - Para Todos */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={Star}
              title="Para Todos"
              description="Universal e realista para múltiplas idades"
              iconColor="warning.main"
              variant="audience"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AudienceSection
