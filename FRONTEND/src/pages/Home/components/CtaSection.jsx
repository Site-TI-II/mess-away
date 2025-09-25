import { Box, Typography, Container, Stack, Button } from '@mui/material'
import { Home, GitHub } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * CtaSection - Chamada final para ação com botões do GitHub
 * 
 * Funcionalidades:
 * - Pergunta engajante como hook
 * - Subtítulo motivacional
 * - Botões iguais ao HeroSection (GitHub e Experimente Grátis)
 * - Mesmo gradient do hero para simetria visual
 */
function CtaSection() {
  const theme = useTheme()
  
  return (
    <Box sx={{
      // Mesmo gradient do hero para criar simetria visual
      background: theme.palette.gradients.heroPrimary,
      color: 'white',
      py: { xs: 8, md: 10 },  // Padding vertical generoso
      textAlign: 'center'
    }}>
      {/* Container menor (md) para foco na mensagem */}
      <Container maxWidth="md">
        {/* Pergunta engajante como hook */}
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Pronto para transformar sua relação com as tarefas domésticas?
        </Typography>
        
        {/* Subtítulo motivacional */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            opacity: 0.9  // Levemente transparente para hierarquia
          }}
        >
          Organize sua casa, simplifique sua vida
        </Typography>

        {/* Stack para botões iguais ao HeroSection */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}  // Responsivo
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

export default CtaSection
