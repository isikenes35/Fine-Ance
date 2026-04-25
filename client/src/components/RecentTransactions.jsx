import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function RecentTransactions({ transactions, loading, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the edit dropdown
  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/transactions/${id}`);
      toast.success('İşlem silindi.');
      setConfirmDelete(null);
      onRefresh?.();
    } catch (err) {
      toast.error('İşlem silinirken hata oluştu.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSave = async () => {
    if (!editingTransaction) return;

    const { id, categoryId, amount, description, entryDate } = editingTransaction;

    if (!categoryId || !amount || parseFloat(amount) <= 0) {
      toast.error('Lütfen geçerli bilgileri girin.');
      return;
    }

    try {
      await api.put(`/transactions/${id}`, {
        categoryId: parseInt(categoryId),
        amount: parseFloat(amount),
        description: description?.trim() || null,
        entryDate,
      });
      toast.success('İşlem güncellendi!');
      setEditingTransaction(null);
      onRefresh?.();
    } catch (err) {
      toast.error('İşlem güncellenirken hata oluştu.');
    }
  };

  const openEdit = (t) => {
    setEditingTransaction({
      id: t.id,
      categoryId: String(t.category.id),
      amount: String(t.amount),
      description: t.description || '',
      entryDate: typeof t.entryDate === 'string'
        ? t.entryDate.slice(0, 10)
        : dayjs(t.entryDate).format('YYYY-MM-DD'),
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  if (loading) {
    return (
      <div className="glass-card">
        <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
          Son İşlemler
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="loading-skeleton" style={{ height: 56, width: '100%' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card animate-fade-in">
        <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
          Son İşlemler
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 'var(--space-3)' }}>
            ({transactions.length} kayıt)
          </span>
        </h2>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">Henüz işlem yok</div>
            <div className="empty-state-desc">
              Bu dönem için henüz bir gelir veya gider kaydı bulunmuyor.
            </div>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((t, index) => (
              <div
                key={t.id}
                className="transaction-item"
                style={{ animationDelay: `${index * 50}ms`, animation: 'fadeIn 0.3s ease forwards', opacity: 0 }}
              >
                <div
                  className="transaction-category-dot"
                  style={{ backgroundColor: t.category.colorHex }}
                />
                <div className="transaction-info">
                  <div className="transaction-category-name">{t.category.name}</div>
                  {t.description && (
                    <div className="transaction-desc">{t.description}</div>
                  )}
                </div>
                <div className="transaction-date">
                  {dayjs(t.entryDate).format('DD MMM')}
                </div>
                <div className={`transaction-amount ${t.category.type}`}>
                  {t.category.type === 'income' ? '+' : '−'}{formatAmount(t.amount)}
                </div>
                <div className="transaction-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => openEdit(t)}
                    title="Düzenle"
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setConfirmDelete(t.id)}
                    disabled={deletingId === t.id}
                    title="Sil"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="confirm-overlay" onClick={() => setEditingTransaction(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h3>İşlemi Düzenle</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {/* Category */}
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  className="form-select"
                  value={editingTransaction.categoryId}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, categoryId: e.target.value })}
                >
                  <optgroup label="💰 Gelirler">
                    {incomeCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💸 Giderler">
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label className="form-label">Tutar (₺)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0.01"
                  step="0.01"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Tarih</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingTransaction.entryDate}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, entryDate: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Kısa bir açıklama..."
                  maxLength={255}
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                />
              </div>
            </div>

            <div className="confirm-dialog-actions" style={{ marginTop: 'var(--space-6)' }}>
              <button className="btn btn-secondary" onClick={() => setEditingTransaction(null)}>
                İptal
              </button>
              <button className="btn btn-primary" onClick={handleEditSave}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>İşlemi Sil</h3>
            <p>Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="confirm-dialog-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                İptal
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
              >
                {deletingId === confirmDelete ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
