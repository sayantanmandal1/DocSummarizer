#!/bin/bash

# AI Document Insight Tool Production Deployment Script

set -e

echo "🚀 Deploying AI Document Insight Tool to Production..."

# Check if .env file exists
if [ ! -f backend/.env ]; then
    echo "❌ backend/.env file not found. Please create it first."
    exit 1
fi

# Check if SARVAM_API_KEY is set
if ! grep -q "SARVAM_API_KEY=" backend/.env || grep -q "SARVAM_API_KEY=your_sarvam_api_key_here" backend/.env; then
    echo "❌ SARVAM_API_KEY not properly set in backend/.env"
    exit 1
fi

# Stop existing services
echo "🛑 Stopping existing services..."
docker-compose -f docker-compose.prod.yml down

# Pull latest images and build
echo "🔄 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 60

# Health check
echo "🏥 Performing health checks..."
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

if curl -f https://docsummarizer.onrender.com/ > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

echo "🎉 Production deployment successful!"
echo ""
echo "🌐 Application is available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8001"
echo "   API Documentation: https://docsummarizer.onrender.com/docs"
echo ""
echo "📊 Monitor with:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"