# NeuroPrep AI - Windows Setup Guide


## 🚀 Quick Setup (5 Minutes)


### Step 1: Install Dependencies

```cmd
setup.bat

```text

This installs all dependencies for root, backend, and frontend.


### Step 2: Configure Environment

```cmd
cd backend
copy .env.example .env
notepad .env

```text

Edit `.env` with your API keys:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=sk-proj-your-key-here

```text


### Step 3: Start Development Servers

```cmd
dev.bat

```text

Or manually:

```cmd
npm run dev

```text


### Step 4: Open Browser

```text

http://localhost:3000

```text


## 🔧 Manual Installation (If setup.bat Fails)


### Install Root Dependencies

```cmd
npm install

```text


### Install Backend Dependencies

```cmd
cd backend
npm install express socket.io cors dotenv openai @anthropic-ai/sdk ioredis pg zod helmet compression express-rate-limit stripe
npm install --save-dev @types/express @types/node @types/cors typescript ts-node nodemon
cd ..

```text


### Install Frontend Dependencies

```cmd
cd frontend
npm install next@latest react react-dom
npm install three @react-three/fiber @react-three/drei framer-motion recharts socket.io-client next-auth @monaco-editor/react
npm install --save-dev @types/react @types/node typescript tailwindcss postcss autoprefixer
cd ..

```text


### Install Dev Tools

```cmd
npm install --save-dev concurrently cypress jest ts-jest @types/jest vercel

```text


## 🧪 Running Tests


### Backend Tests

```cmd
npx jest --config jest.config.js

```text


### E2E Tests

```cmd
npx cypress run

```text

Or interactive:

```cmd
npx cypress open

```text


## 🚀 Deployment


### Install Vercel CLI

```cmd
npm install -g vercel

```text


### Deploy

```cmd
vercel login
vercel --prod

```text


## 🐛 Troubleshooting


### Error: 'concurrently' is not recognized

```cmd
npm install concurrently --save-dev

```text


### Error: 'jest' is not recognized

```cmd
npm install jest ts-jest @types/jest --save-dev

```text


### Error: 'cypress' is not recognized

```cmd
npm install cypress --save-dev

```text


### Port Already in Use

```cmd
netstat -ano | findstr :3001
taskkill /PID <PID> /F

```text


### Clear Node Modules

```cmd
rmdir /s /q node_modules
rmdir /s /q backend\node_modules
rmdir /s /q frontend\node_modules
del package-lock.json
del backend\package-lock.json
del frontend\package-lock.json
setup.bat

```text


## 📦 Verify Installation

```cmd
node -v
npm -v
npx concurrently --version
npx jest --version
npx cypress --version

```text

Expected:


- Node: v18.x or higher
- npm: v9.x or higher
- All tools installed


## 🎯 Next Steps


1. ✅ Dependencies installed
2. ✅ Environment configured
3. ✅ Dev servers running
4. → Test locally
5. → Deploy to Vercel

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

---

**Windows-Specific Notes:**

- Use `setup.bat` instead of shell scripts
- Use `dev.bat` to start servers
- Use `npx` prefix for CLI tools
- Use backslashes `\` for paths
