import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Heart,
  Moon,
  Flame,
  TrendingUp,
  Award,
  Play,
  Pause,
  Mic,
  Calendar,
  Users,
  MessageCircle,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Target,
  Zap,
  BookOpen,
  Headphones,
  Video,
  Star,
  Plus,
  Search,
  Home,
  Compass,
  User,
  Bell,
  Settings,
  MapPin,
  Clock,
  ArrowRight,
  Brain,
  Dumbbell,
  Apple,
  CheckCircle2,
  Circle,
  BarChart3,
  Footprints,
  Sun,
  Quote,
  Radio,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// BreakFree App — Concept Preview
// 6 phone mockups: Onboarding · Dashboard · Talks · Mentor
//                  Events · Profile
// ─────────────────────────────────────────────────────────────

const C = {
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0B72B9',
  cyan: '#14B8D4',
  cream: '#F4E8C8',
  gold: '#E6B530',
  amber: '#C99419',
};

// Phone frame
const PhoneFrame = ({ children, label, sublabel, delay = 0, accent = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      {/* Label above */}
      <div className="mb-6 text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] ${
            accent ? 'bg-[#E6B530] text-[#0A2540]' : 'border border-white/15 text-white/50'
          }`}
        >
          {label}
        </div>
        <div className="mt-3 font-display text-lg font-light text-white/80">{sublabel}</div>
      </div>

      {/* Phone */}
      <motion.div
        whileHover={{ y: -8, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative"
      >
        {/* Glow */}
        <div
          className={`absolute -inset-8 rounded-[60px] blur-3xl opacity-30 ${
            accent ? 'bg-[#E6B530]' : 'bg-[#14B8D4]'
          }`}
        />

        {/* Frame */}
        <div className="relative h-[640px] w-[300px] rounded-[48px] border-[3px] border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#000] p-2 shadow-2xl">
          {/* Side buttons */}
          <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-white/20" />
          <div className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-white/20" />
          <div className="absolute -left-[3px] top-52 h-12 w-[3px] rounded-l bg-white/20" />
          <div className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-white/20" />

          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-[#0A2540]">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-3 text-[10px] text-white font-semibold">
              <span>9:41</span>
              <span className="opacity-0">.</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="h-2 w-0.5 rounded bg-white" />
                  <div className="h-2.5 w-0.5 rounded bg-white" />
                  <div className="h-3 w-0.5 rounded bg-white" />
                  <div className="h-3 w-0.5 rounded bg-white" />
                </div>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="white">
                  <path d="M6 0a6 6 0 0 0-6 6h1.5A4.5 4.5 0 0 1 6 1.5 4.5 4.5 0 0 1 10.5 6H12A6 6 0 0 0 6 0z" />
                </svg>
                <div className="flex h-2.5 w-5 items-center rounded-sm border border-white px-0.5">
                  <div className="h-1 w-3 rounded-sm bg-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="h-full w-full pt-8">{children}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════ SCREEN 1: ONBOARDING ═══════════════════════
const ScreenOnboarding = () => (
  <div className="relative h-full w-full overflow-hidden">
    {/* Animated gradient bg */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0B72B9]/40 to-[#0A2540]" />
    <motion.div
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute top-20 -left-10 h-40 w-40 rounded-full bg-[#E6B530] opacity-30 blur-3xl"
    />
    <motion.div
      animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute bottom-20 -right-10 h-40 w-40 rounded-full bg-[#14B8D4] opacity-30 blur-3xl"
    />

    <div className="relative flex h-full flex-col px-6 pb-8 pt-12">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2">
        <div className="relative h-7 w-7">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
          <div className="absolute inset-[2px] rounded-full bg-[#0A2540] flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-[#E6B530]" />
          </div>
        </div>
        <span className="font-display text-lg font-medium text-white">
          BreakFree<span className="text-[#E6B530]">.</span>
        </span>
      </div>

      {/* Hero illustration */}
      <div className="mt-12 flex flex-1 items-center justify-center">
        <div className="relative">
          {/* Orbit circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 rounded-full border border-[#E6B530]/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-16 rounded-full border border-[#14B8D4]/15"
          />

          {/* Floating tags */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -left-12 -top-4 rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white backdrop-blur-md border border-white/10"
          >
            <Heart className="inline h-3 w-3 mr-1 text-[#E6B530]" />
            Sağlık
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-10 top-8 rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white backdrop-blur-md border border-white/10"
          >
            <Users className="inline h-3 w-3 mr-1 text-[#14B8D4]" />
            Topluluk
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -left-6 bottom-0 rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white backdrop-blur-md border border-white/10"
          >
            <Brain className="inline h-3 w-3 mr-1 text-[#E6B530]" />
            Zihin
          </motion.div>

          {/* Center */}
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419] shadow-lg shadow-[#E6B530]/40">
            <Sparkles className="h-12 w-12 text-[#0A2540]" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="font-display text-3xl font-light leading-tight text-white">
          Özgürlüğüne <br />
          <span className="italic text-[#E6B530]">hoş geldin.</span>
        </h2>
        <p className="mt-3 text-xs text-white/60 leading-relaxed px-4">
          Türkiye'nin en bağlı wellness topluluğu cebinde.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6 space-y-2">
        <button className="w-full rounded-full bg-[#E6B530] py-3.5 text-sm font-semibold text-[#0A2540]">
          Başla
        </button>
        <button className="w-full rounded-full border border-white/15 py-3.5 text-sm text-white">
          Hesabım var
        </button>
      </div>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        <div className="h-1 w-6 rounded-full bg-[#E6B530]" />
        <div className="h-1 w-1 rounded-full bg-white/20" />
        <div className="h-1 w-1 rounded-full bg-white/20" />
      </div>
    </div>
  </div>
);

// ═══════════════════════ SCREEN 2: DASHBOARD ═══════════════════════
const ScreenDashboard = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#061829]">
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
      {/* Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              Pazar, 15 Haziran
            </div>
            <div className="mt-1 font-display text-xl font-light text-white">
              Günaydın, <span className="italic text-[#E6B530]">Elif</span>
            </div>
          </div>
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Bell className="h-4 w-4 text-white/70" />
            </div>
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#E6B530]" />
          </div>
        </div>
      </div>

      {/* Ring score */}
      <div className="mx-5 mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#E6B530]/10 via-transparent to-[#14B8D4]/10 p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={C.gold}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="213.6"
                strokeDashoffset="51"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-2xl font-light text-white">76</div>
              <div className="text-[8px] uppercase tracking-wider text-white/50">Skor</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-white/50">Wellness skorun</div>
            <div className="mt-0.5 font-display text-lg leading-tight text-white">
              Bugün <span className="text-[#E6B530]">hazırsın.</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#14B8D4]">
              <TrendingUp className="h-3 w-3" />
              Dünden +8 puan
            </div>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="mx-5 mt-3 grid grid-cols-2 gap-2">
        {[
          { icon: Moon, label: 'Uyku', val: '7s 24dk', color: C.cyan, sub: 'İyi' },
          { icon: Heart, label: 'Nabız', val: '64', color: '#E6B530', sub: 'Dinlenme' },
          { icon: Footprints, label: 'Adım', val: '8.2k', color: '#14B8D4', sub: 'Hedef %82' },
          { icon: Flame, label: 'Kalori', val: '1,847', color: '#E6B530', sub: 'Aktif' },
        ].map((m, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <m.icon className="h-3.5 w-3.5" style={{ color: m.color }} />
              <span className="text-[9px] uppercase tracking-wider text-white/40">{m.label}</span>
            </div>
            <div className="mt-2 font-display text-lg font-light text-white">{m.val}</div>
            <div className="text-[9px] text-white/50">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Today's plan */}
      <div className="mx-5 mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-white">Bugünkü plan</div>
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        </div>
        <div className="space-y-2">
          {[
            { time: '07:00', title: 'Sabah meditasyonu', dur: '10dk', done: true, icon: Brain },
            {
              time: '17:30',
              title: 'Fitness · Üst beden',
              dur: '45dk',
              done: false,
              icon: Dumbbell,
            },
            {
              time: '20:00',
              title: 'Wellness palestrası',
              dur: '30dk',
              done: false,
              icon: Mic,
              accent: true,
            },
          ].map((t, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                t.accent ? 'border-[#E6B530]/30 bg-[#E6B530]/5' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  t.done
                    ? 'bg-[#14B8D4]/20 text-[#14B8D4]'
                    : t.accent
                      ? 'bg-[#E6B530] text-[#0A2540]'
                      : 'bg-white/10 text-white'
                }`}
              >
                {t.done ? <CheckCircle2 className="h-4 w-4" /> : <t.icon className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div
                  className={`text-[11px] font-medium ${t.done ? 'text-white/40 line-through' : 'text-white'}`}
                >
                  {t.title}
                </div>
                <div className="text-[9px] text-white/40">
                  {t.time} · {t.dur}
                </div>
              </div>
              {t.accent && (
                <div className="rounded-full bg-[#E6B530] px-2 py-0.5 text-[8px] font-semibold uppercase text-[#0A2540]">
                  Canlı
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Tab bar */}
    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061829]/90 px-6 py-2 backdrop-blur-xl">
      <div className="flex justify-between">
        {[
          { i: Home, l: 'Ana', active: true },
          { i: Mic, l: 'Palestralar' },
          { i: Activity, l: 'Sağlık' },
          { i: Users, l: 'Topluluk' },
          { i: User, l: 'Profil' },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 px-1 py-1.5 ${t.active ? 'text-[#E6B530]' : 'text-white/40'}`}
          >
            <t.i className="h-4 w-4" strokeWidth={t.active ? 2.2 : 1.5} />
            <span className="text-[8px] font-medium">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════ SCREEN 3: TALKS / PALESTRAS ═══════════════════════
const ScreenTalks = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#061829]">
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
      {/* Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="font-display text-xl font-light text-white">
            Palestralar <span className="italic text-[#E6B530]">&</span> sesler
          </div>
          <Search className="h-4 w-4 text-white/40" />
        </div>
        <p className="mt-1 text-[10px] text-white/50">Türkiye'nin en güçlü zihinleri</p>
      </div>

      {/* Live now */}
      <div className="mx-5 mt-4 overflow-hidden rounded-2xl border border-[#E6B530]/30 bg-gradient-to-br from-[#E6B530]/15 via-[#E6B530]/5 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-[#E6B530] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0A2540]">
            <span className="h-1 w-1 rounded-full bg-[#0A2540] animate-pulse" />
            Canlı
          </span>
          <span className="text-[10px] text-white/60">347 dinleyici</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-light leading-tight text-white">
          Yorgunluğun ardındaki
          <br />
          <span className="italic text-[#E6B530]">gerçek hikaye</span>
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/60">
          <div className="flex -space-x-1.5">
            <div className="h-5 w-5 rounded-full border-2 border-[#0A2540] bg-gradient-to-br from-[#14B8D4] to-[#0B72B9]" />
            <div className="h-5 w-5 rounded-full border-2 border-[#0A2540] bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
          </div>
          <span>Dr. Ayşe Demir · Coach Burak</span>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#E6B530] py-2 text-[11px] font-semibold text-[#0A2540]">
          <Headphones className="h-3 w-3" />
          Şimdi dinle
        </button>
      </div>

      {/* Categories */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-5 scrollbar-hide">
        {['Tümü', 'Beslenme', 'Zihin', 'Hareket', 'Uyku', 'Bağlantı'].map((c, i) => (
          <div
            key={i}
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium ${
              i === 0 ? 'bg-white text-[#0A2540]' : 'border border-white/15 text-white/70'
            }`}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Featured talk */}
      <div className="mx-5 mt-4">
        <div className="text-[10px] uppercase tracking-widest text-[#E6B530]">Öne çıkan</div>
        <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="relative aspect-video bg-gradient-to-br from-[#0B72B9] via-[#14B8D4] to-[#E6B530]">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[9px] text-white backdrop-blur-md">
              42 dk
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <Play className="h-5 w-5 fill-white text-white ml-0.5" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="text-[9px] uppercase tracking-wider text-[#14B8D4]">
              Beslenme · Bölüm 12
            </div>
            <div className="mt-1 font-display text-sm font-medium leading-tight text-white">
              Sezgisel beslenme: kuralları unutmak
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-white/50">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
              <span>Beslenme uzmanı Selin Kaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mx-5 mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold text-white">Senin için</div>
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        </div>
        <div className="space-y-2">
          {[
            {
              cat: 'Zihin',
              title: 'Anksiyeteyi anlamak',
              dur: '28dk',
              host: 'Dr. Ayşe',
              g: 'from-[#14B8D4] to-[#0B72B9]',
            },
            {
              cat: 'Hareket',
              title: 'Koşunun bilimi',
              dur: '35dk',
              host: 'Mehmet Ç.',
              g: 'from-[#E6B530] to-[#C99419]',
            },
            {
              cat: 'Uyku',
              title: 'Derin uykuya yolculuk',
              dur: '22dk',
              host: 'Dr. Levent',
              g: 'from-[#0B72B9] to-[#0A2540]',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2"
            >
              <div
                className={`h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br ${t.g} flex items-center justify-center`}
              >
                <Play className="h-4 w-4 fill-white text-white ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] uppercase tracking-wider text-[#E6B530]">{t.cat}</div>
                <div className="mt-0.5 text-[11px] font-medium leading-tight text-white truncate">
                  {t.title}
                </div>
                <div className="text-[9px] text-white/40">
                  {t.host} · {t.dur}
                </div>
              </div>
              <Plus className="h-4 w-4 text-white/30" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Tab bar */}
    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061829]/90 px-6 py-2 backdrop-blur-xl">
      <div className="flex justify-between">
        {[
          { i: Home, l: 'Ana' },
          { i: Mic, l: 'Palestralar', active: true },
          { i: Activity, l: 'Sağlık' },
          { i: Users, l: 'Topluluk' },
          { i: User, l: 'Profil' },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 px-1 py-1.5 ${t.active ? 'text-[#E6B530]' : 'text-white/40'}`}
          >
            <t.i className="h-4 w-4" strokeWidth={t.active ? 2.2 : 1.5} />
            <span className="text-[8px] font-medium">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════ SCREEN 4: MENTOR / 1-ON-1 ═══════════════════════
const ScreenMentor = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#061829]">
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
      {/* Header with mentor */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B72B9] via-[#14B8D4] to-[#E6B530]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061829] via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-5">
          <div className="flex items-end gap-3">
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[#E6B530] to-[#C99419] flex items-center justify-center font-display text-2xl text-[#0A2540] border-2 border-[#061829] shadow-lg">
              A
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#061829] bg-[#14B8D4]" />
            </div>
            <div className="flex-1 pb-1">
              <div className="text-[10px] uppercase tracking-widest text-white/70">Mentörün</div>
              <div className="font-display text-lg font-medium text-white">Dr. Ayşe Demir</div>
              <div className="text-[10px] text-white/70">Wellness · 8 yıl deneyim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="-mt-2 mx-5 grid grid-cols-3 gap-2">
        {[
          { i: MessageCircle, l: 'Sohbet' },
          { i: Video, l: 'Görüşme' },
          { i: Calendar, l: 'Planla' },
        ].map((a, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-[#061829] p-2.5"
          >
            <a.i className="h-4 w-4 text-[#E6B530]" />
            <span className="text-[9px] text-white/70">{a.l}</span>
          </div>
        ))}
      </div>

      {/* This week's focus */}
      <div className="mx-5 mt-4 rounded-2xl border border-[#E6B530]/20 bg-gradient-to-br from-[#E6B530]/10 to-transparent p-4">
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-[#E6B530]" />
          <span className="text-[10px] uppercase tracking-widest text-[#E6B530]">
            Bu hafta odak
          </span>
        </div>
        <h3 className="mt-2 font-display text-base font-medium leading-snug text-white">
          Akşam rutini ve <span className="italic text-[#E6B530]">uyku kalitesi</span>
        </h3>

        <div className="mt-3 space-y-2">
          {[
            { l: "22:00'da ekranları kapat", done: true },
            { l: '10dk akşam meditasyonu', done: true },
            { l: 'Günlük journal — 3 minnet', done: false },
            { l: 'Hafif yoga · 15dk', done: false },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              {g.done ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E6B530]" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0 text-white/30" />
              )}
              <span
                className={`text-[11px] ${g.done ? 'text-white/40 line-through' : 'text-white'}`}
              >
                {g.l}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-[#E6B530]" />
          </div>
          <span className="text-[10px] text-white/60">2/4</span>
        </div>
      </div>

      {/* Latest message */}
      <div className="mx-5 mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Son mesaj</span>
          <span className="text-[9px] text-white/40">2sa önce</span>
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419] flex items-center justify-center text-[10px] font-semibold text-[#0A2540]">
            A
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-white/5 p-2.5">
            <p className="text-[11px] leading-relaxed text-white/90">
              Elif, bu haftaki ilerlemen harika 🌟 Pazartesi seansımızda uyku verilerine birlikte
              bakalım.
            </p>
          </div>
        </div>
      </div>

      {/* Next session */}
      <div className="mx-5 mt-3 mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-[#14B8D4]/10 to-transparent p-3">
        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-[#14B8D4]/20 text-[#14B8D4]">
          <span className="text-[9px] uppercase">Pzt</span>
          <span className="text-xs font-bold">17</span>
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-medium text-white">Görüntülü görüşme</div>
          <div className="text-[9px] text-white/50">19:00 · 30dk</div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061829]/90 px-6 py-2 backdrop-blur-xl">
      <div className="flex justify-between">
        {[
          { i: Home, l: 'Ana' },
          { i: Mic, l: 'Palestralar' },
          { i: Activity, l: 'Sağlık' },
          { i: Users, l: 'Topluluk' },
          { i: User, l: 'Profil', active: true },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 px-1 py-1.5 ${t.active ? 'text-[#E6B530]' : 'text-white/40'}`}
          >
            <t.i className="h-4 w-4" strokeWidth={t.active ? 2.2 : 1.5} />
            <span className="text-[8px] font-medium">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════ SCREEN 5: METRICS DEEP DIVE ═══════════════════════
const ScreenMetrics = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#061829]">
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              Detaylı analiz
            </div>
            <div className="mt-0.5 font-display text-xl font-light text-white">
              Sağlık <span className="italic text-[#E6B530]">verilerin</span>
            </div>
          </div>
          <BarChart3 className="h-4 w-4 text-white/40" />
        </div>
      </div>

      {/* Period */}
      <div className="mx-5 mt-4 flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {['Gün', 'Hafta', 'Ay', 'Yıl'].map((p, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full py-1.5 text-center text-[10px] font-medium ${
              i === 1 ? 'bg-[#E6B530] text-[#0A2540]' : 'text-white/60'
            }`}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Big chart card */}
      <div className="mx-5 mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">Wellness skoru</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-light text-white">76</span>
              <span className="text-[10px] text-[#14B8D4]">↑ +12%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-white/40">Ortalama</div>
            <div className="text-xs font-medium text-white">71</div>
          </div>
        </div>

        {/* Mini chart */}
        <div className="mt-4 h-24 w-full">
          <svg viewBox="0 0 240 80" className="h-full w-full">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.gold} stopOpacity="0.3" />
                <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 60 L 34 50 L 68 55 L 102 35 L 136 40 L 170 25 L 204 30 L 240 15 L 240 80 L 0 80 Z"
              fill="url(#g1)"
            />
            <path
              d="M 0 60 L 34 50 L 68 55 L 102 35 L 136 40 L 170 25 L 204 30 L 240 15"
              fill="none"
              stroke={C.gold}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [0, 60],
              [34, 50],
              [68, 55],
              [102, 35],
              [136, 40],
              [170, 25],
              [204, 30],
              [240, 15],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2.5"
                fill={C.navy}
                stroke={C.gold}
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-white/40">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="mx-5 mt-3 space-y-2">
        {[
          { l: 'Uyku kalitesi', v: 84, c: C.cyan, sub: 'Mükemmel · 7s 24dk' },
          { l: 'Hareket', v: 72, c: C.gold, sub: 'İyi · 8.2k adım' },
          { l: 'Zihin & stres', v: 68, c: '#0B72B9', sub: 'İyi · 3 meditasyon' },
          { l: 'Beslenme', v: 81, c: '#E6B530', sub: 'Çok iyi · 2.1L su' },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white">{m.l}</span>
              <span className="font-display text-sm font-light text-white">{m.v}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.v}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{ background: m.c }}
              />
            </div>
            <div className="mt-1 text-[9px] text-white/40">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* AI insight */}
      <div className="mx-5 mt-4 mb-5 rounded-2xl border border-[#E6B530]/30 bg-gradient-to-br from-[#E6B530]/10 to-transparent p-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[#E6B530]" />
          <span className="text-[9px] uppercase tracking-widest text-[#E6B530]">AI İçgörü</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-white/85">
          Uyku puanın bu hafta <span className="text-[#E6B530] font-medium">%14 yükseldi</span>.
          Akşam meditasyonu rutinini sürdürmeni öneririm — sonuçlar harika.
        </p>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061829]/90 px-6 py-2 backdrop-blur-xl">
      <div className="flex justify-between">
        {[
          { i: Home, l: 'Ana' },
          { i: Mic, l: 'Palestralar' },
          { i: Activity, l: 'Sağlık', active: true },
          { i: Users, l: 'Topluluk' },
          { i: User, l: 'Profil' },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 px-1 py-1.5 ${t.active ? 'text-[#E6B530]' : 'text-white/40'}`}
          >
            <t.i className="h-4 w-4" strokeWidth={t.active ? 2.2 : 1.5} />
            <span className="text-[8px] font-medium">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════ SCREEN 6: COMMUNITY / EVENTS ═══════════════════════
const ScreenCommunity = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#061829]">
    <div className="h-full overflow-y-auto pb-20 scrollbar-hide">
      <div className="px-5 pt-4">
        <div className="font-display text-xl font-light text-white">
          Topluluk <span className="italic text-[#E6B530]">akışı</span>
        </div>
      </div>

      {/* Story-like row */}
      <div className="mt-4 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
        {[
          { l: 'Sen', accent: true, init: '+' },
          { l: 'Burak', g: 'from-[#E6B530] to-[#C99419]', init: 'B' },
          { l: 'Selin', g: 'from-[#14B8D4] to-[#0B72B9]', init: 'S' },
          { l: 'Can', g: 'from-[#0B72B9] to-[#0A2540]', init: 'C' },
          { l: 'Aslı', g: 'from-[#E6B530] to-[#14B8D4]', init: 'A' },
          { l: 'Mert', g: 'from-[#C99419] to-[#E6B530]', init: 'M' },
        ].map((s, i) => (
          <div key={i} className="flex shrink-0 flex-col items-center gap-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full p-0.5 ${
                s.accent
                  ? 'border border-dashed border-[#E6B530]'
                  : 'bg-gradient-to-br from-[#E6B530] to-[#C99419]'
              }`}
            >
              <div
                className={`flex h-full w-full items-center justify-center rounded-full ${
                  s.accent
                    ? 'bg-[#061829] text-[#E6B530]'
                    : `bg-gradient-to-br ${s.g} text-white text-sm font-medium`
                }`}
              >
                {s.init}
              </div>
            </div>
            <span className="text-[9px] text-white/60">{s.l}</span>
          </div>
        ))}
      </div>

      {/* Next event card */}
      <div className="mx-5 mt-3 overflow-hidden rounded-2xl border border-[#E6B530]/30 bg-gradient-to-br from-[#E6B530]/10 via-transparent to-[#14B8D4]/5">
        <div className="relative h-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B72B9] via-[#14B8D4] to-[#E6B530]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E6B530] animate-pulse" />
            <span className="text-[9px] text-white">Yarın</span>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="text-[9px] uppercase tracking-wider text-white/80">Doğa yürüyüşü</div>
            <div className="font-display text-base leading-tight text-white">Belgrad Şafak</div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="h-5 w-5 rounded-full border-2 border-[#0A2540] bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
              <div className="h-5 w-5 rounded-full border-2 border-[#0A2540] bg-gradient-to-br from-[#14B8D4] to-[#0B72B9]" />
              <div className="h-5 w-5 rounded-full border-2 border-[#0A2540] bg-gradient-to-br from-[#0B72B9] to-[#0A2540]" />
            </div>
            <span className="text-[10px] text-white/60">+24 kişi</span>
          </div>
          <button className="rounded-full bg-[#E6B530] px-3 py-1.5 text-[10px] font-semibold text-[#0A2540]">
            Katıl
          </button>
        </div>
      </div>

      {/* Feed post */}
      <div className="mx-5 mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#14B8D4] to-[#0B72B9] flex items-center justify-center text-xs font-medium text-white">
            B
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-white">Burak Yılmaz</span>
              <Award className="h-3 w-3 text-[#E6B530]" />
            </div>
            <div className="text-[9px] text-white/40">2 saat önce · Sarıyer</div>
          </div>
          <Plus className="h-4 w-4 text-white/30" />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-white/85">
          Bu sabahki 10K koşuyu bitirdim 🌅 İlk kez sub-50'ye girdim. BreakFree topluluğu olmasaydı
          asla olmazdı.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: '10.2 km', i: Footprints },
            { l: '48:32', i: Clock },
            { l: '142 bpm', i: Heart },
          ].map((s, i) => (
            <div key={i} className="rounded-lg bg-white/[0.04] p-2 text-center">
              <s.i className="mx-auto h-3 w-3 text-[#E6B530]" />
              <div className="mt-1 text-[10px] font-medium text-white">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-white/50">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-[#E6B530] text-[#E6B530]" /> 47
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> 12
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> Tebrik et
          </span>
        </div>
      </div>

      {/* Mini-challenge */}
      <div className="mx-5 mt-3 mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#14B8D4]/10 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-[#E6B530]" />
            <span className="text-[10px] uppercase tracking-widest text-[#14B8D4]">
              Haftalık meydan okuma
            </span>
          </div>
          <span className="text-[9px] text-white/40">3 gün</span>
        </div>
        <h4 className="mt-2 font-display text-sm font-medium text-white">50K adım haftası 👟</h4>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#14B8D4] to-[#E6B530]" />
          </div>
          <span className="text-[10px] font-medium text-white">33.4k / 50k</span>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#061829]/90 px-6 py-2 backdrop-blur-xl">
      <div className="flex justify-between">
        {[
          { i: Home, l: 'Ana' },
          { i: Mic, l: 'Palestralar' },
          { i: Activity, l: 'Sağlık' },
          { i: Users, l: 'Topluluk', active: true },
          { i: User, l: 'Profil' },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-0.5 px-1 py-1.5 ${t.active ? 'text-[#E6B530]' : 'text-white/40'}`}
          >
            <t.i className="h-4 w-4" strokeWidth={t.active ? 2.2 : 1.5} />
            <span className="text-[8px] font-medium">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function BreakFreeAppPreview() {
  return (
    <div
      className="min-h-screen bg-[#061829] text-white"
      style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Manrope:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        ::selection { background: #E6B530; color: #0A2540; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540] via-[#061829] to-[#000]" />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#E6B530] opacity-10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-[#14B8D4] opacity-10 blur-[140px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative">
        {/* ───── HEADER ───── */}
        <header className="px-6 pt-16 pb-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="relative h-9 w-9">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
                  <div className="absolute inset-[3px] rounded-full bg-[#061829] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#E6B530]" />
                  </div>
                </div>
                <span className="font-display text-xl font-medium">
                  BreakFree<span className="text-[#E6B530]">.</span>
                </span>
                <span className="ml-2 rounded-full border border-[#E6B530]/30 bg-[#E6B530]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#E6B530]">
                  Konsept · 2026
                </span>
              </div>

              <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tight">
                Topluluk
                <br />
                <span className="italic text-[#E6B530]">cebinde.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
                BreakFree mobil deneyimi: bütünsel sağlık verileri, kişisel mentor, canlı
                palestralar, topluluk akışı ve etkinlik takvimi — tek bir uygulamada.
              </p>

              {/* Feature pills */}
              <div className="mt-10 flex flex-wrap gap-2">
                {[
                  { i: Activity, l: 'Sağlık Metrikleri' },
                  { i: Mic, l: 'Canlı Palestralar' },
                  { i: Brain, l: '1-1 Mentörlük' },
                  { i: Users, l: 'Topluluk Akışı' },
                  { i: Calendar, l: 'Etkinlik Takvimi' },
                  { i: Sparkles, l: 'AI İçgörüler' },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/70 backdrop-blur-md"
                  >
                    <f.i className="h-3.5 w-3.5 text-[#E6B530]" />
                    {f.l}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </header>

        {/* ───── PHONE GRID ───── */}
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex items-center gap-3">
              <div className="h-px w-12 bg-[#E6B530]" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#E6B530]">
                6 ana ekran
              </span>
            </div>

            <div className="grid gap-x-8 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
              <PhoneFrame label="01 · Karşılama" sublabel="Onboarding" delay={0}>
                <ScreenOnboarding />
              </PhoneFrame>
              <PhoneFrame label="02 · Ana sayfa" sublabel="Dashboard" delay={0.1} accent>
                <ScreenDashboard />
              </PhoneFrame>
              <PhoneFrame label="03 · İçerik" sublabel="Palestralar & sesler" delay={0.2}>
                <ScreenTalks />
              </PhoneFrame>
              <PhoneFrame label="04 · Veriler" sublabel="Sağlık metrikleri" delay={0} accent>
                <ScreenMetrics />
              </PhoneFrame>
              <PhoneFrame label="05 · Mentor" sublabel="1-1 mentörlük" delay={0.1}>
                <ScreenMentor />
              </PhoneFrame>
              <PhoneFrame label="06 · Sosyal" sublabel="Topluluk & etkinlik" delay={0.2}>
                <ScreenCommunity />
              </PhoneFrame>
            </div>
          </div>
        </section>

        {/* ───── FEATURE BREAKDOWN ───── */}
        <section className="px-6 py-32 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#E6B530]" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#E6B530]">
                  Ana özellikler
                </span>
              </div>
              <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
                Sadece bir app değil —{' '}
                <span className="italic text-[#E6B530]">bir yaşam katmanı.</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  i: Activity,
                  t: 'Bütünsel sağlık paneli',
                  d: 'Uyku, kalp atışı, adım, kalori, stres ve zihin metrikleri. Apple Health & Google Fit entegrasyonu.',
                  accent: true,
                },
                {
                  i: Mic,
                  t: 'Canlı palestralar',
                  d: "Türkiye'nin en iyi wellness uzmanlarından canlı yayınlar, podcast bölümleri ve mikro-dersler.",
                },
                {
                  i: Brain,
                  t: 'AI içgörüler',
                  d: 'Verilerini analiz eden, kişiselleştirilmiş öneriler sunan akıllı asistan. Her gün bir adım önde.',
                },
                {
                  i: User,
                  t: '1-1 mentörlük',
                  d: 'Sertifikalı koçlar ile haftalık görüntülü görüşme, günlük mesajlaşma ve hedef takibi.',
                },
                {
                  i: Users,
                  t: 'Topluluk akışı',
                  d: "Antrenmanlarını paylaş, başkalarının ilerlemesini gör. Story-tarzı paylaşımlar, tebrikler, hashtag'ler.",
                  accent: true,
                },
                {
                  i: Calendar,
                  t: 'Etkinlik takvimi',
                  d: 'Belgrad yürüyüşleri, fitness buluşmaları, atölyeler. Tek dokunuşla RSVP, geri sayım, hatırlatma.',
                },
                {
                  i: Target,
                  t: 'Haftalık meydan okumalar',
                  d: 'Topluluk olarak hedefler. 50K adım haftası, 7 gün meditasyon, hidrasyon serileri.',
                },
                {
                  i: Award,
                  t: 'Rozetler & seviye',
                  d: "Tutarlılık ödüllendirilir. Streak'ler, rozetler, sezon sıralamaları — gamification'ın sade hali.",
                },
                {
                  i: Sparkles,
                  t: 'Sesli rehberlik',
                  d: 'Yürüyüş, koşu ve meditasyon için sesli rehberli oturumlar. Türkçe, İngilizce, Portekizce.',
                  accent: true,
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
                    f.accent
                      ? 'border-[#E6B530]/30 bg-gradient-to-br from-[#E6B530]/[0.08] to-transparent'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      f.accent ? 'bg-[#E6B530] text-[#0A2540]' : 'bg-white/10 text-[#E6B530]'
                    }`}
                  >
                    <f.i className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-medium leading-tight">{f.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{f.d}</p>
                  <div className="absolute -right-12 -bottom-12 h-24 w-24 rounded-full bg-[#E6B530]/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── ROADMAP ───── */}
        <section className="px-6 py-32 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#E6B530]" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#E6B530]">
                  Yol haritası
                </span>
              </div>
              <h2 className="max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
                Üç aşamada <span className="italic text-[#E6B530]">tam ürün.</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  phase: 'V1 · MVP',
                  date: 'Q3 2026',
                  title: 'Topluluk + içerik',
                  items: [
                    'Onboarding',
                    'Etkinlik takvimi',
                    'Topluluk akışı',
                    'Podcast/palestralar',
                    'Profil & rozetler',
                  ],
                  status: 'Tasarım',
                },
                {
                  phase: 'V2 · Sağlık',
                  date: 'Q1 2027',
                  title: 'Bütünsel veriler',
                  items: [
                    'Apple Health & Google Fit',
                    'Wellness skoru',
                    'Detaylı analitik',
                    'AI içgörüler',
                    'Haftalık meydan okumalar',
                  ],
                  status: 'Planlanıyor',
                  accent: true,
                },
                {
                  phase: 'V3 · Mentörlük',
                  date: 'Q3 2027',
                  title: 'Premium katman',
                  items: [
                    '1-1 mentörlük',
                    'Görüntülü görüşme',
                    'Sertifikalı koçlar',
                    'Kişiselleştirilmiş plan',
                    'Aile hesapları',
                  ],
                  status: 'Vizyon',
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className={`relative overflow-hidden rounded-3xl p-8 ${
                    p.accent
                      ? 'bg-gradient-to-br from-[#E6B530] to-[#C99419] text-[#0A2540]'
                      : 'border border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase tracking-[0.25em] ${p.accent ? 'text-[#0A2540]/70' : 'text-[#E6B530]'}`}
                    >
                      {p.phase}
                    </span>
                    <span
                      className={`text-[10px] ${p.accent ? 'text-[#0A2540]/70' : 'text-white/40'}`}
                    >
                      {p.date}
                    </span>
                  </div>
                  <h3
                    className={`mt-4 font-display text-3xl font-light leading-tight ${p.accent ? 'text-[#0A2540]' : 'text-white'}`}
                  >
                    {p.title}
                  </h3>
                  <ul
                    className={`mt-6 space-y-2 text-sm ${p.accent ? 'text-[#0A2540]/80' : 'text-white/70'}`}
                  >
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <div
                          className={`h-1 w-1 rounded-full ${p.accent ? 'bg-[#0A2540]' : 'bg-[#E6B530]'}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`mt-8 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                      p.accent
                        ? 'bg-[#0A2540] text-[#E6B530]'
                        : 'border border-white/15 text-white/50'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${p.accent ? 'bg-[#E6B530]' : 'bg-white/40'}`}
                    />
                    {p.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── FOOTER ───── */}
        <footer className="border-t border-white/10 px-6 py-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <div className="relative h-7 w-7">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6B530] to-[#C99419]" />
                  <div className="absolute inset-[2px] rounded-full bg-[#061829] flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#E6B530]" />
                  </div>
                </div>
                <span className="font-display text-lg">
                  BreakFree<span className="text-[#E6B530]">.</span>
                </span>
                <span className="ml-2 text-xs text-white/40">App Concept Preview · 2026</span>
              </div>
              <div className="text-xs text-white/40">
                Design system: navy + gold · Fraunces × Manrope
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
