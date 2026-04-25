import SankeyChart from '../components/SankeyChart';
import ExportPDFButton from '../components/ExportPDFButton';
import useTransactions from '../hooks/useTransactions';
import useAppStore from '../store/useAppStore';

export default function SankeyPage() {
  const { transactions, periodStart, periodEnd, loading } = useTransactions();
  const { period } = useAppStore();

  const periodLabel = period === 'weekly'
    ? `Haftalık: ${periodStart} — ${periodEnd}`
    : `Aylık: ${periodStart} — ${periodEnd}`;

  const totalIncome = transactions.filter((t) => t.category.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.category.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const fmt = (v) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(v);

  return (
    <div className="page-container">
      <div className="sankey-header">
        <div>
          <h1 className="page-title">Sankey Diyagramı</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>{periodLabel}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Gelir</div>
            <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--income-color)' }}>{fmt(totalIncome)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Gider</div>
            <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--expense-color)' }}>{fmt(totalExpense)}</div>
          </div>
          <ExportPDFButton periodLabel={periodLabel} />
        </div>
      </div>

      <SankeyChart transactions={transactions} loading={loading} />
    </div>
  );
}
