"""
Chat API — POST /api/chat
LLM chat proxy via OpenRouter. Supports streaming and non-streaming.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest, ChatResponse
from app.services.llm_service import chat_completion, stream_chat_completion

router = APIRouter(tags=["Chat"])


@router.post("/chat")
async def chat(req: ChatRequest):
    """
    Proxy LLM chat requests to OpenRouter.
    Set stream=true for real-time token streaming (SSE).
    """
    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    if req.stream:
        return StreamingResponse(
            stream_chat_completion(messages, req.model, req.temperature, req.max_tokens),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            },
        )

    result = await chat_completion(messages, req.model, req.temperature, req.max_tokens, req.groq_slot)
    return ChatResponse(**result)
