# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.routes import chat_router, enrich_router, political_router
from app.services.gemini_service import GeminiService

app = FastAPI(title="Political Consultancy AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/chat")
app.include_router(enrich_router, prefix="/api/enrich")
app.include_router(political_router)

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.get("/api/cache/stats")
async def cache_stats():
    """Get cache statistics"""
    service = GeminiService()
    return service.cache_manager.get_stats()

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Server started!")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Shutting down...")