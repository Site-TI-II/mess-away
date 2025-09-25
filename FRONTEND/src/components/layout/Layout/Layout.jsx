import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

function Layout() {
  // Container responsivo centralizado para consistência
  const containerStyles = {
    width: '100%',
    maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px' },
    margin: '0 auto',
    px: { xs: 2, sm: 3, md: 4, lg: 2 }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      bgcolor: 'background.default'
    }}>
      
      {/* Header/Navbar - full width sem container */}
      <Navbar />

      {/* Main Content - com container responsivo */}
      <Box
        component="main"
        sx={{
          ...containerStyles,
          flex: 1,
          py: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Outlet />
      </Box>

      {/* Footer - full width sem container */}
      <Footer />
      
    </Box>
  )
}

export default Layout