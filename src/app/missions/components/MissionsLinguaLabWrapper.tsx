'use client';

import React from 'react';
import LinguaLab from '@/components/missions/LinguaLab';

interface MissionsLinguaLabWrapperProps {
  streak: number;
  theme: {
    bg: string;
    bgCard: string;
    bgInside: string;
    border: string;
    tPrimary: string;
    tSecondary: string;
    tTertiary: string;
    accentLight: string;
  };
}

export default function MissionsLinguaLabWrapper({ streak, theme }: MissionsLinguaLabWrapperProps) {
  return <LinguaLab streak={streak} theme={theme} />;
}
