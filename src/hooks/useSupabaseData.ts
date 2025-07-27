import { useState, useEffect } from 'react';
import { supabase, Project, UserProgress } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useSupabaseData(projectType: 'php' | 'html-css' | 'react') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('project_type', projectType)
          .order('id');

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      }
    };

    fetchProjects();
  }, [projectType]);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setUserProgress([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('project_type', projectType);

        if (error) throw error;
        setUserProgress(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user progress');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [user, projectType]);

  // Update or create user progress
  const updateProgress = async (
    projectId: number,
    updates: Partial<Omit<UserProgress, 'id' | 'user_id' | 'project_id' | 'project_type' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const existingProgress = userProgress.find(p => p.project_id === projectId);

      if (existingProgress) {
        // Update existing progress
        const { data, error } = await supabase
          .from('user_progress')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) throw error;

        setUserProgress(prev => 
          prev.map(p => p.id === existingProgress.id ? data : p)
        );
      } else {
        // Create new progress
        const { data, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            project_id: projectId,
            project_type: projectType,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        setUserProgress(prev => [...prev, data]);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  // Toggle completion status
  const toggleCompletion = async (projectId: number) => {
    const existingProgress = userProgress.find(p => p.project_id === projectId);
    const isCompleted = existingProgress?.is_completed || false;

    await updateProgress(projectId, {
      is_completed: !isCompleted,
      completed_at: !isCompleted ? new Date().toISOString() : null
    });
  };

  // Update notes
  const updateNotes = async (projectId: number, notes: string) => {
    await updateProgress(projectId, { notes });
  };

  // Update links
  const updateLinks = async (projectId: number, githubLink: string, learningLink: string) => {
    await updateProgress(projectId, {
      github_link: githubLink,
      learning_link: learningLink
    });
  };

  // Get completed project IDs
  const completedProjectIds = userProgress
    .filter(p => p.is_completed)
    .map(p => p.project_id);

  // Get progress by project ID
  const getProgressByProjectId = (projectId: number) => {
    return userProgress.find(p => p.project_id === projectId);
  };

  return {
    projects,
    userProgress,
    user,
    loading,
    error,
    completedProjectIds,
    getProgressByProjectId,
    toggleCompletion,
    updateNotes,
    updateLinks,
    updateProgress
  };
}