// Arquivo principal JavaScript - main.js
// Sistema Na Régua - Agendamento de Barbearia

// Configuração de dados padrão
const DEFAULT_DATA = {
    clientes: [
        {
            id: 1,
            nome: "João da Silva",
            email: "joao@email.com",
            telefone: "(11) 99999-1111",
            dataNascimento: "1985-03-15",
            senha: "123456",
            dataCadastro: new Date().toISOString()
        },
        {
            id: 2,
            nome: "Maria Santos",
            email: "maria@email.com",
            telefone: "(11) 99999-2222",
            dataNascimento: "1990-07-22",
            senha: "123456",
            dataCadastro: new Date().toISOString()
        }
    ],
    barbeiros: [
        {
            id: "joao",
            nome: "João Silva",
            especialidades: ["Corte Clássico", "Barba"],
            rating: 5.0,
            disponibilidade: {
                segunda: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
                terca: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
                quarta: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
                quinta: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
                sexta: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"],
                sabado: ["08:00", "09:00", "10:00", "12:00", "13:00", "14:00"]
            }
        },
        {
            id: "pedro",
            nome: "Pedro Santos",
            especialidades: ["Corte Moderno", "Degradê"],
            rating: 4.8,
            disponibilidade: {
                segunda: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                terca: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                quarta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                quinta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                sexta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                sabado: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"]
            }
        },
        {
            id: "carlos",
            nome: "Carlos Lima",
            especialidades: ["Barba", "Bigode"],
            rating: 4.9,
            disponibilidade: {
                segunda: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"],
                terca: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"],
                quarta: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"],
                quinta: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"],
                sexta: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"],
                sabado: ["08:30", "09:30", "10:30", "12:30", "13:30", "14:30"]
            }
        }
    ],
    servicos: [
        {
            id: "corte-simples",
            nome: "Corte Simples",
            descricao: "Corte tradicional",
            duracao: 30,
            preco: 25.00
        },
        {
            id: "corte-barba",
            nome: "Corte + Barba",
            descricao: "Corte com acabamento da barba",
            duracao: 45,
            preco: 35.00
        },
        {
            id: "barba",
            nome: "Apenas Barba",
            descricao: "Aparar e modelar barba",
            duracao: 20,
            preco: 15.00
        },
        {
            id: "corte-premium",
            nome: "Corte Premium",
            descricao: "Corte + Barba + Hidratação",
            duracao: 60,
            preco: 50.00
        }
    ],
    agendamentos: []
};

// Classe para gerenciar o banco de dados local
class DatabaseManager {
    constructor() {
        this.initializeDatabase();
    }

    // Inicializar banco de dados com dados padrão
    initializeDatabase() {
        if (!localStorage.getItem('naRegua_clientes')) {
            localStorage.setItem('naRegua_clientes', JSON.stringify(DEFAULT_DATA.clientes));
        }
        if (!localStorage.getItem('naRegua_barbeiros')) {
            localStorage.setItem('naRegua_barbeiros', JSON.stringify(DEFAULT_DATA.barbeiros));
        }
        if (!localStorage.getItem('naRegua_barbeirosAuth')) {
            localStorage.setItem('naRegua_barbeirosAuth', JSON.stringify([]));
        }
        if (!localStorage.getItem('naRegua_servicos')) {
            localStorage.setItem('naRegua_servicos', JSON.stringify(DEFAULT_DATA.servicos));
        }
        if (!localStorage.getItem('naRegua_agendamentos')) {
            localStorage.setItem('naRegua_agendamentos', JSON.stringify(DEFAULT_DATA.agendamentos));
        }
        if (!localStorage.getItem('naRegua_nextId')) {
            localStorage.setItem('naRegua_nextId', '3');
        }
    }

    // Métodos para clientes
    getClientes() {
        return JSON.parse(localStorage.getItem('naRegua_clientes') || '[]');
    }

    addCliente(cliente) {
        const clientes = this.getClientes();
        const nextId = parseInt(localStorage.getItem('naRegua_nextId'));
        
        cliente.id = nextId;
        cliente.dataCadastro = new Date().toISOString();
        clientes.push(cliente);
        
        localStorage.setItem('naRegua_clientes', JSON.stringify(clientes));
        localStorage.setItem('naRegua_nextId', (nextId + 1).toString());
        
        return cliente;
    }

    getClienteById(id) {
        const clientes = this.getClientes();
        return clientes.find(cliente => cliente.id == id);
    }

    // Métodos para barbeiros (dados públicos para agendamento)
    getBarbeiros() {
        return JSON.parse(localStorage.getItem('naRegua_barbeiros') || '[]');
    }

    getBarbeiroById(id) {
        const barbeiros = this.getBarbeiros();
        return barbeiros.find(barbeiro => barbeiro.id === id);
    }

    // Métodos para barbeiros autenticados (incluem senha e dados privados)
    getBarbeirosAuth() {
        return JSON.parse(localStorage.getItem('naRegua_barbeirosAuth') || '[]');
    }

    addBarbeiro(barbeiro) {
        const barbeirosAuth = this.getBarbeirosAuth();
        
        // Adicionar aos barbeiros autenticados (com senha)
        barbeirosAuth.push(barbeiro);
        localStorage.setItem('naRegua_barbeirosAuth', JSON.stringify(barbeirosAuth));
        
        // Adicionar aos barbeiros públicos (sem senha)
        const barbeiros = this.getBarbeiros();
        const barbeiroPublico = {
            id: barbeiro.id,
            nome: barbeiro.nome,
            especialidades: [barbeiro.especialidade],
            rating: barbeiro.rating || 5.0,
            descricao: barbeiro.descricao,
            totalAtendimentos: barbeiro.totalAtendimentos || 0,
            disponibilidade: this.gerarDisponibilidade(
                barbeiro.diasDisponiveis, 
                barbeiro.horarioInicio, 
                barbeiro.horarioFim
            )
        };
        barbeiros.push(barbeiroPublico);
        localStorage.setItem('naRegua_barbeiros', JSON.stringify(barbeiros));
        
        return barbeiro;
    }

    getBarbeiroAuthById(id) {
        const barbeiros = this.getBarbeirosAuth();
        return barbeiros.find(b => b.id === id);
    }

    updateBarbeiro(id, updates) {
        // Atualizar barbeiro autenticado
        const barbeirosAuth = this.getBarbeirosAuth();
        const indexAuth = barbeirosAuth.findIndex(b => b.id === id);
        
        if (indexAuth !== -1) {
            barbeirosAuth[indexAuth] = { ...barbeirosAuth[indexAuth], ...updates };
            localStorage.setItem('naRegua_barbeirosAuth', JSON.stringify(barbeirosAuth));
            
            // Atualizar também nos barbeiros públicos
            const barbeiros = this.getBarbeiros();
            const indexPublic = barbeiros.findIndex(b => b.id === id);
            
            if (indexPublic !== -1) {
                const barbeiroAtualizado = barbeirosAuth[indexAuth];
                barbeiros[indexPublic] = {
                    ...barbeiros[indexPublic],
                    nome: barbeiroAtualizado.nome,
                    especialidades: [barbeiroAtualizado.especialidade],
                    rating: barbeiroAtualizado.rating,
                    descricao: barbeiroAtualizado.descricao,
                    totalAtendimentos: barbeiroAtualizado.totalAtendimentos
                };
                localStorage.setItem('naRegua_barbeiros', JSON.stringify(barbeiros));
            }
            
            return barbeirosAuth[indexAuth];
        }
        return null;
    }

    gerarDisponibilidade(dias, horarioInicio, horarioFim) {
        const disponibilidade = {};
        const [horaInicio, minInicio] = horarioInicio.split(':').map(Number);
        const [horaFim, minFim] = horarioFim.split(':').map(Number);
        
        const horarios = [];
        let hora = horaInicio;
        let min = minInicio;
        
        while (hora < horaFim || (hora === horaFim && min < minFim)) {
            horarios.push(`${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
            min += 30; // Intervalos de 30 minutos
            if (min >= 60) {
                min = 0;
                hora++;
            }
        }
        
        dias.forEach(dia => {
            disponibilidade[dia] = [...horarios];
        });
        
        // Preencher dias não selecionados com array vazio
        const todosDias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
        todosDias.forEach(dia => {
            if (!disponibilidade[dia]) {
                disponibilidade[dia] = [];
            }
        });
        
        return disponibilidade;
    }

    // Métodos para serviços
    getServicos() {
        return JSON.parse(localStorage.getItem('naRegua_servicos') || '[]');
    }

    getServicoById(id) {
        const servicos = this.getServicos();
        return servicos.find(servico => servico.id === id);
    }

    // Métodos para agendamentos
    getAgendamentos() {
        return JSON.parse(localStorage.getItem('naRegua_agendamentos') || '[]');
    }

    addAgendamento(agendamento) {
        const agendamentos = this.getAgendamentos();
        
        // Gerar código único do agendamento
        agendamento.codigo = this.generateAgendamentoCodigo();
        agendamento.dataAgendamento = new Date().toISOString();
        agendamento.status = 'agendado';
        
        agendamentos.push(agendamento);
        localStorage.setItem('naRegua_agendamentos', JSON.stringify(agendamentos));
        
        return agendamento;
    }

    updateAgendamento(codigo, updates) {
        const agendamentos = this.getAgendamentos();
        const index = agendamentos.findIndex(ag => ag.codigo === codigo);
        
        if (index !== -1) {
            agendamentos[index] = { ...agendamentos[index], ...updates };
            localStorage.setItem('naRegua_agendamentos', JSON.stringify(agendamentos));
            return agendamentos[index];
        }
        return null;
    }

    deleteAgendamento(codigo) {
        const agendamentos = this.getAgendamentos();
        const filteredAgendamentos = agendamentos.filter(ag => ag.codigo !== codigo);
        localStorage.setItem('naRegua_agendamentos', JSON.stringify(filteredAgendamentos));
    }

    getAgendamentosByCodigo(codigo) {
        const agendamentos = this.getAgendamentos();
        return agendamentos.find(ag => ag.codigo === codigo);
    }

    // Verificar conflitos de horário
    checkConflito(barbeiro, data, horario, duracaoMinutos, excludeCodigo = null) {
        const agendamentos = this.getAgendamentos();
        const dataAgendamento = new Date(data);
        const [hora, minuto] = horario.split(':');
        
        const inicioAgendamento = new Date(dataAgendamento);
        inicioAgendamento.setHours(parseInt(hora), parseInt(minuto), 0, 0);
        
        const fimAgendamento = new Date(inicioAgendamento);
        fimAgendamento.setMinutes(fimAgendamento.getMinutes() + duracaoMinutos);

        return agendamentos.some(ag => {
            if (excludeCodigo && ag.codigo === excludeCodigo) return false;
            if (ag.barbeiro !== barbeiro) return false;
            if (ag.status === 'cancelado') return false;

            const agData = new Date(ag.data);
            if (agData.toDateString() !== dataAgendamento.toDateString()) return false;

            const [agHora, agMinuto] = ag.horario.split(':');
            const inicioExistente = new Date(agData);
            inicioExistente.setHours(parseInt(agHora), parseInt(agMinuto), 0, 0);
            
            const fimExistente = new Date(inicioExistente);
            fimExistente.setMinutes(fimExistente.getMinutes() + ag.duracao);

            // Verificar sobreposição
            return (inicioAgendamento < fimExistente && fimAgendamento > inicioExistente);
        });
    }

    generateAgendamentoCodigo() {
        const now = new Date();
        const timestamp = now.getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `AG${timestamp}${random}`.toUpperCase();
    }
}

// Utilitários
class Utils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    static formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    static getDayOfWeek(dateString) {
        const date = new Date(dateString);
        const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        return days[date.getDay()];
    }

    static showNotification(message, type = 'success') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
            <button class="close-notification" onclick="this.parentElement.remove()">×</button>
        `;

        // Adicionar ao body
        document.body.appendChild(notification);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return re.test(phone);
    }

    static maskPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        input.value = value;
    }
}

// Inicializar navegação mobile
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar database primeiro
    window.db = new DatabaseManager();
    
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Aplicar máscaras em campos de telefone
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => Utils.maskPhone(input));
    });
});

// Funções globais para modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Exportar para uso global
window.Utils = Utils;
window.DatabaseManager = DatabaseManager;