'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NvrLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/nvr-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Incorrect password');
        setPassword('');
        setLoading(false);
        inputRef.current?.focus();
      }
    } catch {
      setError('Connection error — try again');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300"
            >
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
              <rect x="2" y="7" width="13" height="10" rx="2" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-white text-center mb-1 tracking-tight">
          Security Cameras
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">allonys.com</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            autoComplete="current-password"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Signing in…' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  );
}
