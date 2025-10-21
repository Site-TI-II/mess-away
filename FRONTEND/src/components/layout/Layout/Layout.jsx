// src/components/layout/Layout/Layout.jsx

import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Navbar from '../Navbar'
import Footer from '../Footer'

function Layout() {
  const theme = useTheme()

  return (
    <Box 
      sx={{
        display: 'flex',          // ✅ Flex aqui está OK
        flexDirection: 'column',  // ✅ Column aqui está OK
        minHeight: '100vh',
        width: '100%',
        background: `linear-gradient(180deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.grey[50]} 100%
        )`,
        position: 'relative'
      }}
    >
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',           // ✅ Importante!
          flexDirection: 'column',   // ✅ Importante!
          animation: 'fadeIn 0.3s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout