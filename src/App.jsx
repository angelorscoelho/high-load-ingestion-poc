import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PocDashboard from './components/PocDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/poc/:companyId" element={<PocDashboard />} />
        <Route path="/" element={<Navigate to="/poc/default" replace />} />
        <Route path="*" element={<Navigate to="/poc/default" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
