// src/pages/Casas/components/AddMoradorCasaDialog.jsx

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material'

function AddMoradorCasaDialog({ open, onClose, onAdd }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [permissao, setPermissao] = useState('Membro')
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setNome('')
    setEmail('')
    setSenha('')
    setPermissao('Membro')
  }

  const handleAdd = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) return
    try {
      setSaving(true)
      await onAdd({ nome: nome.trim(), email: email.trim(), senha: senha.trim(), permissao })
      reset()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar morador à casa</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Nome"
          fullWidth
          margin="dense"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="dense"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <TextField
          label="Permissão"
          select
          fullWidth
          margin="dense"
          value={permissao}
          onChange={(e) => setPermissao(e.target.value)}
        >
          {['Membro', 'Admin'].map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancelar</Button>
        <Button variant="contained" onClick={handleAdd} disabled={saving || !nome || !email || !senha}>
          {saving ? 'Salvando...' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMoradorCasaDialog
