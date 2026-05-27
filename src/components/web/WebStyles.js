export const C = {
  navyDeep: '#061829',
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  green: '#00FF88',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textTertiary: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.10)',
};

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,700;9..144,800&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  .wd-root { font-family: 'Manrope', system-ui, sans-serif; flex: 1; min-width: 0; width: 100%; }
  .wd-display { font-family: 'Fraunces', Georgia, serif; }

  /* Scrollbar */
  .wd-scroll::-webkit-scrollbar { width: 4px; }
  .wd-scroll::-webkit-scrollbar-track { background: transparent; }
  .wd-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  /* Cards */
  .wd-card {
    background: rgba(20,184,212,0.07);
    border-left: 4px solid ${C.cyan};
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .wd-card:hover { transform: translateY(-2px); }
  .wd-card-gold {
    background: rgba(201,150,26,0.07);
    border-left: 4px solid ${C.gold};
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s;
  }
  .wd-card-gold:hover { transform: translateY(-2px); }
  .wd-card-green {
    background: rgba(0,255,136,0.05);
    border-left: 4px solid ${C.green};
    border-radius: 16px;
    padding: 20px;
  }

  /* Bottom tab nav (mobile) */
  .wd-tab-btn {
    flex: 1; padding: 12px 8px; text-align: center;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: rgba(255,255,255,0.5); cursor: pointer;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 11px; font-weight: 600;
    transition: all 0.2s;
  }
  .wd-tab-btn:hover { color: rgba(255,255,255,0.85); }
  .wd-tab-btn.active { border-bottom-color: ${C.gold}; color: ${C.gold}; }

  /* Sidebar nav item (desktop) */
  .wd-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px; border-radius: 12px;
    cursor: pointer; border: none; background: none; width: 100%;
    color: rgba(255,255,255,0.5);
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px; font-weight: 600;
    transition: all 0.2s; text-align: left; margin-bottom: 4px;
  }
  .wd-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
  .wd-nav-item.active { background: rgba(201,150,26,0.12); color: ${C.gold}; }

  /* Misc */
  .wd-post-card {
    background: rgba(20,184,212,0.06);
    border-left: 4px solid ${C.cyan};
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
    transition: transform 0.2s;
  }
  .wd-post-card:hover { transform: translateY(-1px); }
  .wd-talk-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px; border-radius: 12px;
    margin-bottom: 10px; cursor: pointer;
    background: rgba(20,184,212,0.05);
    border-left: 3px solid ${C.cyan};
    transition: background 0.2s, transform 0.2s;
  }
  .wd-talk-item:hover { background: rgba(20,184,212,0.1); transform: translateX(2px); }
  .wd-metric-bar { height: 6px; background: rgba(255,255,255,0.10); border-radius: 3px; overflow: hidden; margin: 8px 0 4px; }
  .wd-setting-row {
    display: flex; align-items: center; gap: 14px;
    padding: 16px; cursor: pointer;
    transition: background 0.15s; border-radius: 8px;
  }
  .wd-setting-row:hover { background: rgba(255,255,255,0.04); }

  /* Responsive layout */
  .wd-layout { display: flex; min-height: 100vh; }
  .wd-sidebar {
    width: 220px; flex-shrink: 0;
    background: rgba(255,255,255,0.025);
    border-right: 1px solid ${C.border};
    position: fixed; top: 0; left: 0; bottom: 0;
    display: flex; flex-direction: column;
    padding: 24px 12px;
    z-index: 100;
  }
  .wd-main-desktop { margin-left: 220px; flex: 1; min-height: 100vh; }
  .wd-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(10,37,64,0.96);
    backdrop-filter: blur(20px);
    border-top: 1px solid ${C.border};
    display: none; z-index: 100;
  }

  /* Desktop: show sidebar, hide bottom nav */
  @media (min-width: 768px) {
    .wd-sidebar { display: flex; }
    .wd-main-desktop { display: block; }
    .wd-bottom-nav { display: none !important; }
    .wd-mobile-header { display: none !important; }
  }

  /* Mobile: hide sidebar, show bottom nav */
  @media (max-width: 767px) {
    .wd-sidebar { display: none !important; }
    .wd-main-desktop { margin-left: 0; }
    .wd-bottom-nav { display: block; }
    .wd-stats-grid { grid-template-columns: 1fr 1fr !important; }
  }

  /* Content max-width varies by breakpoint */
  .wd-content-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 32px 100px;
  }
  @media (max-width: 767px) {
    .wd-content-inner { padding: 20px 18px 90px; }
  }

  /* Desktop grid layouts */
  @media (min-width: 900px) {
    .wd-home-grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
    .wd-health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  }

  /* Community */
  .comm-grid { display: flex; flex-direction: column; gap: 20px; }
  @media (min-width: 900px) { .comm-grid { display: grid; grid-template-columns: 272px 1fr; gap: 24px; align-items: start; } }
  .comm-post-card { background: rgba(20,184,212,0.06); border-left: 3px solid ${C.cyan}; border-radius: 14px; padding: 16px; margin-bottom: 12px; transition: transform 0.2s; }
  .comm-post-card:hover { transform: translateY(-1px); }
  .comm-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 14px; color: #fff; font-family: 'Manrope', system-ui, sans-serif; font-size: 14px; outline: none; resize: vertical; box-sizing: border-box; }
  .comm-input:focus { border-color: rgba(20,184,212,0.5); }
  .comm-input::placeholder { color: rgba(255,255,255,0.3); }
  .comm-emoji-btn { background: rgba(255,255,255,0.05); border: 2px solid transparent; border-radius: 8px; padding: 6px 0; font-size: 18px; cursor: pointer; transition: all 0.15s; }
  .comm-emoji-btn.selected { background: rgba(20,184,212,0.15); border-color: ${C.cyan}; }
  .comm-color-btn { width: 26px; height: 26px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: border-color 0.15s; }
  .comm-color-btn.selected { border-color: #fff; }
`;

export const TABS = [
  { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { id: 'talks', label: 'Palestralar', icon: '🎧' },
  { id: 'health', label: 'Sağlık', icon: '❤️' },
  { id: 'community', label: 'Topluluk', icon: '👥' },
  { id: 'profile', label: 'Profil', icon: '👤' },
];
