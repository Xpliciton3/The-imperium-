import React from 'react';
import { useImperiumApp } from '../lib/useImperiumApp';

function ListCard({ title, items, onToggle }) {
  return (
    <div className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <div className='mt-3 space-y-2'>
        {items.length === 0 && <p className='text-sm text-stone-400'>Nothing added yet.</p>}
        {items.map((item) => (
          <label key={item.id} className='flex items-start gap-3 rounded-2xl border border-neutral-800 p-3'>
            <input type='checkbox' checked={item.checked} onChange={() => onToggle(item.id)} className='mt-1' />
            <div>
              <p className='text-sm font-medium'>{item.name}</p>
              <p className='text-xs text-stone-400'>{item.quantity} · {item.sourceStatus}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function MealPlan() {
  const { state, content, addIngredient, toggleChecklist } = useImperiumApp();
  const week = content.mealWeeks[0];

  return (
    <div className='space-y-4'>
      <section className='rounded-3xl border border-teal-900/70 bg-neutral-900 p-4'>
        <h2 className='text-xl font-semibold'>Meals, groceries, and pantry</h2>
        <p className='mt-2 text-sm text-stone-300'>Pre-Rite is the right place to build the week’s grocery lists from the meal plan. Pantry staples and batch-cooking rules are shown up front.</p>
        <div className='mt-3 flex flex-wrap gap-2'>
          {week.pantryStaples.map((item) => <span key={item} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-stone-300'>{item}</span>)}
        </div>
      </section>

      {week.days.map((day) => (
        <section key={day.day} className='rounded-3xl border border-neutral-800 bg-neutral-900 p-4'>
          <h3 className='text-lg font-semibold'>{day.day}</h3>
          <div className='mt-4 space-y-4'>
            {day.meals.map((meal) => (
              <div key={`${day.day}-${meal.type}`} className='rounded-2xl border border-neutral-800 p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.2em] text-teal-400'>{meal.type}</p>
                    <h4 className='text-base font-semibold'>{meal.title}</h4>
                  </div>
                  <button className='rounded-full border border-neutral-700 px-3 py-2 text-xs text-stone-300'>Open recipe</button>
                </div>
                <div className='mt-3 space-y-2'>
                  {meal.ingredients.map((ingredient) => (
                    <div key={`${meal.title}-${ingredient.name}`} className='flex items-center justify-between gap-3 rounded-2xl border border-neutral-800 p-3'>
                      <div>
                        <p className='text-sm font-medium'>{ingredient.name}</p>
                        <p className='text-xs text-stone-400'>{ingredient.amount}</p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => addIngredient(ingredient, 'store')} className='rounded-full bg-teal-700 px-3 py-2 text-xs text-white'>+ Store List</button>
                        <button onClick={() => addIngredient(ingredient, 'online')} className='rounded-full border border-teal-700 px-3 py-2 text-xs text-teal-200'>+ Online List</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className='grid gap-4 md:grid-cols-2'>
        <ListCard title='Store checklist' items={state.storeList} onToggle={(id) => toggleChecklist('store', id)} />
        <ListCard title='Online checklist' items={state.onlineList} onToggle={(id) => toggleChecklist('online', id)} />
      </div>
    </div>
  );
}
