import { Box, Typography, Container, Grid } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { SectionCard } from '../../../components/common/Card'

/**
 * BenefitsSection - Seção destacada apresentando os benefícios do Mess Away
 * 
 * Funcionalidades:
 * - Cards com design profissional e glass morphism
 * - 4 benefícios organizados em grid responsivo
 * - Gradiente temático para harmonia visual
 * - Ícones de check com cores do theme
 */
function BenefitsSection() {
  const theme = useTheme()
  
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 },
      // Usando gradiente do theme
      background: theme.palette.gradients.testimonialsSection,
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            // Gradiente no texto para harmonizar com o design
            background: theme.palette.gradientText.heroPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Como o Mess Away Ajuda
        </Typography>
        
        {/* Subtítulo explicativo */}
        <Typography 
          variant="h6" 
          textAlign="center" 
          sx={{ 
            mb: 6, 
            opacity: 0.8,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Benefícios práticos que transformarão sua rotina doméstica
        </Typography>
        
        {/* Grid 4 cards responsivo - todos lado a lado no desktop */}
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {/* Benefício 1 - Organização */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={CheckCircle}
              title="Organização Facilitada"
              description="Facilita e organiza a casa e os objetivos dos ambientes de forma intuitiva e eficiente"
              iconColor="secondary.main"
              variant="benefits"
            />
          </Grid>

          {/* Benefício 2 - Simplicidade */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={CheckCircle}
              title="Tarefas Descomplicadas"
              description="Transforma tarefas trabalhosas em algo descomplicado e gerenciável"
              iconColor="primary.main"
              variant="benefits"
            />
          </Grid>

          {/* Benefício 3 - Produtividade */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={CheckCircle}
              title="Convivência Melhorada"
              description="Melhora a convivência familiar e aumenta a produtividade de todos"
              iconColor="success.main"
              variant="benefits"
            />
          </Grid>

          {/* Benefício 4 - Economia */}
          <Grid item xs={12} sm={6} md={3}>
            <SectionCard 
              icon={CheckCircle}
              title="Benefícios Financeiros"
              description="Auxilia no aspecto financeiro através de melhor organização e controle"
              iconColor="warning.main"
              variant="benefits"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default BenefitsSection
