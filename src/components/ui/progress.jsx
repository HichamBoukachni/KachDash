import * as React from "react";

function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full bg-slate-800 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export { Progress };
