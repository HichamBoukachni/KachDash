import React, { useEffect, useState } from "react";
import { Trade } from "@/entities/Trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export default function AdvancedStats() {
  const navigate = useNavigate();
  const [ictStats, setIctStats] = useState({});
  const [oteData, setOteData] = useState([]);
  const [slData, setSlData] = useState([]);
  const [comboData, setComboData] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const trades = await Trade.list();
    const stats = calculateIctStats(trades);
    setIctStats(stats);
  };

  const calculateIctStats = (trades) => {
    if (!trades.length) return {};

    const total = trades.length;
    const count = (field) =>
      trades.filter((t) => t[field] === true || t[field] === 1).length;

    // 📊 ICT concepts
    const ict = {
      ote: count("used_ote"),
      fvg: count("used_fvg"),
      ob: count("used_ob"),
      mb: count("used_mb"),
      bb: count("used_bb"),
    };

    const isWin = (t) => parseFloat(t.profit_loss) > 0;
    const pct = (wins, total) =>
      total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

    // 🎯 OTE Levels
    const oteLevels = [0.62, 0.67, 0.705, 0.75, 0.79];
    const oteStats = oteLevels.map((lvl) => {
      const subset = trades.filter(
        (t) => t.ote_level && Math.abs(t.ote_level - lvl) < 0.001
      );
      const wins = subset.filter(isWin).length;
      return {
        name: `OTE ${lvl}`,
        value: subset.length,
        winRate: pct(wins, subset.length),
      };
    });

    // 🧱 SL Levels (✅ fixed label mapping)
    const slLabels = {
      sl_09: "SL 0.9",
      sl_095: "SL 0.95",
      sl_10: "SL 1.0",
    };
    const slStats = Object.keys(slLabels).map((field) => {
      const subset = trades.filter((t) => t[field]);
      const wins = subset.filter(isWin).length;
      return {
        name: slLabels[field],
        value: subset.length,
        winRate: pct(wins, subset.length),
      };
    });

    // 🔗 Kombinasjoner
    const getCombinationKey = (trade) => {
      const used = [];
      if (trade.used_ote) used.push("OTE");
      if (trade.used_fvg) used.push("FVG");
      if (trade.used_ob) used.push("OB");
      if (trade.used_mb) used.push("MB");
      if (trade.used_bb) used.push("BB");
      return used.length ? used.join(" + ") : "None";
    };

    const comboMap = {};
    trades.forEach((t) => {
      const key = getCombinationKey(t);
      comboMap[key] = (comboMap[key] || 0) + 1;
    });

    const comboStats = Object.entries(comboMap)
      .map(([name, count]) => ({
        name,
        value: count,
        percent: (count / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    setOteData(oteStats);
    setSlData(slStats);
    setComboData(comboStats);

    return { total, ...ict, oteStats, slStats, allTrades: trades };
  };

  const COLORS = ["#22d3ee", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];
  const getRateColor = (rate) => {
    const r = parseFloat(rate);
    if (r >= 70) return "text-emerald-400";
    if (r >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Advanced Stats</h1>
          </div>

          <Button
            variant="outline"
            onClick={loadStats}
            className="border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh Stats
          </Button>
        </div>

        {/* 🔹 ICT Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {["ote", "fvg", "ob", "mb", "bb"].map((key) => (
            <Card
              key={key}
              className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-white uppercase text-sm tracking-wider">
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-400">
                  {((ictStats[key] / (ictStats.total || 1)) * 100 || 0).toFixed(
                    1
                  )}
                  %
                </p>
                <p className="text-slate-400 text-xs">
                  {ictStats[key] || 0} / {ictStats.total || 0} trades
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔸 OTE + SL Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">OTE Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={oteData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {oteData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Stop Loss Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={slData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {slData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Combination Frequency */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Combination Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            {comboData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer
                  width="100%"
                  height={comboData.length * 40 + 80}
                >
                  <BarChart
                    layout="vertical"
                    data={comboData.sort((a, b) => b.value - a.value).slice(0, 12)}
                    margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                    barCategoryGap="25%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      horizontal={false}
                    />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={200}
                      tick={{ fill: "#cbd5e1", fontSize: 13, fontWeight: 500 }}
                    />
                    <Tooltip
                      formatter={(value, _, { payload }) => [
                        `${value} trades`,
                        payload.name,
                      ]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "6px",
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar dataKey="value" barSize={28} radius={[6, 6, 6, 6]}>
                      {comboData
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 12)
                        .map((entry, index) => {
                          const max = comboData[0]?.value || 1;
                          const intensity = entry.value / max;
                          const color = `hsl(${
                            150 - intensity * 20
                          }, 60%, ${50 - intensity * 20}%)`;
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      <LabelList
                        dataKey="value"
                        position="right"
                        fill="#a7f3d0"
                        fontSize={13}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="overflow-auto max-h-[320px] border border-slate-800 rounded-xl shadow-inner shadow-slate-800/30">
                  <table className="min-w-full text-sm text-slate-300">
                    <thead className="bg-slate-800 text-slate-400 uppercase text-xs sticky top-0">
                      <tr>
                        <th className="p-3 text-left font-semibold">Combination</th>
                        <th className="p-3 text-right font-semibold">Count</th>
                        <th className="p-3 text-right font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comboData
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 20)
                        .map((c, i) => (
                          <tr
                            key={i}
                            className="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50"
                          >
                            <td className="p-3 truncate max-w-[160px]" title={c.name}>
                              {c.name}
                            </td>
                            <td className="p-3 text-right">{c.value}</td>
                            <td className="p-3 text-right">{c.percent.toFixed(1)}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No trades available yet for combination analysis.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 🟩 Win Rate Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm uppercase tracking-wider">
                OTE Level Win Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {oteData.map((o, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1"
                >
                  <span>{o.name}</span>
                  <span className={`${getRateColor(o.winRate)} font-semibold`}>
                    {o.winRate}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-sm uppercase tracking-wider">
                Stop Loss Win Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {slData.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1"
                >
                  <span>{s.name}</span>
                  <span className={`${getRateColor(s.winRate)} font-semibold`}>
                    {s.winRate}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 🧮 OTE + SL Combination Win Rates */}
        <Card className="bg-slate-900 border-slate-800 mt-8">
          <CardHeader>
            <CardTitle className="text-white text-sm uppercase tracking-wider">
              OTE + Stop Loss Combination Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="min-w-full text-sm text-slate-300 border border-slate-800 rounded-lg">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs sticky top-0">
                <tr>
                  <th className="p-3 text-left font-semibold">OTE Level</th>
                  <th className="p-3 text-left font-semibold">SL Level</th>
                  <th className="p-3 text-right font-semibold">Trades</th>
                  <th className="p-3 text-right font-semibold">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const combos = [];
                  const slKeys = ["sl_09", "sl_095", "sl_10"];
                  const slLabels = {
                    sl_09: "SL 0.9",
                    sl_095: "SL 0.95",
                    sl_10: "SL 1.0",
                  };
                  const oteLevels = [0.62, 0.67, 0.705, 0.75, 0.79];
                  const trades = ictStats?.allTrades || [];

                  if (trades.length === 0)
                    return (
                      <tr>
                        <td colSpan="4" className="text-center p-4 text-slate-500">
                          No trades available for OTE + SL analysis.
                        </td>
                      </tr>
                    );

                  for (const lvl of oteLevels) {
                    for (const sl of slKeys) {
                      const subset = trades.filter(
                        (t) =>
                          t.ote_level &&
                          Math.abs(t.ote_level - lvl) < 0.001 &&
                          t[sl]
                      );
                      const wins = subset.filter(
                        (t) => parseFloat(t.profit_loss) > 0
                      ).length;
                      const total = subset.length;
                      const winRate =
                        total > 0 ? ((wins / total) * 100).toFixed(1) + "%" : "-";
                      combos.push({
                        ote: lvl,
                        sl: slLabels[sl],
                        total,
                        winRate,
                      });
                    }
                  }

                  return combos.map((c, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="p-3">{c.ote}</td>
                      <td className="p-3">{c.sl}</td>
                      <td className="p-3 text-right">{c.total}</td>
                      <td
                        className={`p-3 text-right font-semibold ${
                          c.winRate === "-"
                            ? "text-slate-500"
                            : parseFloat(c.winRate) >= 70
                            ? "text-emerald-400"
                            : parseFloat(c.winRate) >= 40
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {c.winRate}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
