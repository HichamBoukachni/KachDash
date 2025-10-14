import * as React from "react";

function Alert({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-slate-800 border-slate-700 text-slate-200",
    destructive: "bg-red-950/50 border-red-900 text-red-200",
    success: "bg-emerald-950/50 border-emerald-900 text-emerald-200",
    info: "bg-blue-950/50 border-blue-900 text-blue-200",
  };

  return (
    <div className={`rounded-lg border p-4 flex items-start gap-3 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

function AlertDescription({ children }) {
  return <div className="text-sm leading-relaxed">{children}</div>;
}

export { Alert, AlertDescription };
