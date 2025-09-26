import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Gerenciador() {
  const [objetivo, setObjetivo] = useState("");
  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [gastos, setGastos] = useState([]);

  // Função para adicionar gasto
  const adicionarGasto = () => {
    if (nomeGasto.trim() && valorGasto.trim() && !isNaN(valorGasto)) {
      setGastos([
        ...gastos,
        { nome: nomeGasto, valor: parseFloat(valorGasto) },
      ]);
      setNomeGasto("");
      setValorGasto("");
    }
  };

  // Remover gasto
  const removerGasto = (index) => {
    setGastos(gastos.filter((_, i) => i !== index));
  };

  // Calcular total
  const total = gastos.reduce((acc, item) => acc + item.valor, 0);

  // Calcular progresso (em %)
  const progresso =
    objetivo && parseFloat(objetivo) > 0
      ? Math.min((total / parseFloat(objetivo)) * 100, 100)
      : 0;

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: 3 }}>
      {/* Campo para meta */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Objetivo de custo
        </Typography>
        <TextField
          type="number"
          fullWidth
          label="Defina sua meta (R$)"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
        />
      </Box>

      {/* Campos para adicionar gasto */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Nome do gasto"
          variant="outlined"
          value={nomeGasto}
          onChange={(e) => setNomeGasto(e.target.value)}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Valor (R$)"
          variant="outlined"
          type="number"
          value={valorGasto}
          onChange={(e) => setValorGasto(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={adicionarGasto}>
          Adicionar
        </Button>
      </Box>

      {/* Lista de gastos */}
      <Box
        sx={{
          backgroundColor: "#f0f0f0",
          borderRadius: 4,
          padding: 3,
          minHeight: "300px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
        >
          Lista de gastos
        </Typography>

        <List>
          {gastos.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: "#ffffff",
                mb: 1,
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
              }}
            >
              <Typography>
                {item.nome} - R$ {item.valor.toFixed(2)}
              </Typography>
              <IconButton color="error" onClick={() => removerGasto(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {/* Meta, barra de progresso e total */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Meta de gastos: R$ {objetivo || "0.00"}
          </Typography>

          {/* Barra de progresso */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progresso}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: "#ddd",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: total > objetivo ? "red" : "green",
                },
              }}
            />
            <Typography sx={{ mt: 1, fontWeight: "bold" }}>
              {progresso.toFixed(1)}% da meta
            </Typography>
          </Box>

          {/* Total */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: total > objetivo ? "red" : "green",
              mt: 2,
            }}
          >
            Total de gastos: R$ {total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Gerenciador;
