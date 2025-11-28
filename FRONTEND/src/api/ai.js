import axios from 'axios';

const API_URL = 'http://localhost:4567/MessAway';

/**
 * AI Service Client for Claude Sonnet 4.5
 * Globally enabled for all clients
 */

/**
 * Check if AI service is configured and ready
 * @returns {Promise} Status object with configured, model, and status
 */
export const checkAIStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/ai/status`);
    return response.data;
  } catch (error) {
    console.error('Error checking AI status:', error);
    throw error;
  }
};

/**
 * Generate AI response with Claude Sonnet 4.5
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - The user's prompt/question
 * @param {string} [params.context] - Optional system context
 * @param {number} [params.maxTokens] - Max tokens to generate (default: 1024)
 * @param {number} [params.temperature] - Temperature 0-1 (default: 1.0)
 * @returns {Promise} AI response with content, model, and tokens used
 */
export const generateAIResponse = async ({ prompt, context, maxTokens, temperature }) => {
  try {
    const response = await axios.post(`${API_URL}/ai/generate`, {
      prompt,
      context,
      maxTokens,
      temperature
    });
    return response.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error.response?.data) {
      return error.response.data; // Return error response from server
    }
    throw error;
  }
};

/**
 * Generate smart insight for a casa with detailed analysis
 * @param {Object} casaData - Casa information
 * @param {number} casaData.casaId - ID of the casa
 * @param {string} casaData.casaName - Name of the casa
 * @param {number} casaData.totalTasks - Total number of tasks
 * @param {number} casaData.completedTasks - Number of completed tasks
 * @returns {Promise} AI-generated insight
 */
export const generateCasaInsight = async ({ casaId, casaName, totalTasks, completedTasks }) => {
  try {
    const response = await axios.post(`${API_URL}/ai/casa-insight`, {
      casaId,
      casaName,
      totalTasks,
      completedTasks
    });
    return response.data;
  } catch (error) {
    console.error('Error generating casa insight:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

/**
 * Generate task suggestions using AI
 * @param {Object} params - Parameters for suggestion
 * @param {string} params.casaName - Name of the casa
 * @param {string} params.roomName - Name of the room/comodo
 * @param {number} [params.count] - Number of suggestions (default: 3)
 * @returns {Promise} AI-generated task suggestions
 */
export const generateTaskSuggestions = async ({ casaName, roomName, count = 3 }) => {
  const prompt = `Suggest ${count} specific, practical daily tasks for ${roomName} in ${casaName}. Be brief and actionable.`;
  const context = 'You are a home organization assistant. Provide practical, specific task suggestions.';
  
  try {
    const response = await generateAIResponse({
      prompt,
      context,
      maxTokens: 300,
      temperature: 0.7
    });
    return response;
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    throw error;
  }
};

/**
 * Classify task priority automatically using AI
 * @param {Object} taskData - Task information
 * @param {string} taskData.taskName - Name/title of the task
 * @param {string} [taskData.description] - Optional description
 * @param {string} [taskData.dueDate] - Optional due date
 * @param {number} [taskData.casaId] - Optional casa ID for context
 * @returns {Promise} AI classification with priority (1-3) and reasoning
 */
export const classifyTaskPriority = async ({ taskName, description, dueDate, casaId }) => {
  try {
    const response = await axios.post(`${API_URL}/ai/classify-task`, {
      taskName,
      description,
      dueDate,
      casaId
    });
    return response.data;
  } catch (error) {
    console.error('Error classifying task priority:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

/**
 * Get intelligent recommendations for task optimization
 * @param {Object} taskData - Task information
 * @param {string} taskData.taskName - Name/title of the task
 * @param {string} [taskData.description] - Optional description
 * @param {number} [taskData.priority] - Current priority (1-3)
 * @param {string} [taskData.room] - Room/comodo name
 * @returns {Promise} AI recommendations and tips
 */
export const getTaskRecommendations = async ({ taskName, description, priority, room }) => {
  const prompt = `
    Tarefa: "${taskName}"
    Descrição: ${description || 'Não informada'}
    Prioridade: ${priority || 'Não definida'}
    Cômodo: ${room || 'Não especificado'}
    
    Dê 2-3 dicas rápidas e práticas para executar esta tarefa de forma eficiente.
  `;
  
  const context = `
    Você é um especialista em organização doméstica. Dê conselhos práticos e específicos.
    Considere tempo necessário, frequência ideal, e melhores práticas.
    Seja direto e útil em português do Brasil.
  `;
  
  try {
    const response = await generateAIResponse({
      prompt,
      context,
      maxTokens: 200,
      temperature: 0.6
    });
    return response;
  } catch (error) {
    console.error('Error getting task recommendations:', error);
    throw error;
  }
};

/**
 * Hook to check if AI features are available
 * @returns {Promise<boolean>} True if AI is configured and ready
 */
export const isAIAvailable = async () => {
  try {
    const status = await checkAIStatus();
    return status.configured === true;
  } catch (error) {
    console.error('AI not available:', error);
    return false;
  }
};
