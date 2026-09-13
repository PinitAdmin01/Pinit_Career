import { z } from 'zod';
import { NextResponse } from 'next/server';

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { data: T; error: null } | { data: null; error: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'VALIDATION_ERROR', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      ),
    };
  }
  return { data: result.data, error: null };
}

export async function validateRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const json = await req.json();
    return validateBody(schema, json);
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'INVALID_JSON', message: 'Malformed or missing JSON payload in request body' },
        { status: 400 }
      ),
    };
  }
}

