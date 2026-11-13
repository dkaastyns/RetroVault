import { ArrowUpRight, Gamepad2, Radio } from 'lucide-react';
import { ProfilePortrait } from '@/components/ProfilePortrait';

export default function ProfilePage() {
  return <div className="profile-page profile-editorial">
    <header className="profile-intro-block">
      <p className="eyebrow">TENTANG PROYEK <span className="profile-rule"/></p>
      <h1>Hi, player<span className="profile-period">.</span></h1>
      <p className="profile-intro">Saya membuat RetroVault sebagai ruang untuk merawat koleksi game klasik—lengkap dengan perangkat, cerita, dan kenangan di balik setiap judul.</p>
    </header>

    <section className="profile-identity" aria-label="Identitas pembuat">
      <ProfilePortrait/>
      <div className="identity-main">
        <p className="eyebrow">DIBUAT OLEH</p>
        <h2>Ahmad Dika Styansah</h2>
        <p className="identity-subtitle">Mahasiswa · Pengembang RetroVault</p>
        <div className="identity-facts">
          <div><span>NIM</span><strong>21120124130052</strong></div>
          <div><span>KELOMPOK</span><strong>23</strong></div>
        </div>
      </div>
      <div className="identity-stamp"><Gamepad2 size={19}/><span>PLAYER<br/>01</span></div>
    </section>

    <section className="profile-project">
      <div className="project-heading"><p className="eyebrow">PROYEK / 2026</p><span className="project-status"><i/> PPB</span></div>
      <h2>Arsip kecil untuk<br/><em>kenangan besar.</em></h2>
      <p>RetroVault menggabungkan katalog koleksi, riwayat aset, dan ulasan dalam satu aplikasi web yang bisa dipasang di perangkat.</p>
      <div className="project-meta"><span><Radio size={15}/> Praktikum Pengembangan dan Pemrograman Berbasis Web</span><span>SUPABASE · CLOUDINARY · NEXT.JS</span></div>
      <a href="/games" className="profile-cta">Jelajahi koleksi <ArrowUpRight size={16}/></a>
    </section>
    <footer className="profile-footer"><span>RETROVAULT</span><span>Dibuat dengan rasa ingin tahu dan nostalgia.</span><span>© 2026</span></footer>
  </div>;
}
