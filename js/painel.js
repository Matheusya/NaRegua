// JavaScript para painel administrativo - painel.js

let agendamentoSelecionado = null;
let filtrosAtivos = {};

document.addEventListener('DOMContentLoaded', function() {
    carregarEstatisticas();
    carregarAgendamentos();
    setupEventListeners();
    definirDataAtual();
});

function setupEventListeners() {
    // Filtros
    document.getElementById('filtroData').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroBarbeiro').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
}

function definirDataAtual() {
    const hoje = new Date();
    document.getElementById('filtroData').value = hoje.toISOString().split('T')[0];
    filtrosAtivos.data = hoje.toISOString().split('T')[0];
}

function carregarEstatisticas() {
    const agendamentos = window.db.getAgendamentos();
    const clientes = window.db.getClientes();
    const hoje = new Date().toISOString().split('T')[0];
    
    // Agendamentos de hoje
    const agendamentosHoje = agendamentos.filter(ag => 
        ag.data === hoje && ag.status !== 'cancelado'
    );
    
    // Receita de hoje
    const receitaHoje = agendamentosHoje
        .filter(ag => ag.status === 'concluido')
        .reduce((total, ag) => total + ag.valor, 0);
    
    // Próximo agendamento
    const agendamentosHojeOrdenados = agendamentosHoje
        .filter(ag => ['agendado', 'confirmado'].includes(ag.status))
        .sort((a, b) => a.horario.localeCompare(b.horario));
    
    const proximoAgendamento = agendamentosHojeOrdenados[0];
    
    // Atualizar elementos
    document.getElementById('totalAgendamentos').textContent = agendamentosHoje.length;
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('receitaHoje').textContent = Utils.formatCurrency(receitaHoje);
    document.getElementById('proximoAgendamento').textContent = 
        proximoAgendamento ? proximoAgendamento.horario : '--:--';
}

function carregarAgendamentos() {
    const agendamentos = window.db.getAgendamentos();
    const container = document.getElementById('agendamentosList');
    
    // Aplicar filtros
    let agendamentosFiltrados = agendamentos;
    
    if (filtrosAtivos.data) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.data === filtrosAtivos.data);
    }
    
    if (filtrosAtivos.barbeiro) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.barbeiro === filtrosAtivos.barbeiro);
    }
    
    if (filtrosAtivos.status) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.status === filtrosAtivos.status);
    }
    
    // Ordenar por horário
    agendamentosFiltrados.sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return a.horario.localeCompare(b.horario);
    });
    
    // Limpar container
    container.innerHTML = '';
    
    if (agendamentosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="no-agendamentos">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum agendamento encontrado</p>
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
                <h3>${agendamento.clienteNome}</h3>
                <p><i class="fas fa-phone"></i> ${agendamento.clienteTelefone}</p>
            </div>
            <div class="agendamento-status">
                <span class="status-badge ${agendamento.status}">${getStatusText(agendamento.status)}</span>
            </div>
        </div>
        <div class="agendamento-details">
            <div class="detail-item">
                <i class="fas fa-cut"></i>
                <span>${agendamento.servicoNome}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-user"></i>
                <span>${agendamento.barbeiroNome}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${Utils.formatDate(agendamento.data)}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${agendamento.horario}</span>
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
    
    switch (agendamento.status) {
        case 'agendado':
            buttons += `
                <button class="btn btn-success btn-sm" onclick="alterarStatusRapido('${agendamento.codigo}', 'confirmado')">
                    <i class="fas fa-check"></i>
                    Confirmar
                </button>
            `;
            break;
        case 'confirmado':
            buttons += `
                <button class="btn btn-primary btn-sm" onclick="alterarStatusRapido('${agendamento.codigo}', 'em-andamento')">
                    <i class="fas fa-play"></i>
                    Iniciar
                </button>
            `;
            break;
        case 'em-andamento':
            buttons += `
                <button class="btn btn-info btn-sm" onclick="alterarStatusRapido('${agendamento.codigo}', 'concluido')">
                    <i class="fas fa-flag-checkered"></i>
                    Concluir
                </button>
            `;
            break;
    }
    
    if (!['concluido', 'cancelado'].includes(agendamento.status)) {
        buttons += `
            <button class="btn btn-danger btn-sm" onclick="cancelarAgendamentoRapido('${agendamento.codigo}')">
                <i class="fas fa-times"></i>
                Cancelar
            </button>
        `;
    }
    
    return buttons;
}

function aplicarFiltros() {
    const data = document.getElementById('filtroData').value;
    const barbeiro = document.getElementById('filtroBarbeiro').value;
    const status = document.getElementById('filtroStatus').value;
    
    filtrosAtivos = {
        data: data || null,
        barbeiro: barbeiro || null,
        status: status || null
    };
    
    carregarAgendamentos();
    carregarEstatisticas();
}

function limparFiltros() {
    document.getElementById('filtroData').value = '';
    document.getElementById('filtroBarbeiro').value = '';
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
    fecharModal('detalhesModal');
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
        fecharModal('detalhesModal');
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
    fecharModal('reagendamentoModal');
    fecharModal('detalhesModal');
}

function exportarAgendamentos() {
    const agendamentos = window.db.getAgendamentos();
    
    if (agendamentos.length === 0) {
        Utils.showNotification('Nenhum agendamento para exportar', 'error');
        return;
    }
    
    // Criar CSV
    const headers = ['Código', 'Cliente', 'Telefone', 'Serviço', 'Barbeiro', 'Data', 'Horário', 'Valor', 'Status'];
    const csv = [headers.join(',')];
    
    agendamentos.forEach(ag => {
        const row = [
            ag.codigo,
            ag.clienteNome,
            ag.clienteTelefone,
            ag.servicoNome,
            ag.barbeiroNome,
            ag.data,
            ag.horario,
            ag.valor,
            ag.status
        ];
        csv.push(row.join(','));
    });
    
    // Download do arquivo
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    Utils.showNotification('Agendamentos exportados com sucesso', 'success');
}

function abrirModalAgendamento() {
    window.location.href = 'agendamento.html';
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}