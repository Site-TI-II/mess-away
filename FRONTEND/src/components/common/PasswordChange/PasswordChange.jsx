import React, { useState } from 'react'
import { Box, TextField, Button, Alert, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { changePassword } from '../../../api/usuarios'

/**
 * PasswordChange
 * Props:
 * - initialEmail: optional email to prefill
 * - onSuccess: optional callback invoked after successful change
 */
export default function PasswordChange({ initialEmail = '', onSuccess } ) {
  const theme = useTheme()
  const [email, setEmail] = useState(initialEmail)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e && e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Informe o email')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const res = await changePassword(email, newPassword)
      if (res.status === 200) {
        setSuccess('Senha alterada com sucesso')
        setNewPassword('')
        setConfirmPassword('')
        onSuccess && onSuccess()
      } else {
        setError('Não foi possível alterar a senha')
      }
    } catch (err) {
      const msg = err?.response?.data || err.message || 'Erro ao alterar senha'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Trocar senha</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        label="Nova senha"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        label="Confirmar senha"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mb: 2 }}
        required
      />

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Enviando...' : 'Trocar senha'}
      </Button>
    </Box>
  )
}
