import React, { useState, useEffect, useRef } from 'react';

const C = {
  navyDeep: '#061829',
  navyMid: '#04101C',
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  goldLight: '#E6B530',
  cream: '#F4E8C8',
};

const CSS = `
  .bf-landing * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  .bf-glass {
    background: linear-gradient(135deg, rgba(10,37,64,0.65) 0%, rgba(10,37,64,0.38) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .bf-glass:hover { border-color: rgba(201,150,26,0.38); transform: translateY(-3px); }
  .bf-nav-link { color: rgba(255,255,255,0.75); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
  .bf-nav-link:hover { color: #C9961A; }
  .bf-btn-primary {
    background: linear-gradient(135deg, #C9961A 0%, #E6B530 100%);
    color: #061829; border: none; cursor: pointer;
    font-family: 'Manrope', system-ui, sans-serif; font-weight: 700;
    transition: all 0.25s; display: inline-flex; align-items: center; justify-content: center;
  }
  .bf-btn-primary:hover {
    filter: brightness(1.1); transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(201,150,26,0.45);
  }
  .bf-btn-outline {
    background: transparent; border: 1px solid rgba(201,150,26,0.45); color: #C9961A;
    cursor: pointer; font-family: 'Manrope', system-ui, sans-serif; font-weight: 600;
    transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center;
  }
  .bf-btn-outline:hover { background: rgba(201,150,26,0.1); border-color: #C9961A; }
  .bf-faq-item { cursor: pointer; transition: border-color 0.2s; }
  .bf-faq-item:hover { border-color: rgba(201,150,26,0.35) !important; }
  .bf-pricing-toggle button { cursor: pointer; font-family: 'Manrope', system-ui, sans-serif; font-weight: 600; transition: all 0.2s; border: none; }
  .bf-stat { text-align: center; }
  @keyframes bf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .bf-marquee { animation: bf-marquee 36s linear infinite; display: flex; gap: 0; }
  @keyframes bf-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .bf-float { animation: bf-float 6s ease-in-out infinite; }
  @keyframes bf-glow-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 0.75; } }
  .bf-glow { animation: bf-glow-pulse 4s ease-in-out infinite; }
  @keyframes bf-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  .bf-fade-up { animation: bf-fade-up 0.7s ease forwards; }
  .bf-testimonial-card { transition: transform 0.3s, border-color 0.3s; }
  .bf-testimonial-card:hover { transform: translateY(-4px); border-color: rgba(201,150,26,0.3) !important; }
  .bf-social-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.65); cursor: pointer; transition: all 0.25s; text-decoration: none; }
  .bf-social-btn:hover { background: rgba(201,150,26,0.15); border-color: rgba(201,150,26,0.4); color: #C9961A; transform: translateY(-2px); }
  .bf-newsletter-input { flex: 1; padding: 14px 18px; border-radius: 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 15px; font-family: 'Manrope', system-ui, sans-serif; outline: none; transition: border-color 0.2s, background 0.2s; min-width: 0; }
  .bf-newsletter-input::placeholder { color: rgba(255,255,255,0.32); }
  .bf-newsletter-input:focus { border-color: #C9961A; background: rgba(201,150,26,0.06); }
  .bf-wa-float { position: fixed; bottom: 28px; right: 28px; z-index: 90; display: flex; align-items: center; gap: 10px; background: #25D366; border: none; border-radius: 100px; padding: 12px 20px 12px 14px; cursor: pointer; box-shadow: 0 8px 32px rgba(37,211,102,0.4); transition: all 0.25s; text-decoration: none; }
  .bf-wa-float:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 40px rgba(37,211,102,0.55); }
  @keyframes bf-wa-pulse { 0%,100% { box-shadow: 0 8px 32px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.4); } 70% { box-shadow: 0 8px 32px rgba(37,211,102,0.4), 0 0 0 12px rgba(37,211,102,0); } }
  .bf-wa-float { animation: bf-wa-pulse 2.5s ease-in-out infinite; }
  .bf-wa-float:hover { animation: none; }
  @media (max-width: 768px) {
    .bf-wa-float { bottom: 20px; right: 16px; padding: 12px 14px; border-radius: 50%; }
    .bf-wa-label { display: none !important; }
    .bf-hero-grid { grid-template-columns: 1fr !important; }
    .bf-features-grid { grid-template-columns: 1fr !important; }
    .bf-pricing-grid { grid-template-columns: 1fr !important; }
    .bf-testimonials-grid { grid-template-columns: 1fr !important; }
    .bf-hero-title { font-size: 56px !important; }
    .bf-nav-links { display: none !important; }
  }
`;

const Logo = ({ size = 36 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 178.9 263.7"
    width={size}
    height={size}
    style={{ display: 'block', flexShrink: 0 }}
    aria-label="BreakFree"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#0072B0"
      d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7C101.6,100.5,120,101.5,136.7,112.6L136.7,112.6z M62.8,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43c-4.2-3.2-8.5-6.6-12.7-10.3C65.7,169.4,64.2,168,62.8,166.6L62.8,166.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#0072B0"
      d="M89.2,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1C77.1,59,82.5,53.6,89.2,53.6L89.2,53.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9L110.1,108.9z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M39.8,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C40.3,88,40,84.8,39.8,81.6L39.8,81.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M144.1,232.2c-22.7-9.1-92-5.5-113.7,6C63.5,216.7,109.1,214.3,144.1,232.2L144.1,232.2z"
    />
  </svg>
);

const marqueeItems = [
  'Uyku Optimizasyonu',
  'Stres Yönetimi',
  'Kalp Sağlığı',
  'Beslenme',
  'Meditasyon',
  'Mindfulness',
  'Yoga',
  'Mental Sağlık',
  'Nefes Egzersizleri',
  'Holistic Wellness',
];

const features = [
  {
    icon: '🎧',
    title: 'Canlı Konuşmalar',
    desc: 'Sağlık uzmanları ve doktorlarla haftalık canlı oturumlar. Sorularını gerçek zamanlı sor.',
    color: C.royal,
  },
  {
    icon: '🧑‍⚕️',
    title: '1-on-1 Mentörlük',
    desc: 'Sertifikalı wellness koçlarından birebir rehberlik. Kişisel yol haritanı birlikte oluşturun.',
    color: C.cyan,
  },
  {
    icon: '🤖',
    title: 'AI Wellness Koçu',
    desc: '24/7 kişiselleştirilmiş tavsiyeler. Yapay zeka koçun her an yanında.',
    color: C.gold,
  },
  {
    icon: '📊',
    title: 'Sağlık Analitiği',
    desc: 'Uyku, stres ve beslenme verilerini tek panelde görüntüle. Gelişimini takip et.',
    color: '#8B5CF6',
  },
  {
    icon: '🌿',
    title: 'Topluluk Desteği',
    desc: 'Binlerce üyeyle deneyimlerini paylaş. Birlikte daha güçlüyüz.',
    color: '#10B981',
  },
  {
    icon: '🧘',
    title: 'Rehberli Pratikler',
    desc: 'Meditasyon, nefes ve mindfulness egzersizleri. Her seviyeye uygun programlar.',
    color: '#F59E0B',
  },
];

const testimonials = [
  {
    quote:
      'BreakFree hayatımı gerçekten değiştirdi. 3 ayda uykum tamamen düzeldi ve stresimi çok daha iyi yönetebiliyorum.',
    name: 'Ayşe K.',
    role: 'Öğretmen, İstanbul',
    stars: 5,
  },
  {
    quote:
      'AI koçu inanılmaz akıllı ve gerçekten kişiselleştirilmiş öneriler sunuyor. Her sabah onunla başlıyorum.',
    name: 'Mehmet T.',
    role: 'Yazılım Geliştirici, Ankara',
    stars: 5,
  },
  {
    quote:
      'Topluluk harika ve çok motive edici. Canlı oturumlarda uzmanlarla doğrudan konuşabilmek paha biçilemez.',
    name: 'Zeynep A.',
    role: 'Serbest Danışman, İzmir',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'Ücretsiz plan var mı?',
    a: 'Evet, temel özellikler tamamen ücretsizdir. AI koçumuzla sınırlı konuşmalar ve topluluk erişimi ücretsiz sunulmaktadır.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Kesinlikle. Tüm verileriniz uçtan uca şifreleme ile korunmaktadır. Kişisel sağlık bilgilerinizi asla üçüncü taraflarla paylaşmıyoruz.',
  },
  {
    q: 'Uzmanlar kimlerdir?',
    a: 'Tüm uzmanlarımız alanlarında sertifikalı profesyonellerdir. Doktorlar, diyetisyenler, psikologlar ve sertifikalı wellness koçları.',
  },
  {
    q: 'Aboneliği iptal edebilir miyim?',
    a: 'Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz. Kalan süreniz boyunca tüm özelliklerden yararlanmaya devam edersiniz.',
  },
];

const Stars = ({ count }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{ color: C.gold, fontSize: 14 }}>
        ★
      </span>
    ))}
  </div>
);

const InstagramSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppSVG = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function BreakFreeLanding({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [nlEmail, setNlEmail] = useState('');
  const [nlStatus, setNlStatus] = useState('idle'); // idle | loading | success | error
  const nlRef = useRef(null);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!nlEmail || !/\S+@\S+\.\S+/.test(nlEmail)) {
      nlRef.current && (nlRef.current.style.borderColor = 'rgba(239,68,68,0.5)');
      return;
    }
    setNlStatus('loading');
    try {
      const res = await fetch('https://formsubmit.co/ajax/destek@breakfreeturkiye.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: nlEmail,
          _subject: 'BreakFree Newsletter Aboneliği',
          message: `${nlEmail} adresi newsletter'a abone olmak istiyor.`,
        }),
      });
      const data = await res.json();
      setNlStatus(data.success ? 'success' : 'error');
    } catch {
      setNlStatus('error');
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="bf-landing"
      style={{
        minHeight: '100vh',
        background: C.navyDeep,
        color: '#fff',
        fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
        overflowX: 'hidden',
      }}
    >
      <style>{CSS}</style>

      {/* ── NAVIGATION ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 72,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
          background: scrolled ? 'rgba(6,24,41,0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(201,150,26,0.15)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={34} />
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Break<em style={{ color: C.gold, fontStyle: 'italic' }}>Free</em>
            </span>
          </div>
          <div className="bf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" className="bf-nav-link">
              Özellikler
            </a>
            <a href="#pricing" className="bf-nav-link">
              Fiyatlandırma
            </a>
            <button
              onClick={onStart}
              className="bf-btn-primary"
              style={{
                padding: '10px 26px',
                borderRadius: 100,
                fontSize: 14,
                letterSpacing: '0.01em',
              }}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 72,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div
          className="bf-glow"
          style={{
            position: 'absolute',
            top: -100,
            left: -80,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,114,176,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="bf-glow"
          style={{
            position: 'absolute',
            bottom: 0,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,150,26,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            animationDelay: '2s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,212,0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div
          style={{
            maxWidth: 1240,
            width: '100%',
            margin: '0 auto',
            padding: '80px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="bf-hero-grid"
        >
          {/* Left: copy */}
          <div className="bf-fade-up" style={{ animationDelay: '0.1s' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(201,150,26,0.1)',
                border: '1px solid rgba(201,150,26,0.3)',
                borderRadius: 100,
                padding: '6px 16px',
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: C.gold,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.goldLight,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Türkiye&apos;nin #1 Wellness Platformu
              </span>
            </div>

            <h1
              className="bf-hero-title"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 80,
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: '0 0 24px',
              }}
            >
              Sağlığının
              <br />
              <em style={{ color: C.gold, fontStyle: 'italic' }}>Sahibi Ol.</em>
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.68)',
                maxWidth: 480,
                margin: '0 0 40px',
              }}
            >
              Uyku, stres, beslenme ve mental sağlık için yapay zeka koçu, canlı mentor ve gerçek
              topluluk desteği — tek bir platformda.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={onStart}
                className="bf-btn-primary"
                style={{
                  padding: '16px 36px',
                  borderRadius: 100,
                  fontSize: 17,
                  letterSpacing: '0.01em',
                }}
              >
                Hemen Başla →
              </button>
              <button
                onClick={onStart}
                className="bf-btn-outline"
                style={{ padding: '16px 28px', borderRadius: 100, fontSize: 15 }}
              >
                Nasıl çalışır?
              </button>
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {[
                ['12K+', 'Aktif Üye'],
                ['98%', 'Memnuniyet'],
                ['150+', 'Uzman'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 28,
                      fontWeight: 400,
                      color: C.gold,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: 2,
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: app preview card */}
          <div className="bf-float bf-fade-up" style={{ animationDelay: '0.3s' }}>
            <div
              className="bf-glass"
              style={{
                padding: 28,
                maxWidth: 380,
                margin: '0 auto',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 24,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                    Bugünkü Wellness Skoru
                  </div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 42,
                      fontWeight: 400,
                      color: C.gold,
                    }}
                  >
                    87
                  </div>
                </div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: `conic-gradient(${C.gold} 0% 87%, rgba(255,255,255,0.08) 87% 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: C.navyDeep,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    ✨
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  ['😴', 'Uyku', '7.5s', C.royal],
                  ['💚', 'Stres', 'Düşük', '#10B981'],
                  ['🧠', 'Odak', '%91', C.cyan],
                ].map(([icon, label, val, color]) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 12,
                      padding: '10px 8px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                    <div
                      style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}
                  >
                    🤖
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.gold,
                        letterSpacing: '0.04em',
                      }}
                    >
                      AI KOÇUN
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                      Bu gece 22:30&apos;da uyumayı dene.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {['🎧 Canlı Oturum', '🧘 Meditasyon'].map((label) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        style={{
          overflow: 'hidden',
          background: 'rgba(10,37,64,0.4)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '18px 0',
        }}
      >
        <div className="bf-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 28px',
                whiteSpace: 'nowrap',
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.03em',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: C.gold,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(20,184,212,0.1)',
                border: '1px solid rgba(20,184,212,0.25)',
                borderRadius: 100,
                padding: '5px 16px',
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.cyan,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Özellikler
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 52,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '0 0 16px',
              }}
            >
              Her şey tek bir yerde.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.55)',
                maxWidth: 540,
                margin: '0 auto',
              }}
            >
              Wellness yolculuğun için ihtiyacın olan tüm araçlar, uzmanlar ve topluluk —
              BreakFree&apos;de.
            </p>
          </div>

          <div
            className="bf-features-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {features.map((f, i) => (
              <div key={i} className="bf-glass" style={{ padding: '32px 28px' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    marginBottom: 20,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    margin: '0 0 10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 24px', background: 'rgba(4,16,28,0.6)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 48,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '0 0 14px',
              }}
            >
              Kullanıcı Yorumları
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              12.000+ üyemiz bize güveniyor.
            </p>
          </div>

          <div
            className="bf-testimonials-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bf-glass bf-testimonial-card"
                style={{ padding: '32px 28px' }}
              >
                <Stars count={t.stars} />
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.8)',
                    margin: '16px 0 24px',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.gold }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 52,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '0 0 14px',
              }}
            >
              Sağlığına yatırım yap.
            </h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(201,150,26,0.1)',
                border: '1px solid rgba(201,150,26,0.3)',
                borderRadius: 100,
                padding: '8px 20px',
              }}
            >
              <span style={{ fontSize: 14 }}>🚀</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.goldLight,
                  letterSpacing: '0.02em',
                }}
              >
                Fiyatlandırma çok yakında açıklanacak
              </span>
            </div>
          </div>

          <div
            className="bf-pricing-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
          >
            {/* Pro */}
            <div
              className="bf-glass"
              style={{
                padding: '40px 36px',
                border: '1px solid rgba(201,150,26,0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  color: C.navyDeep,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 100,
                  letterSpacing: '0.06em',
                }}
              >
                EN POPÜLER
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201,150,26,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  margin: '0 0 16px',
                }}
              >
                Pro
              </h3>
              <div
                style={{
                  marginBottom: 28,
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 22 }}>⏳</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 3 }}>
                    Yakında
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    Fiyat bildirimini almak için abone ol
                  </div>
                </div>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  margin: '0 0 32px',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {[
                  'AI Wellness Koçu (24/7)',
                  'Sınırsız Canlı Talks',
                  '1-on-1 Mentörlük oturumları',
                  'Detaylı sağlık analitiği',
                  'Tüm rehberli pratikler',
                  'Topluluk erişimi',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: C.gold, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className="bf-btn-primary"
                style={{ width: '100%', padding: '15px', borderRadius: 14, fontSize: 15 }}
              >
                Erken Erişime Kaydol
              </button>
            </div>

            {/* Enterprise */}
            <div className="bf-glass" style={{ padding: '40px 36px' }}>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 26,
                  fontWeight: 400,
                  margin: '0 0 16px',
                }}
              >
                Kurumsal
              </h3>
              <div
                style={{
                  marginBottom: 28,
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 22 }}>💬</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan, marginBottom: 3 }}>
                    Özel Fiyatlandırma
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    Ekibiniz için teklif alın
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                Takımlar ve şirketler için özel wellness programları. Çalışan refahını artıran
                çözümler.
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin: '0 0 32px',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {[
                  "Pro'un tüm özellikleri",
                  'Ekip yönetim paneli',
                  'Özel içerik ve programlar',
                  'Öncelikli destek',
                  'SLA garantisi',
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: C.cyan, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/905418617772"
                target="_blank"
                rel="noopener noreferrer"
                className="bf-btn-outline"
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: 14,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textDecoration: 'none',
                }}
              >
                <WhatsAppSVG size={16} /> İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 24px', background: 'rgba(4,16,28,0.5)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 48,
              fontWeight: 400,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              margin: '0 0 48px',
            }}
          >
            Sıkça Sorulan Sorular
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bf-glass bf-faq-item"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ padding: '20px 24px' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{f.q}</span>
                  <span
                    style={{
                      color: C.gold,
                      fontSize: 18,
                      fontWeight: 300,
                      flexShrink: 0,
                      marginLeft: 16,
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    +
                  </span>
                </div>
                {openFaq === i && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.6)',
                      margin: '14px 0 0',
                    }}
                  >
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div
            className="bf-glass"
            style={{
              padding: '72px 48px',
              textAlign: 'center',
              borderColor: 'rgba(201,150,26,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, rgba(201,150,26,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 52,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '0 0 16px',
                position: 'relative',
              }}
            >
              Wellness yolculuğuna
              <br />
              <em style={{ color: C.gold }}>bugün başla.</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: 'rgba(255,255,255,0.55)',
                margin: '0 0 40px',
                position: 'relative',
              }}
            >
              12.000+ kişi sağlığının sahibi olmak için zaten burada.
            </p>
            <button
              onClick={onStart}
              className="bf-btn-primary"
              style={{
                padding: '18px 48px',
                borderRadius: 100,
                fontSize: 17,
                position: 'relative',
              }}
            >
              Ücretsiz Başla →
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER + SOCIAL ── */}
      <section
        style={{
          padding: '80px 24px',
          background: 'rgba(4,16,28,0.7)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="bf-hero-grid"
        >
          {/* Newsletter */}
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(201,150,26,0.1)',
                border: '1px solid rgba(201,150,26,0.25)',
                borderRadius: 100,
                padding: '5px 16px',
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.goldLight,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Newsletter
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 36,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '0 0 12px',
              }}
            >
              Gelişmelerden
              <br />
              <em style={{ color: C.gold }}>haberdar ol.</em>
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.5)',
                margin: '0 0 28px',
                lineHeight: 1.65,
              }}
            >
              Wellness ipuçları, uzman içerikleri ve BreakFree haberleri doğrudan posta kutuna
              gelsin.
            </p>

            {nlStatus === 'success' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: 14,
                  padding: '16px 20px',
                }}
              >
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#10B981' }}>
                    Abone oldun!
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    En kısa sürede haberler gelecek.
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                noValidate
                style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
              >
                <input
                  ref={nlRef}
                  type="email"
                  value={nlEmail}
                  onChange={(e) => {
                    setNlEmail(e.target.value);
                    if (nlRef.current) nlRef.current.style.borderColor = '';
                  }}
                  placeholder="E-posta adresin"
                  className="bf-newsletter-input"
                  disabled={nlStatus === 'loading'}
                />
                <button
                  type="submit"
                  disabled={nlStatus === 'loading'}
                  className="bf-btn-primary"
                  style={{
                    padding: '14px 28px',
                    borderRadius: 14,
                    fontSize: 14,
                    opacity: nlStatus === 'loading' ? 0.7 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {nlStatus === 'loading' ? 'Gönderiliyor…' : 'Abone Ol'}
                </button>
                {nlStatus === 'error' && (
                  <p
                    style={{ width: '100%', margin: '4px 0 0 2px', fontSize: 12, color: '#f87171' }}
                  >
                    Bir hata oluştu, lütfen tekrar deneyin.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: '0 0 16px',
                }}
              >
                Bizi takip et
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <a
                  href="https://instagram.com/breakfreeturkiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bf-social-btn"
                  aria-label="Instagram"
                >
                  <InstagramSVG />
                </a>
                <a
                  href="https://facebook.com/breakfreeturkiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bf-social-btn"
                  aria-label="Facebook"
                >
                  <FacebookSVG />
                </a>
                <a
                  href="https://wa.me/905418617772"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bf-social-btn"
                  aria-label="WhatsApp"
                  style={{
                    background: 'rgba(37,211,102,0.1)',
                    borderColor: 'rgba(37,211,102,0.25)',
                    color: '#25D366',
                  }}
                >
                  <WhatsAppSVG size={18} />
                </a>
              </div>
            </div>

            <div
              className="bf-glass"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderColor: 'rgba(37,211,102,0.2)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WhatsAppSVG size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                  WhatsApp&apos;tan Ulaş
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  Sorularını bize yaz, hemen yanıt verelim.
                </div>
              </div>
              <a
                href="https://wa.me/905418617772"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '8px 16px',
                  borderRadius: 100,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Yazın →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo size={22} />
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 400 }}>
              Break<em style={{ color: C.gold, fontStyle: 'italic' }}>Free</em>
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.28)',
              margin: 0,
              textAlign: 'center',
              flex: 1,
            }}
          >
            © 2026 BreakFree Türkiye. Tüm hakları saklıdır.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href="https://instagram.com/breakfreeturkiye"
              target="_blank"
              rel="noopener noreferrer"
              className="bf-social-btn"
              aria-label="Instagram"
              style={{ width: 34, height: 34 }}
            >
              <InstagramSVG />
            </a>
            <a
              href="https://facebook.com/breakfreeturkiye"
              target="_blank"
              rel="noopener noreferrer"
              className="bf-social-btn"
              aria-label="Facebook"
              style={{ width: 34, height: 34 }}
            >
              <FacebookSVG />
            </a>
            <a
              href="https://wa.me/905418617772"
              target="_blank"
              rel="noopener noreferrer"
              className="bf-social-btn"
              aria-label="WhatsApp"
              style={{
                width: 34,
                height: 34,
                color: '#25D366',
                borderColor: 'rgba(37,211,102,0.3)',
                background: 'rgba(37,211,102,0.08)',
              }}
            >
              <WhatsAppSVG size={16} />
            </a>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href="https://wa.me/905418617772"
        target="_blank"
        rel="noopener noreferrer"
        className="bf-wa-float"
        aria-label="WhatsApp ile ulaş"
      >
        <WhatsAppSVG size={22} />
        <span
          className="bf-wa-label"
          style={{
            color: '#fff',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.01em',
          }}
        >
          WhatsApp ile ulaş
        </span>
      </a>
    </div>
  );
}
