const nodemailer = require('nodemailer');

// Configuração de email
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'matheusya31@gmail.com',
        pass: process.env.EMAIL_PASS || 'gemj ijae jost xupp'
    }
};

// Verificar se email está configurado
const EMAIL_CONFIGURADO = EMAIL_CONFIG.auth.user !== 'seu-email@gmail.com' && 
                          EMAIL_CONFIG.auth.pass !== 'sua-senha-app';

let transporter = null;

if (EMAIL_CONFIGURADO) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
    console.log('📧 Email configurado: ' + EMAIL_CONFIG.auth.user);
} else {
    console.warn('⚠️  EMAIL NÃO CONFIGURADO!');
    console.warn('⚠️  Edite as variáveis de ambiente ou src/config/email.js');
    console.warn('⚠️  Os cadastros funcionarão, mas emails não serão enviados');
}

module.exports = { transporter, EMAIL_CONFIGURADO, EMAIL_CONFIG };
