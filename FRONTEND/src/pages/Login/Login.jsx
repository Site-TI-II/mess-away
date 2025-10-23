import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Email,
  Lock,
  GitHub
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * Login - Página de autenticação com design moderno
 * 
 * Funcionalidades:
 * - Glass morphism card
 * - Toggle de visibilidade da senha
 * - Checkbox "Lembrar-me"
 * - Validação básica
 * - Links para registro e recuperação de senha
 * - Opção de login via GitHub
 * - Bolinhas decorativas animadas
 */
function Login() {
  const theme = useTheme()
  const navigate = useNavigate()
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Handlers
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setError('') // Limpa erro ao digitar
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      const user = await login(formData.email, formData.password)
      // Se o login for bem-sucedido, redireciona para o dashboard
      navigate('/dashboard')
    } catch (err) {
      // Trata erros específicos
      if (err.response?.status === 401) {
        setError('Email ou senha inválidos')
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.')
      }
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
        // Gradiente de fundo igual ao hero
        background: theme.palette.gradients.heroPrimary,
        position: 'relative',
        overflow: 'hidden',
        // Padrão de fundo sutil
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%),
            radial-gradient(circle at 80% 80%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%)`,
          pointerEvents: 'none'
        }
      }}
    >
      {/* Bolinhas Decorativas Animadas */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 50, md: 100 },
          left: { xs: 20, md: 100 },
          width: { xs: 60, md: 100 },
          height: { xs: 60, md: 100 },
          borderRadius: '50%',
          background: theme.palette.gradients.ctaSection || 'rgba(255, 140, 0, 0.3)',
          zIndex: 0,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 50, md: 100 },
          right: { xs: 20, md: 100 },
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          borderRadius: '50%',
          background: theme.palette.gradients.testimonialsSection || 'rgba(156, 39, 176, 0.3)',
          zIndex: 0,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '10%', md: '15%' },
          width: { xs: 40, md: 60 },
          height: { xs: 40, md: 60 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          zIndex: 0,
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />

      <Container maxWidth="sm">
        {/* Card Principal com Glass Morphism */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            // Glass morphism effect
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                background: theme.palette.gradients.heroPrimary,
                mb: 2
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                background: theme.palette.gradientText.heroPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Bem-vindo de volta!
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Entre para acessar sua conta
            </Typography>
          </Box>

          {/* Alerta de Erro */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Campo Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            {/* Campo Senha */}
            <TextField
              fullWidth
              label="Senha"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            {/* Lembrar-me e Esqueci Senha */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
                mb: 2
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Lembrar-me
                  </Typography>
                }
              />
              <Link
                component={Link}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            {/* Botão Principal */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                background: theme.palette.gradients.heroPrimary,
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Entrar
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            {/* Botão GitHub */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GitHub />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: 'grey.50'
                }
              }}
            >
              Continuar com GitHub
            </Button>

            {/* Link para Registro */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Não tem uma conta?{' '}
                <Link
                  component={Link}
                  to="/register"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Cadastre-se gratuitamente
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login