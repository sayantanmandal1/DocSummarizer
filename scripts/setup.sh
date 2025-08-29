#!/bin/bash

# AI Document Insight Tool Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up AI Document Insight Tool..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your SARVAM_API_KEY"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p ssl
mkdir -p data

# Set permissions
echo "🔒 Setting permissions..."
chmod +x scripts/*.sh

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8001"
    echo "   API Docs: http://localhost:8001/docs"
    echo ""
    echo "📚 Next steps:"
    echo "   1. Edit backend/.env and add your SARVAM_API_KEY"
    echo "   2. Restart services: docker-compose restart"
    echo "   3. Upload a PDF to test the application"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi