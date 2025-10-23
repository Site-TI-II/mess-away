// src/api/tarefas.js
import axios from 'axios'

const API_URL = 'http://localhost:4567/api'

export const listarTarefas = async (idCasa) => {
  try {
    const response = await axios.get(`${API_URL}/casas/${idCasa}/tarefas`)
    return response.data
  } catch (error) {
    console.error('Erro ao listar tarefas:', error?.response?.status, error?.response?.data || error?.message)
    throw error
  }
}

export const criarTarefa = async (tarefa) => {
  try {
    const response = await axios.post(`${API_URL}/tarefas`, tarefa)
    return response.data
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)
    throw error
  }
}

export const atualizarTarefa = async (idTarefa, tarefa) => {
  try {
    const response = await axios.put(`${API_URL}/tarefas/${idTarefa}`, tarefa)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
    throw error
  }
}

export const removerTarefa = async (idTarefa) => {
  try {
    const response = await axios.delete(`${API_URL}/tarefas/${idTarefa}`)
    return response.data
  } catch (error) {
    console.error('Erro ao remover tarefa:', error)
    throw error
  }
}

export const concluirTarefa = async (idTarefa) => {
  try {
    const response = await axios.put(`${API_URL}/tarefas/${idTarefa}/concluir`)
    return response.data
  } catch (error) {
    console.error('Erro ao concluir tarefa:', error)
    throw error
  }
}
