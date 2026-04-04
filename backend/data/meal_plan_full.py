MEAL_PLAN_META = {
    "title": "The 30-Day Meal Plan",
    "subtitle": "Budget-Friendly. Simple. Built to Fuel the Long Game.",
    "cost": "Approx. $50-65 per week. All ingredients at any grocery store.",
    "philosophy": "This meal plan is designed around the nutritional architecture of the Imperium doctrine: anti-inflammatory, protein-prioritised, gut-health focused, and structured around the 16:8 fasting window. Breakfast is consumed at noon to break the fast. All meals are achievable in 30 minutes or under.",
    "batch_strategy": "Sunday evening: cook a double batch of dinner. This becomes Monday lunch (L). Wednesday evening: cook a double batch again. This becomes Thursday lunch. Cook once, eat twice.",
    "pantry_staples": [
        "Olive oil", "Butter", "Salt", "Black pepper", "Garlic powder", "Onion powder",
        "Smoked paprika", "Cumin", "Italian seasoning", "Chili powder", "Soy sauce",
        "Hot sauce (optional)", "Rice (5 lb bag)", "Pasta (2 lb)", "Rolled oats (large bag)",
        "Canned tomatoes", "Chicken broth (2 cartons)", "Peanut butter", "Honey"
    ],
    "budget_tips": [
        "Buy chicken thighs, not breasts. More flavour, less cost.",
        "Frozen fish and shrimp are identical in nutritional value to fresh, and cheaper.",
        "Dried lentils and canned beans are your best sources of cheap protein.",
        "Buy the store brand on everything except olive oil and eggs.",
        "Oats, rice, and pasta bought in bulk bring the per-meal cost under $1."
    ]
}

RECIPES = {
    "oats_banana_pb": {
        "name": "Oats with Banana and Peanut Butter",
        "category": "breakfast",
        "serves": 1, "prep_cook": "5 min", "cost": "$0.60",
        "ingredients": [
            "1/2 cup rolled oats", "1 cup water or milk", "1 banana, sliced",
            "1 tbsp peanut butter", "Pinch of salt", "Honey to taste (optional)"
        ],
        "method": [
            "Bring water or milk to a boil in a small pot.",
            "Add oats and salt. Reduce heat and cook 3-4 minutes, stirring occasionally.",
            "Pour into a bowl. Top with sliced banana, peanut butter, and honey if using."
        ],
        "tip": "Make overnight: combine oats and milk in a jar the night before. In the morning, top and eat cold. Zero morning effort."
    },
    "scrambled_eggs_toast": {
        "name": "Scrambled Eggs on Toast",
        "category": "breakfast",
        "serves": 1, "prep_cook": "7 min", "cost": "$0.80",
        "ingredients": [
            "2-3 eggs", "1 tbsp butter", "2 slices bread", "Salt and pepper",
            "Optional: handful of spinach, splash of milk"
        ],
        "method": [
            "Crack eggs into a bowl. Add salt, pepper, and a splash of milk if using. Whisk.",
            "Melt butter in a pan over medium-low heat. Pour in eggs.",
            "Stir slowly and constantly with a spatula, pulling the eggs from the edges. Remove from heat while still slightly wet — they will finish cooking in the pan.",
            "Toast bread. Serve eggs on toast."
        ],
        "tip": "Low and slow is the key. High heat makes them rubbery."
    },
    "greek_yogurt_granola": {
        "name": "Greek Yogurt with Honey and Granola",
        "category": "breakfast",
        "serves": 1, "prep_cook": "2 min", "cost": "$0.90",
        "ingredients": [
            "3/4 cup Greek yogurt (full fat)", "2 tbsp granola", "1 tbsp honey",
            "Optional: handful of frozen berries, thawed overnight"
        ],
        "method": [
            "Spoon yogurt into a bowl.",
            "Top with granola, honey, and berries if using.",
            "Eat immediately."
        ],
        "tip": "Full-fat Greek yogurt has more protein and keeps you fuller longer than low-fat. The cost difference is minimal."
    },
    "avocado_toast_egg": {
        "name": "Avocado Toast with a Fried Egg",
        "category": "breakfast",
        "serves": 1, "prep_cook": "8 min", "cost": "$1.10",
        "ingredients": [
            "2 slices bread", "1/2 ripe avocado", "1 egg", "1/2 tbsp butter or oil",
            "Salt, pepper, red pepper flakes (optional)", "Lemon juice (a squeeze)"
        ],
        "method": [
            "Toast bread to preference.",
            "Mash avocado in a small bowl with lemon juice, salt, and pepper.",
            "Fry egg in butter over medium heat. Cook until white is set but yolk is still runny, about 3 minutes.",
            "Spread avocado on toast. Top with egg. Add red pepper flakes if using."
        ],
        "tip": "The lemon juice stops the avocado browning if you need to make it ahead."
    },
    "banana_pb_smoothie": {
        "name": "Banana Peanut Butter Smoothie",
        "category": "breakfast",
        "serves": 1, "prep_cook": "3 min", "cost": "$0.70",
        "ingredients": [
            "1 banana (frozen works best)", "1 tbsp peanut butter",
            "1 cup milk or water", "1/2 cup Greek yogurt",
            "Optional: 1 tbsp oats for thickness"
        ],
        "method": [
            "Add all ingredients to a blender.",
            "Blend until smooth.",
            "Drink immediately or refrigerate for up to 4 hours."
        ],
        "tip": "Freeze overripe bananas in bags. They make the smoothie thicker and colder without needing ice."
    },
    "overnight_oats": {
        "name": "Overnight Oats with Berries",
        "category": "breakfast",
        "serves": 1, "prep_cook": "5 min prep (night before)", "cost": "$0.80",
        "ingredients": [
            "1/2 cup rolled oats", "1/2 cup milk", "1/4 cup Greek yogurt",
            "1 tsp honey", "1/2 tsp vanilla extract (optional)", "Handful of frozen berries"
        ],
        "method": [
            "Combine oats, milk, yogurt, honey, and vanilla in a jar or container with a lid.",
            "Stir well. Top with frozen berries.",
            "Seal and refrigerate overnight.",
            "Eat cold in the morning. Stir before eating."
        ],
        "tip": "Make 3-4 at once on Sunday night for Mon-Wed breakfasts. Total time: 10 minutes."
    },
    "veggie_omelette": {
        "name": "Veggie Omelette",
        "category": "breakfast",
        "serves": 1, "prep_cook": "10 min", "cost": "$1.00",
        "ingredients": [
            "3 eggs", "1 tbsp butter", "1/4 onion, diced", "1/4 bell pepper, diced",
            "Handful of spinach", "Salt and pepper", "2 tbsp shredded cheese"
        ],
        "method": [
            "Whisk eggs with salt and pepper.",
            "Melt butter in a pan over medium heat. Saute onion and bell pepper 2-3 minutes until softened.",
            "Add spinach, stir until wilted.",
            "Pour eggs over vegetables. Tilt pan to spread evenly.",
            "When edges set and top is mostly cooked, add cheese to one half. Fold omelette over.",
            "Cook 30 more seconds. Slide onto plate."
        ],
        "tip": "Any vegetables work. Use whatever needs using up."
    },
    "lentil_soup": {
        "name": "Lentil Soup",
        "category": "lunch",
        "serves": 4, "prep_cook": "30 min", "cost": "$1.40",
        "ingredients": [
            "1 cup dried red lentils", "1 onion, diced", "3 garlic cloves, minced",
            "2 carrots, diced", "1 can diced tomatoes", "4 cups chicken or vegetable broth",
            "1 tsp cumin", "1 tsp smoked paprika", "Salt and pepper",
            "2 tbsp olive oil", "Lemon juice to finish"
        ],
        "method": [
            "Heat olive oil in a large pot over medium heat. Add onion and carrots. Cook 5 minutes.",
            "Add garlic, cumin, and paprika. Stir 1 minute.",
            "Add lentils, tomatoes, and broth. Bring to a boil.",
            "Reduce heat and simmer 20 minutes until lentils are soft.",
            "Season with salt, pepper, and a squeeze of lemon. Serve with bread."
        ],
        "tip": "Makes 4 servings. Refrigerate leftovers up to 4 days. Freezes perfectly for Week 3 lunches."
    },
    "tuna_salad": {
        "name": "Tuna Salad Sandwich",
        "category": "lunch",
        "serves": 1, "prep_cook": "5 min", "cost": "$1.60",
        "ingredients": [
            "1 can tuna, drained", "1 tbsp mayonnaise", "1 tsp mustard (optional)",
            "1 celery stalk, finely diced", "1/4 small onion, finely diced",
            "Salt and pepper", "2 slices bread", "Lettuce leaves"
        ],
        "method": [
            "In a bowl, mix tuna with mayo, mustard, celery, and onion.",
            "Season with salt and pepper.",
            "Spread on bread. Add lettuce. Close sandwich."
        ],
        "tip": "Add a squeeze of lemon juice and a pinch of smoked paprika to take this from standard to genuinely good."
    },
    "black_bean_quesadillas": {
        "name": "Black Bean Quesadillas",
        "category": "lunch",
        "serves": 2, "prep_cook": "12 min", "cost": "$1.50",
        "ingredients": [
            "1 can black beans, drained and rinsed", "2 large flour tortillas",
            "1/2 cup shredded cheese", "1/4 tsp cumin", "1/4 tsp chili powder",
            "Salt", "Optional: salsa, sour cream"
        ],
        "method": [
            "Mix black beans with cumin, chili powder, and salt.",
            "Lay a tortilla flat. Sprinkle cheese over half. Add bean mixture over the cheese. Fold tortilla over.",
            "Heat a dry pan over medium heat. Cook quesadilla 2-3 minutes per side until golden and cheese is melted.",
            "Cut into wedges. Serve with salsa and sour cream if using."
        ],
        "tip": "Add a handful of spinach or frozen corn to the filling for extra nutrition at no real cost increase."
    },
    "pasta_salad": {
        "name": "Pasta Salad with Olives and Feta",
        "category": "lunch",
        "serves": 3, "prep_cook": "20 min", "cost": "$1.80",
        "ingredients": [
            "2 cups pasta (rotini or penne)", "1/2 cup olives, halved",
            "1/2 cup feta cheese, crumbled", "1 cup cherry tomatoes or diced tomatoes",
            "2 tbsp olive oil", "1 tbsp red wine vinegar or lemon juice",
            "Salt, pepper, dried oregano"
        ],
        "method": [
            "Cook pasta according to package directions. Drain and rinse with cold water.",
            "Combine pasta with olives, feta, and tomatoes in a large bowl.",
            "Drizzle with olive oil and vinegar. Season with salt, pepper, and oregano.",
            "Toss well. Eat immediately or refrigerate."
        ],
        "tip": "Keeps in the fridge for 3 days. Make a full batch and eat it across multiple lunches."
    },
    "egg_fried_rice": {
        "name": "Egg Fried Rice",
        "category": "lunch",
        "serves": 2, "prep_cook": "15 min", "cost": "$1.20",
        "ingredients": [
            "2 cups cooked rice (day-old works best)", "2 eggs",
            "1/2 cup frozen peas or corn", "2 tbsp soy sauce", "1 tbsp oil",
            "2 garlic cloves, minced", "Optional: leftover chicken or vegetables"
        ],
        "method": [
            "Heat oil in a large pan or wok over high heat.",
            "Add garlic, stir 30 seconds.",
            "Add rice, spread out in the pan. Let it sit 1-2 minutes to crisp slightly, then stir.",
            "Push rice to sides. Crack eggs into the centre. Scramble, then mix with rice.",
            "Add peas, soy sauce, and any leftover protein. Stir-fry 2 more minutes."
        ],
        "tip": "The secret is day-old rice — fresh rice is too moist and goes soggy."
    },
    "chicken_wrap": {
        "name": "Chicken Wrap with Hummus and Veg",
        "category": "lunch",
        "serves": 1, "prep_cook": "10 min", "cost": "$2.00",
        "ingredients": [
            "1 large flour tortilla", "2-3 oz cooked chicken (leftover or rotisserie)",
            "2 tbsp hummus", "Handful of salad greens",
            "1/4 cucumber, sliced", "Salt and pepper"
        ],
        "method": [
            "Lay tortilla flat. Spread hummus across the centre.",
            "Layer greens, chicken, and vegetables.",
            "Season with salt and pepper.",
            "Fold sides in, then roll up tightly. Cut in half."
        ],
        "tip": "Any protein works. Leftover beef, tuna, hard-boiled eggs. The hummus adds creaminess and protein."
    },
    "minestrone": {
        "name": "Minestrone Soup",
        "category": "lunch",
        "serves": 4, "prep_cook": "30 min", "cost": "$1.30",
        "ingredients": [
            "1 can kidney beans, drained", "1 can diced tomatoes",
            "2 cups chicken or vegetable broth", "1 zucchini, diced",
            "1 carrot, diced", "1 celery stalk, diced", "1 onion, diced",
            "2 garlic cloves, minced", "1 cup small pasta or broken spaghetti",
            "2 handfuls spinach", "2 tbsp olive oil", "Italian seasoning, salt, pepper"
        ],
        "method": [
            "Heat olive oil in a large pot. Saute onion, carrot, and celery 5 minutes.",
            "Add garlic and Italian seasoning. Stir 1 minute.",
            "Add tomatoes, broth, and beans. Bring to a boil.",
            "Add zucchini and pasta. Simmer 10 minutes until pasta is cooked.",
            "Stir in spinach. Season. Serve."
        ],
        "tip": "Makes a full batch and keeps for days. Add a splash of water when reheating as the pasta absorbs liquid."
    },
    "blt": {
        "name": "BLT Sandwich",
        "category": "lunch",
        "serves": 1, "prep_cook": "10 min", "cost": "$1.70",
        "ingredients": [
            "2-3 strips bacon", "2 slices bread", "2 lettuce leaves",
            "1 tomato, sliced", "1 tbsp mayonnaise", "Salt and pepper"
        ],
        "method": [
            "Cook bacon in a pan over medium heat until crispy. Drain on paper towel.",
            "Toast bread lightly.",
            "Spread mayo on both slices. Layer lettuce, tomato, and bacon.",
            "Season tomato with salt and pepper. Close sandwich. Cut diagonally."
        ],
        "tip": "Add a fried egg to make this a BLTE — takes 3 more minutes and adds meaningful protein."
    },
    "chicken_rice_bowl": {
        "name": "Chicken Rice Bowl with Roasted Veg",
        "category": "lunch",
        "serves": 2, "prep_cook": "30 min", "cost": "$2.20",
        "ingredients": [
            "2 chicken thighs (boneless)", "1 cup rice", "1 bell pepper, diced",
            "1 zucchini or broccoli, chopped", "2 tbsp olive oil",
            "Salt, pepper, garlic powder, paprika"
        ],
        "method": [
            "Preheat oven to 425F (220C).",
            "Toss vegetables in 1 tbsp olive oil, salt, and pepper. Spread on baking sheet.",
            "Rub chicken with remaining oil and spices. Place on same sheet.",
            "Roast 25-28 minutes until chicken is cooked through and veg is slightly caramelised.",
            "Cook rice per package directions. Slice chicken. Serve over rice with vegetables."
        ],
        "tip": "Sheet pan meals are the batch cooker's best tool. Double the recipe and you have tomorrow's lunch."
    },
    "spaghetti_meat_sauce": {
        "name": "Spaghetti with Meat Sauce",
        "category": "dinner",
        "serves": 4, "prep_cook": "30 min", "cost": "$2.50",
        "ingredients": [
            "1 lb ground beef", "1 lb spaghetti", "2 jars pasta sauce (or 2 cans crushed tomatoes + spices)",
            "1 onion, diced", "3 garlic cloves, minced", "Olive oil",
            "Italian seasoning, salt, pepper", "Parmesan to serve"
        ],
        "method": [
            "Brown ground beef in a large pan over medium-high heat. Drain excess fat.",
            "Add onion. Cook 3 minutes. Add garlic, cook 1 minute.",
            "Add pasta sauce. Simmer 15 minutes.",
            "Cook spaghetti per package. Drain, saving 1/4 cup pasta water.",
            "Combine pasta with sauce, adding pasta water if needed for consistency.",
            "Serve with Parmesan."
        ],
        "tip": "Makes 4 servings. Freeze half. The sauce tastes better the next day."
    },
    "sheet_pan_chicken": {
        "name": "Sheet Pan Chicken Thighs with Potatoes and Broccoli",
        "category": "dinner",
        "serves": 3, "prep_cook": "35 min", "cost": "$3.20",
        "ingredients": [
            "3-4 chicken thighs, bone-in skin-on", "3 medium potatoes, cubed",
            "1 head broccoli, cut into florets", "3 tbsp olive oil",
            "1 tsp garlic powder", "1 tsp smoked paprika",
            "1 tsp Italian seasoning", "Salt and pepper"
        ],
        "method": [
            "Preheat oven to 425F (220C).",
            "Toss potatoes in 1 tbsp olive oil and half the spices. Spread on a large baking sheet.",
            "Rub chicken with 1 tbsp oil and remaining spices. Place skin-side up among potatoes.",
            "Roast 20 minutes. Add broccoli tossed in remaining oil. Roast 15 more minutes.",
            "Chicken is done when juices run clear. Skin should be crispy."
        ],
        "tip": "This is the single best batch cooking meal in the plan. Make it Sunday. Eat it Monday for lunch. Costs under $3 per serving."
    },
    "sweet_potato_tacos": {
        "name": "Black Bean and Sweet Potato Tacos",
        "category": "dinner",
        "serves": 2, "prep_cook": "25 min", "cost": "$2.40",
        "ingredients": [
            "1 can black beans, drained", "1 large sweet potato, peeled and diced",
            "4-6 flour or corn tortillas", "1 tsp cumin", "1 tsp chili powder",
            "1/2 tsp garlic powder", "Olive oil, salt",
            "Optional toppings: shredded cheese, sour cream, salsa, lime"
        ],
        "method": [
            "Toss sweet potato cubes in olive oil, cumin, chili powder, garlic powder, salt.",
            "Spread on baking sheet. Roast at 400F (200C) for 20 minutes until tender.",
            "Warm beans in a small pan with a pinch of cumin and salt.",
            "Warm tortillas directly on gas flame or in a dry pan.",
            "Assemble: beans, sweet potato, toppings of choice."
        ],
        "tip": "Completely meatless and genuinely satisfying. The sweet potato provides sweetness that makes the spices sing."
    },
    "beef_stir_fry": {
        "name": "Beef Stir-Fry with Rice",
        "category": "dinner",
        "serves": 2, "prep_cook": "20 min", "cost": "$3.00",
        "ingredients": [
            "1/2 lb beef sirloin or flank steak, thinly sliced", "2 cups broccoli florets",
            "1 bell pepper, sliced", "2 garlic cloves, minced",
            "1 tsp fresh or ground ginger", "3 tbsp soy sauce", "1 tbsp honey",
            "1 tbsp oil", "Cooked rice to serve"
        ],
        "method": [
            "Mix soy sauce and honey in a small bowl. Set aside.",
            "Heat oil in a large pan or wok over high heat until very hot.",
            "Cook beef in a single layer 1-2 minutes per side. Remove.",
            "Add broccoli and pepper to pan. Stir-fry 3-4 minutes.",
            "Add garlic and ginger. Stir 30 seconds.",
            "Return beef. Pour sauce over. Toss everything together.",
            "Serve over rice immediately."
        ],
        "tip": "Slice beef while partially frozen — it is much easier to get thin, even slices."
    },
    "baked_salmon": {
        "name": "Baked Salmon with Rice and Green Beans",
        "category": "dinner",
        "serves": 2, "prep_cook": "25 min", "cost": "$3.80",
        "ingredients": [
            "2 salmon fillets", "2 tbsp olive oil", "2 garlic cloves, minced",
            "Juice of 1 lemon", "1 tsp smoked paprika", "Salt and pepper",
            "1/2 lb green beans", "Cooked rice to serve"
        ],
        "method": [
            "Preheat oven to 400F (200C).",
            "Mix olive oil, garlic, lemon juice, paprika, salt and pepper. Rub over salmon.",
            "Place salmon on a lined baking sheet. Toss green beans in oil and salt, arrange around salmon.",
            "Bake 15-18 minutes until salmon flakes easily with a fork.",
            "Serve with rice."
        ],
        "tip": "Frozen salmon fillets work perfectly. Thaw in the fridge overnight or under cold running water for 15 minutes."
    },
    "chicken_veg_soup": {
        "name": "Chicken and Vegetable Soup",
        "category": "dinner",
        "serves": 4, "prep_cook": "35 min", "cost": "$2.60",
        "ingredients": [
            "2-3 chicken thighs (bone-in or boneless)", "2 carrots, sliced",
            "2 celery stalks, sliced", "1 onion, diced", "3 garlic cloves, minced",
            "4 cups chicken broth", "1 cup egg noodles or broken spaghetti (optional)",
            "Salt, pepper, dried thyme"
        ],
        "method": [
            "If using bone-in thighs, place in pot with broth. Bring to a boil, simmer 20 minutes. Remove chicken, shred, discard bones.",
            "If using boneless: dice raw chicken and add with vegetables in step 3.",
            "In the same pot, saute onion, carrot, and celery in a little oil 5 minutes.",
            "Add garlic, thyme. Stir 1 minute.",
            "Add broth (and raw chicken if boneless). Bring to a boil.",
            "Add noodles if using. Simmer 10 minutes.",
            "Add shredded chicken. Season well."
        ],
        "tip": "This is a 4-serving batch. Freeze half. It is the best meal to come home to after a hard day."
    },
    "pork_chops": {
        "name": "Pork Chops with Mashed Potatoes and Peas",
        "category": "dinner",
        "serves": 2, "prep_cook": "30 min", "cost": "$3.10",
        "ingredients": [
            "2 pork chops (bone-in or boneless)", "4 medium potatoes, peeled and cubed",
            "1 cup frozen peas", "3 tbsp butter", "1/4 cup milk",
            "Salt, pepper, garlic powder", "Olive oil"
        ],
        "method": [
            "Boil potatoes in salted water 15-20 minutes until tender.",
            "Season pork chops generously with salt, pepper, and garlic powder.",
            "Heat oil in a pan over medium-high heat. Cook chops 4-5 minutes per side until internal temp reaches 145F or juices run clear.",
            "Rest chops 3 minutes before cutting.",
            "Drain potatoes. Mash with butter, milk, salt, and pepper.",
            "Cook peas per package (usually 2 minutes). Plate chops with mash and peas."
        ],
        "tip": "Bone-in pork chops are usually cheaper than boneless and have better flavour."
    },
    "shakshuka": {
        "name": "Shakshuka",
        "category": "dinner",
        "serves": 2, "prep_cook": "20 min", "cost": "$1.80",
        "ingredients": [
            "4 eggs", "1 can crushed tomatoes", "1 onion, diced",
            "3 garlic cloves, minced", "1 bell pepper, diced",
            "1 tsp cumin", "1 tsp smoked paprika", "1/2 tsp chili flakes (optional)",
            "Olive oil, salt", "Feta to top (optional)", "Crusty bread to serve"
        ],
        "method": [
            "Heat olive oil in a wide pan over medium heat. Cook onion and pepper 5 minutes.",
            "Add garlic, cumin, paprika, and chili flakes. Stir 1 minute.",
            "Pour in tomatoes. Season. Simmer 8 minutes.",
            "Make 4 wells in the sauce. Crack an egg into each.",
            "Cover pan. Cook 5-7 minutes until whites are set but yolks still runny.",
            "Top with crumbled feta. Serve directly from the pan with bread."
        ],
        "tip": "One of the best budget dinners that exists. Eggs and canned tomatoes are cheap, filling, and genuinely delicious together."
    },
    "shrimp_pasta": {
        "name": "Lemon Garlic Shrimp with Pasta",
        "category": "dinner",
        "serves": 2, "prep_cook": "20 min", "cost": "$3.50",
        "ingredients": [
            "1/2 lb shrimp, peeled and deveined (frozen is fine, thaw first)",
            "1/2 lb pasta (linguine or spaghetti)", "4 garlic cloves, minced",
            "3 tbsp butter", "2 tbsp olive oil", "Juice of 1 lemon",
            "Red pepper flakes", "Fresh parsley if available", "Salt and pepper"
        ],
        "method": [
            "Cook pasta per package. Reserve 1/2 cup pasta water. Drain.",
            "Pat shrimp dry. Season with salt and pepper.",
            "In a large pan, heat olive oil over medium-high. Cook shrimp 1-2 minutes per side until pink. Remove.",
            "In the same pan, melt butter. Add garlic and red pepper flakes. Cook 1 minute.",
            "Add lemon juice and a splash of pasta water. Stir.",
            "Return shrimp and pasta to pan. Toss to coat.",
            "Add parsley if using. Serve immediately."
        ],
        "tip": "Do not overcook shrimp. They go from raw to perfect to rubbery in under 2 minutes."
    },
    "turkey_meatballs": {
        "name": "Turkey Meatballs with Tomato Sauce and Pasta",
        "category": "dinner",
        "serves": 4, "prep_cook": "30 min", "cost": "$2.90",
        "ingredients": [
            "1 lb ground turkey", "1 egg", "1/4 cup breadcrumbs or rolled oats",
            "2 garlic cloves, minced", "1 tsp Italian seasoning", "Salt and pepper",
            "2 jars or cans pasta sauce", "1 lb pasta"
        ],
        "method": [
            "Mix turkey, egg, breadcrumbs, garlic, Italian seasoning, salt, and pepper until just combined. Do not overmix.",
            "Roll into golf-ball-sized meatballs.",
            "Heat oil in a pan. Brown meatballs on all sides, about 5 minutes total.",
            "Pour sauce over meatballs. Simmer covered 15 minutes.",
            "Cook pasta. Serve meatballs and sauce over pasta."
        ],
        "tip": "Rolled oats instead of breadcrumbs add fibre and work perfectly as a binder."
    },
    "vegetable_curry": {
        "name": "Vegetable Curry with Rice",
        "category": "dinner",
        "serves": 3, "prep_cook": "30 min", "cost": "$2.20",
        "ingredients": [
            "1 can chickpeas, drained", "1 can diced tomatoes", "1 can coconut milk",
            "1 onion, diced", "3 garlic cloves, minced", "1 tsp fresh ginger",
            "2 tsp curry powder", "1 tsp cumin", "1/2 tsp turmeric",
            "2 cups spinach or kale", "Olive oil, salt", "Rice to serve"
        ],
        "method": [
            "Heat oil in a large pot over medium heat. Cook onion 5 minutes.",
            "Add garlic and ginger. Cook 1 minute.",
            "Add curry powder, cumin, and turmeric. Stir 30 seconds.",
            "Add chickpeas, tomatoes, and coconut milk. Stir well.",
            "Simmer 15 minutes. Add spinach or kale, stir until wilted.",
            "Season with salt. Serve over rice."
        ],
        "tip": "A genuinely great meatless meal. Coconut milk makes the sauce rich without expense."
    },
    "baked_chicken_carrots": {
        "name": "Baked Chicken Thighs with Roasted Carrots",
        "category": "dinner",
        "serves": 2, "prep_cook": "35 min", "cost": "$3.00",
        "ingredients": [
            "2-3 chicken thighs, bone-in skin-on", "4 large carrots, peeled and cut into sticks",
            "2 tbsp olive oil", "1 tsp garlic powder", "1 tsp smoked paprika",
            "1/2 tsp dried thyme", "Salt and pepper", "Lemon to serve"
        ],
        "method": [
            "Preheat oven to 425F (220C).",
            "Toss carrots in 1 tbsp olive oil, salt, and pepper.",
            "Mix remaining oil and spices. Rub over chicken thighs.",
            "Place chicken skin-side up on a baking sheet. Arrange carrots around chicken.",
            "Roast 30-35 minutes until skin is crispy and chicken is cooked through.",
            "Squeeze lemon over before serving."
        ],
        "tip": "Bone-in skin-on thighs stay moist and crispy simultaneously. More forgiving than breasts and significantly cheaper."
    },
    "stuffed_peppers": {
        "name": "Ground Beef and Rice Stuffed Peppers",
        "category": "dinner",
        "serves": 4, "prep_cook": "40 min", "cost": "$3.20",
        "ingredients": [
            "4 bell peppers (any colour)", "1/2 lb ground beef", "1 cup cooked rice",
            "1 can diced tomatoes, drained", "1/2 onion, diced", "2 garlic cloves, minced",
            "1 tsp cumin", "Salt and pepper", "1/2 cup shredded cheese"
        ],
        "method": [
            "Preheat oven to 375F (190C).",
            "Cut tops off peppers. Remove seeds. Place cut-side up in a baking dish.",
            "Cook ground beef with onion in a pan. Add garlic, cumin. Stir.",
            "Mix in cooked rice and drained tomatoes. Season.",
            "Fill each pepper with the mixture. Top with cheese.",
            "Bake 25-30 minutes until peppers are tender and cheese is melted."
        ],
        "tip": "Uses up rice and ground beef efficiently and looks far more impressive than the effort required."
    },
    "white_bean_kale_soup": {
        "name": "White Bean and Kale Soup",
        "category": "dinner",
        "serves": 4, "prep_cook": "30 min", "cost": "$1.90",
        "ingredients": [
            "2 cans white beans, drained", "1 bunch kale, stems removed and roughly chopped",
            "1 onion, diced", "4 garlic cloves, minced", "1 can diced tomatoes",
            "4 cups chicken or veg broth", "1 tsp Italian seasoning", "Red pepper flakes",
            "Olive oil, salt, pepper", "Parmesan rind if available", "Crusty bread to serve"
        ],
        "method": [
            "Heat olive oil in a large pot. Saute onion 5 minutes.",
            "Add garlic, Italian seasoning, and red pepper flakes. Cook 1 minute.",
            "Add beans, tomatoes, broth, and parmesan rind if using.",
            "Bring to a boil. Simmer 10 minutes.",
            "Add kale. Simmer 5 more minutes until wilted.",
            "Remove parmesan rind. Season well. Serve with bread."
        ],
        "tip": "If you use Parmesan during the week, do not discard the rind. Add it to soups — it adds depth of flavour impossible to replicate cheaply otherwise."
    },
}

# Map recipe keys to short names used in the day plan
R = {
    "oats": "oats_banana_pb",
    "eggs": "scrambled_eggs_toast",
    "yogurt": "greek_yogurt_granola",
    "avo": "avocado_toast_egg",
    "smoothie": "banana_pb_smoothie",
    "overnight": "overnight_oats",
    "omelette": "veggie_omelette",
    "lentil": "lentil_soup",
    "tuna": "tuna_salad",
    "quesadilla": "black_bean_quesadillas",
    "pasta_salad": "pasta_salad",
    "fried_rice": "egg_fried_rice",
    "wrap": "chicken_wrap",
    "minestrone": "minestrone",
    "blt": "blt",
    "rice_bowl": "chicken_rice_bowl",
    "spaghetti": "spaghetti_meat_sauce",
    "sheet_chicken": "sheet_pan_chicken",
    "tacos": "sweet_potato_tacos",
    "stir_fry": "beef_stir_fry",
    "salmon": "baked_salmon",
    "chicken_soup": "chicken_veg_soup",
    "pork": "pork_chops",
    "shakshuka": "shakshuka",
    "shrimp": "shrimp_pasta",
    "meatballs": "turkey_meatballs",
    "curry": "vegetable_curry",
    "baked_chicken": "baked_chicken_carrots",
    "stuffed_peppers": "stuffed_peppers",
    "bean_soup": "white_bean_kale_soup",
}

DAYS_30 = [
    {"day":1,"dow":"Monday","breakfast":R["oats"],"lunch":R["lentil"],"dinner":R["spaghetti"],"week":1},
    {"day":2,"dow":"Tuesday","breakfast":R["eggs"],"lunch":"leftover","dinner":R["sheet_chicken"],"week":1},
    {"day":3,"dow":"Wednesday","breakfast":R["yogurt"],"lunch":R["tuna"],"dinner":R["tacos"],"week":1},
    {"day":4,"dow":"Thursday","breakfast":R["avo"],"lunch":R["quesadilla"],"dinner":R["stir_fry"],"week":1},
    {"day":5,"dow":"Friday","breakfast":R["smoothie"],"lunch":"leftover","dinner":R["salmon"],"week":1},
    {"day":6,"dow":"Saturday","breakfast":R["overnight"],"lunch":R["pasta_salad"],"dinner":R["chicken_soup"],"week":1},
    {"day":7,"dow":"Sunday","breakfast":R["omelette"],"lunch":"leftover","dinner":R["pork"],"week":1},
    {"day":8,"dow":"Monday","breakfast":R["oats"],"lunch":R["minestrone"],"dinner":R["shakshuka"],"week":2},
    {"day":9,"dow":"Tuesday","breakfast":R["eggs"],"lunch":"leftover","dinner":R["shrimp"],"week":2},
    {"day":10,"dow":"Wednesday","breakfast":R["yogurt"],"lunch":R["fried_rice"],"dinner":R["meatballs"],"week":2},
    {"day":11,"dow":"Thursday","breakfast":R["avo"],"lunch":R["wrap"],"dinner":R["curry"],"week":2},
    {"day":12,"dow":"Friday","breakfast":R["smoothie"],"lunch":"leftover","dinner":R["baked_chicken"],"week":2},
    {"day":13,"dow":"Saturday","breakfast":R["overnight"],"lunch":R["blt"],"dinner":R["spaghetti"],"week":2},
    {"day":14,"dow":"Sunday","breakfast":R["omelette"],"lunch":"leftover","dinner":R["stuffed_peppers"],"week":2},
    {"day":15,"dow":"Monday","breakfast":R["oats"],"lunch":R["lentil"],"dinner":R["bean_soup"],"week":3},
    {"day":16,"dow":"Tuesday","breakfast":R["eggs"],"lunch":"leftover","dinner":R["sheet_chicken"],"week":3},
    {"day":17,"dow":"Wednesday","breakfast":R["yogurt"],"lunch":R["quesadilla"],"dinner":R["tacos"],"week":3},
    {"day":18,"dow":"Thursday","breakfast":R["avo"],"lunch":R["rice_bowl"],"dinner":R["stir_fry"],"week":3},
    {"day":19,"dow":"Friday","breakfast":R["smoothie"],"lunch":"leftover","dinner":R["salmon"],"week":3},
    {"day":20,"dow":"Saturday","breakfast":R["overnight"],"lunch":R["pasta_salad"],"dinner":R["shakshuka"],"week":3},
    {"day":21,"dow":"Sunday","breakfast":R["omelette"],"lunch":"leftover","dinner":R["pork"],"week":3},
    {"day":22,"dow":"Monday","breakfast":R["oats"],"lunch":R["minestrone"],"dinner":R["curry"],"week":4},
    {"day":23,"dow":"Tuesday","breakfast":R["eggs"],"lunch":"leftover","dinner":R["shrimp"],"week":4},
    {"day":24,"dow":"Wednesday","breakfast":R["yogurt"],"lunch":R["tuna"],"dinner":R["meatballs"],"week":4},
    {"day":25,"dow":"Thursday","breakfast":R["avo"],"lunch":R["fried_rice"],"dinner":R["baked_chicken"],"week":4},
    {"day":26,"dow":"Friday","breakfast":R["smoothie"],"lunch":"leftover","dinner":R["chicken_soup"],"week":4},
    {"day":27,"dow":"Saturday","breakfast":R["overnight"],"lunch":R["wrap"],"dinner":R["stuffed_peppers"],"week":4},
    {"day":28,"dow":"Sunday","breakfast":R["omelette"],"lunch":"leftover","dinner":R["bean_soup"],"week":4},
    {"day":29,"dow":"Monday","breakfast":R["oats"],"lunch":R["lentil"],"dinner":R["spaghetti"],"week":5},
    {"day":30,"dow":"Tuesday","breakfast":R["eggs"],"lunch":"leftover","dinner":R["sheet_chicken"],"week":5},
]
