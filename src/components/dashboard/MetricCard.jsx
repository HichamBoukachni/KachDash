import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  gradient,
  index = 0,
}) {
  return (
    <Card
      style={{ animationDelay: `${index * 0.1}s` }}
      className="
        flex-1 
        min-w-[230px]
        bg-slate-900 border-slate-800
        overflow-hidden relative
        group hover:shadow-xl hover:shadow-blue-500/10
        transition-all duration-300
        animate-fadeInStaggered
        w-full
        sm:w-auto
      "
    >
      {/* 🔹 Soft gradient background */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-300`}
      />

      {/* 🔹 Content */}
      <div
        className="
          relative
          p-4 sm:p-5 md:p-6
          flex flex-col justify-between
          w-full
        "
      >
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="flex flex-col">
            <p className="text-xs sm:text-sm font-medium text-slate-400 mb-1">
              {title}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">
              {value}
            </p>
          </div>

          <div
            className={`
              p-2 sm:p-3 
              rounded-xl 
              bg-gradient-to-br ${gradient} 
              shadow-lg
              flex-shrink-0
            `}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {trend ? (
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
          )}
          <span
            className={`${
              trend ? "text-emerald-400" : "text-red-400"
            } truncate`}
          >
            {trendValue}
          </span>
        </div>
      </div>
    </Card>
  );
}
