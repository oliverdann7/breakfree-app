import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { motion } from 'framer-motion';

export default function WebDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
    { id: 'activities', label: 'Aktiviteler', icon: '🏃' },
    { id: 'health', label: 'Sağlık', icon: '❤️' },
    { id: 'community', label: 'Topluluk', icon: '👥' },
    { id: 'profile', label: 'Profil', icon: '👤' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Hoş Geldin, {user?.displayName || 'Üye'}!</h2>
            <p className="text-white/60">Wellness yolculuğuna devam etmeye hazır mısın?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {[
                { label: 'Wellness Score', value: '85%', icon: '⭐' },
                { label: 'Bu Hafta', value: '4 Aktivite', icon: '📊' },
                { label: 'Hedefler', value: '3/5', icon: '🎯' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Aktiviteler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Yoga Saatı', 'Sabah Koşusu', 'Meditasyon Seansı', 'Güç Antrenmanı'].map((activity) => (
                <div key={activity} className="rounded-xl border border-[#14B8D4]/30 bg-[#14B8D4]/10 p-4">
                  <p className="font-semibold">{activity}</p>
                  <p className="text-white/60 text-sm">Katıl ve puan kazan</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Sağlık Metrikleri</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/60 mb-4">Sağlık verileriniz burada görüntülenecek</p>
              <div className="grid grid-cols-2 gap-4">
                {['Kalori', 'Adım', 'Uyku', 'Nabız'].map((metric) => (
                  <div key={metric} className="text-center p-4 rounded-lg border border-white/10">
                    <p className="text-white/60 text-sm">{metric}</p>
                    <p className="text-2xl font-semibold">--</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Topluluk</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/60">Topluluk özelliği yakında açılacak!</p>
              <p className="text-white/40 text-sm mt-2">Diğer üyelerle bağlantı kurabilecek, tecrübe paylaşabileceksin</p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="font-display text-3xl">Profil</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div>
                <p className="text-white/60 text-sm">İsim</p>
                <p className="text-lg font-semibold">{user?.displayName || 'Kullanıcı'}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">E-mail</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="mt-6 w-full rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] py-3 font-semibold hover:bg-[#EF4444]/30 transition-all"
              >
                Çıkış Yap
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2540] text-white" style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8" viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill="#0072B0"/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#00FF88"/>
            </svg>
            <span className="font-display text-xl font-medium">BreakFree<span className="text-[#00FF88]">.</span></span>
          </div>
          <p className="text-sm text-white/60">{user?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0A2540]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <div className="text-lg mb-1">{tab.icon}</div>
              <div className="hidden sm:block">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing for bottom nav */}
      <div className="h-24" />
    </div>
  );
}
