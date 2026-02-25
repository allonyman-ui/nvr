import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isValidNvrSession } from '@/lib/nvr-auth';
import IntelClient from './IntelClient';

export default async function IntelPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';
  if (!isValidNvrSession(session)) redirect('/login');
  return <IntelClient />;
}
