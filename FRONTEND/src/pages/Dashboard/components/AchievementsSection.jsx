import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  Paper,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

const ACHIEVEMENT_TIERS = {
  BRONZE: {
    color: '#CD7F32',
    minPoints: 0,
    label: 'Bronze'
  },
  SILVER: {
    color: '#C0C0C0',
    minPoints: 100,
    label: 'Prata'
  },
  GOLD: {
    color: '#FFD700',
    minPoints: 500,
    label: 'Ouro'
  },
  PLATINUM: {
    color: '#E5E4E2',
    minPoints: 1000,
    label: 'Platina'
  }
};

/**
 * AchievementsSection - Dynamic achievements display for casa
 * Shows all achievements earned by the casa with proper tier logic:
 * - If achievement 4 is earned, achievements 1-3 are automatically included
 * - If achievement 5 is earned, achievements 1-4 are automatically included
 * This is handled by displaying achievements based on requirement_value
 */
const AchievementsSection = ({ achievements = [], totalPoints = 0 }) => {
  const theme = useTheme();

  // Find current tier based on points
  const getCurrentTier = (points) => {
    const tiers = Object.entries(ACHIEVEMENT_TIERS).reverse();
    const currentTier = tiers.find(([_, tier]) => points >= tier.minPoints);
    return currentTier ? currentTier[0] : 'BRONZE';
  };

  // Calculate progress to next tier
  const getNextTierProgress = (points) => {
    const tiers = Object.entries(ACHIEVEMENT_TIERS);
    const currentTierIndex = tiers.findIndex(([_, tier]) => points < tier.minPoints);
    
    if (currentTierIndex === -1) {
      // Max tier reached
      return 100;
    }

    const currentTier = currentTierIndex > 0 ? tiers[currentTierIndex - 1][1] : { minPoints: 0 };
    const nextTier = tiers[currentTierIndex][1];
    
    const progress = ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Get tier for a specific achievement based on its requirement value
  const getAchievementTier = (requirementValue) => {
    if (requirementValue >= 1000) return 'PLATINUM';
    if (requirementValue >= 500) return 'GOLD';
    if (requirementValue >= 100) return 'SILVER';
    return 'BRONZE';
  };

  const currentTier = getCurrentTier(totalPoints);
  const progress = getNextTierProgress(totalPoints);

  // Sort achievements by requirement_value to show progression
  const sortedAchievements = [...achievements].sort((a, b) => 
    (a.requirementValue || 0) - (b.requirementValue || 0)
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <EmojiEvents sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div">
            Conquistas
          </Typography>
        </Box>

        {/* Current Progress */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Nível: {ACHIEVEMENT_TIERS[currentTier].label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalPoints} pontos
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: ACHIEVEMENT_TIERS[currentTier].color,
              },
            }}
          />
        </Box>

        {/* Achievements Grid */}
        {sortedAchievements.length > 0 ? (
          <Grid container spacing={2}>
            {sortedAchievements.map((achievement) => {
              const achievementTier = getAchievementTier(achievement.requirementValue || 0);
              
              return (
                <Grid item xs={4} key={achievement.id || achievement.idAchievement}>
                  <Tooltip 
                    title={
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{achievement.name}</Typography>
                        <Typography variant="caption">{achievement.description}</Typography>
                        <Typography variant="caption" display="block" mt={0.5}>
                          {achievement.requirementValue} pontos necessários
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        bgcolor: theme.palette.background.paper,
                        border: `2px solid ${ACHIEVEMENT_TIERS[achievementTier].color}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[6],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                          fontSize: '32px',
                        }}
                      >
                        {achievement.icon || '🏆'}
                      </Box>
                      <Typography 
                        variant="body2" 
                        component="div" 
                        gutterBottom
                        sx={{
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: ACHIEVEMENT_TIERS[achievementTier].color,
                          fontWeight: 'bold'
                        }}
                      >
                        {ACHIEVEMENT_TIERS[achievementTier].label}
                      </Typography>
                    </Paper>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: theme.palette.text.secondary 
            }}
          >
            <EmojiEvents sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">
              Nenhuma conquista desbloqueada ainda
            </Typography>
            <Typography variant="caption">
              Complete tarefas para ganhar pontos e desbloquear conquistas!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;