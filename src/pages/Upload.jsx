import React, { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Trade } from "@/entities/Trade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewCount, setPreviewCount] = useState(null);
  const [missingColumns, setMissingColumns] = useState([]);
  const fileInputRef = useRef(null);

  const REQUIRED_COLUMNS = [
    "Ticket", "Open", "Type", "Volume", "Symbol", "Price",
    "SL", "TP", "Close", "Swap", "Commissions", "Profit", "Pips"
  ];

  const OPTIONAL_COLUMNS = [
    "OTE Used", "OTE Level", "FVG", "OB", "MB", "BB",
    "Bias", "SL 0.9", "SL 0.95", "SL 1.0"
  ];

  const isValidFile = (file) =>
    file &&
    (file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls"));

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleSelectedFile(droppedFile);
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleSelectedFile(selectedFile);
  };

  const handleSelectedFile = async (selectedFile) => {
    if (!isValidFile(selectedFile)) {
      setError("Please upload a CSV or Excel (.xlsx, .xls) file.");
      return;
    }

    setFile(selectedFile);
    setError(null);

    try {
      const trades = await parseFile(selectedFile);
      const foundColumns = Object.keys(trades[0] || {});
      const missing = REQUIRED_COLUMNS.filter(
        (col) => !foundColumns.includes(col)
      );
      console.log("🧩 Found columns:", foundColumns);
      setMissingColumns(missing);
      setPreviewCount(trades.length);
    } catch (err) {
      console.error(err);
      setError("Error reading file. Please make sure it's a valid CSV or Excel file.");
    }
  };

  // 🧠 Konverterer til boolean uansett format
  const toBool = (value) => {
    if (value === undefined || value === null) return false;
    const cleaned = String(value).trim().toLowerCase();
    if (cleaned === "" || cleaned === "0" || cleaned === "false" || cleaned === "nei" || cleaned === "no") return false;
    if (cleaned === "1" || cleaned === "true" || cleaned === "yes" || cleaned === "ja" || cleaned === "✓" || cleaned === "x") return true;
    if (!isNaN(cleaned)) return Number(cleaned) !== 0;
    return Boolean(value);
  };

  // 🧠 Parser Excel- eller strengdato
  const parseDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === "number") {
      const excelDate = XLSX.SSF.parse_date_code(value);
      if (excelDate) {
        return new Date(
          excelDate.y,
          excelDate.m - 1,
          excelDate.d,
          excelDate.H,
          excelDate.M,
          excelDate.S
        );
      }
    }
    if (typeof value === "string") {
      const cleaned = value.replace(/\./g, "/").replace(/-/g, "/");
      const parsed = new Date(cleaned);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  };

  // 📤 Leser CSV/XLSX
  const parseFile = (file) =>
    new Promise((resolve, reject) => {
      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (err) => reject(err),
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          resolve(json);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      }
    });

  // ⚙️ Prosessering
  const processFile = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const rawTrades = await parseFile(file);
      console.log("🧾 Raw Excel Row Example:", rawTrades[0]);

      const get = (row, keys) => {
        for (const key of keys) {
          if (row[key] !== undefined && row[key] !== "") return row[key];
        }
        return "";
      };

      const mappedTrades = rawTrades.map((row, i) => {
  const riskUsd = parseFloat(get(row, ["Risk($)", "risk_usd"])) || 0;
  const riskPct = parseFloat(get(row, ["Risk(%)", "risk_pct"])) || 0;
  const profit = parseFloat(row["Profit"]) || 0;

  return {
    id: `${Date.now()}-${i}`,
    ticket: row["Ticket"] || "",
    symbol: row["Symbol"] || "",
    side: row["Type"]?.toLowerCase() || "",
    entry_date: parseDate(row["Open"]),
    exit_date: parseDate(row["Close"]),
    entry_price: parseFloat(row["Price"]) || 0,
    exit_price: parseFloat(row["Price"]) || 0,
    quantity: parseFloat(row["Volume"]) || 0,
    profit_loss: profit,
    pips: parseFloat(row["Pips"]) || 0,
    commission: parseFloat(row["Commissions"]) || 0,
    swap: parseFloat(row["Swap"]) || 0,

    // ICT & SL fields
    used_ote: toBool(get(row, ["OTE Used", "used_ote"])),
    ote_level: parseFloat(get(row, ["OTE Level", "ote_level"])) || null,
    used_fvg: toBool(get(row, ["FVG", "used_fvg"])),
    used_ob: toBool(get(row, ["OB", "used_ob"])),
    used_mb: toBool(get(row, ["MB", "used_mb"])),
    used_bb: toBool(get(row, ["BB", "used_bb"])),
    bias_direction: get(row, ["Bias", "bias_direction"])?.toLowerCase() || "",

    sl_09: toBool(get(row, ["SL 0.9", "sl_09"])),
    sl_095: toBool(get(row, ["SL 0.95", "sl_095"])),
    sl_10: toBool(get(row, ["SL 1.0", "sl_10"])),

    // 💰 New risk fields
    risk_usd: riskUsd,
    risk_pct: riskPct,
    rr_ratio: riskUsd > 0 ? profit / riskUsd : 0
  };
});


      console.log("✅ Parsed Trades:", mappedTrades);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(90, prev + 10));
      }, 200);

      await Trade.bulkCreate(mappedTrades);

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
      setTimeout(() => navigate(createPageUrl("Dashboard")), 1200);
    } catch (err) {
      console.error(err);
      setError("Error processing file. Please check the format and try again.");
      setProgress(0);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Trades</h1>
            <p className="text-slate-400 mt-1">
              Import your trading history from CSV or Excel
            </p>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-950/50 border-red-900 text-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-emerald-950/50 border-emerald-900 text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Trades uploaded successfully! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <FileSpreadsheet className="w-6 h-6 text-blue-400" />
              Import Trading Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Upload className="w-10 h-10 text-white" />
                </div>

                {!file ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      Drop your CSV or Excel file here
                    </h3>
                    <p className="text-slate-400 mb-2">
                      Supports .csv, .xlsx, and .xls formats
                    </p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Select File
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-xl mb-6">
                      <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                      <div className="text-left">
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-slate-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    {previewCount && (
                      <p className="text-sm text-slate-300 mb-4">
                        ✅ {previewCount} trades detected
                      </p>
                    )}

                    {missingColumns.length > 0 && (
                      <p className="text-sm text-yellow-400 mb-4">
                        ⚠️ Some columns are missing but will be skipped:{" "}
                        {missingColumns.join(", ")}
                      </p>
                    )}

                    {uploading && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2 mb-2" />
                        <p className="text-sm text-slate-400">
                          Processing trades...
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFile(null);
                          setProgress(0);
                          setPreviewCount(null);
                          setMissingColumns([]);
                        }}
                        disabled={uploading}
                        className="border-slate-700 hover:bg-slate-800 text-slate-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={processFile}
                        disabled={uploading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {uploading ? "Processing..." : "Upload & Process"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
