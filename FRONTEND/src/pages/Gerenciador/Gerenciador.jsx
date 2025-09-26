import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

// Lista provisória de responsáveis
const listaDeResponsaveis = ['Caio', 'Leo', 'Guilherme', 'Dani', 'Minion'];

// Cores associadas a cada responsável
const coresPorResponsavel = {
  Caio: '#9d0386ff',
  Leo: '#ff8025ff',
  Guilherme: '#20d043ff',
  Dani: '#326eb2ff',
  Minion: '#ffca1aff'
};

function Tarefas() {
  const [tarefa, setTarefa] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [prazo, setPrazo] = useState('');
  const [lista, setLista] = useState([]);

  // Contador de tarefas concluídas por responsável
  const contarPorResponsavel = () => {
    const contagem = {};
    lista.forEach(({ responsavel, concluida }) => {
      if (concluida) {
        contagem[responsavel] = (contagem[responsavel] || 0) + 1;
      }
    });
    return contagem;
  };

  // Adiciona nova tarefa à lista
  const adicionarTarefa = () => {
    if (tarefa.trim() && responsavel.trim() && prazo.trim()) {
      setLista([...lista, { tarefa, responsavel, prazo, concluida: false }]);
      setTarefa('');
      setResponsavel('');
      setPrazo('');
    }
  };

  // Remove tarefa pelo índice
  const removerTarefa = (index) => {
    setLista(lista.filter((_, i) => i !== index));
  };

  // Marca tarefa como concluída
  const marcarComoConcluida = (index) => {
    const novaLista = [...lista];
    novaLista[index].concluida = true;
    setLista(novaLista);
  };

  return (
    <Box sx={{ maxWidth: '900px', margin: '0 auto', padding: 3 }}>
      {/* Campo de texto para nova tarefa */}
      <TextField
        label="Nova tarefa"
        variant="outlined"
        fullWidth
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
        sx={{ mb: 2 }}
      />
      {/* Campo de seleção de responsável e prazo lado a lado */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Responsável</InputLabel>
          <Select
            value={responsavel}
            label="Responsável"
            onChange={(e) => setResponsavel(e.target.value)}
          >
            {listaDeResponsaveis.map((nome, index) => (
              <MenuItem key={index} value={nome}>
                {nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Prazo</InputLabel>
          <Select
            value={prazo}
            label="Prazo"
            onChange={(e) => setPrazo(e.target.value)}
          >
            <MenuItem value="Diária">Diária</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
            <MenuItem value="Mensal">Mensal</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Botão para adicionar tarefa */}
      <Button variant="contained" color="primary" onClick={adicionarTarefa}>
        Adicionar
      </Button>


      {/* Layout principal */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        {/* Caixona cinza com lista de tarefas */}
        <Box
          sx={{
            backgroundColor: '#c0c0c0ff',
            height: '400px',
            flex: 2,
            borderRadius: 4,
            padding: 5,
            overflowY: 'auto'
          }}
        >
          <Box
            sx={{
              backgroundColor: '#ffffff',
              padding: 1,
              borderRadius: 4,
              marginBottom: 1
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
              Todas as tarefas
            </Typography>
          </Box>

          <List>
            {lista.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: coresPorResponsavel[item.responsavel] || '#0a69b6ff',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  marginBottom: 1,
                  borderRadius: 3,
                  padding: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      textDecoration: item.concluida ? 'line-through' : 'none',
                      opacity: item.concluida ? 0.6 : 1
                    }}
                  >
                    {item.tarefa}
                  </Typography>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', fontWeight: 'bold', color: '#ffffff' }}>
                    Responsável: {item.responsavel} <br />
                  </Typography>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', fontWeight: 'bold', color: '#ffffff' }}>
                    Prazo: {item.prazo}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color={item.concluida ? 'success' : 'default'}
                    onClick={() => marcarComoConcluida(index)}
                    disabled={item.concluida}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => removerTarefa(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}

export default Tarefas;
