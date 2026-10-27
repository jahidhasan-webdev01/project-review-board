"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

const MentorHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="border-b border-violet-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/mentor" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            P
          </span>

          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Project Review Board
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  );
};

export default MentorHeader;
