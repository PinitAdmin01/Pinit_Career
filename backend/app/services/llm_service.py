"""
LLM Service — OpenRouter API client.
Proxies chat completions from the FastAPI backend to OpenRouter.
Supports streaming and non-streaming responses.
"""

import os
import json
import httpx
from typing import AsyncGenerator

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

DEFAULT_MODEL = "mistralai/mistral-7b-instruct"
SITE_URL = "https://pinit.app"
SITE_NAME = "PinIT Career OS"


async def chat_completion(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> dict:
    """
    Non-streaming chat completion via OpenRouter.

    Args:
        messages: List of {"role": str, "content": str} dicts
        model: OpenRouter model ID
        temperature: Sampling temperature
        max_tokens: Max output tokens

    Returns:
        {"content": str, "model": str, "usage": dict}
    """
    if not OPENROUTER_API_KEY:
        return {
            "content": "LLM service not configured. Set OPENROUTER_API_KEY.",
            "model": model,
            "usage": None,
        }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"]
    usage = data.get("usage")
    return {"content": content, "model": model, "usage": usage}


async def stream_chat_completion(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> AsyncGenerator[str, None]:
    """
    Streaming chat completion via OpenRouter.
    Yields SSE-formatted chunks: "data: {json}\n\n"
    """
    if not OPENROUTER_API_KEY:
        yield 'data: {"content": "LLM not configured."}\n\n'
        return

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": True,
            },
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    raw = line[6:]
                    if raw == "[DONE]":
                        yield "data: [DONE]\n\n"
                        break
                    try:
                        chunk = json.loads(raw)
                        delta = chunk["choices"][0]["delta"].get("content", "")
                        if delta:
                            yield f"data: {json.dumps({'content': delta})}\n\n"
                    except (json.JSONDecodeError, KeyError, IndexError):
                        pass
