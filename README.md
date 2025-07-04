# Black Stories SaaS

Uma aplicação SaaS para geração diária de Black Stories (histórias misteriosas) usando IA, com sistema de assinaturas Premium.

## 🎯 Sobre o Projeto

Black Stories é uma plataforma que gera diariamente cards misteriosos para o jogo de Black Stories. Usuários Premium têm acesso a:

- **Histórico completo** de todas as stories já criadas
- **Criação personalizada** de stories com temas específicos  
- **Imagens geradas por IA** para cada história
- **Conteúdo exclusivo** e acesso antecipado

## 🛠️ Tecnologias

- **Backend**: Fastify + TypeScript
- **Banco de dados**: PostgreSQL com Prisma ORM
- **Autenticação**: Sessions com bcryptjs
- **Template Engine**: EJS
- **Styling**: Tailwind CSS
- **IA**: OpenAI GPT e DALL-E (configuração necessária)

## 📋 Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- NPM ou Yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd blackstories-fastify-prisma
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/blackstories?schema=public"

# Session
SESSION_SECRET="seu-secret-muito-seguro-aqui"

# OpenAI (opcional - para IA)
OPENAI_API_KEY="sua-chave-openai"

# Server
PORT=3000
NODE_ENV=development
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma db push

# (Opcional) Seed inicial
npx prisma db seed
```

## 🏃‍♂️ Como Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── server.ts              # Servidor principal Fastify
├── routes/                # Rotas da aplicação
├── views/                 # Templates EJS
│   ├── index.ejs         # Página inicial
│   ├── auth/             # Páginas de autenticação
│   ├── premium/          # Páginas premium
│   └── payment/          # Páginas de pagamento
├── middleware/           # Middlewares customizados
└── services/             # Serviços (IA, pagamento, etc.)

prisma/
├── schema.prisma         # Schema do banco
└── migrations/           # Migrações
```

## 🎮 Funcionalidades Principais

### Páginas Públicas
- **/** - Página inicial com card do dia
- **/card/:id** - Visualização de cards específicos
- **/login** - Login de usuários
- **/register** - Registro de novos usuários

### Páginas Premium (Autenticação necessária)
- **/dashboard** - Dashboard do usuário
- **/subscribe** - Página de assinatura Premium
- **/create** - Criação de stories personalizadas
- **/history** - Histórico completo de stories

### Fluxo de Pagamento
- **/payment/success** - Confirmação de assinatura
- **/payment/error** - Erro no pagamento

## 🔐 Autenticação

O sistema usa sessions para autenticação:
- Passwords são hasheados com bcryptjs
- Sessions são armazenadas server-side
- Middleware protege rotas premium

## 💾 Banco de Dados

### Principais Entidades

**User**
- `id`, `email`, `name`, `password`
- `isPremium`, `premiumUntil`, `createdAt`

**Card** 
- `id`, `title`, `teaser`, `clues`, `solution`
- `imageUrl`, `isDaily`, `generatedAt`
- `themeId`, `createdById`

**Theme**
- `id`, `name`, `description`, `color`

**Like** (relação User ↔ Card)
- Sistema de likes para cards

## 🤖 Integração com IA

### OpenAI GPT
- Geração de stories personalizadas
- Criação de clues e soluções
- Adaptação de temas

### DALL-E (Opcional)
- Geração de imagens atmosféricas
- Prompts otimizados para mistério/horror

## 💳 Sistema de Pagamento

O sistema está preparado para integração com gateways de pagamento:
- Stripe (recomendado para internacional)
- Mercado Pago (Brasil)
- Configuração em `src/services/payment.ts`

## 🎨 Interface

- **Design responsivo** com Tailwind CSS
- **Tema dark** otimizado para atmosfera misteriosa
- **Icons** com Font Awesome
- **Animações** CSS para melhor UX

## 📊 Monitoramento

### Métricas importantes
- Cards gerados por dia
- Taxa de conversão Premium
- Engagement (likes, views)
- Retenção de usuários

### Logs
- Autenticação de usuários
- Criação de cards
- Erros de pagamento

## 🚀 Deploy

### Variáveis de produção
```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
SESSION_SECRET="super-secret"
OPENAI_API_KEY="sk-..."
```

### Comandos de deploy
```bash
# Build da aplicação
npm run build

# Migrations de produção
npx prisma migrate deploy

# Iniciar servidor
npm start
```

## 🔧 Desenvolvimento

### Scripts disponíveis
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Executar versão built
npm run type-check   # Verificar tipos TypeScript
npm run lint         # Linter ESLint
```

### Estrutura de dados recomendada
- Cards diários gerados via CRON job
- Cache de imagens para performance
- Rate limiting em APIs críticas

## 📝 Próximos Passos

1. **Integração completa com OpenAI**
2. **Sistema de pagamento real**
3. **PWA** para mobile
4. **Sistema de notificações**
5. **Analytics** avançados
6. **Temas sazonais** automáticos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para amantes de mistérios e Black Stories!** "# dark-stories-ssr" 
