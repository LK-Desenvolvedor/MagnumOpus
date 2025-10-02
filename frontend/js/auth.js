// Utilitários para autenticação
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    // Verificar se o usuário está logado ao carregar a página
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.showAuthenticatedState();
    } else {
      this.showUnauthenticatedState();
    }
  }

  showAuthenticatedState() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Atualizar navbar
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
      navbarNav.innerHTML = `
        <li><a href="#" onclick="showDashboard()">Minhas Listas</a></li>
        <li><a href="#" onclick="showProfile()">Perfil</a></li>
        <li><a href="#" onclick="authManager.logout()">Sair</a></li>
      `;
    }

    // Mostrar dashboard se estivermos na página principal
    // A chamada a showDashboard será feita após a inicialização completa do appManager
    // para evitar ReferenceError. Por enquanto, apenas redireciona se necessário.
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      // Não chamar showDashboard diretamente aqui, pois appManager pode não estar pronto.
      // A lógica de renderização inicial será movida para main.js ou chamada após ambos os scripts estarem carregados.
    }
  }

  showUnauthenticatedState() {
    // Atualizar navbar
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
      navbarNav.innerHTML = `
        <li><a href="login.html">Login</a></li>
        <li><a href="register.html">Registrar</a></li>
      `;
    }

    // Redirecionar para login se estivermos em uma página protegida
    const protectedPages = ['/index.html', '/'];
    if (protectedPages.includes(window.location.pathname)) {
      window.location.href = 'login.html';
    }
  }

  async login(email, password) {
    try {
      const data = await api.login({ email, password });
      this.showAuthenticatedState();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const data = await api.register({ username, email, password });
      this.showAuthenticatedState();
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    api.logout();
    this.showUnauthenticatedState();
    window.location.href = 'login.html';
  }

  getCurrentUser() {
    return api.getCurrentUser();
  }

  isAuthenticated() {
    return api.isAuthenticated();
  }
}

// Funções para manipular formulários de autenticação
function showAlert(message, type = 'error') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const container = document.querySelector('.container');
  const firstCard = container.querySelector('.gothic-card');
  
  // Remover alertas existentes
  const existingAlerts = container.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());

  // Inserir novo alerta
  container.insertBefore(alertDiv, firstCard);

  // Remover alerta após 5 segundos
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function showLoading(button) {
  const originalText = button.textContent;
  button.innerHTML = '<span class="loading"></span> Carregando...';
  button.disabled = true;
  
  return () => {
    button.textContent = originalText;
    button.disabled = false;
  };
}

// Manipuladores de formulário
async function handleLogin(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;
  const submitButton = form.querySelector('button[type="submit"]');
  
  const hideLoading = showLoading(submitButton);

  try {
    await authManager.login(email, password);
    showAlert('Login realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showAlert(error.message);
  } finally {
    hideLoading();
  }
}

async function handleRegister(event) {
  event.preventDefault();
  
  const form = event.target;
  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const submitButton = form.querySelector('button[type="submit"]');

  if (password !== confirmPassword) {
    showAlert('As senhas não coincidem');
    return;
  }

  const hideLoading = showLoading(submitButton);

  try {
    await authManager.register(username, email, password);
    showAlert('Conta criada com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showAlert(error.message);
  } finally {
    hideLoading();
  }
}

async function handleForgotPassword(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.email.value;
  const submitButton = form.querySelector('button[type="submit"]');
  
  const hideLoading = showLoading(submitButton);

  try {
    await api.forgotPassword(email);
    showAlert('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
  } catch (error) {
    showAlert(error.message);
  } finally {
    hideLoading();
  }
}

async function handleResetPassword(event) {
  event.preventDefault();
  
  const form = event.target;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const submitButton = form.querySelector('button[type="submit"]');

  if (password !== confirmPassword) {
    showAlert('As senhas não coincidem');
    return;
  }

  // Obter token da URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showAlert('Token de recuperação não encontrado');
    return;
  }

  const hideLoading = showLoading(submitButton);

  try {
    await api.resetPassword(token, password);
    showAlert('Senha redefinida com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } catch (error) {
    showAlert(error.message);
  } finally {
    hideLoading();
  }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();
