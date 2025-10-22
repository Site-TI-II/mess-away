import axios from 'axios';

const API_URL = 'http://localhost:4567/MessAway';

export const listInsights = (type = null) => {
  const url = type 
    ? `${API_URL}/insights?type=${type}`
    : `${API_URL}/insights`;
  return axios.get(url).then(response => response.data);
};