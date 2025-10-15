import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, BarChart3 } from "lucide-react";
import { BookOpen } from "lucide-react";


// 🧱 Sidebar wrapper med korrekt flex-styling
function Sidebar({ children, className = "" }) {
  return (
    <aside className={`w-64 flex-shrink-0 bg-slate-950 ${className}`}>
      {children}
    </aside>
  );
}

// Innholdsseksjoner
function SidebarContent({ children, className = "" }) {
  return <div className={`px-4 py-2 ${className}`}>{children}</div>;
}

function SidebarGroup({ children }) {
  return <div className="mb-4">{children}</div>;
}

function SidebarGroupLabel({ children }) {
  return (
    <p className="text-xs uppercase font-semibold text-slate-400 mb-2">
      {children}
    </p>
  );
}

function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>;
}

function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

function SidebarMenuButton({
  children,
  className = "",
  asChild = false,
  ...props
}) {
  if (asChild) {
    return React.cloneElement(children, {
      className: `w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-colors ${className} ${
        children.props.className || ""
      }`,
      ...props,
    });
  }

  return (
    <button
      className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarHeader({ children, className = "" }) {
  return (
    <div className={`p-4 border-b border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

function SidebarFooter({ children, className = "" }) {
  return (
    <div className={`p-4 border-t border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

// ✅ Viktig: sikrer full bredde og høyde for layouten
function SidebarProvider({ children }) {
  return <div className="flex w-full h-screen overflow-hidden">{children}</div>;
}

function SidebarTrigger({ className = "", ...props }) {
  return (
    <button className={`p-2 rounded-lg ${className}`} {...props}>
      ☰
    </button>
  );
}

// ✅ Hoved Sidebar med navigasjon
function AppSidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition ${
      location.pathname === path
        ? "bg-slate-800 text-blue-400"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader>
        <h2 className="text-lg font-bold text-white tracking-tight">
          NAVIGATION
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/" className={linkClass("/")}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link to="/upload" className={linkClass("/upload")}>
                <Upload className="w-4 h-4" />
                Upload Trades
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link
                to="/advanced-stats"
                className={linkClass("/advanced-stats")}
              >
                <BarChart3 className="w-4 h-4" />
                Advanced Stats
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                to="/guide"
                className={linkClass("/guide")}
              >
                <BarChart3 className="w-4 h-4" />
                How to Use
              </Link>
            </SidebarMenuItem>  
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  AppSidebar,
};
