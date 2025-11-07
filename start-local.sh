#!/bin/bash
# ============================================
# Decarbonize Local Development Starter
# Linux/Mac için
# ============================================

echo "🚀 Decarbonize Local Development Starter"
echo "=========================================="
echo ""

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# MySQL kontrolü
echo "📊 Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL not found. Please install MySQL 8.0+${NC}"
    exit 1
fi

# MySQL connection test
if mysql -u decarbonize -pKrateia1@ -e "USE decarbonize_dev;" 2>/dev/null; then
    echo -e "${GREEN}✅ MySQL database ready${NC}"
else
    echo -e "${YELLOW}⚠️  Database not ready. Running setup...${NC}"
    echo ""
    echo "Please run these MySQL commands as root:"
    echo "  CREATE DATABASE IF NOT EXISTS decarbonize_dev;"
    echo "  CREATE USER IF NOT EXISTS 'decarbonize'@'localhost' IDENTIFIED BY 'Krateia1@';"
    echo "  GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';"
    echo "  FLUSH PRIVILEGES;"
    echo ""
    read -p "Press Enter after running the commands..."
fi

# Backend setup
echo ""
echo "🖥️  Starting Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Backend .env.local not found${NC}"
else
    echo -e "${GREEN}✅ Backend .env.local exists${NC}"
fi

# Check if built
if [ ! -d "dist" ]; then
    echo "🔨 Building backend..."
    npm run build
fi

# Start backend
echo "▶️  Starting backend on port 3002..."
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
sleep 3

# Frontend setup
echo ""
echo "🎨 Starting Frontend..."
cd ..

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local not found${NC}"
else
    echo -e "${GREEN}✅ Frontend .env.local exists${NC}"
fi

# Start frontend
echo "▶️  Starting frontend on port 5173..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Decarbonize is running!${NC}"
echo "=========================================="
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3002"
echo "   Projects: http://localhost:5173/projects"
echo ""
echo "📋 PIDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
