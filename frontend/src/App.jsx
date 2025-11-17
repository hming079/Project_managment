// export default App
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Public from './components/PublicRoute.jsx';
import Private from './components/PrivateRoute.jsx';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Public><Login /></Public>} />
        <Route path="/home" element={<Private><Home /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}