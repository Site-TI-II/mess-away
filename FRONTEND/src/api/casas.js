import axios from 'axios';

const API = 'http://localhost:4567/api/casas';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Lista casas por conta
export const listarCasas = (contaId) => axiosInstance.get(API, {
  params: contaId ? { contaId } : undefined
});

// Cria casa vinculada à conta
export const criarCasa = (casa, idConta) => {
  const payload = idConta ? { ...casa, idConta } : casa;
  return axiosInstance.post(API, payload);
};

// Deletar casa
export const deletarCasa = (id) => axiosInstance.delete(`${API}/${id}`);

// Listar usuários da casa
export const listUsuariosByCasa = async (idCasa) => {
  try {
    const response = await axiosInstance.get(`${API}/${idCasa}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar usuários da casa:', error);
    throw error;
  }
};

// Adicionar usuário existente à casa
export const addUsuarioToCasa = async (idCasa, { idUsuario, permissao = 'Membro' }) => {
  try {
    const response = await axiosInstance.post(`${API}/${idCasa}/usuarios`, {
      idUsuario,
      permissao
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar usuário à casa:', error);
    throw error;
  }
};

// Criar morador novo e associar à casa
export const addMoradorToCasa = async (idCasa, { nome, email, senha, permissao = 'Membro' }) => {
  try {
    const response = await axiosInstance.post(`${API}/${idCasa}/usuarios/create`, {
      nome,
      email,
      senha,
      permissao
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar morador:', error?.response?.data || error?.message);
    throw error;
  }
};
