'use client';

import { FormEvent, useState } from 'react';

type Props = {
  gameId: number;
  description: string | null;
  onSaved: (game: { description: string | null; image_url: string | null }) => void;
};

export function EditGameInfo({ gameId, description, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/games/${gameId}`, { method: 'PUT', body: form });
      const game = await response.json();
      if (!response.ok) throw new Error(game.error || 'Gagal memperbarui informasi game.');
      onSaved({ description: game.description, image_url: game.image_url });
      setMessage('Informasi game berhasil diperbarui.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="game-edit">
    <button type="button" className="button-secondary" aria-expanded={open} onClick={() => setOpen(value => !value)}>
      {open ? 'Tutup edit' : 'Edit informasi'}
    </button>
    {open && <form className="game-form game-edit-form" onSubmit={submit} encType="multipart/form-data">
      <h2>Edit informasi game</h2>
      <label>Deskripsi<textarea name="description" rows={4} defaultValue={description || ''} placeholder="Tulis deskripsi game" /></label>
      <label>Ganti foto<input name="image" type="file" accept="image/*" /></label>
      <p className="muted">Kosongkan pilihan foto untuk tetap memakai foto saat ini.</p>
      <button disabled={busy} className="button-primary">{busy ? 'Menyimpan…' : 'Simpan perubahan'}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>}
  </div>;
}
