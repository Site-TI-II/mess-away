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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { listarCasas, criarCasa, deletarCasa } from '../../api/casas';
import { listUsuariosByConta, addUsuarioToConta } from '../../api/contas';

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

  const handleAdicionarCasa = () => {
    if (novoNomeCasa.trim() === '') return;
    const novaCasa = { nome: novoNomeCasa };
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

  const handleAdicionarPessoa = () => {
    if (novoNomePessoa.trim() === '') return;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user.idConta) {
      alert('Conta não encontrada. Faça login ou crie uma conta primeiro.');
      return;
    }
    // call backend to create profile (no idUsuario)
    addUsuarioToConta(user.idConta, { apelido: novoNomePessoa, cor: '#673ab7', permissao: 'Membro' }).then((res) => {
      // res is created ContaUsuario
      const novasCasas = casas.map(casa => {
        if (casa.id === casaSelecionadaId || casaSelecionadaId == null) {
          const novaPessoa = { id: res.id, nome: res.apelido || novoNomePessoa, papel: res.permissao || 'Membro', cor: res.cor };
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
        <Dialog open={addCasaDialogOpen} onClose={() => setAddCasaDialogOpen(false)}>
          <DialogTitle>Adicionar Nova Casa</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Casa"
              type="text"
              fullWidth
              variant="standard"
              value={novoNomeCasa}
              onChange={(e) => setNovoNomeCasa(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdicionarCasa()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddCasaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdicionarCasa}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  const numeroDeLinhasVazias = Math.max(0, 8 - (casaAtual.pessoas?.length || 0));

  return (
    <>
      <Box sx={{ minHeight: '100vh', p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
          {casas.map(casa => (
            <Box key={casa.id} sx={{ position: 'relative', mr: 1, mb: 1 }}>
              <Button
                variant={casa.id === casaSelecionadaId ? "contained" : "outlined"}
                onClick={() => setCasaSelecionadaId(casa.id)}
                sx={{ pr: '30px' }}
              >
                {casa.nome}
              </Button>
              <IconButton
                size="small"
                onClick={() => handleDeletarCasa(casa.id)}
                sx={{ position: 'absolute', top: 0, right: 0, p: '4px' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button variant="contained" onClick={() => setAddCasaDialogOpen(true)} sx={{ minWidth: '40px', p: '6px 12px' }}>
            <AddIcon />
          </Button>
        </Box>

        <Box sx={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Avatar alt={casaAtual.nome} src={casaAtual.imagem} sx={{ width: 120, height: 120, mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {editingItemId === casaAtual.id ? (
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={handleSaveEdit}
                  autoFocus
                  variant="standard"
                />
              ) : (
                <>
                  <Chip label={casaAtual.nome} sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }} />
                  <IconButton size="small" onClick={() => handleStartEdit(casaAtual)} sx={{ ml: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          <List sx={{ p: 0 }}>
            {(casaAtual.pessoas || []).map(pessoa => (
              <ListItem key={pessoa.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eeeeee', p: '8px 16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 2 }} alt={pessoa.nome} />
                  {editingItemId === pessoa.id ? (
                    <TextField
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={handleSaveEdit}
                      autoFocus
                      variant="standard"
                    />
                  ) : (
                    <>
                      <Chip
                        label={pessoa.nome}
                        size="small"
                        sx={{ backgroundColor: '#673ab7', color: 'white', fontWeight: 'bold', mr: 1 }}
                      />
                      <Chip label={pessoa.papel} size="small" />
                      <IconButton size="small" onClick={() => handleStartEdit(pessoa)} sx={{ ml: 1 }}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  )}
                </Box>
                <IconButton size="small" color="error" onClick={() => handleRemoverPessoa(pessoa.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}

            <ListItem button onClick={() => setAddPessoaDialogOpen(true)} sx={{ borderTop: '1px solid #eeeeee', p: '12px 16px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                <AddIcon sx={{ mr: 1.5 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Adicionar Pessoa</Typography>
              </Box>
            </ListItem>

            {Array.from({ length: numeroDeLinhasVazias }).map((_, index) => (
              <ListItem
                key={`empty-${index}`}
                sx={{ height: '48px', backgroundColor: '#fff0f5', borderTop: '1px solid #e0e0e0' }}
              />
            ))}
          </List>
        </Box>
      </Box>

      {/* Diálogo para adicionar pessoa */}
      <Dialog open={addPessoaDialogOpen} onClose={() => setAddPessoaDialogOpen(false)}>
        <DialogTitle>Adicionar Nova Pessoa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Pessoa"
            type="text"
            fullWidth
            variant="standard"
            value={novoNomePessoa}
            onChange={(e) => setNovoNomePessoa(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdicionarPessoa()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPessoaDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdicionarPessoa}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar casa */}
      <Dialog open={addCasaDialogOpen} onClose={() => setAddCasaDialogOpen(false)}>
        <DialogTitle>Adicionar Nova Casa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Casa"
            type="text"
            fullWidth
            variant="standard"
            value={novoNomeCasa}
            onChange={(e) => setNovoNomeCasa(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdicionarCasa()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCasaDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdicionarCasa}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Casas;
