import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function CategoryTrendLineChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const catMap = {};
    data.forEach((period) => {
      period.byCategory.forEach((cat) => {
        if (!catMap[cat.id]) {
          catMap[cat.id] = { name: cat.name, type: cat.type, color: cat.colorHex, data: [] };
        }
        catMap[cat.id].data.push(cat.total);
      });
    });

    const datasets = Object.values(catMap)
      .filter((c) => c.data.some((v) => v > 0))
      .map((c) => ({
        label: c.name,
        data: c.data,
        borderColor: c.color,
        backgroundColor: c.color + '1A',
        pointBackgroundColor: c.color,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      }));

    return { labels: data.map((d) => d.periodLabel), datasets };
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
          font: { family: 'Inter', size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(148,163,184,0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const val = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ctx.raw);
            return `  ${ctx.dataset.label}: ${val}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Inter', size: 11 }, maxRotation: 45 }, grid: { display: false }, border: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#64748B', font: { family: 'Inter', size: 11 }, callback: (v) => `₺${v.toLocaleString('tr-TR')}` }, grid: { color: 'rgba(148,163,184,0.06)' }, border: { display: false } },
    },
  };

  if (loading) {
    return (
      <div className="glass-card chart-card">
        <h3>Kategori Trendleri</h3>
        <div className="loading-skeleton" style={{ height: 300, width: '100%' }} />
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="glass-card chart-card">
        <h3>Kategori Trendleri</h3>
        <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
          <div className="empty-state-icon">📈</div>
          <div className="empty-state-desc">Henüz yeterli veri yok.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-card animate-slide-up" style={{ animationDelay: '100ms' }}>
      <h3>Kategori Trendleri</h3>
      <div style={{ height: 350 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
