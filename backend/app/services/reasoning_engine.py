# app/services/reasoning_engine.py
import asyncio
import json
import re
import logging
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime

from google import genai
from google.genai import types

from app.core.config import Config
from app.models.search_result import SearchResult

logger = logging.getLogger(__name__)

class ReasoningEngine:
    """
    Gemini reasoning with optimal context building.
    Only sends relevant chunks, not entire articles.
    """
    
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not set")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model = 'gemini-2.5-flash'
        self.max_chunk_length = Config.MAX_CHUNK_LENGTH
        self.max_chunks = Config.MAX_CONTEXT_CHUNKS
    
    async def reason(
        self,
        question: str,
        results: List[SearchResult],
        intent: Dict[str, Any]
    ) -> Tuple[str, List[Dict]]:
        """Generate reasoning-based answer from results"""
        
        if not results:
            return "My dev RM is Still Working On Me, so Kindly check on other Features.", []
        
        # 1. Build optimal context
        context_text, sources = self._build_optimal_context(results, question)
        
        if not context_text:
            return "I couldn't find enough relevant information. Please try rephrasing.", []
        
        # 2. Build prompt
        prompt = self._build_prompt(question, context_text, intent)
        
        # 3. Call Gemini
        try:
            response = await asyncio.wait_for(
                asyncio.to_thread(self._call_gemini, prompt),
                timeout=20.0
            )
            
            if not response:
                return self._fallback_answer(results), sources
            
            clean_answer = self._clean_response(response)
            
            if clean_answer and len(clean_answer) > 10:
                return clean_answer, sources
            
            return self._fallback_answer(results), sources
            
        except Exception as e:
            logger.error(f"Reasoning error: {e}")
            return self._fallback_answer(results), sources
    
    def _build_optimal_context(
        self,
        results: List[SearchResult],
        question: str
    ) -> Tuple[str, List[Dict]]:
        """Build context with optimal chunk selection"""
        
        if not results:
            return "", []
        
        context_parts = []
        sources = []
        
        for i, r in enumerate(results[:self.max_chunks], 1):
            # Extract relevant paragraphs (not full article)
            content = r.content if r.content else r.snippet
            relevant_chunk = self._extract_relevant_chunk(content, question)
            
            pub_date = r.published_at.strftime('%B %d, %Y') if r.published_at else 'Unknown'
            
            context_parts.append(f"""
Article {i}:
Title: {r.title}
Source: {r.source} (credibility: {r.credibility_score:.2f})
Date: {pub_date}
Relevant Excerpt: {relevant_chunk}
""")
            
            sources.append({
                'title': r.title,
                'url': r.url,
                'source': r.source,
                'credibility': r.credibility_score,
                'published_at': r.published_at.isoformat() if r.published_at else None
            })
        
        return "\n".join(context_parts), sources
    
    def _extract_relevant_chunk(self, content: str, question: str) -> str:
        """Extract the most relevant paragraph from content"""
        if not content:
            return ""
        
        # Split into paragraphs/sentences
        sentences = content.split('.')
        
        # Score each sentence by relevance to question
        scored = []
        for sent in sentences:
            if len(sent.strip()) < 20:
                continue
            # Simple relevance scoring
            score = 0
            for word in question.lower().split():
                if word in sent.lower():
                    score += 1
            scored.append((sent.strip(), score))
        
        # Sort by relevance
        scored.sort(key=lambda x: x[1], reverse=True)
        
        # Take top 3 sentences or first 500 chars
        if scored and scored[0][1] > 0:
            relevant = ". ".join([s[0] for s in scored[:3]])
            return relevant[:self.max_chunk_length]
        
        # Fallback: first 500 chars
        return content[:self.max_chunk_length]
    
    def _build_prompt(self, question: str, context: str, intent: Dict[str, Any]) -> str:
        """Build optimal prompt based on intent"""
        
        intent_type = intent.get('intent', 'conversational')
        
        # Base prompt
        prompt = f"""You are an expert political analyst. Answer the question using ONLY the context below.

QUESTION: {question}

CONTEXT:
{context}

RULES:
1. ONLY use the context provided.
2. Be concise (under 150 words).
3. Cite sources naturally.
4. If the answer isn't in the context, say "I don't have reliable information on that."
5. OUTPUT AS PLAIN TEXT - NO JSON, NO MARKDOWN.

ANSWER:"""
        
        # Intent-specific refinements
        if intent_type == 'prediction':
            prompt = prompt.replace(
                "Be concise (under 150 words).",
                "Be analytical. Provide a balanced prediction based on the evidence. Acknowledge uncertainty if present."
            )
        elif intent_type == 'opinion':
            prompt = prompt.replace(
                "Be concise (under 150 words).",
                "Be balanced. Present different perspectives if available in the context."
            )
        elif intent_type == 'strategy':
            prompt = prompt.replace(
                "Be concise (under 150 words).",
                "Be practical. Provide actionable insights based on the context."
            )
        
        return prompt
    
    def _call_gemini(self, prompt: str) -> str:
        """Synchronous Gemini call"""
        if not prompt:
            return ""
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    top_p=0.8,
                    max_output_tokens=500,
                ),
            ).text
            
            return response.strip() if response else ""
            
        except Exception as e:
            logger.error(f"Gemini call error: {e}")
            return ""
    
    def _clean_response(self, response: str) -> str:
        """Clean Gemini response"""
        if not response:
            return ""
        
        text = response.replace('```json', '').replace('```', '').strip()
        
        # Try to parse JSON if present
        try:
            if text.startswith('{') and text.endswith('}'):
                data = json.loads(text)
                if isinstance(data, dict):
                    if 'answer' in data:
                        return data['answer'].strip()
                    for value in data.values():
                        if isinstance(value, str) and len(value) > 10:
                            return value
            match = re.search(r'"answer"\s*:\s*"([^"]*)"', text)
            if match:
                return match.group(1).strip()
        except:
            pass
        
        # Remove JSON artifacts
        text = re.sub(r'\{[^{}]*\}', '', text).strip()
        
        return text if len(text) > 20 else "I found some information but couldn't format it properly."
    
    def _fallback_answer(self, results: List[SearchResult]) -> str:
        """Fallback if Gemini fails"""
        if not results:
            return "My dev RM is Still Working On Me, so Kindly check on other Features."
        
        best = results[0]
        title = best.title
        content = best.content[:400] if best.content else best.snippet
        
        return f"{title}\n\n{content}...\n\nSource: {best.source}"