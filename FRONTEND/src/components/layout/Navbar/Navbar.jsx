import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { listarCasas } from '../../../api/casas'
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
  ListItemText,
  Container,
  Chip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [hasCasas, setHasCasas] = useState(false)
  const theme = useTheme()
  const location = useLocation() // Para destacar rota ativa
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Home', path: '/' },
    ...(currentUser ? [{ text: 'Casas', path: '/casas' }] : []),
    ...(currentUser && hasCasas ? [
      { text: 'Tarefas', path: '/tarefas' },
      { text: 'Dashboard', path: '/dashboard' }
    ] : [])
  ]

  const authItems = [
    { text: 'Login', path: '/login' },
    { text: 'Registrar', path: '/register' }
  ]

  // Atualiza o estado do usuário ao trocar de rota (ex: após login navega para /casas)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      const parsed = raw ? JSON.parse(raw) : null
      setCurrentUser(parsed)
    } catch {
      setCurrentUser(null)
    }
  }, [location])

  // Verifica se a conta tem casas; quando não tiver, esconde Tarefas/Dashboard
  useEffect(() => {
    let cancelled = false
    const checkCasas = async () => {
      try {
        // Sinais imediatos: admin vê tudo; se vier casaId do login, já considera true
        if (currentUser?.isAdmin) {
          if (!cancelled) setHasCasas(true)
          return
        }
        if (currentUser?.casaId) {
          if (!cancelled) setHasCasas(true)
          // continua para confirmar pelo backend, mas já habilita o menu
        }
        if (currentUser?.idConta) {
          const resp = await listarCasas(currentUser.idConta)
          if (!cancelled) setHasCasas(Array.isArray(resp.data) && resp.data.length > 0)
        } else {
          if (!cancelled) setHasCasas(false)
        }
      } catch (e) {
        if (!cancelled) setHasCasas(false)
      }
    }
    checkCasas()
    return () => { cancelled = true }
  }, [currentUser])

  const getUserDisplayName = (user) => {
    if (!user) return ''
    return user.nome || user.apelido || user.email || 'Usuário'
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('user')
    } catch {}
    setCurrentUser(null)
    setHasCasas(false)
    // fecha o drawer caso esteja aberto e volta para a home
    if (mobileOpen) setMobileOpen(false)
    navigate('/')
  }

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          // Gradiente hero para consistência visual
          background: theme.palette.gradients.heroPrimary,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 70, md: 80 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 2, sm: 0 }
            }}
          >
            {/* Logo/Brand */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              🏠 Mess Away
            </Typography>

            {/* Desktop Menu */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: 1,
                alignItems: 'center'
              }}
            >
              {/* Menu Items principais */}
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: 'white',
                      px: 2,
                      py: 1,
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: isActive ? '80%' : '0%',
                        height: '2px',
                        bgcolor: 'white',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover': {
                        bgcolor: theme.palette.overlay.light,
                        '&::after': {
                          width: '80%'
                        }
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                )
              })}

              {/* Separador visual */}
              <Box 
                sx={{ 
                  width: '1px', 
                  height: '24px', 
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  mx: 1
                }} 
              />

              {/* Auth ou Usuário logado */}
              {currentUser ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'white' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                    aria-label="avatar"
                    title={getUserDisplayName(currentUser)}
                  >
                    {getUserDisplayName(currentUser).charAt(0).toUpperCase()}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getUserDisplayName(currentUser)}
                  </Typography>
                  {currentUser?.isAdmin && (
                    <Chip label="Admin" size="small" color="warning" sx={{ color: 'black' }} />
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      px: 2,
                      py: 0.5,
                      '&:hover': { bgcolor: theme.palette.overlay.light, borderColor: 'white' }
                    }}
                  >
                    Sair
                  </Button>
                </Box>
              ) : (
                authItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    variant={item.text === 'Registrar' ? 'contained' : 'outlined'}
                    sx={{
                      color: item.text === 'Registrar' ? 'primary.dark' : 'white',
                      bgcolor: item.text === 'Registrar' ? 'white' : 'transparent',
                      borderColor: 'white',
                      px: 2.5,
                      py: 0.75,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: item.text === 'Registrar' 
                          ? 'grey.100' 
                          : theme.palette.overlay.light,
                        borderColor: 'white'
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: 'white'
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            // Glass morphism no drawer
            background: `linear-gradient(135deg, 
              ${theme.palette.primary.main}ee 0%, 
              ${theme.palette.primary.dark}ee 100%
            )`,
            backdropFilter: 'blur(20px)',
            color: 'white'
          }
        }}
      >
        {/* Header do Drawer */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Menu
          </Typography>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu Items Mobile */}
        <List sx={{ px: 1, pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive ? theme.palette.overlay.light : 'transparent',
                  '&:hover': {
                    bgcolor: theme.palette.overlay.light
                  }
                }}
              >
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItem>
            )
          })}

          {/* Separador */}
          <Box 
            sx={{ 
              height: '1px', 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              my: 2,
              mx: 2
            }} 
          />

          {/* Auth Items Mobile ou Usuário */}
          {currentUser ? (
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Logado como</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {getUserDisplayName(currentUser)}
              </Typography>
              {currentUser?.isAdmin && (
                <Chip label="Admin" size="small" color="warning" sx={{ color: 'black', mt: 1 }} />
              )}
              <Button
                fullWidth
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  mt: 2,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { bgcolor: theme.palette.overlay.light, borderColor: 'white' }
                }}
              >
                Sair
              </Button>
            </Box>
          ) : (
            authItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: item.text === 'Registrar' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  border: item.text === 'Registrar' 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : 'none',
                  '&:hover': {
                    bgcolor: theme.palette.overlay.light
                  }
                }}
              >
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: item.text === 'Registrar' ? 600 : 400
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Drawer>
    </>
  )
}

export default Navbar