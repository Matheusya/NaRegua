// Sistema de Autenticação - auth.js

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadSession();
        // Adicionar listener para mudança de aba/foco
        this.setupVisibilityListener();
    }

    // Configurar listener para detectar mudança de aba
    setupVisibilityListener() {
        // Recarregar sessão quando a aba voltar a ter foco
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadSession();
            }
        });
        
        // Recarregar sessão quando a janela recuperar o foco
        window.addEventListener('focus', () => {
            this.loadSession();
        });
        
        // Salvar sessão periodicamente para manter sincronizada
        setInterval(() => {
            if (this.currentUser) {
                this.saveSession(this.currentUser);
            }
        }, 30000); // A cada 30 segundos
    }

    // Carregar sessão salva
    loadSession() {
        const sessionData = localStorage.getItem('naRegua_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                // Verificar se a sessão não expirou (24 horas)
                const sessionTime = new Date(session.timestamp);
                const now = new Date();
                const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);

                if (hoursDiff < 24) {
                    this.currentUser = session.user;
                    // Disparar evento customizado para notificar outras partes da aplicação
                    window.dispatchEvent(new CustomEvent('sessionLoaded', { detail: this.currentUser }));
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Erro ao carregar sessão:', error);
                this.logout();
            }
        }
    }

    // Salvar sessão
    saveSession(user) {
        const session = {
            user: user,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('naRegua_session', JSON.stringify(session));
        this.currentUser = user;
    }

    // Fazer login
    login(email, senha) {
        // Tentar encontrar nos clientes
        const clientes = window.db.getClientes();
        const cliente = clientes.find(c => c.email.toLowerCase() === email.toLowerCase());

        // Tentar encontrar nos barbeiros
        const barbeiros = window.db.getBarbeirosAuth();
        const barbeiro = barbeiros.find(b => b.email.toLowerCase() === email.toLowerCase());

        const pessoa = cliente || barbeiro;

        if (!pessoa) {
            return {
                success: false,
                message: 'Email não encontrado. Verifique suas credenciais ou cadastre-se.'
            };
        }

        // Verificar senha
        if (pessoa.senha !== senha) {
            return {
                success: false,
                message: 'Senha incorreta. Tente novamente.'
            };
        }

        // Criar objeto de usuário sem a senha
        const user = {
            id: pessoa.id,
            nome: pessoa.nome,
            email: pessoa.email,
            telefone: pessoa.telefone,
            dataNascimento: pessoa.dataNascimento,
            tipo: barbeiro ? 'barbeiro' : 'cliente'
        };

        // Se for barbeiro, adicionar informações extras
        if (barbeiro) {
            user.especialidade = barbeiro.especialidade;
            user.experiencia = barbeiro.experiencia;
            user.rating = barbeiro.rating;
        }

        // Salvar sessão
        this.saveSession(user);

        return {
            success: true,
            user: user
        };
    }

    // Fazer logout
    logout() {
        localStorage.removeItem('naRegua_session');
        this.currentUser = null;
        // Disparar evento de logout para atualizar a interface
        window.dispatchEvent(new CustomEvent('userLogout'));
    }

    // Verificar se está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se precisa de autenticação para a página
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Verificar se é barbeiro
    isBarbeiro() {
        return this.currentUser && this.currentUser.tipo === 'barbeiro';
    }

    // Verificar se é cliente
    isCliente() {
        return this.currentUser && this.currentUser.tipo === 'cliente';
    }

    // Verificar autenticação apenas para barbeiros
    requireBarbeiroAuth(redirectUrl = 'login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        if (!this.isBarbeiro()) {
            Utils.showNotification('Acesso restrito a barbeiros', 'error');
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }

    // Atualizar dados do usuário na sessão
    updateUserSession(updates) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...updates };
            const session = {
                user: this.currentUser,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('naRegua_session', JSON.stringify(session));
        }
    }
}

// Inicializar gerenciador de autenticação
window.auth = new AuthManager();

// Adicionar função para mostrar informações do usuário logado
function mostrarUsuarioLogado() {
    const user = window.auth.getCurrentUser();
    if (user) {
        // Criar elemento de usuário no header se não existir
        const navbar = document.querySelector('.nav-menu');
        if (navbar && !document.querySelector('.user-info')) {
            const userInfo = document.createElement('li');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-button">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.nome.split(' ')[0]}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-menu">
                        <div class="user-menu-header">
                            <strong>${user.nome}</strong>
                            <small>${user.email}</small>
                        </div>
                        <div class="user-menu-items">
                            ${user.tipo === 'barbeiro' ? `
                                <a href="painel-barbeiro.html">
                                    <i class="fas fa-chart-line"></i>
                                    Painel do Barbeiro
                                </a>
                            ` : `
                                <a href="painel.html">
                                    <i class="fas fa-calendar"></i>
                                    Meus Agendamentos
                                </a>
                                <a href="agendamento.html">
                                    <i class="fas fa-calendar-plus"></i>
                                    Novo Agendamento
                                </a>
                            `}
                            <a href="#" onclick="editarPerfil(event)">
                                <i class="fas fa-user-edit"></i>
                                Editar Perfil
                            </a>
                            <a href="#" onclick="fazerLogout(event)">
                                <i class="fas fa-sign-out-alt"></i>
                                Sair
                            </a>
                        </div>
                    </div>
                </div>
            `;
            navbar.appendChild(userInfo);

            // Toggle menu dropdown
            const userButton = userInfo.querySelector('.user-button');
            const userMenu = userInfo.querySelector('.user-menu');
            
            userButton.addEventListener('click', function(e) {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', function() {
                userMenu.classList.remove('show');
            });
        }
    }
}

function fazerLogout(event) {
    if (event) event.preventDefault();
    
    if (confirm('Deseja realmente sair?')) {
        window.auth.logout();
        Utils.showNotification('Logout realizado com sucesso!', 'success');
        
        // Remover menu do usuário imediatamente
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.remove();
        }
        
        // Determinar para onde redirecionar baseado na localização atual
        setTimeout(() => {
            // Se estiver na pasta pages, volta para index.html
            if (window.location.pathname.includes('/pages/')) {
                window.location.href = '../index.html';
            } else {
                // Se já está na raiz, apenas recarrega
                window.location.reload();
            }
        }, 500);
    }
}

function editarPerfil(event) {
    if (event) event.preventDefault();
    Utils.showNotification('Funcionalidade em desenvolvimento', 'info');
}

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar usuário logado se estiver autenticado
    if (window.auth && window.auth.isAuthenticated()) {
        mostrarUsuarioLogado();
    }
});
