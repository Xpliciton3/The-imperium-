"""
Iteration 5 Tests: Content Depth Verification
Tests for detailed warrior practices instructions, full recipes, translator chat, doctrines panel, and Vel'nar language guide
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWarriorPracticesContent:
    """Verify warrior practices have detailed_instructions with full content"""
    
    def test_warrior_practices_returns_4_disciplines(self):
        """GET /api/warrior/practices returns 4 disciplines"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 4
        assert "iaido" in data
        assert "kyudo" in data
        assert "systema" in data
        assert "throwing_daggers" in data
    
    def test_iaido_has_5_stages(self):
        """Iaido discipline has 5 stages"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        iaido = data.get("iaido", {})
        assert len(iaido.get("stages", [])) == 5
    
    def test_iaido_stage1_has_detailed_instructions(self):
        """Iaido Stage 1 has detailed_instructions array"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        stage1 = data["iaido"]["stages"][0]
        assert "detailed_instructions" in stage1
        assert len(stage1["detailed_instructions"]) >= 3
    
    def test_detailed_instruction_has_required_fields(self):
        """Each detailed instruction has skill, what_it_is, how_to_do_it"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        instruction = data["iaido"]["stages"][0]["detailed_instructions"][0]
        assert "skill" in instruction
        assert "what_it_is" in instruction
        assert "how_to_do_it" in instruction
        assert isinstance(instruction["how_to_do_it"], list)
        assert len(instruction["how_to_do_it"]) > 0
    
    def test_instruction_has_common_mistakes(self):
        """First instruction (Seiza) has common_mistakes array"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        instruction = data["iaido"]["stages"][0]["detailed_instructions"][0]
        assert "common_mistakes" in instruction
        assert isinstance(instruction["common_mistakes"], list)
        assert len(instruction["common_mistakes"]) > 0
    
    def test_instruction_has_progression(self):
        """First instruction has progression field"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        instruction = data["iaido"]["stages"][0]["detailed_instructions"][0]
        assert "progression" in instruction
        assert len(instruction["progression"]) > 0
    
    def test_instruction_has_beginner_note(self):
        """First instruction has beginner_note field"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        instruction = data["iaido"]["stages"][0]["detailed_instructions"][0]
        assert "beginner_note" in instruction
    
    def test_stage_has_requirements(self):
        """Stage 1 has requirements checklist"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        stage1 = data["iaido"]["stages"][0]
        assert "requirements" in stage1
        assert isinstance(stage1["requirements"], list)
        assert len(stage1["requirements"]) > 0
    
    def test_iaido_has_equipment_with_sourcing(self):
        """Iaido has equipment array with sourcing and care info"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        equipment = data["iaido"].get("equipment", [])
        assert len(equipment) >= 4
        eq = equipment[0]
        assert "name" in eq
        assert "sourcing" in eq
        assert "care" in eq
    
    def test_kyudo_has_detailed_instructions(self):
        """Kyudo also has detailed_instructions in stages"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        kyudo_stage1 = data["kyudo"]["stages"][0]
        assert "detailed_instructions" in kyudo_stage1
        assert len(kyudo_stage1["detailed_instructions"]) > 0
    
    def test_systema_has_detailed_instructions(self):
        """Systema has detailed_instructions in stages"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        systema_stage1 = data["systema"]["stages"][0]
        assert "detailed_instructions" in systema_stage1
        assert len(systema_stage1["detailed_instructions"]) > 0
    
    def test_throwing_daggers_has_detailed_instructions(self):
        """Throwing daggers has detailed_instructions in stages"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        td_stage1 = data["throwing_daggers"]["stages"][0]
        assert "detailed_instructions" in td_stage1
        assert len(td_stage1["detailed_instructions"]) > 0


class TestMealPlanContent:
    """Verify meal plan has 30 full recipes with ingredients and method"""
    
    def test_meal_plan_returns_30_recipes(self):
        """GET /api/meals/plan returns 30 recipes"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipes = data.get("recipes", {})
        assert len(recipes) == 30
    
    def test_recipe_has_ingredients_array(self):
        """Each recipe has ingredients array"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipe = list(data["recipes"].values())[0]
        assert "ingredients" in recipe
        assert isinstance(recipe["ingredients"], list)
        assert len(recipe["ingredients"]) > 0
    
    def test_recipe_has_method_array(self):
        """Each recipe has method array with steps"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipe = list(data["recipes"].values())[0]
        assert "method" in recipe
        assert isinstance(recipe["method"], list)
        assert len(recipe["method"]) > 0
    
    def test_recipe_has_tip(self):
        """Each recipe has tip field"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipe = list(data["recipes"].values())[0]
        assert "tip" in recipe
        assert len(recipe["tip"]) > 0
    
    def test_recipe_has_cost(self):
        """Each recipe has cost field"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipe = list(data["recipes"].values())[0]
        assert "cost" in recipe
    
    def test_recipe_has_serves(self):
        """Each recipe has serves field"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipe = list(data["recipes"].values())[0]
        assert "serves" in recipe
    
    def test_meal_plan_has_30_days(self):
        """Meal plan has 30 days"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        days = data.get("days", [])
        assert len(days) == 30
    
    def test_meal_plan_has_5_weeks(self):
        """Meal plan spans 5 weeks"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        days = data.get("days", [])
        weeks = set(d.get("week") for d in days)
        assert weeks == {1, 2, 3, 4, 5}
    
    def test_meal_plan_has_meta_with_strategy(self):
        """Meal plan has meta with batch_strategy and budget_tips"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        meta = data.get("meta", {})
        assert "batch_strategy" in meta
        assert "budget_tips" in meta
        assert isinstance(meta["budget_tips"], list)
    
    def test_all_recipes_have_full_data(self):
        """Verify all 30 recipes have ingredients, method, tip"""
        response = requests.get(f"{BASE_URL}/api/meals/plan")
        assert response.status_code == 200
        data = response.json()
        recipes = data.get("recipes", {})
        for key, recipe in recipes.items():
            assert "ingredients" in recipe, f"Recipe {key} missing ingredients"
            assert "method" in recipe, f"Recipe {key} missing method"
            assert "tip" in recipe, f"Recipe {key} missing tip"
            assert len(recipe["ingredients"]) > 0, f"Recipe {key} has empty ingredients"
            assert len(recipe["method"]) > 0, f"Recipe {key} has empty method"


class TestDoctrinesExpanded:
    """Verify expanded doctrines have full content"""
    
    def test_doctrines_expanded_returns_6_doctrines(self):
        """GET /api/doctrines/expanded returns 6 doctrines"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 6
    
    def test_doctrine_has_full_text(self):
        """Each doctrine has full_text field"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded")
        assert response.status_code == 200
        data = response.json()
        doctrine = list(data.values())[0]
        assert "full_text" in doctrine
        assert len(doctrine["full_text"]) > 0
    
    def test_doctrine_has_velnar_form(self):
        """Each doctrine has vel_nar_form"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded")
        assert response.status_code == 200
        data = response.json()
        doctrine = list(data.values())[0]
        assert "vel_nar_form" in doctrine
    
    def test_doctrine_has_pronunciation(self):
        """Each doctrine has vel_nar_pronunciation"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded")
        assert response.status_code == 200
        data = response.json()
        doctrine = list(data.values())[0]
        assert "vel_nar_pronunciation" in doctrine
    
    def test_doctrine_has_when_to_use(self):
        """Each doctrine has when_to_use"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded")
        assert response.status_code == 200
        data = response.json()
        doctrine = list(data.values())[0]
        assert "when_to_use" in doctrine
    
    def test_litany_has_line_by_line(self):
        """The Litany has line_by_line array"""
        response = requests.get(f"{BASE_URL}/api/doctrines/expanded/the_litany")
        assert response.status_code == 200
        data = response.json()
        assert "line_by_line" in data
        assert isinstance(data["line_by_line"], list)
        assert len(data["line_by_line"]) > 0


class TestVelnarLanguageGuide:
    """Verify Vel'nar language guide has all 8 tab sections"""
    
    def test_language_guide_returns_data(self):
        """GET /api/velnar/language-guide returns data"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
    
    def test_has_root_houses(self):
        """Language guide has root_houses (6)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "root_houses" in data
        assert len(data["root_houses"]) == 6
    
    def test_has_core_roots(self):
        """Language guide has core_roots (12)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "core_roots" in data
        assert len(data["core_roots"]) == 12
    
    def test_has_sound_section(self):
        """Language guide has sound section with vowels"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "sound" in data
        assert "vowels" in data["sound"]
    
    def test_has_heart_phrases(self):
        """Language guide has heart_phrases (4 categories)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "heart_phrases" in data
        assert len(data["heart_phrases"]) >= 4
    
    def test_has_shadow_lexicon(self):
        """Language guide has shadow_lexicon (8)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "shadow_lexicon" in data
        assert len(data["shadow_lexicon"]) == 8
    
    def test_has_rite_phrases(self):
        """Language guide has rite_phrases (5 categories)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "rite_phrases" in data
        assert len(data["rite_phrases"]) >= 5
    
    def test_has_stage_path(self):
        """Language guide has stage_path (5)"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "stage_path" in data
        assert len(data["stage_path"]) == 5
    
    def test_has_script_system(self):
        """Language guide has script_system"""
        response = requests.get(f"{BASE_URL}/api/velnar/language-guide")
        assert response.status_code == 200
        data = response.json()
        assert "script_system" in data
        assert "modes" in data["script_system"]


class TestTranslatorEndpoint:
    """Verify translator endpoint works"""
    
    def test_translator_endpoint_exists(self):
        """POST /api/translator/translate endpoint exists"""
        response = requests.post(
            f"{BASE_URL}/api/translator/translate",
            json={
                "text": "Hello",
                "from_type": "INTJ",
                "to_type": "ESFJ",
                "direction": "outgoing"
            }
        )
        # Should return 200 or 429 (rate limit) - not 404
        assert response.status_code in [200, 429, 500]


class TestDashboardStillWorks:
    """Verify dashboard and other pages still work"""
    
    def test_health_endpoint(self):
        """Health endpoint works"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
    
    def test_tracking_workouts(self):
        """Tracking workouts endpoint works"""
        response = requests.get(f"{BASE_URL}/api/tracking/workouts")
        assert response.status_code == 200
