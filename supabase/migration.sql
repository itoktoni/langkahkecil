-- Supabase SQL Migration for Halo Bunda
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Children (anak)
CREATE TABLE IF NOT EXISTS anak (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  emoji TEXT DEFAULT '👶',
  bg TEXT DEFAULT '#E3F2FD',
  gender TEXT,
  tanggal INT,
  bulan INT,
  tahun INT,
  skills JSONB DEFAULT '[]',
  completed_skills JSONB DEFAULT '[]',
  history JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anak_id UUID NOT NULL,
  title TEXT,
  category TEXT,
  emoji TEXT,
  color TEXT,
  points INT DEFAULT 0,
  max_points INT DEFAULT 10,
  notes TEXT,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Challenge History
CREATE TABLE IF NOT EXISTS challenge_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anak_id UUID NOT NULL,
  challenge_id UUID,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Checklists
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anak_id UUID NOT NULL,
  title TEXT,
  items JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Schedules
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anak_id UUID NOT NULL,
  title TEXT,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anak_user ON anak(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_user ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_anak ON challenges(anak_id);
CREATE INDEX IF NOT EXISTS idx_challenge_history_user ON challenge_history(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_user ON checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_anak ON checklists(anak_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_anak ON schedules(anak_id);

-- Row Level Security
ALTER TABLE anak ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can manage own anak" ON anak FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenges" ON challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenge_history" ON challenge_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own checklists" ON checklists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own schedules" ON schedules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON settings FOR ALL USING (auth.uid() = user_id);
