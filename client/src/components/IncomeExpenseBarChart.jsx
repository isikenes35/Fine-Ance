import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IncomeExpenseBarChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    return {
      labels: data.map((d) => d.periodLabel),
      datasets: [
        {
          label: 'Gelir',
          data: data.map((d) => d.totalIncome),
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4CAF50',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Gider',
          data: data.map((d) => d.totalExpense),
          backgroundColor: 'rgba(239, 83, 80, 0.7)',
          borderColor: '#EF5350',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 13, weight: 600 },
        bodyFont: { family: 'Inter', size: 12 },
        callbacks: {
          label: (ctx) => {
            const val = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ctx.raw);
            return `  ${ctx.dataset.label}: ${val}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748B', font: { family: 'Inter', size: 11 }, maxRotation: 45 },
        grid: { display: false },
        border: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      y: {
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `₺${val.toLocaleString('tr-TR')}`,
        },
        grid: { color: 'rgba(148, 163, 184, 0.06)' },
        border: { display: false },
      },
    },
  };

  if (loading) {
    return (
      <div className="glass-card chart-card">
        <h3>Gelir vs. Gider</h3>
        <div className="loading-skeleton" style={{ height: 300, width: '100%' }} />
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="glass-card chart-card">
        <h3>Gelir vs. Gider</h3>
        <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-desc">Henüz yeterli veri yok.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-card animate-slide-up">
      <h3>Gelir vs. Gider</h3>
      <div style={{ height: 350 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
