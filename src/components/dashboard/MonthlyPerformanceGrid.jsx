import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function MonthlyPerformanceGrid({ data }) {
  if (!data || data.length === 0) return null;

  // Map fra { month: "2025-06", percentChange: 3.2 } til et objekt
  const performance = {};
  data.forEach(({ month, percentChange }) => {
    const [year, m] = month.split("-");
    performance[`${year}-${m}`] = percentChange;
  });

  // Finn alle unike år i dataset
  const years = Array.from(
    new Set(data.map((d) => d.month.split("-")[0]))
  ).sort();

  return (
    <Card className="bg-slate-900 border-slate-800 mt-10 shadow-lg">
      <CardHeader>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          📅 Performance per Month
        </h2>
      </CardHeader>
      <CardContent>
        {years.map((year) => (
          <div key={year} className="mb-6">
            <div className="text-slate-400 mb-2 text-sm font-medium">{year}</div>
            <div className="grid grid-cols-13 gap-2">
              {monthNames.map((month, i) => {
                const key = `${year}-${String(i + 1).padStart(2, "0")}`;
                const value = performance[key];

                let color = "text-slate-400";
                if (value > 0) color = "text-green-400";
                else if (value < 0) color = "text-red-400";

                return (
                  <div
                    key={month}
                    className="flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-2 text-center min-w-[60px] h-[70px]"
                  >
                    <span className="text-xs text-slate-300">{month}</span>
                    {value !== undefined ? (
                      <span className={`text-sm font-semibold ${color}`}>
                        {value > 0 ? "+" : ""}
                        {value.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">–</span>
                    )}
                  </div>
                );
              })}

              {/* Totalt YTD */}
              <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg p-2 text-center min-w-[60px] h-[70px]">
                <span className="text-xs text-slate-300">YTD</span>
                <span
                  className={`text-sm font-semibold ${
                    (() => {
                      const vals = Object.keys(performance)
                        .filter((k) => k.startsWith(year))
                        .map((k) => performance[k]);
                      const sum = vals.reduce((a, b) => a + b, 0);
                      return sum >= 0 ? "text-green-400" : "text-red-400";
                    })()
                  }`}
                >
                  {(() => {
                    const vals = Object.keys(performance)
                      .filter((k) => k.startsWith(year))
                      .map((k) => performance[k]);
                    const sum = vals.reduce((a, b) => a + b, 0);
                    return `${sum >= 0 ? "+" : ""}${sum.toFixed(2)}%`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
