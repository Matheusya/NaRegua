# 💈 Sistema de Barbeiros - Na Régua

## 🎯 Funcionalidades Exclusivas para Barbeiros

### ✨ O que foi implementado:

## 1. **Cadastro de Barbeiro**

- Formulário completo com dados profissionais
- Campos específicos:
  - Dados pessoais (nome, email, telefone, data de nascimento)
  - Especialidade principal
  - Tempo de experiência
  - Descrição profissional
  - Dias de disponibilidade (segunda a domingo)
  - Horário de trabalho (início e fim)
  - Senha e confirmação
- Validação completa de todos os campos
- Login automático após cadastro
- Idade mínima de 18 anos

## 2. **Sistema de Autenticação Diferenciado**

- Login único para clientes e barbeiros
- Detecção automática do tipo de usuário
- Redirecionamento inteligente:
  - Cliente → Página de Agendamento
  - Barbeiro → Painel do Barbeiro
- Sessão diferenciada com informações extras para barbeiros

## 3. **Painel do Barbeiro** 🌟

### Estatísticas em Tempo Real:

- ✅ Agendamentos de hoje
- ✅ Próximo horário
- ✅ Total de clientes atendidos
- ✅ Receita do dia
- ✅ Avaliação média
- ✅ Atendimentos do mês

### Visualização de Agendamentos:

- Ver **TODOS** os agendamentos (apenas os seus)
- Filtros por:
  - Data
  - Status (agendado, confirmado, em andamento, concluído, cancelado)
- Cards destacados para agendamentos de hoje
- Informações completas do cliente
- Código de agendamento
- Status visual com cores

### Gerenciamento de Agendamentos:

- **Confirmar** agendamentos pendentes
- **Iniciar** atendimento
- **Concluir** atendimento (atualiza contador)
- **Cancelar** agendamentos
- **Reagendar** com verificação de conflitos
- Adicionar **observações** personalizadas
- Visualizar detalhes completos do cliente

### Disponibilidade:

- Ver dias de trabalho configurados
- Visualizar horários de funcionamento
- Ver especialidade cadastrada
- Opção para editar (em desenvolvimento)

### Relatórios:

- Exportar todos os agendamentos em CSV
- Relatório personalizado com nome do barbeiro
- Inclui: código, cliente, telefone, serviço, data, horário, valor e status

## 4. **Integração com Sistema de Agendamento**

- Barbeiros cadastrados aparecem automaticamente na lista de agendamento
- Disponibilidade gerada automaticamente com base em:
  - Dias de trabalho selecionados
  - Horário de início e fim
  - Intervalos de 30 minutos
- Atualização automática quando barbeiro atualiza perfil

## 5. **Menu de Usuário Diferenciado**

- Barbeiros veem opção "Painel do Barbeiro"
- Clientes veem "Meus Agendamentos" e "Novo Agendamento"
- Identificação visual do tipo de usuário

## 6. **Contador de Atendimentos**

- Atualizado automaticamente ao concluir atendimento
- Armazenado no perfil do barbeiro
- Visível nas estatísticas

## 🚀 Como Usar (Barbeiro)

### Primeiro Cadastro como Barbeiro:

1. **Acesse a página de cadastro**

   - Clique em "Sou Barbeiro" na página inicial
   - Ou acesse diretamente: `pages/cadastro-barbeiro.html`

2. **Preencha o formulário**

   - **Dados Pessoais:**

     - Nome completo
     - Email (único no sistema)
     - Telefone
     - Data de nascimento (mínimo 18 anos)

   - **Dados Profissionais:**

     - Especialidade (Corte Clássico, Moderno, Degradê, Barba, etc.)
     - Tempo de experiência em anos
     - Descrição profissional (opcional)

   - **Disponibilidade:**

     - Selecione os dias que trabalha
     - Defina horário de início (ex: 08:00)
     - Defina horário de término (ex: 18:00)

   - **Segurança:**
     - Crie uma senha (mínimo 6 caracteres)
     - Confirme a senha

3. **Confirme o cadastro**
   - Aceite os termos
   - Clique em "Cadastrar como Barbeiro"
   - Você será automaticamente logado

### Usando o Painel do Barbeiro:

1. **Acesso Inicial**

   - Após login, você é direcionado automaticamente para o painel
   - Ou acesse: `pages/painel-barbeiro.html`

2. **Visualizar Estatísticas**

   - Veja no topo do painel:
     - Quantos agendamentos tem hoje
     - Qual é o próximo horário
     - Quantos clientes já atendeu
     - Quanto faturou hoje
     - Sua avaliação média
     - Atendimentos do mês

3. **Gerenciar Agendamentos**

   **Ver todos os agendamentos:**

   - Lista mostra todos os seus agendamentos
   - Use os filtros para refinar:
     - Por data específica
     - Por status
   - Agendamentos de hoje aparecem destacados

   **Confirmar um agendamento:**

   - Clique em "Confirmar" no card
   - Ou entre em "Detalhes" e clique em "Confirmar"
   - Status muda de "Agendado" para "Confirmado"

   **Iniciar atendimento:**

   - Quando o cliente chegar, clique em "Iniciar"
   - Status muda para "Em Andamento"

   **Concluir atendimento:**

   - Após terminar, clique em "Concluir"
   - Status muda para "Concluído"
   - Seu contador de atendimentos aumenta automaticamente

   **Cancelar agendamento:**

   - Se necessário, clique em "Cancelar"
   - Confirme a ação
   - Status muda para "Cancelado"

   **Reagendar:**

   - Clique em "Detalhes" do agendamento
   - Clique em "Reagendar"
   - Escolha nova data e horário
   - Adicione motivo (opcional)
   - Sistema verifica conflitos automaticamente

   **Adicionar observações:**

   - Entre em "Detalhes"
   - Digite observações no campo de texto
   - Ao alterar status, as observações são salvas

4. **Ver Disponibilidade**

   - Clique em "Minha Disponibilidade"
   - Veja seus dias de trabalho
   - Confira seus horários
   - Veja sua especialidade

5. **Exportar Relatório**
   - Clique em "Exportar Relatório"
   - Um arquivo CSV será baixado
   - Nome: `relatorio_[seu_nome]_[data].csv`
   - Contém todos os seus agendamentos

### Filtros e Organização:

**Filtrar por Data:**

- Selecione uma data no filtro
- Clique em "Filtrar"
- Mostra apenas agendamentos daquela data

**Filtrar por Status:**

- Selecione um status (Agendado, Confirmado, etc.)
- Clique em "Filtrar"
- Mostra apenas agendamentos com aquele status

**Combinar Filtros:**

- Pode usar data + status juntos
- Exemplo: Ver apenas agendamentos confirmados de hoje

**Limpar Filtros:**

- Clique em "Limpar"
- Volta a mostrar todos os agendamentos

## 📊 Diferenças entre Cliente e Barbeiro

| Recurso               | Cliente           | Barbeiro             |
| --------------------- | ----------------- | -------------------- |
| Ver agendamentos      | ✅ Apenas os seus | ✅ Todos os seus     |
| Criar agendamento     | ✅ Sim            | ❌ Não (usa sistema) |
| Confirmar agendamento | ❌ Não            | ✅ Sim               |
| Alterar status        | ❌ Não            | ✅ Sim               |
| Cancelar agendamento  | ✅ Apenas futuros | ✅ Todos             |
| Ver estatísticas      | ✅ Básicas        | ✅ Completas         |
| Exportar relatórios   | ❌ Não            | ✅ Sim               |
| Ver disponibilidade   | ❌ Não            | ✅ Sim               |
| Adicionar observações | ❌ Não            | ✅ Sim               |

## 💾 Dados Armazenados

### Para Barbeiros:

- `naRegua_barbeirosAuth` - Dados completos incluindo senha
- `naRegua_barbeiros` - Dados públicos para agendamento

### Estrutura do Barbeiro:

```javascript
{
  id: "nomebarbeiro_1234",
  nome: "Nome Completo",
  email: "email@email.com",
  telefone: "(11) 99999-9999",
  dataNascimento: "1990-01-01",
  especialidade: "Corte Moderno",
  experiencia: 5,
  descricao: "Descrição profissional",
  diasDisponiveis: ["segunda", "terca", "quarta", "quinta", "sexta"],
  horarioInicio: "08:00",
  horarioFim: "18:00",
  senha: "******",
  tipo: "barbeiro",
  ativo: true,
  rating: 5.0,
  totalAtendimentos: 0
}
```

## 🎨 Recursos Visuais Especiais

- **Cards Destacados:** Agendamentos de hoje com fundo diferenciado
- **Ícones Intuitivos:** Cada ação com ícone específico
- **Cores de Status:**
  - Verde: Confirmado/Concluído
  - Azul: Em Andamento
  - Laranja: Agendado
  - Vermelho: Cancelado
- **Estatísticas em Cards:** Visual atrativo e informativo
- **Dias de Trabalho:** Cards verdes (disponível) e vermelhos (indisponível)

## 🔐 Segurança

- Apenas barbeiros autenticados podem acessar o painel
- Senha obrigatória no cadastro
- Validação de idade mínima (18 anos)
- Email único no sistema
- Sessão com expiração (24 horas)
- Logout manual disponível

## 🐛 Solução de Problemas

### Não consigo acessar o painel do barbeiro

- Certifique-se de estar cadastrado como barbeiro
- Faça logout e login novamente
- Verifique se usou o email correto

### Meus agendamentos não aparecem

- Verifique os filtros aplicados
- Clique em "Limpar" para remover filtros
- Certifique-se de que há agendamentos para você

### Não consigo confirmar agendamentos

- Verifique se está logado como barbeiro
- Apenas agendamentos "Agendados" podem ser confirmados
- Agendamentos concluídos ou cancelados não podem ser alterados

### Contador não atualiza

- Certifique-se de clicar em "Concluir" no agendamento
- Recarregue a página
- Verifique se o agendamento foi realmente concluído

## 💡 Dicas para Barbeiros

1. **Comece o dia conferindo agendamentos:**

   - Use o filtro de data para "hoje"
   - Veja quantos clientes tem

2. **Confirme agendamentos:**

   - Confirme agendamentos assim que verificar
   - Cliente recebe feedback visual

3. **Use observações:**

   - Anote preferências do cliente
   - Registre informações importantes
   - Facilita atendimentos futuros

4. **Acompanhe estatísticas:**

   - Veja sua evolução mensal
   - Monitore receita diária
   - Acompanhe sua avaliação

5. **Exporte relatórios:**
   - Faça backup dos dados
   - Analise padrões de agendamento
   - Use para planejamento

## 🚀 Funcionalidades Futuras Sugeridas

- [ ] Editar disponibilidade pelo painel
- [ ] Visualização em calendário
- [ ] Gráficos de desempenho
- [ ] Sistema de comissões
- [ ] Chat com clientes
- [ ] Notificações push
- [ ] Histórico de clientes
- [ ] Sistema de avaliações
- [ ] Integração com pagamentos
- [ ] Agenda compartilhada

## 📞 Suporte

Dúvidas ou problemas? Entre em contato através do sistema.

---

**Desenvolvido para o Sistema Na Régua - Agendamento de Barbearia**
Versão 3.0 com Sistema de Barbeiros
