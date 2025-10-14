import * as React from "react";

function Button({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-slate-700 hover:bg-slate-800 text-slate-300",
    ghost: "hover:bg-slate-800 text-slate-300",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
