import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ trades, isLoading, includeSwaps }) {
  const chartData = useMemo(() => {
    if (!trades.length) return [];

    const sorted = [...trades].sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date));
    let cumulative = 0;

    return sorted.map((trade) => {
      // 📊 Bruk det riktige profitfeltet (med eller uten swaps)
      const profit = includeSwaps
        ? parseFloat(trade.profit_with_swap || 0)
        : parseFloat(trade.profit_loss || 0);

      cumulative += profit;
      return {
        date: format(new Date(trade.entry_date), "MMM d"),
        pnl: cumulative,
        trade: trade.symbol,
      };
    });
  }, [trades, includeSwaps]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{payload[0].payload.trade}</p>
          <p className="text-white font-bold">${payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-800 flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Cumulative Performance
        </CardTitle>
        <span className="text-slate-400 text-sm italic">
          {includeSwaps ? "(Including Swaps)" : "(Net Profit Only)"}
        </span>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <Skeleton className="w-full h-80 bg-slate-800" />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#64748B"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6, fill: "#60A5FA" }}
                fill="url(#colorPnl)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-slate-400">
            No trading data available. Upload trades to see your performance.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
