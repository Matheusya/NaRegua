# 🔐 Sistema de Login - Na Régua

## ✨ Funcionalidades Implementadas

### 1. **Tela de Login**

- Login com email e senha
- Opção "Lembrar-me" para salvar email
- Botão para mostrar/ocultar senha
- Link para recuperação de senha
- Validação de credenciais
- Redirecionamento automático se já estiver logado

### 2. **Sistema de Autenticação**

- Gerenciamento de sessão com localStorage
- Sessão válida por 24 horas
- Logout manual disponível
- Proteção de rotas (requer login para acessar agendamento e painel)
- Login automático após cadastro

### 3. **Cadastro Atualizado**

- Campo de senha adicionado
- Confirmação de senha
- Validação de senha (mínimo 6 caracteres)
- Armazenamento seguro (em produção, usar hash)
- Login automático após cadastro bem-sucedido

### 4. **Agendamento Protegido**

- Requer login para acessar
- Remove seleção manual de cliente
- Usa automaticamente dados do usuário logado
- Mostra mensagem personalizada com nome do usuário
- Agendamentos vinculados ao ID do usuário

### 5. **Painel Personalizado**

- Mostra apenas agendamentos do usuário logado
- Estatísticas personalizadas:
  - Total de agendamentos
  - Agendamentos pendentes
  - Agendamentos concluídos
  - Próximo agendamento
- Filtro por status
- Opção de cancelamento (apenas futuros)
- Interface simplificada focada no cliente

### 6. **Menu de Usuário**

- Exibe nome do usuário logado no header
- Menu dropdown com:
  - Nome e email
  - Link para meus agendamentos
  - Opção de editar perfil
  - Botão de logout
- Disponível em todas as páginas quando logado

### 7. **Notificações**

- Sistema de notificações visuais
- Tipos: sucesso, erro, informação
- Aparecem no canto superior direito
- Fecham automaticamente após 5 segundos
- Podem ser fechadas manualmente

## 🚀 Como Usar

### Primeiro Acesso

1. **Abra o projeto**

   - Abra o arquivo `index.html` em um navegador

2. **Faça o Cadastro**

   - Clique em "Cadastro" no menu
   - Preencha todos os campos obrigatórios:
     - Nome completo
     - Email
     - Telefone
     - Data de nascimento
     - Senha (mínimo 6 caracteres)
     - Confirmação de senha
   - Aceite os termos
   - Clique em "Criar Conta"
   - Você será automaticamente logado

3. **Ou use uma conta de teste**

   - Email: `joao@email.com`
   - Senha: `123456`

   Ou:

   - Email: `maria@email.com`
   - Senha: `123456`

### Fazer Login

1. Clique em "Login" no menu
2. Digite seu email e senha
3. (Opcional) Marque "Lembrar-me" para salvar o email
4. Clique em "Entrar"

### Fazer Agendamento

1. Esteja logado no sistema
2. Clique em "Agendamento" no menu
3. Selecione:
   - Serviço desejado
   - Barbeiro
   - Data
   - Horário disponível
4. Revise o resumo
5. Clique em "Confirmar Agendamento"

### Ver Seus Agendamentos

1. Esteja logado no sistema
2. Clique em "Painel" no menu
3. Veja todos os seus agendamentos
4. Use o filtro por status se necessário
5. Clique em "Detalhes" para mais informações
6. Cancele agendamentos futuros se necessário

### Fazer Logout

1. Clique no seu nome no menu (canto superior direito)
2. No menu dropdown, clique em "Sair"
3. Confirme o logout

## 💾 Armazenamento de Dados

Os dados são armazenados no **localStorage** do navegador:

- `naRegua_clientes` - Lista de clientes cadastrados
- `naRegua_agendamentos` - Lista de agendamentos
- `naRegua_session` - Sessão do usuário logado
- `naRegua_rememberedEmail` - Email salvo (se marcou "Lembrar-me")
- `naRegua_barbeiros` - Lista de barbeiros
- `naRegua_servicos` - Lista de serviços

### Limpar Dados

Para limpar todos os dados e recomeçar:

1. Abra o Console do navegador (F12)
2. Execute: `localStorage.clear()`
3. Recarregue a página

## 🔒 Segurança

### Implementado:

- Validação de email e senha
- Sessão com expiração (24 horas)
- Proteção de rotas (requer autenticação)
- Filtro de agendamentos por usuário

### Para Produção (não implementado):

- ⚠️ **IMPORTANTE**: As senhas estão sendo armazenadas em texto plano
- Em produção, usar:
  - Hash de senhas (bcrypt, argon2)
  - Backend para validação
  - Tokens JWT para sessão
  - HTTPS
  - Rate limiting
  - Validação server-side

## 📱 Páginas do Sistema

1. **index.html** - Página inicial com informações
2. **pages/cadastro.html** - Cadastro de novos usuários
3. **pages/login.html** - Login de usuários
4. **pages/agendamento.html** - Fazer novo agendamento (requer login)
5. **pages/painel.html** - Ver agendamentos do usuário (requer login)

## 📝 Arquivos JavaScript

1. **js/main.js** - Configurações gerais e database
2. **js/auth.js** - Sistema de autenticação
3. **js/login.js** - Lógica da página de login
4. **js/cadastro.js** - Lógica do cadastro
5. **js/agendamento.js** - Lógica de agendamentos
6. **js/painel.js** - Lógica do painel de controle

## 🎨 Recursos Visuais

- Design responsivo
- Gradientes e sombras suaves
- Animações de transição
- Ícones FontAwesome
- Notificações visuais
- Feedback visual em ações

## 🐛 Solução de Problemas

### Não consigo fazer login

- Verifique se o email está correto
- Verifique se a senha tem pelo menos 6 caracteres
- Tente fazer um novo cadastro
- Limpe o localStorage e tente novamente

### Página de agendamento não carrega

- Certifique-se de estar logado
- Verifique o console do navegador (F12) para erros
- Tente fazer logout e login novamente

### Não vejo meus agendamentos

- Certifique-se de estar logado com a conta correta
- Verifique se você tem agendamentos cadastrados
- Limpe os filtros no painel

### Sessão expira muito rápido

- A sessão é válida por 24 horas
- Se necessário, ajuste o tempo em `js/auth.js` (linha que verifica `hoursDiff < 24`)

## 💡 Melhorias Futuras Sugeridas

1. Recuperação de senha por email
2. Edição de perfil do usuário
3. Foto de perfil
4. Histórico completo de agendamentos
5. Avaliação de barbeiros
6. Sistema de pontos/fidelidade
7. Notificações push
8. Chat com a barbearia
9. Integração com backend real
10. App mobile

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através do sistema.

---

**Desenvolvido para o Sistema Na Régua - Agendamento de Barbearia**
Versão 2.0 com Sistema de Login e Autenticação
