/*
# AETHER CUTS — Full Schema

A resource hub for video editors with a multi-level drill-down structure:
Categories → Titles → Characters → Assets

1. New Tables
   - `categories`: top-level content categories (Movies, Anime, etc.)
   - `titles`: franchises/games/shows within a category
   - `characters`: characters or sub-topics within a title
   - `assets`: downloadable clips, voice lines, SFX etc.
   - `asset_requests`: user-submitted requests for new assets

2. Security
   - All catalog tables (categories, titles, characters, assets) are public read-only (anon + authenticated)
   - asset_requests: anon insert only, no public read (admin-only)
*/

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_name text NOT NULL DEFAULT 'folder',
  color text NOT NULL DEFAULT '#00d4ff',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

-- TITLES (franchises / movies / shows / artists)
CREATE TABLE IF NOT EXISTS titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  cover_image text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (category_id, slug)
);

ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_titles" ON titles;
CREATE POLICY "public_read_titles" ON titles FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS titles_category_id_idx ON titles(category_id);

-- CHARACTERS (characters / sub-topics within a title)
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id uuid NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  image_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (title_id, slug)
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_characters" ON characters;
CREATE POLICY "public_read_characters" ON characters FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS characters_title_id_idx ON characters(title_id);

-- ASSETS (downloadable files)
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  name text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('scenepack', 'voiceline', 'sfx', 'broll', 'image', 'music')),
  thumbnail_url text,
  mp4_url text,
  mp3_url text,
  description text,
  duration_seconds int,
  file_size_mb numeric(6,1),
  clip_count int DEFAULT 1,
  quality text DEFAULT '1080p',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_assets" ON assets;
CREATE POLICY "public_read_assets" ON assets FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS assets_character_id_idx ON assets(character_id);

-- ASSET REQUESTS (user submissions)
CREATE TABLE IF NOT EXISTS asset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text,
  character_name text,
  description text NOT NULL,
  contact_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asset_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_requests" ON asset_requests;
CREATE POLICY "anon_insert_requests" ON asset_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
