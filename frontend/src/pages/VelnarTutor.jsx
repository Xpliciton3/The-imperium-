import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function VelnarTutor() {
  const { state, content } = useImperiumApp();

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Vel’nar tutor</h2>
        <p className='mt-2 text-sm text-stone-300'>Tutor-first architecture: reference audio, roots, grammar, tests, score tracking, and lesson unlocking. This build provides the shell and local scoring. Canon audio and live pronunciation scoring still need a deliberate implementation layer.</p>
      </section>

      <div className='grid gap-4 md:grid-cols-2'>
        {content.velnarLessons.map((lesson, index) => (
          <section key={lesson.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
            <p className='text-xs uppercase tracking-[0.2em] text-teal-400'>Lesson {index + 1}</p>
            <h3 className='mt-1 text-lg font-semibold'>{lesson.title}</h3>
            <p className='mt-2 text-sm text-stone-300'>{lesson.goal}</p>
            <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-stone-300'>
              {lesson.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            <div className='mt-4 rounded-2xl border border-neutral-800 p-3'>
              <p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Test</p>
              <p className='mt-1 text-sm text-stone-300'>{lesson.test}</p>
            </div>
            <div className='mt-4 flex flex-wrap gap-2'>
              <button className='rounded-full bg-teal-700 px-3 py-2 text-sm text-white'>Play reference audio</button>
              <button className='rounded-full border border-neutral-700 px-3 py-2 text-sm text-stone-300'>Record attempt</button>
              <button className='rounded-full border border-neutral-700 px-3 py-2 text-sm text-stone-300'>Take quiz</button>
            </div>
            <p className='mt-3 text-xs text-stone-500'>Saved score: {state.lessonScores[lesson.id] ?? 'Not scored yet'}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
