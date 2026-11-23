'use client';
import { FormEvent, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Console } from '@/lib/types';
import { useToast } from './Toast';
import gsap from 'gsap';

export function GameForm({ consoles, onCreated }: { consoles: Console[]; onCreated?: (game: unknown) => void }) {
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setBusy(true);
    const form = new FormData(formElement);
    try {
      const res = await fetch('/api/games', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');

      // Success animation
      setSuccess(true);
      if (btnRef.current) {
        gsap.fromTo(btnRef.current,
          { scale: 0.92 },
          { scale: 1, duration: 0.45, ease: 'back.out(2)' }
        );
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { boxShadow: '0 0 0 0 #b7f34a00' },
          { boxShadow: '0 0 0 3px #b7f34a55, 0 0 32px #b7f34a22', duration: 0.4, ease: 'power2.out',
            onComplete: () => gsap.to(formRef.current!, { boxShadow: '0 0 0 0 #b7f34a00', duration: 0.6, delay: 0.4 }) }
        );
      }

      toast('✅ Game berhasil ditambahkan!', 'success');
      onCreated?.(data);
      formElement.reset();
      setTimeout(() => setSuccess(false), 1800);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Terjadi kesalahan.', 'error');
      if (formRef.current) {
        gsap.fromTo(formRef.current, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} className="game-form" onSubmit={submit} encType="multipart/form-data">
      <h2>Tambah game</h2>
      <label>Judul<input name="title" required placeholder="Contoh: Shadow of the Colossus" /></label>
      <div className="form-row">
        <label>Konsol
          <select name="console_id" required defaultValue="">
            <option value="" disabled>Pilih konsol</option>
            {consoles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>Genre<input name="genre" required placeholder="Action adventure" /></label>
      </div>
      <div className="form-row">
        <label>Tahun rilis<input name="release_year" type="number" min="1970" max="2100" /></label>
        <label>Foto<input name="image" type="file" accept="image/*" /></label>
      </div>
      <label>Deskripsi<textarea name="description" rows={3} /></label>
      <button ref={btnRef} disabled={busy} className={`button-primary${success ? ' btn-success' : ''}`}>
        {success
          ? <><CheckCircle2 size={15} /> Tersimpan!</>
          : busy ? 'Menyimpan…' : 'Simpan game'}
      </button>
    </form>
  );
}
