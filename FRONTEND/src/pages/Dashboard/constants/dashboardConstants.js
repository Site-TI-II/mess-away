/**
 * Constantes do Dashboard - Mess Away
 * 
 * Centraliza todas as constantes usadas no Dashboard:
 * - Tipos de alertas
 * - Ações rápidas
 * - Insights inteligentes
 * - Conquistas/badges
 * - Configurações de status
 */

// ============================================================================
// TIPOS DE ALERTAS
// ============================================================================

export const ALERT_TYPES = {
  CRITICAL: 'critical',    // Tarefas muito atrasadas
  WARNING: 'warning',      // Tarefas vencendo hoje
  INFO: 'info',           // Lembretes e informações
  SUCCESS: 'success'      // Conquistas e metas alcançadas
}

export const ALERT_COLORS = {
  [ALERT_TYPES.CRITICAL]: '#f44336',   // Vermelho
  [ALERT_TYPES.WARNING]: '#ff9800',    // Laranja
  [ALERT_TYPES.INFO]: '#2196f3',       // Azul
  [ALERT_TYPES.SUCCESS]: '#4caf50'     // Verde
}

export const ALERT_ICONS = {
  [ALERT_TYPES.CRITICAL]: '🔴',
  [ALERT_TYPES.WARNING]: '🟡',
  [ALERT_TYPES.INFO]: '🔵',
  [ALERT_TYPES.SUCCESS]: '🟢'
}

// ============================================================================
// AÇÕES RÁPIDAS
// ============================================================================

export const QUICK_ACTIONS = [
  {
    id: 'add-task',
    label: 'Adicionar Tarefa',
    icon: '➕',
    path: '/tarefas',
    color: '#1976d2',
    description: 'Criar nova tarefa rapidamente'
  },
  {
    id: 'view-tasks',
    label: 'Todas Tarefas',
    icon: '📋',
    path: '/tarefas',
    color: '#2e7d32',
    description: 'Ver lista completa de tarefas'
  },
  {
    id: 'manage-houses',
    label: 'Gerenciar Casas',
    icon: '🏠',
    path: '/casas',
    color: '#9c27b0',
    description: 'Adicionar ou editar casas'
  },
  {
    id: 'manage-people',
    label: 'Responsáveis',
    icon: '👥',
    path: '/responsaveis',
    color: '#ff6f00',
    description: 'Gerenciar pessoas da casa'
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: '📊',
    path: '/relatorios',
    color: '#f57f17',
    description: 'Ver estatísticas detalhadas'
  }
]

// ============================================================================
// INSIGHTS INTELIGENTES
// ============================================================================

export const INSIGHT_TYPES = {
  PRODUCTIVITY: 'productivity',     // Insights sobre produtividade
  STREAK: 'streak',                // Sequências e consistência
  COMPARISON: 'comparison',        // Comparações temporais
  SUGGESTION: 'suggestion',        // Sugestões de melhoria
  ACHIEVEMENT: 'achievement'       // Conquistas alcançadas
}

export const SAMPLE_INSIGHTS = [
  {
    type: INSIGHT_TYPES.PRODUCTIVITY,
    icon: '🎯',
    title: 'Semana Produtiva!',
    message: 'Vocês concluíram 85% das tarefas esta semana! Continue assim!',
    color: '#4caf50'
  },
  {
    type: INSIGHT_TYPES.STREAK,
    icon: '🔥',
    title: 'Sequência Incrível!',
    message: 'Leo está em uma sequência de 7 dias sem atrasos!',
    color: '#ff6f00'
  },
  {
    type: INSIGHT_TYPES.COMPARISON,
    icon: '📅',
    title: 'Padrão Identificado',
    message: 'Terça-feira é o dia mais produtivo da casa. Agende tarefas importantes!',
    color: '#2196f3'
  },
  {
    type: INSIGHT_TYPES.SUGGESTION,
    icon: '💡',
    title: 'Dica de Organização',
    message: 'A cozinha precisa de mais atenção esta semana.',
    color: '#9c27b0'
  },
  {
    type: INSIGHT_TYPES.ACHIEVEMENT,
    icon: '🏆',
    title: 'Meta Alcançada!',
    message: 'Parabéns! 30 tarefas foram concluídas esta semana!',
    color: '#f57f17'
  }
]

// ============================================================================
// STATUS DE CASAS
// ============================================================================

export const HOUSE_STATUS = {
  EXCELLENT: 'excellent',   // 90-100% tarefas concluídas
  GOOD: 'good',            // 70-89% tarefas concluídas
  ATTENTION: 'attention',  // 50-69% tarefas concluídas
  CRITICAL: 'critical'     // 0-49% tarefas concluídas
}

export const HOUSE_STATUS_CONFIG = {
  [HOUSE_STATUS.EXCELLENT]: {
    label: 'Organizada',
    color: '#4caf50',
    icon: '✨',
    minPercentage: 90
  },
  [HOUSE_STATUS.GOOD]: {
    label: 'Boa',
    color: '#2196f3',
    icon: '👍',
    minPercentage: 70
  },
  [HOUSE_STATUS.ATTENTION]: {
    label: 'Precisa Atenção',
    color: '#ff9800',
    icon: '⚠️',
    minPercentage: 50
  },
  [HOUSE_STATUS.CRITICAL]: {
    label: 'Crítico',
    color: '#f44336',
    icon: '🚨',
    minPercentage: 0
  }
}

// ============================================================================
// CONQUISTAS E BADGES
// ============================================================================

export const ACHIEVEMENTS = [
  {
    id: 'first-task',
    name: 'Primeira Tarefa',
    icon: '🎯',
    description: 'Complete sua primeira tarefa',
    requirement: 1
  },
  {
    id: 'productive-week',
    name: 'Semana Produtiva',
    icon: '⚡',
    description: 'Complete 25+ tarefas em uma semana',
    requirement: 25
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    icon: '🌅',
    description: 'Complete 3 tarefas antes das 9h',
    requirement: 3
  },
  {
    id: 'consistency',
    name: 'Consistência',
    icon: '📅',
    description: 'Complete tarefas 7 dias seguidos',
    requirement: 7
  },
  {
    id: 'team-player',
    name: 'Espírito de Equipe',
    icon: '🤝',
    description: 'Ajude 5 responsáveis diferentes',
    requirement: 5
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    icon: '💯',
    description: 'Complete 100% das tarefas de uma semana',
    requirement: 100
  }
]

// ============================================================================
// MENSAGENS MOTIVACIONAIS
// ============================================================================

export const MOTIVATIONAL_MESSAGES = {
  HIGH_PERFORMANCE: [
    '💪 Ótimo trabalho! Vocês estão arrasando!',
    '🌟 Excelente! Continue com esse ritmo!',
    '🚀 Produtividade nas alturas! Parabéns!',
    '🎉 Vocês são demais! Continue assim!'
  ],
  MEDIUM_PERFORMANCE: [
    '👍 Bom progresso! Vocês estão quase lá!',
    '💪 Continue firme! Cada tarefa conta!',
    '🎯 No caminho certo! Não desista!',
    '⚡ Mais um pouco e vocês chegam lá!'
  ],
  LOW_PERFORMANCE: [
    '🌱 Todo começo é difícil, mas vocês conseguem!',
    '💡 Organize as prioridades e foco no que importa!',
    '🎯 Pequenos passos levam a grandes conquistas!',
    '💪 Não desista! Amanhã é um novo dia!'
  ],
  STREAK: [
    '🔥 Sequência incrível! Vocês estão imparáveis!',
    '⚡ Consistência é a chave! Continue assim!',
    '🌟 Dia após dia, vocês estão evoluindo!',
    '🎯 Foco e dedicação dão resultado!'
  ]
}

// ============================================================================
// CONFIGURAÇÕES DE PROGRESSO
// ============================================================================

export const PROGRESS_THRESHOLDS = {
  EXCELLENT: 90,  // >= 90%
  GOOD: 70,       // >= 70%
  MEDIUM: 50,     // >= 50%
  LOW: 0          // < 50%
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Retorna o status da casa baseado na porcentagem de conclusão
 */
export const getHouseStatus = (completionPercentage) => {
  if (completionPercentage >= HOUSE_STATUS_CONFIG[HOUSE_STATUS.EXCELLENT].minPercentage) {
    return HOUSE_STATUS.EXCELLENT
  }
  if (completionPercentage >= HOUSE_STATUS_CONFIG[HOUSE_STATUS.GOOD].minPercentage) {
    return HOUSE_STATUS.GOOD
  }
  if (completionPercentage >= HOUSE_STATUS_CONFIG[HOUSE_STATUS.ATTENTION].minPercentage) {
    return HOUSE_STATUS.ATTENTION
  }
  return HOUSE_STATUS.CRITICAL
}

/**
 * Retorna uma mensagem motivacional baseada na performance
 */
export const getMotivationalMessage = (completionPercentage, hasStreak = false) => {
  if (hasStreak) {
    const messages = MOTIVATIONAL_MESSAGES.STREAK
    return messages[Math.floor(Math.random() * messages.length)]
  }

  let messages
  if (completionPercentage >= PROGRESS_THRESHOLDS.EXCELLENT) {
    messages = MOTIVATIONAL_MESSAGES.HIGH_PERFORMANCE
  } else if (completionPercentage >= PROGRESS_THRESHOLDS.GOOD) {
    messages = MOTIVATIONAL_MESSAGES.MEDIUM_PERFORMANCE
  } else {
    messages = MOTIVATIONAL_MESSAGES.LOW_PERFORMANCE
  }

  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Retorna um insight aleatório (temporário - depois virá do backend)
 */
export const getRandomInsight = () => {
  return SAMPLE_INSIGHTS[Math.floor(Math.random() * SAMPLE_INSIGHTS.length)]
}