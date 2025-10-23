import axios from 'axios';
import { API_URL } from './config';

export const getGastosByCasa = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casa/${idCasa}/gastos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gastos:', error);
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

export const deleteGasto = async (idGasto) => {
  try {
    const response = await axios.delete(`${API_URL}/gastos/${idGasto}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting gasto:', error);
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

export const getMetaGasto = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casa/${idCasa}/meta-gasto`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meta gasto:', error);
    throw error;
  }
};