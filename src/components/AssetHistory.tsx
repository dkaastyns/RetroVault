'use client';

import { FormEvent, useState } from 'react';

export type AssetTransaction = { id: number; game_id: number; status: 'Koleksi' | 'Wishlist' | 'Terjual'; purchase_price: string; purchase_date: string | null };
const statuses: AssetTransaction['status'][] = ['Koleksi', 'Wishlist', 'Terjual'];

export function AssetHistory({ gameId, transactions, onChange }: { gameId: number; transactions: AssetTransaction[]; onChange: (items: AssetTransaction[]) => void }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>, transactionId?: number) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true); setMessage('');
    try {
      const response = await fetch(transactionId ? `/api/games/${gameId}/transactions/${transactionId}` : `/api/games/${gameId}/transactions`, {
        method: transactionId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: form.get('status'), purchase_price: form.get('purchase_price') || '0', purchase_date: form.get('purchase_date') || null })
      });
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.error || 'Transaksi gagal disimpan.');
      onChange(transactionId ? transactions.map(item => item.id === transactionId ? result : item) : [result, ...transactions]);
      setEditing(null); setMessage(transactionId ? 'Transaksi diperbarui.' : 'Transaksi ditambahkan.');
      if (!transactionId) formElement.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan.'); }
    finally { setBusy(false); }
  }

  async function remove(transactionId: number) {
    if (!window.confirm('Hapus catatan transaksi ini?')) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/games/${gameId}/transactions/${transactionId}`, { method: 'DELETE' });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Transaksi gagal dihapus.'); }
      onChange(transactions.filter(item => item.id !== transactionId)); setMessage('Transaksi dihapus.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan.'); }
    finally { setBusy(false); }
  }

  function fields(item?: AssetTransaction) {
    return <>
      <label>Status<select name="status" defaultValue={item?.status || 'Koleksi'}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
      <div className="asset-fields-row">
        <label>Harga (Rp)<input name="purchase_price" type="number" min="0" step="0.01" defaultValue={item?.purchase_price || '0'} /></label>
        <label>Tanggal<input name="purchase_date" type="date" defaultValue={item?.purchase_date?.slice(0, 10) || ''} /></label>
      </div>
      <div className="asset-form-actions"><button className="button-primary" disabled={busy}>{busy ? 'Menyimpan…' : item ? 'Simpan edit' : 'Tambah catatan'}</button>{item && <button type="button" className="button-secondary" onClick={() => setEditing(null)}>Batal</button>}</div>
    </>;
  }

  return <div className="asset-history">
    {transactions.length === 0 && <p className="muted">Belum ada transaksi.</p>}
    {transactions.map(item => <div className="asset-entry" key={item.id}>
      {editing === item.id ? <form className="asset-form" onSubmit={event => submit(event, item.id)}>{fields(item)}</form> : <>
        <div className="list-row"><span>{item.status}</span><strong>Rp {Number(item.purchase_price).toLocaleString('id-ID')}</strong><small>{item.purchase_date ? new Date(`${item.purchase_date.slice(0,10)}T00:00:00`).toLocaleDateString('id-ID') : '—'}</small></div>
        <div className="asset-entry-actions"><button type="button" className="button-secondary" onClick={() => setEditing(item.id)}>Edit</button><button type="button" className="button-secondary" disabled={busy} onClick={() => remove(item.id)}>Hapus</button></div>
      </>}
    </div>)}
    <form className="asset-form" onSubmit={event => submit(event)}><h3>Tambah riwayat aset</h3>{fields()}</form>
    {message && <p className="form-message" role="status">{message}</p>}
  </div>;
}
