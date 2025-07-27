/*
  # Project Tracker Database Schema

  1. New Tables
    - `projects`
      - `id` (integer, primary key)
      - `title` (text)
      - `description` (text)
      - `stage` (integer)
      - `stage_name` (text)
      - `difficulty` (text)
      - `project_type` (text) - 'php', 'html-css', 'react'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `project_id` (integer, references projects)
      - `project_type` (text)
      - `is_completed` (boolean)
      - `completed_at` (timestamp)
      - `notes` (text)
      - `github_link` (text)
      - `learning_link` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id integer PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  stage integer NOT NULL,
  stage_name text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  project_type text NOT NULL CHECK (project_type IN ('php', 'html-css', 'react')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id integer NOT NULL,
  project_type text NOT NULL CHECK (project_type IN ('php', 'html-css', 'react')),
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text DEFAULT '',
  github_link text DEFAULT '',
  learning_link text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id, project_type)
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table (read-only for all authenticated users)
CREATE POLICY "Projects are viewable by authenticated users"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_progress table
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_type_stage ON projects(project_type, stage);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_type ON user_progress(user_id, project_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(user_id, is_completed);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();