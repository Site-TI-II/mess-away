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
 * Generate smart insight for a casa
 * @param {Object} casaData - Casa information
 * @param {string} casaData.casaName - Name of the casa
 * @param {number} casaData.totalTasks - Total number of tasks
 * @param {number} casaData.completedTasks - Number of completed tasks
 * @returns {Promise} AI-generated insight
 */
export const generateCasaInsight = async ({ casaName, totalTasks, completedTasks }) => {
  try {
    const response = await axios.post(`${API_URL}/ai/casa-insight`, {
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
