import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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

const nav = [
  { to: "/", label: "Today", icon: Home },
  { to: "/today", label: "Planner", icon: CalendarDays },
  { to: "/doctrine", label: "Doctrine", icon: ScrollText },
  { to: "/meals", label: "Meals", icon: Flame },
  { to: "/velnar", label: "Vel’nar", icon: Languages },
  { to: "/warrior", label: "Warrior", icon: Sword },
  { to: "/glossary", label: "Glossary", icon: BookOpen },
];

export default function Layout() {
  const location = useLocation();
  const { state } = useImperiumApp();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-teal-800 bg-zinc-950 px-4 py-4">
        <h1 className="text-xl font-bold">The Imperium</h1>
        <p className="text-sm text-zinc-400">Uncrowned Operating System</p>
        <p className="mt-2 text-xs text-teal-400">
          {state?.phase === "pre-rite" ? "Pre-Rite mode" : "Post-Rite mode"}
        </p>
      </header>

      <main className="pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-teal-800 bg-zinc-950 px-2 py-2">
        <div className="flex items-center justify-around gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs ${
                  active ? "text-teal-400" : "text-zinc-400"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
