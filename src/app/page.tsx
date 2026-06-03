'use client';
import dynamic from 'next/dynamic';

const FutureBankDashboard = dynamic(() => import('@/components/FutureBankDashboard'), { ssr: false });

export default function HomePage() {
  return <FutureBankDashboard />;
}
