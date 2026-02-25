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

-- ============================================================
-- AI Intel Log — continuous, never-deleted intelligence reports
-- Each entry is a Claude analysis snapshot with history context.
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_intel_log (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period_label        TEXT        NOT NULL,                -- e.g. "Feb 25, 14:00–14:05"
  trigger             TEXT        NOT NULL DEFAULT 'scheduled', -- 'scheduled' | 'motion' | 'cron' | 'manual'
  summary             TEXT        NOT NULL,                -- 2-3 sentence narrative
  activity_lines      TEXT[]      NOT NULL DEFAULT '{}',   -- timestamped log lines
  change_from_previous TEXT,                               -- what changed vs the last entry
  patterns            TEXT[]      NOT NULL DEFAULT '{}',   -- recurring patterns observed
  anomalies           TEXT[]      NOT NULL DEFAULT '{}',   -- unusual activity flags
  camera_states       JSONB       NOT NULL DEFAULT '{}',   -- {cameraName: "description"}
  total_events        INT         NOT NULL DEFAULT 0,
  face_count          INT         NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_intel_log_timestamp_idx ON ai_intel_log (timestamp DESC);

-- Disable Row Level Security (our own session-cookie auth handles access control)
ALTER TABLE activity_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE known_people    DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_intel_log    DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Storage buckets (create these in Supabase Dashboard > Storage)
-- ============================================================
-- 1. Name: camera-captures   | Public: NO
-- 2. Name: face-crops        | Public: NO
-- ============================================================
