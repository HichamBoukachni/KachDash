import React, { useState, useEffect } from "react";
import { Trade } from "@/entities/Trade";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Scale,
  Sigma,
  Clock3,
  Info,
} from "lucide-react";

import MetricCard from "../components/dashboard/MetricCard.jsx";
import PerformanceChart from "../components/dashboard/PerformanceChart.jsx";
import MonthlyPerformanceChart from "../components/dashboard/MonthlyPerformanceGrid.jsx";
import TradeTable from "../components/dashboard/TradeTable.jsx";
import TopTrades from "../components/dashboard/TopTrades.jsx";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [includeSwaps, setIncludeSwaps] = useState(true); // ✅ Toggle state

  // 🚀 Laster trades og reloader når includeSwaps endres
  useEffect(() => {
  const loadTrades = async () => {
    setIsLoading(true);
    const data = await Trade.list("-entry_date");

    const enriched = data.map((t) => {
      const rawProfit = parseFloat(t.profit_loss) || 0;
      const swap = parseFloat(t.swap) || 0;
      const commission = parseFloat(t.commission) || 0;

      // 📊 Excelens "Profit" er allerede netto (swap + commission er trukket)
      const baseProfit = rawProfit;

      // ✅ Hvis "Include Swaps" = true, legg tilbake swap
      const profit = includeSwaps ? baseProfit + swap : baseProfit;

      const risk = parseFloat(t.risk_usd || t["Risk($)"] || 0);
      const rr_ratio =
        risk > 0
          ? profit / risk
          : profit > 0
          ? 1
          : profit < 0
          ? -1
          : 0;

      let duration_seconds = parseFloat(t.duration_seconds) || 0;
      if ((!duration_seconds || duration_seconds === 0) && t.entry_date && t.exit_date) {
        const entry = new Date(t.entry_date);
        const exit = new Date(t.exit_date);
        duration_seconds = Math.max(0, (exit - entry) / 1000);
      }

      return { ...t, rr_ratio, duration_seconds, profit_with_swap: profit };
    });

    setTrades(enriched);
    setIsLoading(false);
  };

  loadTrades();
}, [includeSwaps]);


  const clearAllTrades = async () => {
    if (window.confirm("Are you sure you want to delete all stored trades?")) {
      Trade.clearAll();
      setTrades([]);
      alert("✅ All trades cleared!");
    }
  };

  // 📊 Beregninger inkludert breakeven-trades
  const calculateMetrics = () => {
    if (trades.length === 0)
      return {
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        avgRR: 0,
        sharpeRatio: 0,
        avgDuration: "0m",
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakevenTrades: 0,
      };

    const profits = trades.map((t) => parseFloat(t.profit_with_swap) || 0);
    const totalPnL = profits.reduce((a, b) => a + b, 0);

    const winners = trades.filter((t) => t.rr_ratio > 0.2);
    const losers = trades.filter((t) => t.rr_ratio < -0.1);
    const breakeven = trades.filter((t) => t.rr_ratio >= -0.1 && t.rr_ratio <= 0.2);
    const totalCountForWinRate = winners.length + losers.length;

    const avgWin =
      winners.length > 0
        ? winners.reduce((a, b) => a + parseFloat(b.profit_with_swap), 0) / winners.length
        : 0;

    const avgLoss =
      losers.length > 0
        ? losers.reduce((a, b) => a + parseFloat(b.profit_with_swap), 0) / losers.length
        : 0;

    const rrValues = winners.filter((t) => t.rr_ratio > 0).map((t) => parseFloat(t.rr_ratio));
    const avgRR =
      rrValues.length > 0 ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length : 0;

    const returns = trades.map((t) => {
      const risk = parseFloat(t.risk_usd || 0);
      const profit = parseFloat(t.profit_with_swap || 0);
      const pctReturn = risk > 0 ? (profit / risk) * (t.risk_pct || 1) : 0;
      return pctReturn;
    });

    const meanReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
    const variance =
      returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / (returns.length || 1);
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev !== 0 ? meanReturn / stdDev : 0;

    const validDurations = trades
      .map((t) => parseFloat(t.duration_seconds) || 0)
      .filter((d) => d > 0);

    const avgDurationSeconds =
      validDurations.reduce((a, b) => a + b, 0) / (validDurations.length || 1);

    const days = Math.floor(avgDurationSeconds / 86400);
    const hours = Math.floor((avgDurationSeconds % 86400) / 3600);
    const minutes = Math.floor((avgDurationSeconds % 3600) / 60);

    let formattedDuration = "";
    if (days > 0) formattedDuration = `${days}d ${hours}h`;
    else if (hours > 0) formattedDuration = `${hours}h ${minutes}m`;
    else formattedDuration = `${minutes}m`;

    return {
      totalPnL,
      winRate:
        totalCountForWinRate > 0
          ? (winners.length / totalCountForWinRate) * 100
          : 0,
      avgWin,
      avgLoss,
      avgRR,
      sharpeRatio,
      avgDuration: formattedDuration,
      totalTrades: trades.length,
      winningTrades: winners.length,
      losingTrades: losers.length,
      breakevenTrades: breakeven.length,
    };
  };

  const calculateMonthlyPerformance = () => {
    if (trades.length === 0) return [];

    const monthlyData = {};

    trades.forEach((trade) => {
      const date = new Date(trade.entry_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const profit = parseFloat(trade.profit_with_swap) || 0;
      const riskUsd = parseFloat(trade.risk_usd) || 0;
      const riskPct = parseFloat(trade.risk_pct) || 0;
      const tradeReturnPct = riskUsd > 0 ? (profit / riskUsd) * riskPct : 0;
      monthlyData[key] = (monthlyData[key] || 0) + tradeReturnPct;
    });

    return Object.keys(monthlyData)
      .sort()
      .map((monthKey) => ({
        month: monthKey,
        percentChange: monthlyData[monthKey],
      }));
  };

  const metrics = calculateMetrics();
  const monthlyPerformance = calculateMonthlyPerformance();

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[8vw] 2xl:px-[12vw]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Trading Dashboard
          </h1>
          <p className="text-slate-400">
            Track your trading performance and analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 items-center">
          {/* 🔘 Include Swaps Toggle with Tooltip */}
          <div className="relative group">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSwaps}
                onChange={() => setIncludeSwaps(!includeSwaps)}
                className="hidden"
              />
              <div
                className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${
                  includeSwaps ? "bg-emerald-500" : "bg-slate-600"
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                    includeSwaps ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-sm flex items-center gap-1">
                Swaps {includeSwaps ? "On" : "Off"}
                <Info className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
              </span>
            </label>

            {/* Tooltip */}
            <div className="absolute hidden group-hover:block text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-56 right-0 mt-2 shadow-xl">
              Include overnight swap/interest fees in profit calculations.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link to={createPageUrl("Upload")}>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                <Plus className="w-5 h-5 mr-2" />
                Upload Trades
              </Button>
            </Link>
            {trades.length > 0 && (
              <Button
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/30"
                onClick={clearAllTrades}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {trades.length > 0 && (
        <>
          <div
            className="
              grid 
              grid-cols-[repeat(auto-fit,minmax(230px,1fr))] 
              gap-4 md:gap-6 
              mb-10 
              w-full 
            "
          >
            <MetricCard
              title="Total P&L"
              value={`$${metrics.totalPnL.toFixed(2)}`}
              icon={DollarSign}
              trend={metrics.totalPnL >= 0}
              trendValue={`${metrics.totalTrades} trades`}
              gradient="from-blue-500 to-blue-600"
            />
            <MetricCard
              title="Win Rate"
              value={`${metrics.winRate.toFixed(1)}%`}
              icon={TrendingUp}
              trend={metrics.winRate >= 50}
              trendValue={`${metrics.winningTrades}W / ${metrics.losingTrades}L / ${metrics.breakevenTrades}BE`}
              gradient="from-emerald-500 to-emerald-600"
            />
            <MetricCard
              title="Avg Win"
              value={`$${metrics.avgWin.toFixed(2)}`}
              icon={Activity}
              trend
              trendValue={`${metrics.winningTrades} winners`}
              gradient="from-green-500 to-green-600"
            />
            <MetricCard
              title="Avg Loss"
              value={`$${Math.abs(metrics.avgLoss).toFixed(2)}`}
              icon={TrendingDown}
              trend={false}
              trendValue={`${metrics.losingTrades} losers`}
              gradient="from-red-500 to-red-600"
            />
            <MetricCard
              title="Avg R:R"
              value={`${metrics.avgRR.toFixed(2)}R`}
              icon={Scale}
              trend={metrics.avgRR >= 1.5}
              trendValue={
                metrics.avgRR >= 1 ? "Profitable R:R" : "Below 1R average"
              }
              gradient="from-purple-500 to-indigo-600"
            />
            <MetricCard
              title="Sharpe Ratio"
              value={metrics.sharpeRatio.toFixed(2)}
              icon={Sigma}
              trend={metrics.sharpeRatio >= 1}
              trendValue={
                metrics.sharpeRatio > 2
                  ? "Excellent"
                  : metrics.sharpeRatio > 1
                  ? "Good"
                  : "Weak"
              }
              gradient="from-yellow-500 to-orange-500"
            />
            <MetricCard
              title="Avg Duration"
              value={metrics.avgDuration}
              icon={Clock3}
              trendValue="Avg holding time"
              gradient="from-amber-500 to-yellow-600"
            />
          </div>

          {/* Charts + Top Trades */}
          <div className="grid xl:grid-cols-3 gap-6 mb-10 w-full">
            <div className="xl:col-span-2 w-full space-y-6">
              <PerformanceChart
                  trades={trades}
                  isLoading={isLoading}
                  includeSwaps={includeSwaps} // 👈 Send togglestatus som prop
                  key={includeSwaps ? "swaps-on" : "swaps-off"} // 👈 Tving re-render
                />
            </div>
            <div className="w-full">
              <TopTrades trades={trades} isLoading={isLoading} />
            </div>
          </div>

          {/* Trade Table */}
          <TradeTable
            trades={trades}
            isLoading={isLoading}
            onTradeDeleted={() => setTrades([])}
            showRRColumn={true}
          />

          {/* Monthly Performance */}
          <div className="mt-10">
            <MonthlyPerformanceChart data={monthlyPerformance} />
          </div>
        </>
      )}
    </div>
  );
}
