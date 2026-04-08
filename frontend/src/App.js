import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ImperiumProvider } from "./lib/useImperiumApp";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import VelnarTutor from "./pages/VelnarTutor";
import DailyPlanner from "./pages/DailyPlanner";
import Translator from "./pages/Translator";
import RiteOfUncrowned from "./pages/RiteOfUncrowned";
import Meditations from "./pages/Meditations";
import CalendarPage from "./pages/CalendarPage";
import MealPlan from "./pages/MealPlan";
import WarriorPractices from "./pages/WarriorPractices";
import ShadowWork from "./pages/ShadowWork";
import TrainingRegimen from "./pages/TrainingRegimen";
import NutritionalArchitecture from "./pages/NutritionalArchitecture";
import RitualPreparations from "./pages/RitualPreparations";
import GlossaryPage from "./pages/GlossaryPage";
import VelnarLanguageGuide from "./pages/VelnarLanguageGuide";
import DoctrinePage from "./pages/DoctrinePage";

function App() {
  return (
    <ErrorBoundary>
      <ImperiumProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tutor" element={<VelnarTutor />} />
              <Route path="/planner" element={<DailyPlanner />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/rite" element={<RiteOfUncrowned />} />
              <Route path="/meditations" element={<Meditations />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/meals" element={<MealPlan />} />
              <Route path="/warrior" element={<WarriorPractices />} />
              <Route path="/shadow" element={<ShadowWork />} />
              <Route path="/training" element={<TrainingRegimen />} />
              <Route path="/nutrition" element={<NutritionalArchitecture />} />
              <Route path="/preparations" element={<RitualPreparations />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/velnar-guide" element={<VelnarLanguageGuide />} />
              <Route path="/doctrine" element={<DoctrinePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ImperiumProvider>
    </ErrorBoundary>
  );
}

export default App;
