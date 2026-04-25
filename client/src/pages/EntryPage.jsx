import TransactionForm from '../components/TransactionForm';
import RecentTransactions from '../components/RecentTransactions';
import useTransactions from '../hooks/useTransactions';
import useAppStore from '../store/useAppStore';

export default function EntryPage() {
  const { transactions, periodStart, periodEnd, loading, refetch } = useTransactions();
  const { period } = useAppStore();

  const totalIncome = transactions.filter((t) => t.category.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.category.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;

  const fmt = (v) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(v);

  const periodLabel = period === 'weekly' ? 'Bu Hafta' : 'Bu Ay';

  return (
    <div className="page-container">
      <h1 className="page-title">Veri Girişi</h1>
      <p className="page-subtitle">{periodLabel} — {periodStart} / {periodEnd}</p>

      {/* Summary */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-card-label">Toplam Gelir</div>
          <div className="summary-card-value income">{fmt(totalIncome)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Toplam Gider</div>
          <div className="summary-card-value expense">{fmt(totalExpense)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Net</div>
          <div className={`summary-card-value ${net >= 0 ? 'net' : 'expense'}`}>{fmt(net)}</div>
        </div>
      </div>

      {/* Form + List */}
      <div className="entry-layout">
        <TransactionForm onSuccess={refetch} />
        <RecentTransactions transactions={transactions} loading={loading} onRefresh={refetch} />
      </div>
    </div>
  );
}
