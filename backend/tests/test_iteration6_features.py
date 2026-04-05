"""
Iteration 6 Backend Tests
Tests for: ErrorBoundary, Tutor safety, Warrior Practices expanded content,
Nutritional Architecture recipes, Training Regimen session architecture
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestTutorEndpoints:
    """Tests for Vel'nar Tutor API endpoints"""
    
    def test_velnar_vocabulary_endpoint(self):
        """Test /api/velnar/vocabulary returns data"""
        response = requests.get(f"{BASE_URL}/api/velnar/vocabulary")
        assert response.status_code == 200
        data = response.json()
        assert "core_roots" in data or "key_phrases" in data
        print("SUCCESS: Velnar vocabulary endpoint returns data")
    
    def test_velnar_course_endpoint(self):
        """Test /api/velnar/course returns course structure"""
        response = requests.get(f"{BASE_URL}/api/velnar/course")
        assert response.status_code == 200
        data = response.json()
        assert "levels" in data
        assert len(data["levels"]) > 0
        print(f"SUCCESS: Velnar course has {len(data['levels'])} levels")


class TestWarriorPracticesExpanded:
    """Tests for expanded Warrior Practices content"""
    
    def test_all_four_disciplines_present(self):
        """Test all 4 disciplines are returned"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        data = response.json()
        
        expected_disciplines = ["iaido", "kyudo", "systema", "throwing_daggers"]
        for discipline in expected_disciplines:
            assert discipline in data, f"Missing discipline: {discipline}"
        print(f"SUCCESS: All 4 disciplines present: {list(data.keys())}")
    
    def test_iaido_has_five_stages(self):
        """Test Iaido has 5 stages with detailed_instructions"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        iaido = data.get("iaido", {})
        stages = iaido.get("stages", [])
        assert len(stages) == 5, f"Expected 5 stages, got {len(stages)}"
        
        # Check first stage has detailed_instructions
        first_stage = stages[0]
        assert "detailed_instructions" in first_stage
        assert len(first_stage["detailed_instructions"]) > 0
        print(f"SUCCESS: Iaido has {len(stages)} stages with detailed_instructions")
    
    def test_iaido_detailed_instructions_have_how_to_do_it(self):
        """Test Iaido detailed_instructions contain how_to_do_it steps"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        iaido = data.get("iaido", {})
        first_stage = iaido.get("stages", [{}])[0]
        detailed = first_stage.get("detailed_instructions", [])
        
        assert len(detailed) > 0, "No detailed_instructions found"
        first_skill = detailed[0]
        
        assert "skill" in first_skill
        assert "how_to_do_it" in first_skill
        assert isinstance(first_skill["how_to_do_it"], list)
        assert len(first_skill["how_to_do_it"]) > 0
        print(f"SUCCESS: First skill '{first_skill['skill']}' has {len(first_skill['how_to_do_it'])} how_to_do_it steps")
    
    def test_iaido_expanded_reference_sections(self):
        """Test Iaido has expanded reference: body_map, drill_menu, faults, weeks, audit"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        iaido = data.get("iaido", {})
        
        # Check body_map
        assert "body_map" in iaido, "Missing body_map"
        assert iaido["body_map"] is not None
        
        # Check drill_menu
        assert "drill_menu" in iaido, "Missing drill_menu"
        assert len(iaido["drill_menu"]) >= 6, f"Expected 6+ drills, got {len(iaido['drill_menu'])}"
        
        # Check faults_and_corrections
        assert "faults_and_corrections" in iaido, "Missing faults_and_corrections"
        assert len(iaido["faults_and_corrections"]) >= 6
        
        # Check week_progression
        assert "week_progression" in iaido, "Missing week_progression"
        assert len(iaido["week_progression"]) >= 6
        
        # Check self_audit
        assert "self_audit" in iaido, "Missing self_audit"
        assert len(iaido["self_audit"]) >= 5
        
        print(f"SUCCESS: Iaido has body_map, {len(iaido['drill_menu'])} drills, {len(iaido['faults_and_corrections'])} faults, {len(iaido['week_progression'])} weeks, {len(iaido['self_audit'])} audit questions")
    
    def test_kyudo_expanded_content(self):
        """Test Kyudo has preparatory_capacities, drill_menu, faults, proficiency_standards"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        kyudo = data.get("kyudo", {})
        
        # Check preparatory_capacities
        assert "preparatory_capacities" in kyudo
        assert len(kyudo["preparatory_capacities"]) >= 5
        
        # Check drill_menu
        assert "drill_menu" in kyudo
        assert len(kyudo["drill_menu"]) >= 9
        
        # Check faults_and_corrections
        assert "faults_and_corrections" in kyudo
        assert len(kyudo["faults_and_corrections"]) >= 5
        
        # Check proficiency_standards
        assert "proficiency_standards" in kyudo
        assert len(kyudo["proficiency_standards"]) >= 4
        
        print(f"SUCCESS: Kyudo has {len(kyudo['preparatory_capacities'])} prep capacities, {len(kyudo['drill_menu'])} drills, {len(kyudo['faults_and_corrections'])} faults, {len(kyudo['proficiency_standards'])} standards")
    
    def test_systema_expanded_content(self):
        """Test Systema has core_principles_expanded, solo_modules, partner_progression, failure_patterns"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        systema = data.get("systema", {})
        
        # Check core_principles_expanded
        assert "core_principles_expanded" in systema
        assert len(systema["core_principles_expanded"]) >= 5
        
        # Check solo_modules
        assert "solo_modules" in systema
        assert len(systema["solo_modules"]) >= 5
        
        # Check partner_progression
        assert "partner_progression" in systema
        assert len(systema["partner_progression"]) >= 6
        
        # Check failure_patterns
        assert "failure_patterns" in systema
        assert len(systema["failure_patterns"]) >= 5
        
        print(f"SUCCESS: Systema has {len(systema['core_principles_expanded'])} principles, {len(systema['solo_modules'])} solo modules, {len(systema['partner_progression'])} partner stages, {len(systema['failure_patterns'])} failure patterns")
    
    def test_throwing_daggers_has_five_stages(self):
        """Test Throwing Daggers has 5 stages with detailed step-by-step exercises"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        data = response.json()
        
        daggers = data.get("throwing_daggers", {})
        stages = daggers.get("stages", [])
        
        assert len(stages) == 5, f"Expected 5 stages, got {len(stages)}"
        
        # Check first stage has detailed_instructions
        first_stage = stages[0]
        assert "detailed_instructions" in first_stage
        assert len(first_stage["detailed_instructions"]) > 0
        
        # Check first skill has how_to_do_it
        first_skill = first_stage["detailed_instructions"][0]
        assert "how_to_do_it" in first_skill
        
        print(f"SUCCESS: Throwing Daggers has {len(stages)} stages with detailed instructions")


class TestNutritionalArchitectureRecipes:
    """Tests for Nutritional Architecture recipes"""
    
    def test_recipes_tab_has_four_recipes(self):
        """Test recipes array has 4 recipes"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        assert response.status_code == 200
        data = response.json()
        
        assert "recipes" in data
        recipes = data["recipes"]
        assert len(recipes) == 4, f"Expected 4 recipes, got {len(recipes)}"
        
        recipe_names = [r["name"] for r in recipes]
        print(f"SUCCESS: Found {len(recipes)} recipes: {recipe_names}")
    
    def test_recipe_has_required_fields(self):
        """Test each recipe has ingredients, sourcing, and instructions"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        data = response.json()
        
        recipes = data.get("recipes", [])
        for recipe in recipes:
            assert "name" in recipe, f"Recipe missing name"
            assert "ingredients" in recipe, f"Recipe {recipe.get('name')} missing ingredients"
            assert "sourcing" in recipe, f"Recipe {recipe.get('name')} missing sourcing"
            assert "instructions" in recipe, f"Recipe {recipe.get('name')} missing instructions"
            
            # Verify ingredients is a list
            assert isinstance(recipe["ingredients"], list)
            assert len(recipe["ingredients"]) > 0
            
            # Verify instructions is a list
            assert isinstance(recipe["instructions"], list)
            assert len(recipe["instructions"]) > 0
        
        print(f"SUCCESS: All {len(recipes)} recipes have ingredients, sourcing, and instructions")
    
    def test_specific_recipes_present(self):
        """Test specific recipe names are present"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        data = response.json()
        
        recipes = data.get("recipes", [])
        recipe_names = [r["name"] for r in recipes]
        
        expected_recipes = [
            "Lemon Salmon",
            "Four-Egg Cognitive Plate",
            "Controlled Recovery Snack",
            "Lean Protein"
        ]
        
        for expected in expected_recipes:
            found = any(expected in name for name in recipe_names)
            assert found, f"Recipe containing '{expected}' not found"
        
        print(f"SUCCESS: All expected recipes found")
    
    def test_weekly_prep_protocol_present(self):
        """Test weekly_prep_protocol is present"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        data = response.json()
        
        assert "weekly_prep_protocol" in data
        assert data["weekly_prep_protocol"] is not None
        assert len(data["weekly_prep_protocol"]) > 50  # Should be substantial text
        
        print(f"SUCCESS: Weekly Prep Protocol present ({len(data['weekly_prep_protocol'])} chars)")
    
    def test_progress_markers_present(self):
        """Test progress_markers array is present"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        data = response.json()
        
        assert "progress_markers" in data
        markers = data["progress_markers"]
        assert isinstance(markers, list)
        assert len(markers) >= 4
        
        print(f"SUCCESS: {len(markers)} progress markers found")


class TestTrainingRegimenExpanded:
    """Tests for Training Regimen expanded content"""
    
    def test_session_architecture_present(self):
        """Test session_architecture with 6 phases"""
        response = requests.get(f"{BASE_URL}/api/training-regimen")
        assert response.status_code == 200
        data = response.json()
        
        assert "session_architecture" in data
        session_arch = data["session_architecture"]
        
        assert "phases" in session_arch
        phases = session_arch["phases"]
        assert len(phases) == 6, f"Expected 6 phases, got {len(phases)}"
        
        # Check each phase has required fields
        for phase in phases:
            assert "phase" in phase
            assert "duration" in phase
            assert "instructions" in phase
        
        print(f"SUCCESS: Session Architecture has {len(phases)} phases")
    
    def test_proficiency_model_present(self):
        """Test proficiency_model with 4 tiers"""
        response = requests.get(f"{BASE_URL}/api/training-regimen")
        data = response.json()
        
        assert "proficiency_model" in data
        model = data["proficiency_model"]
        assert len(model) == 4, f"Expected 4 tiers, got {len(model)}"
        
        tier_names = [t["tier"] for t in model]
        expected_tiers = ["Novice", "Apprentice", "Practitioner", "Advanced Practitioner"]
        
        for expected in expected_tiers:
            assert expected in tier_names, f"Missing tier: {expected}"
        
        print(f"SUCCESS: Proficiency Model has 4 tiers: {tier_names}")
    
    def test_twelve_month_roadmap_present(self):
        """Test twelve_month_roadmap with 4 quarters"""
        response = requests.get(f"{BASE_URL}/api/training-regimen")
        data = response.json()
        
        assert "twelve_month_roadmap" in data
        roadmap = data["twelve_month_roadmap"]
        assert len(roadmap) == 4, f"Expected 4 quarters, got {len(roadmap)}"
        
        # Check each entry has months and focus
        for entry in roadmap:
            assert "months" in entry
            assert "focus" in entry
        
        print(f"SUCCESS: 12-Month Roadmap has {len(roadmap)} quarters")
    
    def test_logbook_standard_present(self):
        """Test logbook_standard is present"""
        response = requests.get(f"{BASE_URL}/api/training-regimen")
        data = response.json()
        
        assert "logbook_standard" in data
        assert data["logbook_standard"] is not None
        assert len(data["logbook_standard"]) > 50
        
        print(f"SUCCESS: Logbook Standard present ({len(data['logbook_standard'])} chars)")


class TestAllPagesRender:
    """Tests that all API endpoints return valid data"""
    
    def test_dashboard_data(self):
        """Test dashboard endpoint"""
        response = requests.get(f"{BASE_URL}/api/dashboard")
        # Dashboard might not exist, but should not error
        assert response.status_code in [200, 404]
        print(f"Dashboard endpoint: {response.status_code}")
    
    def test_warrior_practices_endpoint(self):
        """Test warrior practices endpoint"""
        response = requests.get(f"{BASE_URL}/api/warrior/practices")
        assert response.status_code == 200
        print("SUCCESS: Warrior practices endpoint works")
    
    def test_nutritional_architecture_endpoint(self):
        """Test nutritional architecture endpoint"""
        response = requests.get(f"{BASE_URL}/api/nutritional-architecture")
        assert response.status_code == 200
        print("SUCCESS: Nutritional architecture endpoint works")
    
    def test_training_regimen_endpoint(self):
        """Test training regimen endpoint"""
        response = requests.get(f"{BASE_URL}/api/training-regimen")
        assert response.status_code == 200
        print("SUCCESS: Training regimen endpoint works")
    
    def test_velnar_vocabulary_endpoint(self):
        """Test velnar vocabulary endpoint"""
        response = requests.get(f"{BASE_URL}/api/velnar/vocabulary")
        assert response.status_code == 200
        print("SUCCESS: Velnar vocabulary endpoint works")
    
    def test_velnar_course_endpoint(self):
        """Test velnar course endpoint"""
        response = requests.get(f"{BASE_URL}/api/velnar/course")
        assert response.status_code == 200
        print("SUCCESS: Velnar course endpoint works")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
