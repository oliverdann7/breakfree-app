import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const activities = [
  { emoji: '🧘', title: 'Yoga', desc: 'Mind-body connection' },
  { emoji: '🏃', title: 'Running', desc: 'Build endurance' },
  { emoji: '🧠', title: 'Meditation', desc: 'Mental clarity' },
  { emoji: '💪', title: 'Strength', desc: 'Build muscle' },
  { emoji: '🤸', title: 'Stretching', desc: 'Flexibility' },
  { emoji: '✨', title: 'Wellness', desc: 'Holistic health' },
];

const events = [
  { title: '30-Day Challenge', date: 'Upcoming', type: 'Challenge' },
  { title: 'Community Run', date: 'Every Sunday', type: 'Activity' },
  { title: 'Wellness Workshop', date: 'Monthly', type: 'Learning' },
];

const gallery = Array(6).fill(null);

export default function BreakFreeLanding({ onStart }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0A2540] text-white antialiased"
      style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .neon-glow { text-shadow: 0 0 20px rgba(0, 255, 136, 0.5); }
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
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#00FF88"/>
            </svg>
            <span className="font-display text-xl font-medium">BreakFree<span className="text-[#00FF88]">.</span></span>
          </a>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onStart}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Giriş Yap
            </motion.button>
          </div>
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
            Break Free<span className="neon-glow text-[#00FF88]">.</span> <br />
            <span className="text-[#14B8D4]">Live Better.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-white/60">
            Türkiye&apos;nin en dinamik wellness topluluğuyla birleşin. Bin binlerce insanla hedeflerine ulaşın, sağlıklı yaşamı keşfedin.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="rounded-full bg-[#00FF88] px-8 py-4 font-semibold text-[#0A2540] transition-all hover:bg-[#00FF88]/90"
            >
              Başla
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#0A2540] to-[#061829]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="font-display text-5xl font-light">
              Hakkında <span className="text-[#00FF88]">BreakFree</span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              BreakFree Türkiye, sağlıklı yaşamı herkes için erişilebilir kılmak için kurulan bir wellness topluluğudur.
              Yoga, koşu, meditasyon ve daha birçok aktiviteyle kişisel gelişim yolculuğunuza başlayın.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {[
                { number: '10K+', label: 'Üye' },
                { number: '50+', label: 'Aktivite' },
                { number: '100%', label: 'Destek' },
                { number: '24/7', label: 'Erişim' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl text-[#00FF88]">{stat.number}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-center font-display text-5xl font-light"
          >
            Aktiviteler <span className="text-[#14B8D4]">&</span> <span className="text-[#00FF88]">Wellness</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {activities.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-[#00FF88]/50 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-3">{activity.emoji}</div>
                <h3 className="font-display text-lg font-medium">{activity.title}</h3>
                <p className="text-sm text-white/60">{activity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#0A2540] to-[#061829]">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-center font-display text-5xl font-light"
          >
            Etkinlikler <span className="text-[#00FF88]">&</span> <span className="text-[#14B8D4]">Yarışmalar</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm hover:border-[#14B8D4]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl font-medium">{event.title}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#00FF88]/20 text-[#00FF88]">{event.type}</span>
                </div>
                <p className="text-white/60">{event.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-center font-display text-5xl font-light"
          >
            Galeri <span className="text-[#00FF88]">&</span> <span className="text-[#14B8D4]">Anlar</span>
          </motion.h2>

          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-[#14B8D4]/20 to-[#00FF88]/20 flex items-center justify-center hover:border-[#00FF88]/50 transition-all"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-white/60">Topluluk Anları</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#0A2540] to-[#061829]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 className="font-display text-5xl font-light">
              Bize <span className="text-[#00FF88]">Ulaşın</span>
            </h2>
            <p className="text-lg text-white/60">Sorularınız var mı? Sosyal medyada bize takip edin veya doğrudan iletişime geçin.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://instagram.com/breakfreeturkiye"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-full border border-[#14B8D4]/50 bg-[#14B8D4]/10 px-8 py-4 hover:bg-[#14B8D4]/20 transition-all"
              >
                <span className="text-xl">📱</span>
                <span>Instagram</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://wa.me/905418617772"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-full border border-[#00FF88]/50 bg-[#00FF88]/10 px-8 py-4 hover:bg-[#00FF88]/20 transition-all"
              >
                <span className="text-xl">💬</span>
                <span>WhatsApp</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/40 gap-4">
            <p>© 2026 BreakFree Türkiye. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              <a href="https://instagram.com/breakfreeturkiye" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF88] transition-colors">
                Instagram
              </a>
              <a href="https://wa.me/905418617772" target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF88] transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
