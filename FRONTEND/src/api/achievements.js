import axios from 'axios';

const API_URL = 'http://localhost:4567/MessAway';

export const listAchievements = () => 
  axios.get(`${API_URL}/achievements`)
    .then(response => response.data);

export const getUserAchievements = (userId) =>
  axios.get(`${API_URL}/usuarios/${userId}/achievements`)
    .then(response => response.data);

export const getCasaAchievements = (casaId) =>
  axios.get(`${API_URL}/casas/${casaId}/achievements`)
    .then(response => response.data);

export const unlockAchievement = (userId, achievementId) =>
  axios.post(`${API_URL}/usuarios/${userId}/achievements/${achievementId}/unlock`)
    .then(response => response.data);

export const simulatePoints = (casaId, points) =>
  axios.post(`${API_URL}/casas/${casaId}/simulate-points`, { points })
    .then(response => response.data);

export const getCasaPoints = (casaId) =>
  axios.get(`${API_URL}/casas/${casaId}`)
    .then(response => response.data);
