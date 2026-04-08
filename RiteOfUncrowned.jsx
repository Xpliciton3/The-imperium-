import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function RiteOfUncrowned() {
  const { state, readinessSummary, finalizeRite, markReadiness } = useImperiumApp();
  const [notes, setNotes] = React.useState('');

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Pre-Rite & rite record</h2>
        <p className='mt-2 text-sm text-stone-300'>Pre-Rite is the on-ramp. It builds skills, meal planning, groceries, doctrine familiarity, and foundational language before full tracking begins.</p>
      </section>

      <section className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
        <p className='text-xs uppercase tracking-[0.2em] text-teal-400'>Readiness</p>
        <h3 className='mt-1 text-3xl font-bold'>{readinessSummary.ratio}%</h3>
        <p className='mt-1 text-teal-200'>{readinessSummary.verdict}</p>
        <div className='mt-4 grid gap-3 md:grid-cols-2'>
          {state.readiness.map((item) => (
            <div key={item.name} className='rounded-2xl border border-neutral-800 p-3'>
              <p className='text-sm font-medium'>{item.name}</p>
              <div className='mt-3 flex flex-wrap gap-2 text-xs'>
                {['not-started', 'in-progress', 'review', 'complete'].map((status) => (
                  <button
                    key={status}
                    onClick={() => markReadiness(item.name, status, item.notes)}
                    className={`rounded-full px-3 py-1 ${item.status === status ? 'bg-teal-700 text-white' : 'border border-neutral-700 text-stone-300'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
        <h3 className='text-lg font-semibold'>Take the rite</h3>
        <p className='mt-2 text-sm text-stone-300'>When completed, the app should permanently save the date and exact time because it becomes an anchor date for anniversaries, planner logic, and progress timelines.</p>
        {state.riteCompletedAt ? (
          <div className='mt-3 rounded-2xl border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-200'>
            Rite completed: {new Date(state.riteCompletedAt).toLocaleString()} {state.riteNotes ? `· ${state.riteNotes}` : ''}
          </div>
        ) : (
          <>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder='Optional rite notes / vow / witness notes' className='mt-3 min-h-32 w-full rounded-2xl border border-neutral-800 bg-black/40 p-3 text-sm' />
            <button onClick={() => finalizeRite(notes)} className='mt-3 rounded-full bg-teal-700 px-4 py-2 text-sm text-white'>Record rite completion</button>
          </>
        )}
      </section>
    </div>
  );
}
