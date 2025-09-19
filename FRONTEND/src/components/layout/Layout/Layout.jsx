// src/components/layout/Layout/Layout.jsx
import { Box } from '@mui/material'

function Layout() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, width: '100%' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}