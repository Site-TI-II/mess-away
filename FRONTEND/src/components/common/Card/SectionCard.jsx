import { Card, Paper, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

/**
 * SectionCard - Componente de card modularizado para todas as seções
 * 
 * Props:
 * - icon: Componente de ícone (React component)
 * - title: Título do card (string)
 * - description: Descrição do card (string)
 * - iconColor: Cor do ícone (string)
 * - variant: Tipo do card - 'problem' | 'audience' | 'benefits'
 */
function SectionCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  variant = 'audience'
}) {
  const theme = useTheme()
  
  // Configurações simplificadas
  const isProblem = variant === 'problem'
  const isBenefits = variant === 'benefits'
  const isAudience = variant === 'audience'
  
  const CardComponent = isProblem || isBenefits ? Card : Paper
  
  return (
    <CardComponent sx={{
      height: { xs: 'auto', md: isProblem ? '320px' : '280px' },
      minHeight: isProblem ? '280px' : '260px',
      maxWidth: isProblem ? '350px' : '250px',
      mx: 'auto',
      p: { xs: 2.5, md: 3 },
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      bgcolor: theme.palette.glass.white,
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)'
      }
    }}>
      
      {/* Layout Benefits (ícone inline) */}
      {isBenefits ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Icon sx={{ 
            fontSize: { xs: 28, md: 32 },
            color: iconColor,
            mr: 1.5,
            mt: 0.5
          }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.4
          }}>
            {title}
          </Typography>
        </Box>
      ) : (
        /* Layout padrão (ícone acima) */
        <>
          <Icon sx={{ 
            fontSize: isProblem ? { xs: 50, md: 60 } : { xs: 40, md: 50 },
            color: iconColor,
            mb: 2 
          }} />
          <Typography variant="h6" sx={{ 
            mb: isAudience ? 1 : 2,
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}>
            {title}
          </Typography>
        </>
      )}
      
      {/* Descrição */}
      <Typography 
        variant={isProblem ? 'body1' : 'body2'} 
        sx={{
          flexGrow: 1,
          fontSize: isProblem 
            ? { xs: '0.9rem', md: '1rem' } 
            : { xs: '0.875rem', md: '0.9rem' },
          lineHeight: 1.6,
          color: 'text.secondary'
        }}
      >
        {description}
      </Typography>
    </CardComponent>
  )
}

export default SectionCard
