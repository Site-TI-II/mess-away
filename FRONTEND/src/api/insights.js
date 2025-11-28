import axios from 'axios';

const API_URL = 'http://localhost:4567';

// Dados de fallback para quando o backend não está disponível
const FALLBACK_INSIGHTS = [
  {
    id: 1,
    type: 'financeiro',
    icon: '💰',
    title: 'Economia do Mês',
    message: 'Você economizou 15% nos gastos da casa este mês! Continue assim para atingir suas metas financeiras.',
    color: '#4caf50',
    active: true,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 2,
    type: 'tarefas',
    icon: '✅',
    title: 'Produtividade Alta',
    message: 'Sua casa completou 87% das tarefas desta semana. Vocês estão muito organizados!',
    color: '#2196f3',
    active: true,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 3,
    type: 'energia',
    icon: '💡',
    title: 'Consumo Consciente',
    message: 'O consumo de energia da casa reduziu 12% comparado ao mês passado. Ótimo trabalho!',
    color: '#ff9800',
    active: true,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 4,
    type: 'social',
    icon: '👥',
    title: 'Colaboração Perfeita',
    message: 'Todos os moradores contribuíram igualmente nas tarefas domésticas. Que harmonia!',
    color: '#9c27b0',
    active: true,
    dataCriacao: new Date().toISOString()
  }
];

export const listInsights = async (type = null) => {
  try {
    // Tenta buscar do backend primeiro
    const urls = [
      `${API_URL}/api/insights`,
      `${API_URL}/MessAway/insights`
    ];
    
    let response = null;
    for (const url of urls) {
      try {
        const fullUrl = type ? `${url}?type=${type}` : url;
        response = await axios.get(fullUrl, { timeout: 5000 });
        if (response.data && Array.isArray(response.data)) {
          console.log('✅ Insights carregados do backend:', response.data.length);
          return response.data;
        }
      } catch (err) {
        console.log(`⚠️ Tentativa falhou para ${url}:`, err.message);
        continue;
      }
    }
    
    // Se chegou aqui, o backend não está disponível
    throw new Error('Backend não disponível');
    
  } catch (error) {
    console.warn('⚠️ Backend não disponível, usando dados de demonstração:', error.message);
    
    // Filtra por tipo se especificado
    const filtered = type 
      ? FALLBACK_INSIGHTS.filter(insight => insight.type === type)
      : FALLBACK_INSIGHTS;
    
    return filtered;
  }
};