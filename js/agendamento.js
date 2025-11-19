// JavaScript para página de agendamento - agendamento.js

let agendamentoAtual = {
    cliente: null,
    servico: null,
    barbeiro: null,
    data: null,
    horario: null
};

document.addEventListener('DOMContentLoaded', function() {
    // Sempre inicializar o agendamento e carregar barbeiros primeiro
    initializeAgendamento();
    carregarBarbeiros();
    setupEventListeners();
    definirDataMinima();
    
    // Verificar se está logado depois
    if (!window.auth || !window.auth.requireAuth()) {
        return;
    }

    carregarUsuarioLogado();
});

// Recarregar dados do usuário quando a sessão for recarregada
window.addEventListener('sessionLoaded', function() {
    carregarUsuarioLogado();
    carregarBarbeiros(); // Recarregar barbeiros também
});

function carregarBarbeiros() {
    const barbeiros = window.db.getBarbeiros();
    const barbeirosGrid = document.querySelector('.barbeiros-grid');
    
    // Limpar barbeiros existentes
    barbeirosGrid.innerHTML = '';
    
    // Carregar barbeiros do banco de dados
    barbeiros.forEach(barbeiro => {
        const barbeiroCard = document.createElement('div');
        barbeiroCard.className = 'barbeiro-card';
        barbeiroCard.dataset.barbeiro = barbeiro.id;
        
        // Gerar estrelas baseado no rating
        const stars = generateStars(barbeiro.rating);
        
        // Formatar especialidades
        const especialidades = Array.isArray(barbeiro.especialidades) 
            ? barbeiro.especialidades.join(', ') 
            : barbeiro.especialidades || 'Barbeiro profissional';
        
        barbeiroCard.innerHTML = `
            <div class="barbeiro-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <h3>${barbeiro.nome}</h3>
            <p>${barbeiro.descricao || `Especialista em ${especialidades}`}</p>
            <div class="barbeiro-rating">
                ${stars}
                <span>${barbeiro.rating.toFixed(1)}</span>
            </div>
            ${barbeiro.totalAtendimentos ? `<div class="atendimentos">${barbeiro.totalAtendimentos} atendimentos</div>` : ''}
        `;
        
        // Adicionar event listener
        barbeiroCard.addEventListener('click', function() {
            selecionarBarbeiro(this);
        });
        
        barbeirosGrid.appendChild(barbeiroCard);
    });
    
    // Se não há barbeiros cadastrados, mostrar mensagem
    if (barbeiros.length === 0) {
        barbeirosGrid.innerHTML = `
            <div class="no-barbeiros">
                <p>Nenhum barbeiro disponível no momento.</p>
                <p>Entre em contato com a administração.</p>
            </div>
        `;
    }
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Estrelas cheias
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Meia estrela
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Estrelas vazias
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function initializeAgendamento() {
    // Resetar estado do agendamento
    agendamentoAtual = {
        cliente: null,
        servico: null,
        barbeiro: null,
        data: null,
        horario: null
    };
}

function setupEventListeners() {
    // Cliente existente
    document.getElementById('clienteExistente').addEventListener('change', selecionarClienteExistente);
    
    // Dados de novo cliente
    document.getElementById('nomeCliente').addEventListener('input', atualizarDadosCliente);
    document.getElementById('telefoneCliente').addEventListener('input', function() {
        Utils.maskPhone(this);
        atualizarDadosCliente();
    });

    // Seleção de serviços
    document.querySelectorAll('.servico-card').forEach(card => {
        card.addEventListener('click', function() {
            selecionarServico(this);
        });
    });

    // Data de agendamento
    document.getElementById('dataAgendamento').addEventListener('change', selecionarData);

    // Confirmação do agendamento
    document.getElementById('confirmarAgendamento').addEventListener('click', confirmarAgendamento);
}

function carregarUsuarioLogado() {
    const user = window.auth.getCurrentUser();
    
    if (user) {
        // Preencher automaticamente com dados do usuário logado
        agendamentoAtual.cliente = user;
        
        // Ocultar seção de seleção de cliente
        const clienteSection = document.querySelector('.step-card:first-child');
        if (clienteSection) {
            clienteSection.style.display = 'none';
        }
        
        // Mostrar mensagem de boas-vindas
        const pageHeader = document.querySelector('.page-header p');
        if (pageHeader) {
            pageHeader.textContent = `Olá, ${user.nome}! Escolha o melhor horário para seu corte.`;
        }
    }
}

function definirDataMinima() {
    const hoje = new Date();
    const dataInput = document.getElementById('dataAgendamento');
    dataInput.min = hoje.toISOString().split('T')[0];
}

function selecionarClienteExistente() {
    const select = document.getElementById('clienteExistente');
    const clienteId = select.value;
    
    if (clienteId) {
        const cliente = window.db.getClienteById(clienteId);
        agendamentoAtual.cliente = cliente;
        
        // Limpar campos de novo cliente
        document.getElementById('nomeCliente').value = '';
        document.getElementById('telefoneCliente').value = '';
        
        atualizarResumo();
    } else {
        agendamentoAtual.cliente = null;
        atualizarResumo();
    }
}

function atualizarDadosCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    
    if (nome && telefone) {
        agendamentoAtual.cliente = {
            nome: nome,
            telefone: telefone,
            novo: true
        };
        
        // Limpar seleção de cliente existente
        document.getElementById('clienteExistente').value = '';
    } else {
        agendamentoAtual.cliente = null;
    }
    
    atualizarResumo();
}

function selecionarServico(card) {
    // Remover seleção anterior
    document.querySelectorAll('.servico-card').forEach(c => c.classList.remove('selected'));
    
    // Adicionar seleção atual
    card.classList.add('selected');
    
    // Atualizar dados do agendamento
    agendamentoAtual.servico = {
        id: card.dataset.servico,
        nome: card.querySelector('h3').textContent,
        duracao: parseInt(card.dataset.duracao),
        preco: parseFloat(card.dataset.preco)
    };
    
    atualizarResumo();
    recarregarHorarios();
}

function selecionarBarbeiro(card) {
    // Remover seleção anterior
    document.querySelectorAll('.barbeiro-card').forEach(c => c.classList.remove('selected'));
    
    // Adicionar seleção atual
    card.classList.add('selected');
    
    // Atualizar dados do agendamento
    agendamentoAtual.barbeiro = {
        id: card.dataset.barbeiro,
        nome: card.querySelector('h3').textContent
    };
    
    atualizarResumo();
    recarregarHorarios();
}

function selecionarData() {
    const dataInput = document.getElementById('dataAgendamento');
    agendamentoAtual.data = dataInput.value;
    
    atualizarResumo();
    recarregarHorarios();
}

function recarregarHorarios() {
    const horariosDiv = document.getElementById('horariosDisponiveis');
    
    if (!agendamentoAtual.barbeiro || !agendamentoAtual.data || !agendamentoAtual.servico) {
        horariosDiv.innerHTML = '<p class="no-horarios">Selecione barbeiro, serviço e data para ver os horários disponíveis</p>';
        return;
    }
    
    const barbeiro = window.db.getBarbeiroById(agendamentoAtual.barbeiro.id);
    const diaSemana = Utils.getDayOfWeek(agendamentoAtual.data);
    const horariosDisponiveis = barbeiro.disponibilidade[diaSemana] || [];
    
    horariosDiv.innerHTML = '';
    
    if (horariosDisponiveis.length === 0) {
        horariosDiv.innerHTML = '<p class="no-horarios">Barbeiro não disponível neste dia</p>';
        return;
    }
    
    horariosDisponiveis.forEach(horario => {
        // Verificar se horário está livre
        const temConflito = window.db.checkConflito(
            agendamentoAtual.barbeiro.id,
            agendamentoAtual.data,
            horario,
            agendamentoAtual.servico.duracao
        );
        
        const button = document.createElement('button');
        button.className = `horario-btn ${temConflito ? 'ocupado' : 'disponivel'}`;
        button.textContent = horario;
        button.disabled = temConflito;
        
        if (!temConflito) {
            button.addEventListener('click', function() {
                selecionarHorario(horario, this);
            });
        }
        
        horariosDiv.appendChild(button);
    });
}

function selecionarHorario(horario, button) {
    // Remover seleção anterior
    document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Adicionar seleção atual
    button.classList.add('selected');
    
    agendamentoAtual.horario = horario;
    atualizarResumo();
}

function atualizarResumo() {
    const resumoCard = document.getElementById('resumoCard');
    const confirmarBtn = document.getElementById('confirmarAgendamento');
    
    // Verificar se todos os dados estão preenchidos
    const todosPreenchidos = agendamentoAtual.cliente && 
                            agendamentoAtual.servico && 
                            agendamentoAtual.barbeiro && 
                            agendamentoAtual.data && 
                            agendamentoAtual.horario;
    
    if (todosPreenchidos) {
        // Mostrar resumo
        resumoCard.style.display = 'block';
        confirmarBtn.style.display = 'inline-block';
        
        // Preencher dados do resumo
        document.getElementById('resumoCliente').textContent = agendamentoAtual.cliente.nome;
        document.getElementById('resumoServico').textContent = agendamentoAtual.servico.nome;
        document.getElementById('resumoBarbeiro').textContent = agendamentoAtual.barbeiro.nome;
        document.getElementById('resumoData').textContent = Utils.formatDate(agendamentoAtual.data);
        document.getElementById('resumoHorario').textContent = agendamentoAtual.horario;
        document.getElementById('resumoDuracao').textContent = `${agendamentoAtual.servico.duracao} minutos`;
        document.getElementById('resumoValor').textContent = Utils.formatCurrency(agendamentoAtual.servico.preco);
        
        // Scroll para o resumo
        resumoCard.scrollIntoView({ behavior: 'smooth' });
    } else {
        resumoCard.style.display = 'none';
        confirmarBtn.style.display = 'none';
    }
}

async function confirmarAgendamento() {
    try {
        const user = window.auth.getCurrentUser();
        
        if (!user) {
            Utils.showNotification('Você precisa estar logado para fazer um agendamento.', 'error');
            window.location.href = 'login.html';
            return;
        }
        
        // Criar agendamento usando dados do usuário logado
        const agendamento = {
            clienteId: user.id,
            clienteNome: user.nome,
            clienteTelefone: user.telefone,
            clienteEmail: user.email,
            servico: agendamentoAtual.servico.id,
            servicoNome: agendamentoAtual.servico.nome,
            barbeiroId: agendamentoAtual.barbeiro.id,
            barbeiroNome: agendamentoAtual.barbeiro.nome,
            data: agendamentoAtual.data,
            horario: agendamentoAtual.horario,
            duracao: agendamentoAtual.servico.duracao,
            valor: agendamentoAtual.servico.preco
        };
        
        // Salvar no localStorage (fallback)
        const novoAgendamento = window.db.addAgendamento(agendamento);
        
        // Enviar para o backend
        try {
            const response = await fetch('http://localhost:3000/api/agendamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(agendamento)
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Agendamento salvo no servidor');
                
                if (result.emailEnviado) {
                    Utils.showNotification('✅ Agendamento confirmado! Verifique seu email.', 'success');
                } else {
                    Utils.showNotification('✅ Agendamento confirmado! (Email não enviado - configure o servidor)', 'success');
                }
            } else {
                console.warn('⚠️ Erro no servidor:', result.message);
                Utils.showNotification('Agendamento salvo localmente.', 'warning');
            }
        } catch (fetchError) {
            console.warn('⚠️ Servidor offline. Agendamento salvo apenas localmente:', fetchError);
            Utils.showNotification('✅ Agendamento confirmado! (Servidor offline - email não enviado)', 'success');
        }
        
        // Mostrar modal de confirmação
        document.getElementById('codigoAgendamento').textContent = novoAgendamento.codigo;
        openModal('confirmModal');
        
    } catch (error) {
        console.error('❌ Erro ao confirmar agendamento:', error);
        Utils.showNotification('Erro ao realizar agendamento. Tente novamente.', 'error');
    }
}

function limparFormulario() {
    // Resetar formulário
    document.getElementById('clienteExistente').value = '';
    document.getElementById('nomeCliente').value = '';
    document.getElementById('telefoneCliente').value = '';
    document.getElementById('dataAgendamento').value = '';
    
    // Remover seleções
    document.querySelectorAll('.servico-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.barbeiro-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Limpar horários
    document.getElementById('horariosDisponiveis').innerHTML = '';
    
    // Esconder resumo
    document.getElementById('resumoCard').style.display = 'none';
    document.getElementById('confirmarAgendamento').style.display = 'none';
    
    // Resetar dados
    initializeAgendamento();
}

function novoAgendamento() {
    closeModal('confirmModal');
    limparFormulario();
}

function verPainel() {
    window.location.href = 'painel.html';
}