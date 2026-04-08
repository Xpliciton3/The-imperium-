# Imperium upgrade bundle

This bundle is a front-end upgrade set for `Xpliciton3/The-imperium-`.

What it adds:
- Pre-Rite and Post-Rite mode handling
- Rite timestamp recording
- Readiness progress and verdict logic
- Today spine / guided planner shell
- Doctrine page with quick access and emergency-litany orientation
- Meal plan ingredient buttons for `+ Store List` and `+ Online List`
- Dual grocery checklists with local persistence
- Holy-day calendar cards
- Glossary/definition layer with deep explanation for terms like `seiza`
- Warrior practice progression structure
- Vel'nar tutor shell with lesson/test layout
- PWA manifest starter

Honest limits of this build:
- It uses local storage for persistence, not your FastAPI/Mongo backend yet.
- Alarm buttons are UI placeholders until browser notification/calendar wiring is added.
- Live pronunciation scoring and canonical audio still need a dedicated audio pipeline.

Suggested merge path:
1. Replace the listed frontend files in your repo.
2. Keep your backend as-is for now.
3. Run the app and confirm routes.
4. Wire the local state to backend endpoints in the next pass.
