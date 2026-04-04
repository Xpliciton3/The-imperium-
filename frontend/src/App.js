import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import VelnarTutor from "@/pages/VelnarTutor";
import Translator from "@/pages/Translator";
import DailyPlanner from "@/pages/DailyPlanner";
import MealPlan from "@/pages/MealPlan";
import WarriorPractices from "@/pages/WarriorPractices";
import RiteOfUncrowned from "@/pages/RiteOfUncrowned";
import Meditations from "@/pages/Meditations";
import CalendarPage from "@/pages/CalendarPage";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="velnar" element={<VelnarTutor />} />
            <Route path="translator" element={<Translator />} />
            <Route path="planner" element={<DailyPlanner />} />
            <Route path="meals" element={<MealPlan />} />
            <Route path="warrior" element={<WarriorPractices />} />
            <Route path="rite" element={<RiteOfUncrowned />} />
            <Route path="meditations" element={<Meditations />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
