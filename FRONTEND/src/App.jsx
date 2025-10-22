import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Tarefas from './pages/Tarefas/Tarefas';
import Gerenciador from './pages/Gerenciador'; 
import Casas from './pages/Casas'; 
import ForgotPassword from './pages/ForgotPassword';
import theme from './theme/theme';


import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tarefas" element={<Tarefas />} />
          <Route path="gerenciador" element={<Gerenciador />} />
          <Route path="casas" element={<Casas />} /> 
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
