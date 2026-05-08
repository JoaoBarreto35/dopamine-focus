import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell"
import { Dashboard } from "../pages/Dashboard";
import { Focus } from "../pages/Focus";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Rewards } from "../pages/Rewards";
import { Tasks } from "../pages/Tasks";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/rewards" element={<Rewards />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}