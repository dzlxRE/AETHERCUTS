import { useEffect, useState } from 'react';
import {
  ArrowLeft, Download, Play, Volume2, Film, Music, Image,
  Clock, HardDrive, Layers, Tag, Video,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Character, Asset, AssetType, Route } from '@/lib/types';

interface CharacterPageProps {
  categorySlug: string;
  titleSlug: string;
  characterSlug: string;
  onNavigate: (route: Route) => void;
}

const TYPE_CONFIG: Record<AssetType, { label: string; icon: React.ReactNode; color: string }> = {
  scenepack: { label: 'Scenepack', icon: <Film size={14} />, color: '#00d4ff' },
  voiceline: { label: 'Voice Lines', icon: <Volume2 size={14} />, color: '#a855f7' },
  sfx: { label: 'SFX', icon: <Volume2 size={14} />, color: '#f97316' },
  broll: { label: 'B-Roll', icon: <Video size={14} />, color: '#10b981' },
  image: { label: 'Images', icon: <Image size={14} />, color: '#ec4899' },
  music: { label: 'Music', icon: <Music size={14} />, color: '#3b82f6' },
};

const ALL_TYPES = Object.keys(TYPE_CONFIG) as AssetType[];

function formatDuration(secs: number | null): string {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export default function CharacterPage({
  categorySlug,
  titleSlug,
  characterSlug,
  onNavigate,
}: CharacterPageProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeFilter, setActiveFilter] = useState<AssetType | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const charRes = await supabase
        .from('characters')
        .select('*')
        .eq('slug', characterSlug)
        .maybeSingle();

      if (charRes.data) {
        setCharacter(charRes.data);
        const assetsRes = await supabase
          .from('assets')
          .select('*')
          .eq('character_id', charRes.data.id)
          .order('created_at');
        if (assetsRes.data) setAssets(assetsRes.data);
      }
      setLoading(false);
    };
    load();
  }, [characterSlug]);

  const availableTypes = ALL_TYPES.filter((t) => assets.some((a) => a.asset_type === t));
  const filtered =
    activeFilter === 'all' ? assets : assets.filter((a) => a.asset_type === activeFilter);

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen pt-16">
      {/* Character hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {character?.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-pink-900/20" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,5,10,0.4) 0%, rgba(5,5,10,0.7) 50%, rgba(5,5,10,1) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-7xl mx-auto">
          <button
            onClick={() => onNavigate({ page: 'title', categorySlug, titleSlug })}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{character?.name}</h1>
              {character?.description && (
                <p className="text-white/50 text-sm mt-1">{character.description}</p>
              )}
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 mb-1"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {assets.length} {assets.length === 1 ? 'Asset' : 'Assets'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        {/* Filter tabs */}
        {availableTypes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <FilterTab
              label="All"
              count={assets.length}
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              color="#00d4ff"
            />
            {availableTypes.map((type) => {
              const cfg = TYPE_CONFIG[type];
              const count = assets.filter((a) => a.asset_type === type).length;
              return (
                <FilterTab
                  key={type}
                  label={cfg.label}
                  count={count}
                  active={activeFilter === type}
                  onClick={() => setActiveFilter(type)}
                  color={cfg.color}
                  icon={cfg.icon}
                />
              );
            })}
          </div>
        )}

        {/* Asset grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
  color,
  icon,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
      style={{
        background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        color: active ? color : 'rgba(255,255,255,0.4)',
      }}
    >
      {icon}
      {label}
      <span
        className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
        style={{
          background: active ? `${color}25` : 'rgba(255,255,255,0.06)',
          color: active ? color : 'rgba(255,255,255,0.3)',
        }}
      >
        {count}
      </span>
    </button>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const [downloading, setDownloading] = useState<'mp4' | 'mp3' | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const cfg = TYPE_CONFIG[asset.asset_type];

  const handleDownload = async (type: 'mp4' | 'mp3') => {
    const url = type === 'mp4' ? asset.mp4_url : asset.mp3_url;
    if (!url) return;
    setDownloading(type);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${asset.name}.${type}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(url, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  const mediaUrl = asset.mp4_url ?? asset.mp3_url;
  const isAudio = !asset.mp4_url && !!asset.mp3_url;

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Thumbnail / Preview area */}
      <div
        className="relative h-44 overflow-hidden cursor-pointer"
        onClick={() => mediaUrl && setPreviewing((p) => !p)}
      >
        {previewing && mediaUrl ? (
          isAudio ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/60">
              <audio controls autoPlay src={mediaUrl} className="w-4/5" />
            </div>
          ) : (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <>
            {asset.thumbnail_url ? (
              <img
                src={asset.thumbnail_url}
                alt={asset.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${cfg.color}12, rgba(0,0,0,0.6))` }}
              >
                <div className="opacity-30" style={{ color: cfg.color }}>
                  {cfg.icon}
                </div>
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(5,5,10,0.85) 100%)' }}
            />
            {mediaUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <Play size={18} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Type badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: `1px solid ${cfg.color}40`,
            color: cfg.color,
            backdropFilter: 'blur(8px)',
          }}
        >
          {cfg.icon}
          {cfg.label}
        </div>

        {/* Quality badge */}
        {asset.quality && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            {asset.quality}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-4">
        <h3 className="font-bold text-white text-sm leading-snug mb-1">{asset.name}</h3>
        {asset.description && (
          <p className="text-white/35 text-xs leading-relaxed line-clamp-2 mb-3">{asset.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px] text-white/30 mb-4">
          {asset.clip_count && (
            <span className="flex items-center gap-1">
              <Layers size={11} />
              {asset.clip_count} clips
            </span>
          )}
          {asset.duration_seconds && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDuration(asset.duration_seconds)}
            </span>
          )}
          {asset.file_size_mb && (
            <span className="flex items-center gap-1">
              <HardDrive size={11} />
              {asset.file_size_mb} MB
            </span>
          )}
        </div>

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <Tag size={10} className="text-white/20" />
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] text-white/30"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Download buttons */}
        <div className="flex items-center gap-2">
          {asset.mp4_url && (
            <DownloadButton
              label="MP4"
              loading={downloading === 'mp4'}
              onClick={() => handleDownload('mp4')}
              primary
            />
          )}
          {asset.mp3_url && (
            <DownloadButton
              label="MP3"
              loading={downloading === 'mp3'}
              onClick={() => handleDownload('mp3')}
              primary={!asset.mp4_url}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DownloadButton({
  label,
  loading,
  onClick,
  primary,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={
        primary
          ? {
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(255,0,110,0.2))',
              border: '1px solid rgba(0,212,255,0.35)',
              color: '#fff',
            }
          : {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
            }
      }
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Download size={12} />
      )}
      Download {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-white/20 text-lg font-semibold">No assets yet</p>
      <p className="text-white/10 text-sm mt-2">Assets are being prepared for this character</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      <div className="h-72 bg-white/[0.02] animate-pulse" />
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
