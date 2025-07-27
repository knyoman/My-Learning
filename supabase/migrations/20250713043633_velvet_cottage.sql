/*
  # Remove Email Verification System

  1. Changes
    - Remove email_verified column from user_profiles table
    - Drop email_verifications table
    - Drop related triggers and functions

  2. Security
    - Maintain existing RLS policies for user_profiles
*/

-- Remove email_verified column from user_profiles
ALTER TABLE user_profiles DROP COLUMN IF EXISTS email_verified;

-- Drop email_verifications table if it exists
DROP TABLE IF EXISTS email_verifications;

-- Drop related trigger functions if they exist
DROP FUNCTION IF EXISTS update_email_verifications_updated_at();