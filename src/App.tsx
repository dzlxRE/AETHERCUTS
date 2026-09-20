import { useState } from 'react';
import MouseGlow from '@/components/MouseGlow';
import Header from '@/components/Header';
import RequestModal from '@/components/RequestModal';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import TitlePage from '@/pages/TitlePage';
import CharacterPage from '@/pages/CharacterPage';
import type { Route } from '@/lib/types';

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [showRequestModal, setShowRequestModal] = useState(false);

  const navigate = (next: Route) => {
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ background: '#050508' }}
    >
      <MouseGlow />

      <div className="relative z-10">
        <Header
          route={route}
          onNavigate={navigate}
          onRequestAsset={() => setShowRequestModal(true)}
        />

        <main>
          {route.page === 'home' && (
            <HomePage
              onNavigate={navigate}
              onRequestAsset={() => setShowRequestModal(true)}
            />
          )}
          {route.page === 'category' && (
            <CategoryPage
              categorySlug={route.categorySlug}
              onNavigate={navigate}
            />
          )}
          {route.page === 'title' && (
            <TitlePage
              categorySlug={route.categorySlug}
              titleSlug={route.titleSlug}
              onNavigate={navigate}
            />
          )}
          {route.page === 'character' && (
            <CharacterPage
              categorySlug={route.categorySlug}
              titleSlug={route.titleSlug}
              characterSlug={route.characterSlug}
              onNavigate={navigate}
            />
          )}
        </main>

        {/* Footer */}
        <footer
          className="border-t border-white/[0.04] py-10 px-6 text-center"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-sm font-bold tracking-widest text-white/30"
              style={{ letterSpacing: '0.2em' }}
            >
              AETHER CUTS
            </p>
            <p className="text-xs text-white/15">
              The Ultimate Vault for Scenepacks, Voice Lines & SFX
            </p>
            <p className="text-xs text-white/15">
              &copy; {new Date().getFullYear()} Aether Cuts. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
}
