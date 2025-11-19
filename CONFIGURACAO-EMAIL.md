# 📧 Guia Rápido - Configuração de Email

## ⚠️ PROBLEMA: Emails não estão sendo enviados?

Siga estes passos para corrigir:

## 📨 Quem Recebe os Emails?

### ✅ Cadastro de Cliente
- **Email enviado para:** O cliente que se cadastrou
- **Conteúdo:** Confirmação de cadastro + dados cadastrados

### ✅ Cadastro de Barbeiro
- **Email enviado para:** O barbeiro que se cadastrou
- **Conteúdo:** Confirmação de cadastro + dados profissionais

### ✅ Agendamento Realizado
- **Email #1 enviado para:** O **cliente** que fez o agendamento
  - Confirmação do agendamento
  - Detalhes: data, hora, barbeiro, serviço
  - Link para ver seus agendamentos
  
- **Email #2 enviado para:** O **barbeiro** que foi escolhido
  - Notificação de novo agendamento
  - Dados do cliente (nome, telefone, email)
  - Detalhes: data, hora, serviço, valor
  - Link para ver todos os agendamentos

## 🔧 Passo 1: Configurar Credenciais no server.js

1. Abra o arquivo `server.js`
2. Encontre esta seção (linhas 16-22):

```javascript
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: "seu-email@gmail.com", // ALTERE AQUI
    pass: "sua-senha-app", // ALTERE AQUI
  },
};
```

## 🔑 Passo 2: Obter Senha de Aplicativo (Gmail)

### Para Gmail:

1. **Acesse:** https://myaccount.google.com/apppasswords
2. **Faça login** na sua conta Google
3. **Clique em:** "Selecionar app" → "Outro (nome personalizado)"
4. **Digite:** "Na Régua"
5. **Clique em:** GERAR
6. **Copie a senha** gerada (16 caracteres sem espaços)

### Para Outlook/Hotmail:

1. **Acesse:** https://account.live.com/proofs/AppPassword
2. Siga passos similares
3. No `server.js`, altere `service: 'gmail'` para `service: 'outlook'`

## ✏️ Passo 3: Editar o server.js

Substitua as linhas:

```javascript
// ANTES:
user: 'seu-email@gmail.com',
pass: 'sua-senha-app'

// DEPOIS (exemplo):
user: 'joao.silva@gmail.com',
pass: 'abcd efgh ijkl mnop'  // Senha de 16 dígitos
```

## 💾 Passo 4: Salvar e Reiniciar

1. **Salve o arquivo** `server.js` (Ctrl+S)
2. **Pare o servidor** (Ctrl+C no terminal)
3. **Inicie novamente:**
   ```powershell
   npm start
   ```

## ✅ Passo 5: Testar

### Opção 1: Página de Teste

1. Abra: `pages/test-email.html` no navegador
2. Digite seu email
3. Clique em "Enviar Email de Teste"
4. Verifique sua caixa de entrada

### Opção 2: Fazer um Cadastro

1. Vá em "Cadastro" no site
2. Preencha o formulário com um email real
3. Clique em "Cadastrar"
4. Verifique seu email

## 🔍 Verificar se Está Funcionando

Ao iniciar o servidor, você deve ver:

```
✅ Email configurado: seu-email@gmail.com
```

Se ver isso, está configurado:

```
⚠️  EMAIL NÃO CONFIGURADO!
```

## ❌ Problemas Comuns

### 1. "Invalid login"

- ✅ Você está usando **senha de aplicativo**, não sua senha normal?
- ✅ A senha está correta (16 caracteres)?
- ✅ Habilitou verificação em 2 etapas no Gmail?

### 2. "Authentication failed"

- ✅ Email está correto?
- ✅ Senha de aplicativo foi gerada corretamente?

### 3. "Connection timeout"

- ✅ Está conectado à internet?
- ✅ Firewall está bloqueando?

### 4. Emails vão para SPAM

- ✅ Normal para emails novos
- ✅ Marque como "não é spam"

## 📝 Exemplo Completo

```javascript
// server.js - Configuração correta
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: "barbearia.naregua@gmail.com",
    pass: "xpto1234abcd5678", // Senha de app de 16 dígitos
  },
};
```

## 🆘 Ainda Não Funciona?

1. **Verifique o console do servidor** quando tentar enviar um email
2. **Procure por mensagens de erro** em vermelho
3. **Certifique-se** que o servidor está rodando (`npm start`)
4. **Teste** com outro provedor de email (Outlook, Yahoo)

## 📞 Dicas Extras

- ✅ Use um email dedicado para o sistema
- ✅ Não compartilhe a senha de aplicativo
- ✅ A senha de aplicativo é diferente da senha normal
- ✅ Verifique a pasta de SPAM ao testar

---

**Depois de configurar corretamente, os emails serão enviados automaticamente para:**

- ✅ Cadastro de clientes
- ✅ Cadastro de barbeiros
- ✅ Confirmação de agendamentos

🎉 **Boa sorte!**
