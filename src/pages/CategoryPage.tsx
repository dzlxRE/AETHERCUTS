import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Title, Route } from '@/lib/types';

interface CategoryPageProps {
  categorySlug: string;
  onNavigate: (route: Route) => void;
}

export default function CategoryPage({ categorySlug, onNavigate }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [catRes, titlesRes] = await Promise.all([
        supabase.from('categories').select('*').eq('slug', categorySlug).maybeSingle(),
        supabase.from('titles').select('*, categories!inner(slug)').eq('categories.slug', categorySlug).order('sort_order'),
      ]);
      if (catRes.data) setCategory(catRes.data);
      if (titlesRes.data) setTitles(titlesRes.data);
      setLoading(false);
    };
    load();
  }, [categorySlug]);

  const filtered = titles.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => onNavigate({ page: 'home' })}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Categories
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-2">Category</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            {category?.name ?? categorySlug}
          </h1>
          <p className="text-white/40">{filtered.length} {filtered.length === 1 ? 'title' : 'titles'} available</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((title) => (
              <TitleCard
                key={title.id}
                title={title}
                onClick={() => onNavigate({ page: 'title', categorySlug, titleSlug: title.slug })}
                accentColor={category?.color ?? '#00d4ff'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TitleCard({
  title,
  onClick,
  accentColor,
}: {
  title: Title;
  onClick: () => void;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.03]"
      style={{
        border: `1px solid ${hovered ? accentColor + '30' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? `0 8px 40px ${accentColor}15` : 'none',
      }}
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        {title.cover_image ? (
          <img
            src={title.cover_image}
            alt={title.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${accentColor}20, rgba(0,0,0,0.8))` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 40%, rgba(5,5,10,0.9) 100%)',
          }}
        />
      </div>

      {/* Info */}
      <div
        className="flex items-center justify-between p-4"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm truncate">{title.name}</h3>
          {title.description && (
            <p className="text-xs text-white/35 mt-0.5 line-clamp-1">{title.description}</p>
          )}
        </div>
        <ArrowRight
          size={14}
          className="flex-shrink-0 ml-3 text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all"
        />
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-white/20 text-lg font-semibold">No titles found</p>
      <p className="text-white/10 text-sm mt-2">Try adjusting your search</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="h-4 w-32 rounded bg-white/5 mb-8" />
        <div className="h-12 w-64 rounded bg-white/5 mb-3" />
        <div className="h-4 w-24 rounded bg-white/5 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
