import React from "react";

export default function Guide() {
  const columns = [
    "Ticket",
    "Open",
    "Type",
    "Volume",
    "Symbol",
    "Price",
    "SL",
    "TP",
    "Close",
    "Price",
    "Swap",
    "Commissions",
    "Profit",
    "Pips",
    "Trade duration in seconds",
    "used_ote",
    "ote_level",
    "used_fvg",
    "used_ob",
    "used_mb",
    "used_bb",
    "sl_09",
    "sl_095",
    "sl_10",
    "Risk($)",
    "Risk(%)",
  ];

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">📘 How to Use KachDash</h1>

      <p className="mb-6 text-gray-400">
        This short guide will show you how to prepare your Excel trading data
        and upload it into KachDash to see your performance analytics.
      </p>

      {/* 1️⃣ Download Template */}
      <h2 className="text-xl font-semibold mt-6 mb-2">1️⃣ Download Template</h2>
      <p className="text-gray-400 mb-4">
        Go to the <code>Trading Journals</code> folder and open the file named{" "}
        <b>Template.xlsx</b>. This file contains the correct column headers
        (Ticket, Symbol, Entry Date, Exit Date, P/L, R:R, etc).
      </p>

      {/* Download button */}
      <div className="mb-8">
        <a
          href="/Template.xlsx"
          download
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md transition"
        >
          ⬇️ Download Excel Template
        </a>
      </div>

      {/* 2️⃣ Add Your Trades */}
      <h2 className="text-xl font-semibold mt-6 mb-2">2️⃣ Add Your Trades</h2>
      <p className="text-gray-400 mb-4">
        Copy your trades from FTMO, MyFxBook, MetaTrader, or your broker export,
        and paste them into the template using the same column names.
      </p>

      {/* 3️⃣ Export as CSV */}
      <h2 className="text-xl font-semibold mt-6 mb-2">3️⃣ Export as CSV</h2>
      <p className="text-gray-400 mb-4">
        Once your data is ready, click “File → Save As” and select{" "}
        <b>CSV (Comma Separated Values)</b> as the format.
      </p>

      {/* 4️⃣ Upload to KachDash */}
      <h2 className="text-xl font-semibold mt-6 mb-2">4️⃣ Upload to KachDash</h2>
      <p className="text-gray-400 mb-4">
        Go to the <b>Upload Trades</b> page in the sidebar, click “Upload
        Trades,” and select your CSV file. KachDash will automatically calculate
        your metrics and render your charts.
      </p>

      {/* 📊 Column overview */}
      <h2 className="text-2xl font-semibold mt-10 mb-3">📊 Column Overview</h2>
      <p className="text-gray-400 mb-4">
        Your Excel sheet should include the following columns in the same order
        as listed below. For the most accurate statistics, try to fill in all
        columns. Missing data may reduce the accuracy of advanced stats.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-slate-800 border border-slate-700 rounded-xl">
          <thead>
            <tr>
              <th className="text-left p-3 border-b border-slate-700 text-gray-300">
                Column Name
              </th>
              <th className="text-left p-3 border-b border-slate-700 text-gray-300">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col) => (
              <tr key={col} className="hover:bg-slate-700/40 transition">
                <td className="p-3 text-gray-100">{col}</td>
                <td className="p-3 text-gray-400">
                  {col === "used_ote"
                    ? "Mark with 1 if OTE (Optimal Trade Entry) was used."
                    : col === "used_fvg"
                    ? "Mark with 1 if a Fair Value Gap was used."
                    : col === "used_ob"
                    ? "Mark with 1 if an Order Block was used."
                    : col === "used_mb"
                    ? "Mark with 1 if Market Breaker was used."
                    : col === "used_bb"
                    ? "Mark with 1 if Breaker Block was used."
                    : col.startsWith("sl_")
                    ? "Mark with 1 if stop loss was placed near that level (0.9R, 0.95R, 1R)."
                    : col.startsWith("Risk")
                    ? "Calculated risk for the trade (optional)."
                    : "Standard trade metric (from your broker export)."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💡 Tips section */}
      <h2 className="text-xl font-semibold mt-6 mb-2">💡 Tips</h2>
      <ul className="list-disc ml-6 text-gray-400">
        <li>Missing R:R values will default to +1 for wins and -1 for losses.</li>
        <li>Ensure date formats match your system’s locale (e.g. YYYY-MM-DD).</li>
        <li>You can safely leave empty columns if not applicable.</li>
        <li>
          Columns after <b>Trade duration in seconds</b> are optional
          strategy tags — mark them with <b>1</b> if used, or leave them blank
          if not.
        </li>
        <li>
          These tags (OTE, FVG, OB, BB, MB, SL levels) are used to generate
          deeper statistics and correlations inside KachDash.
        </li>
      </ul>

      <p className="mt-10 text-sm text-gray-500">
        Built with ❤️ by Hicham Boukachni — open source on{" "}
        <a
          href="https://github.com/HichamBoukachni/KachDash"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
