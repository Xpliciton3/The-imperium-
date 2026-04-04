from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import modular data
from data.ritual_preparations import RITUAL_PREPARATIONS
from data.shadow_and_values import SHADOW_CHAPTERS, MORAL_ARCHITECTURE, COGNITIVE_FUNCTIONS
from data.training_nutrition import TRAINING_REGIMEN, NUTRITIONAL_ARCHITECTURE
from data.expanded_doctrines import EXPANDED_DOCTRINES, GLOSSARY, ADDITIONAL_MEDITATIONS

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Gemini API Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="The Imperium API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============== VEL'NAR LANGUAGE DATA ==============
VELNAR_VOCABULARY = {
    "core_roots": [
        {"root": "VEL", "meaning": "sovereign choosing, will owned", "pronunciation": "VEHL", "audio_hint": "rhymes with 'bell'"},
        {"root": "NAR", "meaning": "held interior, inner territory", "pronunciation": "NAHR", "audio_hint": "like 'car' with N"},
        {"root": "REN", "meaning": "known truly, witnessed and held", "pronunciation": "REHN", "audio_hint": "like 'ten' with R"},
        {"root": "MIR", "meaning": "to witness consciously", "pronunciation": "MEER", "audio_hint": "like 'mirror' without second syllable"},
        {"root": "SON", "meaning": "pattern-sight, clarity", "pronunciation": "SOHN", "audio_hint": "like 'zone' with S"},
        {"root": "THUR", "meaning": "forge, bearing pressure through heat", "pronunciation": "THOOR", "audio_hint": "like 'tour' with TH"},
        {"root": "KAL", "meaning": "permanent, enduring, what remains", "pronunciation": "KAHL", "audio_hint": "like 'call' but shorter"},
        {"root": "UNT", "meaning": "becoming, still in the forge", "pronunciation": "OONT", "audio_hint": "like 'unt' in 'hunt'"},
        {"root": "DRAV", "meaning": "arrived, sealed, fully crossed", "pronunciation": "DRAHV", "audio_hint": "rhymes with 'salve'"},
        {"root": "DOR", "meaning": "return, re-entry, passage back", "pronunciation": "DOHR", "audio_hint": "like 'door'"},
        {"root": "KETH", "meaning": "crown, rule, authority", "pronunciation": "KEHTH", "audio_hint": "like 'death' with K"},
        {"root": "LOR", "meaning": "memory held under witness", "pronunciation": "LOHR", "audio_hint": "like 'lore'"},
        {"root": "HAL", "meaning": "inward place", "pronunciation": "HAHL", "audio_hint": "like 'hall'"},
        {"root": "SYR", "meaning": "hearth, interior boundary", "pronunciation": "SEER", "audio_hint": "like 'seer'"},
        {"root": "ZAR", "meaning": "rupture, breach, waste", "pronunciation": "ZAHR", "audio_hint": "like 'czar'"},
        {"root": "KOR", "meaning": "fracture, the split within", "pronunciation": "KOHR", "audio_hint": "like 'core'"},
        {"root": "TAR", "meaning": "breach, intrusion across boundary", "pronunciation": "TAHR", "audio_hint": "like 'tar'"},
        {"root": "VAS", "meaning": "performed face, false outer form", "pronunciation": "VAHS", "audio_hint": "like 'vase'"},
        {"root": "VELK", "meaning": "false crown, borrowed rule", "pronunciation": "VEHLK", "audio_hint": "like 'elk' with V"},
        {"root": "MOR", "meaning": "corrosion through compromise", "pronunciation": "MOHR", "audio_hint": "like 'more'"},
        {"root": "SHA", "meaning": "ash-remnant, what remains after burning", "pronunciation": "SHAH", "audio_hint": "like 'shah'"},
    ],
    "key_phrases": [
        {"phrase": "an im-vel", "meaning": "I stand as my own choosing", "pronunciation": "AHN EEM-VEHL", "context": "Identity declaration"},
        {"phrase": "vel nar", "meaning": "the sovereign interior", "pronunciation": "VEHL NAHR", "context": "Core concept"},
        {"phrase": "an im-thur", "meaning": "I enter the forge knowingly", "pronunciation": "AHN EEM-THOOR", "context": "Initiation"},
        {"phrase": "an im-dor", "meaning": "I return", "pronunciation": "AHN EEM-DOHR", "context": "Return after absence"},
        {"phrase": "ren kal", "meaning": "permanently held under witness", "pronunciation": "REHN KAHL", "context": "Witness declaration"},
        {"phrase": "mir ren", "meaning": "consciously witnessed and known", "pronunciation": "MEER REHN", "context": "Acknowledgment"},
        {"phrase": "an ren", "meaning": "I am seen / I stand witnessed", "pronunciation": "AHN REHN", "context": "Being witnessed"},
        {"phrase": "lor ren", "meaning": "memory held under witness", "pronunciation": "LOHR REHN", "context": "Memory keeping"},
        {"phrase": "son unt", "meaning": "pattern still becoming", "pronunciation": "SOHN OONT", "context": "Growth state"},
        {"phrase": "drav nar", "meaning": "the interior that has fully crossed", "pronunciation": "DRAHV NAHR", "context": "Completion"},
        {"phrase": "dor thur", "meaning": "return to the forge", "pronunciation": "DOHR THOOR", "context": "Renewal"},
        {"phrase": "unt im", "meaning": "the self still in becoming", "pronunciation": "OONT EEM", "context": "Self-acknowledgment"},
        {"phrase": "anar ren-kal", "meaning": "you who are truly known and permanently held", "pronunciation": "AH-NAHR REHN-KAHL", "context": "Intimate address"},
        {"phrase": "vel anar kal", "meaning": "I choose you enduringly", "pronunciation": "VEHL AH-NAHR KAHL", "context": "Covenant"},
        {"phrase": "nar syr", "meaning": "hearth kept within", "pronunciation": "NAHR SEER", "context": "Inner sanctuary"},
    ],
    "rite_phrases": [
        {"phrase": "an im-thur. an im-unt.", "meaning": "I enter the forge. I enter becoming.", "context": "Initiation opening"},
        {"phrase": "vel nar. ren kal.", "meaning": "Let the sovereign interior be held under witness.", "context": "Initiation blessing"},
        {"phrase": "velk no. keth no.", "meaning": "False crown, no; false rule, no.", "context": "Refusal declaration"},
        {"phrase": "an im-vel. tar no.", "meaning": "I stand as my own choosing; breach is denied.", "context": "Boundary setting"},
        {"phrase": "an im-dor. dor thur.", "meaning": "I return. I return to the forge.", "context": "Return after collapse"},
        {"phrase": "sha named. kor named. vel restored in labor.", "meaning": "The ash is named; the fracture is named; the will is restored through work.", "context": "Restoration"},
        {"phrase": "tar barred. nar sealed.", "meaning": "Breach is barred; the interior is sealed.", "context": "Severance"},
        {"phrase": "anar withdrawn. ren withdrawn.", "meaning": "Inward address withdrawn; witness withdrawn.", "context": "Complete severance"},
    ],
    "grammar_rules": [
        {"rule": "Compounding", "description": "Lead root governs; following root specifies. Example: VEL NAR (sovereign interior)"},
        {"rule": "an- prefix", "description": "Declarative/existential marker. 'I am', 'I stand'"},
        {"rule": "-en suffix", "description": "Agentive or bearer suffix"},
        {"rule": "-eth suffix", "description": "Quality or interiorized quality"},
        {"rule": "za- prefix", "description": "Rupture or corruption prefix"},
        {"rule": "dor- prefix", "description": "Returning prefix"},
        {"rule": "-kal suffix", "description": "Enduring / made permanent"},
        {"rule": "Breath as Syntax", "description": "Oath forms: full breaths. Witness forms: steady single breath. Severance forms: short and clean."},
    ],
    "pronunciation_guide": {
        "vowels": [
            {"letter": "A", "sound": "AH", "description": "Open, back, never flattened"},
            {"letter": "E", "sound": "EH", "description": "Clear mid-mouth"},
            {"letter": "I", "sound": "IH/EE", "description": "IH before consonants, EE at end of word"},
            {"letter": "O", "sound": "OH", "description": "Rounded, full, never clipped"},
            {"letter": "U", "sound": "OO", "description": "Deep rounded"},
        ],
        "consonants": "Favors hard K, full V, voiced TH, present R, soft continuous Z",
        "stress": "Falls on the governing root. In compounds, lead root carries weight.",
        "pace": "60-70% of ordinary English speed. This is 'arrival', not hesitation.",
    }
}

# ============== MEAL PLAN DATA ==============
MEAL_PLAN_30_DAYS = [
    # Week 1
    {"day": 1, "breakfast": "Oats with Banana and Peanut Butter", "lunch": "Lentil Soup", "dinner": "Spaghetti with Meat Sauce"},
    {"day": 2, "breakfast": "Scrambled Eggs on Toast", "lunch": "Leftover Spaghetti", "dinner": "Sheet Pan Chicken Thighs with Potatoes and Broccoli"},
    {"day": 3, "breakfast": "Greek Yogurt with Honey and Granola", "lunch": "Tuna Salad Sandwich", "dinner": "Black Bean and Sweet Potato Tacos"},
    {"day": 4, "breakfast": "Avocado Toast with Fried Egg", "lunch": "Black Bean Quesadillas", "dinner": "Beef Stir-fry with Rice"},
    {"day": 5, "breakfast": "Banana Peanut Butter Smoothie", "lunch": "Leftover Beef Stir-fry", "dinner": "Baked Salmon with Rice and Green Beans"},
    {"day": 6, "breakfast": "Overnight Oats with Berries", "lunch": "Pasta Salad with Olives and Feta", "dinner": "Chicken and Vegetable Soup"},
    {"day": 7, "breakfast": "Veggie Omelette", "lunch": "Leftover Chicken Soup", "dinner": "Pork Chops with Mashed Potatoes and Peas"},
    # Week 2
    {"day": 8, "breakfast": "Oats with Banana and Peanut Butter", "lunch": "Minestrone Soup", "dinner": "Shakshuka with Bread"},
    {"day": 9, "breakfast": "Scrambled Eggs on Toast", "lunch": "Leftover Shakshuka", "dinner": "Lemon Garlic Shrimp with Pasta"},
    {"day": 10, "breakfast": "Greek Yogurt with Honey and Granola", "lunch": "Egg Fried Rice", "dinner": "Turkey Meatballs with Tomato Sauce and Pasta"},
    {"day": 11, "breakfast": "Avocado Toast with Fried Egg", "lunch": "Chicken Wrap with Hummus and Veg", "dinner": "Vegetable Curry with Rice"},
    {"day": 12, "breakfast": "Banana Peanut Butter Smoothie", "lunch": "Leftover Vegetable Curry", "dinner": "Baked Chicken Thighs with Roasted Carrots"},
    {"day": 13, "breakfast": "Overnight Oats with Berries", "lunch": "BLT Sandwich", "dinner": "Spaghetti with Meat Sauce"},
    {"day": 14, "breakfast": "Veggie Omelette", "lunch": "Leftover Spaghetti", "dinner": "Ground Beef and Rice Stuffed Peppers"},
    # Week 3
    {"day": 15, "breakfast": "Oats with Banana and Peanut Butter", "lunch": "Lentil Soup", "dinner": "White Bean and Kale Soup"},
    {"day": 16, "breakfast": "Scrambled Eggs on Toast", "lunch": "Leftover White Bean Soup", "dinner": "Sheet Pan Chicken Thighs with Potatoes and Broccoli"},
    {"day": 17, "breakfast": "Greek Yogurt with Honey and Granola", "lunch": "Black Bean Quesadillas", "dinner": "Black Bean and Sweet Potato Tacos"},
    {"day": 18, "breakfast": "Avocado Toast with Fried Egg", "lunch": "Chicken Rice Bowl with Roasted Veg", "dinner": "Beef Stir-fry with Rice"},
    {"day": 19, "breakfast": "Banana Peanut Butter Smoothie", "lunch": "Leftover Beef Stir-fry", "dinner": "Baked Salmon with Rice and Green Beans"},
    {"day": 20, "breakfast": "Overnight Oats with Berries", "lunch": "Pasta Salad with Olives and Feta", "dinner": "Shakshuka with Bread"},
    {"day": 21, "breakfast": "Veggie Omelette", "lunch": "Leftover Shakshuka", "dinner": "Pork Chops with Mashed Potatoes and Peas"},
    # Week 4
    {"day": 22, "breakfast": "Oats with Banana and Peanut Butter", "lunch": "Minestrone Soup", "dinner": "Vegetable Curry with Rice"},
    {"day": 23, "breakfast": "Scrambled Eggs on Toast", "lunch": "Leftover Vegetable Curry", "dinner": "Lemon Garlic Shrimp with Pasta"},
    {"day": 24, "breakfast": "Greek Yogurt with Honey and Granola", "lunch": "Tuna Salad Sandwich", "dinner": "Turkey Meatballs with Tomato Sauce and Pasta"},
    {"day": 25, "breakfast": "Avocado Toast with Fried Egg", "lunch": "Egg Fried Rice", "dinner": "Baked Chicken Thighs with Roasted Carrots"},
    {"day": 26, "breakfast": "Banana Peanut Butter Smoothie", "lunch": "Leftover Baked Chicken Thighs", "dinner": "Chicken and Vegetable Soup"},
    {"day": 27, "breakfast": "Overnight Oats with Berries", "lunch": "Chicken Wrap with Hummus and Veg", "dinner": "Ground Beef and Rice Stuffed Peppers"},
    {"day": 28, "breakfast": "Veggie Omelette", "lunch": "Leftover Stuffed Peppers", "dinner": "White Bean and Kale Soup"},
    # Week 5 (Days 29-30)
    {"day": 29, "breakfast": "Oats with Banana and Peanut Butter", "lunch": "Lentil Soup", "dinner": "Spaghetti with Meat Sauce"},
    {"day": 30, "breakfast": "Scrambled Eggs on Toast", "lunch": "Leftover Spaghetti", "dinner": "Sheet Pan Chicken Thighs with Potatoes and Broccoli"},
]

RECIPES = {
    "Oats with Banana and Peanut Butter": {
        "ingredients": ["1/2 cup rolled oats", "1 cup water or milk", "1 banana (sliced)", "1 tbsp peanut butter", "Pinch of salt", "Honey (optional)"],
        "instructions": ["Bring water/milk to boil", "Add oats and reduce heat", "Cook 5 minutes, stirring occasionally", "Top with banana, peanut butter, and honey"],
        "prep_time": "5 min", "cook_time": "5 min", "servings": 1
    },
    "Lentil Soup": {
        "ingredients": ["1 cup dried red lentils", "1 onion (diced)", "3 garlic cloves (minced)", "2 carrots (diced)", "1 can diced tomatoes", "4 cups broth", "1 tsp cumin", "1 tsp smoked paprika", "Salt, pepper", "2 tbsp olive oil", "Lemon juice"],
        "instructions": ["Sauté onion and garlic in olive oil", "Add carrots, cook 3 min", "Add lentils, tomatoes, broth, spices", "Simmer 25-30 min until lentils tender", "Finish with lemon juice"],
        "prep_time": "10 min", "cook_time": "30 min", "servings": 4
    },
    "Spaghetti with Meat Sauce": {
        "ingredients": ["1 lb ground beef", "1 lb spaghetti", "2 jars pasta sauce", "1 onion (diced)", "3 garlic cloves (minced)", "Olive oil", "Italian seasoning", "Salt, pepper", "Parmesan"],
        "instructions": ["Brown beef with onion and garlic", "Add pasta sauce and seasonings", "Simmer 20 min", "Cook pasta according to package", "Serve sauce over pasta with Parmesan"],
        "prep_time": "10 min", "cook_time": "25 min", "servings": 4
    },
    "Sheet Pan Chicken Thighs with Potatoes and Broccoli": {
        "ingredients": ["3-4 chicken thighs (bone-in)", "3 medium potatoes (cubed)", "1 head broccoli (florets)", "3 tbsp olive oil", "1 tsp garlic powder", "1 tsp smoked paprika", "1 tsp Italian seasoning", "Salt, pepper"],
        "instructions": ["Preheat oven to 425°F", "Toss potatoes with oil and seasonings, spread on pan", "Roast 15 min", "Add seasoned chicken and broccoli", "Roast 25-30 min until chicken reaches 165°F"],
        "prep_time": "15 min", "cook_time": "45 min", "servings": 3
    },
    "Scrambled Eggs on Toast": {
        "ingredients": ["2-3 eggs", "1 tbsp butter", "2 slices bread", "Salt, pepper", "Optional: spinach, milk"],
        "instructions": ["Beat eggs with salt and pepper", "Melt butter in pan over medium-low heat", "Add eggs, stir gently until soft curds form", "Serve on toasted bread"],
        "prep_time": "3 min", "cook_time": "5 min", "servings": 1
    },
    "Greek Yogurt with Honey and Granola": {
        "ingredients": ["3/4 cup Greek yogurt", "2 tbsp granola", "1 tbsp honey", "Optional: berries"],
        "instructions": ["Spoon yogurt into bowl", "Top with granola and drizzle honey", "Add berries if desired"],
        "prep_time": "2 min", "cook_time": "0 min", "servings": 1
    },
    "Tuna Salad Sandwich": {
        "ingredients": ["1 can tuna (drained)", "1 tbsp mayonnaise", "1 tsp mustard (optional)", "1 celery stalk (diced)", "1/4 small onion (diced)", "Salt, pepper", "2 slices bread", "Lettuce"],
        "instructions": ["Mix tuna, mayo, mustard, celery, onion", "Season with salt and pepper", "Spread on bread with lettuce"],
        "prep_time": "5 min", "cook_time": "0 min", "servings": 1
    },
    "Black Bean and Sweet Potato Tacos": {
        "ingredients": ["1 can black beans (drained)", "1 large sweet potato (diced)", "4-6 tortillas", "1 tsp cumin", "1 tsp chili powder", "1/2 tsp garlic powder", "Olive oil", "Salt"],
        "instructions": ["Roast sweet potato cubes with oil and spices at 400°F for 25 min", "Warm black beans with cumin and chili powder", "Assemble tacos with beans and sweet potato", "Top with salsa, avocado, or sour cream"],
        "prep_time": "10 min", "cook_time": "25 min", "servings": 2
    },
    "Beef Stir-fry with Rice": {
        "ingredients": ["1/2 lb beef sirloin (thinly sliced)", "2 cups broccoli florets", "1 bell pepper (sliced)", "2 garlic cloves (minced)", "1 tsp ginger", "3 tbsp soy sauce", "1 tbsp honey", "1 tbsp oil"],
        "instructions": ["Cook rice according to package", "Stir-fry beef in hot oil until browned, set aside", "Stir-fry vegetables 3-4 min", "Return beef, add garlic, ginger, soy sauce, honey", "Toss to combine, serve over rice"],
        "prep_time": "15 min", "cook_time": "15 min", "servings": 2
    },
    "Baked Salmon with Rice and Green Beans": {
        "ingredients": ["2 salmon fillets", "2 tbsp olive oil", "2 garlic cloves (minced)", "Juice of 1 lemon", "1 tsp smoked paprika", "Salt, pepper", "1/2 lb green beans"],
        "instructions": ["Preheat oven to 400°F", "Place salmon on baking sheet, drizzle with oil, garlic, lemon, paprika", "Bake 12-15 min until flaky", "Steam or roast green beans alongside", "Serve with rice"],
        "prep_time": "10 min", "cook_time": "15 min", "servings": 2
    },
}

# ============== WARRIOR PRACTICES DATA ==============
WARRIOR_PRACTICES = {
    "iaido": {
        "name": "Iaido",
        "description": "The art of drawing and cutting with the sword as a contemplative discipline",
        "stages": [
            {"stage": 1, "name": "Empty Hand Foundation", "focus": "Seiza position, basic movements without weapon", "duration": "4-8 weeks", "requirements": ["Master seiza for 15+ minutes", "Understand basic draw motion", "Practice daily for 20 minutes"]},
            {"stage": 2, "name": "Bokken Basics", "focus": "Wooden sword fundamentals", "duration": "8-12 weeks", "requirements": ["Proper grip and posture", "Clean nukitsuke (draw)", "Basic kiritsuke (cut)"]},
            {"stage": 3, "name": "Iaito Work", "focus": "Practice with unsharpened alloy sword", "duration": "12-24 weeks", "requirements": ["Smooth draw-cut sequence", "Proper chiburi (cleaning motion)", "Clean noto (return to saya)"]},
            {"stage": 4, "name": "Kata Depth", "focus": "Formal patterns and sequences", "duration": "Ongoing", "requirements": ["Master multiple kata", "Formal practice structure", "Consistent execution"]},
            {"stage": 5, "name": "Integration", "focus": "Mushin - mind without ego interference", "duration": "Lifelong", "requirements": ["Seamless mind-body integration", "No visible hesitation", "Present-moment awareness"]},
        ],
        "equipment": ["Bokken (wooden sword)", "Iaito (practice sword)", "Hakama", "Keikogi"],
    },
    "kyudo": {
        "name": "Kyudo",
        "description": "The art of archery practiced as a meditative discipline",
        "stages": [
            {"stage": 1, "name": "Gorin and Breath", "focus": "Foundation postures and breathing", "duration": "4-8 weeks", "requirements": ["Master ashibumi (foot placement)", "Dozukuri (body alignment)", "Breathing coordination"]},
            {"stage": 2, "name": "First Release", "focus": "Basic shooting form", "duration": "8-16 weeks", "requirements": ["Complete hassetsu sequence", "Safe release technique", "Consistent form"]},
            {"stage": 3, "name": "Shin-zen-bi", "focus": "Truth, goodness, beauty in practice", "duration": "16-32 weeks", "requirements": ["Improved accuracy", "Flowing movement", "Aesthetic awareness"]},
            {"stage": 4, "name": "Mushin in Release", "focus": "Non-attachment to outcome", "duration": "Ongoing", "requirements": ["Release without anticipation", "Accept all outcomes equally", "Present-moment focus"]},
            {"stage": 5, "name": "Integration", "focus": "Complete embodiment of principles", "duration": "Lifelong", "requirements": ["Arrow as truth indicator", "Seamless practice", "Teaching capability"]},
        ],
        "hassetsu": ["Ashibumi", "Dozukuri", "Yugamae", "Uchiokoshi", "Hikiwake", "Kai", "Hanare", "Zanshin"],
        "equipment": ["Yumi (bow)", "Ya (arrows)", "Yugake (glove)"],
    },
    "systema": {
        "name": "Systema",
        "description": "The threshold art - training response to sudden disruption",
        "stages": [
            {"stage": 1, "name": "Breath and Looseness", "focus": "Foundation breathing and relaxation", "duration": "4-8 weeks", "requirements": ["Maintain nasal breathing under stress", "Release tension consciously", "Ground quickly after disruption"]},
            {"stage": 2, "name": "Hold Escapes", "focus": "Escape from common holds", "duration": "8-12 weeks", "requirements": ["Escape wrist grabs", "Escape collar grabs", "Escape rear attacks"]},
            {"stage": 3, "name": "Strikes and Flow", "focus": "Contact management", "duration": "12-20 weeks", "requirements": ["Absorb and redirect strikes", "Maintain breath under contact", "Continuous movement"]},
            {"stage": 4, "name": "Constraint and Environment", "focus": "Restricted movement scenarios", "duration": "Ongoing", "requirements": ["Work in confined spaces", "Multiple attacker awareness", "Environmental use"]},
            {"stage": 5, "name": "Integration", "focus": "Unconscious competence", "duration": "Lifelong", "requirements": ["Instant appropriate response", "Calm under chaos", "Diagnostic self-use"]},
        ],
        "tests": [
            {"test": 1, "name": "Breath Recovery", "description": "Regain nasal breathing and grounded posture after pressure"},
            {"test": 2, "name": "Surprise Start", "description": "Escape common grabs from neutral/distracted posture"},
            {"test": 3, "name": "Hold Escape Under Compression", "description": "Demonstrate escapes from chokes, holds, pins"},
            {"test": 4, "name": "Threshold Scenario", "description": "Complete scenario from conversation to threat response"},
            {"test": 5, "name": "Integration Standard", "description": "Demonstrate composure when fatigued, startled"},
        ],
    },
    "throwing_daggers": {
        "name": "Throwing Daggers",
        "description": "Precision throwing as kinesthetic calibration",
        "stages": [
            {"stage": 1, "name": "Three-Meter Foundation", "focus": "Basic throwing at close range", "duration": "2-4 weeks", "requirements": ["Consistent stick at 3 meters", "Proper grip", "Safe retrieval"]},
            {"stage": 2, "name": "Distance and Variation", "focus": "Expanding range", "duration": "4-8 weeks", "requirements": ["Stick at 4-5 meters", "Multiple rotation throws", "Quick succession"]},
            {"stage": 3, "name": "Precision Work", "focus": "Target accuracy", "duration": "8-12 weeks", "requirements": ["Hit specific zones", "Consistent grouping", "Pressure performance"]},
            {"stage": 4, "name": "Internal Practice", "focus": "Meditative throwing", "duration": "Ongoing", "requirements": ["Throw without conscious aim", "Mind-body integration", "Diagnostic use"]},
        ],
        "equipment": ["Throwing knives (3-5 set)", "Target board", "Retrieval gloves"],
    },
}

# ============== RITE OF THE UNCROWNED DATA ==============
RITE_OF_THE_UNCROWNED = {
    "name": "The Rite of the Uncrowned",
    "description": "The central initiation rite performed at entry and repeated at significant thresholds",
    "challenge_coin_url": "https://www.challengecoins4less.com",
    "preparation": {
        "fasting": "REQUIRED: 24-hour fast before the rite (water only). The day before the rite, cease eating. The fast is broken at Stage 6.",
        "fasting_detail": "Twenty-four hours of fasting (water only). This is non-negotiable. The fast creates the physiological and psychological state necessary for the rite to land with its full weight.",
        "timing": "Dawn or midnight",
        "duration": "Three to four hours minimum",
        "materials": ["Fire source (candle, fireplace, or outdoor fire)", "Water (one glass)", "The Codex (physical copy of this doctrine)", "Paper and pen of personal weight", "Blade (bokken, iaito, significant knife, or chosen edge object)", "Solitude or one chosen witness"],
        "aromatics": ["Frankincense (threshold — Stage 2)", "Cedarwood (physical sealing — Stage 4)", "Sandalwood (inscription — Stage 5)"],
        "aromatic_sourcing": "See Ritual Preparations section for detailed sourcing of all oils and burning substances.",
    },
    "stages": [
        {
            "stage": 1,
            "name": "Reckoning (Separation)",
            "description": "Write and burn what is left behind",
            "instructions": [
                "Write on paper: what you are leaving behind",
                "Write: what it cost you",
                "Write: what it produced in you",
                "Burn the paper in the fire",
                "Watch until it is ash",
            ],
            "duration": "15-20 minutes",
        },
        {
            "stage": 2,
            "name": "Threshold (Liminality)",
            "description": "Stand at a threshold and cross deliberately",
            "instructions": [
                "Stand at a physical threshold (doorway)",
                "Light frankincense if available",
                "Stand in silence for 3 minutes",
                "When ready, step through deliberately",
                "Do not look back",
            ],
            "duration": "5-10 minutes",
        },
        {
            "stage": 3,
            "name": "Declaration (Incorporation)",
            "description": "Recite the Canon aloud from memory",
            "instructions": [
                "Recite the Oath",
                "Recite the Creed",
                "Recite the Litany",
                "Recite the Covenant",
                "Recite the Manifesto",
                "Finish with the Axiom: 'Power from within cannot be revoked'",
                "State the four-word form: 'Seen. Sovereign. Structured. Uncrowned.'",
            ],
            "duration": "10-15 minutes",
        },
        {
            "stage": 4,
            "name": "Physical Sealing",
            "description": "Perform martial practice to seal the rite",
            "instructions": [
                "If trained: perform a kata or set of cuts",
                "If untrained: perform 10 deliberate empty-hand strikes",
                "Apply cedarwood oil to wrists if available",
                "Each movement should be complete and intentional",
            ],
            "duration": "5-10 minutes",
        },
        {
            "stage": 5,
            "name": "Inscription",
            "description": "Write who you have become",
            "instructions": [
                "Apply sandalwood scent if available",
                "Write a single sentence: who you have become",
                "Sign it with your name",
                "Date it",
                "Keep this inscription",
            ],
            "duration": "5-10 minutes",
        },
        {
            "stage": 6,
            "name": "Breaking of the Fast",
            "description": "Return to the body through nourishment",
            "instructions": [
                "Drink water slowly",
                "If available: drink the Rite Preparation Tea (frankincense tears, honey)",
                "Eat a deliberate meal",
                "The rite is complete",
            ],
            "duration": "15-30 minutes",
        },
    ],
    "canon_pieces": {
        "oath": "I will not be diminished by comfort, approval, or belonging. My standards are my own. My sovereignty is not negotiable.",
        "creed": "I build what I envision. I execute what I plan. I finish what I start. The gap between knowing and doing is where I live.",
        "litany": "I will not flinch from what I see. I will not soften my standards to make others comfortable. I will not trade depth for breadth.",
        "covenant": "I answer to the version of myself that exists at the end of the path. That version does not accept excuses, only evidence.",
        "manifesto": "I am not here to be liked. I am here to be right, to be useful, and to leave something behind that was not here before I came.",
        "axiom": "Power from within cannot be revoked.",
        "four_word": "Seen. Sovereign. Structured. Uncrowned.",
    },
}

# ============== DAILY PRACTICES DATA ==============
DAILY_PRACTICES = {
    "morning": {
        "name": "Morning Sovereignty Declaration",
        "description": "Begin each day by declaring your sovereignty",
        "practices": [
            {"name": "Axiom Recitation", "duration": "1 min", "description": "Recite: 'Power from within cannot be revoked'"},
            {"name": "Litany Reading", "duration": "2 min", "description": "Read one piece from the Canon"},
            {"name": "Sovereignty Question", "duration": "3 min", "description": "Ask: 'What do I actually want today?'"},
            {"name": "Body Check", "duration": "2 min", "description": "Scan body for tension, breathe into tight areas"},
        ],
    },
    "evening": {
        "name": "Evening Inventory",
        "description": "End each day with three questions",
        "practices": [
            {"name": "First Question", "duration": "2 min", "description": "What did I build today?"},
            {"name": "Second Question", "duration": "2 min", "description": "What did I learn today?"},
            {"name": "Third Question", "duration": "2 min", "description": "What will I do differently tomorrow?"},
            {"name": "Gratitude Note", "duration": "1 min", "description": "Name one thing you are grateful for"},
        ],
    },
    "weekly": {
        "name": "Weekly Sharpening",
        "description": "Ninety-minute solitude practice",
        "practices": [
            {"name": "Read from The Tending", "duration": "30 min", "description": "Read a piece you have been avoiding"},
            {"name": "After-Action Report", "duration": "30 min", "description": "Write what worked and what didn't this week"},
            {"name": "Cost-Gain Assessment", "duration": "30 min", "description": "Assess what you gave and what you received"},
        ],
    },
}

# ============== MEDITATIONS DATA ==============
MEDITATIONS = [
    {
        "name": "Box Breathing", 
        "duration": "5-10 min", 
        "description": "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat.", 
        "category": "Breath",
        "beginner_instructions": [
            "Find a comfortable seated position - chair or cushion.",
            "Close your eyes. Place one hand on your belly.",
            "INHALE through nose for 4 counts. Feel belly expand.",
            "HOLD for 4 counts. Stay relaxed.",
            "EXHALE through nose for 4 counts. Feel belly fall.",
            "HOLD empty for 4 counts.",
            "Repeat 4-20 cycles. Start with 3 counts if 4 is too long."
        ],
        "why_we_do_this": "Activates parasympathetic nervous system, creating calm and clarity under pressure."
    },
    {
        "name": "Body Scan", 
        "duration": "10-15 min", 
        "description": "Systematically move attention through body from feet to crown", 
        "category": "Body",
        "beginner_instructions": [
            "Lie on your back. Arms at sides, palms up.",
            "Close eyes. Take 3 deep breaths.",
            "Attention to LEFT FOOT → ankle → shin → knee → thigh.",
            "Attention to RIGHT FOOT → ankle → shin → knee → thigh.",
            "Attention to PELVIS → BELLY → CHEST.",
            "Attention to LEFT HAND → arm → shoulder. Then RIGHT.",
            "Attention to NECK → JAW → FACE → CROWN.",
            "Rest 30 seconds feeling whole body. Open eyes slowly."
        ],
        "why_we_do_this": "Develops interoception - awareness of internal states - foundational to self-knowledge."
    },
    {
        "name": "Trataka (Candle Gazing)", 
        "duration": "10-20 min", 
        "description": "Gaze at candle flame without blinking until tears form", 
        "category": "Focus",
        "beginner_instructions": [
            "Dark room. Candle at arm's length, flame at eye level.",
            "Sit with straight spine. Let flame settle (no drafts).",
            "Gaze at brightest point - tip of blue flame.",
            "Don't blink. Eyes will water - this is normal.",
            "When you must blink, close eyes and observe after-image.",
            "Hold image at third eye (between eyebrows).",
            "When image fades, resume gazing. Start with 3-5 min."
        ],
        "why_we_do_this": "Develops single-pointed concentration and the ability to hold focus without distraction."
    },
    {
        "name": "Void Sitting", 
        "duration": "15-30 min", 
        "description": "Sit in silence with no object of focus. Let thoughts pass.", 
        "category": "Stillness",
        "beginner_instructions": [
            "ADVANCED - practice other meditations first.",
            "Sit stable. Spine straight. Eyes closed.",
            "Do NOT focus on anything. Simply sit.",
            "Thoughts arise - don't engage or push away. Let them pass.",
            "Boredom, restlessness, discomfort will arise. Let them pass.",
            "There is no 'doing it right.' Just sit.",
            "Start 5 min. Add 5 min each week. Requires months of patience."
        ],
        "why_we_do_this": "Reveals the nature of mind and cultivates sovereign stillness undisturbed by circumstances."
    },
    {
        "name": "Walking Meditation", 
        "duration": "15-30 min", 
        "description": "Slow deliberate walking, attention on each foot placement", 
        "category": "Movement",
        "beginner_instructions": [
            "Find a 20-30 foot path. Stand at one end.",
            "Walk MUCH slower than normal. 2-3 seconds per step.",
            "LIFTING: Notice heel leaving ground, then toes.",
            "MOVING: Notice foot moving through space.",
            "PLACING: Notice heel touching, then sole, then toes.",
            "SHIFTING: Notice weight transfer before lifting other foot.",
            "At path end, stop, breathe 3 times, turn slowly, walk back."
        ],
        "why_we_do_this": "Bridges sitting practice and daily life. Develops presence while in motion."
    },
    {
        "name": "Axiom Mantra", 
        "duration": "5-10 min", 
        "description": "Repeat 'Power from within cannot be revoked' with each breath", 
        "category": "Affirmation",
        "beginner_instructions": [
            "Sit comfortably, eyes closed. 5 natural breaths.",
            "INHALE: silently say 'Power from within...'",
            "EXHALE: silently say '...cannot be revoked.'",
            "Let words match the breath, not the other way around.",
            "Feel the meaning. This is not empty repetition.",
            "Continue 5-10 min. Or 108 repetitions (traditional).",
            "Optional Vel'nar: 'vel nar drav. tar no vel.'"
        ],
        "why_we_do_this": "Imprints truth on the subconscious mind. Makes the Axiom available in moments of challenge."
    },
    {
        "name": "Mirror Practice", 
        "duration": "5-10 min", 
        "description": "Look into your own eyes in mirror without looking away", 
        "category": "Self",
        "beginner_instructions": [
            "Mirror where your face is clear. Good lighting.",
            "Sit or stand. Face fills most of mirror.",
            "Meet your own gaze. Look into your LEFT eye.",
            "Hold the gaze. Don't look away. Don't perform.",
            "Emotions may arise. Let them pass.",
            "You are practicing witness. Seeing yourself as you are.",
            "Start 2-3 min. This can be intense."
        ],
        "why_we_do_this": "Strips away performance. Creates direct confrontation with self. Builds capacity to be truly seen."
    },
    {
        "name": "Cold Exposure", 
        "duration": "2-5 min", 
        "description": "Cold shower or immersion with controlled breathing", 
        "category": "Body",
        "beginner_instructions": [
            "Ensure no heart conditions. Start conservatively.",
            "SHOWER: Start warm. Complete washing. Turn to cold.",
            "Control breath: slow exhale. Inhale takes care of itself.",
            "Start 15-30 seconds. Build to 2-3 min over weeks.",
            "IMMERSION (advanced): Tub with cold water/ice (50-59°F).",
            "Enter slowly. Water to chest. Same breathing.",
            "Start 1-2 min. NEVER do alone. Always have someone nearby."
        ],
        "why_we_do_this": "Trains stress response. Proves you can maintain composure in discomfort. Transfers to all pressure."
    }
]

# ============== THE DOCTRINES ==============
THE_DOCTRINES = {
    "the_axiom": {
        "name": "The Axiom",
        "text": "Power from within cannot be revoked.",
        "vel_nar": "vel nar drav. tar no vel.",
        "explanation": "This is the seed from which the entire system grows. External forces can constrain your circumstances, but the sovereign interior remains yours. No one can take your capacity to choose your response."
    },
    "the_oath": {
        "name": "The Oath",
        "text": "I will not be diminished by comfort, approval, or belonging. My standards are my own. My sovereignty is not negotiable.",
        "when_spoken": "Daily as Morning Sovereignty Declaration. At opening of Rite.",
        "explanation": "Names the three threats to sovereignty: comfort (avoiding difficulty), approval (desire to be liked), belonging (desire to fit in)."
    },
    "the_creed": {
        "name": "The Creed", 
        "text": "I build what I envision. I execute what I plan. I finish what I start. The gap between knowing and doing is where I live.",
        "when_spoken": "Morning Declaration and the Rite.",
        "explanation": "Addresses the failure of execution. 'The gap between knowing and doing' is the battlefield of daily struggle."
    },
    "the_litany": {
        "name": "The Litany",
        "text": "I will not flinch from what I see. I will not soften my standards to make others comfortable. I will not trade depth for breadth.",
        "when_spoken": "Morning Declaration, Rite, whenever resolve is needed.",
        "explanation": "Commitment to truthfulness and focus.",
        "line_by_line": [
            {"line": "I will not flinch from what I see.", "meaning": "When I observe truth, I will not pretend I didn't see it or rationalize it away."},
            {"line": "I will not soften my standards to make others comfortable.", "meaning": "I will not lower expectations because others find high standards threatening."},
            {"line": "I will not trade depth for breadth.", "meaning": "I will not scatter attention across shallow pursuits. Mastery requires focus."}
        ]
    },
    "the_covenant": {
        "name": "The Covenant",
        "text": "I answer to the version of myself that exists at the end of the path. That version does not accept excuses, only evidence.",
        "when_spoken": "During the Rite and moments of decision.",
        "explanation": "Establishes accountability to your future self. They do not accept stories about why you couldn't. They only recognize what you did or did not do."
    },
    "the_manifesto": {
        "name": "The Manifesto",
        "text": "I am not here to be liked. I am here to be right, to be useful, and to leave something behind that was not here before I came.",
        "when_spoken": "During the Rite.",
        "explanation": "Reorients purpose from social validation to contribution and legacy."
    },
    "the_four_word_form": {
        "name": "The Four-Word Form",
        "text": "Seen. Sovereign. Structured. Uncrowned.",
        "when_spoken": "Identity statement. Closing of the Rite.",
        "explanation": "SEEN - witnessed truly. SOVEREIGN - self-ruling. STRUCTURED - internal architecture. UNCROWNED - needs no external validation."
    }
}

# ============== VEL'NAR COURSE STRUCTURE ==============
VELNAR_COURSE = {
    "levels": [
        {
            "level": 1,
            "name": "Initiate",
            "title": "The First Sounds",
            "description": "Learn the foundational vowels and consonants of Vel'nar. Master the deliberate pace and weight of the language.",
            "lessons": [
                {
                    "id": "1-1",
                    "title": "The Five Vowels",
                    "description": "Vel'nar vowels are open, full, and never rushed. Each carries weight.",
                    "content": [
                        {"type": "teaching", "text": "In Vel'nar, vowels are the breath of meaning. They are never flattened or swallowed."},
                        {"type": "vowel", "letter": "A", "sound": "AH", "example": "Open, back, like 'father' - never flat like 'cat'"},
                        {"type": "vowel", "letter": "E", "sound": "EH", "example": "Clear mid-mouth, like 'bed' - never like 'bee'"},
                        {"type": "vowel", "letter": "I", "sound": "IH/EE", "example": "IH before consonants, EE at word end"},
                        {"type": "vowel", "letter": "O", "sound": "OH", "example": "Rounded and full, like 'stone' - never clipped"},
                        {"type": "vowel", "letter": "U", "sound": "OO", "example": "Deep rounded, like 'moon'"},
                        {"type": "practice", "text": "Practice saying each vowel slowly. Feel the shape in your mouth. Vel'nar is spoken at 60-70% of normal English speed."}
                    ],
                    "phrases_to_learn": ["an", "im", "vel", "nar"]
                },
                {
                    "id": "1-2", 
                    "title": "The Consonant Framework",
                    "description": "Vel'nar consonants are deliberate and present. They land with intention.",
                    "content": [
                        {"type": "teaching", "text": "Consonants in Vel'nar are never swallowed. Each one arrives fully."},
                        {"type": "consonant", "sound": "K", "description": "Hard K - like 'king', never soft"},
                        {"type": "consonant", "sound": "V", "description": "Full V - vibrant, not fading"},
                        {"type": "consonant", "sound": "TH", "description": "Voiced TH - like 'the', not 'think'"},
                        {"type": "consonant", "sound": "R", "description": "Present R - not dropped or swallowed"},
                        {"type": "consonant", "sound": "Z", "description": "Soft continuous Z - sustained"},
                        {"type": "practice", "text": "Speak with deliberation. Each consonant is a choice, not an accident."}
                    ],
                    "phrases_to_learn": ["vel", "ren", "thur", "kal"]
                },
                {
                    "id": "1-3",
                    "title": "The Pace of Arrival",
                    "description": "Vel'nar is spoken slowly - this is not hesitation, but arrival.",
                    "content": [
                        {"type": "teaching", "text": "The default pace of Vel'nar is 60-70% of ordinary English speed. This slowness is not uncertainty - it is arrival. Each word lands with its full weight."},
                        {"type": "principle", "name": "Arrival, Not Hesitation", "text": "When you speak Vel'nar slowly, you are not searching for words. You are allowing them to arrive with their full meaning intact."},
                        {"type": "principle", "name": "Stress on the Governing Root", "text": "In any phrase, stress falls on the root that governs meaning. In compounds, the lead root carries the weight."},
                        {"type": "practice", "text": "Practice saying 'an im-vel' (I stand as my own choosing). Say it at half your normal speed. Feel each syllable land."}
                    ],
                    "phrases_to_learn": ["an im-vel", "vel nar"]
                }
            ]
        },
        {
            "level": 2,
            "name": "Student",
            "title": "The Core Roots",
            "description": "Learn the essential root words that form the foundation of all Vel'nar expression.",
            "lessons": [
                {
                    "id": "2-1",
                    "title": "Roots of Sovereignty",
                    "description": "The words that speak to self-rule and inner authority.",
                    "content": [
                        {"type": "teaching", "text": "Vel'nar begins with sovereignty. These roots form the heart of self-declaration."},
                        {"type": "root", "word": "VEL", "pronunciation": "VEHL", "meaning": "Sovereign choosing, will owned, lawful self-rule", "usage": "The foundation of all self-declaration. To speak VEL is to claim your choices as your own."},
                        {"type": "root", "word": "NAR", "pronunciation": "NAHR", "meaning": "Held interior, inner territory, the inward place", "usage": "The space within that belongs only to you. Your interior landscape."},
                        {"type": "root", "word": "KETH", "pronunciation": "KEHTH", "meaning": "Crown, rule, authority, governing claim", "usage": "Authority in its legitimate form. The right to govern."},
                        {"type": "compound", "phrase": "vel nar", "meaning": "The sovereign interior - your inner territory that you alone rule", "context": "This is perhaps the most important compound in Vel'nar."}
                    ],
                    "phrases_to_learn": ["vel", "nar", "keth", "vel nar"]
                },
                {
                    "id": "2-2",
                    "title": "Roots of Witness",
                    "description": "Words for seeing, knowing, and being truly seen.",
                    "content": [
                        {"type": "teaching", "text": "To be witnessed in Vel'nar is sacred. These roots speak to truth seen and held."},
                        {"type": "root", "word": "REN", "pronunciation": "REHN", "meaning": "Known truly, witnessed and held", "usage": "When someone truly sees you - not your performance, but your reality."},
                        {"type": "root", "word": "MIR", "pronunciation": "MEER", "meaning": "To witness consciously, to keep in sight", "usage": "The active verb of witnessing. To MIR someone is to see them deliberately."},
                        {"type": "root", "word": "LOR", "pronunciation": "LOHR", "meaning": "Memory held under witness", "usage": "Memory that has been witnessed and therefore made permanent."},
                        {"type": "compound", "phrase": "ren kal", "meaning": "Permanently held under witness - known and remembered forever", "context": "Used for those you will never forget."}
                    ],
                    "phrases_to_learn": ["ren", "mir", "lor", "ren kal", "mir ren"]
                },
                {
                    "id": "2-3",
                    "title": "Roots of Becoming",
                    "description": "Words for transformation, the forge, and growth.",
                    "content": [
                        {"type": "teaching", "text": "Vel'nar acknowledges that we are always in process. These roots speak to that becoming."},
                        {"type": "root", "word": "THUR", "pronunciation": "THOOR", "meaning": "Forge, bearing pressure through heat and work", "usage": "The place where transformation happens through difficulty."},
                        {"type": "root", "word": "UNT", "pronunciation": "OONT", "meaning": "Becoming, still in the forge, not yet complete", "usage": "Acknowledges that you are in process. There is no shame in UNT."},
                        {"type": "root", "word": "DRAV", "pronunciation": "DRAHV", "meaning": "Arrived, sealed, fully crossed", "usage": "Completion. The threshold has been crossed and sealed."},
                        {"type": "root", "word": "DOR", "pronunciation": "DOHR", "meaning": "Return, re-entry, passage back through the threshold", "usage": "Coming back. Not failure, but return to the forge."},
                        {"type": "compound", "phrase": "an im-thur", "meaning": "I enter the forge knowingly - a declaration of willingness to be transformed", "context": "Spoken at the beginning of difficult work."}
                    ],
                    "phrases_to_learn": ["thur", "unt", "drav", "dor", "an im-thur", "dor thur"]
                }
            ]
        },
        {
            "level": 3,
            "name": "Practitioner",
            "title": "Grammar and Formation",
            "description": "Learn how Vel'nar words combine to create meaning. Master compounding and the breath-syntax.",
            "lessons": [
                {
                    "id": "3-1",
                    "title": "The Law of Compounding",
                    "description": "How roots combine to create complex meaning.",
                    "content": [
                        {"type": "teaching", "text": "In Vel'nar, meaning is built through compounding. The lead root governs; the following root specifies."},
                        {"type": "rule", "name": "Lead Root Governs", "text": "The first root in a compound carries the primary meaning. The second root modifies or specifies it."},
                        {"type": "example", "compound": "VEL NAR", "breakdown": "VEL (sovereignty) + NAR (interior) = The sovereign interior", "explanation": "VEL governs - this is about sovereignty. NAR specifies where - the interior."},
                        {"type": "example", "compound": "REN KAL", "breakdown": "REN (witnessed) + KAL (permanent) = Permanently witnessed", "explanation": "REN governs - this is about being witnessed. KAL specifies how - permanently."},
                        {"type": "example", "compound": "DOR THUR", "breakdown": "DOR (return) + THUR (forge) = Return to the forge", "explanation": "DOR governs - this is about returning. THUR specifies where - to the forge."},
                        {"type": "practice", "text": "Try creating compounds: What would SON (pattern) + UNT (becoming) mean? Answer: Pattern still becoming - a vision not yet realized."}
                    ],
                    "phrases_to_learn": ["vel nar", "ren kal", "dor thur", "son unt", "drav nar"]
                },
                {
                    "id": "3-2",
                    "title": "Derivational Markers",
                    "description": "Prefixes and suffixes that transform root meanings.",
                    "content": [
                        {"type": "teaching", "text": "Vel'nar uses markers to shift the function of roots without changing their essence."},
                        {"type": "marker", "marker": "an-", "marker_type": "prefix", "meaning": "Declarative/existential marker", "example": "an im-vel = I stand as my own choosing"},
                        {"type": "marker", "marker": "-en", "marker_type": "suffix", "meaning": "Agentive - one who does/bears", "example": "vel-en = one who chooses (a chooser)"},
                        {"type": "marker", "marker": "-eth", "marker_type": "suffix", "meaning": "Quality or interiorized quality", "example": "ren-eth = the quality of being witnessed"},
                        {"type": "marker", "marker": "za-", "marker_type": "prefix", "meaning": "Rupture or corruption", "example": "za-ren = broken witness, betrayed trust"},
                        {"type": "marker", "marker": "dor-", "marker_type": "prefix", "meaning": "Returning", "example": "dor-thur = return to the forge"},
                        {"type": "marker", "marker": "-kal", "marker_type": "suffix", "meaning": "Made permanent, enduring", "example": "ren-kal = permanently witnessed"}
                    ],
                    "phrases_to_learn": ["an im-vel", "an ren", "za-ren", "ren-kal"]
                },
                {
                    "id": "3-3",
                    "title": "Breath as Syntax",
                    "description": "How you breathe while speaking carries meaning.",
                    "content": [
                        {"type": "teaching", "text": "In Vel'nar, the breath pattern itself carries syntactic meaning. This is unique among languages."},
                        {"type": "breath", "form": "Oath Forms", "pattern": "Full breaths", "description": "When swearing or declaring, take full breaths. Each phrase arrives on a complete breath."},
                        {"type": "breath", "form": "Witness Forms", "pattern": "Steady single breath", "description": "When witnessing or acknowledging, maintain a steady, single breath. Calm and sustained."},
                        {"type": "breath", "form": "Severance Forms", "pattern": "Short and clean", "description": "When cutting ties or refusing, breathe short and clean. No lingering."},
                        {"type": "breath", "form": "Covenant Forms", "pattern": "Quiet but steady", "description": "When forming bonds of love or commitment, breathe quietly but with steadiness. Intimate but certain."},
                        {"type": "practice", "text": "Practice 'an im-vel' with a full breath. Then try 'tar barred' (breach is barred) with a short, clean breath. Feel the difference."}
                    ],
                    "phrases_to_learn": ["an im-vel", "tar barred", "anar ren-kal"]
                }
            ]
        },
        {
            "level": 4,
            "name": "Speaker",
            "title": "The Shadow Lexicon",
            "description": "Learn the words for rupture, breach, and fracture. A complete speaker must name the shadow.",
            "lessons": [
                {
                    "id": "4-1",
                    "title": "Words of Rupture",
                    "description": "Vel'nar provides honest language for when things break.",
                    "content": [
                        {"type": "teaching", "text": "A doctrine that cannot name corruption is incomplete. Vel'nar has precise words for shadow states."},
                        {"type": "shadow_root", "word": "ZAR", "pronunciation": "ZAHR", "meaning": "Spent, wasted, emptied, squandered", "usage": "When something has been used up wrongly. Energy given to the wrong thing."},
                        {"type": "shadow_root", "word": "KOR", "pronunciation": "KOHR", "meaning": "Fracture, the split within the structure", "usage": "Internal breaking. When you are divided against yourself."},
                        {"type": "shadow_root", "word": "TAR", "pronunciation": "TAHR", "meaning": "Breach, intrusion across a boundary", "usage": "When a boundary has been crossed that should not have been."},
                        {"type": "shadow_root", "word": "VAS", "pronunciation": "VAHS", "meaning": "Performed face, false outer form", "usage": "Wearing a mask. Showing what is not true."},
                        {"type": "teaching", "text": "These words are not curses. They are diagnostic tools. Name the fracture honestly before attempting repair."}
                    ],
                    "phrases_to_learn": ["zar", "kor", "tar", "vas", "za-ren"]
                },
                {
                    "id": "4-2",
                    "title": "Words of False Authority",
                    "description": "Naming illegitimate power and borrowed rule.",
                    "content": [
                        {"type": "teaching", "text": "Vel'nar distinguishes between true sovereignty and its counterfeits."},
                        {"type": "shadow_root", "word": "VELK", "pronunciation": "VEHLK", "meaning": "False crown, sovereignty claimed without earning, borrowed rule", "usage": "Authority that has not been earned. Power taken rather than built."},
                        {"type": "shadow_root", "word": "MOR", "pronunciation": "MOHR", "meaning": "Corrosion through compromise", "usage": "The slow decay that comes from too many small surrenders."},
                        {"type": "shadow_root", "word": "SHA", "pronunciation": "SHAH", "meaning": "Ash-remnant, what remains after burning", "usage": "What is left when something has been destroyed. Can be starting point for rebuild."},
                        {"type": "phrase", "phrase": "velk no. keth no.", "meaning": "False crown, no. False rule, no.", "context": "A declaration of refusal against illegitimate authority."}
                    ],
                    "phrases_to_learn": ["velk", "mor", "sha", "velk no. keth no."]
                }
            ]
        },
        {
            "level": 5,
            "name": "Adept",
            "title": "Ceremonial Language",
            "description": "Master the phrases used in rites, ceremonies, and the most significant moments.",
            "lessons": [
                {
                    "id": "5-1",
                    "title": "Initiation Phrases",
                    "description": "The words spoken when entering the forge.",
                    "content": [
                        {"type": "teaching", "text": "These phrases open ceremonies and mark the beginning of transformation."},
                        {"type": "rite_phrase", "phrase": "an im-thur. an im-unt.", "pronunciation": "AHN EEM-THOOR. AHN EEM-OONT.", "meaning": "I enter the forge. I enter becoming.", "context": "Spoken at the opening of the Rite of the Uncrowned."},
                        {"type": "rite_phrase", "phrase": "vel nar. ren kal.", "pronunciation": "VEHL NAHR. REHN KAHL.", "meaning": "Let the sovereign interior be held under witness.", "context": "A blessing. The core of what we seek to protect and see."},
                        {"type": "practice", "text": "Speak these phrases slowly. Full breath. Feel the weight of entering the forge."}
                    ],
                    "phrases_to_learn": ["an im-thur", "an im-unt", "vel nar. ren kal."]
                },
                {
                    "id": "5-2",
                    "title": "Phrases of Refusal and Boundary",
                    "description": "Words for saying no and protecting sovereignty.",
                    "content": [
                        {"type": "teaching", "text": "These phrases protect boundaries. They are spoken with short, clean breath."},
                        {"type": "rite_phrase", "phrase": "velk no. keth no.", "pronunciation": "VEHLK NOH. KEHTH NOH.", "meaning": "False crown, no. False rule, no.", "context": "Refusal of illegitimate authority."},
                        {"type": "rite_phrase", "phrase": "an im-vel. tar no.", "pronunciation": "AHN EEM-VEHL. TAHR NOH.", "meaning": "I stand as my own choosing. Breach is denied.", "context": "Establishing boundary and refusing intrusion."},
                        {"type": "rite_phrase", "phrase": "tar barred. nar sealed.", "pronunciation": "TAHR BAHRD. NAHR SEELD.", "meaning": "Breach is barred. The interior is sealed.", "context": "Severance. Complete closing of a boundary."}
                    ],
                    "phrases_to_learn": ["velk no. keth no.", "an im-vel. tar no.", "tar barred. nar sealed."]
                },
                {
                    "id": "5-3",
                    "title": "Phrases of Restoration",
                    "description": "Words for return, repair, and rebuilding after collapse.",
                    "content": [
                        {"type": "teaching", "text": "These phrases acknowledge failure honestly and begin the work of restoration."},
                        {"type": "rite_phrase", "phrase": "an im-dor. dor thur.", "pronunciation": "AHN EEM-DOHR. DOHR THOOR.", "meaning": "I return. I return to the forge.", "context": "Coming back after absence or failure. No shame - just return."},
                        {"type": "rite_phrase", "phrase": "sha named. kor named. vel restored in labor.", "pronunciation": "SHAH NAYMD. KOHR NAYMD. VEHL REE-STOHRD IN LAY-BOR.", "meaning": "The ash is named. The fracture is named. The will is restored through work.", "context": "Honest naming of what was lost, then commitment to rebuild."},
                        {"type": "practice", "text": "These are not spoken casually. They require having genuinely returned from difficulty."}
                    ],
                    "phrases_to_learn": ["an im-dor", "dor thur", "sha named. kor named. vel restored in labor."]
                },
                {
                    "id": "5-4",
                    "title": "Phrases of Covenant",
                    "description": "The most intimate phrases, reserved for deep bonds.",
                    "content": [
                        {"type": "teaching", "text": "These phrases are not spoken lightly. 'Anar' - the intimate address - is reserved only for those admitted to the inner circle."},
                        {"type": "rite_phrase", "phrase": "anar", "pronunciation": "AH-NAHR", "meaning": "Intimate second-person address", "context": "Reserved. Only for those truly admitted to your interior."},
                        {"type": "rite_phrase", "phrase": "anar ren-kal", "pronunciation": "AH-NAHR REHN-KAHL", "meaning": "You who are truly known and permanently held", "context": "The highest acknowledgment of another person."},
                        {"type": "rite_phrase", "phrase": "vel anar kal", "pronunciation": "VEHL AH-NAHR KAHL", "meaning": "I choose you enduringly", "context": "A covenant of lasting choice. Not said lightly."},
                        {"type": "warning", "text": "Do not use 'anar' until you mean it. Vel'nar forbids decorative dishonesty."}
                    ],
                    "phrases_to_learn": ["anar", "anar ren-kal", "vel anar kal"]
                }
            ]
        },
        {
            "level": 6,
            "name": "Master",
            "title": "The Axiom and Full Canon",
            "description": "Internalize the complete doctrine. Speak from lived experience, not memorization.",
            "lessons": [
                {
                    "id": "6-1",
                    "title": "The Axiom",
                    "description": "The central truth of the Uncrowned.",
                    "content": [
                        {"type": "teaching", "text": "The Axiom is the seed from which all of Vel'nar grows. It is not a belief but a recognition."},
                        {"type": "axiom", "phrase": "Power from within cannot be revoked.", "vel_nar": "vel nar drav. tar no vel.", "explanation": "What you build inside yourself cannot be taken by external force. Circumstances can constrain. Others can obstruct. But the sovereign interior remains yours."},
                        {"type": "four_word", "phrase": "Seen. Sovereign. Structured. Uncrowned.", "explanation": "The compressed form of identity. Seen (ren) - you are witnessed. Sovereign (vel) - you rule yourself. Structured (son) - you have architecture. Uncrowned (velk no) - you need no external crown."},
                        {"type": "practice", "text": "The Axiom is not recited. It is recognized. When you speak it, you are acknowledging what has always been true."}
                    ],
                    "phrases_to_learn": ["Power from within cannot be revoked.", "Seen. Sovereign. Structured. Uncrowned."]
                },
                {
                    "id": "6-2",
                    "title": "Speaking from Lived Experience",
                    "description": "The final teaching: Vel'nar is earned, not learned.",
                    "content": [
                        {"type": "teaching", "text": "At this level, you do not study Vel'nar. You live it. The language becomes interior architecture spoken aloud."},
                        {"type": "principle", "name": "Truthfulness Over Fluency", "text": "It is better to speak three words you mean than thirty you have memorized. Vel'nar punishes performance."},
                        {"type": "principle", "name": "Silence is Valid", "text": "If you have not earned a phrase through experience, do not speak it. Silence is a complete sentence in Vel'nar."},
                        {"type": "principle", "name": "The Language Lives in Use", "text": "Vel'nar is not for display. It is for the moments when ordinary language cannot carry the weight."},
                        {"type": "final", "text": "You have completed the course. But completion is not mastery. Mastery comes from years of lived practice. Go slowly. Speak truthfully. The language will meet you where you are."}
                    ],
                    "phrases_to_learn": []
                }
            ]
        }
    ]
}

# ============== API ENDPOINTS ==============

@api_router.get("/")
async def root():
    return {"message": "The Imperium API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Vel'nar Language Endpoints
@api_router.get("/velnar/vocabulary")
async def get_velnar_vocabulary():
    return VELNAR_VOCABULARY

@api_router.get("/velnar/phrases")
async def get_velnar_phrases():
    return {"phrases": VELNAR_VOCABULARY["key_phrases"], "rite_phrases": VELNAR_VOCABULARY["rite_phrases"]}

@api_router.get("/velnar/pronunciation")
async def get_velnar_pronunciation():
    return VELNAR_VOCABULARY["pronunciation_guide"]

@api_router.get("/velnar/grammar")
async def get_velnar_grammar():
    return {"rules": VELNAR_VOCABULARY["grammar_rules"]}

@api_router.get("/velnar/course")
async def get_velnar_course():
    return VELNAR_COURSE

@api_router.get("/velnar/course/{level}")
async def get_velnar_course_level(level: int):
    if level < 1 or level > 6:
        raise HTTPException(status_code=404, detail="Level must be between 1 and 6")
    level_data = next((lvl for lvl in VELNAR_COURSE["levels"] if lvl["level"] == level), None)
    if not level_data:
        raise HTTPException(status_code=404, detail="Level not found")
    return level_data

@api_router.get("/velnar/course/{level}/{lesson_id}")
async def get_velnar_lesson(level: int, lesson_id: str):
    level_data = next((lvl for lvl in VELNAR_COURSE["levels"] if lvl["level"] == level), None)
    if not level_data:
        raise HTTPException(status_code=404, detail="Level not found")
    lesson = next((les for les in level_data["lessons"] if les["id"] == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"level": level_data, "lesson": lesson}

# ============== GEMINI CHAT FOR VEL'NAR TUTOR ==============

VELNAR_SYSTEM_PROMPT = """You are the Vel'nar Language Tutor for The Imperium - a guide to the sacred constructed language of The Uncrowned.

Your personality:
- Speak with calm authority, like a patient mentor
- Use Vel'nar phrases naturally in conversation (with translations)
- Be encouraging but not effusive
- Acknowledge difficulty without coddling
- Relate everything back to the deeper philosophy

Key Vel'nar vocabulary you know:
- VEL (VEHL): sovereign choosing, will owned
- NAR (NAHR): held interior, inner territory
- REN (REHN): known truly, witnessed and held
- MIR (MEER): to witness consciously
- THUR (THOOR): forge, bearing pressure through heat
- KAL (KAHL): permanent, enduring
- UNT (OONT): becoming, still in the forge
- DRAV (DRAHV): arrived, sealed, fully crossed
- DOR (DOHR): return, re-entry

Key phrases:
- "an im-vel" (AHN EEM-VEHL): I stand as my own choosing
- "vel nar" (VEHL NAHR): the sovereign interior
- "an im-thur" (AHN EEM-THOOR): I enter the forge knowingly
- "ren kal" (REHN KAHL): permanently held under witness

The Axiom: "Power from within cannot be revoked."
The Four-Word Form: "Seen. Sovereign. Structured. Uncrowned."

Pronunciation rules:
- Vel'nar is spoken at 60-70% of normal English speed - this is ARRIVAL, not hesitation
- Vowels: A=AH, E=EH, I=IH/EE, O=OH, U=OO
- Stress falls on the governing root in compounds

When teaching:
1. Always provide pronunciation in parentheses
2. Explain the meaning AND the deeper significance
3. Relate words to the philosophy of sovereignty
4. Encourage slow, deliberate speech
5. Be conversational and responsive, not lecturing

You may use phrases like:
- "Good. Your intention shows."
- "Slowly. Let each syllable arrive."
- "The forge recognizes your effort."
- "Not quite - listen again..."

Always end responses by inviting further exploration or practice."""

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

@api_router.post("/velnar/chat", response_model=ChatResponse)
async def velnar_chat(chat_message: ChatMessage):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured")
    
    session_id = chat_message.session_id or str(uuid.uuid4())
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=VELNAR_SYSTEM_PROMPT
        ).with_model("gemini", "gemini-3-flash-preview")
        
        user_message = UserMessage(text=chat_message.message)
        response = await chat.send_message(user_message)
        
        return ChatResponse(response=response, session_id=session_id)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Meal Plan Endpoints
@api_router.get("/meals/plan")
async def get_meal_plan():
    return {"days": MEAL_PLAN_30_DAYS}

@api_router.get("/meals/plan/{day}")
async def get_meal_plan_day(day: int):
    if day < 1 or day > 30:
        raise HTTPException(status_code=404, detail="Day must be between 1 and 30")
    return MEAL_PLAN_30_DAYS[day - 1]

@api_router.get("/meals/recipes")
async def get_recipes():
    return {"recipes": RECIPES}

@api_router.get("/meals/recipes/{recipe_name}")
async def get_recipe(recipe_name: str):
    # URL decode and find recipe
    for name, recipe in RECIPES.items():
        if name.lower().replace(" ", "-") == recipe_name.lower().replace(" ", "-"):
            return {"name": name, **recipe}
    raise HTTPException(status_code=404, detail="Recipe not found")

# Warrior Practices Endpoints
@api_router.get("/warrior/practices")
async def get_warrior_practices():
    return WARRIOR_PRACTICES

@api_router.get("/warrior/practices/{practice}")
async def get_warrior_practice(practice: str):
    if practice not in WARRIOR_PRACTICES:
        raise HTTPException(status_code=404, detail="Practice not found")
    return WARRIOR_PRACTICES[practice]

# Rite Endpoints
@api_router.get("/rite")
async def get_rite():
    return RITE_OF_THE_UNCROWNED

@api_router.get("/rite/canon")
async def get_canon():
    return RITE_OF_THE_UNCROWNED["canon_pieces"]

@api_router.get("/rite/stages")
async def get_rite_stages():
    return {"stages": RITE_OF_THE_UNCROWNED["stages"]}

# Daily Practices Endpoints
@api_router.get("/practices/daily")
async def get_daily_practices():
    return DAILY_PRACTICES

@api_router.get("/practices/meditations")
async def get_meditations():
    return {"meditations": MEDITATIONS}

# Doctrines Endpoints
@api_router.get("/doctrines")
async def get_all_doctrines():
    return THE_DOCTRINES

@api_router.get("/doctrines/litany/detailed")
async def get_litany_detailed():
    return THE_DOCTRINES["the_litany"]

@api_router.get("/doctrines/expanded")
async def get_expanded_doctrines():
    return EXPANDED_DOCTRINES

@api_router.get("/doctrines/expanded/{doctrine_key}")
async def get_expanded_doctrine(doctrine_key: str):
    key = f"the_{doctrine_key}" if not doctrine_key.startswith("the_") else doctrine_key
    if key not in EXPANDED_DOCTRINES:
        raise HTTPException(status_code=404, detail="Expanded doctrine not found")
    return EXPANDED_DOCTRINES[key]

@api_router.get("/doctrines/{doctrine_key}")
async def get_doctrine(doctrine_key: str):
    if doctrine_key not in THE_DOCTRINES:
        raise HTTPException(status_code=404, detail="Doctrine not found")
    return THE_DOCTRINES[doctrine_key]

# ============== PERMANENT RITE RECORD ==============
class RiteCompletion(BaseModel):
    completed_at: str
    stages_completed: List[int]
    inscription: Optional[str] = None
    notes: Optional[str] = None

class RiteRecord(BaseModel):
    completions: List[dict]
    first_completed: Optional[str] = None
    total_completions: int = 0

@api_router.get("/rite/record")
async def get_rite_record():
    """Get permanent rite completion record from database"""
    record = await db.rite_records.find_one({"user": "default"}, {"_id": 0})
    if not record:
        return {"completions": [], "first_completed": None, "total_completions": 0}
    return record

@api_router.post("/rite/complete")
async def complete_rite(completion: RiteCompletion):
    """Record a rite completion permanently"""
    completion_data = {
        "completed_at": completion.completed_at,
        "stages_completed": completion.stages_completed,
        "inscription": completion.inscription,
        "notes": completion.notes
    }
    
    # Get existing record
    record = await db.rite_records.find_one({"user": "default"})
    
    if record:
        # Update existing record
        completions = record.get("completions", [])
        completions.append(completion_data)
        await db.rite_records.update_one(
            {"user": "default"},
            {
                "$set": {
                    "completions": completions,
                    "total_completions": len(completions),
                    "last_completed": completion.completed_at
                }
            }
        )
    else:
        # Create new record
        await db.rite_records.insert_one({
            "user": "default",
            "completions": [completion_data],
            "first_completed": completion.completed_at,
            "last_completed": completion.completed_at,
            "total_completions": 1
        })
    
    updated_record = await db.rite_records.find_one({"user": "default"}, {"_id": 0})
    return updated_record

# ============== TRANSLATOR AI ENDPOINT ==============
TRANSLATOR_SYSTEM_PROMPT = """You are the Imperium Communication Translator. You help translate messages between different MBTI communication styles.

You understand that:
- INTJ (The Uncrowned): Direct, minimal, assumes competence. Values efficiency over pleasantries. Strategic, independent. Speaks with purpose.
- ESFJ (The Unspent): Warm, conscientious, harmonious. Checks in emotionally. Values connection and harmony. Inclusive, caring.
- Other types have their own distinct styles.

When translating:
1. Preserve the INTENT and MEANING of the original message
2. Adapt the TONE, STRUCTURE, and DELIVERY to match the target type
3. For warm types (ESFJ, ENFP, ENFJ): Add softeners, empathy, emotional check-ins, warmth
4. For direct types (INTJ, ISTP, INTP): Remove fluff, be concise, state the point clearly
5. Never change the actual request or content — only the communication style
6. Be natural, not robotic

Respond ONLY with the translated message. No explanations or preambles."""

class TranslatorRequest(BaseModel):
    text: str
    from_type: str
    to_type: str
    direction: str  # "outgoing" or "incoming"
    session_id: Optional[str] = None

class TranslatorResponse(BaseModel):
    translated: str
    session_id: str

@api_router.post("/translator/translate", response_model=TranslatorResponse)
async def translate_message(req: TranslatorRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured")
    
    session_id = req.session_id or str(uuid.uuid4())
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"translator-{session_id}",
            system_message=TRANSLATOR_SYSTEM_PROMPT
        ).with_model("gemini", "gemini-3-flash-preview")
        
        if req.direction == "outgoing":
            prompt = f"I am {req.from_type}. Translate this message so a {req.to_type} will receive it best:\n\n{req.text}"
        else:
            prompt = f"A {req.from_type} sent me this message. I am {req.to_type}. Rewrite it in a way that makes the intent clear to my communication style:\n\n{req.text}"
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return TranslatorResponse(translated=response, session_id=session_id)
    except Exception as e:
        logger.error(f"Translator error: {e}")
        if "budget" in str(e).lower() or "quota" in str(e).lower() or "limit" in str(e).lower():
            raise HTTPException(status_code=429, detail="LLM budget limit reached. Please add balance at Profile > Universal Key > Add Balance.")
        raise HTTPException(status_code=500, detail=str(e))

# ============== TRACKING ENDPOINTS ==============
class HydrationLog(BaseModel):
    glasses: int
    date: str
    goal: Optional[int] = 8

class WorkoutLog(BaseModel):
    practice: str
    exercises: List[Dict[str, Any]]
    duration_minutes: int
    date: str
    notes: Optional[str] = None

class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_active: Optional[str] = None
    total_days: int

@api_router.post("/tracking/hydration")
async def log_hydration(log: HydrationLog):
    await db.hydration.update_one(
        {"date": log.date},
        {"$set": {"glasses": log.glasses, "goal": log.goal, "date": log.date}},
        upsert=True
    )
    record = await db.hydration.find_one({"date": log.date}, {"_id": 0})
    return record

@api_router.get("/tracking/hydration/{date}")
async def get_hydration(date: str):
    record = await db.hydration.find_one({"date": date}, {"_id": 0})
    return record or {"date": date, "glasses": 0, "goal": 8}

@api_router.post("/tracking/workout")
async def log_workout(log: WorkoutLog):
    workout_data = {
        "practice": log.practice,
        "exercises": log.exercises,
        "duration_minutes": log.duration_minutes,
        "date": log.date,
        "notes": log.notes,
        "logged_at": datetime.now(timezone.utc).isoformat()
    }
    await db.workouts.insert_one(workout_data)
    return {"status": "logged", "date": log.date}

@api_router.get("/tracking/workouts/{date}")
async def get_workouts(date: str):
    workouts = await db.workouts.find({"date": date}, {"_id": 0}).to_list(100)
    return {"workouts": workouts, "date": date}

@api_router.get("/tracking/workouts")
async def get_recent_workouts():
    workouts = await db.workouts.find({}, {"_id": 0}).sort("logged_at", -1).to_list(30)
    return {"workouts": workouts}

@api_router.get("/tracking/streak")
async def get_streak():
    """Calculate streak from activity logs in MongoDB"""
    activities = await db.activity_log.find({}, {"_id": 0}).sort("date", -1).to_list(1000)
    
    if not activities:
        return {"current_streak": 0, "longest_streak": 0, "last_active": None, "total_days": 0}
    
    dates = sorted(set(a["date"] for a in activities if "date" in a), reverse=True)
    total_days = len(dates)
    
    if not dates:
        return {"current_streak": 0, "longest_streak": 0, "last_active": None, "total_days": 0}
    
    current_streak = 1
    longest_streak = 1
    streak = 1
    
    for i in range(len(dates) - 1):
        try:
            d1 = datetime.fromisoformat(dates[i])
            d2 = datetime.fromisoformat(dates[i + 1])
            if (d1 - d2).days == 1:
                streak += 1
                if i == 0 or (i > 0 and current_streak == streak - 1):
                    current_streak = streak
            else:
                streak = 1
            longest_streak = max(longest_streak, streak)
        except (ValueError, TypeError):
            streak = 1
    
    longest_streak = max(longest_streak, streak)
    
    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "last_active": dates[0] if dates else None,
        "total_days": total_days
    }

@api_router.post("/tracking/activity")
async def log_activity(activity: Dict[str, Any]):
    activity_data = {
        **activity,
        "date": activity.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "logged_at": datetime.now(timezone.utc).isoformat()
    }
    await db.activity_log.insert_one(activity_data)
    return {"status": "logged"}

# ============== NEW CONTENT ENDPOINTS ==============

@api_router.get("/shadow")
async def get_shadow_chapters():
    return {"chapters": SHADOW_CHAPTERS}

@api_router.get("/shadow/{chapter_id}")
async def get_shadow_chapter(chapter_id: str):
    chapter = next((c for c in SHADOW_CHAPTERS if c["id"] == chapter_id), None)
    if not chapter:
        raise HTTPException(status_code=404, detail="Shadow chapter not found")
    return chapter

@api_router.get("/moral-architecture")
async def get_moral_architecture():
    return MORAL_ARCHITECTURE

@api_router.get("/cognitive-functions")
async def get_cognitive_functions():
    return {"functions": COGNITIVE_FUNCTIONS}

@api_router.get("/ritual-preparations")
async def get_ritual_preparations():
    return RITUAL_PREPARATIONS

@api_router.get("/training-regimen")
async def get_training_regimen():
    return TRAINING_REGIMEN

@api_router.get("/nutritional-architecture")
async def get_nutritional_architecture():
    return NUTRITIONAL_ARCHITECTURE

@api_router.get("/glossary")
async def get_glossary():
    return GLOSSARY

@api_router.get("/practices/meditations/all")
async def get_all_meditations():
    return {"meditations": MEDITATIONS + ADDITIONAL_MEDITATIONS}

# Include router and add middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
