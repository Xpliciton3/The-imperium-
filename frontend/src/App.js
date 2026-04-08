import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ImperiumProvider } from './lib/useImperiumApp';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyPlanner from './pages/DailyPlanner';
import CalendarPage from './pages/CalendarPage';
import MealPlan from './pages/MealPlan';
import VelnarTutor from './pages/VelnarTutor';
import WarriorPractices from './pages/WarriorPractices';
import RiteOfUncrowned from './pages/RiteOfUncrowned';
import GlossaryPage from './pages/GlossaryPage';
import DoctrinePage from './pages/DoctrinePage';

function App() {
  return (
    <ImperiumProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="today" element={<DailyPlanner />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="meals" element={<MealPlan />} />
            <Route path="velnar" element={<VelnarTutor />} />
            <Route path="warrior" element={<WarriorPractices />} />
            <Route path="rite" element={<RiteOfUncrowned />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="doctrine" element={<DoctrinePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ImperiumProvider>
  );
}

export default App;
