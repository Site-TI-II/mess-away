import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { listarCasas, criarCasa, deletarCasa } from '../../api/casas';
import { listUsuariosByConta, addUsuarioToConta } from '../../api/contas';
// Componentes do novo frontend (pós-merge)
import AddCasaDialog from './components/AddCasaDialog';
import AddPessoaDialog from './components/AddPessoaDialog';
import CasaCard from './components/CasaCard';
import CasaDetails from './components/CasaDetails';

function Casas() {
  const [casas, setCasas] = useState([]);
  const [casaSelecionadaId, setCasaSelecionadaId] = useState(null);
  const [addPessoaDialogOpen, setAddPessoaDialogOpen] = useState(false);
  const [addCasaDialogOpen, setAddCasaDialogOpen] = useState(false);
  const [novoNomePessoa, setNovoNomePessoa] = useState('');
  const [novoNomeCasa, setNovoNomeCasa] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const casaAtual = casas.find(c => c.id === casaSelecionadaId);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    listarCasas().then(res => {
      setCasas(res.data);
      if (res.data.length > 0) {
        setCasaSelecionadaId(res.data[0].id);
      } else {
        setCasaSelecionadaId(null);
      }
    });
    // load profiles for conta (if available)
    if (user && user.idConta) {
      listUsuariosByConta(user.idConta).then((res) => {
        // res is array of ContaUsuario objects
        if (res && res.length > 0) {
          // Set profiles for the first casa to the server result (overwrite to avoid duplicates)
          setCasas(prev => {
            if (!prev || prev.length === 0) return prev;
            const updated = [...prev];
            const mapped = res.map(p => ({ id: p.id, nome: p.apelido || 'Morador', papel: p.permissao || 'Membro', cor: p.cor }));
            updated[0] = { ...updated[0], pessoas: mapped };
            return updated;
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!casas.find(c => c.id === casaSelecionadaId) && casas.length > 0) {
      setCasaSelecionadaId(casas[0].id);
    } else if (casas.length === 0) {
      setCasaSelecionadaId(null);
    }
  }, [casas, casaSelecionadaId]);

  // Aceita nome opcional vindo do AddCasaDialog
  const handleAdicionarCasa = (nomeOpcional) => {
    const nome = (nomeOpcional ?? novoNomeCasa).trim();
    if (nome === '') return;
    const novaCasa = { nome };
    criarCasa(novaCasa)
      .then((response) => {
        console.log('Casa criada com sucesso:', response.data);
        return listarCasas();
      })
      .then(res => {
        console.log('Casas atualizadas:', res.data);
        setCasas(res.data);
        setNovoNomeCasa('');
        setAddCasaDialogOpen(false);
      })
      .catch(error => {
        console.error('Erro ao criar casa:', error);
        alert(error.response?.data?.message || 'Erro ao criar casa. Por favor, tente novamente.');
      });
  };

  const handleDeletarCasa = (casaId) => {
    if (window.confirm("Tem certeza que deseja deletar esta casa?")) {
      deletarCasa(casaId).then(() => {
        listarCasas().then(res => setCasas(res.data));
      });
    }
  };

  // Aceita nome opcional vindo do AddPessoaDialog
  const handleAdicionarPessoa = (nomeOpcional) => {
    const nome = (nomeOpcional ?? novoNomePessoa).trim();
    if (nome === '') return;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.idConta) {
      alert('Conta não encontrada. Faça login ou crie uma conta primeiro.');
      return;
    }
    // call backend to create profile (no idUsuario)
    addUsuarioToConta(user.idConta, { apelido: nome, cor: '#673ab7', permissao: 'Membro' }).then((res) => {
      // res is created ContaUsuario
      const novasCasas = casas.map(casa => {
        if (casa.id === casaSelecionadaId || casaSelecionadaId == null) {
          const novaPessoa = { id: res.id, nome: res.apelido || nome, papel: res.permissao || 'Membro', cor: res.cor };
          const existentes = casa.pessoas || [];
          const dedup = [...existentes, novaPessoa].reduce((acc, p) => {
            if (!acc.some(x => x.id === p.id)) acc.push(p);
            return acc;
          }, []);
          return { ...casa, pessoas: dedup };
        }
        return casa;
      });
      setCasas(novasCasas);
      setNovoNomePessoa('');
      setAddPessoaDialogOpen(false);
    }).catch(() => {
      alert('Erro ao adicionar pessoa');
    });
  };

  const handleRemoverPessoa = (pessoaId) => {
    const novasCasas = casas.map(casa => {
      if (casa.id === casaSelecionadaId) {
        const novasPessoas = (casa.pessoas || []).filter(p => p.id !== pessoaId);
        return { ...casa, pessoas: novasPessoas };
      }
      return casa;
    });
    setCasas(novasCasas);
  };

  // Editar nome da casa (somente client-side por enquanto)
  const handleEditarCasaNome = (casaId, novoNome) => {
    setCasas(prev => prev.map(c => c.id === casaId ? { ...c, nome: novoNome } : c));
  };

  // Editar nome da pessoa (somente client-side por enquanto)
  const handleEditarPessoaNome = (pessoaId, novoNome) => {
    setCasas(prev => prev.map(c => {
      if (c.id !== casaSelecionadaId) return c;
      const pessoas = (c.pessoas || []).map(p => p.id === pessoaId ? { ...p, nome: novoNome } : p);
      return { ...c, pessoas };
    }));
  };

  const handleStartEdit = (item) => {
    setEditingItemId(item.id);
    setEditingText(item.nome);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingText('');
  };

  const handleSaveEdit = () => {
    if (editingText.trim() === '') return handleCancelEdit();
    const novasCasas = casas.map(casa => {
      if (casa.id === editingItemId) {
        return { ...casa, nome: editingText };
      }
      if (casa.id === casaSelecionadaId) {
        return {
          ...casa,
          pessoas: (casa.pessoas || []).map(pessoa =>
            pessoa.id === editingItemId ? { ...pessoa, nome: editingText } : pessoa
          )
        };
      }
      return casa;
    });
    setCasas(novasCasas);
    handleCancelEdit();
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') handleSaveEdit();
    if (event.key === 'Escape') handleCancelEdit();
  };

  if (!casaAtual) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Nenhuma casa cadastrada.</Typography>
        <Button variant="contained" onClick={() => setAddCasaDialogOpen(true)} sx={{ mt: 2 }}>
          Adicionar Primeira Casa
        </Button>
        <AddCasaDialog
          open={addCasaDialogOpen}
          onClose={() => setAddCasaDialogOpen(false)}
          onAdd={(nomeCasa) => handleAdicionarCasa(nomeCasa)}
        />
      </Box>
    );
  }

  const numeroDeLinhasVazias = Math.max(0, 8 - (casaAtual.pessoas?.length || 0));

  return (
    <>
      <Box sx={{ minHeight: '100vh', p: 3 }}>
        {/* Grid de Casas com CasaCard */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="stretch">
            {casas.map((casa) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={casa.id}>
                <CasaCard
                  casa={{ ...casa, pessoas: casa.pessoas || [] }}
                  isSelected={casa.id === casaSelecionadaId}
                  onClick={() => setCasaSelecionadaId(casa.id)}
                  onDelete={handleDeletarCasa}
                />
              </Grid>
            ))}
            {/* Card para adicionar nova casa */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button variant="contained" onClick={() => setAddCasaDialogOpen(true)} sx={{ width: '100%', height: '100%' }}>
                <AddIcon />&nbsp;Adicionar Casa
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Detalhes da casa selecionada */}
        {casaAtual && (
          <CasaDetails
            casa={{ ...casaAtual, pessoas: casaAtual.pessoas || [] }}
            onEditCasaNome={handleEditarCasaNome}
            onEditPessoaNome={handleEditarPessoaNome}
            onDeletePessoa={handleRemoverPessoa}
            onAddPessoaClick={() => setAddPessoaDialogOpen(true)}
          />
        )}
      </Box>

      {/* Diálogo para adicionar pessoa (componente do novo frontend) */}
      <AddPessoaDialog
        open={addPessoaDialogOpen}
        onClose={() => setAddPessoaDialogOpen(false)}
        onAdd={(nomePessoa) => handleAdicionarPessoa(nomePessoa)}
        casaNome={casaAtual?.nome}
      />

      {/* Diálogo para adicionar casa (componente do novo frontend) */}
      <AddCasaDialog
        open={addCasaDialogOpen}
        onClose={() => setAddCasaDialogOpen(false)}
        onAdd={(nomeCasa) => handleAdicionarCasa(nomeCasa)}
      />
    </>
  );
}

export default Casas;
