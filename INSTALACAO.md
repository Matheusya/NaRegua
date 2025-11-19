# Sistema de Agendamento Na Régua 💈

Sistema completo de agendamento para barbearias com envio automático de emails de confirmação.

## 🚀 Funcionalidades

- ✅ Cadastro de clientes com confirmação por email
- ✅ Cadastro de barbeiros com confirmação por email
- ✅ Sistema de agendamento com envio de confirmação por email
- ✅ Salvamento de dados em arquivos JSON
- ✅ Interface web responsiva
- ✅ Backend Node.js com Express
- ✅ Sistema de autenticação

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Git](https://git-scm.com/) (opcional)
- Um servidor de email (Gmail, Outlook, etc.)

## 🔧 Instalação

### 1. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```powershell
npm install
```

Isso instalará as seguintes dependências:

- `express` - Framework web
- `cors` - Permitir requisições de diferentes origens
- `nodemailer` - Envio de emails
- `nodemon` - Reiniciar servidor automaticamente (dev)

### 2. Configurar Email

**MUITO IMPORTANTE!** Você precisa configurar as credenciais de email antes de usar o sistema.

Abra o arquivo `server.js` e localize estas linhas (próximo ao topo):

```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou 'outlook', 'yahoo', etc
    auth: {
        user: matheus.yuri@aedb.br, // ALTERE AQUI
        pass: Kiyuwel31 // ALTERE AQUI (use senha de aplicativo)
    }
});
```

#### Para Gmail:

1. Acesse [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Faça login na sua conta Google
3. Crie uma nova senha de aplicativo
4. Selecione "App: Outro (nome personalizado)"
5. Digite "Na Régua" e clique em GERAR
6. Copie a senha gerada (16 caracteres)
7. Cole no campo `pass` do arquivo `server.js`
8. Coloque seu email no campo `user`

#### Para Outlook/Hotmail:

1. Acesse [https://account.live.com/proofs/AppPassword](https://account.live.com/proofs/AppPassword)
2. Siga os passos similares ao Gmail
3. Altere `service: 'gmail'` para `service: 'outlook'`

### 3. Alterar Email do Remetente

No arquivo `server.js`, procure por todos os locais com `from: 'seu-email@gmail.com'` e altere para o seu email (são 3 locais):

```javascript
from: 'seu-email@gmail.com', // ALTERE AQUI
```

## ▶️ Como Executar

### Iniciar o Servidor Backend

No terminal, execute:

```powershell
npm start
```

Ou para modo de desenvolvimento (reinicia automaticamente):

```powershell
npm run dev
```

Você verá uma mensagem assim:

```
════════════════════════════════════════════════════
✂️  SERVIDOR NA RÉGUA INICIADO COM SUCESSO!
════════════════════════════════════════════════════
🚀 Servidor rodando em: http://localhost:3000
📁 Diretório de dados: C:\...\data
```

**IMPORTANTE:** Mantenha este terminal aberto enquanto usa o sistema!

### Abrir o Frontend

1. Abra outro terminal ou use o VS Code Live Server
2. Navegue até a pasta do projeto
3. Abra o arquivo `index.html` no navegador

**Opções:**

**Com VS Code Live Server:**

- Clique com botão direito em `index.html`
- Selecione "Open with Live Server"
- O navegador abrirá automaticamente

**Sem Live Server:**

- Simplesmente abra o arquivo `index.html` no navegador
- Ou use: `powershell Start-Process index.html`

## 📂 Estrutura de Arquivos

```
NaRegua/
├── server.js              # Servidor backend Node.js
├── package.json           # Dependências do projeto
├── data/                  # Pasta criada automaticamente
│   ├── clientes.json      # Dados dos clientes
│   ├── barbeiros.json     # Dados dos barbeiros
│   └── agendamentos.json  # Dados dos agendamentos
├── index.html             # Página inicial
├── css/
│   └── style.css          # Estilos
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── cadastro.js        # ✅ Atualizado com integração backend
│   ├── cadastro-barbeiro.js # ✅ Atualizado com integração backend
│   ├── agendamento.js     # ✅ Atualizado com integração backend
│   ├── painel.js
│   └── painel-barbeiro.js
└── pages/
    ├── cadastro.html
    ├── cadastro-barbeiro.html
    ├── agendamento.html
    ├── login.html
    ├── painel.html
    └── painel-barbeiro.html
```

## 📧 Emails Enviados

O sistema envia emails automaticamente nas seguintes situações:

### 1. Cadastro de Cliente

- ✅ Email de boas-vindas
- 📋 Dados do cadastro
- 🔗 Link para fazer agendamento

### 2. Cadastro de Barbeiro

- ✅ Email de confirmação
- 💼 Dados profissionais
- 🔗 Link para acessar painel

### 3. Agendamento Realizado

- ✅ Confirmação do agendamento
- 📅 Data e horário
- 💈 Informações do barbeiro
- ✂️ Serviço escolhido
- 💰 Valor
- 🆔 Código do agendamento

## 🔍 Testando o Sistema

### Teste Completo:

1. **Inicie o servidor backend:**

   ```powershell
   npm start
   ```

2. **Abra o frontend** (`index.html`)

3. **Cadastre um barbeiro:**

   - Vá em "Sou Barbeiro"
   - Preencha o formulário
   - Use um email válido seu
   - Clique em "Cadastrar"
   - ✅ Você receberá um email de confirmação!

4. **Cadastre um cliente:**

   - Vá em "Cadastro"
   - Preencha o formulário
   - Use outro email válido seu
   - Clique em "Cadastrar"
   - ✅ Você receberá um email de confirmação!

5. **Faça um agendamento:**
   - Faça login como cliente
   - Vá em "Agendamento"
   - Escolha serviço, barbeiro, data e horário
   - Confirme o agendamento
   - ✅ Você receberá um email com os detalhes!

## 🛠️ Solução de Problemas

### Servidor não inicia

- Verifique se a porta 3000 está livre
- Execute: `netstat -ano | findstr :3000`
- Se estiver em uso, mate o processo ou altere a porta no `server.js`

### Emails não são enviados

- ✅ Verifique se configurou corretamente as credenciais
- ✅ Use senha de APLICATIVO, não sua senha normal
- ✅ Verifique se o email está correto
- ✅ Ative "Acesso de apps menos seguros" (Gmail)
- ✅ Verifique sua conexão com internet
- ✅ Confira o console do servidor para ver erros

### Erro "fetch failed" ou "Network error"

- ✅ Certifique-se que o servidor backend está rodando
- ✅ Verifique se está usando `http://localhost:3000` (não HTTPS)
- ✅ Verifique se o CORS está habilitado no servidor

### Dados não são salvos

- ✅ Verifique se a pasta `data/` foi criada
- ✅ Verifique permissões de escrita
- ✅ Confira o console do servidor para erros

## 📊 Endpoints da API

```
POST /api/cadastro/cliente      - Cadastrar novo cliente
POST /api/cadastro/barbeiro     - Cadastrar novo barbeiro
POST /api/agendamento           - Criar novo agendamento
GET  /api/agendamentos          - Listar todos agendamentos
GET  /api/agendamentos/cliente/:id - Agendamentos de um cliente
GET  /api/agendamentos/barbeiro/:id - Agendamentos de um barbeiro
GET  /api/barbeiros             - Listar barbeiros
GET  /api/clientes              - Listar clientes
```

## 🔐 Segurança

⚠️ **IMPORTANTE:** Este é um projeto educacional/demonstrativo.

Para uso em produção, você deve:

- ✅ Usar HTTPS
- ✅ Hash de senhas (bcrypt)
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL Injection
- ✅ Rate limiting
- ✅ Usar banco de dados real (MongoDB, PostgreSQL, etc.)
- ✅ Variáveis de ambiente para credenciais (dotenv)
- ✅ Autenticação JWT
- ✅ Validação de tokens

## 💡 Melhorias Futuras

- [ ] Usar banco de dados real
- [ ] Implementar autenticação JWT
- [ ] Adicionar recuperação de senha por email
- [ ] Notificações de lembrete (24h antes)
- [ ] SMS além de email
- [ ] Dashboard administrativo
- [ ] Relatórios e estatísticas
- [ ] Sistema de avaliações
- [ ] Upload de fotos de perfil
- [ ] Integração com WhatsApp

## 📝 Licença

MIT License - Sinta-se livre para usar este projeto!

## 👨‍💻 Suporte

Se tiver problemas:

1. Verifique o console do navegador (F12)
2. Verifique o terminal do servidor
3. Confira se seguiu todos os passos de configuração
4. Teste com emails diferentes

---

**Desenvolvido com ❤️ para modernizar barbearias!** ✂️💈
