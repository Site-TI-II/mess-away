import axios from 'axios';
import { API_URL } from './config';

// Casa-scoped (legacy) – still exported for compatibility if needed
export const getGastosByCasa = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casa/${idCasa}/gastos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gastos:', error);
    throw error;
  }
};

// User-scoped (new)
export const getGastosByUsuario = async (idUsuario) => {
  try {
    const response = await axios.get(`${API_URL}/usuario/${idUsuario}/gastos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user gastos:', error);
    throw error;
  }
};

export const createGasto = async (idCasa, nome, valor) => {
  try {
    const response = await axios.post(`${API_URL}/gastos`, {
      idCasa,
      nome,
      valor,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating gasto:', error);
    throw error;
  }
};

export const createGastoUsuario = async (idUsuario, nome, valor) => {
  try {
    const response = await axios.post(`${API_URL}/gastos/usuario`, {
      idUsuario,
      nome,
      valor,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user gasto:', error);
    throw error;
  }
};

export const deleteGasto = async (idGasto) => {
  try {
    const response = await axios.delete(`${API_URL}/gastos/${idGasto}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting gasto:', error);
    throw error;
  }
};

export const deleteGastoUsuario = async (idGastoUsuario) => {
  try {
    const response = await axios.delete(`${API_URL}/gastos/usuario/${idGastoUsuario}`);
    return response.status;
  } catch (error) {
    console.error('Error deleting user gasto:', error);
    throw error;
  }
};

export const setMetaGasto = async (idCasa, valor) => {
  try {
    const response = await axios.post(`${API_URL}/casa/meta-gasto`, {
      idCasa,
      valor,
    });
    return response.data;
  } catch (error) {
    console.error('Error setting meta gasto:', error);
    throw error;
  }
};

export const setMetaGastoUsuario = async (idUsuario, valor) => {
  try {
    const response = await axios.post(`${API_URL}/usuario/meta-gasto`, {
      idUsuario,
      valor,
    });
    return response.data;
  } catch (error) {
    console.error('Error setting user meta gasto:', error);
    throw error;
  }
};

export const getMetaGasto = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casa/${idCasa}/meta-gasto`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meta gasto:', error);
    throw error;
  }
};

export const getMetaGastoUsuario = async (idUsuario) => {
  try {
    const response = await axios.get(`${API_URL}/usuario/${idUsuario}/meta-gasto`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user meta gasto:', error);
    throw error;
  }
};