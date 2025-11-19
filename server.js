const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Usar porta do Render ou 3000

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos (HTML, CSS, JS)

// ========================================
// CONFIGURAÇÃO DE EMAIL
// ========================================
// IMPORTANTE: Configure com suas credenciais reais
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'matheusya31@gmail.com', // Usar variável de ambiente
        pass: process.env.EMAIL_PASS || 'gemj ijae jost xupp' // Usar variável de ambiente
    }
};

// Verificar se email está configurado
const EMAIL_CONFIGURADO = EMAIL_CONFIG.auth.user !== 'matheusya31@gmail.com' && 
                          EMAIL_CONFIG.auth.pass !== 'gemj ijae jost xupp';

let transporter = null;

if (EMAIL_CONFIGURADO) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
    console.log('📧 Email configurado: ' + EMAIL_CONFIG.auth.user);
} else {
    console.warn('⚠️  EMAIL NÃO CONFIGURADO!');
    console.warn('⚠️  Edite o server.js e configure suas credenciais de email');
    console.warn('⚠️  Os cadastros funcionarão, mas emails não serão enviados');
}

// Para Gmail: https://myaccount.google.com/apppasswords
// Para Outlook: https://account.live.com/proofs/AppPassword

// ========================================
// CONFIGURAÇÃO DE ARQUIVOS
// ========================================
const DATA_DIR = path.join(__dirname, 'data');
const CLIENTES_FILE = path.join(DATA_DIR, 'clientes.json');
const BARBEIROS_FILE = path.join(DATA_DIR, 'barbeiros.json');
const AGENDAMENTOS_FILE = path.join(DATA_DIR, 'agendamentos.json');

// Criar diretório de dados se não existir
async function initDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Criar arquivos se não existirem
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

// ========================================
// FUNÇÕES AUXILIARES
// ========================================
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

// ========================================
// FUNÇÕES DE EMAIL
// ========================================
async function enviarEmailConfirmacaoCadastro(usuario, tipo) {
    if (!EMAIL_CONFIGURADO) {
        console.warn('⚠️  Email não enviado - Configure suas credenciais no server.js');
        return false;
    }
    
    const tipoTexto = tipo === 'cliente' ? 'Cliente' : 'Barbeiro';
    
    const mailOptions = {
        from: EMAIL_CONFIG.auth.user,
        to: usuario.email,
        subject: `✅ Cadastro Confirmado - Na Régua ${tipoTexto}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">✂️ Na Régua</h1>
                    <p style="color: white; margin-top: 10px;">Sistema de Agendamento para Barbearias</p>
                </div>
                
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Olá, ${usuario.nome}! 👋</h2>
                    
                    <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        Seu cadastro como <strong style="color: #667eea;">${tipoTexto}</strong> foi realizado com sucesso!
                    </p>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-top: 0;">📋 Dados do Cadastro:</h3>
                        <p style="margin: 8px 0;"><strong>Nome:</strong> ${usuario.nome}</p>
                        <p style="margin: 8px 0;"><strong>Email:</strong> ${usuario.email}</p>
                        <p style="margin: 8px 0;"><strong>Telefone:</strong> ${usuario.telefone || 'Não informado'}</p>
                        ${tipo === 'barbeiro' ? `
                            <p style="margin: 8px 0;"><strong>Especialidades:</strong> ${usuario.especialidades?.join(', ') || 'Não informadas'}</p>
                        ` : ''}
                        <p style="margin: 8px 0;"><strong>Data de Cadastro:</strong> ${new Date().toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    
                    ${tipo === 'cliente' ? `
                        <p style="font-size: 16px; color: #666; line-height: 1.6;">
                            🎉 Agora você já pode fazer seus agendamentos na nossa plataforma!
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5500/pages/agendamento.html" 
                               style="background-color: #667eea; color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block; 
                                      font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                📅 Fazer Agendamento
                            </a>
                        </div>
                    ` : `
                        <p style="font-size: 16px; color: #666; line-height: 1.6;">
                            💼 Bem-vindo à nossa equipe! Acesse seu painel para gerenciar seus horários e atendimentos.
                        </p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5500/pages/painel-barbeiro.html" 
                               style="background-color: #667eea; color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block; 
                                      font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                🎯 Acessar Painel
                            </a>
                        </div>
                    `}
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                            <strong>💡 Dica:</strong> Guarde bem suas credenciais de acesso para futuras utilizações da plataforma.
                        </p>
                    </div>
                </div>
                
                <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        © 2025 Na Régua - Sistema de Agendamento para Barbearias
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            </div>
        `
    };
    
    try {
        console.log(`📤 Enviando email de ${tipo} para: ${usuario.email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email de cadastro enviado com sucesso!`);
        console.log(`   Para: ${usuario.email}`);
        console.log(`   Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ ERRO ao enviar email para ${usuario.email}:`);
        console.error(`   Erro: ${error.message}`);
        if (error.code) console.error(`   Código: ${error.code}`);
        return false;
    }
}

async function enviarEmailConfirmacaoAgendamento(agendamento, cliente, barbeiro) {
    if (!EMAIL_CONFIGURADO) {
        console.warn('⚠️  Email não enviado - Configure suas credenciais no server.js');
        return false;
    }
    
    // Email para o CLIENTE
    const mailOptionsCliente = {
        from: EMAIL_CONFIG.auth.user,
        to: cliente.email,
        subject: '✅ Agendamento Confirmado - Na Régua',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">✂️ Na Régua</h1>
                    <p style="color: white; margin-top: 10px;">Agendamento Confirmado com Sucesso!</p>
                </div>
                
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Olá, ${cliente.nome}! 👋</h2>
                    
                    <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        Seu agendamento foi confirmado com sucesso! Confira os detalhes abaixo:
                    </p>
                    
                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <h3 style="color: #28a745; margin-top: 0;">📅 Detalhes do Agendamento:</h3>
                        
                        <div style="margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                            <p style="margin: 8px 0; font-size: 16px;">
                                <strong>📆 Data:</strong> 
                                <span style="color: #667eea; font-size: 18px; font-weight: bold;">
                                    ${new Date(agendamento.data).toLocaleDateString('pt-BR', { 
                                        weekday: 'long',
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric'
                                    })}
                                </span>
                            </p>
                            <p style="margin: 8px 0; font-size: 16px;">
                                <strong>⏰ Horário:</strong> 
                                <span style="color: #667eea; font-size: 18px; font-weight: bold;">
                                    ${agendamento.horario}
                                </span>
                            </p>
                        </div>
                        
                        <p style="margin: 8px 0;"><strong>💈 Barbeiro:</strong> ${barbeiro?.nome || 'Não especificado'}</p>
                        <p style="margin: 8px 0;"><strong>✂️ Serviço:</strong> ${agendamento.servico}</p>
                        ${agendamento.observacoes ? `
                            <p style="margin: 8px 0;"><strong>📝 Observações:</strong> ${agendamento.observacoes}</p>
                        ` : ''}
                        <p style="margin: 8px 0;"><strong>🆔 Código do Agendamento:</strong> <code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px;">#${agendamento.id}</code></p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #d1ecf1; border-radius: 5px; border-left: 4px solid #17a2b8;">
                        <p style="margin: 0; color: #0c5460; font-size: 14px;">
                            <strong>ℹ️ Importante:</strong> Por favor, chegue com 10 minutos de antecedência. 
                            Em caso de atraso ou necessidade de cancelamento, entre em contato conosco o quanto antes.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5500/pages/painel.html" 
                           style="background-color: #667eea; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            📋 Ver Meus Agendamentos
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404; font-size: 14px;">
                            <strong>💡 Dica:</strong> Você pode gerenciar seus agendamentos a qualquer momento através do seu painel.
                        </p>
                    </div>
                </div>
                
                <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        © 2025 Na Régua - Sistema de Agendamento para Barbearias
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            </div>
        `
    };
    
    // Email para o BARBEIRO
    const mailOptionsBarbeiro = {
        from: EMAIL_CONFIG.auth.user,
        to: barbeiro?.email,
        subject: '📅 Novo Agendamento - Na Régua',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">✂️ Na Régua</h1>
                    <p style="color: white; margin-top: 10px;">Você tem um Novo Agendamento!</p>
                </div>
                
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Olá, ${barbeiro?.nome}! 👋</h2>
                    
                    <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        Um novo agendamento foi confirmado para você. Confira os detalhes:
                    </p>
                    
                    <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <h3 style="color: #667eea; margin-top: 0;">📅 Detalhes do Agendamento:</h3>
                        
                        <div style="margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                            <p style="margin: 8px 0; font-size: 16px;">
                                <strong>📆 Data:</strong> 
                                <span style="color: #667eea; font-size: 18px; font-weight: bold;">
                                    ${new Date(agendamento.data).toLocaleDateString('pt-BR', { 
                                        weekday: 'long',
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric'
                                    })}
                                </span>
                            </p>
                            <p style="margin: 8px 0; font-size: 16px;">
                                <strong>⏰ Horário:</strong> 
                                <span style="color: #667eea; font-size: 18px; font-weight: bold;">
                                    ${agendamento.horario}
                                </span>
                            </p>
                            <p style="margin: 8px 0; font-size: 16px;">
                                <strong>⏱️ Duração:</strong> ${agendamento.duracao || 30} minutos
                            </p>
                        </div>
                        
                        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <h4 style="color: #1976D2; margin-top: 0; margin-bottom: 10px;">👤 Informações do Cliente:</h4>
                            <p style="margin: 5px 0;"><strong>Nome:</strong> ${cliente.nome}</p>
                            <p style="margin: 5px 0;"><strong>📞 Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                            <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${cliente.email}</p>
                        </div>
                        
                        <p style="margin: 8px 0;"><strong>✂️ Serviço:</strong> ${agendamento.servicoNome || agendamento.servico}</p>
                        <p style="margin: 8px 0;"><strong>💰 Valor:</strong> R$ ${(agendamento.valor || 0).toFixed(2)}</p>
                        ${agendamento.observacoes ? `
                            <p style="margin: 8px 0;"><strong>📝 Observações:</strong> ${agendamento.observacoes}</p>
                        ` : ''}
                        <p style="margin: 8px 0;"><strong>🆔 Código:</strong> <code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px;">#${agendamento.id}</code></p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;">
                        <p style="margin: 0; color: #155724; font-size: 14px;">
                            <strong>✅ Dica:</strong> Reserve este horário em sua agenda e esteja preparado com antecedência.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5500/pages/painel-barbeiro.html" 
                           style="background-color: #667eea; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            📋 Ver Todos os Agendamentos
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 14px;">
                        © 2025 Na Régua - Sistema de Agendamento para Barbearias
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                        Este é um email automático, por favor não responda.
                    </p>
                </div>
            </div>
        `
    };
    
    try {
        let emailsEnviados = 0;
        
        // Enviar email para o cliente
        console.log(`📤 Enviando email de agendamento para CLIENTE: ${cliente.email}...`);
        const infoCliente = await transporter.sendMail(mailOptionsCliente);
        console.log(`✅ Email enviado para o cliente com sucesso!`);
        console.log(`   Para: ${cliente.email}`);
        console.log(`   Message ID: ${infoCliente.messageId}`);
        emailsEnviados++;
        
        // Enviar email para o barbeiro (se tiver email)
        if (barbeiro && barbeiro.email) {
            console.log(`📤 Enviando email de agendamento para BARBEIRO: ${barbeiro.email}...`);
            const infoBarbeiro = await transporter.sendMail(mailOptionsBarbeiro);
            console.log(`✅ Email enviado para o barbeiro com sucesso!`);
            console.log(`   Para: ${barbeiro.email}`);
            console.log(`   Message ID: ${infoBarbeiro.messageId}`);
            emailsEnviados++;
        } else {
            console.warn(`⚠️  Barbeiro sem email cadastrado - Email não enviado para o barbeiro`);
        }
        
        return emailsEnviados > 0;
    } catch (error) {
        console.error(`❌ ERRO ao enviar emails de agendamento:`);
        console.error(`   Erro: ${error.message}`);
        if (error.code) console.error(`   Código: ${error.code}`);
        return false;
    }
}

// ========================================
// ROTA DE TESTE DE EMAIL
// ========================================
app.post('/api/test-email', async (req, res) => {
    if (!EMAIL_CONFIGURADO) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email não configurado. Edite o server.js com suas credenciais.' 
        });
    }
    
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email não fornecido' 
        });
    }
    
    const mailOptions = {
        from: EMAIL_CONFIG.auth.user,
        to: email,
        subject: '✅ Teste de Email - Na Régua',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #667eea;">🎉 Teste de Email Funcionando!</h1>
                <p>Se você recebeu este email, significa que o sistema de envio está configurado corretamente.</p>
                <p><strong>Sistema:</strong> Na Régua</p>
                <p><strong>Remetente:</strong> ${EMAIL_CONFIG.auth.user}</p>
                <p><strong>Destinatário:</strong> ${email}</p>
                <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <hr>
                <p style="color: #28a745;">✅ Configuração de email OK!</p>
            </div>
        `
    };
    
    try {
        console.log(`📤 Enviando email de teste para: ${email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email de teste enviado com sucesso!`);
        console.log(`   Message ID: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: 'Email de teste enviado com sucesso!',
            messageId: info.messageId
        });
    } catch (error) {
        console.error(`❌ Erro ao enviar email de teste:`, error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar email: ' + error.message,
            error: error.code || 'UNKNOWN'
        });
    }
});

// ========================================
// ROTAS - CADASTRO DE CLIENTES
// ========================================
app.post('/api/cadastro/cliente', async (req, res) => {
    try {
        const novoCliente = {
            id: Date.now().toString(),
            ...req.body,
            tipo: 'cliente',
            dataCadastro: new Date().toISOString(),
            ativo: true
        };
        
        const clientes = await readData(CLIENTES_FILE);
        
        // Verificar se email já existe
        const emailExiste = clientes.find(c => c.email === novoCliente.email);
        if (emailExiste) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email já cadastrado!' 
            });
        }
        
        clientes.push(novoCliente);
        await saveData(CLIENTES_FILE, clientes);
        
        // Enviar email de confirmação
        const emailEnviado = await enviarEmailConfirmacaoCadastro(novoCliente, 'cliente');
        
        res.json({ 
            success: true, 
            message: 'Cliente cadastrado com sucesso!',
            emailEnviado,
            cliente: { ...novoCliente, senha: undefined } // Não retornar senha
        });
        
        console.log(`✅ Cliente cadastrado: ${novoCliente.nome} (${novoCliente.email})`);
    } catch (error) {
        console.error('❌ Erro ao cadastrar cliente:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao cadastrar cliente' 
        });
    }
});

// ========================================
// ROTAS - CADASTRO DE BARBEIROS
// ========================================
app.post('/api/cadastro/barbeiro', async (req, res) => {
    try {
        const novoBarbeiro = {
            id: Date.now().toString(),
            ...req.body,
            tipo: 'barbeiro',
            dataCadastro: new Date().toISOString(),
            ativo: true
        };
        
        const barbeiros = await readData(BARBEIROS_FILE);
        
        // Verificar se email já existe
        const emailExiste = barbeiros.find(b => b.email === novoBarbeiro.email);
        if (emailExiste) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email já cadastrado!' 
            });
        }
        
        barbeiros.push(novoBarbeiro);
        await saveData(BARBEIROS_FILE, barbeiros);
        
        // Enviar email de confirmação
        const emailEnviado = await enviarEmailConfirmacaoCadastro(novoBarbeiro, 'barbeiro');
        
        res.json({ 
            success: true, 
            message: 'Barbeiro cadastrado com sucesso!',
            emailEnviado,
            barbeiro: { ...novoBarbeiro, senha: undefined } // Não retornar senha
        });
        
        console.log(`✅ Barbeiro cadastrado: ${novoBarbeiro.nome} (${novoBarbeiro.email})`);
    } catch (error) {
        console.error('❌ Erro ao cadastrar barbeiro:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao cadastrar barbeiro' 
        });
    }
});

// ========================================
// ROTAS - AGENDAMENTOS
// ========================================
app.post('/api/agendamento', async (req, res) => {
    try {
        const novoAgendamento = {
            id: Date.now().toString(),
            ...req.body,
            dataAgendamento: new Date().toISOString(),
            status: 'confirmado'
        };
        
        const agendamentos = await readData(AGENDAMENTOS_FILE);
        agendamentos.push(novoAgendamento);
        await saveData(AGENDAMENTOS_FILE, agendamentos);
        
        // Buscar dados do cliente e barbeiro para o email
        const clientes = await readData(CLIENTES_FILE);
        const barbeiros = await readData(BARBEIROS_FILE);
        
        const cliente = clientes.find(c => c.id === novoAgendamento.clienteId);
        const barbeiro = barbeiros.find(b => b.id === novoAgendamento.barbeiroId);
        
        // Enviar email de confirmação
        let emailEnviado = false;
        if (cliente) {
            emailEnviado = await enviarEmailConfirmacaoAgendamento(novoAgendamento, cliente, barbeiro);
        }
        
        res.json({ 
            success: true, 
            message: 'Agendamento realizado com sucesso!',
            emailEnviado,
            agendamento: novoAgendamento
        });
        
        console.log(`✅ Agendamento criado: ${cliente?.nome} com ${barbeiro?.nome} em ${novoAgendamento.data} às ${novoAgendamento.horario}`);
    } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao criar agendamento' 
        });
    }
});

// Listar todos os agendamentos
app.get('/api/agendamentos', async (req, res) => {
    try {
        const agendamentos = await readData(AGENDAMENTOS_FILE);
        res.json({ success: true, agendamentos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
    }
});

// Listar agendamentos por cliente
app.get('/api/agendamentos/cliente/:clienteId', async (req, res) => {
    try {
        const agendamentos = await readData(AGENDAMENTOS_FILE);
        const agendamentosCliente = agendamentos.filter(a => a.clienteId === req.params.clienteId);
        res.json({ success: true, agendamentos: agendamentosCliente });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
    }
});

// Listar agendamentos por barbeiro
app.get('/api/agendamentos/barbeiro/:barbeiroId', async (req, res) => {
    try {
        const agendamentos = await readData(AGENDAMENTOS_FILE);
        const agendamentosBarbeiro = agendamentos.filter(a => a.barbeiroId === req.params.barbeiroId);
        res.json({ success: true, agendamentos: agendamentosBarbeiro });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
    }
});

// ========================================
// ROTAS - CONSULTAS
// ========================================
// Listar todos os barbeiros
app.get('/api/barbeiros', async (req, res) => {
    try {
        const barbeiros = await readData(BARBEIROS_FILE);
        // Não retornar senhas
        const barbeirosSemSenha = barbeiros.map(b => ({ ...b, senha: undefined }));
        res.json({ success: true, barbeiros: barbeirosSemSenha });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar barbeiros' });
    }
});

// Listar todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await readData(CLIENTES_FILE);
        // Não retornar senhas
        const clientesSemSenha = clientes.map(c => ({ ...c, senha: undefined }));
        res.json({ success: true, clientes: clientesSemSenha });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar clientes' });
    }
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================
initDataDir().then(() => {
    app.listen(PORT, () => {
        console.log('');
        console.log('════════════════════════════════════════════════════');
        console.log('✂️  SERVIDOR NA RÉGUA INICIADO COM SUCESSO!');
        console.log('════════════════════════════════════════════════════');
        console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
        console.log(`📁 Diretório de dados: ${DATA_DIR}`);
        console.log('');
        console.log('📋 Endpoints disponíveis:');
        console.log('   POST /api/cadastro/cliente');
        console.log('   POST /api/cadastro/barbeiro');
        console.log('   POST /api/agendamento');
        console.log('   GET  /api/agendamentos');
        console.log('   GET  /api/barbeiros');
        console.log('   GET  /api/clientes');
        console.log('════════════════════════════════════════════════════');
        console.log('');
        console.log('⚠️  IMPORTANTE: Configure suas credenciais de email!');
        console.log('   Edite o arquivo server.js e altere:');
        console.log('   - user: seu-email@gmail.com');
        console.log('   - pass: sua-senha-app');
        console.log('');
        console.log('════════════════════════════════════════════════════');
    });
});
