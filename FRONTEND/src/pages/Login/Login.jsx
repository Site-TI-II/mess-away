import React from "react";
import { Box, Paper, Typography, TextField, Button, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Login() {
  const theme = useTheme();

  // define alturas reais do header e footer
  const headerHeight = 64; // px (ajuste conforme o seu AppBar)
  const footerHeight = 40; // px (ajuste conforme seu footer fixo)

  return (
    <Box
      className="login"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
        position: "relative",
        px: 2,
      }}
    >
      {/* Card Oval */}
      <Paper
        elevation={6}
        sx={{
          background: theme.palette.gradients.solutionSection,
          borderRadius: "50% / 40%",
          p: 5,
          textAlign: "center",
          width: { xs: "100%", sm: 350 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.dark" }}>
          Seja Bem Vindo!
        </Typography>

        <TextField
          label="Login"
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{ sx: { borderRadius: 3, backgroundColor: "#fff" } }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{ sx: { borderRadius: 3, backgroundColor: "#fff" } }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            borderRadius: 5,
            background: "linear-gradient(90deg, #FF8C00, #FF7043)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          ENTRAR
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Link href="/register" underline="hover" sx={{ fontSize: "0.875rem", color: "#333" }}>
            Cadastre-se
          </Link>
          <Link href="/forgot-password" underline="hover" sx={{ fontSize: "0.875rem", color: "#333" }}>
            Esqueceu sua senha?
          </Link>
        </Box>
      </Paper>

      {/* Bolinhas decorativas */}
      <Box
        sx={{
          position: "absolute",
          bottom: 80,
          left: 100,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: theme.palette.gradients.ctaSection,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 100,
          right: 100,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: theme.palette.gradients.testimonialsSection,
          zIndex: 1,
        }}
      />
    </Box>
  );
}

export default Login;
