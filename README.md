# Black Stories - Decoupled Architecture

A mystery-solving game application built with a decoupled architecture featuring a Fastify REST API backend and React frontend.

## 🏗️ Architecture

This project features a complete decoupled architecture:

- **API**: Fastify REST API with Prisma ORM (Port 3001)
- **Frontend**: React SPA with TypeScript and Tailwind CSS (Port 3000)
- **Database**: PostgreSQL with Prisma

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or use the provided Neon DB)

### 1. Setup the API

```bash
cd api
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start the API server
npm run dev
```

The API will be available at `http://localhost:3001`

### 2. Setup the Frontend

```bash
cd frontend
npm install

# Start the development server
npm start
```

The React app will be available at `http://localhost:3000`

## 📁 Project Structure

```
blackstories-fastify-prisma/
├── api/                      # Fastify REST API
│   ├── src/
│   │   └── server.ts         # Main API server
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   └── .env
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── .env
└── mvc/                     # Original monolithic version
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cards
- `GET /api/cards/daily` - Get daily card
- `GET /api/cards/daily/:id` - Get specific daily card
- `GET /api/cards/custom` - Get user's custom cards (auth required)
- `POST /api/cards/custom` - Create custom card (auth required)
- `GET /api/cards/custom/:id` - Get specific custom card

### Interactions
- `POST /api/cards/:cardId/like` - Like/unlike a card (auth required)

### Themes
- `GET /api/themes` - Get all themes

## 🎮 Features

### Core Features
- **Daily Mystery Cards**: New puzzles every day
- **Custom Card Creation**: Users can create their own mysteries
- **Progressive Clue System**: Reveal clues one by one
- **Like System**: Users can like their favorite cards
- **View Tracking**: Track card popularity
- **Themes**: Categorize cards by themes

### Authentication
- JWT-based authentication
- User registration and login
- Protected routes and API endpoints
- Persistent sessions

### UI/UX
- Modern, responsive design with Tailwind CSS
- Beautiful card layouts
- Interactive clue revelation
- User dashboard with statistics
- Loading states and error handling

## 🛠️ Tech Stack

### Backend (API)
- **Fastify**: Fast and efficient web framework
- **Prisma**: Type-safe ORM
- **PostgreSQL**: Robust relational database
- **JWT**: Secure authentication
- **bcryptjs**: Password hashing
- **TypeScript**: Type safety

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type safety and better DX
- **React Router**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Tailwind CSS**: Utility-first styling
- **Context API**: State management

## 🗃️ Database Schema

### Models
- **User**: User accounts and authentication
- **Theme**: Card categories
- **DailyCard**: System-generated daily mysteries
- **CustomCard**: User-created mysteries
- **Like**: User likes on cards
- **View**: Card view tracking

## 🔐 Environment Variables

### API (.env)
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```

## 📦 Deployment

### API Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve the build directory with any static file server
3. Ensure the API URL is correctly configured

## 🧪 Development

### API Development
```bash
cd api
npm run dev  # Starts with hot reload
```

### Frontend Development
```bash
cd frontend
npm start    # Starts with hot reload
```

### Database Management
```bash
cd api
npx prisma studio      # Visual database browser
npx prisma migrate dev # Create new migration
npx prisma generate    # Regenerate client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆚 Comparison with Monolithic Version

The original monolithic version (in `/mvc`) uses:
- Server-side rendering with EJS templates
- Session-based authentication
- Traditional MVC architecture

This decoupled version provides:
- Better scalability and maintainability
- Modern SPA experience
- API-first architecture
- JWT authentication
- Mobile-ready responsive design 