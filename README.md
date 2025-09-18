# mess-away
O Mess Away é um aplicativo inovador projetado para ajudar na organização e gerenciamento de tarefas domésticas.

## 1. Criar o projeto com Vite

Optamos pelo Vite em vez do Create React App porque oferece tempos de build significativamente mais rápidos, melhor experiência de desenvolvimento com HMR mais eficiente, configuração mais moderna e flexível, e menor tamanho do bundle final.

```
npm create vite@latest FRONTEND -- --template react
cd FRONTEND
npm install
npm run dev
```

###  npm create vite@latest FRONTEND -- --template react

```
@LeoPassos98 ➜ /workspaces/mess-away (main) $ npm create vite@latest FRONTEND -- --template react
│
◇  Package name:
│  frontend
│
◇  Scaffolding project in /workspaces/mess-away/FRONTEND...
│
└  Done. Now run:

  cd FRONTEND
  npm install
  npm run dev
```

###  npm install 
```
@LeoPassos98 ➜ /workspaces/mess-away (main) $ cd FRONTEND
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm install

added 153 packages, and audited 154 packages in 11s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
###  npm run dev
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm run dev

> frontend@0.0.0 dev
> vite


  VITE v7.1.6  ready in 334 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
  h

  Shortcuts
  press r + enter to restart the server
  press u + enter to show server url
  press o + enter to open in browser
  press c + enter to clear console
  press q + enter to quit
```

## 2. Instalar React Router DOM para navegação

React Router é a biblioteca padrão para roteamento em React, oferecendo sistema de rotas aninhadas, proteção de rotas, navegação programática e histórico de navegação.

```
npm install react-router-dom
```
### npm install react-router-dom

```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm install react-router-dom

added 4 packages, and audited 158 packages in 1s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## 3. Instalar Material-UI e dependências

Material-UI foi escolhido porque oferece um sistema completo de componentes prontos seguindo o Material Design, acelera o desenvolvimento com elementos de UI previamente construídos e testados, garante consistência visual e experiência do usuário padronizada, simplifica a implementação de temas e customizações, e proporciona documentação robusta com ampla comunidade de suporte.

```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material 
```


### npm install @mui/material @emotion/react @emotion/styled
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm install @mui/material @emotion/react @emotion/styled

added 55 packages, and audited 213 packages in 8s

44 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### npm install @mui/icons-material
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm install @mui/icons-material 

added 1 package, and audited 214 packages in 41s

45 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3.1 Configurar o tema
#### Crie o arquivo src/theme/theme.js
```
// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
```

### 3.2 Configurar o Provider do tema
#### Atualize o src/main.jsx
```
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import theme from './theme/theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza o CSS */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
```
#### O QUE É O PROVIDER DO TEMA?
##### - Distribuidor de temas
O ThemeProvider é um componente do Material-UI que funciona como um "distribuidor de temas" para toda a aplicação. Ele usa o conceito de React Context para disponibilizar o tema para todos os componentes filhos.
#### COMO O PROVIDER FUNCIONA?
##### - Provider injeta o tema via React Context. Todos componentes filhos acessam as configurações automaticamente.
Sem ThemeProvider:
 ```
 // Cada componente precisa receber cores manualmente
<Button color="#1976d2">Login</Button>
<Card backgroundColor="#f5f5f5">Conteúdo</Card>
 ```
 Com ThemeProvider:
```
// Componentes automaticamente usam o tema
<Button color="primary">Login</Button> // → #1976d2
<Card>Conteúdo</Card> // → background do tema
```

### 3.3 Atualizar o arquivo HTML
#### Adicione a fonte Roboto no index.html
```
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <title>Mess Away</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### POR QUAL MOTIVO TENHO QUE ATUALIZAR O INDEX.HTML?
##### - Fontes do Google Fonts (Roboto)
O Material-UI foi designed para usar a fonte Roboto por padrão. Sem ela, o browser usará uma fonte fallback (como Arial ou Helvetica), o que altera a aparência e quebra o design system do Material Design.
##### - Ícones Materiais (Material Icons)
O MUI usa ícones de texto que requerem a fonte de ícones.

## 4. Criação das pastas do projeto

### EXPLICAÇÃO DAS PASTAS:
#### 1. assets/ - Arquivos estáticos
##### - images/ - Imagens e ícones
##### - styles/ - Estilos globais adicionais

#### 2. components/ - Componentes reutilizáveis
##### - common/ - Componentes básicos (Button, Card, etc.)
##### - layout/ - Componentes de layout (Navbar, Sidebar)

#### 3. pages/ - Páginas/views da aplicação
##### - Cada página tem sua própria pasta

#### 4. hooks/ - Custom hooks
##### - Hooks personalizados reutilizáveis

#### 5. utils/ - Funções utilitárias
##### - Helpers, formatações, constantes

#### 6. services/ - Comunicação com API
##### - Serviços, APIs, axios configurations

#### 7. context/ - Gerenciamento de estado
##### - Contextos do React para estado global

#### tree -I 'node_modules' (Para ver a estrutura da pasta FRONTEND sem a pasta 'node_modules') 
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ tree -I 'node_modules'
.
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── images
│   │   │   ├── icons
│   │   │   └── logos
│   │   ├── react.svg
│   │   └── styles
│   ├── components
│   │   ├── common
│   │   │   ├── Button
│   │   │   ├── Card
│   │   │   ├── Footer
│   │   │   └── Header
│   │   └── layout
│   │       ├── Layout
│   │       ├── Navbar
│   │       └── Sidebar
│   ├── context
│   ├── hooks
│   ├── index.css
│   ├── main.jsx
│   ├── pages 
│   │   ├── Dashboard
│   │   ├── Home
│   │   ├── Login
│   │   └── Register
│   ├── services
│   ├── theme
│   │   └── theme.js
│   └── utils
└── vite.config.js

28 directories, 13 files
```

### ARQUIVOS DE CONFIGURAÇÃO:
#### vite.config.js - Configurações do Vite (build, plugins, server)

#### eslint.config.js - Regras de linting e qualidade de código

#### package.json - Dependências e scripts do projeto

#### index.html - Página HTML principal (ponto de entrada)

### ARQUIVOS PRINCIPAIS DA APLICAÇÃO:
#### src/main.jsx - Ponto de entrada do React (renderiza a aplicação)

#### src/App.jsx - Componente raiz da aplicação

#### src/App.css - Estilos específicos do componente App

#### src/index.css - Estilos globais da aplicação

### ARQUIVO DE TEMA:
#### src/theme/theme.js - Configurações de design do Material-UI (cores, tipografia, temas)