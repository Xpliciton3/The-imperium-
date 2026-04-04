# The Imperium - Product Requirements Document

## Overview
A comprehensive personal coaching and lifestyle app for the Sovereign Traditions system (INTJ cognitive architecture). Built as a single-user life guide with AI features, daily planning, martial arts tracking, ceremonial walkthroughs, language learning, and maximum-detail instructions for everything.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, MongoDB
- **AI**: Gemini 3 Flash (via Emergent LLM Key)
- **Speech**: Web Speech API (browser-native TTS/STT)

## Architecture
```
/app/backend/
├── server.py (FastAPI, MongoDB, Gemini endpoints)
├── data/
│   ├── ritual_preparations.py (Teas, oils, burning substances with detailed sourcing)
│   ├── shadow_and_values.py (Shadow chapters, moral architecture, cognitive functions)
│   ├── training_nutrition.py (Training regimen 4 phases, nutritional architecture)
│   ├── expanded_doctrines.py (6 full doctrines w/ Vel'nar, glossary, 8 additional meditations)
│   ├── meal_plan_full.py (30 complete recipes with ingredients/method/cost/tip + 30-day schedule)
│   └── velnar_language.py (Full language guide: root houses, grammar, script, stages)
/app/frontend/src/
├── App.js (15 routes)
├── components/ (Layout, DoctrinesPanel, ui/)
├── pages/ (15 pages)
```

## All Implemented Features

### Core (Session 1)
- [x] Dashboard with quick links, meal preview, streak display
- [x] Vel'nar AI Tutor (Gemini-powered conversational chat with voice TTS/STT)
- [x] Daily Planner (morning/evening practices, activity logging, hydration tracker, streak display)
- [x] Warrior Practices (Iaido, Kyudo, Systema, Throwing Daggers + workout logging with sets/reps/duration)
- [x] Rite of the Uncrowned (6-stage ceremony, prominent 24-hour fast warning, permanent record saving)
- [x] Meditations (16 types with detailed beginner walkthroughs)
- [x] Calendar page
- [x] Doctrines Quick Access Panel (full expanded text, Vel'nar forms, pronunciation, when-to-use, line-by-line)

### Session 2 (Tracking + New Sections)
- [x] MBTI Communication Translator (live chat AI, INTJ ↔ ESFJ default, 8 types)
- [x] Hydration Tracker (MongoDB persistent, +/- buttons, progress bar)
- [x] Streak Tracking (current/longest/total from MongoDB)
- [x] Workout Logging (sets/reps/duration per exercise, MongoDB)
- [x] Shadow Work (8 cognitive functions in Vel'nar, 5 shadow chapters with grip states, moral architecture with 8 values)
- [x] Training Regimen (4 phases: Foundation → Development → Strength → Built)
- [x] Nutritional Architecture (core principles, foods, supplements, sample day, hydration protocol)
- [x] Ritual Preparations (4 blends, 4 oils, 4 burning substances, ALL with detailed sourcing)
- [x] Glossary (5 categories: Beebe, Japanese, Vel'nar, Philosophical, Meditation)

### Session 3 (Full Content Depth)
- [x] 30-Day Meal Plan with 30 COMPLETE recipes (full ingredients, step-by-step method, cost per serving, batch tips, budget strategy, pantry staples)
- [x] Expanded Doctrines Panel (full text, short form, Vel'nar form with pronunciation guide, speaking guide, when-to-use, explanation, line-by-line breakdown for Litany)
- [x] Translator rebuilt as live chat interface (conversation history, copy to clipboard, settings panel)
- [x] Vel'nar Language Guide (6 root houses, 12 core roots, derivational markers, word order patterns, breath rules, 4 heart phrase categories, shadow lexicon, 5 rite phrase categories, 5-stage learning path, 3 script modes with inscription rules)
- [x] Dashboard fix: handles full recipe objects from updated API

## Upcoming / Backlog
- P1: Daily Walkthrough scheduler (step-by-step guided daily flow with ceremony scheduling)
- P2: LLM budget error handling (graceful "top up" message)
- P2: Progress visualization charts
- P3: Export/import data functionality
