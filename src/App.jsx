import { useState } from 'react'

import './App.css'

// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import AdminNav from './components/AdminNav';

function App() {
  return (
    <BrowserRouter>
      {/* Top navigation with admin links (kept minimal) */}
      <AdminNav />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;