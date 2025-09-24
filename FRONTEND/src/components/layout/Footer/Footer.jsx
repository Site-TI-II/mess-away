import { Box } from '@mui/material'

function Footer() {
  return (
    <Box 
      component="footer"
      sx={{
        bgcolor: 'grey.800',
        color: 'white',
        width: '100%'
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px' },
        margin: '0 auto',
        px: { xs: 2, sm: 3, md: 4, lg: 2 },
        py: { xs: 2, sm: 3 },
        textAlign: 'center'
      }}>
        {/* Copyright dinâmico com ano atual */}
        © {new Date().getFullYear()} Mess Away - Organize suas tarefas domésticas
      </Box>
    </Box>
  )
}

export default Footer