import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700',
      light: '#FAF0E6',
      dark: '#6E6E6E',
    },
    secondary: {
      main: '#98FF98',
      light: '#D4FFD4',
      dark: '#4CAF50',
    },
    // Paleta de gradientes para seções da landing page
    gradients: {
      // Gradiente azul-roxo para Hero Section
      heroPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      // Gradiente sutil cinza-azul para Problem Section
      problemSection: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      problemSecundarySection: 'linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)',
      // Gradientes futuros para outras seções
      solutionSection: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      featuresSection: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      testimonialsSection: 'linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)',
      ctaSection: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    },
    // Cores específicas para textos em gradientes
    gradientText: {
      // Para títulos com gradiente
      heroPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #ff6b6b 0%, #667eea 100%)',
      success: 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)',
      light: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    // Cores de overlay para elementos transparentes
    overlay: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      dark: 'rgba(0, 0, 0, 0.1)',
      darkMedium: 'rgba(0, 0, 0, 0.2)',
    },
    // Cores para glass morphism effects
    glass: {
      white: 'rgba(255, 255, 255, 0.9)',
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.1)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  // Breakpoints personalizados se necessário
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;