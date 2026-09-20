export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  color: string;
  sort_order: number;
}

export interface Title {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  cover_image: string | null;
  description: string | null;
  sort_order: number;
}

export interface Character {
  id: string;
  title_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  sort_order: number;
}

export type AssetType = 'scenepack' | 'voiceline' | 'sfx' | 'broll' | 'image' | 'music';

export interface Asset {
  id: string;
  character_id: string;
  name: string;
  asset_type: AssetType;
  thumbnail_url: string | null;
  mp4_url: string | null;
  mp3_url: string | null;
  description: string | null;
  duration_seconds: number | null;
  file_size_mb: number | null;
  clip_count: number | null;
  quality: string | null;
  tags: string[];
  created_at: string;
}

export type Route =
  | { page: 'home' }
  | { page: 'category'; categorySlug: string }
  | { page: 'title'; categorySlug: string; titleSlug: string }
  | { page: 'character'; categorySlug: string; titleSlug: string; characterSlug: string };
