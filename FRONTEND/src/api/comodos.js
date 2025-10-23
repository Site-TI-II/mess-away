// src/api/comodos.js
import axios from 'axios'

const API_URL = 'http://localhost:4567/api'

export const listarComodos = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casas/${idCasa}/comodos`)
    return response.data
  } catch (error) {
    console.error('Erro ao listar cômodos:', error)
    throw error
  }
}

export const criarComodo = async (comodo) => {
  try {
    const response = await axios.post(`${API_URL}/comodos`, comodo)
    return response.data
  } catch (error) {
    console.error('Erro ao criar cômodo:', error)
    throw error
  }
}

export const listarCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`)
    return response.data
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    throw error
  }
}
