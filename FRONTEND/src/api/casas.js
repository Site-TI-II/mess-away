import axios from 'axios';

const API = 'http://localhost:4567/MessAway/casas';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const listarCasas = () => axiosInstance.get(API);
export const criarCasa = (casa) => {
  console.log('Enviando requisição para criar casa:', casa);
  return axiosInstance.post(API, casa);
};
export const deletarCasa = (id) => axiosInstance.delete(`${API}/${id}`);
