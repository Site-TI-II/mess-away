import axios from 'axios';
import { API_URL } from './config';

export const criarConta = async (conta) => {
  const res = await axios.post(`${API_URL}/contas`, conta);
  return res.data;
};

export const addUsuarioToConta = async (idConta, payload) => {
  const res = await axios.post(`${API_URL}/contas/${idConta}/usuarios`, payload);
  return res.data;
};

export const listUsuariosByConta = async (idConta) => {
  const res = await axios.get(`${API_URL}/contas/${idConta}/usuarios`);
  return res.data;
};

export const deleteUsuarioFromConta = async (idConta, contaUsuarioId) => {
  const res = await axios.delete(`${API_URL}/contas/${idConta}/usuarios/${contaUsuarioId}`);
  return res.status;
};
