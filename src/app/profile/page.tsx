'use client';

import { ArrowUpRight, Gamepad2, Github, Radio } from 'lucide-react';
import { ProfilePortrait } from '@/components/ProfilePortrait';
import { useProfileAnim } from '@/hooks/useGsapAnimations';

// Kamus mini — label Indonesia → 日本語
const JP = {
  tentangProyek:  'プロジェクトについて',
  dibuatOleh:     '制作者',
  nim:            '学籍番号',
  kelompok:       'グループ',
  proyek:         'プロジェクト / 2026',
  arsip:          'アーカイブ',
  player01:       'プレイヤー 01',
  mahasiswa:      '大学生　·　開発者',
  semangatRetro:  'レトロの精神',
  manifesto:      'RetroVault マニフェスト',
};

export default function ProfilePage() {
  useProfileAnim();

  return (
    <div className="profile-page profile-editorial">

      {/* ── INTRO BLOCK ─────────────────────── */}
      <header className="profile-intro-block">
        <p className="eyebrow">
          TENTANG PROYEK
          <span className="profile-rule" />
          <span className="eyebrow-jp" aria-hidden="true">{JP.tentangProyek}</span>
        </p>
        <h1 style={{ perspective: '600px' }}>
          {'Hi, player'.split('').map((char, i) => (
            <span
              key={i}
              className="pc-char"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <span
            className="pc-char profile-period"
          >
            .
          </span>
        </h1>
        <p className="profile-intro">
          Saya membuat RetroVault sebagai ruang untuk merawat koleksi game
          klasik—lengkap dengan perangkat, cerita, dan kenangan di balik setiap judul.
        </p>
      </header>

      {/* ── IDENTITY CARD ───────────────────── */}
      <section className="profile-identity" aria-label="Identitas pembuat">

        {/* Floating JP watermark behind card */}
        <span className="profile-jp-bg" aria-hidden="true">記憶</span>

        <ProfilePortrait />

        <div className="identity-main">
          <p className="eyebrow">
            DIBUAT OLEH
            <span className="eyebrow-jp" aria-hidden="true"> · {JP.dibuatOleh}</span>
          </p>
          <h2>Ahmad Dika Styansah</h2>
          <p className="identity-subtitle">
            Mahasiswa · Pengembang RetroVault
            <span className="subtitle-jp" aria-hidden="true"> — {JP.mahasiswa}</span>
          </p>
          <div className="identity-facts">
            <div>
              <span>NIM <span className="fact-jp" aria-hidden="true">/ {JP.nim}</span></span>
              <strong>21120124130052</strong>
            </div>
            <div>
              <span>KELOMPOK <span className="fact-jp" aria-hidden="true">/ {JP.kelompok}</span></span>
              <strong>23</strong>
            </div>
          </div>
        </div>

        <div className="identity-stamp">
          <Gamepad2 size={19} />
          <span>
            {JP.player01}<br />
            PLAYER<br />01
          </span>
        </div>
      </section>

      {/* ── PROJECT SECTION ─────────────────── */}
      <section className="profile-project">
        <div className="project-heading">
          <p className="eyebrow">
            PROYEK / 2026
            <span className="eyebrow-jp" aria-hidden="true"> — {JP.proyek}</span>
          </p>
          <span className="project-status"><i />PPB</span>
        </div>

        <h2>
          {'Arsip kecil untuk'.split(' ').map((w, i) => (
            <span key={i} className="pp-word" style={{ marginRight: '0.22em' }}>
              {w}
            </span>
          ))}
          <br />
          <em>
            {'kenangan besar.'.split(' ').map((w, i) => (
              <span key={i} className="pp-word" style={{ marginRight: '0.22em' }}>
                {w}
              </span>
            ))}
          </em>
        </h2>

        {/* JP tagline row */}
        <p className="project-jp-tagline" aria-hidden="true">
          <span>小さな</span><span>{JP.arsip}</span><span>、大きな思い出</span>
        </p>

        <p>
          RetroVault menggabungkan katalog koleksi, riwayat aset, dan ulasan
          dalam satu aplikasi web yang bisa dipasang di perangkat.
        </p>

        <div className="project-meta">
          <span><Radio size={15} /> Praktikum Pemrograman Perangkat Bergerak</span>
          <span>SUPABASE · CLOUDINARY · NEXT.JS</span>
        </div>

        <div className="project-actions">
          <a href="/games" className="profile-cta">Jelajahi koleksi <ArrowUpRight size={16} /></a>
          <a
            href="https://github.com/dkaastyns/RetroVault"
            className="profile-cta profile-github"
            target="_blank"
            rel="noreferrer"
          >
            Lihat di GitHub <Github size={15} />
          </a>
        </div>

        {/* Decorative JP quote strip */}
        <div className="project-jp-strip" aria-hidden="true">
          <span>ゲーム</span>
          <span>·</span>
          <span>コレクション</span>
          <span>·</span>
          <span>思い出</span>
          <span>·</span>
          <span>レトロ</span>
          <span>·</span>
          <span>保存庫</span>
        </div>
      </section>

      {/* ── MANIFESTO QUOTE ─────────────────── */}
      <div className="profile-manifesto">
        <span className="manifesto-quote-mark" aria-hidden="true">"</span>
        <p>すべてのゲームには物語がある。</p>
        <small aria-label="Setiap game punya cerita.">Every game has a story.</small>
        <span className="manifesto-label">{JP.manifesto}</span>
      </div>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="profile-footer">
        <span>RETROVAULT</span>
        <span>Dibuat dengan rasa ingin tahu dan nostalgia.</span>
        <span>© 2026 · レトロヴォルト</span>
      </footer>
    </div>
  );
}
