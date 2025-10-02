// Gerenciador principal da aplicação
class AppManager {
  constructor() {
    this.currentList = null;
    this.movieLists = [];
  }

  init() {
    // Verificar autenticação
    if (!authManager.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }
    this.loadUserLists();
  }

  async loadUserLists() {
    try {
      this.movieLists = await api.getUserMovieLists();
      this.renderDashboard();
    } catch (error) {
      showAlert('Erro ao carregar listas: ' + error.message);
    }
  }

  renderDashboard() {
    const mainContent = document.getElementById('main-content');
    const user = authManager.getCurrentUser();

    mainContent.innerHTML = `
      <div class="gothic-card fade-in">
        <h1>Bem-vindo, ${user.username}</h1>
        <p>Gerencie suas listas sombrias de filmes</p>
        
        <div style="display: flex; gap: 1rem; margin: 2rem 0; flex-wrap: wrap;">
          <button class="btn" onclick="appManager.showCreateListModal()">
            ➕ Nova Lista
          </button>
          <button class="btn" onclick="showProfile()">
            👤 Meu Perfil
          </button>
        </div>
      </div>

      <div class="movie-grid">
        ${this.movieLists.map(list => this.renderListCard(list)).join('')}
      </div>

      ${this.renderCreateListModal()}
      ${this.renderCreateMovieModal()}
      ${this.renderEditListModal()}
      ${this.renderEditMovieModal()}
    `;
  }

  renderListCard(list) {
    return `
      <div class="gothic-card fade-in">
        <h3>${list.name}</h3>
        <p style="color: var(--light-gray); margin-bottom: 1rem;">
          ${list.description || 'Sem descrição'}
        </p>
        <p style="color: var(--accent-purple); font-size: 0.9rem; margin-bottom: 1rem;">
          ${list.movies.length} filme(s)
        </p>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn" style="font-size: 0.9rem; padding: 8px 16px;" 
                  onclick="appManager.viewList('${list._id}')">
            👁️ Ver Lista
          </button>
          <button class="btn" style="font-size: 0.9rem; padding: 8px 16px;" 
                  onclick="appManager.showEditListModal('${list._id}')">
            ✏️ Editar
          </button>
          <button class="btn btn-danger" style="font-size: 0.9rem; padding: 8px 16px;" 
                  onclick="appManager.deleteList('${list._id}')">
            🗑️ Excluir
          </button>
          <button class="btn" style="font-size: 0.9rem; padding: 8px 16px;" 
                  onclick="appManager.shareList('${list.shareableLink}')">
            🔗 Compartilhar
          </button>
        </div>
      </div>
    `;
  }

  renderCreateListModal() {
    return `
      <div id="createListModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="appManager.closeModal('createListModal')">&times;</span>
          <h2>Nova Lista de Filmes</h2>
          
          <form id="createListForm" onsubmit="appManager.handleCreateList(event)">
            <div class="form-group">
              <label for="listName">Nome da Lista</label>
              <input type="text" id="listName" name="name" class="form-control" 
                     placeholder="Ex: Filmes de Terror Clássicos" required>
            </div>
            
            <div class="form-group">
              <label for="listDescription">Descrição (opcional)</label>
              <textarea id="listDescription" name="description" class="form-control" 
                        placeholder="Descreva sua lista..." rows="3"></textarea>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">
              Criar Lista
            </button>
          </form>
        </div>
      </div>
    `;
  }

  renderCreateMovieModal() {
    return `
      <div id="createMovieModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="appManager.closeModal('createMovieModal')">&times;</span>
          <h2>Adicionar Filme</h2>
          
          <form id="createMovieForm" onsubmit="appManager.handleCreateMovie(event)">
            <div class="form-group">
              <label for="movieTitle">Título do Filme</label>
              <input type="text" id="movieTitle" name="title" class="form-control" 
                     placeholder="Ex: O Exorcista" required>
            </div>
            
            <div class="form-group">
              <label for="movieImage">URL da Imagem (opcional)</label>
              <input type="url" id="movieImage" name="imageUrl" class="form-control" 
                     placeholder="https://exemplo.com/imagem.jpg">
            </div>
            
            <div class="form-group">
              <label for="movieLinks">Links para Assistir</label>
              <div id="movieLinksContainer">
                <input type="url" name="watchLink" class="form-control" 
                       placeholder="https://exemplo.com/filme" style="margin-bottom: 0.5rem;">
              </div>
              <button type="button" class="btn" style="font-size: 0.9rem; padding: 6px 12px;" 
                      onclick="appManager.addLinkField()">
                ➕ Adicionar Link
              </button>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">
              Adicionar Filme
            </button>
          </form>
        </div>
      </div>
    `;
  }

  renderEditListModal() {
    return `
      <div id="editListModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="appManager.closeModal('editListModal')">&times;</span>
          <h2>Editar Lista</h2>
          
          <form id="editListForm" onsubmit="appManager.handleEditList(event)">
            <div class="form-group">
              <label for="editListName">Nome da Lista</label>
              <input type="text" id="editListName" name="name" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="editListDescription">Descrição</label>
              <textarea id="editListDescription" name="description" class="form-control" rows="3"></textarea>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    `;
  }

  renderEditMovieModal() {
    return `
      <div id="editMovieModal" class="modal">
        <div class="modal-content">
          <span class="close" onclick="appManager.closeModal('editMovieModal')">&times;</span>
          <h2>Editar Filme</h2>
          
          <form id="editMovieForm" onsubmit="appManager.handleEditMovie(event)">
            <div class="form-group">
              <label for="editMovieTitle">Título do Filme</label>
              <input type="text" id="editMovieTitle" name="title" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="editMovieImage">URL da Imagem</label>
              <input type="url" id="editMovieImage" name="imageUrl" class="form-control">
            </div>
            
            <div class="form-group">
              <label for="editMovieLinks">Links para Assistir</label>
              <div id="editMovieLinksContainer">
                <!-- Links serão adicionados dinamicamente -->
              </div>
              <button type="button" class="btn" style="font-size: 0.9rem; padding: 6px 12px;" 
                      onclick="appManager.addEditLinkField()">
                ➕ Adicionar Link
              </button>
            </div>
            
            <button type="submit" class="btn" style="width: 100%;">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // Métodos para gerenciar listas
  showCreateListModal() {
    document.getElementById('createListModal').style.display = 'block';
  }

  async handleCreateList(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const listData = {
      name: formData.get('name'),
      description: formData.get('description')
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = showLoading(submitButton);

    try {
      await api.createMovieList(listData);
      this.closeModal('createListModal');
      form.reset();
      await this.loadUserLists();
      showAlert('Lista criada com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao criar lista: ' + error.message);
    } finally {
      hideLoading();
    }
  }

  showEditListModal(listId) {
    const list = this.movieLists.find(l => l._id === listId);
    if (!list) return;

    document.getElementById('editListName').value = list.name;
    document.getElementById('editListDescription').value = list.description || '';
    document.getElementById('editListForm').dataset.listId = listId;
    document.getElementById('editListModal').style.display = 'block';
  }

  async handleEditList(event) {
    event.preventDefault();
    
    const form = event.target;
    const listId = form.dataset.listId;
    const formData = new FormData(form);
    const listData = {
      name: formData.get('name'),
      description: formData.get('description')
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = showLoading(submitButton);

    try {
      await api.updateMovieList(listId, listData);
      this.closeModal('editListModal');
      await this.loadUserLists();
      showAlert('Lista atualizada com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao atualizar lista: ' + error.message);
    } finally {
      hideLoading();
    }
  }

  async deleteList(listId) {
    if (!confirm('Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.deleteMovieList(listId);
      await this.loadUserLists();
      showAlert('Lista excluída com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao excluir lista: ' + error.message);
    }
  }

  shareList(shareableLink) {
    const shareUrl = `${window.location.origin}/public.html?list=${shareableLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lista de Filmes',
        text: 'Confira esta lista de filmes!',
        url: shareUrl
      });
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        showAlert('Link copiado para a área de transferência!', 'success');
      }).catch(() => {
        // Fallback do fallback: mostrar o link
        prompt('Copie este link para compartilhar:', shareUrl);
      });
    }
  }

  // Métodos para visualizar lista
  async viewList(listId) {
    try {
      this.currentList = await api.getMovieListById(listId);
      this.renderListView();
    } catch (error) {
      showAlert('Erro ao carregar lista: ' + error.message);
    }
  }

  renderListView() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
      <div class="gothic-card fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h1>${this.currentList.name}</h1>
            <p style="color: var(--light-gray);">${this.currentList.description || 'Sem descrição'}</p>
          </div>
          <button class="btn" onclick="showDashboard()">
            ← Voltar
          </button>
        </div>
        
        <button class="btn" onclick="appManager.showCreateMovieModal()">
          ➕ Adicionar Filme
        </button>
      </div>

      <div class="movie-grid">
        ${this.currentList.movies.map(movie => this.renderMovieCard(movie)).join('')}
      </div>

      ${this.renderCreateMovieModal()}
      ${this.renderEditMovieModal()}
    `;
  }

  renderMovieCard(movie) {
    return `
      <div class="movie-card fade-in">
        ${movie.imageUrl ? `<img src="${movie.imageUrl}" alt="${movie.title}" onerror="this.style.display='none'">` : ''}
        <div class="movie-card-content">
          <h3>${movie.title}</h3>
          
          ${movie.watchLinks && movie.watchLinks.length > 0 ? `
            <div class="movie-links">
              ${movie.watchLinks.map((link, index) => `
                <a href="${link}" target="_blank" class="movie-link">
                  Assistir ${movie.watchLinks.length > 1 ? (index + 1) : ''}
                </a>
              `).join('')}
            </div>
          ` : `
                                <p style="color: var(--light-gray); font-style: italic;">
                                    Nenhum link disponível
                                </p>
                            `}
          
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
            <button class="btn" style="font-size: 0.8rem; padding: 6px 12px;" 
                    onclick="appManager.showEditMovieModal('${movie._id}')">
              ✏️ Editar
            </button>
            <button class="btn btn-danger" style="font-size: 0.8rem; padding: 6px 12px;" 
                    onclick="appManager.deleteMovie('${movie._id}')">
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Métodos para gerenciar filmes
  showCreateMovieModal() {
    if (!this.currentList) {
      showAlert('Selecione uma lista primeiro');
      return;
    }
    document.getElementById('createMovieModal').style.display = 'block';
  }

  addLinkField() {
    const container = document.getElementById('movieLinksContainer');
    const input = document.createElement('input');
    input.type = 'url';
    input.name = 'watchLink';
    input.className = 'form-control';
    input.placeholder = 'https://exemplo.com/filme';
    input.style.marginBottom = '0.5rem';
    container.appendChild(input);
  }

  async handleCreateMovie(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const watchLinks = Array.from(form.querySelectorAll('input[name="watchLink"]'))
      .map(input => input.value)
      .filter(link => link.trim() !== '');

    const movieData = {
      title: formData.get('title'),
      imageUrl: formData.get('imageUrl'),
      watchLinks
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = showLoading(submitButton);

    try {
      await api.addMovieToList(this.currentList._id, movieData);
      this.closeModal('createMovieModal');
      form.reset();
      // Resetar container de links
      document.getElementById('movieLinksContainer').innerHTML = `
        <input type="url" name="watchLink" class="form-control" 
               placeholder="https://exemplo.com/filme" style="margin-bottom: 0.5rem;">
      `;
      await this.viewList(this.currentList._id);
      showAlert('Filme adicionado com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao adicionar filme: ' + error.message);
    } finally {
      hideLoading();
    }
  }

  showEditMovieModal(movieId) {
    const movie = this.currentList.movies.find(m => m._id === movieId);
    if (!movie) return;

    document.getElementById('editMovieTitle').value = movie.title;
    document.getElementById('editMovieImage').value = movie.imageUrl || '';
    
    // Preencher links
    const container = document.getElementById('editMovieLinksContainer');
    container.innerHTML = '';
    
    if (movie.watchLinks && movie.watchLinks.length > 0) {
      movie.watchLinks.forEach(link => {
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'watchLink';
        input.className = 'form-control';
        input.value = link;
        input.style.marginBottom = '0.5rem';
        container.appendChild(input);
      });
    } else {
      this.addEditLinkField();
    }

    document.getElementById('editMovieForm').dataset.movieId = movieId;
    document.getElementById('editMovieModal').style.display = 'block';
  }

  addEditLinkField() {
    const container = document.getElementById('editMovieLinksContainer');
    const input = document.createElement('input');
    input.type = 'url';
    input.name = 'watchLink';
    input.className = 'form-control';
    input.placeholder = 'https://exemplo.com/filme';
    input.style.marginBottom = '0.5rem';
    container.appendChild(input);
  }

  async handleEditMovie(event) {
    event.preventDefault();
    
    const form = event.target;
    const movieId = form.dataset.movieId;
    const formData = new FormData(form);
    
    const watchLinks = Array.from(form.querySelectorAll('input[name="watchLink"]'))
      .map(input => input.value)
      .filter(link => link.trim() !== '');

    const movieData = {
      title: formData.get('title'),
      imageUrl: formData.get('imageUrl'),
      watchLinks
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const hideLoading = showLoading(submitButton);

    try {
      await api.updateMovieInList(this.currentList._id, movieId, movieData);
      this.closeModal('editMovieModal');
      await this.viewList(this.currentList._id);
      showAlert('Filme atualizado com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao atualizar filme: ' + error.message);
    } finally {
      hideLoading();
    }
  }

  async deleteMovie(movieId) {
    if (!confirm('Tem certeza que deseja excluir este filme?')) {
      return;
    }

    try {
      await api.deleteMovieFromList(this.currentList._id, movieId);
      await this.viewList(this.currentList._id);
      showAlert('Filme excluído com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao excluir filme: ' + error.message);
    }
  }

  // Utilitários
  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }
}

// Funções globais
function showDashboard() {
  appManager.renderDashboard();
}

function showProfile() {
  const mainContent = document.getElementById('main-content');
  const user = authManager.getCurrentUser();

  mainContent.innerHTML = `
    <div class="gothic-card fade-in">
      <h1>Meu Perfil</h1>
      
      <form id="profileForm" onsubmit="handleUpdateProfile(event)">
        <div class="form-group">
          <label for="profileUsername">Nome de Usuário</label>
          <input type="text" id="profileUsername" name="username" class="form-control" 
                 value="${user.username}" required>
        </div>
        
        <div class="form-group">
          <label for="profileEmail">Email</label>
          <input type="email" id="profileEmail" name="email" class="form-control" 
                 value="${user.email}" required>
        </div>
        
        <div class="form-group">
          <label for="profilePassword">Nova Senha (deixe em branco para manter a atual)</label>
          <input type="password" id="profilePassword" name="password" class="form-control" 
                 placeholder="Nova senha (opcional)">
        </div>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button type="submit" class="btn">
            Salvar Alterações
          </button>
          <button type="button" class="btn" onclick="showDashboard()">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger" onclick="handleDeleteAccount()">
            Excluir Conta
          </button>
        </div>
      </form>
    </div>
  `;
}

async function handleUpdateProfile(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const userData = {
    username: formData.get('username'),
    email: formData.get('email')
  };

  const password = formData.get('password');
  if (password) {
    userData.password = password;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const hideLoading = showLoading(submitButton);

  try {
    const updatedUser = await api.updateUserProfile(userData);
    
    // Atualizar dados no localStorage
    localStorage.setItem('user', JSON.stringify({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    }));

    showAlert('Perfil atualizado com sucesso!', 'success');
  } catch (error) {
    showAlert('Erro ao atualizar perfil: ' + error.message);
  } finally {
    hideLoading();
  }
}

async function handleDeleteAccount() {
  if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todas as suas listas serão perdidas.')) {
    return;
  }

  if (!confirm('Esta é sua última chance. Tem CERTEZA ABSOLUTA que deseja excluir sua conta?')) {
    return;
  }

  try {
    await api.deleteUser();
    authManager.logout();
  } catch (error) {
    showAlert('Erro ao excluir conta: ' + error.message);
  }
}

// Instância global do gerenciador da aplicação
const appManager = new AppManager();

// Chamar init do appManager após a inicialização do authManager e do DOM
document.addEventListener("DOMContentLoaded", () => {
  // authManager já é inicializado no auth.js
  if (authManager.isAuthenticated()) {
    appManager.init(); // Inicializa o appManager apenas se o usuário estiver autenticado
  }
});
