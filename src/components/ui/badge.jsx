import * as React from "react";

function Badge({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-slate-800 text-slate-200 border border-slate-700",
    success: "bg-emerald-600 text-white",
    destructive: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export { Badge };
