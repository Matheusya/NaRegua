# Sistema Na Régua - Agendamento de Barbearia

Sistema web completo para agendamento de serviços em barbearias, desenvolvido para trabalho de faculdade.

## 📋 Sobre o Projeto

O "Na Régua" é uma solução digital que moderniza o processo de agendamento em barbearias, eliminando filas e conflitos de horário através de uma plataforma web intuitiva e confiável.

### 🎯 Objetivos

- Substituir métodos tradicionais de agendamento (anotações manuais, ligações)
- Reduzir filas e esperas desnecessárias
- Evitar conflitos e sobreposição de horários
- Melhorar a experiência do cliente
- Aumentar a produtividade da barbearia

## 🚀 Funcionalidades

### ✅ Requisitos Funcionais Implementados

1. **Cadastro de Usuários**
   - Formulário completo com validação
   - Armazenamento seguro dos dados
   - Verificação de email duplicado

2. **Agendamento de Horários**
   - Seleção de data e hora
   - Escolha do barbeiro preferido
   - Verificação automática de disponibilidade

3. **Escolha de Serviços**
   - Catálogo de serviços com preços
   - Diferentes durações por serviço
   - Cálculo automático de valores

4. **Visualização da Agenda**
   - Painel administrativo completo
   - Filtros por data, barbeiro e status
   - Estatísticas em tempo real

5. **Confirmação de Agendamentos**
   - Código único para cada agendamento
   - Confirmação visual imediata
   - Status do agendamento

6. **Cancelamento e Remarcação**
   - Cancelamento com confirmação
   - Reagendamento para novas datas
   - Histórico de alterações

7. **Controle de Disponibilidade**
   - Horários automáticos por barbeiro
   - Bloqueio de horários ocupados
   - Validação de conflitos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilização**: CSS Grid, Flexbox, Animações CSS
- **Ícones**: Font Awesome
- **Armazenamento**: LocalStorage (simula banco de dados)
- **Design**: Responsivo e Mobile-First

## 📁 Estrutura do Projeto

```
na-regua/
├── index.html              # Página inicial
├── css/
│   └── style.css           # Estilos principais
├── js/
│   ├── main.js            # Lógica principal e database
│   ├── cadastro.js        # Funcionalidades de cadastro
│   ├── agendamento.js     # Sistema de agendamento
│   └── painel.js          # Painel administrativo
├── pages/
│   ├── cadastro.html      # Página de cadastro
│   ├── agendamento.html   # Página de agendamento
│   └── painel.html        # Painel de controle
└── README.md              # Este arquivo
```

## 🚀 Como Executar

1. **Clone ou baixe o projeto**
   ```bash
   git clone [url-do-repositorio]
   ```

2. **Abra o arquivo index.html**
   - Clique duas vezes no arquivo `index.html`
   - Ou abra através de um servidor local (recomendado)

3. **Usando servidor local (opcional)**
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npx http-server
   
   # Com PHP
   php -S localhost:8000
   ```

4. **Acesse no navegador**
   - Direto: `file:///caminho/para/na-regua/index.html`
   - Servidor local: `http://localhost:8000`

## 👥 Dados de Demonstração

O sistema já vem com dados pré-cadastrados para demonstração:

### Clientes
- João da Silva - (11) 99999-1111
- Maria Santos - (11) 99999-2222

### Barbeiros
- João Silva - Especialista em cortes clássicos
- Pedro Santos - Expert em cortes modernos
- Carlos Lima - Especialista em barbas

### Serviços
- Corte Simples - R$ 25,00 (30 min)
- Corte + Barba - R$ 35,00 (45 min)
- Apenas Barba - R$ 15,00 (20 min)
- Corte Premium - R$ 50,00 (60 min)

## 📱 Funcionalidades da Interface

### Página Inicial
- Apresentação do sistema
- Problemas identificados
- Solução proposta
- Funcionalidades disponíveis

### Cadastro de Clientes
- Formulário com validação em tempo real
- Verificação de email duplicado
- Máscara para telefone
- Modal de confirmação

### Sistema de Agendamento
- Seleção de cliente (existente ou novo)
- Escolha de serviço com preços
- Seleção de barbeiro
- Calendário com data mínima
- Horários disponíveis em tempo real
- Resumo completo do agendamento

### Painel Administrativo
- Estatísticas em tempo real
- Lista de agendamentos
- Filtros avançados
- Gerenciamento de status
- Reagendamento
- Cancelamento
- Exportação de dados

## 🎨 Design e UX

### Características do Design
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Moderno**: Design limpo e profissional
- **Intuitivo**: Interface fácil de usar
- **Acessível**: Boa legibilidade e contraste
- **Animações**: Transições suaves e feedback visual

### Paleta de Cores
- **Primary**: #2c3e50 (Azul escuro)
- **Secondary**: #e74c3c (Vermelho)
- **Accent**: #f39c12 (Laranja)
- **Success**: #27ae60 (Verde)
- **Background**: #f8f9fa (Cinza claro)

## 🔧 Recursos Técnicos

### JavaScript (ES6+)
- Classes para organização do código
- LocalStorage para persistência
- Validações em tempo real
- Manipulação do DOM
- Event listeners
- Async/Await patterns

### CSS Moderno
- CSS Grid e Flexbox
- Custom Properties (CSS Variables)
- Animations e Transitions
- Media Queries responsivas
- Gradientes e shadows

### Funcionalidades Avançadas
- Sistema de notificações
- Modais interativos
- Validação de formulários
- Máscaras de input
- Filtros dinâmicos
- Exportação de dados

## 📊 Validações Implementadas

### Cadastro
- Nome obrigatório (mín. 2 caracteres)
- Email válido e único
- Telefone com máscara e validação
- Data de nascimento (idade mín. 12 anos)
- Senha mínima de 6 caracteres
- Confirmação de senha
- Aceitação de termos obrigatória

### Agendamento
- Cliente obrigatório
- Serviço obrigatório
- Barbeiro obrigatório
- Data não pode ser anterior a hoje
- Horário deve estar disponível
- Verificação de conflitos automática

## 🚀 Melhorias Futuras

Para um ambiente de produção, seria interessante implementar:

1. **Backend Real**
   - API REST com Node.js/PHP/Python
   - Banco de dados MySQL/PostgreSQL
   - Autenticação JWT

2. **Notificações**
   - Email de confirmação
   - SMS de lembrete
   - Push notifications

3. **Pagamentos**
   - Integração com gateways
   - Cartão de crédito/débito
   - PIX

4. **Relatórios**
   - Análise de vendas
   - Relatórios financeiros
   - Métricas de performance

5. **App Mobile**
   - React Native / Flutter
   - Notificações push nativas
   - Geolocalização

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico, demonstrando:

- **Análise de Requisitos**: Identificação e solução de problemas reais
- **UI/UX Design**: Interface intuitiva e responsiva
- **Programação Frontend**: HTML, CSS e JavaScript moderno
- **Gestão de Dados**: Simulação de banco com LocalStorage
- **Validações**: Tratamento de erros e dados inválidos
- **Responsividade**: Adaptação para diferentes dispositivos

## 📞 Suporte

Para dúvidas ou sugestões sobre este projeto acadêmico:

- Consulte a documentação no código
- Verifique os comentários nos arquivos JS
- Teste as funcionalidades no navegador

## 📄 Licença

Este é um projeto acadêmico desenvolvido para fins educacionais.

---

**Na Régua** - Modernizando o agendamento em barbearias! ✂️