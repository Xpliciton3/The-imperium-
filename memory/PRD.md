# The Imperium - Product Requirements Document

## Original Problem Statement
Build a comprehensive app for "The Imperium" / "The Uncrowned" - a personal sovereignty system including:
- Vel'nar language learning with conversational AI tutor (Gemini Live style)
- Structured course from beginner to expert with phrase explanations
- Daily planner with links to practices, recipes, workouts
- Activity logging with auto-delete by timeframe
- 30-day meal plan with recipes
- Warrior practices progression tracking
- Rite of the Uncrowned with permanent record keeping
- Quick access to Doctrines (especially the Litany)
- Extremely detailed instructions for complete beginners
- Challenge coin link after completing rite

## User Choices
- Conversational AI: Gemini 3 Flash for tutoring
- Voice: Web Speech API for pronunciation (free, browser-based)
- Design: Dark, contemplative aesthetic
- Auth: Single user (localStorage + MongoDB for permanent records)
- Logo: Feather pen with crossed swords seal

## What's Been Implemented (January 2026)

### Core Features
- [x] Full-stack React + FastAPI + MongoDB application
- [x] Custom logo throughout the app
- [x] Vel'nar Language Tutor with 6-level course (Initiate to Master)
- [x] Gemini 3 Flash conversational AI integration
- [x] Web Speech API for voice input/output
- [x] Daily Planner with Morning/Evening practices
- [x] Activity Log with type filtering and auto-delete
- [x] Commitments tracking
- [x] Data retention settings (7/14/30/90/365 days or never)
- [x] Quick Links between sections
- [x] 30-day meal plan with recipe dialogs
- [x] 4 warrior practices with stage progression
- [x] Rite of the Uncrowned (6 stages) with PERMANENT database record
- [x] Meditation timer with 8 types
- [x] Calendar with event management

### Detailed Instructions (Beginner-Focused)
- [x] All meditations have step-by-step beginner instructions
- [x] All meditations explain "Why we do this"
- [x] Rite page shows "Before You Begin" with preparation requirements
- [x] All Rite stages show detailed instructions
- [x] Warrior practices have stage-by-stage requirements

### Doctrines Quick Access
- [x] "The Doctrines" button in sidebar
- [x] Quick-access panel with all 7 doctrines
- [x] The Axiom with Vel'nar translation
- [x] The Oath with explanation
- [x] The Creed with explanation
- [x] The Litany with LINE-BY-LINE breakdown
- [x] The Covenant with explanation
- [x] The Manifesto with explanation
- [x] The Four-Word Form with explanation
- [x] Audio playback for all doctrines

### Permanent Rite Record
- [x] Rite completions stored in MongoDB permanently
- [x] Inscription capture at Stage 5
- [x] Completion history viewable
- [x] Total completions counter
- [x] First/last completion dates tracked

## Prioritized Backlog

### P1 (Important)
- Increase LLM budget for more AI conversations
- Add workout detail tracking (sets, reps, duration)

### P2 (Nice to Have)
- Export/import data functionality
- Streak tracking for consecutive practice days
- Progress visualization charts
- Shopping list generator from meal plan

## Next Tasks
1. Add workout detail logging
2. Add streak counter for daily practices
3. Consider adding progress visualization
