import Fastify from 'fastify'
import view from '@fastify/view'
import formbody from '@fastify/formbody'
import staticFiles from '@fastify/static'
import session from '@fastify/session'
import cookie from '@fastify/cookie'
import path from 'path'
import ejs from 'ejs'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface Session {
    userId?: string
    user?: {
      id: string
      name: string
      email: string
      isSubscriber: boolean
    }
  }
}

const app = Fastify({ logger: true })
const prisma = new PrismaClient()

// Plugins
app.register(cookie)
app.register(session, {
  secret: 'change-this-secret-in-production-please',
  cookie: { 
    secure: false, // true em produção com HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  }
})
app.register(formbody)
app.register(staticFiles, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})
app.register(view, {
  engine: { ejs },
  root: path.join(__dirname, 'views'),
  layout: '',
  defaultContext: {
    user: null,
    title: 'Black Stories'
  }
})

// Middleware para adicionar user ao contexto das views
app.addHook('preHandler', async (request, reply) => {
  if (request.session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: request.session.userId },
      select: { id: true, name: true, email: true, isSubscriber: true }
    })
    request.session.user = user || undefined
  }
})

// Helper para middleware de autenticação
const requireAuth = async (request: any, reply: any) => {
  if (!request.session.userId) {
    return reply.redirect('/login')
  }
}

// Helper para middleware de premium
const requirePremium = async (request: any, reply: any) => {
  if (!request.session.userId) {
    return reply.redirect('/login')
  }
  
  const user = await prisma.user.findUnique({
    where: { id: request.session.userId }
  })
  
  if (!user?.isSubscriber) {
    return reply.redirect('/premium')
  }
}

// =============================================================================
// ROTAS PÚBLICAS
// =============================================================================

// Homepage - Card diário
app.get('/', async (request, reply) => {
  const dailyCard = await prisma.dailyCard.findFirst({
    include: { themeRelation: true },
    orderBy: { generatedAt: 'desc' }
  })

  return reply.view('index.ejs', { 
    card: dailyCard,
    user: request.session.user 
  })
})

// Login
app.get('/login', async (request, reply) => {
  if (request.session.userId) {
    return reply.redirect('/dashboard')
  }
  return reply.view('auth/login.ejs', { error: null })
})

app.post('/login', async (request, reply) => {
  const { email, password } = request.body as { email: string, password: string }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return reply.view('auth/login.ejs', { 
        error: 'Email ou senha inválidos' 
      })
    }
    
    request.session.userId = user.id
    return reply.redirect('/dashboard')
    
  } catch (error) {
    return reply.view('auth/login.ejs', { 
      error: 'Erro interno do servidor' 
    })
  }
})

// Registro
app.get('/register', async (request, reply) => {
  if (request.session.userId) {
    return reply.redirect('/dashboard')
  }
  return reply.view('auth/register.ejs', { error: null })
})

app.post('/register', async (request, reply) => {
  const { name, email, password } = request.body as { 
    name: string, email: string, password: string 
  }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return reply.view('auth/register.ejs', { 
        error: 'Este email já está cadastrado' 
      })
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    })
    
    request.session.userId = user.id
    return reply.redirect('/dashboard')
    
  } catch (error) {
    return reply.view('auth/register.ejs', { 
      error: 'Erro ao criar conta' 
    })
  }
})

// Logout
app.post('/logout', async (request, reply) => {
  request.session.destroy()
  return reply.redirect('/')
})

// =============================================================================
// ROTAS DE CARDS
// =============================================================================

// Visualizar card específico
app.get('/card/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  
  try {
    // Validar se o ID é válido (UUID)
    if (!id || id.length < 10) {
      return reply.code(400).view('error.ejs', { 
        message: 'ID do card inválido',
        user: request.session.user 
      })
    }

    // Buscar tanto em daily cards quanto custom cards
    let card = await prisma.dailyCard.findUnique({
      where: { id },
      include: { themeRelation: true }
    })
    
    let cardType = 'DAILY'
    let cardData: any = card
    
    if (!card) {
      const customCard = await prisma.customCard.findUnique({
        where: { id },
        include: { themeRelation: true, user: { select: { name: true } } }
      })
      
      if (customCard) {
        cardData = customCard
        cardType = 'CUSTOM'
      }
    }
    
    if (!cardData) {
      return reply.code(404).view('error.ejs', { 
        message: 'Card não encontrado',
        user: request.session.user 
      })
    }

    // Registrar visualização (apenas se usuário logado)
    if (request.session.userId) {
      try {
        await prisma.view.create({
          data: {
            userId: request.session.userId,
            cardId: id,
            cardType: cardType as any
          }
        })
        
        // Incrementar contador de views
        if (cardType === 'DAILY') {
          await prisma.dailyCard.update({
            where: { id },
            data: { viewsCount: { increment: 1 } }
          })
        } else {
          await prisma.customCard.update({
            where: { id },
            data: { viewsCount: { increment: 1 } }
          })
        }
      } catch (viewError) {
        // Log do erro mas não falha a requisição
        console.error('Erro ao registrar view:', viewError)
      }
    }
    
    return reply.view('card/detail.ejs', { 
      card: cardData,
      cardType,
      user: request.session.user 
    })
    
  } catch (error) {
    console.error('Erro na rota /card/:id:', error)
    return reply.code(500).view('error.ejs', { 
      message: 'Erro interno do servidor. Tente novamente mais tarde.',
      user: request.session.user 
    })
  }
})

// Curtir card
app.post('/card/:id/like', { preHandler: requireAuth }, async (request, reply) => {
  const { id } = request.params as { id: string }
  const { cardType } = request.body as { cardType: 'DAILY' | 'CUSTOM' }
  
  try {
    // Validar cardType
    if (!cardType || !['DAILY', 'CUSTOM'].includes(cardType)) {
      return reply.code(400).view('error.ejs', { 
        message: 'Tipo de card inválido',
        user: request.session.user 
      })
    }

    // Verificar se o card existe primeiro
    let cardExists = false
    if (cardType === 'DAILY') {
      const dailyCard = await prisma.dailyCard.findUnique({ where: { id } })
      cardExists = !!dailyCard
    } else {
      const customCard = await prisma.customCard.findUnique({ where: { id } })
      cardExists = !!customCard
    }

    if (!cardExists) {
      return reply.code(404).view('error.ejs', { 
        message: 'Card não encontrado',
        user: request.session.user 
      })
    }

    // Verificar se já curtiu
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: request.session.userId!,
        cardId: id,
        cardType: cardType
      }
    })
    
    if (existingLike) {
      // Remover like e decrementar contador em transação
      await prisma.$transaction(async (tx) => {
        await tx.like.delete({
          where: { id: existingLike.id }
        })
        
        if (cardType === 'DAILY') {
          await tx.dailyCard.update({
            where: { id },
            data: { likesCount: { decrement: 1 } }
          })
        } else {
          await tx.customCard.update({
            where: { id },
            data: { likesCount: { decrement: 1 } }
          })
        }
      })
    } else {
      // Adicionar like e incrementar contador em transação
      await prisma.$transaction(async (tx) => {
        // Usar raw SQL para inserir sem constraint
        await tx.$executeRaw`
          INSERT INTO "Like" (id, "userId", "cardId", "cardType", "createdAt")
          VALUES (gen_random_uuid(), ${request.session.userId!}::uuid, ${id}::uuid, ${cardType}::"CardType", NOW())
        `
        
        if (cardType === 'DAILY') {
          await tx.dailyCard.update({
            where: { id },
            data: { likesCount: { increment: 1 } }
          })
        } else {
          await tx.customCard.update({
            where: { id },
            data: { likesCount: { increment: 1 } }
          })
        }
      })
    }
    
    return reply.redirect(`/card/${id}`)
    
  } catch (error) {
    console.error('Erro na rota /card/:id/like:', error)
    return reply.code(500).view('error.ejs', { 
      message: 'Erro ao processar like. Tente novamente mais tarde.',
      user: request.session.user 
    })
  }
})

// =============================================================================
// ROTAS PROTEGIDAS (REQUEREM LOGIN)
// =============================================================================

// Dashboard do usuário
app.get('/dashboard', { preHandler: requireAuth }, async (request, reply) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.session.userId! },
      include: {
        customCards: {
          include: { themeRelation: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        likes: {
          include: {
            // Note: Prisma doesn't support polymorphic relations directly
            // We'll need to fetch the cards separately
          }
        }
      }
    })
    
    return reply.view('user/dashboard.ejs', { 
      user,
      dashboardUser: user
    })
    
  } catch (error) {
    return reply.code(500).view('error.ejs', { 
      message: 'Erro ao carregar dashboard',
      user: request.session.user 
    })
  }
})

// =============================================================================
// ROTAS PREMIUM (REQUEREM ASSINATURA)
// =============================================================================

// Histórico de cards (premium)
app.get('/history', { preHandler: requirePremium }, async (request, reply) => {
  const page = parseInt((request.query as any).page) || 1
  const limit = 12
  const skip = (page - 1) * limit
  
  try {
    const [dailyCards, totalCount] = await Promise.all([
      prisma.dailyCard.findMany({
        include: { themeRelation: true },
        orderBy: { generatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.dailyCard.count()
    ])
    
    const totalPages = Math.ceil(totalCount / limit)
    
    return reply.view('premium/history.ejs', {
      cards: dailyCards,
      currentPage: page,
      totalPages,
      user: request.session.user
    })
    
  } catch (error) {
    return reply.code(500).view('error.ejs', { 
      message: 'Erro ao carregar histórico',
      user: request.session.user 
    })
  }
})

// Criar card customizado (premium)
app.get('/create', { preHandler: requirePremium }, async (request, reply) => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { name: 'asc' }
    })
    
    return reply.view('premium/create.ejs', {
      themes,
      user: request.session.user,
      error: null
    })
    
  } catch (error) {
    return reply.code(500).view('error.ejs', { 
      message: 'Erro ao carregar página de criação',
      user: request.session.user 
    })
  }
})

app.post('/create', { preHandler: requirePremium }, async (request, reply) => {
  const { title, teaser, clues, solution, themeId, prompt } = request.body as {
    title: string
    teaser: string
    clues: string
    solution: string
    themeId: string
    prompt?: string
  }
  
  try {
    // Parse clues (assumindo que vem como texto separado por quebras de linha)
    const cluesArray = clues.split('\n').filter(clue => clue.trim().length > 0)
    
    const customCard = await prisma.customCard.create({
      data: {
        title,
        teaser,
        clues: cluesArray,
        solution,
        userId: request.session.userId!,
        themeId: themeId ? parseInt(themeId) : null,
        prompt,
        // Em produção, aqui você geraria a imagem com IA
        imageUrl: null
      }
    })
    
    return reply.redirect(`/card/${customCard.id}`)
    
  } catch (error) {
    const themes = await prisma.theme.findMany({
      orderBy: { name: 'asc' }
    })
    
    return reply.view('premium/create.ejs', {
      themes,
      user: request.session.user,
      error: 'Erro ao criar card personalizado'
    })
  }
})

// =============================================================================
// ROTAS DE ASSINATURA
// =============================================================================

// Página de assinatura premium
app.get('/premium', async (request, reply) => {
  return reply.view('premium/subscribe.ejs', {
    user: request.session.user
  })
})

// Processar assinatura (mockado)
app.post('/subscribe', { preHandler: requireAuth }, async (request, reply) => {
  try {
    // Em produção, aqui você integraria com Stripe/PagSeguro/etc
    // Por agora, vamos simular o pagamento
    
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1) // 1 mês
    
    await prisma.user.update({
      where: { id: request.session.userId! },
      data: {
        isSubscriber: true,
        subscriptionExpiresAt: expirationDate,
        paymentProviderCustomerId: 'mock_customer_id_' + request.session.userId
      }
    })
    
    return reply.view('premium/success.ejs', {
      user: request.session.user
    })
    
  } catch (error) {
    return reply.view('premium/subscribe.ejs', {
      user: request.session.user,
      error: 'Erro ao processar assinatura'
    })
  }
})

// Cancelar assinatura
app.post('/cancel-subscription', { preHandler: requireAuth }, async (request, reply) => {
  try {
    // Em produção, aqui você cancelaria no provedor de pagamento
    
    await prisma.user.update({
      where: { id: request.session.userId! },
      data: {
        isSubscriber: false,
        subscriptionExpiresAt: null,
        paymentProviderCustomerId: null
      }
    })
    
    return reply.redirect('/dashboard')
    
  } catch (error) {
    return reply.code(500).send({ error: 'Erro ao cancelar assinatura' })
  }
})

// =============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================================================

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Servidor rodando em http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
