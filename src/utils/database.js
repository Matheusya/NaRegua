const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const CLIENTES_FILE = path.join(DATA_DIR, 'clientes.json');
const BARBEIROS_FILE = path.join(DATA_DIR, 'barbeiros.json');
const AGENDAMENTOS_FILE = path.join(DATA_DIR, 'agendamentos.json');

// Criar diretório de dados se não existir
async function initDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        const files = [CLIENTES_FILE, BARBEIROS_FILE, AGENDAMENTOS_FILE];
        for (const file of files) {
            try {
                await fs.access(file);
            } catch {
                await fs.writeFile(file, JSON.stringify([]));
            }
        }
        console.log('✅ Diretório de dados inicializado');
    } catch (error) {
        console.error('❌ Erro ao criar diretório de dados:', error);
    }
}

// Funções auxiliares
async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveData(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

module.exports = {
    initDataDir,
    readData,
    saveData,
    CLIENTES_FILE,
    BARBEIROS_FILE,
    AGENDAMENTOS_FILE
};
