import * as React from "react";

const SelectContext = React.createContext();

function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (newValue) => {
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleSelect, open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children, className = "" }) {
  const { setOpen, open } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between px-3 py-2 w-full rounded-lg border text-sm ${className}`}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext);
  return (
    <span className="truncate text-slate-200">
      {value || placeholder || "Select..."}
    </span>
  );
}

function SelectContent({ children, className = "" }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={`absolute mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-lg z-50 ${className}`}
    >
      {children}
    </div>
  );
}

function SelectItem({ children, value }) {
  const { onValueChange } = React.useContext(SelectContext);
  return (
    <div
      onClick={() => onValueChange(value)}
      className="px-3 py-2 cursor-pointer hover:bg-slate-800 text-slate-200"
    >
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
