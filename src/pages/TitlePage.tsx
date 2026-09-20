import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Title, Character, Route } from '@/lib/types';

interface TitlePageProps {
  categorySlug: string;
  titleSlug: string;
  onNavigate: (route: Route) => void;
}

export default function TitlePage({ categorySlug, titleSlug, onNavigate }: TitlePageProps) {
  const [title, setTitle] = useState<Title | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const titleRes = await supabase
        .from('titles')
        .select('*')
        .eq('slug', titleSlug)
        .maybeSingle();

      if (titleRes.data) {
        setTitle(titleRes.data);
        const charsRes = await supabase
          .from('characters')
          .select('*')
          .eq('title_id', titleRes.data.id)
          .order('sort_order');
        if (charsRes.data) setCharacters(charsRes.data);
      }
      setLoading(false);
    };
    load();
  }, [titleSlug]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {title?.cover_image ? (
          <img
            src={title.cover_image}
            alt={title.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/20 to-pink-900/20" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,5,10,0.3) 0%, rgba(5,5,10,0.7) 60%, rgba(5,5,10,1) 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-7xl mx-auto">
          <button
            onClick={() => onNavigate({ page: 'category', categorySlug })}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{title?.name}</h1>
          {title?.description && (
            <p className="text-white/50 text-sm max-w-xl">{title.description}</p>
          )}
        </div>
      </div>

      {/* Characters */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users size={18} className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            Characters & Sub-topics
          </h2>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-cyan-300"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            {characters.length}
          </span>
        </div>

        {characters.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onClick={() =>
                  onNavigate({
                    page: 'character',
                    categorySlug,
                    titleSlug,
                    characterSlug: char.slug,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CharacterCard({
  character,
  onClick,
}: {
  character: Character;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.03]"
      style={{
        border: `1px solid ${hovered ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered ? '0 8px 40px rgba(0,212,255,0.1)' : 'none',
      }}
    >
      {/* Portrait */}
      <div className="relative h-52 overflow-hidden">
        {character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 30%, rgba(5,5,10,0.95) 100%)',
          }}
        />

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-tight">{character.name}</h3>
          {character.description && (
            <p className="text-white/40 text-xs mt-1 line-clamp-2">{character.description}</p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <span className="text-xs text-white/30 font-medium">View Assets</span>
        <ArrowRight
          size={14}
          className="text-white/25 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
        />
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-white/20 text-lg font-semibold">No characters found yet</p>
      <p className="text-white/10 text-sm mt-2">Check back soon as the vault expands</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      <div className="h-80 bg-white/[0.02] animate-pulse" />
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="h-6 w-48 rounded bg-white/5 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
