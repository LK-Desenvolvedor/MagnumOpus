# Projeto: Magnum Opus - Lista de Filmes Gótica

Este projeto é uma aplicação web completa para gerenciamento de listas de filmes, com um sistema de autenticação robusto, funcionalidades CRUD para listas e filmes, compartilhamento público de listas e um mecanismo de recuperação de senha. O backend é construído com Node.js seguindo a arquitetura MVC, enquanto o frontend é desenvolvido em HTML, CSS e JavaScript puro, com uma temática gótica.

## Funcionalidades

- **Autenticação de Usuário**: Registro, Login e Logout.
- **Recuperação de Senha**: Funcionalidade "Esqueceu sua senha?" completa.
- **Gerenciamento de Perfil**: CRUD para o perfil do usuário.
- **Listas de Filmes**: Crie, visualize, edite e exclua suas listas de filmes.
- **Filmes**: Adicione, edite e remova filmes de suas listas, incluindo título, imagem e múltiplos links para assistir.
- **Compartilhamento Público**: Compartilhe suas listas de filmes com um link público, permitindo que qualquer pessoa visualize sem necessidade de login.
- **Temática Gótica**: Interface de usuário estilizada com um design sombrio e elegante.

## Tecnologias Utilizadas

### Backend (Node.js)

- **Express.js**: Framework web para Node.js.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB.
- **MongoDB Atlas**: Banco de dados NoSQL na nuvem.
- **JWT (JSON Web Tokens)**: Para autenticação segura.
- **Bcrypt.js**: Para hashing de senhas.
- **Dotenv**: Para gerenciamento de variáveis de ambiente.
- **CORS**: Para permitir requisições de diferentes origens.
- **Nodemailer**: Para envio de e-mails (recuperação de senha).
- **UUID**: Para geração de links compartilháveis únicos.

### Frontend (HTML, CSS, JavaScript)

- **HTML5**: Estrutura da página.
- **CSS3**: Estilização com temática gótica.
- **JavaScript (ES6+)**: Lógica de interação com o usuário e comunicação com a API.
- **Fetch API**: Para requisições HTTP ao backend.

## Estrutura do Projeto

```
. (raiz do projeto)
├── backend/
│   ├── config/            
│   ├── controllers/       
│   ├── middleware/         
│   ├── models/            
│   ├── routes/             
│   ├── .env                
│   ├── package.json        
│   └── server.js           
├── frontend/
│   ├── css/               
│   │   └── style.css
│   ├── js/                 
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── main.js
│   ├── forgot-password.html
│   ├── index.html          
│   ├── login.html          
│   ├── public.html         
│   ├── register.html       
│   └── reset-password.html 
├── project_architecture.md 
└── README.md              
```


### 1. Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Uma conta no MongoDB Atlas (para o banco de dados)
- Uma conta de e-mail (Gmail, por exemplo) para Nodemailer (recuperação de senha)

### 2. Configuração do Backend

1.  **Clone o repositório (ou crie os arquivos manualmente conforme a estrutura):**
    ```bash
    # Se você clonou um repositório vazio, crie as pastas e arquivos conforme a estrutura acima.
    # Caso contrário, navegue até a pasta do projeto.
    ```

2.  **Navegue até a pasta `backend`:**
    ```bash
    cd backend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Crie um arquivo `.env` na pasta `backend`** com as seguintes variáveis:
    ```
    MONGO_URI=mongodb+srv://listadefilmesapp_db_user:FXoK3o9vfVgSspz9@cluster0.tj2dhnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=M9@8W35rvhao5H$wuh@5gU
    PORT=3000
    EMAIL_USER=seuemail@gmail.com     
    EMAIL_PASS=suasenhaapp             
    ```
    - **`MONGO_URI`**: A string de conexão do seu cluster MongoDB Atlas. Certifique-se de que o usuário `listadefilmesapp_db_user` tenha permissões de leitura e escrita para o banco de dados.
    - **`JWT_SECRET`**: Uma string secreta forte e única para assinar seus tokens JWT.
    - **`PORT`**: A porta em que o servidor backend será executado.
    - **`EMAIL_USER` e `EMAIL_PASS`**: Credenciais para o Nodemailer. Se estiver usando Gmail, você precisará gerar uma [senha de aplicativo](https://support.google.com/accounts/answer/185833?hl=pt-BR) para usar em vez da sua senha normal, caso tenha autenticação de dois fatores ativada.

5.  **Inicie o servidor backend:**
    ```bash
    npm start
    # Ou para desenvolvimento com recarregamento automático:
    # npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000`.

### 3. Configuração do Frontend

1.  **Navegue até a pasta `frontend`:**
    ```bash
    cd frontend
    ```

2.  **Abra os arquivos HTML diretamente no seu navegador.**
    - `login.html`: Para fazer login ou registrar-se.
    - `register.html`: Para criar uma nova conta.
    - `forgot-password.html`: Para iniciar o processo de recuperação de senha.
    - `index.html`: A página principal do dashboard (requer login).
    - `public.html?list=<shareableLink>`: Para visualizar uma lista compartilhada (substitua `<shareableLink>` pelo link gerado).

    **Importante**: Certifique-se de que o backend esteja rodando antes de tentar acessar o frontend, pois ele se comunica com a API em `http://localhost:3000`.

## Uso da Aplicação

1.  **Registro e Login**: Acesse `register.html` para criar uma conta ou `login.html` para entrar.
2.  **Dashboard**: Após o login, você será redirecionado para `index.html`, onde poderá ver suas listas de filmes.
3.  **Criar Lista**: Clique em "➕ Nova Lista" para criar uma nova lista de filmes.
4.  **Gerenciar Lista**: Clique em "👁️ Ver Lista" para adicionar, editar ou excluir filmes de uma lista específica.
5.  **Gerenciar Filmes**: Dentro de uma lista, você pode adicionar filmes com título, URL de imagem e múltiplos links para assistir.
6.  **Perfil**: Acesse "👤 Meu Perfil" para atualizar suas informações ou excluir sua conta.
7.  **Compartilhar**: Use o botão "🔗 Compartilhar" em uma lista para obter um link público. Este link pode ser acessado por qualquer pessoa via `public.html?list=<shareableLink>`.

## Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes. 

