import axios from 'axios';

const API = 'http://localhost:4567/MessAway/casas';

export const listarCasas = () => axios.get(API);
export const criarCasa = (casa) => axios.post(API, casa);
export const deletarCasa = (id) => axios.delete(`${API}/${id}`);
