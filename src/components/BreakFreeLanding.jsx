import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COLORS = {
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  cream: '#F4E8C8',
};

const styles = {
  container: {
    minHeight: '100vh',
    overflowX: 'hidden',
    backgroundColor: COLORS.navy,
    color: 'white',
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontSmooth: 'antialiased',
    WebkitFontSmoothing: 'antialiased',
  },
  styleSheet: `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
    * { -webkit-font-smoothing: antialiased; }
    .font-display { font-family: 'Fraunces', Georgia, serif; }
  `,
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    width: '100%',
    transition: 'all 0.5s',
    display: 'flex',
    flexDirection: 'column',
  },
  navInner: {
    maxWidth: '80rem',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    '@media (min-width: 1024px)': {
      padding: '1.25rem 3rem',
    },
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
  },
  logoSvg: {
    width: '32px',
    height: '32px',
  },
  brandText: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  brandDot: {
    color: COLORS.gold,
  },
  heroSection: {
    marginTop: '8rem',
    minHeight: 'calc(100vh - 128px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    textAlign: 'center',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  heroTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 'clamp(2.25rem, 8vw, 8rem)',
    fontWeight: 300,
    lineHeight: 1.2,
    margin: 0,
  },
  heroTitleGold: {
    fontStyle: 'italic',
    color: COLORS.gold,
  },
  heroSubtitle: {
    maxWidth: '42rem',
    margin: '0 auto',
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  ctaButton: {
    display: 'inline-block',
    margin: '0 auto',
    borderRadius: '9999px',
    backgroundColor: COLORS.gold,
    color: COLORS.navy,
    padding: '1rem 2rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  ctaButtonHover: {
    backgroundColor: COLORS.cream,
  },
  featuresSection: {
    padding: '1.5rem',
    paddingTop: '5rem',
    paddingBottom: '5rem',
  },
  featuresInner: {
    maxWidth: '80rem',
    margin: '0 auto',
  },
  sectionTitle: {
    marginBottom: '3rem',
    textAlign: 'center',
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '3rem',
    fontWeight: 300,
  },
  sectionTitleGold: {
    color: COLORS.gold,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(4px)',
    padding: '2rem',
  },
  featureTitle: {
    marginBottom: '0.5rem',
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '1.5rem',
    fontWeight: 500,
    color: COLORS.gold,
  },
  featureDesc: {
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  ctaSection: {
    display: 'flex',
    minHeight: '24rem',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    textAlign: 'center',
  },
  ctaContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  ctaTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '3rem',
    fontWeight: 300,
    margin: 0,
  },
  ctaSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
    fontSize: '1rem',
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
  },
  footerInner: {
    maxWidth: '80rem',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.25)',
  },
};

export default function BreakFreeLanding({ onStart }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle = {
    ...styles.nav,
    ...(scrolled
      ? {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(10, 37, 64, 0.8)',
          backdropFilter: 'blur(16px)',
        }
      : { backgroundColor: 'transparent' }),
  };

  return (
    <div style={styles.container}>
      <style>{styles.styleSheet}</style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={navStyle}
      >
        <div style={styles.navInner}>
          <a href="#" style={styles.logoLink}>
            <svg style={styles.logoSvg} viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill={COLORS.royal}/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill={COLORS.gold}/>
            </svg>
            <span style={styles.brandText}>
              BreakFree
              <span style={styles.brandDot}>.</span>
            </span>
          </a>
          <div />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={styles.heroSection}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={styles.heroContent}
        >
          <h1 style={styles.heroTitle}>
            Sağlık ve Fitness için <span style={styles.heroTitleGold}>Özgürlük</span>
          </h1>

          <p style={styles.heroSubtitle}>
            BreakFree, Türkiye&rsquo;nin en dynamik wellness topluluğudur. Bin binlerce insanla birlikte hedeflerine ulaşın.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            style={styles.ctaButton}
            onHoverStart={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.cream;
            }}
            onHoverEnd={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.gold;
            }}
          >
            Başla
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresInner}>
          <h2 style={styles.sectionTitle}>
            Neden <span style={styles.sectionTitleGold}>BreakFree?</span>
          </h2>

          <div style={styles.featureGrid}>
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
                style={styles.featureCard}
              >
                <h3 style={styles.featureTitle}>{item.title}</h3>
                <p style={styles.featureDesc}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={styles.ctaContent}
        >
          <h2 style={styles.ctaTitle}>
            Bugün <span style={styles.sectionTitleGold}>başla</span>
          </h2>
          <p style={styles.ctaSubtitle}>Sağlık yolculuğuna başlamak için hiç geç değil</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            style={styles.ctaButton}
            onHoverStart={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.cream;
            }}
            onHoverEnd={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.gold;
            }}
          >
            Katıl
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p>© 2026 BreakFree Türkiye. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
