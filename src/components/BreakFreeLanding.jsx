import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const COLORS = {
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  cream: '#F4E8C8',
};

export default function BreakFreeLanding({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        .font-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'border-b border-white/10 bg-[#0A2540]/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
          <a href="#" className="group flex items-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill="#0072B0"/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#C9961A"/>
            </svg>
            <span className="font-display text-xl font-medium">BreakFree<span className="text-[#C9961A]">.</span></span>
          </a>
          <div />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-32 flex min-h-[calc(100vh-128px)] flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <h1 className="font-display text-6xl font-light leading-tight md:text-8xl">
            Sağlık ve Fitness için <span className="italic text-[#C9961A]">Özgürlük</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-white/60">
            BreakFree, Türkiye'nin en dynamik wellness topluluğudur. Bin binlerce insanla birlikte hedeflerine ulaşın.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="mx-auto block rounded-full bg-[#C9961A] px-8 py-4 font-semibold text-[#0A2540] transition-all hover:bg-[#F4E8C8]"
          >
            Başla
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-display text-5xl font-light">
            Neden <span className="text-[#C9961A]">BreakFree?</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: 'Topluluk', description: 'Binlerce aktif üye ile birlikte büyü' },
              { title: 'Aktiviteler', description: 'Yoga, koşu, meditasyon ve daha fazlası' },
              { title: 'Rehberlik', description: 'Profesyonel eğitmenler sana rehberlik edecek' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <h3 className="mb-2 font-display text-2xl font-medium text-[#C9961A]">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex min-h-96 flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="font-display text-5xl font-light">
            Bugün <span className="text-[#C9961A]">başla</span>
          </h2>
          <p className="text-white/60">Sağlık yolculuğuna başlamak için hiç geç değil</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="mx-auto block rounded-full bg-[#C9961A] px-8 py-4 font-semibold text-[#0A2540] transition-all hover:bg-[#F4E8C8]"
          >
            Katıl
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-white/40">
          <p>© 2026 BreakFree Türkiye. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
