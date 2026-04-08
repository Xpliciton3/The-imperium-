import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, CalendarDays, Flame, Home, Languages, ScrollText, Sword } from 'lucide-react';
import { useImperiumApp } from '../lib/useImperiumApp';

const nav = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/doctrine', label: 'Doctrine', icon: ScrollText },
  { to: '/meals', label: 'Meals', icon: Flame },
  { to: '/tutor', label: 'Vel’nar', icon: Languages },
  { to: '/warrior', label: 'Warrior', icon: Sword },
  { to: '/glossary', label: 'Glossary', icon: BookOpen },
];

export default function Layout() {
  const location = useLocation();
  const { state } = useImperiumApp();

  return (
    <div className='min-h-screen bg-neutral-950 text-stone-100'>
      <header className='sticky top-0 z-20 border-b border-teal-800/60 bg-black/90 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
          <div>
            <p className='text-xs uppercase tracking-[0.28em] text-teal-400'>The Imperium</p>
            <h1 className='text-lg font-semibold text-stone-100'>Uncrowned Operating System</h1>
          </div>
          <div className='rounded-full border border-teal-700 px-3 py-1 text-xs text-teal-200'>
            {state.phase === 'pre-rite' ? 'Pre-Rite mode' : 'Post-Rite mode'}
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 pb-28 pt-4'>
        <Outlet />
      </main>

      <nav className='fixed inset-x-0 bottom-0 z-20 border-t border-teal-800/60 bg-black/95 pb-safe'>
        <div className='mx-auto grid max-w-6xl grid-cols-4 gap-2 px-2 py-2 sm:grid-cols-7'>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] ${
                  active ? 'bg-teal-900/60 text-teal-200' : 'text-stone-400'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
