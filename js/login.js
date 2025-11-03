// JavaScript para página de login - login.js

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado
    if (window.auth && window.auth.isAuthenticated()) {
        const user = window.auth.getCurrentUser();
        if (user.tipo === 'barbeiro') {
            window.location.href = 'painel-barbeiro.html';
        } else {
            window.location.href = 'agendamento.html';
        }
        return;
    }

    const form = document.getElementById('loginForm');

    // Verificar se há credenciais salvas
    carregarCredenciaisSalvas();

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fazerLogin();
    });

    // Enter para submeter
    document.getElementById('senha').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            fazerLogin();
        }
    });
});

function carregarCredenciaisSalvas() {
    const emailSalvo = localStorage.getItem('naRegua_rememberedEmail');
    if (emailSalvo) {
        document.getElementById('email').value = emailSalvo;
        document.getElementById('lembrar').checked = true;
    }
}

function fazerLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;

    // Limpar erros anteriores
    limparErros();

    // Validar campos
    if (!email) {
        mostrarErro('email-error', 'Email é obrigatório');
        return;
    }

    if (!Utils.validateEmail(email)) {
        mostrarErro('email-error', 'Email inválido');
        return;
    }

    if (!senha) {
        mostrarErro('senha-error', 'Senha é obrigatória');
        return;
    }

    // Tentar autenticar
    try {
        // Verificar se window.auth existe
        if (!window.auth) {
            console.error('window.auth não está definido');
            throw new Error('Sistema de autenticação não carregado');
        }

        const resultado = window.auth.login(email, senha);

        if (resultado.success) {
            // Salvar email se marcou lembrar
            if (lembrar) {
                localStorage.setItem('naRegua_rememberedEmail', email);
            } else {
                localStorage.removeItem('naRegua_rememberedEmail');
            }

            Utils.showNotification('Login realizado com sucesso!', 'success');

            // Redirecionar baseado no tipo de usuário
            setTimeout(() => {
                if (resultado.user.tipo === 'barbeiro') {
                    window.location.href = 'painel-barbeiro.html';
                } else {
                    window.location.href = 'agendamento.html';
                }
            }, 1000);

        } else {
            mostrarErro('senha-error', resultado.message);
            Utils.showNotification(resultado.message, 'error');
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mostrarErro('senha-error', 'Erro ao processar login. Tente novamente.');
        Utils.showNotification('Erro ao processar login. Tente novamente.', 'error');
    }
}

function togglePassword() {
    const senhaInput = document.getElementById('senha');
    const toggleIcon = document.getElementById('toggleIcon');

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function esqueceuSenha(event) {
    event.preventDefault();
    Utils.showNotification('Funcionalidade em desenvolvimento. Entre em contato com o suporte.', 'info');
}

function mostrarErro(elementId, mensagem) {
    const errorElement = document.getElementById(elementId);
    const input = errorElement.previousElementSibling;
    
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
    
    if (input.tagName === 'INPUT') {
        input.classList.add('error');
    } else if (input.classList.contains('password-input-wrapper')) {
        input.querySelector('input').classList.add('error');
    }
}

function limparErros() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });
}
