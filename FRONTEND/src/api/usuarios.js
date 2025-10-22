import axios from 'axios';

const API = 'http://localhost:4567/MessAway/usuarios';

export const changePassword = (email, newPassword) => axios.post(`${API}/trocar-senha`, { email, newPassword });
