'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine, Gamepad2, X } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PwaExperience() {
  const [splash, setSplash] = useState(true);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const agent = navigator.userAgent;
    setIos(/iphone|ipad|ipod/i.test(agent));
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setShowInstall(false);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    const splashTimer = window.setTimeout(() => {
      setSplash(false);
      if (!isStandalone()) setShowInstall(true);
    }, 1050);

    return () => {
      window.clearTimeout(splashTimer);
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setShowInstall(false);
    setInstallEvent(null);
  }

  return <>
    {splash && <div className="pwa-splash" role="status" aria-label="Memuat RetroVault">
      <div className="splash-mark"><Gamepad2 size={35} strokeWidth={1.5}/></div>
      <p className="splash-wordmark">RETRO<span>VAULT</span></p>
      <div className="splash-track"><i/></div>
      <small>MEMUAT ARSIP</small>
    </div>}

    {showInstall && !splash && <div className="install-backdrop" role="presentation">
      <section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <button className="install-close" aria-label="Tutup" onClick={() => setShowInstall(false)}><X size={17}/></button>
        <div className="install-icon"><Gamepad2 size={26}/></div>
        <p className="eyebrow">RETROVAULT / APP</p>
        <h2 id="install-title">Bawa koleksimu<br/><em>ke layar utama.</em></h2>
        <p className="install-description">Pasang RetroVault agar arsip game klasik selalu mudah dijangkau.</p>
        {ios ? <p className="ios-hint">Di Safari, tekan <strong>Bagikan</strong> lalu pilih <strong>Tambah ke Layar Utama</strong>.</p> : installEvent ? <button className="button-primary install-action" onClick={install}><ArrowDownToLine size={17}/> Install aplikasi</button> : <p className="ios-hint">Gunakan menu browser dan pilih <strong>Install app</strong> atau <strong>Add to Home Screen</strong>.</p>}
        <button className="install-later" onClick={() => setShowInstall(false)}>Nanti saja</button>
      </section>
    </div>}
  </>;
}
