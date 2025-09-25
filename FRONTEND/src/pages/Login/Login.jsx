import React from "react";
import "../../App.css";

function Login() {
  return (
    <div className="page login">
      {/* CONTEÚDO LOGIN */}
      <div className="login-container">
        <div className="login-card">
          <h2>Seja Bem Vindo!</h2>
          <form>
            <input type="text" placeholder="Login" />
            <input type="password" placeholder="Senha" />
            <button type="submit">Entrar</button>
          </form>
          <div className="links">
            <a href="/register">Cadastre-se</a>
            <a href="/forgot">Esqueceu sua senha?</a>
          </div>
        </div>

        {/* bolinhas decorativas */}
        <div className="circle pink"></div>
        <div className="circle teal"></div>
      </div>

      {/* RODAPÉ */}
      <footer className="footer">© 2025 Mess Away</footer>
    </div>
  );
}

export default Login;