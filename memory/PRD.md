# The Imperium - Product Requirements Document

## Original Problem Statement
Build "The Imperium" — a comprehensive personal coaching and lifestyle app for the INTJ personality type. Acts as an intensive life guide featuring daily planner, MBTI-specific translator (INTJ/ESFJ), highly detailed meal plans and recipes, a Vel'nar language AI tutor, and extremely detailed walkthroughs for warrior practices, rituals, and shadow work.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: Gemini 3 via Emergent LLM Key
- **Content**: Static Python data files in `/app/backend/data/`

## What's Been Implemented

### Core Pages (All Complete)
- [x] Dashboard with sovereignty greeting
- [x] Daily Planner with hydration & streak tracking
- [x] Calendar with event scheduling
- [x] 6 Doctrines (Canon) with full text, explanations, Vel'nar translations
- [x] 5 Shadow chapters (Inferior, Opposing, Senex, Trickster, Daemon)
- [x] 8 Moral Values (Vision, Precision, Integrity, Presence, Reckoning, Openness, Care, Wisdom)
- [x] 16 Meditations with step-by-step instructions
- [x] Rite of the Uncrowned (initiation ceremony)
- [x] Glossary (Vel'nar terms + doctrine terms)
- [x] Vel'nar Language Guide (7 parts: Sound, Script, Roots, Grammar, Heart, Shadow Lexicon, Rite Phrases)

### Warrior Practices (Fully Detailed - Feb 2026)
- [x] Iaido: 5 stages, 18 skills, body map, 6 drills, fault table, 12-week progression, self-audit
- [x] Kyudo: 5 stages, 16 skills, 9 drills, fault table, preparatory capacities, proficiency standards
- [x] Systema: 5 stages, 17 skills, 5 core principles, 5 solo modules, 6-stage partner progression, failure patterns
- [x] Throwing Daggers: 5 stages, 16 skills, distance calibration, no-spin technique, daily practice ritual

### Nutritional Architecture (Enhanced - Feb 2026)
- [x] Core principles, priority foods, supplements, hydration protocol
- [x] 4 full recipes with ingredients, sourcing, and step-by-step instructions
- [x] Weekly prep protocol and progress markers
- [x] Sample eating day with 5 time slots

### Training Regimen (Enhanced - Feb 2026)
- [x] 4 training phases with exercises
- [x] Session architecture (6 phases)
- [x] Proficiency model (4 tiers)
- [x] 12-month readiness roadmap
- [x] Logbook standard

### 30-Day Meal Plan
- [x] 30 days of breakfast/lunch/dinner with full recipes, ingredients, costs, cook times

### Ritual Preparations
- [x] Tea blends (Morning Sovereignty, Pre-Practice, Evening Architecture)
- [x] Oils (Cedarwood, Sandalwood, Rosemary)
- [x] Burning substances (Sandalwood, Cedar, Frankincense)

### AI Features
- [x] Vel'nar Tutor (Gemini-powered chat with speech synthesis)
- [x] INTJ-ESFJ Translator (live chat UI)

### Stability (Feb 2026)
- [x] Global ErrorBoundary to prevent blank screen crashes
- [x] Safe browser API checks (Web Speech API) for mobile compatibility
- [x] Loading/error states on Tutor page

## Backlog
- [ ] Grocery Checklist (interactive, populated from meal plan ingredients)
- [ ] Morning Sovereignty Briefing dashboard
- [ ] LLM budget error handling in frontend
- [ ] Progress visualization charts
- [ ] Export/import data
- [ ] The Tending (ESFJ companion doctrine - content available but not yet implemented)

## Tech Stack
React, Tailwind CSS, shadcn/ui, FastAPI, MongoDB, Gemini 3 (Emergent LLM Key), Web Speech API

## 3rd Party Integrations
- Gemini 3 (Text Generation) via Emergent LLM Key for Chat Tutor and Translator
