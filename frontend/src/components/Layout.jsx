import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  Utensils, 
  Sword, 
  Crown, 
  Moon, 
  CalendarDays,
  Menu,
  X,
  ScrollText
} from "lucide-react";
import { cn } from "@/lib/utils";
import DoctrinesPanel from "@/components/DoctrinesPanel";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_velnar-learn/artifacts/9g8ehgnc_6221.png";

const navItems = [
  { path: "/", icon: null, label: "Dashboard", exact: true, useLogo: true },
  { path: "/velnar", icon: BookOpen, label: "Vel'nar Tutor" },
  { path: "/planner", icon: Calendar, label: "Daily Planner" },
  { path: "/meals", icon: Utensils, label: "Meal Plan" },
  { path: "/warrior", icon: Sword, label: "Warrior Practices" },
  { path: "/rite", icon: Crown, label: "Rite of the Uncrowned" },
  { path: "/meditations", icon: Moon, label: "Meditations" },
  { path: "/calendar", icon: CalendarDays, label: "Calendar" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctrinesOpen, setDoctrinesOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Mobile menu button */}
      <button
        data-testid="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-sm md:hidden"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-[#0f0f11] border-r border-zinc-800 z-40 transition-transform duration-300",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Title */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="The Imperium Seal" 
              className="w-12 h-12 object-contain rounded-sm"
            />
            <div>
              <h1 className="heading-4 text-zinc-100">The Imperium</h1>
              <p className="text-xs text-zinc-500">Sovereign Traditions</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/['\s]/g, '-')}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-l-2",
                  isActive
                    ? "text-red-500 border-l-red-500 bg-red-500/5"
                    : "text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900/50"
                )}
              >
                {item.useLogo ? (
                  <img src={LOGO_URL} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  <item.icon className="w-5 h-5" />
                )}
                {item.label}
              </NavLink>
            );
          })}

          {/* Doctrines Quick Access */}
          <button
            onClick={() => setDoctrinesOpen(true)}
            data-testid="open-doctrines"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-l-2 border-transparent text-amber-500 hover:bg-amber-500/10 hover:border-l-amber-500 mt-4"
          >
            <ScrollText className="w-5 h-5" />
            The Doctrines
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <p className="overline text-center">The Uncrowned</p>
          <p className="text-xs text-zinc-600 text-center mt-1">
            Power from within cannot be revoked
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="md:ml-64 min-h-screen">
        <Outlet />
      </main>

      {/* Doctrines Panel */}
      <DoctrinesPanel isOpen={doctrinesOpen} onClose={() => setDoctrinesOpen(false)} />
    </div>
  );
}
