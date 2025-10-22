import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Alert
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Email,
  Lock,
  Person,
  GitHub
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

/**
 * Register - Página de cadastro com design moderno
 * 
 * Funcionalidades:
 * - Glass morphism card
 * - Validação visual dos campos
 * - Toggle de visibilidade da senha
 * - Gradiente de fundo consistente
 * - Link para login
 * - Opção de cadastro via GitHub
 */
function Register() {
  const theme = useTheme()
  const navigate = useNavigate()
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  // Handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Limpa erro ao digitar
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    // Map frontend fields to backend model fields
    const payload = {
      nome: formData.name,
      email: formData.email,
      password: formData.password
    }

    fetch('http://localhost:4567/MessAway/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Erro ao cadastrar')
        }
        return res.json()
      })
      .then((data) => {
        // registro criado com sucesso -> redireciona para home
        navigate('/')
      })
      .catch((err) => {
        setError(err.message || 'Erro ao conectar ao servidor')
      })
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)', // Desconta altura do navbar
        display: 'flex',
        alignItems: 'center',
        py: 6,
        // Gradiente de fundo igual ao hero
        background: theme.palette.gradients.heroPrimary,
        position: 'relative',
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
              <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
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
              Criar Conta
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Comece a organizar suas tarefas hoje mesmo!
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
            {/* Campo Nome */}
            <TextField
              fullWidth
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

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
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            {/* Campo Confirmar Senha */}
            <TextField
              fullWidth
              label="Confirmar Senha"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            {/* Botão Principal */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
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
              Criar Conta
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

            {/* Link para Login */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer do Card */}
        <Typography
          variant="caption"
          color="white"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 3,
            opacity: 0.8
          }}
        >
          Ao criar uma conta, você concorda com nossos{' '}
          <Link
            to="/termos"
            style={{ color: 'white', textDecoration: 'underline' }}
          >
            Termos de Uso
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}

export default Register