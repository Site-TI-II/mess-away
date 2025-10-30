import axios from 'axios';
import { API_URL } from './config';

// Rotas corretas: /api/casas/:id/tarefas
const getTarefasUrl = (idCasa) => `http://localhost:4567/api/casas/${idCasa}/tarefas`;

export const listarTarefas = (idCasa) => axios.get(getTarefasUrl(idCasa));

export const criarTarefa = (idCasa, tarefa) => 
  axios.post('http://localhost:4567/api/tarefas', { ...tarefa, idCasa });

export const atualizarTarefa = (idCasa, idTarefa, tarefa) => 
  axios.put(`http://localhost:4567/api/tarefas/${idTarefa}`, tarefa);

export const deletarTarefa = (idCasa, idTarefa) => 
  axios.delete(`http://localhost:4567/api/tarefas/${idTarefa}`);

export const concluirTarefa = (idCasa, idTarefa) => 
  axios.put(`http://localhost:4567/api/tarefas/${idTarefa}/concluir`);

// Alias para compatibilidade
export const removerTarefa = deletarTarefa;
