import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Mountain,
  Dumbbell,
  Heart,
  Users,
  Compass,
  Sparkles,
  MessageCircle,
  Calendar,
  Instagram,
  Mail,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Play,
  Menu,
  X,
  ChevronRight,
  Youtube,
  Phone,
  Globe,
  Clock,
  Star,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// BreakFree Türkiye — Premium Wellness Community Landing
// Palette: Deep navy #0A2540, royal #0072B0, cyan #14B8D4,
//          gold #C9961A, amber #C9961A, cream #F4E8C8
// Type: Display = "Fraunces" (serif editorial) · Body = "Manrope"
// ─────────────────────────────────────────────────────────────────

const COLORS = {
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0072B0',
  cyan: '#14B8D4',
  skyLight: '#BFE0EC',
  cream: '#F4E8C8',
  gold: '#C9961A',
  amber: '#C9961A',
};

// Tek bir reusable scroll-reveal wrapper
const Reveal = ({ children, delay = 0, y = 30 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Animated counter
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1800;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n.toLocaleString('tr-TR')}
      {suffix}
    </span>
  );
};

// Magnetic button
const MagneticButton = ({ children, className = '', primary = false, onClick }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    setPos({ x: x * 0.25, y: y * 0.25 });
  };
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
      className={`group relative inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-colors ${
        primary
          ? 'bg-[#C9961A] text-[#0A2540] hover:bg-[#F4E8C8]'
          : 'border border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default function BreakFreeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0A2540] text-white antialiased"
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
      }}
    >
      {/* Fontes & globais */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; font-variation-settings: "SOFT" 50, "WONK" 0; }
        .noise::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        ::selection { background: #C9961A; color: #0A2540; }
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ───────────── NAVBAR ───────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'border-b border-white/10 bg-[#0A2540]/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill="#0072B0"/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#C9961A"/>
            </svg>
            <span className="font-display text-xl font-medium tracking-tight">
              BreakFree<span className="text-[#C9961A]">.</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {[
              ['Hakkımızda', '#about'],
              ['Aktiviteler', '#activities'],
              ['Etkinlikler', '#events'],
              ['Galeri', '#gallery'],
              ['İletişim', '#contact'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C9961A] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md md:flex">
              <Globe className="h-3 w-3" />
              <span>TR</span>
            </div>
            <a
              href="#join"
              className="hidden items-center gap-2 rounded-full bg-[#C9961A] px-5 py-2.5 text-sm font-semibold text-[#0A2540] transition-all hover:bg-[#F4E8C8] hover:gap-3 md:flex"
            >
              Katıl
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-white"
              aria-label="Menü"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#061829]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-xl">
                BreakFree<span className="text-[#C9961A]">.</span>
              </span>
              <button onClick={() => setMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col gap-2 px-6 py-12">
              {[
                ['Hakkımızda', '#about'],
                ['Aktiviteler', '#activities'],
                ['Etkinlikler', '#events'],
                ['Galeri', '#gallery'],
                ['İletişim', '#contact'],
              ].map(([label, href], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="font-display text-4xl font-light leading-tight border-b border-white/10 py-4"
                >
                  {label}
                </motion.a>
              ))}
              <motion.a
                href="#join"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#C9961A] py-4 font-semibold text-[#0A2540]"
              >
                Topluluğa Katıl <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────── HERO ───────────── */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Animated gradient bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#061829] via-[#0A2540] to-[#0072B0]/30" />
          {/* Aurora blobs */}
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#14B8D4] opacity-20 blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -120, 80, 0],
              y: [0, 100, -40, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full bg-[#C9961A] opacity-15 blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/3 h-[400px] w-[400px] rounded-full bg-[#0072B0] opacity-25 blur-[100px]"
          />
        </motion.div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 pb-20 lg:px-12"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="h-px w-12 bg-[#C9961A]" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
              İstanbul · Türkiye
            </span>
          </motion.div>

          {/* Headline */}
          <div className="max-w-5xl">
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.95] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="block"
              >
                Özgür ol.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="block italic text-[#C9961A]"
              >
                Daha iyi yaşa.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-10 max-w-xl text-lg font-light leading-relaxed text-white/70 md:text-xl"
            >
              Türkiye'de daha sağlıklı bir beden, güçlü bir zihin ve anlamlı bir topluluk inşa
              ediyoruz. Hareket, dostluk, amaç.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <MagneticButton primary>
                Etkinliklere Katıl <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton>
                Aktiviteleri Keşfet <ChevronRight className="h-4 w-4" />
              </MagneticButton>
              <a
                href="#"
                className="group ml-2 flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all group-hover:border-[#C9961A] group-hover:bg-[#C9961A] group-hover:text-[#0A2540]">
                  <Play className="h-3 w-3 fill-current" />
                </div>
                <span>WhatsApp grubu</span>
              </a>
            </motion.div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {[
              { n: 850, s: '+', label: 'Aktif üye' },
              { n: 120, s: '+', label: 'Etkinlik' },
              { n: 24, s: '', label: 'Şehir bölgesi' },
              { n: 98, s: '%', label: 'Memnuniyet' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-[#C9961A]/40 hover:bg-white/[0.06]"
              >
                <div className="font-display text-3xl font-light text-white md:text-4xl">
                  <Counter to={s.n} suffix={s.s} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{s.label}</div>
                <div className="absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-[#C9961A]/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em]">Kaydır</span>
            <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[#061829] py-8">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-12 px-6 font-display text-4xl font-light text-white/40 md:text-6xl"
            >
              <span>Hareket</span>
              <span className="text-[#C9961A]">✦</span>
              <span className="italic">Sağlık</span>
              <span className="text-[#C9961A]">✦</span>
              <span>Topluluk</span>
              <span className="text-[#C9961A]">✦</span>
              <span className="italic">Özgürlük</span>
              <span className="text-[#C9961A]">✦</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── ABOUT ───────────── */}
      <section id="about" className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Sticky title */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-px w-12 bg-[#C9961A]" />
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
                      Hakkımızda
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                    Sadece bir spor grubu <span className="italic text-[#C9961A]">değiliz.</span>
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-white/60">
                    BreakFree, hareket, dostluk ve bilinçli yaşam etrafında inşa edilen bütünsel bir
                    wellness topluluğudur. Beden, zihin ve sosyal yaşamı birlikte güçlendiriyoruz.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <a
                    href="#activities"
                    className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#C9961A] hover:gap-3 transition-all"
                  >
                    Aktiviteleri gör
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Reveal>
              </div>
            </div>

            {/* Pillar cards */}
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-6">
                {[
                  {
                    icon: Heart,
                    title: 'Bütünsel sağlık',
                    desc: 'Fiziksel form, zihinsel netlik ve duygusal denge — hepsi tek bir yolculukta.',
                  },
                  {
                    icon: Users,
                    title: 'Gerçek topluluk',
                    desc: 'Algoritma değil, insan. Birlikte hareket eden, birlikte büyüyen bir aile.',
                  },
                  {
                    icon: Compass,
                    title: 'Anlamlı maceralar',
                    desc: 'Doğa yürüyüşleri, atölyeler, sosyal buluşmalar — hayatı geniş yaşamak.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Özgürlük zihniyeti',
                    desc: 'Eski alışkanlıklardan kop, daha güçlü bir versiyonuna doğru özgürce ilerle.',
                  },
                ].map((p, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ x: 8 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 transition-colors hover:border-[#C9961A]/30 md:p-10"
                    >
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-2xl bg-[#C9961A] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
                          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9961A]/30 bg-[#C9961A]/10 text-[#C9961A] transition-all group-hover:bg-[#C9961A] group-hover:text-[#0A2540]">
                            <p.icon className="h-6 w-6" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-2xl font-medium md:text-3xl">
                            {p.title}
                          </h3>
                          <p className="mt-3 text-white/60 leading-relaxed">{p.desc}</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:text-[#C9961A] group-hover:rotate-12" />
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── ACTIVITIES ───────────── */}
      <section id="activities" className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Reveal>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px w-12 bg-[#C9961A]" />
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
                    Aktiviteler
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
                  Hareket eden bir <span className="italic text-[#C9961A]">hayat.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-sm text-white/60">
                Sekiz farklı deneyim, tek bir topluluk. Sana uyanı seç — ya da hepsini dene.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Mountain, title: 'Doğa Yürüyüşü', tag: 'Açık hava', accent: true },
              { icon: Dumbbell, title: 'Fitness', tag: 'Antrenman' },
              { icon: Heart, title: 'Wellness Atölyeleri', tag: 'Zihin & beden' },
              { icon: Users, title: 'Sosyal Etkinlikler', tag: 'Topluluk' },
              { icon: Compass, title: 'Açık Hava Maceraları', tag: 'Keşif', accent: true },
              { icon: Sparkles, title: 'Sağlık Fuarı', tag: 'Yıllık' },
              { icon: MessageCircle, title: 'Dil & Buluşma', tag: 'Sosyal' },
              { icon: Star, title: 'Genç Buluşmaları', tag: 'Yeni nesil' },
            ].map((a, i) => (
              <Reveal key={i} delay={(i % 4) * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-3xl border ${
                    a.accent
                      ? 'border-[#C9961A]/30 bg-gradient-to-br from-[#C9961A]/10 to-transparent'
                      : 'border-white/10 bg-white/[0.03]'
                  } p-6 transition-colors hover:border-[#C9961A]/50`}
                >
                  {/* Decorative blob */}
                  <div
                    className={`absolute -right-12 -top-12 h-40 w-40 rounded-full ${a.accent ? 'bg-[#C9961A]' : 'bg-[#14B8D4]'} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-30`}
                  />

                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          a.accent ? 'bg-[#C9961A] text-[#0A2540]' : 'bg-white/10 text-white'
                        }`}
                      >
                        <a.icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {a.tag}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-medium leading-tight">{a.title}</h3>
                      <div className="mt-4 flex items-center gap-2 text-xs text-white/40 transition-all group-hover:gap-3 group-hover:text-[#C9961A]">
                        <span>Detay</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── EVENTS ───────────── */}
      <section id="events" className="relative py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0072B0]/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal>
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px w-12 bg-[#C9961A]" />
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
                    Yaklaşan Etkinlikler
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
                  Bir sonraki <span className="italic text-[#C9961A]">an.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <a
                href="#"
                className="group flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm transition-colors hover:border-[#C9961A] hover:text-[#C9961A]"
              >
                Tüm takvimi gör
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </a>
            </Reveal>
          </div>

          {/* Featured event with countdown */}
          <Reveal>
            <div className="mb-8 grid gap-6 overflow-hidden rounded-3xl border border-[#C9961A]/20 bg-gradient-to-br from-[#C9961A]/[0.08] via-transparent to-[#14B8D4]/[0.05] p-8 md:p-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#C9961A]/20 px-3 py-1 text-xs font-medium text-[#C9961A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9961A] animate-pulse" />
                  Öne çıkan
                </span>
                <h3 className="mt-6 font-display text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
                  Belgrad Ormanı <br />
                  <span className="italic text-[#C9961A]">Şafak Yürüyüşü</span>
                </h3>
                <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#C9961A]" />
                    <span>15 Haziran 2026 · Pazar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#C9961A]" />
                    <span>06:00 — 10:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#C9961A]" />
                    <span>Sarıyer, İstanbul</span>
                  </div>
                </div>
                <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9961A] px-6 py-3 text-sm font-semibold text-[#0A2540] transition-all hover:gap-3 hover:bg-[#F4E8C8]">
                  Yerini ayır <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Countdown */}
              <div className="lg:col-span-5">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">Geri sayım</div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { v: 29, l: 'Gün' },
                    { v: 14, l: 'Saat' },
                    { v: 22, l: 'Dk' },
                    { v: 47, l: 'Sn' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-[#061829]/60 p-4 backdrop-blur-md"
                    >
                      <div className="font-display text-3xl font-light text-[#C9961A] md:text-4xl">
                        {String(c.v).padStart(2, '0')}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
                        {c.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Event list */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                date: '22 HAZ',
                day: 'Çar',
                title: 'Wellness atölyesi: Nefes & odak',
                loc: 'Kadıköy',
                spots: '8 yer kaldı',
              },
              {
                date: '28 HAZ',
                day: 'Cmt',
                title: 'Sahil koşusu — Moda',
                loc: 'Moda Sahili',
                spots: '24 yer kaldı',
              },
              {
                date: '05 TEM',
                day: 'Cmt',
                title: 'Genç buluşması & barbekü',
                loc: 'Belgrad Ormanı',
                spots: 'Açık',
              },
            ].map((e, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.a
                  href="#"
                  whileHover={{ y: -4 }}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-3xl font-medium text-[#C9961A]">
                        {e.date}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-white/40">{e.day}</div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:text-[#C9961A] group-hover:rotate-12" />
                  </div>
                  <h4 className="mt-6 font-display text-xl font-medium leading-snug">{e.title}</h4>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {e.loc}
                    </span>
                    <span className="text-[#14B8D4]">{e.spots}</span>
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── GALLERY ───────────── */}
      <section id="gallery" className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16">
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#C9961A]" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
                  Galeri
                </span>
              </div>
            </Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <Reveal delay={0.1}>
                <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
                  Topluluğun <span className="italic text-[#C9961A]">anları.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-sm text-white/60 hover:text-[#C9961A]"
                >
                  <Instagram className="h-4 w-4" />
                  @breakfreeturkiye
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-12" />
                </a>
              </Reveal>
            </div>
          </div>

          {/* Masonry-ish grid using image placeholders with gradients (real photos can replace these) */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { tall: true, gradient: 'from-[#0072B0] to-[#14B8D4]', emoji: '🏔️', label: 'Hiking' },
              { gradient: 'from-[#C9961A] to-[#C9961A]', emoji: '🧘', label: 'Wellness' },
              { gradient: 'from-[#14B8D4] to-[#0A2540]', emoji: '🏃', label: 'Koşu' },
              { tall: true, gradient: 'from-[#C9961A] to-[#0A2540]', emoji: '🌅', label: 'Şafak' },
              { gradient: 'from-[#0A2540] to-[#0072B0]', emoji: '💪', label: 'Fitness' },
              {
                tall: true,
                gradient: 'from-[#C9961A] to-[#14B8D4]',
                emoji: '🤝',
                label: 'Topluluk',
              },
              { gradient: 'from-[#0072B0] to-[#C9961A]', emoji: '🌿', label: 'Doğa' },
              { gradient: 'from-[#14B8D4] to-[#C9961A]', emoji: '✨', label: 'Atölye' },
            ].map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.gradient} ${
                    g.tall ? 'row-span-2 aspect-[3/5]' : 'aspect-square'
                  } cursor-pointer`}
                >
                  {/* Noise overlay */}
                  <div className="absolute inset-0 noise opacity-40" />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-transform group-hover:scale-110">
                    <div className="text-6xl opacity-80 md:text-7xl">{g.emoji}</div>
                  </div>
                  {/* Label on hover */}
                  <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs uppercase tracking-widest text-white/70">
                      {g.label}
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-sm font-medium">
                      Detay <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── TESTIMONIALS ───────────── */}
      <section className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[#C9961A]" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9961A]">
                Topluluktan
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-16 max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
              Sayılar değil, <span className="italic text-[#C9961A]">hikayeler.</span>
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "İstanbul'a yeni taşınmıştım ve kendimi yalnız hissediyordum. BreakFree benim ailem oldu.",
                name: 'Elif K.',
                role: 'Üye · 1 yıl',
                accent: false,
              },
              {
                quote:
                  'Sadece spor değil — hayata bakışım değişti. Daha sağlıklı, daha mutlu, daha bağlıyım.',
                name: 'Mehmet A.',
                role: 'Üye · 8 ay',
                accent: true,
              },
              {
                quote:
                  'Her hafta yeni bir macera. Doğa yürüyüşleri hayatımın en güzel anları oldu.',
                name: 'Zeynep T.',
                role: 'Üye · 2 yıl',
                accent: false,
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`group relative h-full overflow-hidden rounded-3xl p-8 transition-all md:p-10 ${
                    t.accent
                      ? 'bg-gradient-to-br from-[#C9961A] to-[#C9961A] text-[#0A2540]'
                      : 'border border-white/10 bg-white/[0.03] backdrop-blur-md'
                  }`}
                >
                  <div
                    className={`text-6xl font-display leading-none ${t.accent ? 'text-[#0A2540]/30' : 'text-[#C9961A]/40'}`}
                  >
                    "
                  </div>
                  <p
                    className={`mt-2 font-display text-xl font-light leading-snug md:text-2xl ${t.accent ? 'text-[#0A2540]' : 'text-white'}`}
                  >
                    {t.quote}
                  </p>
                  <div
                    className={`mt-8 flex items-center gap-4 border-t pt-6 ${t.accent ? 'border-[#0A2540]/20' : 'border-white/10'}`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                        t.accent ? 'bg-[#0A2540] text-[#C9961A]' : 'bg-[#C9961A] text-[#0A2540]'
                      }`}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold ${t.accent ? 'text-[#0A2540]' : 'text-white'}`}
                      >
                        {t.name}
                      </div>
                      <div
                        className={`text-xs ${t.accent ? 'text-[#0A2540]/70' : 'text-white/50'}`}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section id="join" className="relative overflow-hidden py-32 lg:py-48">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#061829] via-[#0A2540] to-[#0072B0]/50" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-1/4 top-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#C9961A]/20 to-transparent blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#14B8D4]/15 to-transparent blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-12">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C9961A]/30 bg-[#C9961A]/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#C9961A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9961A] animate-pulse" />
              Topluluğa katılım açık
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-tight">
              Yolculuğun <br />
              <span className="italic text-[#C9961A]">burada başlar.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-xl text-lg font-light text-white/60 md:text-xl">
              Sağlık, amaç, dostluk ve büyüme. Hepsi tek bir toplulukta.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton primary>
                BreakFree'ye katıl <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton>
                <Instagram className="h-4 w-4" />
                Instagram
              </MagneticButton>
              <MagneticButton>
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer id="contact" className="relative border-t border-white/10 bg-[#061829] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8" viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
                  <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill="#0072B0"/>
                  <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#C9961A"/>
                </svg>
                <span className="font-display text-xl font-medium">
                  BreakFree<span className="text-[#C9961A]">.</span>
                </span>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
                Türkiye'de bütünsel sağlık, hareket ve gerçek topluluk inşa ediyoruz. Daha güçlü
                beden, berrak zihin, anlamlı bağlantı.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-[#C9961A]" />
                İstanbul, Türkiye
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="text-xs uppercase tracking-[0.2em] text-[#C9961A]">Keşfet</div>
              <ul className="mt-4 space-y-3 text-sm">
                {['Hakkımızda', 'Aktiviteler', 'Etkinlikler', 'Galeri', 'Topluluk'].map((x) => (
                  <li key={x}>
                    <a href="#" className="text-white/60 transition-colors hover:text-[#C9961A]">
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#C9961A]">İletişim</div>
              <a
                href="mailto:hi@breakfreetr.com"
                className="mt-4 block text-2xl font-display font-light hover:text-[#C9961A] transition-colors"
              >
                hi@breakfreetr.com
              </a>
              <div className="mt-6 flex gap-3">
                {[
                  { i: Instagram, l: 'Instagram' },
                  { i: MessageCircle, l: 'WhatsApp' },
                  { i: Youtube, l: 'YouTube' },
                  { i: Mail, l: 'E-posta' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={s.l}
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all hover:border-[#C9961A] hover:bg-[#C9961A] hover:text-[#0A2540]"
                  >
                    <s.i className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/40 md:flex-row">
            <div>© 2026 BreakFree Türkiye. Tüm hakları saklıdır.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/70 transition-colors">
                Gizlilik
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                Kullanım koşulları
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                KVKK
              </a>
            </div>
          </div>
        </div>

        {/* Big watermark */}
        <div className="mt-12 overflow-hidden">
          <div className="font-display text-[clamp(4rem,18vw,18rem)] font-light leading-none tracking-tighter text-white/[0.04] text-center select-none">
            BreakFree
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <motion.a
        href="#"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9961A] text-[#0A2540] shadow-lg shadow-[#C9961A]/30 hover:bg-[#F4E8C8]"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2} />
        <span className="absolute inset-0 rounded-full bg-[#C9961A] animate-ping opacity-20" />
      </motion.a>
    </div>
  );
}
