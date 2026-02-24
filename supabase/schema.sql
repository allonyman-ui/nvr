-- ============================================================
-- NVR Security App — Supabase Schema
-- Run this in your Supabase SQL Editor (one-time setup)
-- ============================================================

-- Activity events (motion detections + AI descriptions)
CREATE TABLE IF NOT EXISTS activity_events (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  camera_name  TEXT        NOT NULL,
  timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description  TEXT        NOT NULL,
  motion_score FLOAT       DEFAULT 0,
  has_faces    BOOLEAN     DEFAULT FALSE,
  face_count   INTEGER     DEFAULT 0,
  image_path   TEXT,                         -- Supabase Storage path in 'camera-captures' bucket
  face_crops   JSONB       DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_activity_events_timestamp ON activity_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_camera    ON activity_events (camera_name);

-- Known people (named individuals the system recognises)
CREATE TABLE IF NOT EXISTS known_people (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  photo_path   TEXT,                         -- Supabase Storage path in 'face-crops' bucket
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  seen_count   INTEGER     DEFAULT 0
);

-- Disable Row Level Security (our own session-cookie auth handles access control)
ALTER TABLE activity_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE known_people    DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Storage buckets (create these in Supabase Dashboard > Storage)
-- ============================================================
-- 1. Name: camera-captures   | Public: NO
-- 2. Name: face-crops        | Public: NO
-- ============================================================
