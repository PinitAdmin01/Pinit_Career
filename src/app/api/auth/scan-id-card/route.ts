import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { parseCollegeCardFromText, generateCollegePinItId, CollegeMetadata } from '@/lib/utils/pinitIdGenerator';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fallbackName = (formData.get('fallbackName') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No ID card image provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';
    const base64Image = buffer.toString('base64');
    const fileExt = file.name.split('.').pop() || 'jpg';

    let extractedMeta: CollegeMetadata | null = null;
    let extractionSource = 'heuristic';

    // 1. Attempt Multimodal AI Vision Extraction via Gemini Flash (if API key available)
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      try {
        const visionPrompt = `You are a specialist Document AI OCR model analyzing Indian university and college student identity cards.
Extract the student and institutional credentials from the provided ID card image.
Return ONLY valid JSON matching this exact structure:
{
  "collegeName": "Full name of the college or university (e.g. BGS Institute of Management)",
  "collegeCode": "3-6 letter uppercase institutional acronym (e.g. BGS, RVCE, BMSCE, PES, IITB)",
  "studentName": "Full name of the student in Title Case (e.g. Vinay N)",
  "department": "Full name of degree or department (e.g. Bachelor of Computer Applications)",
  "departmentCode": "2-5 letter uppercase course code (e.g. BCA, CSE, ISE, ECE, BCOM, BBA, MCA)",
  "rollNumber": "USN, roll number, registration number, or contact phone suffix (3-6 characters)",
  "confidence": 0.95
}
Return raw JSON only, no markdown formatting or backticks.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: visionPrompt },
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
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (rawReply) {
            const parsed = JSON.parse(rawReply.replace(/^```json\s*/i, '').replace(/```\s*$/i, ''));
            if (parsed.collegeCode || parsed.studentName) {
              extractedMeta = {
                collegeName: parsed.collegeName || 'Accredited Institution',
                collegeCode: (parsed.collegeCode || 'COL').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6),
                department: parsed.department || 'General Studies',
                departmentCode: (parsed.departmentCode || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6),
                rollNumber: (parsed.rollNumber || '001').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6),
                studentName: parsed.studentName?.trim() || '',
                rawExtractedText: rawReply.slice(0, 300),
                confidence: Number(parsed.confidence) || 0.92,
              };
              extractionSource = 'gemini-vision';
            }
          }
        }
      } catch (geminiErr: any) {
        console.warn('[ScanIdCard API] Gemini vision fallback to heuristic:', geminiErr?.message);
      }
    }

    // 2. Fallback: Parse card text heuristically if vision didn't run or failed
    if (!extractedMeta) {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[._-]/g, ' ');
      extractedMeta = parseCollegeCardFromText(cleanFileName, '');
    }

    // 3. Generate Canonical PinIT ID
    const pinitId = generateCollegePinItId({
      collegeCode: extractedMeta.collegeCode,
      departmentCode: extractedMeta.departmentCode,
      rollNumber: extractedMeta.rollNumber,
    });

    // 4. Securely upload raw image to Supabase Storage Bucket 'student-id-cards'
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
        console.warn('[ScanIdCard API] Storage upload warning:', uploadErr.message);
      }
    } catch (storageErr: any) {
      console.warn('[ScanIdCard API] Storage service exception:', storageErr?.message);
    }

    return NextResponse.json({
      success: true,
      metadata: extractedMeta,
      pinitId,
      storagePath,
      source: extractionSource,
    });
  } catch (err: any) {
    console.error('[ScanIdCard API] Critical handler error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to scan student ID card' },
      { status: 500 }
    );
  }
}
