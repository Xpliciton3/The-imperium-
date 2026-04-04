#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class ImperiumAPITester:
    def __init__(self, base_url="https://velnar-learn.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                print(f"❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": "Request timeout"
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_health_endpoints(self):
        """Test basic health and info endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("Root API", "GET", "api/", 200)
        
        # Test health check
        self.run_test("Health Check", "GET", "api/health", 200)

    def test_velnar_endpoints(self):
        """Test Vel'nar language endpoints"""
        print("\n" + "="*50)
        print("TESTING VEL'NAR ENDPOINTS")
        print("="*50)
        
        # Test vocabulary
        success, vocab_data = self.run_test("Vel'nar Vocabulary", "GET", "api/velnar/vocabulary", 200)
        if success and isinstance(vocab_data, dict):
            print(f"   ✓ Vocabulary contains {len(vocab_data.get('core_roots', []))} core roots")
        
        # Test phrases
        self.run_test("Vel'nar Phrases", "GET", "api/velnar/phrases", 200)
        
        # Test pronunciation guide
        self.run_test("Vel'nar Pronunciation", "GET", "api/velnar/pronunciation", 200)
        
        # Test grammar
        self.run_test("Vel'nar Grammar", "GET", "api/velnar/grammar", 200)
        
        # Test course structure
        success, course_data = self.run_test("Vel'nar Course", "GET", "api/velnar/course", 200)
        if success and isinstance(course_data, dict):
            levels = course_data.get('levels', [])
            print(f"   ✓ Course contains {len(levels)} levels")
        
        # Test specific course level
        self.run_test("Vel'nar Course Level 1", "GET", "api/velnar/course/1", 200)
        
        # Test invalid course level
        self.run_test("Vel'nar Course Invalid Level", "GET", "api/velnar/course/99", 404)
        
        # Test lesson endpoint
        self.run_test("Vel'nar Lesson", "GET", "api/velnar/course/1/1-1", 200)

    def test_velnar_chat(self):
        """Test Vel'nar chat functionality"""
        print("\n" + "="*50)
        print("TESTING VEL'NAR CHAT")
        print("="*50)
        
        # Test chat endpoint
        chat_data = {
            "message": "Hello, teach me Vel'nar",
            "session_id": "test_session_123"
        }
        
        success, response = self.run_test("Vel'nar Chat", "POST", "api/velnar/chat", 200, chat_data)
        if success and isinstance(response, dict):
            if 'response' in response and 'session_id' in response:
                print(f"   ✓ Chat response received: {response['response'][:100]}...")
                print(f"   ✓ Session ID: {response['session_id']}")
            else:
                print(f"   ⚠️ Chat response missing expected fields")

    def test_meal_endpoints(self):
        """Test meal plan endpoints"""
        print("\n" + "="*50)
        print("TESTING MEAL PLAN ENDPOINTS")
        print("="*50)
        
        # Test full meal plan
        success, meal_data = self.run_test("Full Meal Plan", "GET", "api/meals/plan", 200)
        if success and isinstance(meal_data, dict):
            days = meal_data.get('days', [])
            print(f"   ✓ Meal plan contains {len(days)} days")
        
        # Test specific day
        self.run_test("Meal Plan Day 1", "GET", "api/meals/plan/1", 200)
        
        # Test invalid day
        self.run_test("Meal Plan Invalid Day", "GET", "api/meals/plan/99", 404)
        
        # Test recipes
        success, recipe_data = self.run_test("Recipes", "GET", "api/meals/recipes", 200)
        if success and isinstance(recipe_data, dict):
            recipes = recipe_data.get('recipes', {})
            print(f"   ✓ Recipe database contains {len(recipes)} recipes")

    def test_warrior_endpoints(self):
        """Test warrior practices endpoints"""
        print("\n" + "="*50)
        print("TESTING WARRIOR PRACTICES ENDPOINTS")
        print("="*50)
        
        # Test all practices
        success, warrior_data = self.run_test("All Warrior Practices", "GET", "api/warrior/practices", 200)
        if success and isinstance(warrior_data, dict):
            practices = list(warrior_data.keys())
            print(f"   ✓ Available practices: {', '.join(practices)}")
        
        # Test specific practice
        self.run_test("Iaido Practice", "GET", "api/warrior/practices/iaido", 200)
        
        # Test invalid practice
        self.run_test("Invalid Practice", "GET", "api/warrior/practices/invalid", 404)

    def test_rite_endpoints(self):
        """Test rite endpoints"""
        print("\n" + "="*50)
        print("TESTING RITE ENDPOINTS")
        print("="*50)
        
        # Test rite data
        success, rite_data = self.run_test("Rite of the Uncrowned", "GET", "api/rite", 200)
        if success and isinstance(rite_data, dict):
            stages = rite_data.get('stages', [])
            print(f"   ✓ Rite contains {len(stages)} stages")
            if 'challenge_coin_url' in rite_data:
                print(f"   ✓ Challenge coin URL: {rite_data['challenge_coin_url']}")
        
        # Test canon
        self.run_test("Rite Canon", "GET", "api/rite/canon", 200)
        
        # Test stages
        self.run_test("Rite Stages", "GET", "api/rite/stages", 200)

    def test_practice_endpoints(self):
        """Test daily practices and meditation endpoints"""
        print("\n" + "="*50)
        print("TESTING PRACTICE ENDPOINTS")
        print("="*50)
        
        # Test daily practices
        success, practice_data = self.run_test("Daily Practices", "GET", "api/practices/daily", 200)
        if success and isinstance(practice_data, dict):
            morning = practice_data.get('morning', {})
            evening = practice_data.get('evening', {})
            weekly = practice_data.get('weekly', {})
            print(f"   ✓ Morning practices: {len(morning.get('practices', []))}")
            print(f"   ✓ Evening practices: {len(evening.get('practices', []))}")
            print(f"   ✓ Weekly practices: {len(weekly.get('practices', []))}")
        
        # Test meditations
        success, meditation_data = self.run_test("Meditations", "GET", "api/practices/meditations", 200)
        if success and isinstance(meditation_data, dict):
            meditations = meditation_data.get('meditations', [])
            print(f"   ✓ Available meditations: {len(meditations)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Imperium API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_velnar_endpoints()
        self.test_velnar_chat()
        self.test_meal_endpoints()
        self.test_warrior_endpoints()
        self.test_rite_endpoints()
        self.test_practice_endpoints()
        
        # Print summary
        print("\n" + "="*50)
        print("TEST SUMMARY")
        print("="*50)
        print(f"📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"✅ Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed tests ({len(self.failed_tests)}):")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
                print(f"   • {test['name']}: {error_msg}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = ImperiumAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())