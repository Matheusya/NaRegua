// JavaScript para página de agendamento - agendamento.js

let agendamentoAtual = {
    cliente: null,
    servico: null,
    barbeiro: null,
    data: null,
    horario: null
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAgendamento();
    setupEventListeners();
    carregarClientesExistentes();
    definirDataMinima();
});

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

    // Seleção de barbeiros
    document.querySelectorAll('.barbeiro-card').forEach(card => {
        card.addEventListener('click', function() {
            selecionarBarbeiro(this);
        });
    });

    // Data de agendamento
    document.getElementById('dataAgendamento').addEventListener('change', selecionarData);

    // Confirmação do agendamento
    document.getElementById('confirmarAgendamento').addEventListener('click', confirmarAgendamento);
}

function carregarClientesExistentes() {
    const select = document.getElementById('clienteExistente');
    const clientes = window.db.getClientes();
    
    // Limpar opções existentes
    select.innerHTML = '<option value="">Selecione um cliente cadastrado</option>';
    
    // Adicionar clientes
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = `${cliente.nome} - ${cliente.telefone}`;
        select.appendChild(option);
    });
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

function confirmarAgendamento() {
    try {
        // Se é um novo cliente, cadastrá-lo primeiro
        if (agendamentoAtual.cliente.novo) {
            const novoCliente = window.db.addCliente({
                nome: agendamentoAtual.cliente.nome,
                telefone: agendamentoAtual.cliente.telefone,
                email: `${agendamentoAtual.cliente.nome.toLowerCase().replace(/\s+/g, '')}@temp.com` // Email temporário
            });
            agendamentoAtual.cliente = novoCliente;
        }
        
        // Criar agendamento
        const agendamento = {
            clienteId: agendamentoAtual.cliente.id,
            clienteNome: agendamentoAtual.cliente.nome,
            clienteTelefone: agendamentoAtual.cliente.telefone,
            servico: agendamentoAtual.servico.id,
            servicoNome: agendamentoAtual.servico.nome,
            barbeiro: agendamentoAtual.barbeiro.id,
            barbeiroNome: agendamentoAtual.barbeiro.nome,
            data: agendamentoAtual.data,
            horario: agendamentoAtual.horario,
            duracao: agendamentoAtual.servico.duracao,
            valor: agendamentoAtual.servico.preco
        };
        
        const novoAgendamento = window.db.addAgendamento(agendamento);
        
        // Mostrar modal de confirmação
        document.getElementById('codigoAgendamento').textContent = novoAgendamento.codigo;
        openModal('confirmModal');
        
        Utils.showNotification('Agendamento realizado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao confirmar agendamento:', error);
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