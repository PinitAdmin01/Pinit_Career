// src/components/ui/TelemetryInstaller.tsx
'use client';

import { useEffect } from 'react';
import { initClientTelemetry } from '@/lib/telemetry/errorTelemetry';

export default function TelemetryInstaller() {
  useEffect(() => {
    initClientTelemetry();
  }, []);

  return null;
}
