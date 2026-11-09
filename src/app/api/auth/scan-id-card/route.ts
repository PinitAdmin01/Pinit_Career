import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { parseCollegeCardFromText, generateCollegePinItId, CollegeMetadata, isInvalidStudentName } from '@/lib/utils/pinitIdGenerator';

const VISION_SYSTEM_PROMPT = `You are a specialist Document AI OCR vision model analyzing university, college, and school identity cards.
Carefully examine the visual layout of this student ID card.
Extract the student and institutional credentials from the image.
Return ONLY valid JSON matching this exact structure:
{
  "collegeName": "Full institutional name of the university, college, or school (e.g. BGS Institute of Management)",
  "collegeCode": "2-6 uppercase letters for the college acronym (e.g. BGS, SVCE, GCC, GKCC, COL)",
  "studentName": "Full name of the student in Title Case (e.g. Vinay N, David Smith, Md. Ekramul Islam). If the student's name is NOT present, unreadable, or only school titles/addresses/class descriptions are visible, return an empty string \"\"",
  "department": "Degree or department name (e.g. Computer Applications, Nursing, Mechanical Engineering)",
  "departmentCode": "2-5 uppercase letters (e.g. BCA, CSE, NURS, MECH, GEN)",
  "rollNumber": "Roll number, USN, registration number, or student ID suffix (3-6 characters)",
  "confidence": 0.95
}
CRITICAL NEGATIVE CONSTRAINTS:
- Do NOT confuse the institution header, school name (e.g. "The Adarsh Model", "Sunrise Public School"), or "Govt. Recognised" with the student name.
- Do NOT confuse locality addresses (e.g. "Ashok Nagar", "MG Road") with the student name.
- Do NOT confuse student role descriptions (e.g. "Nursing Student") or class sections (e.g. "Class 10", "Section B") with the student name.
- If in doubt, return "" for studentName. Never guess.`;

function sanitizeAiOutput(parsed: any, rawReply: string): CollegeMetadata | null {
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.collegeCode && !parsed.studentName && !parsed.rollNumber && !parsed.collegeName) return null;

  let sName = (parsed.studentName || '').trim();
  if (isInvalidStudentName(sName)) {
    sName = '';
  }

  return {
    collegeName: parsed.collegeName?.trim() || 'Accredited Institution',
    collegeCode: (parsed.collegeCode || 'COL').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'COL',
    department: parsed.department?.trim() || 'General Studies',
    departmentCode: (parsed.departmentCode || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GEN',
    rollNumber: (parsed.rollNumber || '001').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || '001',
    studentName: sName,
    rawExtractedText: rawReply.slice(0, 300),
    confidence: Math.min(1, Math.max(0.1, Number(parsed.confidence) || 0.95)),
  };
}

/**
 * Layer 1A: Groq Free Multimodal Vision (qwen/qwen3.8-27b)
 * Sub-second LPU inference speed on Groq Cloud.
 */
async function tryGroqVision(mimeType: string, base64Image: string, customGroqKey?: string | null): Promise<CollegeMetadata | null> {
  const groqKey = customGroqKey || process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!groqKey) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: VISION_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this student ID badge image and extract all credentials into the specified JSON format.' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn('[PinIT System] [ScanIdCard API] Groq vision returned status:', res.status);
      return null;
    }

    const data = await res.json();
    const rawReply = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!rawReply) return null;

    const parsed = JSON.parse(rawReply.replace(/^```json\s*/i, '').replace(/```\s*$/i, ''));
    return sanitizeAiOutput(parsed, rawReply);
  } catch (err: any) {
    console.warn('[PinIT System] [ScanIdCard API] Groq vision call note:', err?.message);
    return null;
  }
}

/**
 * Layer 1B: Google Gemini 2.0 Flash Vision
 * Free tier on Google AI Studio.
 */
async function tryGeminiVision(mimeType: string, base64Image: string): Promise<CollegeMetadata | null> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: VISION_SYSTEM_PROMPT },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      console.warn('[PinIT System] [ScanIdCard API] Gemini vision returned status:', res.status);
      return null;
    }

    const data = await res.json();
    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    if (!rawReply) return null;

    const parsed = JSON.parse(rawReply.replace(/^```json\s*/i, '').replace(/```\s*$/i, ''));
    return sanitizeAiOutput(parsed, rawReply);
  } catch (err: any) {
    console.warn('[PinIT System] [ScanIdCard API] Gemini vision call note:', err?.message);
    return null;
  }
}

export async function POST(req: NextRequest) {
  console.log('[PinIT System] [ScanIdCard API] Starting student ID verification request...');
  try {
    const formData = await req.formData();
    // Accept either 'file' or 'image' field for robust interoperability
    const file = (formData.get('file') as File | null) || (formData.get('image') as File | null);
    const fallbackName = (formData.get('fallbackName') as string) || '';
    const headerGroqKey = req.headers.get('x-groq-api-key') || (formData.get('groqKey') as string | null);

    if (!file) {
      console.warn('[PinIT System] [ScanIdCard API] Error: No file provided in formData');
      return NextResponse.json({ error: 'No ID card image provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';
    const base64Image = buffer.toString('base64');
    const fileExt = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';

    let extractedMeta: CollegeMetadata | null = null;
    let extractionSource = 'fallback-to-client';

    // 1. Layer 1A: Attempt Free Multimodal Vision via Groq (qwen/qwen3.8-27b)
    console.log('[PinIT System] [ScanIdCard API] Action: Calling Groq Vision AI...');
    extractedMeta = await tryGroqVision(mimeType, base64Image, headerGroqKey);
    if (extractedMeta) {
      extractionSource = 'groq-vision';
    }

    // 2. Layer 1B: If Groq not configured or failed, attempt Google Gemini Flash (gemini-2.0-flash)
    if (!extractedMeta) {
      console.log('[PinIT System] [ScanIdCard API] Action: Calling Google Gemini Vision AI...');
      extractedMeta = await tryGeminiVision(mimeType, base64Image);
      if (extractedMeta) {
        extractionSource = 'gemini-vision';
      }
    }

    // 3. Option 2 Fallback: If neither cloud AI was able to process, return fallbackRequired
    // IMPORTANT: NEVER treat file.name as OCR text (prevents "college id card jpg" error)
    if (!extractedMeta) {
      console.log('[PinIT System] [ScanIdCard API] Fallback: Cloud AI unconfigured or returned null. Triggering Option 2 in-browser OCR...');
      return NextResponse.json({
        success: false,
        fallbackRequired: true,
        message: 'Server AI vision unconfigured or unreachable. Switching to in-browser OCR / client vision...',
        source: 'fallback-to-client',
      }, { status: 200 });
    }

    // 4. Generate Canonical PinIT ID
    const pinitId = generateCollegePinItId({
      collegeCode: extractedMeta.collegeCode,
      departmentCode: extractedMeta.departmentCode,
      rollNumber: extractedMeta.rollNumber,
    });

    // 5. Securely upload raw image to Supabase Storage Bucket 'student-id-cards' if available
    let storagePath = '';
    try {
      const admin = getSupabaseAdmin();
      storagePath = `${pinitId}/card_${Date.now()}.${fileExt}`;
      const { error: uploadErr } = await admin.storage
        .from('student-id-cards')
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadErr) {
        console.warn('[PinIT System] [ScanIdCard API] Storage upload note:', uploadErr.message);
      }
    } catch (storageErr: any) {
      console.warn('[PinIT System] [ScanIdCard API] Storage service exception:', storageErr?.message);
    }

    console.log('[PinIT System] [ScanIdCard API] Completed: Successfully extracted credentials. Student:', extractedMeta.studentName, 'College:', extractedMeta.collegeName, 'ID:', pinitId);

    return NextResponse.json({
      success: true,
      metadata: extractedMeta,
      collegeMeta: extractedMeta,
      studentName: extractedMeta.studentName,
      collegeName: extractedMeta.collegeName,
      collegeCode: extractedMeta.collegeCode,
      department: extractedMeta.department,
      departmentCode: extractedMeta.departmentCode,
      rollNumber: extractedMeta.rollNumber,
      pinitId,
      storagePath,
      source: extractionSource,
    });
  } catch (err: any) {
    console.error('[PinIT System] [ScanIdCard API] Critical handler error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to scan student ID card', fallbackRequired: true },
      { status: 500 }
    );
  }
}
