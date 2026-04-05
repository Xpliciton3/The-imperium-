TRAINING_REGIMEN = {
    "philosophy": {
        "title": "Strength, Conditioning, and the Body as Instrument",
        "principle": "The sovereign self that neglects the body is a mind living in a deteriorating structure. The body is not separate from the doctrine. It is the infrastructure through which the doctrine operates.",
        "pillars": [
            {"name": "Strength", "description": "The physical embodiment of the Axiom — power built from within."},
            {"name": "Conditioning", "description": "The body under controlled stress — Se integration and grip prevention."},
            {"name": "Skill", "description": "Iaido and Kyudo — which develop Se, Ni, Te, and Fi simultaneously."}
        ]
    },
    "session_architecture": {
        "description": "Every training session follows this structure regardless of the discipline being practiced.",
        "phases": [
            {"phase": "Arrive and Orient", "duration": "2 minutes", "instructions": "Quiet standing or seated breathing. Name the purpose of the session in one sentence."},
            {"phase": "Joint Preparation", "duration": "3 minutes", "instructions": "Neck gentle range, shoulders, wrists, hips, knees, ankles, and trunk wake-up work."},
            {"phase": "Pattern Rehearsal", "duration": "Variable", "instructions": "Practice the day's forms or drills at the easiest quality-preserving level."},
            {"phase": "Focused Block", "duration": "Variable", "instructions": "Choose one technical variable only: line, grip, breath, timing, foot placement, recovery, or release."},
            {"phase": "Integration Block", "duration": "Variable", "instructions": "Combine elements into short uninterrupted sequences."},
            {"phase": "Cool-Down and Logging", "duration": "5 minutes", "instructions": "Down-regulate breath, note faults, write next session's single correction."}
        ]
    },
    "proficiency_model": [
        {"tier": "Novice", "description": "Learns positions, names, sequence, and safety. Needs frequent pauses.", "priority": "Shape, vocabulary, safe handling, slow reps"},
        {"tier": "Apprentice", "description": "Performs short blocks consistently at slow speed with fewer gross errors.", "priority": "Consistency, correction, breath, transitions"},
        {"tier": "Practitioner", "description": "Maintains form under light fatigue and can self-correct in real time.", "priority": "Durability, diagnostic ability, rhythm"},
        {"tier": "Advanced Practitioner", "description": "Integrates technical work with pressure, tempo changes, and mixed demands.", "priority": "Adaptation, economy, composure, scenario use"}
    ],
    "twelve_month_roadmap": [
        {"months": "1-3", "focus": "Shape, safety, and honest logging. Learn to set posture, breathe on purpose, perform low-complexity repetitions, and leave each session with one clear correction. Impatience is the main enemy."},
        {"months": "4-6", "focus": "Repeatability. Film regularly. Compare takes. Demand that the first repetition and the fifth look like they came from the same nervous system. Strength and aerobic work should now be consistent enough that technical sessions feel physically supported."},
        {"months": "7-9", "focus": "Pressure without panic. Add longer uninterrupted sequences, mild threshold drills, slightly longer expansion holds, and transitions between arts. Preserving line when the task becomes less convenient."},
        {"months": "10-12", "focus": "Expression through simplicity. Explain the basic purpose of each form, perform them without theatrics, recover from minor errors without emotional derailment, and use the logbook to self-correct with increasing maturity."}
    ],
    "logbook_standard": "After every session, record: date, session type, one technical focus, what improved, one fault identified, and next session's correction target. The logbook is the primary driver for intelligent practice and self-correction.",
    "phases": [
        {
            "phase": 1,
            "name": "Foundation",
            "duration": "Weeks 1-12",
            "subtitle": "Learning to Move",
            "description": "Bodyweight only. No barbells required. The purpose is movement quality, joint health, and the habit of training.",
            "completion_criteria": "Push-ups, rows, and squats can each be performed for 3x15 with clean form.",
            "exercises": [
                {"name": "Push: Wall Push-Ups to Push-Ups", "sets": 3, "reps": "10-15", "notes": "Progress from wall to incline to full push-ups"},
                {"name": "Pull: Bodyweight Rows / Dead Hangs to Negative Pull-Ups", "sets": 3, "reps": "8-10", "notes": "Use a bar or table edge for rows"},
                {"name": "Squat: Goblet Squat to Bodyweight Squat", "sets": 3, "reps": "15", "notes": "Depth: hip crease below knee"},
                {"name": "Hinge: Hip Hinge with Dowel Rod", "sets": 3, "reps": "15", "notes": "Learn the hinge pattern before loading"},
                {"name": "Core: Plank", "sets": 3, "reps": "30-60 sec", "notes": "Full body contraction, not passive hold"},
                {"name": "Core: Dead Bug", "sets": 3, "reps": "10 each side", "notes": "Lower back stays pressed to floor"},
                {"name": "Conditioning: Walking", "sets": 1, "reps": "30-45 min", "notes": "3 sessions per week"}
            ]
        },
        {
            "phase": 2,
            "name": "Development",
            "duration": "Weeks 13-28",
            "subtitle": "First Loaded Work",
            "description": "Introduces barbells and external load. The weight is not the point — the movement is the point. Three days per week, non-consecutive.",
            "completion_criteria": "Comfortable with barbell movements, consistent form under moderate load.",
            "days": [
                {
                    "day": "A",
                    "name": "Push and Core",
                    "exercises": [
                        {"name": "Bench Press", "sets": 3, "reps": "10"},
                        {"name": "Overhead Press", "sets": 3, "reps": "10"},
                        {"name": "Push-Ups", "sets": 3, "reps": "12"},
                        {"name": "Plank", "sets": 3, "reps": "60 sec"},
                        {"name": "Dead Bug", "sets": 3, "reps": "10 each side"}
                    ]
                },
                {
                    "day": "B",
                    "name": "Pull and Hinge",
                    "exercises": [
                        {"name": "Deadlift", "sets": 3, "reps": "5"},
                        {"name": "Dumbbell Row", "sets": 3, "reps": "10"},
                        {"name": "Lat Pulldown", "sets": 3, "reps": "10"},
                        {"name": "Face Pulls", "sets": 3, "reps": "15"}
                    ]
                },
                {
                    "day": "C",
                    "name": "Legs and Conditioning",
                    "exercises": [
                        {"name": "Goblet Squat", "sets": 3, "reps": "12"},
                        {"name": "Romanian Deadlift", "sets": 3, "reps": "10"},
                        {"name": "Walking Lunges", "sets": 3, "reps": "12 each leg"},
                        {"name": "HIIT", "sets": 6, "reps": "30s on / 90s off"}
                    ]
                }
            ]
        },
        {
            "phase": 3,
            "name": "Strength",
            "duration": "Week 29 Onward",
            "subtitle": "The Full Program",
            "description": "Six active days, one full rest. Push/pull/legs split. Conditioning on two days. Warrior's Practice integrated.",
            "completion_criteria": "Ongoing. Progress to Phase 4 when linear progression stalls.",
            "days": [
                {
                    "day": "1",
                    "name": "Push Strength (Chest/Shoulders/Triceps)",
                    "exercises": [
                        {"name": "Barbell Bench Press", "sets": 4, "reps": "5"},
                        {"name": "Overhead Press", "sets": 4, "reps": "5"},
                        {"name": "Incline Dumbbell Press", "sets": 3, "reps": "10"},
                        {"name": "Lateral Raises", "sets": 3, "reps": "15"},
                        {"name": "Tricep Dips", "sets": 3, "reps": "10-12"},
                        {"name": "Face Pulls", "sets": 3, "reps": "15"}
                    ]
                },
                {
                    "day": "2",
                    "name": "Conditioning A",
                    "exercises": [
                        {"name": "HIIT", "sets": 8, "reps": "30s max effort / 90s rest", "notes": "Rowing, Assault Bike, or Running"}
                    ]
                },
                {
                    "day": "3",
                    "name": "Pull Strength (Back/Biceps)",
                    "exercises": [
                        {"name": "Conventional Deadlift", "sets": 4, "reps": "5"},
                        {"name": "Weighted Pull-Ups", "sets": 4, "reps": "6-8"},
                        {"name": "Barbell Row", "sets": 3, "reps": "8"},
                        {"name": "Single-Arm Row", "sets": 3, "reps": "10 each"},
                        {"name": "Hammer Curls", "sets": 3, "reps": "12"},
                        {"name": "Band Pull-Aparts", "sets": 3, "reps": "20"}
                    ]
                },
                {
                    "day": "4",
                    "name": "Conditioning B / Active Recovery",
                    "exercises": [
                        {"name": "Steady State Cardio", "sets": 1, "reps": "30-45 min", "notes": "Walking, cycling, or swimming"},
                        {"name": "Mobility Work", "sets": 1, "reps": "20 min", "notes": "Hip flexors, thoracic spine, shoulders"}
                    ]
                },
                {
                    "day": "5",
                    "name": "Legs and Core",
                    "exercises": [
                        {"name": "Barbell Back Squat", "sets": 4, "reps": "5"},
                        {"name": "Bulgarian Split Squat", "sets": 3, "reps": "10 each leg"},
                        {"name": "Leg Press", "sets": 3, "reps": "12"},
                        {"name": "Plank", "sets": 3, "reps": "60 sec"},
                        {"name": "Hollow Body Hold", "sets": 3, "reps": "30 sec"},
                        {"name": "Pallof Press", "sets": 3, "reps": "12 each side"}
                    ]
                },
                {
                    "day": "6",
                    "name": "Weekly Physical Threshold",
                    "exercises": [
                        {"name": "Demanding session", "sets": 1, "reps": "Variable", "notes": "Loaded carry circuit, long run, cold immersion, open water, manual labor — choose the harder option"}
                    ]
                },
                {
                    "day": "7",
                    "name": "Complete Rest",
                    "exercises": [
                        {"name": "Walking Meditation", "sets": 1, "reps": "30 min"},
                        {"name": "Pre-Sleep Architecture Review", "sets": 1, "reps": "10 min"}
                    ]
                }
            ]
        },
        {
            "phase": 4,
            "name": "Built",
            "duration": "Year Two and Beyond",
            "subtitle": "Advanced Periodization",
            "description": "When linear progression stalls. Introduces deload weeks (every 4th week: all weights reduced 40-50%), wave loading (3 weeks increasing followed by deload), and specialization blocks (8-12 weeks additional volume on a priority movement).",
            "completion_criteria": "Ongoing lifelong practice.",
            "principles": [
                "The Uncrowned who deloads consistently builds more strength over a year than one who does not.",
                "By Phase Four, the Iaido and Kyudo practices are not integrated into the training — they ARE the training."
            ]
        }
    ]
}

NUTRITIONAL_ARCHITECTURE = {
    "title": "The Nutritional Architecture",
    "subtitle": "Eating to Think — Fueling the Mind That Builds",
    "philosophy": "The brain consumes approximately twenty percent of the body's energy. The quality of the substrate directly determines the quality of the function it produces.",
    "core_principles": [
        {
            "name": "Cognitive Sovereignty",
            "rule": "Eat to Think",
            "description": "Every nutritional choice is evaluated against a single criterion: does this support sustained cognitive performance?"
        },
        {
            "name": "Anti-Inflammatory Default",
            "rule": "Reduce systemic inflammation",
            "description": "Prioritize omega-3 fatty acids, polyphenols, fiber. Minimize ultra-processed foods, refined sugar, excess seed oils."
        },
        {
            "name": "Time-Restricted Eating",
            "rule": "16:8 Protocol",
            "description": "All food within an 8-hour window (noon to 8pm recommended). Morning practices performed fasted. The Morning Sovereignty Blend does not break the fast."
        },
        {
            "name": "Protein Priority",
            "rule": "0.7-1g per pound bodyweight",
            "description": "Beyond muscle: amino acids are precursors to neurotransmitters. Adequate protein directly contributes to the neurochemical environment."
        },
        {
            "name": "Gut-Brain Axis",
            "rule": "Gut health is brain health",
            "description": "70% of serotonin is produced in the gut. Fermented foods daily. Prebiotic fiber daily. Bone broth 2-3x per week."
        }
    ],
    "foods_to_support": [
        "Fatty fish (salmon, sardines, mackerel) — EPA/DHA omega-3s",
        "Eggs — choline",
        "Leafy greens (spinach, kale) — vitamin K, lutein, folate, BDNF",
        "Berries (blueberries) — polyphenols, neuroplasticity",
        "Dark chocolate (70%+) — flavonoids, cerebral blood flow",
        "Avocados and olive oil — monounsaturated fats, anti-inflammatory",
        "Walnuts and seeds — omega-3 precursors, vitamin E",
        "Fermented foods (kimchi, kefir, sauerkraut) — gut-brain axis",
        "Bone broth — gut lining integrity",
        "Tart cherry juice — recovery and sleep quality",
        "Sweet potato, quinoa, brown rice — complex carbohydrates"
    ],
    "foods_to_minimize": [
        "Ultra-processed foods (more than five ingredients, artificial additives)",
        "Refined sugar and high-fructose corn syrup",
        "Excessive seed oils (soybean, corn, sunflower, canola)",
        "Alcohol — reduces prefrontal cortex activity, disrupts REM sleep",
        "Excessive caffeine after 2pm — elevates cortisol, disrupts sleep"
    ],
    "supplement_stack": {
        "core": [
            {"name": "Omega-3 (EPA + DHA)", "dose": "2-3g daily", "purpose": "Anti-inflammatory, cognitive support"},
            {"name": "Vitamin D3 with K2", "dose": "2,000-5,000 IU D3, 100-200mcg K2", "purpose": "Immune, bone, mood support"},
            {"name": "Magnesium Glycinate", "dose": "300-400mg evening", "purpose": "Sleep quality, nervous system recovery"},
            {"name": "Creatine Monohydrate", "dose": "5g daily", "purpose": "Cognitive and physical performance"}
        ],
        "conditional": [
            {"name": "Zinc", "dose": "15-30mg", "condition": "If dietary intake insufficient"},
            {"name": "L-Theanine", "dose": "100-200mg", "condition": "Paired with caffeine (2:1 ratio)"},
            {"name": "Ashwagandha (KSM-66 or Sensoril)", "dose": "300-600mg", "condition": "Periods of sustained high cognitive demand"}
        ]
    },
    "sample_day": {
        "title": "Sample Eating Day — Training Day",
        "meals": [
            {
                "time": "Fasting Window (8pm to 12pm)",
                "items": ["500ml water upon waking", "Morning Sovereignty Blend (does not break fast)", "Morning training (fasted)"]
            },
            {
                "time": "First Meal — 12pm",
                "items": ["Protein: 4-6oz salmon or 4 whole eggs", "Leafy greens with olive oil and lemon", "Complex carb: half to one cup sweet potato or quinoa", "Half avocado", "Fermented food: kimchi, sauerkraut, or kefir"]
            },
            {
                "time": "Afternoon — 3-4pm",
                "items": ["Mixed nuts (walnuts, almonds, Brazil nuts)", "1-2oz dark chocolate (70%+)", "Optional protein shake if training was demanding"]
            },
            {
                "time": "Final Meal — 7-8pm",
                "items": ["Protein: 6-8oz lean meat, poultry, or fish", "Vegetables: 2 cups roasted or steamed", "Complex carb on training days", "Bone broth (2-3x/week)", "Tart cherry juice (200-300ml training days)", "Magnesium glycinate after meal"]
            },
            {
                "time": "Evening",
                "items": ["No eating after final meal", "Evening Architecture Blend", "Fasting window re-initiates at 8pm"]
            }
        ]
    },
    "recipes": [
        {
            "name": "Lemon Salmon with Greens and Sweet Potato",
            "meal": "First Meal — 12pm",
            "ingredients": ["4 to 6 ounces salmon fillet", "1 teaspoon olive oil", "1/4 to 1/2 lemon", "Pinch of kosher salt", "Pinch of black pepper", "1 to 2 cups spinach, arugula, or kale", "1/2 medium sweet potato", "1/2 avocado", "Fermented food on the side: kimchi, sauerkraut, or kefir"],
            "sourcing": "Salmon from seafood counter or freezer; olive oil from pantry aisle; lemon and greens from produce; avocado from produce; sweet potato from produce; fermented foods from refrigerated natural foods section or international aisle.",
            "instructions": [
                "Sweet potato: Wash and dry. Pierce several times with a fork. Roast at 400F on a sheet pan for 40 to 55 minutes until a knife slides in without resistance. Or microwave: pierce, wrap in a damp paper towel, and cook on high 5 to 8 minutes until soft. Cut open and set aside.",
                "Salmon: Pat dry. Rub with olive oil, salt, pepper, and lemon juice. Place on a parchment-lined sheet pan or skillet. Bake at 400F for 12 to 15 minutes until opaque and flaky but not dry; or pan-sear skin-side down in a hot skillet with 1 teaspoon oil for 4 minutes, flip, and cook 3 more minutes.",
                "Greens: If using spinach or arugula, serve raw and dress with 1 teaspoon olive oil plus a squeeze of lemon. If using kale, massage raw leaves with a pinch of salt and olive oil for 30 seconds until they soften; or sauté briefly in a hot pan with a drop of oil.",
                "Assembly: Place greens on the plate first, then salmon, then sweet potato, then avocado slices, then the fermented item on the side. Eat the protein first."
            ]
        },
        {
            "name": "Four-Egg Cognitive Plate",
            "meal": "First Meal — 12pm (alternate)",
            "ingredients": ["4 whole eggs", "1 teaspoon butter or olive oil", "1 to 2 cups spinach", "1/2 cup cooked quinoa or brown rice", "1/2 avocado", "Salt, pepper", "Optional fresh parsley or chive"],
            "sourcing": "Eggs and butter in dairy; olive oil and grains in pantry aisle; spinach, avocado, and parsley in produce.",
            "instructions": [
                "Cook quinoa or rice in advance for the week according to package directions, or use a plain microwave cup.",
                "Heat a skillet over medium heat. Add butter or oil. Crack in the eggs and cook to your preference — scrambled slowly over low-medium heat stays softer and more digestible; over-easy or sunny-side-up keeps the yolk liquid, which preserves more choline.",
                "Warm the quinoa briefly in the microwave or alongside the eggs in a corner of the pan.",
                "Plate: quinoa base, spinach alongside (raw or briefly wilted in the egg pan), eggs on top, avocado sliced beside, salt, pepper, herbs. Eat the eggs first."
            ]
        },
        {
            "name": "Controlled Recovery Snack",
            "meal": "Afternoon — 3 to 4pm",
            "ingredients": ["1 ounce mixed nuts or pumpkin seeds", "1 to 2 ounces dark chocolate 70% or higher", "Optional protein shake with water or unsweetened milk"],
            "sourcing": "Nuts and seeds in bulk bins, baking aisle, or snack aisle; dark chocolate in candy or natural foods section; protein powder in supplements or natural foods.",
            "instructions": [
                "Portion the nuts and chocolate into a bowl or container rather than eating from the original package.",
                "If using a protein shake, add one scoop of protein to cold water or unsweetened almond/oat milk and shake or blend.",
                "Eat the protein component first if using the shake, then the nuts, then the chocolate. This is a bridge, not a second meal."
            ]
        },
        {
            "name": "Lean Protein, Roasted Vegetables, and Broth",
            "meal": "Final Meal — 7 to 8pm",
            "ingredients": ["6 to 8 ounces chicken breast, thigh, lean beef, turkey, white fish, or salmon", "2 cups vegetables: broccoli, carrots, Brussels sprouts, cauliflower, zucchini, peppers, or sweet potato", "1 tablespoon avocado oil or olive oil", "Salt, pepper, garlic powder", "1 cup bone broth", "Optional: half cup rice, quinoa, or roasted potato on training days", "Optional: 200-300ml tart cherry juice"],
            "sourcing": "Proteins from meat or seafood counters; vegetables from produce or freezer section; avocado oil from pantry aisle; bone broth from soup aisle, refrigerated section, or homemade.",
            "instructions": [
                "Roasting vegetables: Heat oven to 425F. Cut vegetables into similar-size pieces so they cook evenly. Toss with oil, salt, pepper, and garlic powder on a sheet pan. Spread in a single layer. Roast 20 to 30 minutes, turning once, until edges are browned and centers are tender.",
                "Protein: Chicken breast bakes at 400F for 20 to 25 minutes; thighs 25 to 35; white fish 12 to 15; salmon 12 to 15; lean beef pan-sears in a hot skillet 3 to 4 minutes per side for medium. Rest the meat 5 minutes before cutting.",
                "Bone broth: Heat 1 cup gently on the stove or microwave until hot. Add a pinch of salt, black pepper, and optionally a tiny piece of fresh ginger or turmeric.",
                "Assembly: Protein on one side, vegetables covering most of the plate, starch if included, broth in a separate cup to sip between bites. Eat protein first, then vegetables, then starch if included."
            ]
        }
    ],
    "weekly_prep_protocol": "Once per week: buy proteins, greens, root vegetables, fruit, fermented support foods, and pantry items in one run. Cook at least one tray of roasted vegetables and one batch of grain or root vegetable so weekday assembly takes 10 to 15 minutes per meal. Pre-portion snack containers with nuts and chocolate. If using bone broth, buy pre-made or prepare a batch on a rest day by simmering bones, water, apple cider vinegar, and aromatics for 12 to 24 hours, then strain and refrigerate or freeze in single-serving containers.",
    "progress_markers": [
        "Week 1: Complete one full grocery run from the sourcing guide and prepare at least two recipes exactly as written.",
        "Week 4: All four recipes prepared without referencing the instructions. Meal timing and fasting window consistent five or more days per week.",
        "Week 8: Energy between meals is stable. No blood sugar crashes. Cognitive clarity during morning fasting window is noticeably better than baseline.",
        "Week 12: Consistent meal prep. Supplements taken daily. Body composition and training performance both improving."
    ],
    "hydration": {
        "formula": "Body weight in pounds divided by 2, in ounces daily (minimum)",
        "note": "Dehydration of 2% body weight measurably impairs working memory, attention, and executive function.",
        "daily_beverages": [
            "Morning Sovereignty Blend",
            "Pre-Practice Blend (training days)",
            "Water throughout the day",
            "Evening Architecture Blend"
        ]
    }
}
