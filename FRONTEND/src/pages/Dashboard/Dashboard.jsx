function Dashboard() {
  return (
    <div>
      <h2>📊 Dashboard</h2>
      <p>Bem-vindo ao seu painel de controle!</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📋 Tarefas Pendentes</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>5</p>
        </div>
        
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>✅ Tarefas Concluídas</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</p>
        </div>
      </div>
    </div>
  )
}
export default Dashboard