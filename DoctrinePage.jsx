import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function DoctrinePage() {
  const { content, state, setRecentDoctrine, toggleBookmark } = useImperiumApp();

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Doctrine</h2>
        <p className='mt-2 text-sm text-stone-300'>Doctrine should be frictionless to reach: from the main nav, from the planner, from holy days, and from emergency use. This page is the dedicated home for that access.</p>
        <div className='mt-3 flex flex-wrap gap-2'>
          <span className='rounded-full bg-red-950/60 px-3 py-1 text-xs text-red-200'>Emergency Litany</span>
          {state.doctrineBookmarks.map((entry) => (
            <span key={entry} className='rounded-full border border-teal-700 px-3 py-1 text-xs text-teal-200'>{entry}</span>
          ))}
        </div>
      </section>

      {content.doctrineLibrary.map((entry) => (
        <section key={entry.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h3 className='text-lg font-semibold'>{entry.title}</h3>
              <p className='mt-2 whitespace-pre-line text-sm text-teal-200'>{entry.quick || entry.emergency}</p>
            </div>
            <button onClick={() => toggleBookmark(entry.id)} className='rounded-full border border-neutral-700 px-3 py-2 text-xs text-stone-300'>Bookmark</button>
          </div>
          <div className='mt-4 grid gap-3 md:grid-cols-2'>
            <div className='rounded-2xl border border-neutral-800 p-3'>
              <p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Full text</p>
              <p className='mt-2 whitespace-pre-line text-sm text-stone-300'>{entry.full}</p>
            </div>
            <div className='rounded-2xl border border-neutral-800 p-3'>
              <p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Explanation</p>
              <p className='mt-2 text-sm text-stone-300'>{entry.explanation}</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {entry.related?.map((related) => <span key={related} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-stone-400'>{related}</span>)}
              </div>
            </div>
          </div>
          <button onClick={() => setRecentDoctrine(entry.id)} className='mt-3 rounded-full bg-teal-700 px-3 py-2 text-sm text-white'>Mark as recently opened</button>
        </section>
      ))}
    </div>
  );
}
