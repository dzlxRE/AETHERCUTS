import { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RequestModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  'Movies', 'Video Games', 'Anime & Manga', 'Artists',
  'Actors', 'Models', 'Music', 'Images', 'Sound Effects',
];

export default function RequestModal({ onClose }: RequestModalProps) {
  const [form, setForm] = useState({
    category: '',
    title: '',
    character_name: '',
    description: '',
    contact_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.description.trim()) {
      setError('Please fill in the required fields.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('asset_requests').insert({
      category: form.category,
      title: form.title || null,
      character_name: form.character_name || null,
      description: form.description.trim(),
      contact_email: form.contact_email || null,
    });

    setLoading(false);
    if (dbError) {
      setError('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,20,0.98), rgba(15,15,28,0.98))',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 40px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]"
          style={{ background: 'rgba(0,212,255,0.04)' }}
        >
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Request an Asset</h2>
            <p className="text-xs text-white/40 mt-0.5">Tell us what you need and we'll add it to the vault</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="relative">
                <CheckCircle size={48} className="text-cyan-400" />
                <div className="absolute inset-0 blur-lg bg-cyan-400/30" />
              </div>
              <h3 className="text-lg font-bold text-white">Request Submitted!</h3>
              <p className="text-white/50 text-sm max-w-xs">
                Your request has been added to the queue. We'll review it and add the assets as soon as possible.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(255,0,110,0.2))',
                  border: '1px solid rgba(0,212,255,0.3)',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Category <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-cyan-400/60"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <option value="" className="bg-[#0a0a14]">Select a category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0a0a14]">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Title / Franchise
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Resident Evil, John Wick..."
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-cyan-400/60"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Character / Sub-topic
                </label>
                <input
                  type="text"
                  value={form.character_name}
                  onChange={(e) => setForm({ ...form, character_name: e.target.value })}
                  placeholder="e.g. Leon Kennedy, The Joker..."
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-cyan-400/60"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Description <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what kind of assets you need (scenepacks, voice lines, SFX, etc.)..."
                  rows={3}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all resize-none focus:border-cyan-400/60"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                  Contact Email (optional)
                </label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  placeholder="notify@example.com"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-cyan-400/60"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.3), rgba(255,0,110,0.3))',
                  border: '1px solid rgba(0,212,255,0.4)',
                }}
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
