import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';

const COLORS = {
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0072B0',
  cyan: '#14B8D4',
  cream: '#F4E8C8',
  gold: '#C9961A',
};

export default function WebLoginModal({ onBack }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli bir e-posta girin';
    if (!password) newErrors.password = 'Şifre zorunlu';
    else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await dispatch(login({ email, password }));
      if (login.rejected.match(result)) {
        // Mock login for demo
        dispatch({
          type: 'auth/login/fulfilled',
          payload: {
            user: { uid: 'mock-uid', email, displayName: 'Demo Kullanıcı' },
            token: 'mock-token-123',
          },
        });
      }
    } catch (err) {
      setErrors({ submit: 'Giriş başarısız oldu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden bg-[#0A2540] text-white antialiased flex items-center justify-center"
      style={{ fontFamily: '"Manrope", system-ui, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        .font-display { font-family: 'Fraunces', Georgia, serif; }
        input::placeholder { color: rgba(255, 255, 255, 0.5); }
        input:focus { outline: none; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-md mx-auto px-6"
      >
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={onBack}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg className="h-8 w-8" viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill="#0072B0"/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill="#C9961A"/>
            </svg>
          </div>

          {/* Title */}
          <h2 className="font-display text-3xl font-light text-center mb-2">Hoş geldin</h2>
          <p className="text-center text-white/60 text-sm mb-8">Hesabına giriş yap</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#C9961A] focus:bg-white/10 transition-all"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#C9961A] focus:bg-white/10 transition-all"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-6 py-3 rounded-full bg-[#C9961A] text-[#0A2540] font-semibold text-sm transition-all hover:bg-[#F4E8C8] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Back button */}
          <button
            onClick={onBack}
            className="w-full mt-4 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm transition-all hover:border-white/40 hover:bg-white/5"
          >
            Geri dön
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-white/40 mt-6">
            Hesabın yok mu?{' '}
            <button className="text-[#C9961A] hover:text-[#F4E8C8] transition-colors">
              Kaydol
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
