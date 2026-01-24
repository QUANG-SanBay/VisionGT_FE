import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Profile from "./pages/profile/Profile";
import AppRouter from "./routers/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthRoutes />
      <AppRouter />
      <Routes>
        {/* Redirect gốc */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Fallback – tránh màn hình trắng */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
