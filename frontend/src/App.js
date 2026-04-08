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
          <Route element={<Layout />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/planner' element={<DailyPlanner />} />
            <Route path='/calendar' element={<CalendarPage />} />
            <Route path='/meals' element={<MealPlan />} />
            <Route path='/tutor' element={<VelnarTutor />} />
            <Route path='/warrior' element={<WarriorPractices />} />
            <Route path='/rite' element={<RiteOfUncrowned />} />
            <Route path='/glossary' element={<GlossaryPage />} />
            <Route path='/doctrine' element={<DoctrinePage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ImperiumProvider>
  );
}

export default App;
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
