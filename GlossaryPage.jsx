import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function GlossaryPage() {
  const { content } = useImperiumApp();

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Glossary & definitions</h2>
        <p className='mt-2 text-sm text-stone-300'>Nothing in the app should assume prior knowledge. If a page uses a term, the term should be defined here and eventually be tappable anywhere it appears.</p>
      </section>

      <div className='grid gap-4 md:grid-cols-2'>
        {content.glossaryTerms.map((term) => (
          <section key={term.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
            <p className='text-xs uppercase tracking-[0.2em] text-teal-400'>{term.category}</p>
            <h3 className='mt-1 text-lg font-semibold'>{term.term}</h3>
            <p className='mt-2 text-sm text-teal-200'>{term.plain}</p>
            <p className='mt-3 whitespace-pre-line text-sm text-stone-300'>{term.full}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
