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
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

DEFAULT_MODEL = "mistralai/mistral-7b-instruct"
SITE_URL = "https://pinit.app"
SITE_NAME = "PinIT Career OS"


def _parse_keys(raw: str) -> list[str]:
    return [k.strip() for k in (raw or "").split(",") if len(k.strip()) > 8 and "placeholder" not in k]


def groq_key_for_slot(slot: str | None) -> str:
    shared = _parse_keys(os.getenv("GROQ_API_KEYS") or os.getenv("GROQ_API_KEY") or "")
    keys_a = _parse_keys(os.getenv("GROQ_API_KEYS_A") or os.getenv("GROQ_API_KEY_A") or "")
    keys_b = _parse_keys(os.getenv("GROQ_API_KEYS_B") or os.getenv("GROQ_API_KEY_B") or "")
    pool_a = keys_a or (shared[:1] if shared else [])
    pool_b = keys_b or (shared[1:2] if len(shared) > 1 else pool_a)
    if slot == "b":
        return pool_b[0] if pool_b else ""
    if slot == "a":
        return pool_a[0] if pool_a else ""
    return ""


async def chat_completion(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 512,
    groq_slot: str | None = None,
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
    slot = (groq_slot or "").strip().lower()
    groq_key = groq_key_for_slot(slot) if slot in ("a", "b") else ""
    if groq_key:
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.post(
                    GROQ_API_URL,
                    headers={
                        "Authorization": f"Bearer {groq_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": GROQ_MODEL,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                    },
                )
                response.raise_for_status()
                data = response.json()
            content = data["choices"][0]["message"]["content"]
            usage = data.get("usage")
            return {"content": content, "model": GROQ_MODEL, "usage": usage}
        except Exception:
            pass

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
