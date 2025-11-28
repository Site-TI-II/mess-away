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
  Alert
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  LockReset,
  Email,
  Lock,
  ArrowBack
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { changePassword } from '../../api/usuarios'

/**
 * ForgotPassword - Página de recuperação de senha com design moderno
 * 
 * Funcionalidades:
 * - Glass morphism card (mesmo estilo do Login)
 * - Toggle de visibilidade da senha
 * - Validação de confirmação de senha
 * - Bolinhas decorativas animadas
 * - Link para voltar ao login
 */
function ForgotPassword() {
  const theme = useTheme()
  const navigate = useNavigate()
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('') // Limpa erro ao digitar
    setSuccess('') // Limpa sucesso ao digitar
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const res = await changePassword(formData.email, formData.newPassword)
      if (res.status === 200) {
        setSuccess('Senha alterada com sucesso! Você pode fazer login com a nova senha.')
        setFormData({ email: '', newPassword: '', confirmPassword: '' })
        // Redireciona para login após 2 segundos
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Não foi possível alterar a senha')
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Usuário não encontrado com este email')
      } else {
        const msg = err?.response?.data?.error || err.message || 'Erro ao alterar senha'
        setError(typeof msg === 'string' ? msg : 'Erro interno do servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
        // Gradiente de fundo igual ao login
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
              <LockReset sx={{ fontSize: 40, color: 'white' }} />
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
              Recuperar Senha
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Digite seu email e nova senha para alterar
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

          {/* Alerta de Sucesso */}
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {success}
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

            {/* Campo Nova Senha */}
            <TextField
              fullWidth
              label="Nova Senha"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
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
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            {/* Campo Confirmar Senha */}
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
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
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                },
                mb: 3
              }}
            />

            {/* Botão Principal */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
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
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>

            {/* Link para Login */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBack />}
                variant="text"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Voltar para o Login
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ForgotPassword
