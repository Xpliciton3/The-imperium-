# The Imperium - Product Requirements Document

## Overview
A comprehensive personal coaching and lifestyle app for the Sovereign Traditions system. Built for a single user (The Uncrowned / INTJ) as a life guide with AI-powered features, daily planning, martial arts tracking, ceremonial walkthroughs, and language learning.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, MongoDB
- **AI**: Gemini 3 Flash (via Emergent LLM Key)
- **Speech**: Web Speech API (browser-native TTS/STT)

## Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI, MongoDB, Gemini endpoints)
│   ├── data/
│   │   ├── ritual_preparations.py (Teas, oils, burning substances with sourcing)
│   │   ├── shadow_and_values.py (Shadow chapters, moral architecture, cognitive functions)
│   │   ├── training_nutrition.py (Training regimen 4 phases, nutritional architecture)
│   │   └── expanded_doctrines.py (Full doctrines w/ Vel'nar, glossary, additional meditations)
│   ├── requirements.txt
│   └── .env
├── frontend/src/
│   ├── App.js (14 routes)
│   ├── components/ (Layout, DoctrinesPanel, ui/)
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── VelnarTutor.jsx (AI chat with Gemini)
│   │   ├── Translator.jsx (AI MBTI communication translator)
│   │   ├── DailyPlanner.jsx (Daily practices, hydration tracker, streak display)
│   │   ├── ShadowWork.jsx (Cognitive functions, 5 shadow chapters, moral architecture)
│   │   ├── TrainingRegimen.jsx (4-phase physical training program)
│   │   ├── NutritionalArchitecture.jsx (Nutrition with foods, supplements, sample day)
│   │   ├── RitualPreparations.jsx (Teas, oils, burning substances with sourcing)
│   │   ├── GlossaryPage.jsx (5-category searchable glossary)
│   │   ├── MealPlan.jsx (30-day meal plan)
│   │   ├── WarriorPractices.jsx (Martial arts + workout logging)
│   │   ├── RiteOfUncrowned.jsx (24-hour fast warning + permanent record)
│   │   ├── Meditations.jsx (16 meditation types with detailed instructions)
│   │   └── CalendarPage.jsx
│   └── hooks/useLocalStorage.js
```

## Implemented Features (All Tested - Feb 2026)

### Core Features (Session 1)
- [x] Dashboard with quick links
- [x] Vel'nar AI Tutor (Gemini-powered conversational chat with voice TTS/STT)
- [x] Daily Planner (morning/evening practices, weekly sharpening, activity logging)
- [x] 30-Day Meal Plan with recipes
- [x] Warrior Practices (Iaido, Kyudo, Systema, Throwing Daggers with stage progression)
- [x] Rite of the Uncrowned (6-stage ceremony with permanent record saving to MongoDB)
- [x] Meditations (8 types with detailed beginner walkthroughs)
- [x] Calendar page
- [x] Doctrines Quick Access Panel (Litany line-by-line breakdown)

### Session 2 (Current) - All Passing 100%
- [x] **MBTI Communication Translator** (AI-powered via Gemini, INTJ ↔ ESFJ and 8 types)
- [x] **Hydration Tracker** (glasses counter, +/- buttons, progress bar, MongoDB persistent)
- [x] **Streak Tracking** (current streak, longest streak, total days from MongoDB)
- [x] **Workout Logging** (sets/reps/duration per exercise, stored in MongoDB)
- [x] **24-Hour Fast Warning** (prominent red box on Rite page with full explanation)
- [x] **Shadow Work page** (8 cognitive functions in Vel'nar, 5 shadow chapters with grip states, moral architecture with 8 values)
- [x] **Training Regimen page** (4 phases: Foundation → Development → Strength → Built, with exercises)
- [x] **Nutritional Architecture page** (Core principles, foods, supplements, sample day, hydration protocol)
- [x] **Ritual Preparations page** (4 sacred blends, 4 essential oils, 4 burning substances, ALL with detailed sourcing)
- [x] **Glossary page** (5 categories: Beebe Model, Japanese Martial Arts, Vel'nar Language, Philosophical, Meditation)
- [x] **Expanded Doctrines** (Full text, Vel'nar forms with pronunciation guides, when-to-use guidance)
- [x] **Additional Meditations** (8 new types: After-Action Stillness, Analytical Contemplation, Lectio Divina, Pre-Sleep Architecture Review, Dream Journaling, Progressive Muscle Relaxation, Sound & Frequency Work, Visualization)
- [x] App name "The Imperium" consistent throughout

## API Endpoints
- `POST /api/chat` - Vel'nar AI tutor
- `POST /api/translator/translate` - MBTI communication translator
- `GET /api/practices/daily` - Daily practices schedule
- `GET /api/warrior/practices` - Warrior practice data
- `GET /api/meals/plan` - 30-day meal plan
- `GET /api/rites/uncrowned` - Rite ceremony data
- `POST /api/rites/complete` - Save rite completion record
- `GET /api/meditations` - Meditation types
- `GET /api/practices/meditations/all` - All 16 meditations
- `GET /api/doctrines` - Doctrines data
- `GET /api/doctrines/expanded` - Full doctrines with Vel'nar
- `GET /api/shadow` - Shadow chapters
- `GET /api/moral-architecture` - 8 moral values
- `GET /api/cognitive-functions` - 8 functions in Vel'nar
- `GET /api/ritual-preparations` - Teas, oils, sourcing
- `GET /api/training-regimen` - 4-phase program
- `GET /api/nutritional-architecture` - Nutrition data
- `GET /api/glossary` - 5-category glossary
- `POST /api/tracking/hydration` - Log water intake
- `GET /api/tracking/hydration/{date}` - Get hydration for date
- `POST /api/tracking/workout` - Log workout (sets/reps)
- `GET /api/tracking/workouts` - Recent workouts
- `POST /api/tracking/activity` - Log daily activity (for streaks)
- `GET /api/tracking/streak` - Get streak stats

## Integrations
- **Gemini 3 Flash** via Emergent LLM Key (chat tutor + translator)

## Upcoming / Backlog Tasks
- P1: Daily Walkthrough scheduler (step-by-step guided daily flow with ceremony scheduling)
- P2: LLM budget error handling (graceful "top up" message when budget depleted)
- P2: Progress visualization charts
- P3: Export/import data functionality
- P3: Auto-delete data based on retention settings synced to backend
