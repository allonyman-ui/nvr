'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KnownPerson } from '@/lib/supabase';

function timeAgo(iso: string | null) {
  if (!iso) return 'Never seen';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PersonCard({ person, onDelete }: { person: KnownPerson; onDelete: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group relative flex items-center gap-3 bg-white/[0.03] border border-white/[0.06]
                    hover:bg-white/[0.06] hover:border-white/10 transition-all rounded-xl p-3">
      {/* Avatar */}
      <div className="flex-none w-12 h-12 rounded-full overflow-hidden bg-white/[0.06]
                      border-2 border-white/10 flex items-center justify-center text-white/20">
        {person.photo_url && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover"
            onError={() => setImgErr(true)} />
        ) : (
          <IconUser />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white/85 truncate">{person.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-white/30">Last seen: {timeAgo(person.last_seen_at)}</span>
          {person.seen_count > 0 && (
            <span className="text-[9px] bg-blue-500/10 text-blue-400/70 border border-blue-500/20
                             rounded-full px-1.5 py-0.5">
              {person.seen_count}×
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-none opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center
                   text-white/25 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        title="Remove person"
      >
        <IconTrash />
      </button>
    </div>
  );
}

// ── Add person form ────────────────────────────────────────────────────

function AddPersonForm({ onAdd, onCancel }: { onAdd: (person: KnownPerson) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      setPhotoBase64(dataUrl.split(',')[1] ?? null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/known-people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), photoBase64 }),
      });
      const { person } = (await res.json()) as { person: KnownPerson };
      onAdd(person);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}
      className="bg-white/[0.04] border border-white/10 rounded-xl p-4 space-y-3">
      <p className="text-[11px] font-semibold text-white/70">Add Known Person</p>

      {/* Photo upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full h-24 rounded-lg border-2 border-dashed border-white/10
                   hover:border-blue-500/40 transition-colors flex items-center justify-center
                   cursor-pointer overflow-hidden bg-white/[0.02]"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="h-full object-cover" />
        ) : (
          <div className="text-center">
            <p className="text-white/20 text-[11px]">Click to upload photo</p>
            <p className="text-white/15 text-[9px] mt-0.5">Optional — helps with face matching</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Name input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name…"
        required
        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2
                   text-[12px] text-white/80 placeholder-white/20 outline-none
                   focus:border-blue-500/50 focus:bg-white/[0.07] transition-all"
      />

      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-[11px] text-white/40
                     hover:text-white/60 hover:bg-white/5 transition-all border border-white/[0.06]">
          Cancel
        </button>
        <button type="submit" disabled={saving || !name.trim()}
          className="flex-1 py-2 rounded-lg text-[11px] font-medium bg-blue-600 text-white
                     hover:bg-blue-500 disabled:opacity-40 transition-all">
          {saving ? 'Saving…' : 'Add Person'}
        </button>
      </div>
    </form>
  );
}

// ── Main ───────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KnownPeoplePanel({ open, onClose }: Props) {
  const [people, setPeople] = useState<KnownPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/known-people');
      const { people: data } = (await res.json()) as { people: KnownPerson[] };
      setPeople(data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function handleDelete(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/known-people?id=${id}`, { method: 'DELETE' });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} aria-hidden />
      <div
        className="relative w-[320px] h-full bg-[#0b1219] border-l border-white/[0.07]
                   flex flex-col shadow-2xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-4 py-3
                        border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-white/40"><IconUser /></span>
            <span className="text-[12px] font-semibold text-white/80 tracking-wide">
              Known People
            </span>
            {loading && (
              <span className="w-3.5 h-3.5 border border-white/10 border-t-blue-500
                               rounded-full animate-spin" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdd((s) => !s)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium
                          transition-all border ${showAdd
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                : 'text-white/40 hover:text-white/70 border-transparent hover:bg-white/8 hover:border-white/10'}`}
            >
              <IconPlus />
              <span>Add</span>
            </button>
            <button onClick={onClose}
              className="text-white/30 hover:text-white/70 transition-colors">
              <IconClose />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-none">
          {showAdd && (
            <AddPersonForm
              onAdd={(p) => { setPeople((prev) => [p, ...prev]); setShowAdd(false); }}
              onCancel={() => setShowAdd(false)}
            />
          )}

          {people.length === 0 && !loading && !showAdd && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10
                              flex items-center justify-center text-white/20">
                <IconUser />
              </div>
              <div className="text-center">
                <p className="text-white/25 text-[12px] font-medium">No people added yet</p>
                <p className="text-white/15 text-[10px] mt-1">
                  Add people to identify them in the activity feed
                </p>
              </div>
            </div>
          )}

          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onDelete={() => void handleDelete(person.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex-none px-4 py-2 border-t border-white/[0.05]">
          <p className="text-[9px] text-white/15 text-center">
            {people.length} registered · Faces matched automatically during capture
          </p>
        </div>
      </div>
    </div>
  );
}
