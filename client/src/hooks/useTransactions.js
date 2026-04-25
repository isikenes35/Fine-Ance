import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import useAppStore from '../store/useAppStore';

export default function useTransactions() {
  const { period, currentDate } = useAppStore();
  const [transactions, setTransactions] = useState([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/transactions', {
        params: { period, date: currentDate },
      });
      setTransactions(res.data.transactions);
      setPeriodStart(res.data.periodStart);
      setPeriodEnd(res.data.periodEnd);
    } catch (err) {
      setError(err.response?.data?.error || 'Veriler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [period, currentDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, periodStart, periodEnd, loading, error, refetch: fetchTransactions };
}
