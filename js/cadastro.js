// JavaScript para página de cadastro - cadastro.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');
    const modal = document.getElementById('successModal');

    // Validação em tempo real
    setupValidation();

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            cadastrarCliente();
        }
    });

    function setupValidation() {
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const dataNascimento = document.getElementById('dataNascimento');
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const termos = document.getElementById('termos');

        // Validação do nome
        nome.addEventListener('blur', function() {
            validateNome();
        });

        // Validação do email
        email.addEventListener('blur', function() {
            validateEmail();
        });

        // Validação do telefone
        telefone.addEventListener('input', function() {
            Utils.maskPhone(this);
        });

        telefone.addEventListener('blur', function() {
            validateTelefone();
        });

        // Validação da data de nascimento
        dataNascimento.addEventListener('blur', function() {
            validateDataNascimento();
        });

        // Validação da senha
        senha.addEventListener('blur', function() {
            validateSenha();
        });

        // Validação da confirmação de senha
        confirmarSenha.addEventListener('blur', function() {
            validateConfirmarSenha();
        });

        // Validação dos termos
        termos.addEventListener('change', function() {
            validateTermos();
        });
    }

    function validateNome() {
        const nome = document.getElementById('nome');
        const error = document.getElementById('nome-error');
        
        if (!nome.value.trim()) {
            showError(error, 'Nome é obrigatório');
            return false;
        }
        
        if (nome.value.trim().length < 2) {
            showError(error, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateEmail() {
        const email = document.getElementById('email');
        const error = document.getElementById('email-error');
        
        if (!email.value.trim()) {
            showError(error, 'Email é obrigatório');
            return false;
        }
        
        if (!Utils.validateEmail(email.value)) {
            showError(error, 'Email inválido');
            return false;
        }

        // Verificar se email já existe
        const clientes = window.db.getClientes();
        if (clientes.some(cliente => cliente.email === email.value)) {
            showError(error, 'Este email já está cadastrado');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateTelefone() {
        const telefone = document.getElementById('telefone');
        const error = document.getElementById('telefone-error');
        
        if (!telefone.value.trim()) {
            showError(error, 'Telefone é obrigatório');
            return false;
        }
        
        if (!Utils.validatePhone(telefone.value)) {
            showError(error, 'Telefone inválido. Use o formato (11) 99999-9999');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateDataNascimento() {
        const dataNascimento = document.getElementById('dataNascimento');
        const error = document.getElementById('dataNascimento-error');
        
        if (!dataNascimento.value) {
            showError(error, 'Data de nascimento é obrigatória');
            return false;
        }
        
        const hoje = new Date();
        const nascimento = new Date(dataNascimento.value);
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        
        if (idade < 12) {
            showError(error, 'Idade mínima é de 12 anos');
            return false;
        }
        
        if (idade > 120) {
            showError(error, 'Data de nascimento inválida');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateSenha() {
        const senha = document.getElementById('senha');
        const error = document.getElementById('senha-error');
        
        if (!senha.value) {
            showError(error, 'Senha é obrigatória');
            return false;
        }
        
        if (senha.value.length < 6) {
            showError(error, 'Senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateConfirmarSenha() {
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const error = document.getElementById('confirmarSenha-error');
        
        if (!confirmarSenha.value) {
            showError(error, 'Confirmação de senha é obrigatória');
            return false;
        }
        
        if (senha.value !== confirmarSenha.value) {
            showError(error, 'Senhas não coincidem');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateTermos() {
        const termos = document.getElementById('termos');
        const error = document.getElementById('termos-error');
        
        if (!termos.checked) {
            showError(error, 'Você deve aceitar os termos de uso');
            return false;
        }
        
        hideError(error);
        return true;
    }

    function validateForm() {
        const validations = [
            validateNome(),
            validateEmail(),
            validateTelefone(),
            validateDataNascimento(),
            validateSenha(),
            validateConfirmarSenha(),
            validateTermos()
        ];

        return validations.every(v => v === true);
    }

    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.parentElement.querySelector('input, select').classList.add('error');
    }

    function hideError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        errorElement.parentElement.querySelector('input, select').classList.remove('error');
    }

    function cadastrarCliente() {
        const formData = new FormData(form);
        
        const cliente = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            dataNascimento: formData.get('dataNascimento'),
            senha: formData.get('senha'), // Em um sistema real, a senha seria hasheada
            newsletter: formData.get('newsletter') === 'on'
        };

        try {
            const novoCliente = window.db.addCliente(cliente);
            
            Utils.showNotification('Cliente cadastrado com sucesso!', 'success');
            
            // Fazer login automático
            window.auth.login(cliente.email, cliente.senha);
            
            // Mostrar modal de sucesso
            openModal('successModal');
            
            // Limpar formulário
            form.reset();
            
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            Utils.showNotification('Erro ao cadastrar cliente. Tente novamente.', 'error');
        }
    }
});

// Funções globais para o modal
function redirectToAgendamento() {
    window.location.href = 'agendamento.html';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}