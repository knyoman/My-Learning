import React, { useEffect, useState } from 'react';
import { supabase, checkUsernameAvailability } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, User as UserIcon, CheckCircle, X } from 'lucide-react';
import { ProfilePage } from './ProfilePage';

interface AuthWrapperProps {
  children: React.ReactNode;
  currentPage?: 'php' | 'html-css' | 'react';
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, currentPage = 'php' }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check username availability
  useEffect(() => {
    if (username.length >= 3 && authMode === 'signup') {
      setCheckingUsername(true);
      const timeoutId = setTimeout(async () => {
        try {
          const available = await checkUsernameAvailability(username);
          setUsernameAvailable(available);
        } catch (err) {
          console.error('Error checking username:', err);
        } finally {
          setCheckingUsername(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsernameAvailable(null);
    }
  }, [username, authMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        // Validation for signup
        if (password !== confirmPassword) {
          throw new Error('Password dan konfirmasi password tidak cocok');
        }
        
        if (password.length < 6) {
          throw new Error('Password minimal 6 karakter');
        }
        
        if (!fullName.trim()) {
          throw new Error('Nama lengkap harus diisi');
        }
        
        if (username.length < 3) {
          throw new Error('Username minimal 3 karakter');
        }
        
        if (!usernameAvailable) {
          throw new Error('Username sudah digunakan');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: username
            }
          }
        });
        
        if (error) throw error;
        
        // Create user profile immediately after signup
        if (data.user) {
          // Create user profile
          await supabase.from('user_profiles').upsert({
            user_id: data.user.id,
            full_name: fullName,
            username: username
          });
          
          setSuccess('Akun berhasil dibuat! Silakan masuk dengan email dan password Anda.');
          setAuthMode('signin');
          // Reset form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFullName('');
          setUsername('');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setError('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Authentication failed');
      }
      setError(err instanceof Error ? err.message : 'Gagal mengirim ulang kode');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const getPageColors = () => {
    switch (currentPage) {
      case 'php':
        return {
          primary: 'purple',
          primaryButton: 'bg-purple-500 hover:bg-purple-600',
          secondaryButton: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30',
          textButton: 'text-purple-300 hover:text-purple-200',
          border: 'border-purple-500/30',
          gradient: 'from-gray-900 via-purple-900 to-blue-900',
          cardGradient: 'from-gray-800/90 to-gray-900/90'
        };
      case 'html-css':
        return {
          primary: 'orange',
          primaryButton: 'bg-orange-500 hover:bg-orange-600',
          secondaryButton: 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30',
          textButton: 'text-orange-300 hover:text-orange-200',
          border: 'border-orange-500/30',
          gradient: 'from-gray-900 via-orange-900 to-red-900',
          cardGradient: 'from-gray-800/90 to-gray-900/90'
        };
      case 'react':
        return {
          primary: 'cyan',
          primaryButton: 'bg-cyan-500 hover:bg-cyan-600',
          secondaryButton: 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30',
          textButton: 'text-cyan-300 hover:text-cyan-200',
          border: 'border-cyan-500/30',
          gradient: 'from-gray-900 via-cyan-900 to-blue-900',
          cardGradient: 'from-gray-800/90 to-gray-900/90'
        };
    }
  };

  const colors = getPageColors();

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center p-4`}>
        <div className={`bg-gradient-to-br ${colors.cardGradient} backdrop-blur-sm rounded-2xl border ${colors.border} p-8 max-w-md w-full`}>
          <div className="text-center mb-8">
            <div className={`p-4 bg-${colors.primary}-500/20 rounded-full inline-block mb-4`}>
              {authMode === 'signin' ? (
                <LogIn className={`text-${colors.primary}-300`} size={32} />
              ) : authMode === 'signup' ? (
                <UserPlus className={`text-${colors.primary}-300`} size={32} />
              ) : (
                <Shield className={`text-${colors.primary}-300`} size={32} />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {authMode === 'signin' ? 'Masuk' : authMode === 'signup' ? 'Daftar' : 'Verifikasi Email'}
            </h1>
            <p className="text-gray-300">
              {authMode === 'signin' 
                ? 'Selamat datang kembali! Silakan masuk untuk melanjutkan.' 
                : authMode === 'signup'
                ? 'Buat akun untuk melacak progress belajar Anda.'
                : 'Masukkan kode verifikasi yang telah dikirim ke email Anda.'
              }
            </p>
          </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                       className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${colors.border} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-${colors.primary}-400 transition-colors`}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className={`w-full pl-10 pr-10 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                          username.length >= 3 
                            ? usernameAvailable === true 
                              ? 'border-green-500/50 focus:border-green-400' 
                              : usernameAvailable === false 
                              ? 'border-red-500/50 focus:border-red-400'
                             : `${colors.border} focus:border-${colors.primary}-400`
                           : `${colors.border} focus:border-${colors.primary}-400`
                        }`}
                        placeholder="username"
                        minLength={3}
                        required
                      />
                      {username.length >= 3 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {checkingUsername ? (
                            <div className={`w-4 h-4 border-2 border-${colors.primary}-400 border-t-transparent rounded-full animate-spin`}></div>
                          ) : usernameAvailable === true ? (
                            <CheckCircle className="text-green-400" size={18} />
                          ) : usernameAvailable === false ? (
                            <X className="text-red-400" size={18} />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {username.length >= 3 && usernameAvailable === false && (
                      <p className="text-red-400 text-xs mt-1">Username sudah digunakan</p>
                    )}
                    {username.length >= 3 && usernameAvailable === true && (
                      <p className="text-green-400 text-xs mt-1">Username tersedia</p>
                    )}
                  </div>
                </>
              )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${colors.border} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-${colors.primary}-400 transition-colors`}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border ${colors.border} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-${colors.primary}-400 transition-colors`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border ${colors.border} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-${colors.primary}-400 transition-colors`}
                    placeholder="Konfirmasi password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Password tidak cocok</p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || (authMode === 'signup' && (!usernameAvailable || password !== confirmPassword))}
              className={`w-full py-3 ${colors.primaryButton} disabled:bg-${colors.primary}-500/50 text-white rounded-lg font-medium transition-colors`}
            >
              {authLoading ? 'Loading...' : (authMode === 'signin' ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setSuccess(null);
              }}
             className={`${colors.textButton} text-sm transition-colors`}
            >
              {authMode === 'signin' 
                ? "Belum punya akun? Daftar sekarang" 
                : "Sudah punya akun? Masuk di sini"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* User profile button */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={() => setShowProfile(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${colors.primaryButton} text-white shadow-lg backdrop-blur-sm`}
        >
          <UserIcon size={16} />
          <span className="text-sm">Profile</span>
        </button>
      </div>
      
      {/* Profile Modal */}
      {showProfile && (
        <ProfilePage
          user={user}
          currentPage={currentPage}
          onClose={() => setShowProfile(false)}
        />
      )}
      
      {children}
    </div>
  );
};