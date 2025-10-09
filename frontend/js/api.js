const API_BASE_URL = 'https://magnumopus-sw7r.onrender.com/api';

class API {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Configurar cabeçalhos da requisição
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Fazer requisição HTTP
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        username: data.username,
        email: data.email,
      }));
    }

    return data;
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // Métodos de usuário
  async getUserProfile() {
    return this.request('/users/me');
  }

  async updateUserProfile(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser() {
    return this.request('/users/me', {
      method: 'DELETE',
    });
  }

  // Métodos de listas de filmes
  async createMovieList(listData) {
    return this.request('/lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  }

  async getUserMovieLists() {
    return this.request('/lists');
  }

  async getMovieListById(listId) {
    return this.request(`/lists/${listId}`);
  }

  async updateMovieList(listId, listData) {
    return this.request(`/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(listData),
    });
  }

  async deleteMovieList(listId) {
    return this.request(`/lists/${listId}`, {
      method: 'DELETE',
    });
  }

  // Métodos de filmes
  async addMovieToList(listId, movieData) {
    return this.request(`/lists/${listId}/movies`, {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  }

  async updateMovieInList(listId, movieId, movieData) {
    return this.request(`/lists/${listId}/movies/${movieId}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    });
  }

  async deleteMovieFromList(listId, movieId) {
    return this.request(`/lists/${listId}/movies/${movieId}`, {
      method: 'DELETE',
    });
  }

  // Método para acessar lista pública
  async getPublicMovieList(shareableLink) {
    const url = `https://magnumopus-sw7r.onrender.com/public/list/${shareableLink}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Verificar se o usuário está logado
  isAuthenticated() {
    return !!this.token;
  }

  // Fazer logout
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Obter dados do usuário do localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Instância global da API
const api = new API();
