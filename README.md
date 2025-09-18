# mess-away
O Mess Away é um aplicativo inovador projetado para ajudar na organização e gerenciamento de tarefas domésticas.

## 1. Criar o projeto com Vite

Optamos pelo Vite em vez do Create React App porque oferece tempos de build significativamente mais rápidos, melhor experiência de desenvolvimento com HMR mais eficiente, configuração mais moderna e flexível, e menor tamanho do bundle final.

```
cd FRONTEND
npm create vite@latest FRONTEND -- --template react
npm install
npm run dev
```

###  npm create vite@latest FRONTEND -- --template react

```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm create vite@latest FRONTEND -- --template react
Need to install the following packages:
create-vite@7.1.2
Ok to proceed? (y) y
│
◇  Scaffolding project in /workspaces/mess-away/FRONTEND...
│
└  Done. Now run:

  cd messaway
  npm install
  npm run dev

npm notice 
npm notice New major version of npm available! 9.8.1 -> 11.6.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
npm notice Run npm install -g npm@11.6.0 to update!
npm notice 
```

###  npm install 
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm install 

added 153 packages, and audited 154 packages in 7s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

```
###  npm run dev
```
@LeoPassos98 ➜ /workspaces/mess-away/FRONTEND (main) $ npm run dev

> messaway@0.0.0 dev
> vite


  VITE v7.1.6  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
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

# 3. Instalar e configurar TailwindCSS

TailwindCSS foi escolhido porque permite desenvolvimento rápido com classes utilitárias, garante consistência visual, elimina a necessidade de nomear classes CSS e facilita a manutenção e escalabilidade do design.

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```


### npm install -D tailwindcss postcss autoprefixer
```
@LeoPassos98 ➜ /workspaces/mess-away (main) $ npm install -D tailwindcss postcss autoprefixer

added 16 packages in 1s

7 packages are looking for funding
  run `npm fund` for details
```