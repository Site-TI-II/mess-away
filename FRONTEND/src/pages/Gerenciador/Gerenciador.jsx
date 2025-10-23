import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  getGastosByCasa,
  createGasto,
  deleteGasto,
  setMetaGasto,
  getMetaGasto,
} from "../../api/gastos";

function Gerenciador() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [objetivo, setObjetivo] = useState("");
  const [nomeGasto, setNomeGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [gastos, setGastos] = useState([]);
  const [casaId, setCasaId] = useState(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(userJson);
    let casaIdFromStorage = user.casaId || user.idCasa;
    
    // If casaId not in user object, try to get it from the account
    if (!casaIdFromStorage && user.idConta) {
      // We'll fetch it from the backend - for now just redirect to dashboard
      console.log("User doesn't have casaId, redirecting to dashboard");
      navigate("/dashboard");
      return;
    }
    
    if (!casaIdFromStorage) {
      console.log("No casaId found, redirecting to home");
      navigate("/");
      return;
    }
    
    setCasaId(casaIdFromStorage);

    const loadData = async () => {
      try {
        const [gastosData, metaData] = await Promise.all([
          getGastosByCasa(casaIdFromStorage),
          getMetaGasto(casaIdFromStorage),
        ]);
        setGastos(gastosData);
        if (metaData && !metaData.message) {
          setObjetivo(metaData.valor.toString());
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Erro ao carregar dados. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Função para adicionar gasto
  const adicionarGasto = async () => {
    if (nomeGasto.trim() && valorGasto.trim() && !isNaN(valorGasto) && casaId) {
      try {
        setError(null);
        const novoGasto = await createGasto(
          casaId,
          nomeGasto.trim(),
          parseFloat(valorGasto)
        );
        setGastos([novoGasto, ...gastos]);
        setNomeGasto("");
        setValorGasto("");
      } catch (err) {
        setError("Erro ao adicionar gasto. Por favor, tente novamente.");
      }
    }
  };

  // Remover gasto
  const removerGasto = async (idGasto) => {
    try {
      setError(null);
      await deleteGasto(idGasto);
      setGastos(gastos.filter((item) => item.idGasto !== idGasto));
    } catch (err) {
      setError("Erro ao remover gasto. Por favor, tente novamente.");
    }
  };

  // Função para atualizar objetivo
  const atualizarObjetivo = async (novoObjetivo) => {
    if (!casaId || !novoObjetivo || isNaN(novoObjetivo)) return;
    try {
      setError(null);
      await setMetaGasto(casaId, parseFloat(novoObjetivo));
      setObjetivo(novoObjetivo);
    } catch (err) {
      setError("Erro ao atualizar meta. Por favor, tente novamente.");
    }
  };

  // Calcular total
  const total = gastos.reduce((acc, item) => acc + item.valor, 0);

  // Calcular progresso (em %)
  const progresso =
    objetivo && parseFloat(objetivo) > 0
      ? Math.min((total / parseFloat(objetivo)) * 100, 100)
      : 0;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
          onBlur={(e) => atualizarObjetivo(e.target.value)}
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
              <IconButton color="error" onClick={() => removerGasto(item.idGasto)}>
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
