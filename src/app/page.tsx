import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { getCamerasFromEnv } from '@/lib/nvr-config';
import NvrDashboard from '@/components/nvr/NvrDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Security Cameras',
  robots: { index: false, follow: false },
};

export default async function NvrPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';

  if (!isValidNvrSession(session)) {
    redirect('/login');
  }

  return (
    <NvrDashboard
      go2rtcBaseUrl={process.env.GO2RTC_BASE_URL ?? ''}
      cameras={getCamerasFromEnv()}
    />
  );
}
