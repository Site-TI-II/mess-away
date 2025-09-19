import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

function Layout() {
  return (
    <Box sx={{ 
      display: 'flex',           // Layout flexbox
      flexDirection: 'column',   // Elementos em coluna (vertical)
      minHeight: '100vh',        // Altura mínima = altura da tela
      width: '100%',             // Largura total
      margin: 0,                 // Sem margens
      padding: 0                 // Sem padding
    }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, width: '100%' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout