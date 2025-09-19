// Imports dos componentes Material-UI para layout e interface
import { 
  Box,          // Container flexível para layout
  Typography,   // Componente para textos com tipografia do tema
  Grid,         // Sistema de grid responsivo
  Card,         // Container com elevação e bordas arredondadas
  CardContent,  // Área de conteúdo interno do Card
  Paper         // Componente base com elevação (não usado neste código)
} from '@mui/material'

// Imports dos ícones Material Design
import AssignmentIcon from '@mui/icons-material/Assignment'     // Ícone de tarefas/assignments
import CheckCircleIcon from '@mui/icons-material/CheckCircle'   // Ícone de check/concluído

function Dashboard() {
  return (
    // Container principal da página
    <Box sx={{ 
      maxWidth: '1200px',           // Largura máxima do conteúdo
      margin: '0 auto',             // Centraliza horizontalmente
      padding: { xs: 2, md: 3 }     // Padding responsivo: 16px mobile, 24px desktop
    }}>
      
      {/* Título principal da página */}
      <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
        📊 Dashboard
      </Typography>
      
      {/* Subtítulo/descrição */}
      <Typography variant="body1" sx={{ mb: 4 }}>
        Bem-vindo ao seu painel de controle!
      </Typography>
      
      {/* Container Grid responsivo para os cards */}
      <Grid container spacing={3}>
        
        {/* Card 1: Tarefas Pendentes */}
        <Grid item xs={12} sm={6} md={4}>  {/* Responsivo: 100% mobile → 50% tablet → 33% desktop */}
          <Card sx={{ height: '100%' }}>   {/* Card com altura total para uniformidade */}
            <CardContent sx={{ textAlign: 'center' }}>  {/* Conteúdo centralizado */}
              
              {/* Ícone de tarefas pendentes */}
              <AssignmentIcon 
                sx={{ 
                  fontSize: 40,           // Tamanho do ícone: 40px
                  color: 'warning.main',  // Cor laranja/amarela do tema (pendente)
                  mb: 1                   // Margin bottom: 8px
                }} 
              />
              
              {/* Título do card */}
              <Typography variant="h6" component="h3" gutterBottom>
                Tarefas Pendentes
              </Typography>
              
              {/* Número de tarefas - destaque */}
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                5
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>
        
        {/* Card 2: Tarefas Concluídas */}
        <Grid item xs={12} sm={6} md={4}>  {/* Mesmo layout responsivo */}
          <Card sx={{ height: '100%' }}>   {/* Altura uniforme com o card anterior */}
            <CardContent sx={{ textAlign: 'center' }}>  {/* Conteúdo centralizado */}
              
              {/* Ícone de tarefas concluídas */}
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 40,           // Tamanho do ícone: 40px
                  color: 'success.main',  // Cor verde do tema (sucesso/concluído)
                  mb: 1                   // Margin bottom: 8px
                }} 
              />
              
              {/* Título do card */}
              <Typography variant="h6" component="h3" gutterBottom>
                Tarefas Concluídas
              </Typography>
              
              {/* Número de tarefas - destaque */}
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                12
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>
      
    </Box>
  )
}

export default Dashboard