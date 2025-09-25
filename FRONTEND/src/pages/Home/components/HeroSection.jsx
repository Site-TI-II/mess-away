import { Box, Typography, Button, Container, Stack } from '@mui/material'
import { Home, GitHub } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * HeroSection - Seção principal de apresentação da landing page
 * 
 * Funcionalidades:
 * - Título e subtítulo impactantes
 * - Placeholder para mockup do app
 * - CTAs principais (Baixe Agora / Experimente Grátis)
 * - Background gradient azul-roxo
 */
function HeroSection() {
  const theme = useTheme()

  return (
    <Box sx={{
      // Usando gradiente do theme
      background: theme.palette.gradients.heroPrimary,
      color: 'white',
      // Padding vertical responsivo: mobile (64px) / desktop (96px)
      py: { xs: 8, md: 12 },
      textAlign: 'center'
    }}>
      {/* Container limitado para conteúdo centralizado */}
      <Container maxWidth="lg">
        {/* Título principal - H1 semântico para SEO */}
        <Typography
          variant="h2"      // Estilo visual h2
          component="h1"    // Tag semântica h1 para SEO
          sx={{
            fontWeight: 'bold',  // Define o peso da fonte como negrito
            mb: 2,               // Margin bottom = 16px (2 * 8px do spacing do MUI)

            // Font-size responsivo usando breakpoints do Material-UI
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            // xs (mobile): 40px, md+ (desktop): 60px

            // === EFEITO DE GRADIENTE NO TEXTO ===
            // Aplica gradiente como background do elemento
            background: theme.palette.gradientText.light,

            // Clip do background apenas na área do texto
            WebkitBackgroundClip: 'text',         // Webkit (Chrome/Safari)
            backgroundClip: 'text',               // Padrão W3C

            // Torna o texto transparente para mostrar o background gradient
            WebkitTextFillColor: 'transparent',   // Remove a cor sólida do texto
          }}
        >
          Mess Away: Organização Descomplicada para Sua Casa
        </Typography>

        {/* Subtítulo explicativo */}
        <Typography
          variant="h5"
          sx={{
            mb: 4,         // Margin bottom 32px
            opacity: 0.9,  // Levemente transparente
            maxWidth: '800px',
            mx: 'auto',    // Margin horizontal auto (centraliza)
            // Font-size responsivo
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}
        >
          Transforme a gestão de tarefas domésticas de algo trabalhoso em uma experiência simples e eficiente
        </Typography>

        {/* Container para placeholder do mockup do app */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{
            // Dimensões responsivas para o mockup
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            // Usando overlay do theme
            bgcolor: theme.palette.overlay.light,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',    // Centraliza horizontalmente
            mb: 4
          }}>
            {/* Ícone de casa como placeholder */}
            <Home sx={{
              fontSize: { xs: 80, md: 120 },
              opacity: 0.7
            }} />
          </Box>
        </Box>

        {/* Stack para organizar botões CTAs */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}  // Coluna no mobile, linha no desktop
          spacing={2}
          justifyContent="center"
        >
          {/* CTA Primário - GitHub */}
          <Button
            variant="contained"
            size="large"
            component="a"
            href="https://github.com/Site-TI-II/mess-away"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              // Botão branco para contraste no fundo azul
              bgcolor: 'white',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'grey.100' },
              py: 1.5,  // Padding vertical
              px: 4     // Padding horizontal
            }}
          >
            <GitHub sx={{ mr: 1 }} /> {/* Ícone do GitHub */}
            Ver no GitHub
          </Button>

          {/* CTA Secundário - Experimente Grátis */}
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                // Usando overlay do theme para hover
                bgcolor: theme.palette.overlay.light,
                borderColor: 'white'
              },
              py: 1.5,
              px: 4
            }}
          >
            Experimente Grátis
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
