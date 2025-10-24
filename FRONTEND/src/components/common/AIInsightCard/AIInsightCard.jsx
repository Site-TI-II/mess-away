import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import { generateCasaInsight, isAIAvailable } from '../../../api/ai';

/**
 * AIInsightCard - Displays AI-generated insights for a casa
 * Globally enabled Claude Sonnet 4.5 integration
 */
const AIInsightCard = ({ casaId, casaName, totalTasks, completedTasks }) => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    const available = await isAIAvailable();
    setAiAvailable(available);
    if (available && casaName) {
      fetchInsight();
    } else {
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateCasaInsight({
        casaName,
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0
      });

      if (response.error) {
        setError(response.message || 'Failed to generate insight');
      } else {
        setInsight(response.content);
      }
    } catch (err) {
      setError('Unable to connect to AI service');
      console.error('AI insight error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchInsight();
  };

  // Don't render if AI is not available
  if (!aiAvailable) {
    return null;
  }

  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesomeIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="h2">
              AI Insights
            </Typography>
            <Chip 
              label="Claude Sonnet 4.5" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            />
          </Box>
          <IconButton 
            onClick={handleRefresh} 
            disabled={loading}
            sx={{ color: 'white' }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress sx={{ color: 'white' }} size={40} />
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#d32f2f'
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && insight && (
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              fontSize: '1rem',
              fontStyle: 'italic',
              opacity: 0.95
            }}
          >
            {insight}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
