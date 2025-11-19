// JavaScript para painel do barbeiro - painel-barbeiro.js

let agendamentoSelecionado = null;
let filtrosAtivos = {};
let visualizacaoAtual = 'lista';
let barbeiroAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é barbeiro logado
    if (!window.auth || !window.auth.requireBarbeiroAuth()) {
        return;
    }

    barbeiroAtual = window.auth.getCurrentUser();
    
    // Atualizar mensagem de boas-vindas
    document.getElementById('welcomeMessage').textContent = 
        `Bem-vindo, ${barbeiroAtual.nome}!`;

    carregarEstatisticas();
    carregarAgendamentos();
    setupEventListeners();
    definirDataAtual();
});

function setupEventListeners() {
    // Filtros
    document.getElementById('filtroData').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
}

function definirDataAtual() {
    const hoje = new Date();
    document.getElementById('filtroData').value = hoje.toISOString().split('T')[0];
    filtrosAtivos.data = hoje.toISOString().split('T')[0];
}

function carregarEstatisticas() {
    if (!barbeiroAtual) return;

    const todosAgendamentos = window.db.getAgendamentos();
    const agendamentos = todosAgendamentos.filter(ag => ag.barbeiro === barbeiroAtual.id);
    const hoje = new Date().toISOString().split('T')[0];
    
    // Agendamentos de hoje
    const agendamentosHoje = agendamentos.filter(ag => 
        ag.data === hoje && ag.status !== 'cancelado'
    );
    
    // Receita de hoje
    const receitaHoje = agendamentosHoje
        .filter(ag => ag.status === 'concluido')
        .reduce((total, ag) => total + ag.valor, 0);
    
    // Próximo agendamento de hoje
    const agendamentosHojeOrdenados = agendamentosHoje
        .filter(ag => ['agendado', 'confirmado'].includes(ag.status))
        .sort((a, b) => a.horario.localeCompare(b.horario));
    
    const proximoAgendamento = agendamentosHojeOrdenados[0];
    
    // Clientes únicos atendidos
    const clientesUnicos = new Set(
        agendamentos
            .filter(ag => ag.status === 'concluido')
            .map(ag => ag.clienteId)
    );
    
    // Atendimentos do mês
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    const atendimentosMes = agendamentos.filter(ag => {
        const dataAg = new Date(ag.data);
        return dataAg.getMonth() === mesAtual && 
               dataAg.getFullYear() === anoAtual &&
               ag.status === 'concluido';
    }).length;
    
    // Atualizar elementos
    document.getElementById('agendamentosHoje').textContent = agendamentosHoje.length;
    document.getElementById('proximoHorario').textContent = 
        proximoAgendamento ? proximoAgendamento.horario : '--:--';
    document.getElementById('totalClientes').textContent = clientesUnicos.size;
    document.getElementById('receitaHoje').textContent = Utils.formatCurrency(receitaHoje);
    document.getElementById('avaliacaoMedia').textContent = barbeiroAtual.rating.toFixed(1);
    document.getElementById('atendimentosMes').textContent = atendimentosMes;
}

function carregarAgendamentos() {
    if (!barbeiroAtual) return;

    const todosAgendamentos = window.db.getAgendamentos();
    let agendamentos = todosAgendamentos.filter(ag => ag.barbeiro === barbeiroAtual.id);
    const container = document.getElementById('agendamentosList');
    
    // Aplicar filtros
    let agendamentosFiltrados = agendamentos;
    
    if (filtrosAtivos.data) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.data === filtrosAtivos.data);
    }
    
    if (filtrosAtivos.status) {
        agendamentosFiltrados = agendamentosFiltrados.filter(ag => ag.status === filtrosAtivos.status);
    }
    
    // Ordenar por data e horário
    agendamentosFiltrados.sort((a, b) => {
        if (a.data !== b.data) return b.data.localeCompare(a.data);
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
    div.className = 'agendamento-card barbeiro-view';
    
    // Verificar se é hoje
    const hoje = new Date().toISOString().split('T')[0];
    const isHoje = agendamento.data === hoje;
    
    if (isHoje && ['agendado', 'confirmado', 'em-andamento'].includes(agendamento.status)) {
        div.classList.add('agendamento-hoje');
    }
    
    div.innerHTML = `
        <div class="agendamento-header">
            <div class="agendamento-info">
                <h3><i class="fas fa-user"></i> ${agendamento.clienteNome}</h3>
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
            <div class="detail-item">
                <i class="fas fa-barcode"></i>
                <span><strong>Código:</strong> ${agendamento.codigo}</span>
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
    const status = document.getElementById('filtroStatus').value;
    
    filtrosAtivos = {
        data: data || null,
        status: status || null
    };
    
    carregarAgendamentos();
    carregarEstatisticas();
}

function limparFiltros() {
    document.getElementById('filtroData').value = '';
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
    document.getElementById('detalhesEmail').textContent = agendamento.clienteEmail || 'Não informado';
    document.getElementById('detalhesServico').textContent = agendamento.servicoNome;
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
        observacoes: observacoes,
        ultimaAtualizacao: new Date().toISOString()
    };
    
    // Se estiver concluindo, atualizar contador do barbeiro
    if (novoStatus === 'concluido' && agendamentoSelecionado.status !== 'concluido') {
        const barbeiroData = window.db.getBarbeiroAuthById(barbeiroAtual.id);
        if (barbeiroData) {
            window.db.updateBarbeiro(barbeiroAtual.id, {
                totalAtendimentos: (barbeiroData.totalAtendimentos || 0) + 1
            });
        }
    }
    
    window.db.updateAgendamento(agendamentoSelecionado.codigo, updates);
    
    Utils.showNotification(`Status alterado para: ${getStatusText(novoStatus)}`, 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
    closeModal('detalhesModal');
}

function alterarStatusRapido(codigo, novoStatus) {
    const updates = {
        status: novoStatus,
        ultimaAtualizacao: new Date().toISOString()
    };
    
    // Se estiver concluindo, atualizar contador do barbeiro
    if (novoStatus === 'concluido') {
        const agendamento = window.db.getAgendamentosByCodigo(codigo);
        if (agendamento && agendamento.status !== 'concluido') {
            const barbeiroData = window.db.getBarbeiroAuthById(barbeiroAtual.id);
            if (barbeiroData) {
                window.db.updateBarbeiro(barbeiroAtual.id, {
                    totalAtendimentos: (barbeiroData.totalAtendimentos || 0) + 1
                });
            }
        }
    }
    
    window.db.updateAgendamento(codigo, updates);
    
    Utils.showNotification(`Status alterado para: ${getStatusText(novoStatus)}`, 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
}

function cancelarAgendamento() {
    if (!agendamentoSelecionado) return;
    
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        window.db.updateAgendamento(agendamentoSelecionado.codigo, { 
            status: 'cancelado',
            canceladoEm: new Date().toISOString(),
            canceladoPor: 'barbeiro'
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
            canceladoEm: new Date().toISOString(),
            canceladoPor: 'barbeiro'
        });
        
        Utils.showNotification('Agendamento cancelado', 'success');
        
        carregarAgendamentos();
        carregarEstatisticas();
    }
}

function abrirModalReagendamento() {
    if (!agendamentoSelecionado) return;
    
    // Definir data mínima como hoje
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
        reagendadoEm: new Date().toISOString(),
        reagendadoPor: 'barbeiro'
    };
    
    window.db.updateAgendamento(agendamentoSelecionado.codigo, updates);
    
    Utils.showNotification('Agendamento reagendado com sucesso', 'success');
    
    carregarAgendamentos();
    carregarEstatisticas();
    closeModal('reagendamentoModal');
    closeModal('detalhesModal');
}

function abrirModalDisponibilidade() {
    if (!barbeiroAtual) return;
    
    const barbeiroData = window.db.getBarbeiroAuthById(barbeiroAtual.id);
    if (!barbeiroData) return;
    
    // Preencher dias de trabalho
    const diasContainer = document.getElementById('diasTrabalho');
    diasContainer.innerHTML = '';
    
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const diasNomes = {
        'segunda': 'Segunda',
        'terca': 'Terça',
        'quarta': 'Quarta',
        'quinta': 'Quinta',
        'sexta': 'Sexta',
        'sabado': 'Sábado',
        'domingo': 'Domingo'
    };
    
    diasSemana.forEach(dia => {
        const isDisponivel = barbeiroData.diasDisponiveis.includes(dia);
        const diaCard = document.createElement('div');
        diaCard.className = `dia-trabalho-card ${isDisponivel ? 'disponivel' : 'indisponivel'}`;
        diaCard.innerHTML = `
            <i class="fas fa-${isDisponivel ? 'check-circle' : 'times-circle'}"></i>
            <span>${diasNomes[dia]}</span>
        `;
        diasContainer.appendChild(diaCard);
    });
    
    // Preencher horários
    document.getElementById('horarioInicio').textContent = barbeiroData.horarioInicio;
    document.getElementById('horarioFim').textContent = barbeiroData.horarioFim;
    
    // Preencher especialidade
    document.getElementById('especialidadeBarbeiro').textContent = barbeiroData.especialidade;
    
    openModal('disponibilidadeModal');
}

function editarDisponibilidade() {
    Utils.showNotification('Funcionalidade em desenvolvimento', 'info');
}

function mudarVisualizacao(tipo) {
    visualizacaoAtual = tipo;
    
    // Atualizar botões
    document.getElementById('btnLista').classList.toggle('active', tipo === 'lista');
    document.getElementById('btnCalendario').classList.toggle('active', tipo === 'calendario');
    
    if (tipo === 'calendario') {
        Utils.showNotification('Visualização de calendário em desenvolvimento', 'info');
    }
}

function exportarRelatorio() {
    if (!barbeiroAtual) return;
    
    const todosAgendamentos = window.db.getAgendamentos();
    const agendamentos = todosAgendamentos.filter(ag => ag.barbeiro === barbeiroAtual.id);
    
    if (agendamentos.length === 0) {
        Utils.showNotification('Nenhum agendamento para exportar', 'error');
        return;
    }
    
    // Criar CSV
    const headers = ['Código', 'Cliente', 'Telefone', 'Serviço', 'Data', 'Horário', 'Valor', 'Status'];
    const csv = [headers.join(',')];
    
    agendamentos.forEach(ag => {
        const row = [
            ag.codigo,
            ag.clienteNome,
            ag.clienteTelefone,
            ag.servicoNome,
            ag.data,
            ag.horario,
            ag.valor,
            ag.status
        ];
        csv.push(row.join(','));
    });
    
    // Download do arquivo
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${barbeiroAtual.nome}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    Utils.showNotification('Relatório exportado com sucesso', 'success');
}

// Recarregar dados quando a sessão for recarregada
window.addEventListener('sessionLoaded', function() {
    if (barbeiroAtual) {
        carregarAgendamentos();
        carregarEstatisticas();
    }
});

