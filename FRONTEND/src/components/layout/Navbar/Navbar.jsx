import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Itens do menu centralizados para manutenibilidade
  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Login', path: '/login' },
    { text: 'Registrar', path: '/register' },
    { text: 'Dashboard', path: '/dashboard' }
  ]

  return (
    <AppBar position="static">
      <Toolbar sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px' },
        margin: '0 auto',
        px: { xs: 2, sm: 3, md: 4, lg: 2 }
      }}>
        
        <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
          🏠 Mess Away
        </Typography>
        
        {/* Menu Desktop - esconde no mobile */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {menuItems.map((item) => (
            <Button 
              key={item.text}
              color="inherit"
              component={Link}
              to={item.path}
            >
              {item.text}
            </Button>
          ))}
          <Button color="inherit" component={Link} to="/Tarefas">Tarefas</Button>
        
        </Box>

        {/* Menu Mobile - mostra só no mobile */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer para Mobile */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 240 }
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text}
                component={Link} 
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar