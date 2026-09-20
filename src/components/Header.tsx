import { Zap } from 'lucide-react';
import type { Route } from '@/lib/types';

interface HeaderProps {
  route: Route;
  onNavigate: (route: Route) => void;
  onRequestAsset: () => void;
}

export default function Header({ route, onNavigate, onRequestAsset }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b border-white/[0.06]"
        style={{
          background: 'rgba(5, 5, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate({ page: 'home' })}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Zap
                size={22}
                className="text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
              />
              <div className="absolute inset-0 blur-md bg-cyan-400/50 group-hover:bg-cyan-300/60 transition-colors" />
            </div>
            <span
              className="text-lg font-bold tracking-widest text-white group-hover:text-cyan-100 transition-colors"
              style={{ letterSpacing: '0.2em' }}
            >
              AETHER CUTS
            </span>
          </button>

          {/* Breadcrumb */}
          {route.page !== 'home' && (
            <nav className="hidden md:flex items-center gap-2 text-sm text-white/40">
              <button
                onClick={() => onNavigate({ page: 'home' })}
                className="hover:text-white/70 transition-colors"
              >
                Home
              </button>
              {route.page === 'category' && (
                <>
                  <span>/</span>
                  <span className="text-white/70">{route.categorySlug.replace(/-/g, ' ')}</span>
                </>
              )}
              {route.page === 'title' && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => onNavigate({ page: 'category', categorySlug: route.categorySlug })}
                    className="hover:text-white/70 transition-colors capitalize"
                  >
                    {route.categorySlug.replace(/-/g, ' ')}
                  </button>
                  <span>/</span>
                  <span className="text-white/70">{route.titleSlug.replace(/-/g, ' ')}</span>
                </>
              )}
              {route.page === 'character' && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => onNavigate({ page: 'category', categorySlug: route.categorySlug })}
                    className="hover:text-white/70 transition-colors capitalize"
                  >
                    {route.categorySlug.replace(/-/g, ' ')}
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => onNavigate({ page: 'title', categorySlug: route.categorySlug, titleSlug: route.titleSlug })}
                    className="hover:text-white/70 transition-colors capitalize"
                  >
                    {route.titleSlug.replace(/-/g, ' ')}
                  </button>
                  <span>/</span>
                  <span className="text-white/70">{route.characterSlug.replace(/-/g, ' ')}</span>
                </>
              )}
            </nav>
          )}

          {/* Request Asset CTA */}
          <button
            onClick={onRequestAsset}
            className="relative group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(255,0,110,0.15))',
              border: '1px solid rgba(0,212,255,0.3)',
            }}
          >
            <span className="relative z-10">Request Asset</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(255,0,110,0.25))',
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
