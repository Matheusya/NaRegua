// JavaScript para cadastro de barbeiro - cadastro-barbeiro.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroBarbeiroForm');

    // Validação em tempo real
    setupValidation();

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            cadastrarBarbeiro();
        }
    });
});

function setupValidation() {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const dataNascimento = document.getElementById('dataNascimento');
    const especialidade = document.getElementById('especialidade');
    const experiencia = document.getElementById('experiencia');
    const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');

    nome.addEventListener('blur', validateNome);
    email.addEventListener('blur', validateEmail);
    telefone.addEventListener('input', function() {
        Utils.maskPhone(this);
    });
    telefone.addEventListener('blur', validateTelefone);
    dataNascimento.addEventListener('blur', validateDataNascimento);
    especialidade.addEventListener('change', validateEspecialidade);
    experiencia.addEventListener('blur', validateExperiencia);
    senha.addEventListener('blur', validateSenha);
    confirmarSenha.addEventListener('blur', validateConfirmarSenha);
}

function validateNome() {
    const nome = document.getElementById('nome');
    const error = document.getElementById('nome-error');
    
    if (!nome.value.trim()) {
        showError(error, 'Nome é obrigatório');
        return false;
    }
    
    if (nome.value.trim().length < 3) {
        showError(error, 'Nome deve ter pelo menos 3 caracteres');
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

    // Verificar se email já existe (clientes ou barbeiros)
    const clientes = window.db.getClientes();
    const barbeiros = window.db.getBarbeirosAuth();
    
    if (clientes.some(c => c.email === email.value) || 
        barbeiros.some(b => b.email === email.value)) {
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
        showError(error, 'Telefone inválido');
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
    
    if (idade < 18) {
        showError(error, 'Idade mínima é de 18 anos');
        return false;
    }
    
    hideError(error);
    return true;
}

function validateEspecialidade() {
    const especialidade = document.getElementById('especialidade');
    const error = document.getElementById('especialidade-error');
    
    if (!especialidade.value) {
        showError(error, 'Selecione uma especialidade');
        return false;
    }
    
    hideError(error);
    return true;
}

function validateExperiencia() {
    const experiencia = document.getElementById('experiencia');
    const error = document.getElementById('experiencia-error');
    
    if (!experiencia.value) {
        showError(error, 'Informe o tempo de experiência');
        return false;
    }
    
    if (experiencia.value < 0) {
        showError(error, 'Experiência não pode ser negativa');
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

function validateForm() {
    const validations = [
        validateNome(),
        validateEmail(),
        validateTelefone(),
        validateDataNascimento(),
        validateEspecialidade(),
        validateExperiencia(),
        validateSenha(),
        validateConfirmarSenha()
    ];

    // Validar termos
    const termos = document.getElementById('termos');
    if (!termos.checked) {
        showError(document.getElementById('termos-error'), 'Você deve aceitar os termos');
        validations.push(false);
    }

    return validations.every(v => v === true);
}

function cadastrarBarbeiro() {
    const formData = new FormData(document.getElementById('cadastroBarbeiroForm'));
    
    // Coletar dias selecionados
    const diasSelecionados = [];
    document.querySelectorAll('input[name="dias[]"]:checked').forEach(checkbox => {
        diasSelecionados.push(checkbox.value);
    });

    // Gerar ID único para o barbeiro
    const barbeiroId = generateBarbeiroId(formData.get('nome'));

    const barbeiro = {
        id: barbeiroId,
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        dataNascimento: formData.get('dataNascimento'),
        especialidade: formData.get('especialidade'),
        experiencia: parseInt(formData.get('experiencia')),
        descricao: formData.get('descricao') || '',
        diasDisponiveis: diasSelecionados,
        horarioInicio: formData.get('horarioInicio'),
        horarioFim: formData.get('horarioFim'),
        senha: formData.get('senha'),
        tipo: 'barbeiro',
        ativo: true,
        rating: 5.0,
        totalAtendimentos: 0,
        dataCadastro: new Date().toISOString()
    };

    try {
        const novoBarbeiro = window.db.addBarbeiro(barbeiro);
        
        Utils.showNotification('Barbeiro cadastrado com sucesso!', 'success');
        
        // Fazer login automático
        window.auth.login(barbeiro.email, barbeiro.senha);
        
        // Mostrar modal de sucesso
        openModal('successModal');
        
        // Limpar formulário
        document.getElementById('cadastroBarbeiroForm').reset();
        
    } catch (error) {
        console.error('Erro ao cadastrar barbeiro:', error);
        Utils.showNotification('Erro ao cadastrar barbeiro. Tente novamente.', 'error');
    }
}

function generateBarbeiroId(nome) {
    // Gerar ID baseado no nome (sem espaços, lowercase)
    const baseId = nome.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 10);
    
    // Adicionar timestamp para unicidade
    const timestamp = Date.now().toString(36).substring(2, 6);
    
    return `${baseId}_${timestamp}`;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    const input = errorElement.previousElementSibling;
    if (input && input.tagName) {
        input.classList.add('error');
    }
}

function hideError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    const input = errorElement.previousElementSibling;
    if (input && input.tagName) {
        input.classList.remove('error');
    }
}

function redirectToPainel() {
    window.location.href = '../index.html';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Redirecionar para a página inicial
    window.location.href = '../index.html';
}
