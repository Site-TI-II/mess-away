import axios from 'axios';
import { API_URL } from './config';

const getTarefasUrl = (idCasa) => `http://localhost:4567/api/casas/${idCasa}/tarefas`;

export const listarTarefas = (idCasa) => axios.get(getTarefasUrl(idCasa));

// ✅ CORRIGIDO: aceita apenas o objeto tarefa (que já tem idCasa dentro)
export const criarTarefa = (tarefa) => 
  axios.post('http://localhost:4567/api/tarefas', tarefa);

export const atualizarTarefa = (idCasa, idTarefa, tarefa) => 
  axios.put(`http://localhost:4567/api/tarefas/${idTarefa}`, tarefa);

export const deletarTarefa = (idCasa, idTarefa) => 
  axios.delete(`http://localhost:4567/api/tarefas/${idTarefa}`);

export const concluirTarefa = (idCasa, idTarefa) => 
  axios.put(`http://localhost:4567/api/tarefas/${idTarefa}/concluir`);

export const removerTarefa = deletarTarefa;
