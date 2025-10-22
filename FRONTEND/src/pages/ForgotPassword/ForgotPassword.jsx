import React from 'react'
import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PasswordChange from '../../components/common/PasswordChange'

export default function ForgotPassword() {
  const theme = useTheme()
  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', py: 6, background: theme.palette.gradients.heroPrimary }}>
      <Container maxWidth="sm">
        <PasswordChange />
      </Container>
    </Box>
  )
}
