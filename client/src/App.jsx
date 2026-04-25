import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EntryPage from './pages/EntryPage';
import SankeyPage from './pages/SankeyPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/sankey" element={<SankeyPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
