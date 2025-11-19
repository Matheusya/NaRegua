const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar configurações e utilidades
const { initDataDir } = require('./src/utils/database');

// Importar rotas
const clienteRoutes = require('./src/routes/cliente.routes');
const barbeiroRoutes = require('./src/routes/barbeiro.routes');
const agendamentoRoutes = require('./src/routes/agendamento.routes');
const testRoutes = require('./src/routes/test.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
app.use('/api', clienteRoutes);
app.use('/api', barbeiroRoutes);
app.use('/api', agendamentoRoutes);
app.use('/api', testRoutes);

// Inicialização
initDataDir().then(() => {
    app.listen(PORT, () => {
        console.log('');
        console.log('════════════════════════════════════════════════════');
        console.log('✂️  SERVIDOR NA RÉGUA INICIADO COM SUCESSO!');
        console.log('════════════════════════════════════════════════════');
        console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
        console.log(`📁 Diretório público: ${path.join(__dirname, 'public')}`);
        console.log('');
        console.log('📋 Endpoints da API:');
        console.log('   POST /api/cadastro/cliente');
        console.log('   POST /api/cadastro/barbeiro');
        console.log('   POST /api/agendamento');
        console.log('   POST /api/test-email');
        console.log('   GET  /api/agendamentos');
        console.log('   GET  /api/barbeiros');
        console.log('   GET  /api/clientes');
        console.log('════════════════════════════════════════════════════');
        console.log('');
    });
});
