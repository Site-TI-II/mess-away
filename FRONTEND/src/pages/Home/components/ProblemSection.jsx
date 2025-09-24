import { Box, Typography, Container, Grid, Card } from '@mui/material'
import { Schedule, TrendingUp, WarningAmber } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

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
            <Card sx={{ 
              height: { xs: 'auto', md: '320px' }, // Altura fixa no desktop
              minHeight: '280px',   // Altura mínima para consistência
              maxWidth: '350px',    // Largura máxima para não ficar muito largo
              mx: 'auto',          // Centraliza o card horizontalmente
              display: 'flex',     
              flexDirection: 'column', 
              textAlign: 'center', 
              p: { xs: 2.5, md: 3 }, // Padding responsivo
              // Efeitos visuais modernos
              borderRadius: 3,     
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', 
              bgcolor: theme.palette.glass.white, // Usando glass do theme
              backdropFilter: 'blur(10px)', 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)', 
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              {/* Ícone com cor primária (azul) */}
              <Schedule sx={{ 
                fontSize: { xs: 50, md: 60 }, // Tamanho responsivo do ícone
                color: 'primary.main',  // Azul do tema
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' } // Tamanho responsivo
              }}>
                Dificuldade de Organização
              </Typography>
              <Typography variant="body1" sx={{ 
                flexGrow: 1,
                fontSize: { xs: '0.9rem', md: '1rem' }, // Tamanho responsivo
                lineHeight: 1.6, // Melhor espaçamento entre linhas
                color: 'text.secondary'
              }}>
                Dificuldade em organizar e gerenciar tarefas cotidianas de forma eficiente
              </Typography>
            </Card>
          </Grid>

          {/* Card 2 - Rotinas Agitadas */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: { xs: 'auto', md: '320px' }, 
              minHeight: '280px',   
              maxWidth: '350px',    
              mx: 'auto',          
              display: 'flex',     
              flexDirection: 'column', 
              textAlign: 'center', 
              p: { xs: 2.5, md: 3 }, 
              // Efeitos visuais modernos
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white, // Usando glass do theme
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              {/* Ícone com cor de warning (laranja) */}
              <TrendingUp sx={{ 
                fontSize: { xs: 50, md: 60 }, 
                color: 'warning.main', 
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Rotinas Agitadas
              </Typography>
              <Typography variant="body1" sx={{ 
                flexGrow: 1,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                No meio de trabalho e estudo, as tarefas de casa são negligenciadas e se tornam maiores
              </Typography>
            </Card>
          </Grid>

          {/* Card 3 - Esquecimentos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: { xs: 'auto', md: '320px' }, 
              minHeight: '280px',   
              maxWidth: '350px',    
              mx: 'auto',          
              display: 'flex',     
              flexDirection: 'column', 
              textAlign: 'center', 
              p: { xs: 2.5, md: 3 }, 
              // Efeitos visuais modernos
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              bgcolor: theme.palette.glass.white, // Usando glass do theme
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
              }
            }}>
              {/* Ícone com cor de error (vermelho) */}
              <WarningAmber sx={{ 
                fontSize: { xs: 50, md: 60 }, 
                color: 'error.main', 
                mb: 2 
              }} />
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Esquecimentos
              </Typography>
              <Typography variant="body1" sx={{ 
                flexGrow: 1,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.6,
                color: 'text.secondary'
              }}>
                Não lembrar onde colocou algo ou de fazer algo importante causa estresse
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ProblemSection
