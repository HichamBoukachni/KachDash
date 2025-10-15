import React from "react";

export default function Guide() {
  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">📘 How to Use KachDash</h1>

      <p className="mb-6 text-gray-400">
        This short guide will show you how to prepare your Excel trading data
        and upload it into KachDash to see your performance analytics.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1️⃣ Download Template</h2>
      <p className="text-gray-400">
        Go to the <code>Trading Journals</code> folder and open the file named{" "}
        <b>Template.xlsx</b>. This file contains the correct column headers
        (Ticket, Symbol, Entry Date, Exit Date, P/L, R:R, etc).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2️⃣ Add Your Trades</h2>
      <p className="text-gray-400">
        Copy your trades from FTMO, MyFxBook, MetaTrader, or your broker export,
        and paste them into the template using the same column names.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3️⃣ Export as CSV</h2>
      <p className="text-gray-400">
        Once your data is ready, click “File → Save As” and select{" "}
        <b>CSV (Comma Separated Values)</b> as the format.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4️⃣ Upload to KachDash</h2>
      <p className="text-gray-400">
        Go to the <b>Upload Trades</b> page in the sidebar, click “Upload
        Trades,” and select your CSV file. KachDash will automatically calculate
        your metrics and render your charts.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">💡 Tips</h2>
      <ul className="list-disc ml-6 text-gray-400">
        <li>Missing R:R values will default to +1 for wins and -1 for losses.</li>
        <li>Ensure date formats match your system’s locale (e.g. YYYY-MM-DD).</li>
        <li>You can safely leave empty columns if not applicable.</li>
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
