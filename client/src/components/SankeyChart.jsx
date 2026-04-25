import { useMemo, useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import { buildSankeyData } from '../lib/sankey';

export default function SankeyChart({ transactions, loading }) {
  const chartRef = useRef(null);

  const sankeyTrace = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;
    return buildSankeyData(transactions);
  }, [transactions]);

  useEffect(() => {
    if (!chartRef.current || !sankeyTrace) return;

    Plotly.newPlot(
      chartRef.current,
      [sankeyTrace],
      {
        font: {
          family: 'Inter, sans-serif',
          size: 13,
          color: '#F1F5F9',
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, r: 20, b: 20, l: 20 },
        height: 500,
      },
      {
        displayModeBar: false,
        responsive: true,
      }
    );

    return () => {
      if (chartRef.current) {
        Plotly.purge(chartRef.current);
      }
    };
  }, [sankeyTrace]);

  if (loading) {
    return (
      <div className="glass-card sankey-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-skeleton" style={{ width: 200, height: 20, margin: '0 auto var(--space-3)' }} />
          <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Diyagram yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!sankeyTrace) {
    return (
      <div className="glass-card sankey-container">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">Görselleştirilecek veri yok</div>
          <div className="empty-state-desc">
            Sankey diyagramını görmek için önce gelir ve gider verilerinizi girin.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card sankey-container animate-slide-up" id="sankey-chart-container">
      <div ref={chartRef} style={{ width: '100%', height: 500 }} />
    </div>
  );
}
