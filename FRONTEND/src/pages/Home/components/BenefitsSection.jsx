import { Box, Typography, Container, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

/**
 * BenefitsSection - Seção destacada apresentando os benefícios do Mess Away
 * 
 * Funcionalidades:
 * - Fundo azul para destaque visual
 * - 4 benefícios organizados em 2 colunas
 * - Listas com ícones de check
 * - Texto branco para contraste
 */
function BenefitsSection() {
  return (
    <Box sx={{ 
      py: { xs: 6, md: 10 }, 
      bgcolor: 'primary.main',  // Fundo azul do tema
      color: 'white'           // Texto branco para contraste
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Como o Mess Away Ajuda
        </Typography>
        
        {/* Grid 2 colunas para organizar os benefícios */}
        <Grid container spacing={4}>
          {/* Coluna 1 - Primeiros 2 benefícios */}
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  {/* Ícone verde claro para contraste no fundo azul */}
                  <CheckCircle sx={{ color: 'success.light' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Facilita e organiza a casa e os objetivos dos ambientes"
                  sx={{ color: 'white' }}  // Garante texto branco
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.light' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Transforma tarefas trabalhosas em algo descomplicado"
                  sx={{ color: 'white' }}
                />
              </ListItem>
            </List>
          </Grid>

          {/* Coluna 2 - Últimos 2 benefícios */}
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.light' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Melhora a convivência e a produtividade"
                  sx={{ color: 'white' }}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.light' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Auxilia no aspecto financeiro através de melhor organização"
                  sx={{ color: 'white' }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default BenefitsSection
