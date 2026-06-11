import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Admin } from "./pages/Admin";
import { Login, Register } from "./pages/AuthPages";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Landing } from "./pages/Landing";
import { PdfEditor } from "./pages/PdfEditor";
import { Tools } from "./pages/Tools";
import { Upload } from "./pages/Upload";

createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/pdf-editor" element={<PdfEditor />} />
            <Route path="/history" element={<History />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

