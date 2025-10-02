# Arquitetura do Projeto: Lista de Filmes

## 1. Visão Geral

O projeto consiste em uma aplicação web completa para gerenciamento de listas de filmes. Usuários poderão se registrar, autenticar e criar listas personalizadas, adicionando filmes com imagens e links. As listas poderão ser compartilhadas publicamente. A aplicação será dividida em um backend Node.js com arquitetura MVC e um frontend em HTML, CSS e JavaScript com uma temática gótica.

## 2. Arquitetura do Backend (Node.js)

O backend seguirá o padrão **Model-View-Controller (MVC)** para garantir uma separação clara de responsabilidades, facilitando a manutenção e escalabilidade.

### 2.1. Estrutura de Pastas

```
/backend
|-- /config         # Arquivos de configuração (ex: conexão com DB)
|-- /controllers    # Lógica de negócio e manipulação de requisições
|-- /models         # Schemas do Mongoose para o MongoDB
|-- /routes         # Definição das rotas da API
|-- /middleware     # Middlewares (ex: autenticação JWT, validação)
|-- .env            # Variáveis de ambiente
|-- package.json
|-- server.js       # Ponto de entrada da aplicação
```

### 2.2. Modelos (Mongoose)

- **User**: Armazenará informações do usuário.
  - `username` (String, required, unique)
  - `email` (String, required, unique)
  - `password` (String, required)
  - `resetPasswordToken` (String)
  - `resetPasswordExpires` (Date)

- **MovieList**: Representará uma lista de filmes criada por um usuário.
  - `name` (String, required)
  - `description` (String)
  - `owner` (ObjectId, ref: 'User', required)
  - `shareableLink` (String, unique)
  - `movies` ([MovieSchema])

- **MovieSchema** (subdocumento de MovieList):
  - `title` (String, required)
  - `imageUrl` (String)
  - `watchLinks` ([String])

### 2.3. Rotas da API (Endpoints)

| Rota                      | Método | Descrição                                        | Autenticação |
| ------------------------- | ------ | -------------------------------------------------- | ------------ |
| `/api/auth/register`      | POST   | Registrar um novo usuário                          | N/A          |
| `/api/auth/login`         | POST   | Autenticar um usuário e retornar um token JWT      | N/A          |
| `/api/auth/forgot-password` | POST   | Iniciar o processo de recuperação de senha         | N/A          |
| `/api/auth/reset-password/:token` | POST | Redefinir a senha com um token válido            | N/A          |
| `/api/users/me`           | GET    | Obter perfil do usuário logado                     | Requerida    |
| `/api/users/me`           | PUT    | Atualizar perfil do usuário logado                 | Requerida    |
| `/api/users/me`           | DELETE | Deletar conta do usuário logado                    | Requerida    |
| `/api/lists`              | POST   | Criar uma nova lista de filmes                     | Requerida    |
| `/api/lists`              | GET    | Obter todas as listas do usuário logado            | Requerida    |
| `/api/lists/:listId`      | GET    | Obter uma lista de filmes específica              | Requerida    |
| `/api/lists/:listId`      | PUT    | Atualizar uma lista de filmes                      | Requerida    |
| `/api/lists/:listId`      | DELETE | Deletar uma lista de filmes                        | Requerida    |
| `/api/lists/:listId/movies` | POST   | Adicionar um filme a uma lista                     | Requerida    |
| `/api/lists/:listId/movies/:movieId` | PUT | Atualizar um filme em uma lista                  | Requerida    |
| `/api/lists/:listId/movies/:movieId` | DELETE | Remover um filme de uma lista                    | Requerida    |
| `/public/list/:shareableLink` | GET | Acessar uma lista de filmes pública              | N/A          |

## 3. Arquitetura do Frontend (HTML/CSS/JS)

O frontend será uma aplicação de página única (SPA) básica, sem o uso de frameworks complexos, para focar na funcionalidade e na estilização gótica.

### 3.1. Estrutura de Pastas

```
/frontend
|-- /css
|   |-- style.css       # Estilos principais com temática gótica
|-- /js
|   |-- auth.js         # Lógica de autenticação (login, registro)
|   |-- api.js          # Funções para interagir com a API do backend
|   |-- main.js         # Lógica principal da aplicação (CRUD de listas/filmes)
|-- index.html          # Página principal que carregará o conteúdo dinamicamente
|-- login.html          # Página de login
|-- register.html       # Página de registro
|-- forgot-password.html # Página de recuperação de senha
```

### 3.2. Temática Gótica

- **Paleta de Cores**: Pretos, cinzas escuros, roxos profundos, vermelhos sangue e detalhes em prata ou branco.
- **Tipografia**: Fontes serifadas e com estilo gótico ou medieval para títulos (ex: `Uncial Antiqua`, `Metamorphous`). Fontes mais limpas para o corpo do texto para garantir a legibilidade.
- **Elementos Visuais**: Bordas ornamentadas, ícones de morcegos, crânios, ou outros elementos góticos sutis. Fundos com texturas de pedra ou pergaminho envelhecido.

## 4. Fluxo de Dados e Autenticação

1.  **Registro/Login**: O frontend envia as credenciais do usuário para a API.
2.  **Token JWT**: O backend valida as credenciais, gera um token JWT com o ID do usuário e o retorna.
3.  **Armazenamento do Token**: O frontend armazena o token JWT no `localStorage`.
4.  **Requisições Autenticadas**: Para cada requisição subsequente a rotas protegidas, o frontend envia o token no cabeçalho `Authorization` (ex: `Bearer <token>`).
5.  **Validação no Backend**: Um middleware no backend verifica a validade do token antes de permitir o acesso à rota.

## 5. Tecnologias e Dependências

- **Backend**:
  - `express`: Framework web para Node.js.
  - `mongoose`: ODM para interação com o MongoDB.
  - `jsonwebtoken`: Para geração e verificação de tokens JWT.
  - `bcryptjs`: Para hashing de senhas.
  - `dotenv`: Para carregar variáveis de ambiente.
  - `cors`: Para habilitar o Cross-Origin Resource Sharing.
  - `nodemailer`: Para o envio de e-mails de recuperação de senha (a ser configurado).

- **Frontend**:
  - HTML5, CSS3, JavaScript (ES6+).
  - `fetch` API para requisições ao backend.

- **Banco de Dados**:
  - MongoDB Atlas (Cloud).
