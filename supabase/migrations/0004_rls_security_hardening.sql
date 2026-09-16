-- ============================================================================
-- MIGRATION: 0004_rls_security_hardening.sql
-- PROJECT: Dwellist (Interior Designers & Architects Discovery Platform)
-- DESCRIPTION: Hardening Row Level Security (RLS) policies for user role assignment,
--              designer profile claiming, and admin management access.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. HARDEN USERS TABLE POLICIES
-- Prevent regular users from self-assigning role = 'admin' on insert or update.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() = id AND 
    (role IS NULL OR role IN ('client', 'designer'))
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role IN ('client', 'designer') OR 
      EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    )
  );


-- ----------------------------------------------------------------------------
-- 2. HARDEN DESIGNERS TABLE POLICIES
-- Allow designers to claim pre-seeded designer profiles where user_id IS NULL 
-- and email matches their authenticated account email.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Designers can update their own profile" ON public.designers;
CREATE POLICY "Designers can update their own profile"
  ON public.designers
  FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND LOWER(email) = LOWER(auth.jwt() ->> 'email')) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- ----------------------------------------------------------------------------
-- 3. HARDEN INQUIRIES TABLE POLICIES
-- Add explicit admin role access to inquiries for site administration.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users and recipient designers can view inquiries" ON public.inquiries;
CREATE POLICY "Users and recipient designers can view inquiries"
  ON public.inquiries
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM public.designers WHERE id = designer_id) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Relevant users and designers can update inquiry status" ON public.inquiries;
CREATE POLICY "Relevant users and designers can update inquiry status"
  ON public.inquiries
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM public.designers WHERE id = designer_id) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
