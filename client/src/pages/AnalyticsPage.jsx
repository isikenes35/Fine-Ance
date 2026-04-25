import { useState, useEffect } from 'react';
import IncomeExpenseBarChart from '../components/IncomeExpenseBarChart';
import CategoryTrendLineChart from '../components/CategoryTrendLineChart';
import useAppStore from '../store/useAppStore';
import api from '../lib/api';

export default function AnalyticsPage() {
  const { period } = useAppStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/analytics/history', { params: { period, count: 12 } })
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [period]);

  const periodLabel = period === 'weekly' ? 'Haftalık' : 'Aylık';

  return (
    <div className="page-container">
      <h1 className="page-title">Analiz</h1>
      <p className="page-subtitle">Son 12 {periodLabel.toLowerCase()} dönemin karşılaştırmalı analizi</p>

      <div className="charts-grid">
        <IncomeExpenseBarChart data={data} loading={loading} />
        <CategoryTrendLineChart data={data} loading={loading} />
      </div>
    </div>
  );
}
