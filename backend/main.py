from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import PyPDF2
from collections import Counter
import re
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv
import json
import aiosqlite
from pydantic import BaseModel
from io import BytesIO
from sarvamai import SarvamAI

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Document Insight Tool", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://doc-summarizer-szax.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001"
    ],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "documents.db"

class DocumentInsight(BaseModel):
    id: int
    filename: str
    upload_date: str
    summary: str
    is_ai_generated: bool
    word_count: int

async def init_db():
    """Initialize the database"""
    async with aiosqlite.connect(DATABASE_URL) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                upload_date TEXT NOT NULL,
                summary TEXT NOT NULL,
                is_ai_generated BOOLEAN NOT NULL,
                word_count INTEGER NOT NULL
            )
        """)
        await db.commit()

@app.on_event("startup")
async def startup_event():
    await init_db()

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text content from PDF file"""
    try:
        # Create a BytesIO object from the bytes content
        pdf_file = BytesIO(pdf_content)
        
        # Ensure the file pointer is at the beginning
        pdf_file.seek(0)
        
        # Create PDF reader
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page_num, page in enumerate(pdf_reader.pages):
            try:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            except Exception as page_error:
                print(f"Error reading page {page_num}: {page_error}")
                continue
        
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def get_top_words(text: str, top_n: int = 5) -> str:
    """Get top N most frequent words as fallback"""
    # Clean and tokenize text
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    # Remove common stop words
    stop_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'}
    filtered_words = [word for word in words if word not in stop_words]
    
    # Get most common words
    word_counts = Counter(filtered_words)
    top_words = word_counts.most_common(top_n)
    
    return f"Top {top_n} most frequent words: " + ", ".join([f"{word} ({count})" for word, count in top_words])

def get_ai_summary_sync(text: str) -> tuple[str, bool]:
    """Get AI summary from Sarvam AI with fallback (synchronous)"""
    api_key = os.getenv("SARVAM_API_KEY")
    
    if not api_key:
        return get_top_words(text), False
    
    try:
        # Initialize Sarvam AI client
        client = SarvamAI(api_subscription_key=api_key)
        
        # Use chat completions for document summarization
        response = client.chat.completions(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert document analyzer. Provide a concise, professional summary of the document content in 2-3 sentences, focusing on key qualifications, experience, and skills if it's a resume."
                },
                {
                    "role": "user",
                    "content": f"Please provide a concise summary of this document:\n\n{text[:3000]}"
                }
            ],
            max_tokens=200,
            temperature=0.3
        )
        
        # Extract the summary from the response
        if hasattr(response, 'choices') and response.choices and len(response.choices) > 0:
            choice = response.choices[0]
            if hasattr(choice, 'message') and hasattr(choice.message, 'content'):
                summary = choice.message.content.strip()
                if summary:
                    print(f"AI Summary generated successfully: {summary[:100]}...")
                    return summary, True
        
        # If we couldn't get a proper response, fall back
        print("AI response format unexpected, falling back to word analysis")
        return get_top_words(text), False
                
    except Exception as e:
        print(f"Error calling Sarvam AI: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return get_top_words(text), False

async def get_ai_summary(text: str) -> tuple[str, bool]:
    """Async wrapper for AI summary"""
    import asyncio
    import concurrent.futures
    
    # Use ThreadPoolExecutor to run the sync function
    with concurrent.futures.ThreadPoolExecutor() as executor:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, get_ai_summary_sync, text)

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and process PDF resume"""
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Extract text from PDF
        pdf_content = await file.read()
        text = extract_text_from_pdf(pdf_content)
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Get AI summary or fallback
        summary, is_ai_generated = await get_ai_summary(text)
        
        # Save to database
        async with aiosqlite.connect(DATABASE_URL) as db:
            cursor = await db.execute(
                """INSERT INTO documents (filename, upload_date, summary, is_ai_generated, word_count) 
                   VALUES (?, ?, ?, ?, ?)""",
                (file.filename, datetime.now().isoformat(), summary, is_ai_generated, len(text.split()))
            )
            await db.commit()
            document_id = cursor.lastrowid
        
        return {
            "id": document_id,
            "filename": file.filename,
            "summary": summary,
            "is_ai_generated": is_ai_generated,
            "word_count": len(text.split()),
            "upload_date": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/insights")
async def get_insights(document_id: Optional[int] = None):
    """Get document insights - specific document or all documents"""
    
    try:
        async with aiosqlite.connect(DATABASE_URL) as db:
            if document_id:
                # Get specific document
                cursor = await db.execute(
                    "SELECT * FROM documents WHERE id = ?", (document_id,)
                )
                row = await cursor.fetchone()
                
                if not row:
                    raise HTTPException(status_code=404, detail="Document not found")
                
                return {
                    "id": row[0],
                    "filename": row[1],
                    "upload_date": row[2],
                    "summary": row[3],
                    "is_ai_generated": row[4],
                    "word_count": row[5]
                }
            else:
                # Get all documents
                cursor = await db.execute(
                    "SELECT * FROM documents ORDER BY upload_date DESC"
                )
                rows = await cursor.fetchall()
                
                documents = []
                for row in rows:
                    documents.append({
                        "id": row[0],
                        "filename": row[1],
                        "upload_date": row[2],
                        "summary": row[3],
                        "is_ai_generated": row[4],
                        "word_count": row[5]
                    })
                
                return {"documents": documents}
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "AI Document Insight Tool API is running!"}

@app.get("/test-ai")
async def test_ai():
    """Test Sarvam AI integration"""
    try:
        summary, is_ai = await get_ai_summary("This is a test document about a software engineer with Python and FastAPI experience.")
        return {"summary": summary, "is_ai_generated": is_ai, "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "failed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)