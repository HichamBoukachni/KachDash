import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar, SidebarProvider } from "@/components/ui/sidebar.jsx";

export default function Layout() {
  return (
    <SidebarProvider>
      {/* Hele skjermen + riktig flex for main */}
      <div className="flex w-full min-h-screen bg-slate-950 text-white">
        {/* 🧭 Sidebar */}
        <AppSidebar />

        {/* 📄 Hovedinnhold */}
        <main
          className="
            flex-1
            bg-slate-900
            border-l border-slate-800
            overflow-y-auto
            overflow-x-hidden
          "
        >
          {/* Innhold (fra Dashboard / Upload / Stats) */}
          <div className="min-h-screen w-full px-10 md:px-14 xl:px-20 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}