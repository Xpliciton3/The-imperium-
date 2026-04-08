import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Flame,
  Home,
  Languages,
  ScrollText,
  Sword,
} from "lucide-react";

import { useImperiumApp } from "../lib/useImperiumApp";

const navItems = [
  { to: "/", label: "Today", icon: Home, end: true },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/doctrine", label: "Doctrine", icon: ScrollText },
  { to: "/meals", label: "Meals", icon: Flame },
  { to: "/velnar", label: "Vel’nar", icon: Languages },
  { to: "/warrior", label: "Warrior", icon: Sword },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
];

function NavItem({ to, label, icon: Icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-teal-600 text-white shadow-md"
            : "text-zinc-300 hover:bg-zinc-800 hover:text-white",
        ].join(" ")
      }
    >
      <Icon size={18} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  const app = typeof useImperiumApp === "function" ? useImperiumApp() : null;
  const phase = app?.state?.phase ?? "pre-rite";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-wide">
              The Imperium
            </h1>
            <p className="text-sm text-zinc-400">Uncrowned Operating System</p>
          </div>

          <div className="shrink-0 rounded-full border border-teal-700 bg-teal-950 px-3 py-1 text-xs font-medium text-teal-200">
            {phase === "pre-rite" ? "Pre-Rite mode" : "Post-Rite mode"}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:h-fit">
          <nav className="flex flex-row gap-2 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-2 md:flex-col md:overflow-visible">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                end={item.end}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
