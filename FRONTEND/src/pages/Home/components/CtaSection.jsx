import { Box, Typography, Container, Stack, Button } from '@mui/material'

/**
 * CtaSection - Chamada final para ação com botões de download
 * 
 * Funcionalidades:
 * - Pergunta engajante como hook
 * - Subtítulo motivacional
 * - Botões para App Stores com emojis
 * - Mesmo gradient do hero para simetria visual
 */
function CtaSection() {
  return (
    <Box sx={{
      // Mesmo gradient do hero para criar simetria visual
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

        {/* Stack para botões das lojas */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}  // Responsivo
          spacing={2} 
          justifyContent="center"
        >
          {/* Botão App Store */}
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              // Botão branco destacado
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              py: 2,    // Padding vertical maior
              px: 4     // Padding horizontal maior
            }}
          >
            📱 Download na App Store
          </Button>

          {/* Botão Google Play */}
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              // Botão verde para Google Play
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
              py: 2,
              px: 4
            }}
          >
            🤖 Disponível no Google Play
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default CtaSection
