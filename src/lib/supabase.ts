import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Project {
  id: number;
  title: string;
  description: string;
  stage: number;
  stage_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  project_type: 'php' | 'html-css' | 'react';
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  project_id: number;
  project_type: 'php' | 'html-css' | 'react';
  is_completed: boolean;
  completed_at: string | null;
  notes: string;
  github_link: string;
  learning_link: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}


export const checkUsernameAvailability = async (username: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('username', username)
    .limit(1);

  if (error) throw error;

  // If no data returned, username is available
  return data.length === 0;
};