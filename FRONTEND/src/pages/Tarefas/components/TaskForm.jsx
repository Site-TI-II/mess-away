// src/pages/Tarefas/components/TaskForm.jsx

import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Box
} from '@mui/material'
import { Checkbox, FormControlLabel } from '@mui/material'
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

function TaskForm({ 
  tarefa, setTarefa, 
  responsavel, setResponsavel, 
  prazo, setPrazo,
  diaria, setDiaria,
  onAdd,
  pessoas = []
}) {
  const theme = useTheme()

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAdd()
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Grid container spacing={2}>
        {/* Campo Tarefa */}
        <Grid item xs={12}>
          <TextField
            label="Nova Tarefa"
            variant="outlined"
            fullWidth
            value={tarefa}
            onChange={(e) => setTarefa(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: Lavar a louça"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>

  {/* Responsável */}
  <Grid item xs={12} sm={6} md={5}>
          <FormControl fullWidth>
            <InputLabel>Responsável</InputLabel>
            <Select
              value={responsavel}
              label="Responsável"
              onChange={(e) => setResponsavel(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              }
              sx={{ borderRadius: 2 }}
            >
              {pessoas.map((pessoa, index) => (
                <MenuItem key={`${pessoa.idUsuario || pessoa.email || pessoa.nome || 'user'}-${index}`} value={pessoa.idUsuario}>
                  {pessoa.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Prazo */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Prazo"
            type="date"
            fullWidth
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Grid>

        {/* Diária */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel
            control={<Checkbox checked={diaria} onChange={(e) => setDiaria(e.target.checked)} />}
            label="Tarefa diária"
          />
        </Grid>

        {/* Botão Adicionar */}
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={onAdd}
            disabled={!tarefa.trim() || !responsavel || !prazo}
            startIcon={<AddIcon />}
            sx={{
              height: '56px',
              borderRadius: 2,
              background: theme.palette.gradients.heroPrimary,
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default TaskForm