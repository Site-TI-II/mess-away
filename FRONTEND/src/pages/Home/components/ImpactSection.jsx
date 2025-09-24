import { Box, Typography, Container, Grid } from '@mui/material'

/**
 * ImpactSection - Seção mostrando os benefícios sociais do app
 * 
 * Funcionalidades:
 * - 4 impactos sociais com emojis grandes
 * - Grid responsivo que se adapta por tela
 * - Cores variadas para cada impacto
 * - Fundo cinza claro para alternância visual
 */
function ImpactSection() {
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 }, 
      bgcolor: 'grey.50'  // Fundo cinza claro para alternância
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Impacto Social
        </Typography>
        
        {/* Grid 4 colunas com impactos sociais */}
        <Grid container spacing={3}>
          {/* Impacto 1 - Vida Facilitada */}
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              {/* Emoji grande para impacto visual */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main',  // Azul do tema
                  mb: 1 
                }}
              >
                🏠
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Vida Facilitada
              </Typography>
              <Typography variant="body2">
                Facilitação da vida das pessoas
              </Typography>
            </Box>
          </Grid>

          {/* Impacto 2 - Convivência */}
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'secondary.main',  // Roxo/rosa do tema
                  mb: 1 
                }}
              >
                👨‍👩‍👧‍👦
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Convivência
              </Typography>
              <Typography variant="body2">
                Melhora na convivência familiar
              </Typography>
            </Box>
          </Grid>

          {/* Impacto 3 - Produtividade */}
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'success.main',  // Verde do tema
                  mb: 1 
                }}
              >
                📈
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Produtividade
              </Typography>
              <Typography variant="body2">
                Aumento da produtividade pessoal
              </Typography>
            </Box>
          </Grid>

          {/* Impacto 4 - Economia */}
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'warning.main',  // Laranja do tema
                  mb: 1 
                }}
              >
                💰
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Economia
              </Typography>
              <Typography variant="body2">
                Benefícios financeiros
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ImpactSection
