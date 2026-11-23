'use client';

import { FormEvent, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';
import gsap from 'gsap';

type Props = {
  gameId: number;
  description: string | null;
  onSaved: (game: { description: string | null; image_url: string | null }) => void;
};

export function EditGameInfo({ gameId, description, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await fetch(`/api/games/${gameId}`, { method: 'PUT', body: form });
      const game = await response.json();
      if (!response.ok) throw new Error(game.error || 'Gagal memperbarui informasi game.');

      onSaved({ description: game.description, image_url: game.image_url });

      // Success glow + bounce
      setSuccess(true);
      if (btnRef.current) {
        gsap.fromTo(btnRef.current,
          { scale: 0.9 },
          { scale: 1, duration: 0.5, ease: 'back.out(2.2)' }
        );
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { boxShadow: '0 0 0 0 #b7f34a00' },
          {
            boxShadow: '0 0 0 2px #b7f34a66, 0 0 24px #b7f34a22',
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () =>
              gsap.to(formRef.current!, { boxShadow: '0 0 0 0 #b7f34a00', duration: 0.55, delay: 0.5 }),
          }
        );
      }

      toast('✏️ Informasi game diperbarui!', 'success');
      setTimeout(() => { setSuccess(false); setOpen(false); }, 1500);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Terjadi kesalahan.', 'error');
      if (formRef.current) {
        gsap.fromTo(formRef.current, { x: -5 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="game-edit">
      <button
        type="button"
        className="button-secondary"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {open ? 'Tutup edit' : 'Edit informasi'}
      </button>
      {open && (
        <form ref={formRef} className="game-form game-edit-form" onSubmit={submit} encType="multipart/form-data">
          <h2>Edit informasi game</h2>
          <label>Deskripsi<textarea name="description" rows={4} defaultValue={description || ''} placeholder="Tulis deskripsi game" /></label>
          <label>Ganti foto<input name="image" type="file" accept="image/*" /></label>
          <p className="muted">Kosongkan pilihan foto untuk tetap memakai foto saat ini.</p>
          <button ref={btnRef} disabled={busy} className={`button-primary${success ? ' btn-success' : ''}`}>
            {success
              ? <><CheckCircle2 size={15} /> Tersimpan!</>
              : busy ? 'Menyimpan…' : 'Simpan perubahan'}
          </button>
        </form>
      )}
    </div>
  );
}
