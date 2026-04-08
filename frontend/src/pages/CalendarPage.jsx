import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function CalendarPage() {
  const { state, content } = useImperiumApp();

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Calendar & holy days</h2>
        <p className='mt-2 text-sm text-stone-300'>The calendar holds daily planner context, holy-day reminders, and the rite timestamp once completed.</p>
        {state.riteCompletedAt && <p className='mt-3 text-sm text-teal-200'>Rite completed: {new Date(state.riteCompletedAt).toLocaleString()}</p>}
      </section>

      <div className='grid gap-4 md:grid-cols-2'>
        {content.holyDays.map((day) => (
          <section key={day.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
            <p className='text-xs uppercase tracking-[0.22em] text-teal-400'>{day.date}</p>
            <h3 className='mt-1 text-lg font-semibold'>{day.title}</h3>
            <p className='mt-1 text-sm text-stone-400'>{day.function}</p>
            <p className='mt-3 text-sm text-stone-300'>{day.meaning}</p>
            <div className='mt-3 rounded-2xl border border-neutral-800 p-3'>
              <p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Atmosphere</p>
              <p className='mt-1 text-sm text-stone-300'>{day.mood}</p>
            </div>
            <div className='mt-3 space-y-2'>
              <p className='text-sm font-medium text-stone-100'>Four lawful ways to observe</p>
              <ul className='list-disc space-y-1 pl-5 text-sm text-stone-300'>
                {day.lawfulWays.map((entry) => <li key={entry}>{entry}</li>)}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
