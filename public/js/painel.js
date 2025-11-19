// JavaScript para painel administrativo - painel.js

let agendamentoSelecionado = null;
let filtrosAtivos = {};

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está logado
    if (!window.auth || !window.auth.requireAuth()) {
        return;
    }

    carregarEstatisticas();
    carregarAgendamentos();
    setupEventListeners();
});

function setupEventListeners() {
    // Filtros
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
}

function carregarEstatisticas() {
    const user = window.auth.getCurrentUser();
    if (!user) return;

    const todosAgendamentos = window.db.getAgendamentos();
    const agendamentos = todosAgendamentos.filter(ag => ag.clienteId === user.id);
    const hoje = new Date().toISOString().split('T')[0];
    
    // Total de agendamentos
    const totalAgendamentos = agendamentos.filter(ag => ag.status !== 'cancelado').length;
    
    // Agendamentos pendentes (agendado ou confirmado)
    const agendamentosPendentes = agendamentos.filter(ag => 
        ['agendado', 'confirmado'].includes(ag.status)
    ).length;
    
    // Agendamentos concluídos
    const agendamentosConcluidos = agendamentos.filter(ag => 
        ag.status === 'concluido'
    ).length;
    
    // Próximo agendamento
    const agendamentosFuturos = agendamentos
        .filter(ag => ['agendado', 'confirmado'].includes(ag.status))
        .filter(ag => {
            const dataAg = new Date(ag.data);
            const hojeDate = new Date(hoje);
            return dataAg >= hojeDate;
        })
        .sort((a, b) => {
            if (a.data !== b.data) return a.data.localeCompare(b.data);
            return a.horario.localeCompare(b.horario);
        });
    
    const proximoAgendamento = agendamentosFuturos[0];
    
    // Atualizar elementos
    document.getElementById('totalAgendamentos').textContent = totalAgendamentos;
    document.getElementById('agendamentosPendentes').textContent = agendamentosPendentes;
    document.getElementById('agendamentosConcluidos').textContent = agendamentosConcluidos;
    document.getElementById('proximoAgendamento').textContent = 
        proximoAgendamento ? `${Utils.formatDate(proximoAgendamento.data)} ${proximoAgendamento.horario}` : 'Nenhum';
}

function carregarAgendamentos() {
    const user = window.auth.getCurrentUser();
    if (!user) return;

    const todosAgendamentos = window.db.getAgendamentos();
    // Filtrar apenas agendamentos do usuário logado
    let agendamentos = todosAgendamentos.filter(ag => ag.clienteId === user.id);
    const container = document.getElementById('agendamentosList');
    
    // Aplicar filtros adicionais
    let agendamentosFiltrados = agendamentos;
    
    if (filtrosAtivos.status) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.status === filtrosAtivos.status);
    }
    
    // Ordenar por data e horário (mais recentes primeiro)
    agendamentosFiltrados.sort((a, b) => {
        if (a.data !== b.data) return b.data.localeCompare(a.data);
        return b.horario.localeCompare(a.horario);
    });
    
    // Limpar container
    container.innerHTML = '';
    
    if (agendamentosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="no-agendamentos">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum agendamento encontrado</p>
                <button class="btn btn-primary" onclick="abrirModalAgendamento()">
                    <i class="fas fa-plus"></i>
                    Fazer Primeiro Agendamento
                </button>
            </div>
        `;
        return;
    }
    
    // Criar cards dos agendamentos
    agendamentosFiltrados.forEach(agendamento => {
        const card = criarCardAgendamento(agendamento);
        container.appendChild(card);
    });
}

function criarCardAgendamento(agendamento) {
    const div = document.createElement('div');
    div.className = 'agendamento-card';
    div.innerHTML = `
        <div class="agendamento-header">
            <div class="agendamento-info">
                <h3>${agendamento.servicoNome}</h3>
                <p><i class="fas fa-user"></i> ${agendamento.barbeiroNome}</p>
            </div>
            <div class="agendamento-status">
                <span class="status-badge ${agendamento.status}">${getStatusText(agendamento.status)}</span>
            </div>
        </div>
        <div class="agendamento-details">
            <div class="detail-item">
                <i class="fas fa-barcode"></i>
                <span><strong>Código:</strong> ${agendamento.codigo}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${Utils.formatDate(agendamento.data)}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${agendamento.horario} (${agendamento.duracao} min)</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-dollar-sign"></i>
                <span>${Utils.formatCurrency(agendamento.valor)}</span>
            </div>
        </div>
        <div class="agendamento-actions">
            <button class="btn btn-outline btn-sm" onclick="verDetalhes('${agendamento.codigo}')">
                <i class="fas fa-eye"></i>
                Detalhes
            </button>
            ${getActionButtons(agendamento)}
        </div>
    `;
    
    return div;
}

function getStatusText(status) {
    const statusMap = {
        'agendado': 'Agendado',
        'confirmado': 'Confirmado',
        'em-andamento': 'Em Andamento',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

function getActionButtons(agendamento) {
    let buttons = '';
    
    // Apenas permitir cancelamento se não estiver concluído ou já cancelado
    if (!['concluido', 'cancelado'].includes(agendamento.status)) {
        const hoje = new Date();
        const dataAgendamento = new Date(agendamento.data);
        
        // Só permitir cancelar se for hoje ou no futuro
        if (dataAgendamento >= hoje.setHours(0,0,0,0)) {
            buttons += `
                <button class="btn btn-danger btn-sm" onclick="cancelarAgendamentoRapido('${agendamento.codigo}')">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
            `;
        }
    }
    
    return buttons;
}

function aplicarFiltros() {
    const status = document.getElementById('filtroStatus').value;
    
    filtrosAtivos = {
        status: status || null
    };
    
    carregarAgendamentos();
    carregarEstatisticas();
}

function limparFiltros() {
    document.getElementById('filtroStatus').value = '';
    
    filtrosAtivos = {};
    carregarAgendamentos();
    carregarEstatisticas();
}

function verDetalhes(codigo) {
    const agendamento = window.db.getAgendamentosByCodigo(codigo);
    agendamentoSelecionado = agendamento;
    
    // Preencher modal de detalhes
    document.getElementById('detalhesCodigo').textContent = agendamento.codigo;
    document.getElementById('detalhesCliente').textContent = agendamento.clienteNome;
    document.getElementById('detalhesTelefone').textContent = agendamento.clienteTelefone;
    document.getElementById('detalhesServico').textContent = agendamento.servicoNome;
    document.getElementById('detalhesBarbeiro').textContent = agendamento.barbeiroNome;
    document.getElementById('detalhesData').textContent = Utils.formatDate(agendamento.data);
    document.getElementById('detalhesHorario').textContent = agendamento.horario;
    document.getElementById('detalhesDuracao').textContent = `${agendamento.duracao} minutos`;
    document.getElementById('detalhesValor').textContent = Utils.formatCurrency(agendamento.valor);
    
    const statusBadge = document.getElementById('detalhesStatus');
    statusBadge.textContent = getStatusText(agendamento.status);
    statusBadge.className = `status-badge ${agendamento.status}`;
    
    document.getElementById('detalhesObservacoes').value = agendamento.observacoes || '';
    
    openModal('detalhesModal');
}

function alterarStatus(novoStatus) {
    if (!agendamentoSelecionado) return;
    
    const observacoes = document.getElementById('detalhesObservacoes').value;
    
    const updates = {
        status: novoStatus,
        observacoes: observacoes
    };
    
    window.db.updateAgendamento(agendamentoSelecionado.codigo, updates);
    
    Utils.showNotification(`Status alterado para: ${getStatusText(novoStatus)}`, 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
    closeModal('detalhesModal');
}

function alterarStatusRapido(codigo, novoStatus) {
    window.db.updateAgendamento(codigo, { status: novoStatus });
    
    Utils.showNotification(`Status alterado para: ${getStatusText(novoStatus)}`, 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
}

function cancelarAgendamento() {
    if (!agendamentoSelecionado) return;
    
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        window.db.updateAgendamento(agendamentoSelecionado.codigo, { 
            status: 'cancelado',
            canceladoEm: new Date().toISOString()
        });
        
        Utils.showNotification('Agendamento cancelado', 'success');
        
        carregarAgendamentos();
        carregarEstatisticas();
        closeModal('detalhesModal');
    }
}

function cancelarAgendamentoRapido(codigo) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        window.db.updateAgendamento(codigo, { 
            status: 'cancelado',
            canceladoEm: new Date().toISOString()
        });
        
        Utils.showNotification('Agendamento cancelado', 'success');
        
        carregarAgendamentos();
        carregarEstatisticas();
    }
}

function abrirModalReagendamento() {
    if (!agendamentoSelecionado) return;
    
    // Carregar horários disponíveis
    const hoje = new Date();
    document.getElementById('novaData').min = hoje.toISOString().split('T')[0];
    
    openModal('reagendamentoModal');
}

function confirmarReagendamento() {
    const novaData = document.getElementById('novaData').value;
    const novoHorario = document.getElementById('novoHorario').value;
    const motivo = document.getElementById('motivoReagendamento').value;
    
    if (!novaData || !novoHorario) {
        Utils.showNotification('Preencha todos os campos', 'error');
        return;
    }
    
    // Verificar conflitos
    const temConflito = window.db.checkConflito(
        agendamentoSelecionado.barbeiro,
        novaData,
        novoHorario,
        agendamentoSelecionado.duracao,
        agendamentoSelecionado.codigo
    );
    
    if (temConflito) {
        Utils.showNotification('Horário já ocupado', 'error');
        return;
    }
    
    // Atualizar agendamento
    const updates = {
        data: novaData,
        horario: novoHorario,
        reagendado: true,
        motivoReagendamento: motivo,
        reagendadoEm: new Date().toISOString()
    };
    
    window.db.updateAgendamento(agendamentoSelecionado.codigo, updates);
    
    Utils.showNotification('Agendamento reagendado com sucesso', 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
    closeModal('reagendamentoModal');
    closeModal('detalhesModal');
}

function abrirModalAgendamento() {
    window.location.href = 'agendamento.html';
}

// Recarregar dados quando a sessão for recarregada
window.addEventListener('sessionLoaded', function() {
    carregarAgendamentos();
    carregarEstatisticas();
});