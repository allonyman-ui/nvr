import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? ANON_KEY;

// Client-side client (anon key, RLS)
export function createBrowserClient() {
  return createClient(SUPABASE_URL, ANON_KEY);
}

// Server-side client (service key, bypasses RLS)
export function createServerClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

export interface ActivityEvent {
  id: string;
  camera_name: string;
  timestamp: string;
  description: string;
  motion_score: number;
  has_faces: boolean;
  face_count: number;
  image_url: string | null;
  face_crops: FaceCrop[];
}

export interface FaceCrop {
  id: string;
  image_url: string;
  person_id: string | null;
  person_name: string | null;
}

export interface KnownPerson {
  id: string;
  name: string;
  photo_url: string | null;
  added_at: string;
  last_seen_at: string | null;
  seen_count: number;
}

// AI Intel Log — continuous, never-deleted intelligence reports
export interface IntelEntry {
  id: string;
  timestamp: string;
  period_label: string;
  trigger: string;
  summary: string;
  activity_lines: string[];
  change_from_previous: string | null;
  patterns: string[];
  anomalies: string[];
  camera_states: Record<string, string>;
  total_events: number;
  face_count: number;
  created_at: string;
}
