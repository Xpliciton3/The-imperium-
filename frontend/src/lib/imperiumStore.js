import { doctrineLibrary, glossaryTerms, holyDays, mealWeeks, plannerTemplates, readinessCategories, velnarLessons, warriorTracks } from '../data/imperiumData';

const STORAGE_KEY = 'imperium-app-state-v2';

const todayISO = () => new Date().toISOString().slice(0, 10);

const defaultReadiness = readinessCategories.map((name) => ({
  name,
  status: 'not-started',
  notes: '',
}));

export const defaultState = {
  phase: 'pre-rite',
  riteCompletedAt: '',
  riteNotes: '',
  doctrineBookmarks: ['oath', 'litany'],
  recentDoctrine: ['litany'],
  storeList: [],
  onlineList: [],
  plannerLogs: {},
  notes: {},
  readiness: defaultReadiness,
  lessonScores: {},
  alarms: [
    { id: 'morning-practice', label: 'Morning practice', time: '06:00', enabled: true },
    { id: 'tea', label: 'Tea', time: '06:30', enabled: false },
    { id: 'litany-close', label: 'Litany / Close', time: '20:30', enabled: true },
  ],
  calendarEvents: holyDays.map((day) => ({
    id: day.id,
    title: day.title,
    dateKey: day.date,
    type: 'holy-day',
  })),
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addIngredientToList(state, ingredient, target) {
  const listKey = target === 'online' ? 'onlineList' : 'storeList';
  const existing = state[listKey].find((item) => item.name === ingredient.name);
  if (existing) {
    existing.quantity = ingredient.amount || existing.quantity;
    existing.checked = false;
  } else {
    state[listKey].push({
      id: `${target}-${ingredient.name}`,
      name: ingredient.name,
      quantity: ingredient.amount || '',
      checked: false,
      onlineAvailable: Boolean(ingredient.onlineAvailable),
      sourceStatus: target === 'online'
        ? ingredient.onlineAvailable ? 'Found online' : 'Online source not checked yet'
        : 'Store item',
    });
  }
  return { ...state, [listKey]: [...state[listKey]] };
}

export function toggleChecklistItem(state, target, id) {
  const listKey = target === 'online' ? 'onlineList' : 'storeList';
  return {
    ...state,
    [listKey]: state[listKey].map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
  };
}

export function updateReadiness(state, categoryName, status, notes = '') {
  return {
    ...state,
    readiness: state.readiness.map((item) =>
      item.name === categoryName ? { ...item, status, notes } : item
    ),
  };
}

export function getReadinessSummary(state) {
  const weights = { complete: 1, 'in-progress': 0.6, review: 0.35, 'not-started': 0 };
  const score = state.readiness.reduce((sum, item) => sum + (weights[item.status] ?? 0), 0);
  const ratio = Math.round((score / state.readiness.length) * 100);
  const blockedBy = state.readiness.filter((item) => item.status === 'not-started').map((item) => item.name);
  let verdict = 'Not Ready';
  if (ratio >= 85 && blockedBy.length <= 1) verdict = 'Rite-Ready';
  else if (ratio >= 70) verdict = 'Nearly Ready';
  else if (ratio >= 45) verdict = 'Developing';
  return { ratio, verdict, blockedBy };
}

export function logPlannerStep(state, stepId) {
  const today = todayISO();
  const logs = { ...state.plannerLogs };
  logs[today] = logs[today] || [];
  if (!logs[today].includes(stepId)) logs[today].push(stepId);
  return { ...state, plannerLogs: logs };
}

export function completeRite(state, notes = '') {
  const completedAt = new Date().toISOString();
  return {
    ...state,
    phase: 'post-rite',
    riteCompletedAt: completedAt,
    riteNotes: notes,
  };
}

export const staticContent = {
  doctrineLibrary,
  glossaryTerms,
  holyDays,
  mealWeeks,
  plannerTemplates,
  velnarLessons,
  warriorTracks,
};
