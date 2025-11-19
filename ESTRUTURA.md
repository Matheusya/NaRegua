# 📁 Estrutura do Projeto Na Régua

## 🗂️ Organização de Pastas

```
NaRegua/
│
├── 📂 public/                    # Arquivos frontend (HTML, CSS, JS)
│   ├── index.html               # Página principal
│   ├── 📂 css/                  # Estilos
│   │   └── style.css
│   ├── 📂 js/                   # Scripts do frontend
│   │   ├── main.js
│   │   ├── auth.js
│   │   ├── cadastro.js
│   │   ├── cadastro-barbeiro.js
│   │   ├── agendamento.js
│   │   ├── painel.js
│   │   └── painel-barbeiro.js
│   └── 📂 pages/                # Páginas HTML
│       ├── cadastro.html
│       ├── cadastro-barbeiro.html
│       ├── agendamento.html
│       ├── login.html
│       ├── painel.html
│       ├── painel-barbeiro.html
│       └── test-email.html
│
├── 📂 src/                      # Código do backend (Node.js)
│   ├── 📂 config/               # Configurações
│   │   └── email.js             # Configuração de email
│   ├── 📂 controllers/          # Lógica de negócio
│   │   ├── cliente.controller.js
│   │   ├── barbeiro.controller.js
│   │   └── agendamento.controller.js
│   ├── 📂 services/             # Serviços (emails, etc)
│   │   └── email.service.js
│   ├── 📂 routes/               # Rotas da API
│   │   ├── cliente.routes.js
│   │   ├── barbeiro.routes.js
│   │   ├── agendamento.routes.js
│   │   └── test.routes.js
│   └── 📂 utils/                # Utilitários
│       └── database.js          # Funções de banco de dados
│
├── 📂 data/                     # Banco de dados JSON
│   ├── clientes.json
│   ├── barbeiros.json
│   └── agendamentos.json
│
├── 📂 docs/                     # Documentação
│   ├── README.md
│   ├── INSTALACAO.md
│   ├── CONFIGURACAO-EMAIL.md
│   └── DEPLOY.md
│
├── 📂 node_modules/             # Dependências (não versionar)
│
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts
├── package-lock.json            # Versões exatas das dependências
└── server.js                    # Servidor principal

```

## 📦 Arquivos Principais

### **Backend (Node.js)**
- `server.js` - Servidor Express principal
- `src/config/email.js` - Configuração do Nodemailer
- `src/utils/database.js` - Funções de leitura/escrita JSON
- `src/routes/*.routes.js` - Rotas da API REST
- `src/controllers/*.controller.js` - Lógica de negócio
- `src/services/email.service.js` - Envio de emails

### **Frontend (HTML/CSS/JS)**
- `public/index.html` - Landing page
- `public/css/style.css` - Estilos globais
- `public/js/*.js` - Scripts do cliente
- `public/pages/*.html` - Páginas da aplicação

### **Documentação**
- `docs/README.md` - Visão geral do projeto
- `docs/INSTALACAO.md` - Guia de instalação
- `docs/CONFIGURACAO-EMAIL.md` - Configurar emails
- `docs/DEPLOY.md` - Deploy em produção

### **Dados**
- `data/*.json` - Arquivos de dados (não versionar em produção)

## 🎯 Benefícios da Organização

✅ **Separação clara** entre frontend e backend
✅ **Modularização** do código
✅ **Fácil manutenção** e escalabilidade
✅ **Melhor para trabalho em equipe**
✅ **Pronto para deploy** em plataformas cloud
✅ **Estrutura profissional** e padrão da indústria

## 🚀 Como Usar

### Desenvolvimento Local:
```powershell
npm install
npm start        # Produção
npm run dev      # Desenvolvimento (auto-reload)
```

### Acessar:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/*

## 📝 Próximos Passos

Para transformar em uma aplicação completa:
1. Migrar para banco de dados real (MongoDB/PostgreSQL)
2. Adicionar autenticação JWT
3. Implementar testes automatizados
4. Adicionar validação de dados
5. Configurar CI/CD
6. Documentar API com Swagger
