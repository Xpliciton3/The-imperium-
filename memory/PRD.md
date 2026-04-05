# The Imperium - Product Requirements Document

## Overview
Comprehensive personal coaching and lifestyle app for the Sovereign Traditions system (INTJ). Single-user life guide with AI features, daily planning, martial arts tracking, ceremonial walkthroughs, language learning, and maximum-detail instructions for everything.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, MongoDB
- **AI**: Gemini 3 Flash (via Emergent LLM Key)
- **Speech**: Web Speech API (browser-native TTS/STT)

## Architecture
```
/app/backend/
├── server.py
├── data/
│   ├── warrior_practices_full.py (4 disciplines, 5 stages each, detailed skill instructions)
│   ├── meal_plan_full.py (30 recipes with ingredients/method/cost/tip + 30-day schedule)
│   ├── ritual_preparations.py (4 blends, 4 oils, 4 burning substances with sourcing)
│   ├── shadow_and_values.py (Shadow chapters, moral architecture, cognitive functions)
│   ├── training_nutrition.py (4-phase training, nutritional architecture)
│   ├── expanded_doctrines.py (6 doctrines w/ Vel'nar, glossary, additional meditations)
│   └── velnar_language.py (Root houses, grammar, script, 5-stage learning path)
/app/frontend/src/pages/ (15 pages)
```

## All Implemented Features (All Tested 100%)

### Content with Full Detail
- [x] **Warrior Practices** — 4 disciplines (Iaido, Kyudo, Systema, Throwing Daggers), each with:
  - Philosophy and description
  - Equipment with sourcing and care instructions
  - 4-5 stages with expandable skill blocks
  - Each skill has: what it is, numbered how-to-do-it steps, common mistakes, progression, beginner notes, safety warnings, key principles
  - Requirements checklist (toggleable)
  - Workout logging (sets/reps/duration, stored in MongoDB)

- [x] **30-Day Meal Plan** — 30 full recipes with:
  - Complete ingredient lists, step-by-step method, cost per serving, prep time, serving count, tips
  - Week-by-week navigation (5 weeks)
  - All Recipes tab (categorized by meal type)
  - Strategy tab (batch cooking, budget tips, pantry staples)

- [x] **Expanded Doctrines** — 6 doctrines each with:
  - Full text, short form, Vel'nar form with pronunciation guide
  - Speaking guide, when-to-use, explanation
  - Line-by-line breakdown (Litany)
  - Speak button (TTS)

- [x] **Vel'nar Language Guide** — 8-tab comprehensive guide:
  - 6 root houses (color-coded), 12 core roots with audio
  - Sound rules (vowels, consonants, stress/pace)
  - Formation (derivational markers, word order patterns, breath rules, laws)
  - Heart phrases (4 categories), Shadow lexicon (8 roots)
  - Rite phrases (5 categories), 5-stage learning path, 3 script modes

### AI Features
- [x] **Vel'nar AI Tutor** (Gemini-powered conversational chat with TTS/STT)
- [x] **Live Chat MBTI Translator** (8 types, direction toggle, conversation history)

### Tracking
- [x] Hydration Tracker (MongoDB, +/- buttons, progress bar)
- [x] Streak Tracking (current/longest/total from MongoDB)
- [x] Workout Logging (sets/reps/duration, MongoDB)
- [x] Daily Planner (morning/evening practices, activity log)

### Other Pages
- [x] Shadow Work (8 cognitive functions, 5 shadow chapters, moral architecture)
- [x] Training Regimen (4 phases with exercises)
- [x] Nutritional Architecture (foods, supplements, sample day, hydration protocol)
- [x] Ritual Preparations (teas, oils, burning substances with detailed sourcing)
- [x] Glossary (5 searchable categories)
- [x] Rite of the Uncrowned (24-hour fast warning, permanent record)
- [x] Meditations (16 types with beginner walkthroughs)
- [x] Calendar
- [x] Dashboard

## Upcoming / Backlog
- P1: Daily Walkthrough scheduler (step-by-step guided daily flow)
- P2: LLM budget graceful error handling
- P2: Progress visualization charts
- P3: Export/import data
