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
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;