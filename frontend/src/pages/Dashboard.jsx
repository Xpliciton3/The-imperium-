import React from 'react';
import { Link } from 'react-router-dom';
import { useImperiumApp } from '../lib/useImperiumApp';

function Card({ title, children, action }) {
  return (
    <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4 shadow-[0_0_0_1px_rgba(13,148,136,0.12)]'>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <h2 className='text-lg font-semibold text-stone-100'>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const { state, content, readinessSummary } = useImperiumApp();
  const steps = content.plannerTemplates[state.phase] || [];
  const todayLogs = state.plannerLogs[new Date().toISOString().slice(0, 10)] || [];
  const progress = steps.length > 0 ? Math.round((todayLogs.length / steps.length) * 100) : 0;

  return (
    <div className='space-y-4'>
      <Card
        title='Today spine'
        action={<Link className='text-sm text-teal-300' to='/planner'>Open planner</Link>}
      >
        <p className='mb-3 text-sm text-stone-300'>
          The app should always answer what comes next, why it matters, how long it takes, and where to tap to begin.
        </p>
        <div className='mb-3 h-3 overflow-hidden rounded-full bg-neutral-800'>
          <div className='h-full rounded-full bg-teal-500' style={{ width: `${progress}%` }} />
        </div>
        <p className='text-sm text-stone-400'>
          {todayLogs.length} of {steps.length} steps completed today.
        </p>
      </Card>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card title='Pre-Rite readiness' action={<Link className='text-sm text-teal-300' to='/rite'>Open rite</Link>}>
          <p className='text-3xl font-bold text-stone-100'>{readinessSummary.ratio}%</p>
          <p className='mt-1 text-sm text-teal-200'>{readinessSummary.verdict}</p>
          <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-stone-300'>
            {readinessSummary.blockedBy.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card title='Doctrine quick access' action={<Link className='text-sm text-teal-300' to='/doctrine'>Doctrine</Link>}>
          <div className='space-y-2'>
            {content.doctrineLibrary.map((entry) => (
              <div key={entry.id} className='rounded-2xl border border-neutral-800 p-3'>
                <p className='text-sm font-medium text-stone-100'>{entry.title}</p>
                <p className='mt-1 text-sm text-stone-400'>{entry.quick || entry.emergency}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card title='Meals & grocery'>
          <p className='text-sm text-stone-300'>
            Dual checklists are built in: one for store runs, one for online items.
          </p>
          <p className='mt-3 text-sm text-stone-400'>
            Store list: {state.storeList.length} items · Online list: {state.onlineList.length} items
          </p>
        </Card>

        <Card title='Vel’nar tutor'>
          <p className='text-sm text-stone-300'>
            Audio-first lesson structure, pronunciation notes, tests, and score tracking live here.
          </p>
          <Link className='mt-3 inline-block text-sm text-teal-300' to='/tutor'>Open tutor</Link>
        </Card>

        <Card title='Warrior path'>
          <p className='text-sm text-stone-300'>
            Beginner-to-expert structure, defined terms, stance pages, and blade-practice logs are here.
          </p>
          <Link className='mt-3 inline-block text-sm text-teal-300' to='/warrior'>Open warrior practice</Link>
        </Card>
      </div>
    </div>
  );
}
