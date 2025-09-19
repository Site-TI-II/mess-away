import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

function Home() {
  return (
    <Box sx={{
      maxWidth: '1200px', // Largura máxima do conteúdo
      margin: '0 auto', // Centraliza horizontalmente
      padding: { xs: 2, md: 3 } // Padding responsivo (8px em xs, 24px em md e maiores)
    }}>
    
      <Typography variant="h2" component="h1" sx={{ mb: 2 }}> 
        Bem-vindo ao Mess Away! 🏠
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Organize suas tarefas domésticas de forma simples e eficiente.
      </Typography>

      <Typography variant="h4" component="h3" sx={{ mb: 2 }}>
        Funcionalidades:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Gerenciamento de tarefas" />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Lembretes automáticos" />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Compartilhamento com familiares" />
        </ListItem>
      </List>

    </Box>
  )
}

export default Home