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
{/*Função das Tarefas */ }
function Tarefas() {
  const [tarefa, setTarefa] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [lista, setLista] = useState([]);
  // Contador de tarefas feitas
  const contarPorResponsavel = () => {
    const contagem = {};

    lista.forEach(({ responsavel }) => {
      contagem[responsavel] = (contagem[responsavel] || 0) + 1;
    });

    return contagem;
  };

  // Adiciona nova tarefa à lista
  const adicionarTarefa = () => {
    if (tarefa.trim() && responsavel.trim()) {
      setLista([...lista, { tarefa, responsavel, concluida: false }]);
      setTarefa('');
      setResponsavel('');
    }
  };

  // Remove tarefa pelo índice
  const removerTarefa = (index) => {
    setLista(lista.filter((_, i) => i !== index));
  };
  //Marca tarefas como concluidas
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

      {/* Seleção de responsável */}
      <FormControl fullWidth sx={{ mb: 2 }}>
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

      {/* Botão para adicionar tarefa */}
      <Button variant="contained" color="primary" onClick={adicionarTarefa}>
        Adicionar
      </Button>

      {/* Layout horizontal: caixona cinza à esquerda, caixas brancas à direita */}
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
          {/* Título da lista */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              padding: 1,
              borderRadius: 4,
              marginBottom: 1
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              Todas as tarefas
            </Typography>
          </Box>

          {/* Lista de tarefas */}
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

                  <Typography
                    variant="caption"
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'bold',
                      color: '#ffffffff'
                    }}
                  >
                    Responsável: {item.responsavel}
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

        {/* Coluna da direita com duas caixas brancas empilhadas */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              padding: 2,
              borderRadius: 2,
              height: '190px'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Caixa 1
            </Typography>
          </Box>
          {/* Caixa 2 / Estatísticas */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              padding: 2,
              borderRadius: 2,
              height: '190px',
              overflowY: 'auto'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
              Estatísticas
            </Typography>

            {Object.entries(contarPorResponsavel()).map(([nome, quantidade]) => (
              <Box
                key={nome}
                sx={{
                  backgroundColor: coresPorResponsavel[nome] || '#eeeeee',
                  borderRadius: 2,
                  padding: 1,
                  mb: 1,
                  color: '#ffffff'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {nome}: {quantidade} tarefa{quantidade > 1 ? 's' : ''}
                </Typography>
              </Box>
            ))}

            {lista.length === 0 && (
              <Typography variant="body2" sx={{ color: '#999' }}>
                Nenhuma tarefa adicionada ainda.
              </Typography>
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  ); // ← fecha o return
} // ← fecha a função Tarefas

export default Tarefas;
