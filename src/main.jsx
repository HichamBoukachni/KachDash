import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import AdvancedStats from "./pages/AdvancedStats.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🧱 Layout er parent med <Outlet /> */}
        <Route path="/" element={<Layout />}>
          {/* 📊 Default route viser Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Andre undersider */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="advanced-stats" element={<AdvancedStats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
