// export default App
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Welcome from './pages/Welcome.jsx';
import Public from './components/PublicRoute.jsx';
import Private from './components/PrivateRoute.jsx';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Public><Welcome /></Public>} />
        <Route path="/login" element={<Public><Login /></Public>} />

        <Route path="/home" element={<Private><Home /></Private>} />

        <Route path="*" element={<Navigate to="/welcome" replace />} /> 
      </Routes>
    </BrowserRouter>
  );
}