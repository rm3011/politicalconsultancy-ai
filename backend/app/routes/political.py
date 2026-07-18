from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from app.services.political_collector import PoliticalCollector
import asyncio
import json

router = APIRouter(prefix="/api/political", tags=["Political Trends"])
collector = PoliticalCollector()

class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for conn in self.active_connections[:]:
            try:
                await conn.send_json(message)
            except:
                self.active_connections.remove(conn)

manager = ConnectionManager()

@router.get("/trends")
async def get_political_trends():
    """Get categorized political trends"""
    result = await collector.collect_all()
    return result

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@router.get("/categories")
async def get_categories():
    """Get all categories with counts"""
    result = await collector.collect_all()
    return {
        "categories": result.get("categories", {}),
        "sources": result.get("sources", {})
    }

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def push_trends_loop():
    """Push updates to WebSocket clients every 30 seconds"""
    while True:
        try:
            result = await collector.collect_all()
            if manager.active_connections:
                await manager.broadcast({
                    "type": "trends_update",
                    "timestamp": datetime.now().isoformat(),
                    "data": result
                })
        except Exception as e:
            print(f"Push error: {e}")
        await asyncio.sleep(30)

def start_background_trends():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(push_trends_loop())
