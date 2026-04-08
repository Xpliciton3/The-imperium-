import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function WarriorPractices() {
  const { content } = useImperiumApp();
  const seiza = content.glossaryTerms.find((term) => term.id === 'seiza');

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Warrior & blade practice</h2>
        <p className='mt-2 text-sm text-stone-300'>Every specialized term should be defined. Every movement page should show quick form, full explanation, mistakes, safety notes, and progression from beginner to expert.</p>
      </section>

      <section className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
        <h3 className='text-lg font-semibold'>{seiza.term}</h3>
        <p className='mt-2 text-sm text-teal-200'>{seiza.plain}</p>
        <p className='mt-3 whitespace-pre-line text-sm text-stone-300'>{seiza.full}</p>
        <div className='mt-4 rounded-2xl border border-neutral-800 p-3'>
          <p className='text-sm font-medium'>Common mistakes</p>
          <ul className='mt-2 list-disc pl-5 text-sm text-stone-300'>
            {seiza.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
          </ul>
        </div>
      </section>

      {content.warriorTracks.map((track) => (
        <section key={track.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
          <h3 className='text-lg font-semibold'>{track.title}</h3>
          <p className='mt-2 text-sm text-stone-300'>{track.purpose}</p>
          <div className='mt-4 grid gap-3 md:grid-cols-3'>
            {track.stages.map((stage) => (
              <div key={stage.stage} className='rounded-2xl border border-neutral-800 p-3'>
                <p className='text-sm font-semibold text-teal-200'>{stage.stage}</p>
                <p className='mt-2 text-sm text-stone-300'>{stage.focus}</p>
                <ul className='mt-3 list-disc pl-5 text-sm text-stone-300'>
                  {stage.drills.map((drill) => <li key={drill}>{drill}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button className='rounded-full bg-teal-700 px-3 py-2 text-sm text-white'>Start timer</button>
            <button className='rounded-full border border-neutral-700 px-3 py-2 text-sm text-stone-300'>Log session</button>
            <button className='rounded-full border border-neutral-700 px-3 py-2 text-sm text-stone-300'>After-action review</button>
          </div>
        </section>
      ))}
    </div>
  );
}
