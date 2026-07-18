from fastapi import APIRouter
from typing import Optional, List
from pydantic import BaseModel
from app.services.gemini_service import GeminiService
import logging
import json
import re

router = APIRouter()
logger = logging.getLogger(__name__)

try:
    gemini_service = GeminiService()
    logger.info("Gemini service initialized")
except Exception as e:
    logger.error(f"Gemini init error: {e}")
    gemini_service = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    state: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    sources: List[dict]

def extract_clean_message(answer: str) -> str:
    """
    Extract clean answer from Gemini response.
    Handles both JSON and plain text responses.
    """
    if not answer:
        return "I couldn't generate a response. Please try again."
    
    clean_message = answer.strip()
    
    # Remove markdown code fences
    clean_message = clean_message.replace('```json', '').replace('```', '').strip()
    
    # Try to extract from JSON if present
    try:
        # Find JSON-like content
        json_match = re.search(r'\{.*\}', clean_message, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            if isinstance(data, dict):
                # Extract answer from JSON
                if 'answer' in data:
                    clean_message = data['answer'].strip()
                else:
                    # If no answer field, use the whole JSON as string
                    clean_message = str(data)
        else:
            # Try to find answer field pattern without full JSON
            match = re.search(r'"answer"\s*:\s*"([^"]*)"', clean_message)
            if match:
                clean_message = match.group(1).strip()
    except (json.JSONDecodeError, Exception) as e:
        logger.debug(f"JSON extraction failed: {e}")
        # Keep the original message
    
    # Additional cleanup for any remaining JSON artifacts
    # If the message still contains JSON-like structure, try to clean it
    if clean_message.startswith('{') and clean_message.endswith('}'):
        try:
            data = json.loads(clean_message)
            if isinstance(data, dict):
                clean_message = data.get('answer', str(data))
        except:
            pass
    
    # Remove any trailing JSON that might be attached
    # This handles cases like "Answer text. {something: 'value'}"
    json_pattern = r'\s*\{[^{}]*\}$'
    clean_message = re.sub(json_pattern, '', clean_message).strip()
    
    return clean_message

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with S-AI - Returns clean, formatted response"""
    
    if gemini_service is None:
        return ChatResponse(
            message="Gemini service is not configured. Please check your API key.",
            sources=[]
        )
    
    try:
        user_msgs = [m for m in request.messages if m.role == "user"]
        if not user_msgs:
            return ChatResponse(
                message="Please ask a question.",
                sources=[]
            )
        
        latest_question = user_msgs[-1].content
        logger.info(f"Processing question: {latest_question}")
        
        answer, sources = await gemini_service.answer_with_search(latest_question, {})
        
        # Extract clean message
        clean_message = extract_clean_message(answer)
        
        # If clean_message is empty or too short, use the fallback
        if not clean_message or len(clean_message) < 10:
            clean_message = "I found some information but couldn't format it properly. Please try rephrasing your question."
        
        # Add sources if available
        if sources and len(sources) > 0:
            source_names = []
            for s in sources[:3]:
                source_name = s.get('source', '')
                if source_name and source_name != 'Unknown':
                    source_names.append(source_name)
            
            if source_names:
                clean_message += f"\n\nSources: {', '.join(source_names)}"
        
        return ChatResponse(
            message=clean_message,
            sources=sources[:5]
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return ChatResponse(
            message=f"I encountered an error while processing your question. Please try again.",
            sources=[]
        )