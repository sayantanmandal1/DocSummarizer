#!/bin/bash

# AI Document Insight Tool Backup Script

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="ai_doc_backup_${TIMESTAMP}.tar.gz"

echo "💾 Creating backup of AI Document Insight Tool..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Create temporary directory for backup
TEMP_DIR=$(mktemp -d)

# Copy database
if [ -f "backend/documents.db" ]; then
    echo "📊 Backing up database..."
    cp backend/documents.db $TEMP_DIR/
fi

# Copy configuration files
echo "⚙️ Backing up configuration..."
cp backend/.env $TEMP_DIR/ 2>/dev/null || echo "⚠️ No .env file found"
cp docker-compose.yml $TEMP_DIR/
cp docker-compose.prod.yml $TEMP_DIR/

# Copy logs if they exist
if [ -d "logs" ]; then
    echo "📝 Backing up logs..."
    cp -r logs $TEMP_DIR/
fi

# Create compressed archive
echo "🗜️ Creating compressed archive..."
tar -czf $BACKUP_DIR/$BACKUP_FILE -C $TEMP_DIR .

# Cleanup
rm -rf $TEMP_DIR

# Show backup info
BACKUP_SIZE=$(du -h $BACKUP_DIR/$BACKUP_FILE | cut -f1)
echo "✅ Backup created successfully!"
echo "📁 File: $BACKUP_DIR/$BACKUP_FILE"
echo "📏 Size: $BACKUP_SIZE"

# Keep only last 10 backups
echo "🧹 Cleaning up old backups..."
cd $BACKUP_DIR
ls -t ai_doc_backup_*.tar.gz | tail -n +11 | xargs -r rm --

echo "🎉 Backup process completed!"