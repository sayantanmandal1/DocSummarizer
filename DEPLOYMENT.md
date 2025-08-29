# 🚀 Deployment Guide

This guide covers different deployment options for the AI Document Insight Tool.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Sarvam AI API key
- At least 2GB RAM and 10GB disk space
- Ports 3000 and 8001 available

## 🐳 Docker Deployment (Recommended)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd ai-document-insight-tool

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your SARVAM_API_KEY

# Deploy with Docker Compose
docker-compose up --build -d
```

### Production Deployment
```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up --build -d

# With Nginx reverse proxy
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🖥️ Manual Deployment

### Backend Deployment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Frontend Deployment
```bash
cd frontend
npm install --force
npm run build
npm start
```

## ☁️ Cloud Deployment

### AWS ECS
1. Build and push images to ECR
2. Create ECS task definitions
3. Deploy using ECS service
4. Configure Application Load Balancer

### Google Cloud Run
1. Build images with Cloud Build
2. Deploy to Cloud Run
3. Configure custom domain
4. Set up Cloud SQL for database

### Azure Container Instances
1. Push images to Azure Container Registry
2. Create container groups
3. Configure networking
4. Set up Azure Database

## 🔧 Configuration

### Environment Variables
```env
# Required
SARVAM_API_KEY=your_api_key_here

# Optional
DATABASE_URL=documents.db
API_HOST=0.0.0.0
API_PORT=8001
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
```

### SSL/TLS Setup
```bash
# Generate self-signed certificate for testing
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key -out ssl/certificate.crt

# Update nginx.conf for HTTPS
```

## 📊 Monitoring

### Health Checks
- Frontend: `http://localhost:3000/`
- Backend: `https://docsummarizer.onrender.com/`
- API Docs: `https://docsummarizer.onrender.com/docs`

### Logging
```bash
# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### Metrics
- Response times
- Error rates
- Resource usage
- Database performance

## 🔄 Updates

### Rolling Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up --build -d
```

### Zero-Downtime Deployment
```bash
# Use blue-green deployment
docker-compose -f docker-compose.blue.yml up -d
# Switch traffic
docker-compose -f docker-compose.green.yml down
```

## 🛡️ Security

### Best Practices
- Use HTTPS in production
- Set up firewall rules
- Regular security updates
- Monitor for vulnerabilities
- Use secrets management

### Rate Limiting
```nginx
# In nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## 💾 Backup & Recovery

### Database Backup
```bash
# Manual backup
cp backend/documents.db backups/documents_$(date +%Y%m%d).db

# Automated backup script
./scripts/backup.sh
```

### Disaster Recovery
1. Regular automated backups
2. Test restore procedures
3. Document recovery steps
4. Monitor backup integrity

## 🔍 Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| Port conflicts | Change ports in docker-compose.yml |
| Memory issues | Increase Docker memory limits |
| SSL errors | Check certificate configuration |
| Database locks | Restart backend service |

### Debug Commands
```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
    
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing
- Use Nginx for load balancing
- Configure health checks
- Implement session affinity
- Monitor performance metrics

## 🎯 Performance Optimization

### Backend Optimization
- Use Gunicorn with multiple workers
- Implement caching
- Optimize database queries
- Use connection pooling

### Frontend Optimization
- Enable Next.js optimizations
- Use CDN for static assets
- Implement code splitting
- Optimize images

## 📞 Support

For deployment issues:
1. Check the logs first
2. Review configuration
3. Test connectivity
4. Open a GitHub issue
5. Contact support team