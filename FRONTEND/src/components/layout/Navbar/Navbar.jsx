import { Link } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button 
} from '@mui/material'

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        
        <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>🏠 Mess Away</Typography>        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Registrar</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/Tarefas">Tarefas</Button>
        
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar