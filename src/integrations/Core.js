// src/integrations/Core.js
import * as XLSX from "xlsx";
import Papa from "papaparse";

export async function UploadFile({ file }) {
  console.log("Processing upload for:", file.name);
  // I en ekte backend kunne du lagre til S3, men her bruker vi bare local blob
  return { file_url: URL.createObjectURL(file) };
}

export async function ExtractDataFromUploadedFile({ file_url }) {
  console.log("Extracting data from:", file_url);
  const response = await fetch(file_url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  let trades = [];

  // 🔹 Sjekk filtype og parse riktig
  if (file_url.endsWith(".csv")) {
    const text = await blob.text();
    const parsed = Papa.parse(text, { header: true });
    trades = parsed.data;
  } else {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    trades = XLSX.utils.sheet_to_json(sheet);
  }

  // 🔹 Normaliser kolonnenavnene fra FTMO / Excel
  const normalizedTrades = trades.map((row) => ({
    id: row.Ticket || crypto.randomUUID(),
    ticket: row.Ticket || "",
    symbol: row.Symbol || "",
    side: row.Type || row.Side || "",
    entry_date: row.Open || row.Entry || "",
    exit_date: row.Close || row.Exit || "",
    entry_price: parseFloat(row.Price || row["Entry Price"] || 0),
    exit_price: parseFloat(row["Price 1"] || row["Exit Price"] || 0),
    quantity: parseFloat(row.Volume || row.Size || 0),
    profit_loss: parseFloat(row.Profit || row["Profit/Loss"] || 0),
    pips: parseFloat(row.Pips || 0),
    commission: parseFloat(row.Commission || row.Commissions || 0),
  }));

  console.log(`✅ Parsed ${normalizedTrades.length} trades`);
  return {
    status: "success",
    output: { trades: normalizedTrades },
  };
}
