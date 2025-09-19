function Login() {
  return (
    <div>
      <h2>🔐 Login</h2>
      <form style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email: </label>
          <input type="email" style={{ padding: '0.5rem', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Senha: </label>
          <input type="password" style={{ padding: '0.5rem', width: '100%' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
export default Login