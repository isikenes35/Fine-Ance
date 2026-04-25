import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function TransactionForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('Lütfen bir kategori seçin.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Lütfen geçerli bir tutar girin.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/transactions', {
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        description: description.trim() || null,
        entryDate,
      });

      toast.success('İşlem başarıyla eklendi!');
      setCategoryId('');
      setAmount('');
      setDescription('');
      setEntryDate(new Date().toISOString().slice(0, 10));
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.error || 'İşlem eklenirken hata oluştu.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card animate-fade-in" id="transaction-form">
      <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
        Yeni İşlem Ekle
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category-select">Kategori</label>
          <select
            id="category-select"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Kategori seçin...</option>
            <optgroup label="💰 Gelirler">
              {incomeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="💸 Giderler">
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount-input">Tutar (₺)</label>
          <input
            id="amount-input"
            type="number"
            className="form-input"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="date-input">Tarih</label>
          <input
            id="date-input"
            type="date"
            className="form-input"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="desc-input">Açıklama (isteğe bağlı)</label>
          <input
            id="desc-input"
            type="text"
            className="form-input"
            placeholder="Kısa bir açıklama..."
            maxLength={255}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          id="submit-transaction"
          style={{ marginTop: 'var(--space-2)', width: '100%' }}
        >
          {submitting ? 'Ekleniyor...' : 'İşlemi Kaydet'}
        </button>
      </div>
    </form>
  );
}
