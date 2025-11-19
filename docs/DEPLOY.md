# 🌐 Guia de Deploy - Colocar o Sistema Online

## 🚀 Opção Recomendada: Render (Grátis)

### **Passo 1: Preparar o Repositório GitHub**

1. **Commit suas alterações:**
   ```powershell
   git add .
   git commit -m "Preparar para deploy online"
   git push origin main
   ```

### **Passo 2: Criar Conta no Render**

1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com sua conta GitHub
4. Autorize o Render a acessar seus repositórios

### **Passo 3: Criar Web Service**

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub **"NaRegua"**
4. Configure:
   - **Name:** `naregua-api` (ou qualquer nome)
   - **Region:** Oregon (US West)
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### **Passo 4: Configurar Variáveis de Ambiente**

No Render, vá em **"Environment"** e adicione:

```
EMAIL_USER = matheusya31@gmail.com
EMAIL_PASS = gemj ijae jost xupp
```

⚠️ **IMPORTANTE:** Não coloque as credenciais no código, use variáveis de ambiente!

### **Passo 5: Deploy**

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (2-5 minutos)
3. Você receberá uma URL: `https://naregua-api.onrender.com`

### **Passo 6: Atualizar o Frontend**

Nos arquivos JavaScript (`cadastro.js`, `cadastro-barbeiro.js`, `agendamento.js`), substitua:

```javascript
// ANTES:
fetch('http://localhost:3000/api/cadastro/cliente', ...)

// DEPOIS:
fetch('https://naregua-api.onrender.com/api/cadastro/cliente', ...)
```

### **Passo 7: Hospedar o Frontend**

**Opção A: GitHub Pages (Grátis)**

1. Vá em Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Salvar
5. Seu site estará em: `https://matheusya.github.io/NaRegua`

**Opção B: Vercel (Grátis)**

1. Acesse: https://vercel.com
2. Import projeto do GitHub
3. Deploy automático!

**Opção C: Netlify (Grátis)**

1. Acesse: https://netlify.com
2. Arraste a pasta do projeto
3. Deploy instantâneo!

---

## 📋 Checklist Completo:

- [ ] Código commitado no GitHub
- [ ] Conta criada no Render
- [ ] Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URLs do frontend atualizadas
- [ ] Frontend hospedado
- [ ] Testes realizados

---

## 🔧 Comandos Git (se necessário):

```powershell
# Inicializar repositório (se ainda não fez)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Matheusya/NaRegua.git
git push -u origin main
```

---

## 🌍 URLs Finais:

- **Backend API:** https://naregua-api.onrender.com
- **Frontend:** https://matheusya.github.io/NaRegua (ou Vercel/Netlify)

---

## ⚠️ Observações Importantes:

1. **Render Free Tier:** O servidor "dorme" após 15 minutos de inatividade. Primeira requisição demora ~30s para "acordar".

2. **Dados:** Os dados são salvos em arquivos JSON que são perdidos quando o servidor reinicia. Para produção real, use um banco de dados (MongoDB Atlas - grátis).

3. **CORS:** Já está configurado para aceitar todas as origens.

4. **HTTPS:** Render e GitHub Pages fornecem HTTPS automático.

---

## 🎯 Próximos Passos (Opcional):

- Usar MongoDB Atlas (banco de dados permanente)
- Configurar domínio personalizado
- Adicionar autenticação JWT
- Implementar cache
- Configurar backups automáticos

---

**Está pronto para colocar no ar! 🚀**
