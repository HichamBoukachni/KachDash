import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export default function TopTrades({ trades, isLoading }) {
  const { topWinners, topLosers } = useMemo(() => {
    const winners = [...trades]
      .filter((t) => t.profit_loss > 0)
      .sort((a, b) => b.profit_loss - a.profit_loss)
      .slice(0, 3);

    const losers = [...trades]
      .filter((t) => t.profit_loss < 0)
      .sort((a, b) => a.profit_loss - b.profit_loss)
      .slice(0, 3);

    return { topWinners: winners, topLosers: losers };
  }, [trades]);

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Top Trades
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 bg-slate-800" />
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Winners */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-emerald-400">
                  Best Winners
                </h3>
              </div>

              {topWinners.length > 0 ? (
                <div className="space-y-3">
                  {topWinners.map((trade, idx) => (
                    <div
                      key={trade.id || trade.ticket || idx}
                      className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-400">
                            #{idx + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {trade.symbol}
                          </p>
                          <p className="text-xs text-slate-400">
                            {trade.entry_date
                              ? format(new Date(trade.entry_date), "MMM d")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        +${trade.profit_loss.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No winning trades yet
                </p>
              )}
            </div>

            {/* Losers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <h3 className="font-semibold text-sm text-red-400">
                  Biggest Losses
                </h3>
              </div>

              {topLosers.length > 0 ? (
                <div className="space-y-3">
                  {topLosers.map((trade, idx) => (
                    <div
                      key={trade.id || trade.ticket || idx}
                      className="flex items-center justify-between p-3 bg-red-950/20 border border-red-900/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-red-400">
                            #{idx + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {trade.symbol}
                          </p>
                          <p className="text-xs text-slate-400">
                            {trade.entry_date
                              ? format(new Date(trade.entry_date), "MMM d")
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        ${trade.profit_loss.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No losing trades yet
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
