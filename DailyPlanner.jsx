import React from 'react';
import { Link } from 'react-router-dom';
import { useImperiumApp } from '../lib/useImperiumApp';

export default function DailyPlanner() {
  const { state, content, markPlannerStep, updateAlarm } = useImperiumApp();
  const steps = content.plannerTemplates[state.phase];
  const todayLogs = state.plannerLogs[new Date().toISOString().slice(0, 10)] || [];

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Daily planner</h2>
        <p className='mt-2 text-sm text-stone-300'>This planner walks the day, not just displays pages. In Pre-Rite mode it trains into the system. In Post-Rite mode it runs the full day.</p>
      </section>

      {steps.map((step, index) => {
        const complete = todayLogs.includes(step.id);
        return (
          <section key={step.id} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-xs uppercase tracking-[0.24em] text-teal-400'>Step {index + 1}</p>
                <h3 className='text-lg font-semibold'>{step.title}</h3>
                <p className='text-sm text-stone-400'>{step.duration} min · {step.category}</p>
              </div>
              <button
                onClick={() => markPlannerStep(step.id)}
                className={`rounded-full px-3 py-2 text-sm ${complete ? 'bg-emerald-900 text-emerald-200' : 'bg-teal-700 text-white'}`}
              >
                {complete ? 'Completed' : 'Mark complete'}
              </button>
            </div>
            <div className='mt-3 flex flex-wrap gap-2 text-sm'>
              {step.link && <Link className='rounded-full border border-teal-700 px-3 py-2 text-teal-200' to={step.link}>Open instructions</Link>}
              <button className='rounded-full border border-neutral-700 px-3 py-2 text-stone-300'>Start timer</button>
              <button className='rounded-full border border-neutral-700 px-3 py-2 text-stone-300'>Set alarm</button>
              <button className='rounded-full border border-neutral-700 px-3 py-2 text-stone-300'>Add note</button>
            </div>
          </section>
        );
      })}

      <section className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
          <h3 className='text-lg font-semibold'>Alarm preview</h3>
          <div className='mt-3 space-y-2'>
            {state.alarms.map((alarm) => (
              <div key={alarm.id} className='flex items-center justify-between rounded-2xl border border-neutral-800 p-3'>
                <div>
                  <p className='text-sm font-medium'>{alarm.label}</p>
                  <p className='text-sm text-stone-400'>{alarm.time}</p>
                </div>
                <button
                  onClick={() => updateAlarm(alarm.id, { enabled: !alarm.enabled })}
                  className={`rounded-full px-3 py-1 text-xs ${alarm.enabled ? 'bg-teal-700 text-white' : 'bg-neutral-700 text-stone-300'}`}
                >
                  {alarm.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
          <p className='mt-3 text-xs text-stone-500'>Hook the buttons to Notifications / calendar APIs later. Browser alarm reliability depends on final deployment.</p>
        </div>
        <div className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
          <h3 className='text-lg font-semibold'>Planner rules</h3>
          <ul className='mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300'>
            <li>Every step can open instructions, show full text, start a timer, and log completion.</li>
            <li>Pre-Rite focuses on preparation, not pressure.</li>
            <li>Post-Rite starts formal tracking after the rite timestamp is recorded.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
