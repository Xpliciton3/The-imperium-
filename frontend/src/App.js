import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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
              <Route index element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />

              <Route path="/today" element={<Dashboard />} />
              <Route path="/planner" element={<DailyPlanner />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/meals" element={<MealPlan />} />

              <Route path="/tutor" element={<VelnarTutor />} />
              <Route path="/velnar" element={<VelnarLanguageGuide />} />
              <Route path="/velnar-guide" element={<VelnarLanguageGuide />} />
              <Route path="/translator" element={<Translator />} />

              <Route path="/rite" element={<RiteOfUncrowned />} />
              <Route path="/meditations" element={<Meditations />} />
              <Route path="/warrior" element={<WarriorPractices />} />
              <Route path="/shadow" element={<ShadowWork />} />
              <Route path="/training" element={<TrainingRegimen />} />
              <Route path="/nutrition" element={<NutritionalArchitecture />} />
              <Route path="/preparations" element={<RitualPreparations />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/doctrine" element={<DoctrinePage />} />

              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ImperiumProvider>
    </ErrorBoundary>
  );
}

export default App;
