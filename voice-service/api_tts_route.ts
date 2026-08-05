import { NextRequest, NextResponse } from "next/server";

const SPEECH_SERVER_URL = process.env.SPEECH_SERVER_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { text, voice, cacheKey } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text parameter is required." }, { status: 400 });
    }

    console.log(`[/api/tts] Processing request for hash: ${cacheKey || "unknown"} | Voice: ${voice}`);

    // Tier 2: Check Cloud CDN Bucket if configured
    const cdnStorageUrl = process.env.NEXT_PUBLIC_CDN_VOICE_URL;
    if (cdnStorageUrl && cacheKey) {
      const cdnUrl = `${cdnStorageUrl}/${cacheKey}.mp3`;
      try {
        const cdnCheck = await fetch(cdnUrl, { method: "HEAD" });
        if (cdnCheck.ok) {
          console.log(`[/api/tts] Tier 2 CDN Hit for ${cacheKey}`);
          const audioRes = await fetch(cdnUrl);
          const audioBuffer = await audioRes.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mp3",
              "X-Cache-Status": "CDN_HIT",
            },
          });
        }
      } catch (cdnErr) {
        console.warn("[/api/tts] CDN check bypassed:", cdnErr);
      }
    }

    // Tier 3: Forward to Kokoro Speech Server
    console.log(`[/api/tts] Tier 3 Miss -> Forwarding to Kokoro Server at ${SPEECH_SERVER_URL}/generate`);
    const serverResponse = await fetch(`${SPEECH_SERVER_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: voice || "en-us-nicole" }),
    });

    if (!serverResponse.ok) {
      const errorText = await serverResponse.text();
      return NextResponse.json({ error: `Speech server error: ${errorText}` }, { status: serverResponse.status });
    }

    const audioBuffer = await serverResponse.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "X-Cache-Status": "GENERATED",
      },
    });

  } catch (err: any) {
    console.error("[/api/tts] Error processing TTS request:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
