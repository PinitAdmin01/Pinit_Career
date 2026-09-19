'use client';
import React from 'react';
import CareerTwinCockpit from '@/components/career-twin/CareerTwinCockpit';
import { useRouter } from 'next/navigation';

export default function CareerTwinPage() {
  const router = useRouter();

  const handleLaunchMission = (mission: any) => {
    console.log('[CareerTwin] Launching mission:', mission.title);
    router.push('/missions');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <CareerTwinCockpit onLaunchMission={handleLaunchMission} />
    </main>
  );
}
