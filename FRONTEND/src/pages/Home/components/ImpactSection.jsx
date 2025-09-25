import { Box, Typography, Container, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { SectionCard } from '../../../components/common/Card'

// Componentes de ícone customizados para os ODS
const ODS3Icon = ({ sx }) => (
  <Box
    component="img"
    src="https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-3.svg"
    alt="ODS 3 - Saúde e Bem-estar"
    sx={{
      width: sx?.fontSize || { xs: 50, md: 60 },
      height: sx?.fontSize || { xs: 50, md: 60 },
      mb: sx?.mb || 0,
      ...sx
    }}
  />
)

const ODS5Icon = ({ sx }) => (
  <Box
    component="img"
    src="https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-5.svg"
    alt="ODS 5 - Igualdade de Gênero"
    sx={{
      width: sx?.fontSize || { xs: 50, md: 60 },
      height: sx?.fontSize || { xs: 50, md: 60 },
      mb: sx?.mb || 0,
      ...sx
    }}
  />
)

const ODS8Icon = ({ sx }) => (
  <Box
    component="img"
    src="https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-8.svg"
    alt="ODS 8 - Trabalho Decente e Crescimento Econômico"
    sx={{
      width: sx?.fontSize || { xs: 50, md: 60 },
      height: sx?.fontSize || { xs: 50, md: 60 },
      mb: sx?.mb || 0,
      ...sx
    }}
  />
)

/**
 * ImpactSection - Seção mostrando os Objetivos de Desenvolvimento Sustentável (ODS)
 * 
 * Funcionalidades:
 * - 3 ODS com ícones SVG oficiais da ONU
 * - Grid responsivo seguindo padrão do ProblemSection
 * - Gradiente temático para harmonia visual
 * - Cards profissionais com glass morphism
 */
function ImpactSection() {
  const theme = useTheme()
  
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 },
      // Usando gradiente do theme para consistência visual
      background: theme.palette.gradients.testimonialsSection,
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        {/* Título da seção */}
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
          Objetivos de Desenvolvimento Sustentável
        </Typography>
        
        {/* Grid de 3 cards responsivo com alinhamento horizontal */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
          {/* ODS 3 - Saúde e Bem-estar */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={ODS3Icon}
              title="Saúde e Bem-estar"
              description="A organização reduz o estresse e ansiedade causados pela desordem doméstica, melhorando a saúde mental através de um ambiente mais organizado e controlável"
              iconColor="transparent" // Não precisa de cor pois é uma imagem
              variant="problem"
            />
          </Grid>

          {/* ODS 5 - Igualdade de Gênero */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={ODS5Icon}
              title="Igualdade de Gênero"
              description="Facilita a distribuição equitativa das tarefas domésticas, reduzindo a carga mental que tradicionalmente recai sobre as mulheres"
              iconColor="transparent"
              variant="problem"
            />
          </Grid>

          {/* ODS 8 - Trabalho Decente e Crescimento Econômico */}
          <Grid item xs={12} sm={6} md={4}>
            <SectionCard 
              icon={ODS8Icon}
              title="Trabalho Decente e Crescimento Econômico"
              description="Otimiza tempo que pode ser realocado para atividades produtivas, aumentando a produtividade pessoal e profissional"
              iconColor="transparent"
              variant="problem"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ImpactSection
