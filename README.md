# 💹 Trading Dashboard

A modern, open-source trading analytics dashboard built with **React + Tailwind + Vite**.

Track your **trading performance, risk metrics, and profitability** with automatic visualization and CSV import support.

---

## ⚡️ Features

✅ Upload trades directly from MT4/MT5 or Excel  
✅ Auto-calculates P&L, Win Rate, R:R, Sharpe Ratio, and Duration  
✅ Interactive performance and monthly charts  
✅ Works fully offline using browser storage  
✅ Optional swap/commission inclusion toggle  
✅ Responsive dark UI with clean design  

---

## 🧩 Tech Stack

- React + Vite  
- Tailwind CSS  
- Lucide Icons  
- LocalStorage persistence  
- (Optional) FastAPI backend support  

---

## 🛠️ Getting Started

```bash
git clone https://github.com/HichamBoukachni/KachDash.git
cd KachDash
npm install
npm run dev

---

## 🛠️ Excel Template

1. Download your trade history — for example, from FTMO, MyFxBook, MetaTrader, or any broker that allows CSV/Excel exports.

2. Open the provided template and make a copy.

3. Paste your own trades into the sheet, following the same column names shown at the top of the template (for example: Open, Close, Type, Symbol, Profit, Swap, Commissions, Risk($), Trade duration in seconds, etc.).

4. Once your data is ready, export the sheet as CSV and upload it directly from the dashboard.

5. If you have some missing data, leave it open.


