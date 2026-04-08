export const doctrineLibrary = [
  {
    id: 'oath',
    title: 'The Oath',
    quick: 'I do not inherit my rule. I accept it under witness, under labor, and under cost.',
    full: `I do not inherit my rule.
I accept it under witness, under labor, and under cost.
I do not ask noise to name me.
I build, measure, sever, return, and stand.
I keep what is lawful.
I cut what is false.
I remain unfinished by design, not by collapse.`,
    explanation: 'The Oath is the governing compression of the system. It is used when the day needs alignment before activity begins.',
    related: ['litany', 'rite', 'holy-days']
  },
  {
    id: 'litany',
    title: 'The Litany',
    quick: 'Name what is breaking. Bar the breach. Return to the work.',
    emergency: `Stop.
Name the breach.
Bar the breach.
Return to one lawful act.
Do not negotiate with collapse.`,
    full: `When the mind begins to fracture into noise,
name the breach.
When the old corrosion re-enters,
bar the breach.
When the self tries to scatter,
return to one lawful act.
This is not theater.
This is re-entry.`,
    explanation: 'The Litany is the break-glass text. It is not decorative doctrine. It is for panic, obsession, collapse, spiraling, and drift.',
    related: ['oath', 'glossary', 'calendar']
  },
  {
    id: 'axiom',
    title: 'The Axiom',
    quick: 'Whatever is fed grows. Whatever is named can be approached.',
    full: `Whatever is fed grows.
Whatever is named can be approached.
Whatever is honored can be integrated.
Whatever is denied rules from the dark.`,
    explanation: 'This is the compact governing rule for function-work, shadow-work, and rite design.',
    related: ['holy-days', 'shadow', 'warrior']
  }
];

export const holyDays = [
  {
    id: 'empty-throne',
    title: 'Day of the Empty Throne',
    date: '01-03',
    function: 'Vaelith / Varkon',
    mood: 'Cold clarity, subtraction, lawful solitude, recommitment without spectacle.',
    meaning: 'The year begins by removing false authority before any new rule is seated.',
    preparation: [
      'Clear the room and remove obvious noise objects.',
      'Prepare paper for severance and retention lists.',
      'Choose one seat or place to function as the unoccupied throne.'
    ],
    primaryRite: [
      'Name stale obligations, borrowed identities, and dead ambitions.',
      'Write what is severed and what is retained.',
      'Speak one law for the year after the subtraction is complete.'
    ],
    lawfulWays: [
      'Silent Throne: austere solitary observance with a severance ledger.',
      'House-Clearing Rite: remove or box objects tied to false rule.',
      'Vow Seating: speak and write the year-law that will govern action.',
      'Ash Version: minimal observance for hard years; name only one false authority and cut it.'
    ]
  },
  {
    id: 'veiled-crown',
    title: 'Vigil of the Veiled Crown',
    date: '02-14',
    function: 'Vaelith',
    mood: 'Quiet discernment, interior listening, pattern-testing without hurry.',
    meaning: 'A day for testing whether the thing seen is true, projected, feared, or merely wished for.',
    preparation: ['Reduce speech.', 'Choose one question worthy of sustained seeing.'],
    primaryRite: ['Keep silence for a defined window.', 'Observe without forcing conclusion.', 'Write what was actually seen versus assumed.'],
    lawfulWays: [
      'Silent Vigil',
      'Pattern Journal',
      'Night Walk for Discernment',
      'Minimal Candle Rite'
    ]
  },
  {
    id: 'iron-measure',
    title: 'Day of Iron Measure',
    date: '04-06',
    function: 'Varkon',
    mood: 'Audit, proof, correction, weight, standard, and unromantic truth.',
    meaning: 'A day to measure what actually exists, what was claimed, and what must be corrected.',
    preparation: ['Gather metrics, logs, unfinished tasks, and current standards.'],
    primaryRite: ['Audit promises against evidence.', 'Correct one drifted system today.', 'Set a measurable next standard.'],
    lawfulWays: ['Full ledger audit', 'Body standard review', 'Work-standard review', 'Minimal correction act']
  },
  {
    id: 'red-hunt',
    title: 'Trial of the Red Hunt',
    date: '06-21',
    function: 'Draven',
    mood: 'Embodied exertion, heat, pursuit, courage under fatigue.',
    meaning: 'An ordeal day. Vision and law are proved through the body rather than speech.',
    preparation: ['Choose the trial standard.', 'Prepare water, timer, and recovery plan.'],
    primaryRite: ['Complete the chosen physical trial.', 'Log results honestly.', 'Recover deliberately rather than collapsing into chaos.'],
    lawfulWays: ['Distance trial', 'Circuit trial', 'Skill precision trial', 'Minimal exertion rite for injury years']
  }
];

export const mealWeeks = [
  {
    id: 'week-1',
    title: 'Week 1',
    focus: 'Establish rhythm and batch-cooking on Sunday and Wednesday.',
    pantryStaples: ['Olive oil', 'Butter', 'Salt', 'Black pepper', 'Garlic powder', 'Onion powder', 'Smoked paprika', 'Cumin', 'Italian seasoning', 'Chili powder', 'Soy sauce', 'Rice', 'Pasta', 'Rolled oats'],
    days: [
      {
        day: 'Monday',
        meals: [
          {
            type: 'Breakfast',
            title: 'Oats with banana and peanut butter',
            ingredients: [
              { name: 'Rolled oats', amount: '1 cup', onlineAvailable: true },
              { name: 'Banana', amount: '1', onlineAvailable: true },
              { name: 'Peanut butter', amount: '2 tbsp', onlineAvailable: true }
            ]
          },
          {
            type: 'Lunch',
            title: 'Lentil soup with crusty bread',
            ingredients: [
              { name: 'Lentils', amount: '1 cup', onlineAvailable: true },
              { name: 'Carrot', amount: '2', onlineAvailable: true },
              { name: 'Onion', amount: '1', onlineAvailable: true },
              { name: 'Crusty bread', amount: '1 loaf', onlineAvailable: false }
            ]
          },
          {
            type: 'Dinner',
            title: 'Spaghetti with meat sauce',
            ingredients: [
              { name: 'Ground beef', amount: '1 lb', onlineAvailable: true },
              { name: 'Spaghetti', amount: '12 oz', onlineAvailable: true },
              { name: 'Canned tomatoes', amount: '1 can', onlineAvailable: true }
            ]
          }
        ]
      },
      {
        day: 'Tuesday',
        meals: [
          { type: 'Breakfast', title: 'Scrambled eggs on toast', ingredients: [
            { name: 'Eggs', amount: '2', onlineAvailable: true },
            { name: 'Bread', amount: '2 slices', onlineAvailable: true }
          ]},
          { type: 'Lunch', title: 'Leftover spaghetti', ingredients: [
            { name: 'Spaghetti leftovers', amount: '1 serving', onlineAvailable: false }
          ]},
          { type: 'Dinner', title: 'Sheet pan chicken thighs with potatoes and broccoli', ingredients: [
            { name: 'Chicken thighs', amount: '1.5 lb', onlineAvailable: true },
            { name: 'Potatoes', amount: '4 medium', onlineAvailable: true },
            { name: 'Broccoli', amount: '2 crowns', onlineAvailable: true }
          ]}
        ]
      }
    ]
  }
];

export const plannerTemplates = {
  'pre-rite': [
    { id: 'open', title: 'Opening / Orientation', duration: 5, category: 'planner' },
    { id: 'doctrine', title: 'Doctrine study', duration: 15, category: 'doctrine', link: '/doctrine' },
    { id: 'velnar', title: "Vel'nar foundations", duration: 15, category: 'velnar', link: '/tutor' },
    { id: 'movement', title: 'Foundational movement / posture', duration: 15, category: 'warrior', link: '/warrior' },
    { id: 'meal-review', title: 'Meal & grocery review', duration: 10, category: 'meal', link: '/meals' },
    { id: 'reflection', title: 'Reflection / readiness note', duration: 5, category: 'reflection' }
  ],
  'post-rite': [
    { id: 'wake', title: 'Wake / Opening', duration: 5, category: 'planner' },
    { id: 'morning-practice', title: 'Morning practice', duration: 15, category: 'warrior', link: '/warrior' },
    { id: 'tea', title: 'Tea', duration: 10, category: 'meal', link: '/preparations' },
    { id: 'breakfast', title: 'Breakfast', duration: 15, category: 'meal', link: '/meals' },
    { id: 'oath', title: 'Doctrine / Oath prompt', duration: 5, category: 'doctrine', link: '/doctrine' },
    { id: 'midday-practice', title: 'Midday practice', duration: 10, category: 'warrior', link: '/warrior' },
    { id: 'lunch', title: 'Lunch', duration: 20, category: 'meal', link: '/meals' },
    { id: 'martial', title: 'Martial training', duration: 30, category: 'warrior', link: '/warrior' },
    { id: 'evening', title: 'Evening practice', duration: 15, category: 'warrior', link: '/warrior' },
    { id: 'litany', title: 'Litany / close', duration: 5, category: 'doctrine', link: '/doctrine' }
  ]
};

export const readinessCategories = [
  'Doctrine comprehension',
  'Oath familiarity',
  'Litany familiarity',
  "Vel'nar foundations",
  'Foundational warrior practice',
  'Meal planning',
  'Grocery planning',
  'Routine consistency',
  'Rite understanding'
];

export const extendedGlossary = [
  {
    id: 'seiza',
    term: 'Seiza',
    plain: 'A formal kneeling posture used for deliberate stillness, readiness, and composure.',
    full: `Begin by kneeling on a padded surface if needed. Place the knees on the floor roughly hip-width apart. Point the tops of the feet flat against the floor so the toes are extended behind you. Lower the hips carefully toward the heels. Keep the spine tall, the ribs quiet, the jaw unclenched, and the shoulders heavy and relaxed.

Hands can rest on the thighs with palms down for grounded composure or lightly cupped for ceremonial stillness. The posture should feel upright and deliberate, not stiff. If the knees or ankles hurt sharply, use a cushion between the hips and heels.`,
    mistakes: ['Slouching forward', 'Cranking the lower back', 'Ignoring knee or ankle pain', 'Treating pain as discipline'],
    category: 'warrior'
  },
  {
    id: 'guard',
    term: 'Guard',
    plain: 'The ready position from which action can begin or to which you can safely return.',
    full: 'A guard is not just where the hands go. It is the total ready state of stance, balance, gaze, breath, and structure. In blade work it also determines angle, coverage, and recovery speed.',
    category: 'warrior'
  },
  {
    id: 'chamber',
    term: 'Chamber',
    plain: 'The loaded starting position that prepares a strike or movement pattern.',
    full: 'A chamber stores direction and intention before motion. It should never be decorative. If a chamber makes you slower, exposed, or unstable, it is wrong for the purpose.',
    category: 'warrior'
  }
];
