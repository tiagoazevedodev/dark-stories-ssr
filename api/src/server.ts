import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const app = Fastify({ logger: true })
const prisma = new PrismaClient()

// Types
interface AuthUser {
  id: string
  name: string
  email: string
  isSubscriber: boolean
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string }
    user: AuthUser
  }
}

// Plugins
app.register(cors, {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret'
})

// Auth decorator
app.decorate('authenticate', async function(request: any, reply: any) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})

// =============================================================================
// AUTH ROUTES
// =============================================================================

app.post('/api/auth/register', async (request, reply) => {
  const { name, email, password } = request.body as {
    name: string
    email: string
    password: string
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return reply.code(400).send({ error: 'Email already registered' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, isSubscriber: true }
    })

    // Generate token
    const token = app.jwt.sign({ userId: user.id })

    return reply.send({
      user,
      token
    })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to create user' })
  }
})

app.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body as {
    email: string
    password: string
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = app.jwt.sign({ userId: user.id })

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSubscriber: user.isSubscriber
      },
      token
    })
  } catch (error) {
    return reply.code(500).send({ error: 'Login failed' })
  }
})

app.get('/api/auth/me', {
  preHandler: [app.authenticate]
}, async (request, reply) => {
  const user = await prisma.user.findUnique({
    where: { id: request.user.userId },
    select: { id: true, name: true, email: true, isSubscriber: true }
  })

  if (!user) {
    return reply.code(404).send({ error: 'User not found' })
  }

  return reply.send({ user })
})

// =============================================================================
// DAILY CARDS ROUTES
// =============================================================================

app.get('/api/cards/daily', async (request, reply) => {
  try {
    const dailyCard = await prisma.dailyCard.findFirst({
      include: { themeRelation: true },
      orderBy: { generatedAt: 'desc' }
    })

    return reply.send({ card: dailyCard })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch daily card' })
  }
})

app.get('/api/cards/daily/:id', async (request, reply) => {
  const { id } = request.params as { id: string }

  try {
    const card = await prisma.dailyCard.findUnique({
      where: { id },
      include: { themeRelation: true }
    })

    if (!card) {
      return reply.code(404).send({ error: 'Card not found' })
    }

    // Increment view count
    await prisma.dailyCard.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    })

    return reply.send({ card })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch card' })
  }
})

// =============================================================================
// CUSTOM CARDS ROUTES
// =============================================================================

app.get('/api/cards/custom', {
  preHandler: [app.authenticate]
}, async (request, reply) => {
  try {
    const cards = await prisma.customCard.findMany({
      where: { userId: request.user.userId },
      include: { themeRelation: true },
      orderBy: { createdAt: 'desc' }
    })

    return reply.send({ cards })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch custom cards' })
  }
})

app.post('/api/cards/custom', {
  preHandler: [app.authenticate]
}, async (request, reply) => {
  const { title, teaser, clues, solution, theme, themeId } = request.body as {
    title: string
    teaser: string
    clues: string[]
    solution: string
    theme?: string
    themeId?: number
  }

  try {
    const card = await prisma.customCard.create({
      data: {
        userId: request.user.userId,
        title,
        teaser,
        clues,
        solution,
        theme,
        themeId
      },
      include: { themeRelation: true }
    })

    return reply.code(201).send({ card })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to create card' })
  }
})

app.get('/api/cards/custom/:id', async (request, reply) => {
  const { id } = request.params as { id: string }

  try {
    const card = await prisma.customCard.findUnique({
      where: { id },
      include: { themeRelation: true, user: { select: { name: true } } }
    })

    if (!card) {
      return reply.code(404).send({ error: 'Card not found' })
    }

    // Increment view count
    await prisma.customCard.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    })

    return reply.send({ card })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch card' })
  }
})

// =============================================================================
// THEMES ROUTES
// =============================================================================

app.get('/api/themes', async (request, reply) => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { name: 'asc' }
    })

    return reply.send({ themes })
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to fetch themes' })
  }
})

// =============================================================================
// LIKES ROUTES
// =============================================================================

app.post('/api/cards/:cardId/like', {
  preHandler: [app.authenticate]
}, async (request, reply) => {
  const { cardId } = request.params as { cardId: string }
  const { cardType } = request.body as { cardType: 'DAILY' | 'CUSTOM' }

  try {
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        user_card_like: {
          userId: request.user.userId,
          cardId,
          cardType
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      })

      // Decrement like count
      if (cardType === 'DAILY') {
        await prisma.dailyCard.update({
          where: { id: cardId },
          data: { likesCount: { decrement: 1 } }
        })
      } else {
        await prisma.customCard.update({
          where: { id: cardId },
          data: { likesCount: { decrement: 1 } }
        })
      }

      return reply.send({ liked: false })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: request.user.userId,
          cardId,
          cardType
        }
      })

      // Increment like count
      if (cardType === 'DAILY') {
        await prisma.dailyCard.update({
          where: { id: cardId },
          data: { likesCount: { increment: 1 } }
        })
      } else {
        await prisma.customCard.update({
          where: { id: cardId },
          data: { likesCount: { increment: 1 } }
        })
      }

      return reply.send({ liked: true })
    }
  } catch (error) {
    return reply.code(500).send({ error: 'Failed to toggle like' })
  }
})

// =============================================================================
// HEALTH CHECK
// =============================================================================

app.get('/api/health', async (request, reply) => {
  return reply.send({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 API Server running on http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start() 