import { useEffect, useState } from 'react';
import {
  Film, Gamepad2, Star, Mic, User, Camera, Music, Image, Volume2, Grid3x3,
  ArrowRight, Layers, Download, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Route } from '@/lib/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  film: <Film size={28} />,
  'gamepad-2': <Gamepad2 size={28} />,
  star: <Star size={28} />,
  mic: <Mic size={28} />,
  user: <User size={28} />,
  camera: <Camera size={28} />,
  music: <Music size={28} />,
  image: <Image size={28} />,
  'volume-2': <Volume2 size={28} />,
};

const STATS = [
  { value: '10,000+', label: 'Clips Available' },
  { value: '500+', label: 'Characters' },
  { value: '4K', label: 'Max Quality' },
  { value: 'Free', label: 'Always' },
];

interface HomePageProps {
  onNavigate: (route: Route) => void;
  onRequestAsset: () => void;
}

export default function HomePage({ onNavigate, onRequestAsset }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-32 md:py-44 text-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(ellipse, #00d4ff 0%, #ff006e 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 mb-8"
          style={{
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
          }}
        >
          <Zap size={11} fill="currentColor" />
          The Ultimate Editor's Vault
        </div>

        {/* Title */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-[-0.02em] text-white mb-6 leading-none"
          style={{
            textShadow: '0 0 80px rgba(0,212,255,0.3)',
          }}
        >
          AETHER
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #ff006e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CUTS
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-xl mb-10 leading-relaxed">
          The Ultimate Vault for Scenepacks, Voice Lines & SFX.
          <br />
          <span className="text-white/30">Built for creators who demand excellence.</span>
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(255,0,110,0.25))',
              border: '1px solid rgba(0,212,255,0.4)',
              boxShadow: '0 0 30px rgba(0,212,255,0.1)',
            }}
          >
            Browse Assets
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onRequestAsset}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-all duration-300 hover:scale-105"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Request Asset
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-16 mt-16 flex-wrap justify-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-black text-white"
                style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}
              >
                {s.value}
              </div>
              <div className="text-xs text-white/30 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="py-12 border-y border-white/[0.04]" style={{ background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Layers size={20} className="text-cyan-400" />, title: 'Multi-Level Library', desc: 'Drill down from category to franchise to character to find exactly what you need.' },
              { icon: <Download size={20} className="text-pink-500" />, title: 'Instant Downloads', desc: 'Download MP4 scenepacks or MP3 voice lines and SFX with a single click.' },
              { icon: <Zap size={20} className="text-amber-400" />, title: '4K Quality Assets', desc: 'Only the highest quality clips, voice lines, and sound effects in the vault.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-3">Browse By</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Content Categories</h2>
          </div>

          {/* All button */}
          <div className="mb-6">
            <button
              onClick={() => onNavigate({ page: 'home' })}
              className="group flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <Grid3x3 size={24} />
              </div>
              <span className="text-white font-semibold">All Categories</span>
              <ArrowRight size={14} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all ml-auto" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate({ page: 'category', categorySlug: cat.slug })}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: hoveredCategory === cat.id
                    ? `linear-gradient(135deg, ${cat.color}12, rgba(255,255,255,0.04))`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${hoveredCategory === cat.id ? cat.color + '30' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: `${cat.color}15`,
                    color: cat.color,
                    boxShadow: hoveredCategory === cat.id ? `0 0 20px ${cat.color}25` : 'none',
                  }}
                >
                  {ICON_MAP[cat.icon_name] ?? <Grid3x3 size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base">{cat.name}</h3>
                  <p className="text-xs text-white/30 mt-0.5 capitalize">Explore collection</p>
                </div>

                <ArrowRight
                  size={16}
                  className="flex-shrink-0 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
