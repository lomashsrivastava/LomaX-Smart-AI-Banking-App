'use client';
import dynamic from 'next/dynamic';

const FutureBankEcosystem = dynamic(() => import('@/components/FutureBankEcosystem'), { ssr: false });

export default function HomePage() {
  return <FutureBankEcosystem />;
}
