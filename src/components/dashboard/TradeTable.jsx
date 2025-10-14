import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { FileText, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function TradeTable({ trades, isLoading, showRRColumn = false }) {
  const [filterSide, setFilterSide] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const normalizeSide = (side) => {
    if (!side) return "long";
    const normalized = side.toLowerCase();
    if (normalized === "buy") return "long";
    if (normalized === "sell") return "short";
    return normalized;
  };

  const filteredAndSortedTrades = useMemo(() => {
    let result = [...trades];

    if (filterSide !== "all") {
      result = result.filter((t) => normalizeSide(t.side) === filterSide);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.entry_date) - new Date(a.entry_date);
      } else if (sortBy === "pnl") {
        return (b.profit_loss || 0) - (a.profit_loss || 0);
      } else if (sortBy === "rr") {
        return (b.rr_ratio || 0) - (a.rr_ratio || 0);
      }
      return 0;
    });

    return result;
  }, [trades, filterSide, sortBy]);

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <FileText className="w-5 h-5 text-blue-400" />
            Trade History
          </CardTitle>
          <div className="flex gap-3">
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-300">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="long">Long Only</SelectItem>
                <SelectItem value="short">Short Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-300">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="pnl">By P&L</SelectItem>
                {showRRColumn && <SelectItem value="rr">By R:R</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                {[
                  "Ticket",
                  "Symbol",
                  "Side",
                  "Entry Date",
                  "Entry Price",
                  "Exit Price",
                  "Volume",
                  "P&L",
                  ...(showRRColumn ? ["R:R"] : []),
                  "Pips",
                ].map((head) => (
                  <TableHead key={head} className="text-slate-400 whitespace-nowrap">
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="border-slate-800">
                      {Array(showRRColumn ? 10 : 9)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-20 bg-slate-800" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : filteredAndSortedTrades.length > 0 ? (
                filteredAndSortedTrades.map((trade, idx) => {
                  const side = normalizeSide(trade.side);
                  const rr = parseFloat(trade.rr_ratio);

                  return (
                    <TableRow
                      key={trade.id || trade.ticket || idx}
                      className="border-slate-800 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="text-slate-400 text-xs">
                        {trade.ticket || "-"}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {trade.symbol}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            side === "long"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/30 bg-red-500/10 text-red-400"
                          }
                        >
                          {side === "long" ? (
                            <ArrowUpCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownCircle className="w-3 h-3 mr-1" />
                          )}
                          {side}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {trade.entry_date
                          ? format(new Date(trade.entry_date), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {trade.entry_price?.toFixed(5) || "-"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {trade.exit_price ? trade.exit_price.toFixed(5) : "-"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {trade.quantity?.toFixed(2) || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            (trade.profit_loss || 0) >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {(trade.profit_loss || 0) >= 0 ? "+" : ""}
                          ${trade.profit_loss?.toFixed(2) || "0.00"}
                        </span>
                      </TableCell>

                      {/* 🟢 Ny R:R-kolonne */}
                      {showRRColumn && (
                        <TableCell className="text-right font-semibold">
                          {isNaN(rr) || rr === 0 ? (
                            "-"
                          ) : (
                            <span
                              className={
                                rr >= 1.5
                                  ? "text-emerald-400"
                                  : rr >= 0
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }
                            >
                              {rr.toFixed(2)}R
                            </span>
                          )}
                        </TableCell>
                      )}

                      <TableCell className="text-slate-300">
                        {trade.pips ? trade.pips.toFixed(1) : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={showRRColumn ? 10 : 9}
                    className="text-center text-slate-400 py-8"
                  >
                    No trades found. Upload a CSV or Excel file to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
