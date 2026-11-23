'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine, Gamepad2, X } from 'lucide-react';
import gsap from 'gsap';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// Japanese kanji/kana for gaming aesthetic
const KANJI_LINES = [
  { jp: 'レトロ', en: 'RETRO' },
  { jp: '記憶', en: 'MEMORY' },
  { jp: '保存庫', en: 'VAULT' },
  { jp: 'ゲーム', en: 'GAME' },
  { jp: '起動中', en: 'LOADING' },
];

const BOOT_LINES = [
  'システム初期化中…',
  'コレクション読込中…',
  'アーカイブ展開中…',
  'RetroVault OS v1.0',
];

export function PwaExperience() {
  const [splash, setSplash] = useState(true);
  const [phase, setPhase] = useState<'boot' | 'logo' | 'exit'>('boot');
  const [bootLine, setBootLine] = useState(0);
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
    const handleInstalled = () => { setInstallEvent(null); setShowInstall(false); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    // Boot sequence: cycle through lines
    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      lineIdx++;
      setBootLine(lineIdx);
      if (lineIdx >= BOOT_LINES.length - 1) {
        clearInterval(lineInterval);
        setTimeout(() => setPhase('logo'), 200);
      }
    }, 180);

    // Transition to exit
    const exitTimer = setTimeout(() => setPhase('exit'), 1000);

    // Remove splash
    const splashTimer = setTimeout(() => {
      setSplash(false);
      if (!isStandalone()) setShowInstall(true);
    }, 1420);

    return () => {
      clearInterval(lineInterval);
      clearTimeout(exitTimer);
      clearTimeout(splashTimer);
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

  return (
    <>
      {splash && (
        <div className={`pwa-splash splash-phase-${phase}`} role="status" aria-label="Memuat RetroVault">
          {/* Scan lines overlay */}
          <div className="splash-scanlines" aria-hidden="true" />

          {/* Corner decorations */}
          <div className="splash-corner splash-corner-tl" aria-hidden="true" />
          <div className="splash-corner splash-corner-tr" aria-hidden="true" />
          <div className="splash-corner splash-corner-bl" aria-hidden="true" />
          <div className="splash-corner splash-corner-br" aria-hidden="true" />

          {/* Floating kanji */}
          <div className="splash-kanji-field" aria-hidden="true">
            {KANJI_LINES.map((k, i) => (
              <span key={i} className="splash-kanji" style={{ '--ki': i } as React.CSSProperties}>
                {k.jp}
              </span>
            ))}
          </div>

          {/* Boot terminal */}
          <div className={`splash-terminal${phase !== 'boot' ? ' terminal-hidden' : ''}`} aria-hidden="true">
            {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
              <div key={i} className={`terminal-line${i === bootLine ? ' terminal-line-active' : ''}`}>
                <span className="terminal-prompt">▸</span>
                <span className="terminal-text">{line}</span>
                {i === bootLine && <span className="terminal-cursor" />}
              </div>
            ))}
          </div>

          {/* Logo phase */}
          <div className={`splash-logo-wrap${phase === 'logo' || phase === 'exit' ? ' logo-visible' : ''}`}>
            <div className="splash-mark">
              <Gamepad2 size={38} strokeWidth={1.5} />
            </div>
            <div className="splash-title-jp" aria-hidden="true">レトロヴォルト</div>
            <p className="splash-wordmark">RETRO<span>VAULT</span></p>
            <div className="splash-sub-jp" aria-hidden="true">
              <span>ゲームアーカイブシステム</span>
            </div>
            <div className="splash-track"><i /></div>
            <small>MEMUAT ARSIP — 起動中</small>
          </div>

          {/* Horizontal line sweep */}
          <div className="splash-line-sweep" aria-hidden="true" />
        </div>
      )}

      {showInstall && !splash && (
        <div className="install-backdrop" role="presentation">
          <section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title">
            <button className="install-close" aria-label="Tutup" onClick={() => setShowInstall(false)}><X size={17} /></button>
            <div className="install-icon"><Gamepad2 size={26} /></div>
            <p className="eyebrow">RETROVAULT / APP</p>
            <h2 id="install-title">Bawa koleksimu<br /><em>ke layar utama.</em></h2>
            <p className="install-description">Pasang RetroVault agar arsip game klasik selalu mudah dijangkau.</p>
            {ios
              ? <p className="ios-hint">Di Safari, tekan <strong>Bagikan</strong> lalu pilih <strong>Tambah ke Layar Utama</strong>.</p>
              : installEvent
                ? <button className="button-primary install-action" onClick={install}><ArrowDownToLine size={17} /> Install aplikasi</button>
                : <p className="ios-hint">Gunakan menu browser dan pilih <strong>Install app</strong> atau <strong>Add to Home Screen</strong>.</p>
            }
            <button className="install-later" onClick={() => setShowInstall(false)}>Nanti saja</button>
          </section>
        </div>
      )}
    </>
  );
}
