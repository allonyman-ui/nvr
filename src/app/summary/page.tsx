import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidNvrSession } from '@/lib/nvr-auth';
import ActivitySummaryClient from './ActivitySummaryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Activity Log · Security Cameras',
  robots: { index: false, follow: false },
};

export default async function SummaryPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';

  if (!isValidNvrSession(session)) {
    redirect('/login');
  }

  return <ActivitySummaryClient />;
}
