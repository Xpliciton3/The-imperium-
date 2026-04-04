# The Imperium - Product Requirements Document

## Original Problem Statement
Build a comprehensive app for "The Imperium" / "The Uncrowned" - a personal sovereignty system including:
- Vel'nar language learning with AI tutor and pronunciation (local/free preferred)
- Daily planner with practices (Morning Sovereignty Declaration, Evening Inventory)
- 30-day meal plan with recipes and shopping lists
- Warrior practices (Iaido, Kyudo, Systema, Throwing Daggers) progression tracking
- Rites and ceremonies tracking (Rite of the Uncrowned)
- Calendar functionality
- Meditation/contemplative practices
- Challenge coin link after completing rite (challengecoins4less.com)
- Checklists for traditions and tests

## User Choices
- Conversational AI: Gemini 3 Flash for conversational tutoring
- Voice: Web Speech API for pronunciation practice (free, browser-based)
- Design: Dark, contemplative aesthetic
- Auth: Single user (localStorage only, no authentication)
- Logo: Feather pen with crossed swords seal uploaded by user

## User Personas
- Single practitioner of The Uncrowned traditions
- Learning Vel'nar constructed language
- Following structured daily/weekly practices
- Tracking warrior arts progression
- Preparing for or having completed Rite of the Uncrowned

## Core Requirements (Static)
1. Vel'nar Language Tutor with 6-level course structure
2. Gemini-powered conversational AI for language learning
3. Web Speech API for pronunciation input/output
4. Daily Planner with morning/evening practice checklists
5. Activity logging with auto-delete by timeframe
6. Commitment tracking
7. 30-day meal plan with recipes
8. 4 warrior practices with stage progression
9. Rite of the Uncrowned walkthrough (6 stages)
10. Challenge coin link to challengecoins4less.com
11. Meditation timer with practice selection
12. Calendar with event management
13. localStorage persistence for all progress

## What's Been Implemented (January 2026)
- [x] Full-stack React + FastAPI application
- [x] Custom logo (feather/swords seal) in sidebar and dashboard
- [x] Vel'nar Language Tutor with 6-level course (Initiate to Master)
- [x] Gemini 3 Flash conversational AI integration
- [x] Web Speech API for voice input/output
- [x] Daily Planner with Morning/Evening practices
- [x] Activity Log with type filtering
- [x] Commitments tracking
- [x] Data retention settings (auto-delete 7/14/30/90/365 days or never)
- [x] Quick Links to other sections
- [x] 30-day meal plan with recipe dialogs
- [x] 4 warrior practices with 4-5 stage progression
- [x] Rite of the Uncrowned (6 stages) with challenge coin link
- [x] Meditation timer with 8 meditation types
- [x] Calendar with event creation and management
- [x] Dark contemplative UI theme
- [x] MongoDB backend with comprehensive API endpoints

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- Increase LLM budget for more conversational AI interactions
- Add workout tracking integration with activity log

### P2 (Nice to Have)
- Export/import data functionality
- Streak tracking for daily practices
- Progress visualization/charts
- Rite repetition history tracking
- Shopping list generator from meal plan

## Next Tasks
1. Test Gemini chat with increased budget
2. Add ability to track workout details (sets, reps, duration)
3. Add streak counter for consecutive practice days
4. Add progress visualization for warrior practices
