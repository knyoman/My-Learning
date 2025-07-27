/*
  # Add Social Links to User Profiles

  1. Changes
    - Add `github_url` column to `user_profiles` table
    - Add `instagram_url` column to `user_profiles` table  
    - Add `linkedin_url` column to `user_profiles` table

  2. Security
    - No changes to existing RLS policies needed
    - New columns inherit existing security rules
*/

-- Add social media URL columns to user_profiles table
DO $$
BEGIN
  -- Add github_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'github_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN github_url text DEFAULT '';
  END IF;

  -- Add instagram_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN instagram_url text DEFAULT '';
  END IF;

  -- Add linkedin_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN linkedin_url text DEFAULT '';
  END IF;
END $$;