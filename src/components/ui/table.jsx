import * as React from "react";

function Table({ children, className = "" }) {
  return (
    <table className={`w-full text-sm text-left text-slate-300 ${className}`}>
      {children}
    </table>
  );
}

function TableHeader({ children }) {
  return <thead className="bg-slate-800">{children}</thead>;
}

function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-800">{children}</tbody>;
}

function TableRow({ children }) {
  return <tr className="hover:bg-slate-800/50">{children}</tr>;
}

function TableHead({ children }) {
  return (
    <th scope="col" className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-4 py-2">{children}</td>;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
