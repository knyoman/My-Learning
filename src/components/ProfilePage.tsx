import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { 
  User as UserIcon, 
  Camera, 
  Save, 
  LogOut, 
  Mail, 
  Calendar,
  Edit3,
  Upload,
  X,
  Globe,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Sparkles,
  Shield,
  Award,
  Zap,
  Code
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  github_url: string;
  instagram_url: string;
  linkedin_url: string;
  created_at: string;
  updated_at: string;
}

interface ProfilePageProps {
  user: User;
  currentPage: 'php' | 'html-css' | 'react';
  onClose: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentPage, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    username: '',
    github_url: '',
    instagram_url: '',
    linkedin_url: ''
  });

  const getPageColors = () => {
    switch (currentPage) {
      case 'php':
        return {
          primary: 'purple',
          secondary: 'blue',
          gradient: 'from-slate-900/98 via-purple-900/95 to-indigo-900/98',
          heroGradient: 'from-purple-600/80 via-indigo-600/60 to-blue-600/80',
          cardGradient: 'from-slate-900/80 via-purple-900/60 to-indigo-900/80',
          border: 'border-purple-400/20',
          button: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
          accent: 'text-purple-300',
          accentBg: 'bg-purple-500/10',
          ring: 'ring-purple-400/30',
          glow: 'shadow-purple-500/20'
        };
      case 'html-css':
        return {
          primary: 'orange',
          secondary: 'red',
          gradient: 'from-slate-900/98 via-orange-900/95 to-red-900/98',
          heroGradient: 'from-orange-600/80 via-red-600/60 to-pink-600/80',
          cardGradient: 'from-slate-900/80 via-orange-900/60 to-red-900/80',
          border: 'border-orange-400/20',
          button: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
          accent: 'text-orange-300',
          accentBg: 'bg-orange-500/10',
          ring: 'ring-orange-400/30',
          glow: 'shadow-orange-500/20'
        };
      case 'react':
        return {
          primary: 'cyan',
          secondary: 'blue',
          gradient: 'from-slate-900/98 via-cyan-900/95 to-blue-900/98',
          heroGradient: 'from-cyan-600/80 via-blue-600/60 to-indigo-600/80',
          cardGradient: 'from-slate-900/80 via-cyan-900/60 to-blue-900/80',
          border: 'border-cyan-400/20',
          button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
          accent: 'text-cyan-300',
          accentBg: 'bg-cyan-500/10',
          ring: 'ring-cyan-400/30',
          glow: 'shadow-cyan-500/20'
        };
    }
  };

  const colors = getPageColors();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          username: data.username || '',
          github_url: data.github_url || '',
          instagram_url: data.instagram_url || '',
          linkedin_url: data.linkedin_url || ''
        });
      } else {
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: '',
          username: '',
          bio: '',
          github_url: '',
          instagram_url: '',
          linkedin_url: ''
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          github_url: formData.github_url,
          instagram_url: formData.instagram_url,
          linkedin_url: formData.linkedin_url
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const openSocialLink = (url: string) => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className={`w-16 h-16 border-4 border-t-transparent ${colors.border} rounded-full animate-spin`}></div>
            <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent border-t-current ${colors.accent} rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <div className="text-white text-xl font-semibold mb-2">Loading Profile</div>
            <div className={`${colors.accent} text-sm`}>Preparing your space...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {/* Futuristic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Geometric Shapes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-20 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {i % 3 === 0 && (
              <div className={`w-4 h-4 border border-current ${colors.accent} transform rotate-45`}></div>
            )}
            {i % 3 === 1 && (
              <div className={`w-3 h-3 ${colors.accentBg} rounded-full`}></div>
            )}
            {i % 3 === 2 && (
              <div className={`w-6 h-6 border border-current ${colors.accent} rounded-full`}></div>
            )}
          </div>
        ))}

        {/* Scanning Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-current ${colors.accent} to-transparent animate-scan opacity-30`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-current ${colors.accent} to-transparent animate-scan opacity-30`} style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className={`relative bg-gradient-to-br ${colors.cardGradient} backdrop-blur-2xl rounded-3xl border ${colors.border} shadow-2xl ${colors.glow} max-w-6xl w-full h-[90vh] overflow-hidden`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Custom Scrollbar Container */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          
          {/* Profile Header Section - Redesigned */}
          <div className="pt-16 pb-8 px-8">
            {/* Profile Avatar - Centered at top */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-300 group-hover:scale-105 ${colors.glow}`}>
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colors.heroGradient}`}>
                      <UserIcon className="text-white/80" size={48} />
                    </div>
                  )}
                </div>
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center text-white">
                    {uploading ? (
                      <div className="animate-spin">
                        <Upload size={24} />
                      </div>
                    ) : (
                      <Camera size={24} />
                    )}
                    <span className="text-xs mt-1 font-medium">
                      {uploading ? 'Uploading...' : 'Change'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {profile?.full_name || 'Your Name'}
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-gray-400">@</span>
                <span className={`${colors.accent} font-medium`}>{profile?.username || 'username'}</span>
              </div>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                {profile?.bio || 'Add a bio to tell others about your coding journey'}
              </p>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`flex items-center gap-2 px-6 py-3 ${colors.button} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${colors.glow}`}
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-red-500/30 backdrop-blur-sm"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className={`flex items-center gap-2 px-6 py-3 ${colors.button} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${colors.glow} disabled:opacity-50 disabled:hover:scale-100`}
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: profile?.full_name || '',
                          bio: profile?.bio || '',
                          username: profile?.username || '',
                          github_url: profile?.github_url || '',
                          instagram_url: profile?.instagram_url || '',
                          linkedin_url: profile?.linkedin_url || ''
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-gray-500/30 backdrop-blur-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Personal Information Card */}
              <div className={`bg-gradient-to-br ${colors.cardGradient} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 ${colors.accentBg} rounded-xl`}>
                    <UserIcon className={colors.accent} size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Personal Info</h3>
                    <p className="text-gray-400 text-sm">Your basic information</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all backdrop-blur-sm`}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl text-white backdrop-blur-sm">
                        {profile?.full_name || 'Not set'}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all backdrop-blur-sm`}
                        placeholder="Enter your username"
                      />
                    ) : (
                      <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl text-white backdrop-blur-sm">
                        @{profile?.username || 'Not set'}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all h-24 resize-none backdrop-blur-sm`}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl text-white min-h-[96px] backdrop-blur-sm">
                        {profile?.bio || 'No bio added'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account & Social Links Card */}
              <div className="space-y-6">
                {/* Account Information */}
                <div className={`bg-gradient-to-br ${colors.cardGradient} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 ${colors.accentBg} rounded-xl`}>
                      <Shield className={colors.accent} size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Account</h3>
                      <p className="text-gray-400 text-sm">Your account details</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        Email Address
                      </label>
                      <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl text-gray-300 backdrop-blur-sm">
                        {user.email}
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        Member Since
                      </label>
                      <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl text-gray-300 backdrop-blur-sm">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className={`bg-gradient-to-br ${colors.cardGradient} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 ${colors.accentBg} rounded-xl`}>
                      <Globe className={colors.accent} size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Social Links</h3>
                      <p className="text-gray-400 text-sm">Connect with others</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* GitHub */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Github size={14} />
                        GitHub
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.github_url}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all backdrop-blur-sm`}
                          placeholder="https://github.com/username"
                        />
                      ) : (
                        <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl backdrop-blur-sm">
                          {profile?.github_url ? (
                            <button
                              onClick={() => openSocialLink(profile.github_url)}
                              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group w-full text-left"
                            >
                              <Github size={16} />
                              <span className="flex-1 truncate text-sm">{profile.github_url}</span>
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">Not set</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Linkedin size={14} />
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                          className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all backdrop-blur-sm`}
                          placeholder="https://linkedin.com/in/username"
                        />
                      ) : (
                        <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl backdrop-blur-sm">
                          {profile?.linkedin_url ? (
                            <button
                              onClick={() => openSocialLink(profile.linkedin_url)}
                              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group w-full text-left"
                            >
                              <Linkedin size={16} />
                              <span className="flex-1 truncate text-sm">{profile.linkedin_url}</span>
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">Not set</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Instagram size={14} />
                        Instagram
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={formData.instagram_url}
                          onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                          className={`w-full p-3 bg-black/20 border ${colors.border} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colors.primary}-400 transition-all backdrop-blur-sm`}
                          placeholder="https://instagram.com/username"
                        />
                      ) : (
                        <div className="w-full p-3 bg-black/10 border border-gray-600/20 rounded-xl backdrop-blur-sm">
                          {profile?.instagram_url ? (
                            <button
                              onClick={() => openSocialLink(profile.instagram_url)}
                              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group w-full text-left"
                            >
                              <Instagram size={16} />
                              <span className="flex-1 truncate text-sm">{profile.instagram_url}</span>
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">Not set</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Section */}
            <div className={`mt-8 bg-gradient-to-br ${colors.cardGradient} backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl max-w-6xl mx-auto transition-all duration-300 hover:scale-[1.01]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 ${colors.accentBg} rounded-xl`}>
                  <Award className={colors.accent} size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Achievements</h3>
                  <p className="text-gray-400 text-sm">Your coding milestones</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-gray-600/20 hover:bg-black/20 transition-all">
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="text-white font-semibold">Getting Started</div>
                  <div className="text-gray-400 text-xs">Created your profile</div>
                </div>
                <div className="text-center p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-gray-600/20 hover:bg-black/20 transition-all">
                  <div className="text-3xl mb-2">💻</div>
                  <div className="text-white font-semibold">Code Explorer</div>
                  <div className="text-gray-400 text-xs">Started your journey</div>
                </div>
                <div className="text-center p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-gray-600/20 hover:bg-black/20 transition-all">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-white font-semibold">Future Master</div>
                  <div className="text-gray-400 text-xs">Keep learning!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};