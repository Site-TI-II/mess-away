import { Box, Typography, Container, Grid, Paper } from '@mui/material'
import { Home as HomeIcon, Schedule, Psychology, Star } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

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
        
        {/* Grid 4 colunas responsivo: mobile(1), tablet(2), desktop(4) */}
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {/* Persona 1 - Recém Mudados */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              height: { xs: 'auto', md: '240px' }, // Altura fixa no desktop
              minHeight: '220px',    // Altura mínima para consistência
              maxWidth: '280px',     // Largura máxima para não ficar muito largo
              mx: 'auto',           // Centraliza o card horizontalmente
              p: { xs: 2.5, md: 3 }, // Padding responsivo
              textAlign: 'center', 
              display: 'flex',       // Flexbox para centralização
              flexDirection: 'column',
              // Efeitos visuais modernos usando theme
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white,
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <HomeIcon sx={{ 
                fontSize: { xs: 40, md: 50 }, // Tamanho responsivo
                color: 'primary.main',  // Azul do tema
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 1,
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Recém Mudados
              </Typography>
              <Typography variant="body2" sx={{
                flexGrow: 1,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                Pessoas que recentemente se mudaram
              </Typography>
            </Paper>
          </Grid>

          {/* Persona 2 - Rotinas Agitadas */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              height: { xs: 'auto', md: '240px' }, // Altura fixa no desktop
              minHeight: '220px',    // Altura mínima para consistência
              maxWidth: '280px',     // Largura máxima para não ficar muito largo
              mx: 'auto',           // Centraliza o card horizontalmente
              p: { xs: 2.5, md: 3 }, 
              textAlign: 'center', 
              display: 'flex',
              flexDirection: 'column',
              // Efeitos visuais modernos usando theme
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white,
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <Schedule sx={{ 
                fontSize: { xs: 40, md: 50 }, 
                color: 'secondary.main',  // Roxo/rosa do tema
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 1,
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Rotinas Agitadas
              </Typography>
              <Typography variant="body2" sx={{
                flexGrow: 1,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                Pessoas com rotinas de trabalho e estudo
              </Typography>
            </Paper>
          </Grid>

          {/* Persona 3 - Gestão Doméstica */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              height: { xs: 'auto', md: '240px' }, // Altura fixa no desktop
              minHeight: '220px',    // Altura mínima para consistência
              maxWidth: '280px',     // Largura máxima para não ficar muito largo
              mx: 'auto',           // Centraliza o card horizontalmente
              p: { xs: 2.5, md: 3 }, 
              textAlign: 'center', 
              display: 'flex',
              flexDirection: 'column',
              // Efeitos visuais modernos usando theme
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white,
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <Psychology sx={{ 
                fontSize: { xs: 40, md: 50 }, 
                color: 'success.main',  // Verde do tema
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 1,
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Gestão Doméstica
              </Typography>
              <Typography variant="body2" sx={{
                flexGrow: 1,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                Indivíduos com dificuldade de gerenciamento
              </Typography>
            </Paper>
          </Grid>

          {/* Persona 4 - Para Todos */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ 
              height: { xs: 'auto', md: '240px' }, // Altura fixa no desktop
              minHeight: '220px',    // Altura mínima para consistência
              maxWidth: '280px',     // Largura máxima para não ficar muito largo
              mx: 'auto',           // Centraliza o card horizontalmente
              p: { xs: 2.5, md: 3 }, 
              textAlign: 'center', 
              display: 'flex',
              flexDirection: 'column',
              // Efeitos visuais modernos usando theme
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white,
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <Star sx={{ 
                fontSize: { xs: 40, md: 50 }, 
                color: 'warning.main',  // Laranja do tema
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 1,
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Para Todos
              </Typography>
              <Typography variant="body2" sx={{
                flexGrow: 1,
                fontSize: { xs: '0.875rem', md: '0.9rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                Universal e realista para múltiplas idades
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AudienceSection
