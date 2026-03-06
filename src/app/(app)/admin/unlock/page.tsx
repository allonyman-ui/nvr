import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const metadata = { title: 'Admin Unlock' }

async function unlockAdmin(formData: FormData) {
  'use server'
  const entered = formData.get('password') as string
  const master = process.env.ADMIN_PASSWORD

  if (!master || entered !== master) {
    redirect('/admin/unlock?error=1')
  }

  // Set an HttpOnly session cookie valid for 7 days
  const jar = await cookies()
  jar.set('admin_unlocked', (process.env.ADMIN_EMAIL?.trim()) ?? 'yes', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  redirect('/admin')
}

export default async function AdminUnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
            <svg width="22" height="22" fill="none" stroke="#6366f1" strokeWidth="1.75" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Admin access</h1>
          <p className="text-slate-500 text-sm">Enter the master password to continue</p>
        </div>

        <form action={unlockAdmin} className="space-y-4">
          <div>
            <label className="label" htmlFor="password">Master password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className={`input ${hasError ? 'border-red-400 focus:border-red-500' : ''}`}
              placeholder="Enter master password"
            />
            {hasError && (
              <p className="text-red-500 text-xs mt-1.5">Incorrect password. Try again.</p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5">
            Unlock admin
          </button>
        </form>
      </div>
    </div>
  )
}
