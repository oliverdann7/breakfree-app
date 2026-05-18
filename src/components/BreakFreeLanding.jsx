import React, { useState, useEffect } from 'react';

const BreakFreeLogo = ({ size = 36, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 178.9 263.7"
    width={size}
    height={size}
    className={className}
    aria-label="BreakFree"
  >
    <path
      fill="#0072B0"
      d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7C101.6,100.5,120,101.5,136.7,112.6z"
    />
    <path
      fill="#C9961A"
      d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9z"
    />
  </svg>
);

export default function BreakFreeLanding({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#061829] text-white"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <style>{`
        .fraunces { font-family: 'Fraunces', serif; }
        .glass { background: linear-gradient(135deg, rgba(10, 37, 64, 0.55), rgba(10, 37, 64, 0.35)); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#061829]/90 border-b border-[#C9961A]/20 backdrop-blur-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-[1240px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BreakFreeLogo size={36} />
            <span className="fraunces text-xl font-medium">
              Break<span className="italic text-[#C9961A]">Free</span>
            </span>
          </div>
          <div className="flex gap-8 items-center text-sm font-medium text-white/80">
            <a href="#features" className="hover:text-[#C9961A]">
              Özellikler
            </a>
            <a href="#pricing" className="hover:text-[#C9961A]">
              Fiyatlandırma
            </a>
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-[#C9961A] to-[#E6B530] text-[#061829] px-6 py-2 rounded-full font-bold"
            >
              Hemen Başla
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-24 px-6">
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#C9961A]/10 border border-[#C9961A]/30 rounded-full px-4 py-2 text-xs font-semibold text-[#E6B530]">
              Türkiye&apos;nin #1 Wellness Platformu
            </div>
            <h1 className="fraunces text-6xl md:text-8xl font-medium leading-tight">
              Sağlığının <br />
              <span className="italic text-[#C9961A]">Sahibi Ol.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-lg">
              Uyku, stres, beslenme ve mental sağlık için yapay zeka koçu, canlı mentor ve gerçek
              topluluk desteği.
            </p>
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-[#C9961A] to-[#E6B530] text-[#061829] px-10 py-4 rounded-full font-bold text-lg"
            >
              Hemen Başla →
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden bg-[#0A2540]/30 border-y border-white/5 py-12">
        <div className="flex gap-8 animate-marquee">
          {[
            'Uyku Optimizasyonu',
            'Stres Yönetimi',
            'Kalp Sağlığı',
            'Beslenme',
            'Meditasyon',
            'Mindfulness',
            'Yoga',
            'Uyku Optimizasyonu',
            'Stres Yönetimi',
            'Kalp Sağlığı',
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-lg font-semibold text-white/70 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9961A]" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="fraunces text-5xl text-center mb-16">Her şey tek bir yerde.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎧',
                title: 'Canlı Konuşmalar',
                desc: 'Sağlık uzmanları ve doktorlarla canlı oturumlar.',
              },
              {
                icon: '🧑‍⚕️',
                title: '1-on-1 Mentörlük',
                desc: 'Sertifikalı koçlardan özel rehberlik.',
              },
              {
                icon: '🤖',
                title: 'AI Wellness Koçu',
                desc: '24/7 kişiselleştirilmiş tavsiyeler.',
              },
            ].map((f, i) => (
              <div key={i} className="glass p-8 hover:border-[#C9961A]/40 transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="fraunces text-2xl mb-2">{f.title}</h3>
                <p className="text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#04101C]">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="fraunces text-5xl text-center mb-16">Kullanıcı Yorumları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'BreakFree hayatımı değiştirdi. Uykum düzeldi.', name: 'Ayşe K.' },
              { quote: 'AI koçu inanılmaz akıllı.', name: 'Mehmet T.' },
              { quote: 'Topluluk harika ve çok motive edici.', name: 'Zeynep A.' },
            ].map((t, i) => (
              <div key={i} className="glass p-8">
                <p className="text-lg italic mb-6">&quot;{t.quote}&quot;</p>
                <div className="font-bold text-[#C9961A]">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="fraunces text-5xl text-center mb-12">Sağlığına yatırım yap.</h2>
          <div className="flex justify-center gap-4 mb-12">
            <button
              className={`px-6 py-2 rounded-full ${!yearly ? 'bg-[#C9961A]' : 'bg-[#061829]'}`}
              onClick={() => setYearly(false)}
            >
              Aylık
            </button>
            <button
              className={`px-6 py-2 rounded-full ${yearly ? 'bg-[#C9961A]' : 'bg-[#061829]'}`}
              onClick={() => setYearly(true)}
            >
              Yıllık
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8">
              <h3 className="text-2xl mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">{yearly ? '₺1.990' : '₺249'}</div>
              <ul className="space-y-2 mb-8">
                <li>✓ AI Wellness Koçu</li>
                <li>✓ Sınırsız Canlı Talks</li>
                <li>✓ Detaylı Analitikler</li>
              </ul>
              <button onClick={onStart} className="w-full bg-[#C9961A] py-3 rounded-lg font-bold">
                Başla
              </button>
            </div>
            <div className="glass p-8">
              <h3 className="text-2xl mb-4">Kurumsal</h3>
              <div className="text-4xl font-bold mb-6">Özel</div>
              <p className="text-white/70 mb-8">Takımlar ve şirketler için özel çözümler.</p>
              <button className="w-full border border-[#C9961A] py-3 rounded-lg font-bold">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          <h2 className="fraunces text-5xl text-center mb-12">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {[
              { q: 'Ücretsiz plan var mı?', a: 'Evet, temel özellikler ücretsizdir.' },
              { q: 'Verilerim güvende mi?', a: 'Evet, uçtan uca şifrelidir.' },
            ].map((f, i) => (
              <div
                key={i}
                className="glass p-6 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="font-bold">{f.q}</div>
                {openFaq === i && <p className="mt-4 text-white/70">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="glass p-16 max-w-4xl mx-auto">
          <h2 className="fraunces text-5xl mb-6">Wellness yolculuğuna başla.</h2>
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-[#C9961A] to-[#E6B530] text-[#061829] px-10 py-4 rounded-full font-bold text-lg"
          >
            Hemen Başla →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C9961A]/10 px-6 py-12 text-center text-sm text-white/50">
        © 2026 BreakFree Türkiye. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
