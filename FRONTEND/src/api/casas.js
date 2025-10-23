import axios from 'axios';

// Use o prefixo /api para evitar diferenças de comportamento nas rotas duplicadas
const API = 'http://localhost:4567/api/casas';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Lista casas; quando contaId for fornecido, retorna somente as casas vinculadas à conta (ou todas se a conta for admin)
export const listarCasas = (contaId) => axiosInstance.get(API, {
  params: contaId ? { contaId } : undefined
});

// Cria casa; quando idConta for fornecido, vincula a casa criada à conta (CASA.id_conta)
export const criarCasa = (casa, idConta) => {
  const payload = idConta ? { ...casa, idConta } : casa;
  return axiosInstance.post(API, payload);
};

export const deletarCasa = (id) => axiosInstance.delete(`${API}/${id}`);
