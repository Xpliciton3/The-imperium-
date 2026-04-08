import React from 'react';
import {
  addIngredientToList,
  clearCheckedItems,
  completeRite,
  defaultState,
  getReadinessSummary,
  loadState,
  logPlannerStep,
  removeChecklistItem,
  saveState,
  staticContent,
  toggleChecklistItem,
  updateReadiness,
} from './imperiumStore';

const ImperiumContext = React.createContext(null);

export function ImperiumProvider({ children }) {
  const [state, setState] = React.useState(defaultState);

  React.useEffect(() => {
    setState(loadState());
  }, []);

  React.useEffect(() => {
    saveState(state);
  }, [state]);

  const api = React.useMemo(
    () => ({
      state,
      content: staticContent,
      readinessSummary: getReadinessSummary(state),
      addIngredient: (ingredient, target) => setState((prev) => addIngredientToList({ ...prev }, ingredient, target)),
      toggleChecklist: (target, id) => setState((prev) => toggleChecklistItem(prev, target, id)),
      removeChecklistItem: (target, id) => setState((prev) => removeChecklistItem(prev, target, id)),
      clearChecked: (target) => setState((prev) => clearCheckedItems(prev, target)),
      markReadiness: (name, status, notes) => setState((prev) => updateReadiness(prev, name, status, notes)),
      markPlannerStep: (stepId) => setState((prev) => logPlannerStep(prev, stepId)),
      setPhase: (phase) => setState((prev) => ({ ...prev, phase })),
      finalizeRite: (notes) => setState((prev) => completeRite(prev, notes)),
      setRecentDoctrine: (id) =>
        setState((prev) => ({
          ...prev,
          recentDoctrine: [id, ...prev.recentDoctrine.filter((entry) => entry !== id)].slice(0, 5),
        })),
      toggleBookmark: (id) =>
        setState((prev) => ({
          ...prev,
          doctrineBookmarks: prev.doctrineBookmarks.includes(id)
            ? prev.doctrineBookmarks.filter((entry) => entry !== id)
            : [...prev.doctrineBookmarks, id],
        })),
      updateAlarm: (id, patch) =>
        setState((prev) => ({
          ...prev,
          alarms: prev.alarms.map((alarm) => (alarm.id === id ? { ...alarm, ...patch } : alarm)),
        })),
    }),
    [state]
  );

  return <ImperiumContext.Provider value={api}>{children}</ImperiumContext.Provider>;
}

export function useImperiumApp() {
  const ctx = React.useContext(ImperiumContext);
  if (!ctx) throw new Error('useImperiumApp must be used inside ImperiumProvider');
  return ctx;
}
