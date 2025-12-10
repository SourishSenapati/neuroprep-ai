# NeuroPrep AI - Installation Fix

## ✅ Fixed Installation Issue

The postinstall script was causing infinite loop. Fixed by removing it from package.json.

## 🚀 Correct Installation Steps

### 1. Install Root Dependencies
```cmd
npm install
```

### 2. Install Backend Dependencies
```cmd
cd backend
npm install
cd ..
```

### 3. Install Frontend Dependencies
```cmd
cd frontend
npm install
cd ..
```

### 4. Verify Installation
```cmd
npm list concurrently --depth=0
```

### 5. Start Development
```cmd
npm run dev
```

Or use the batch file:
```cmd
dev.bat
```

## 📦 What Gets Installed

**Root:**
- concurrently
- cypress
- jest, ts-jest
- vercel

**Backend:**
- express, socket.io, cors
- openai, @anthropic-ai/sdk
- ioredis, pg
- zod, helmet, compression

**Frontend:**
- next, react, react-dom
- three, @react-three/fiber
- framer-motion, recharts
- socket.io-client, next-auth
- @monaco-editor/react

## 🐛 If Installation Still Fails

Run manual installation:
```cmd
npm install concurrently cypress jest ts-jest @types/jest typescript vercel --save-dev

cd backend
npm install express socket.io cors dotenv openai @anthropic-ai/sdk ioredis pg zod helmet compression express-rate-limit stripe --save
npm install @types/express @types/node @types/cors typescript ts-node nodemon --save-dev

cd ../frontend
npm install next react react-dom three @react-three/fiber @react-three/drei framer-motion recharts socket.io-client next-auth @monaco-editor/react --save
npm install @types/react @types/node typescript tailwindcss postcss autoprefixer --save-dev

cd ..
```

## ✅ Verification

After installation, verify:
```cmd
node -v
npm -v
npx concurrently --version
```

Then start:
```cmd
npm run dev
```

Backend: http://localhost:3001
Frontend: http://localhost:3000
