-- ============================================================================
-- MIGRATION: 0001_init.sql
-- PROJECT: Dwellist (Interior Designers & Architects Discovery Platform)
-- DESCRIPTION: Initial database schema definition with Row Level Security (RLS)
--              policies for security and user-level authorization.
-- ============================================================================

-- Enable UUID extension for auto-generating unique record identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores profile data for all platform users (Clients, Designers, and Admins).
-- Maps 1-to-1 with Supabase Auth users via the primary key `id`.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'designer', 'admin')),
  phone TEXT,
  avatar TEXT,
  city TEXT DEFAULT 'Gandhidham',
  firm_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. DESIGNERS TABLE
-- Stores directory profiles of interior design firms and architects.
-- Links to a user account via `user_id` when the designer manages their profile.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.designers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL,
  address TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  google_review_count INT DEFAULT 0,
  experience INT DEFAULT 0,
  completed_projects INT DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  avatar TEXT,
  cover_image TEXT,
  portfolio TEXT[] DEFAULT '{}',
  description TEXT,
  contact_number TEXT,
  email TEXT,
  response_time TEXT DEFAULT 'Within 24 hours',
  survey_metrics JSONB DEFAULT '{"communication": 5.0, "versatility": 5.0, "timeliness": 5.0, "professionalism": 5.0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. REVIEWS TABLE
-- Stores client feedback and numerical ratings (1-5 stars) for designers.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. INQUIRIES TABLE
-- Stores project inquiry messages sent by clients to specific designers.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  property_type TEXT,
  budget_range TEXT,
  timeline TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SAVED_DESIGNERS TABLE
-- Connects clients to designers they bookmark for quick access.
-- Composite UNIQUE constraint ensures a user cannot save the same designer twice.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_designers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  designer_id UUID REFERENCES public.designers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_saved_designer UNIQUE (user_id, designer_id)
);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Security logic determining who can view, insert, update, or delete data.
-- ============================================================================

-- Enable RLS on every table to prevent unauthorized direct database access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_designers ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- USERS POLICIES
-- Privacy Rule: Users can view and manage only their own account information.
-- ----------------------------------------------------------------------------

-- Explanation: Allows users to read only their own profile details.
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Explanation: Allows registered users to insert their own profile record upon sign up.
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Explanation: Allows users to update only their own profile fields.
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);


-- ----------------------------------------------------------------------------
-- DESIGNERS POLICIES
-- Public Discovery Rule: Anyone (including unauthenticated visitors) can browse
-- designers, but only the profile owner or an administrator can edit details.
-- ----------------------------------------------------------------------------

-- Explanation: Public access. Anyone can search and view interior designers.
CREATE POLICY "Anyone can view designer profiles"
  ON public.designers
  FOR SELECT
  USING (true);

-- Explanation: Only the designer who owns the profile (user_id = auth.uid()) or an admin can insert a new designer listing.
CREATE POLICY "Designers can insert their own profile"
  ON public.designers
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Explanation: Only the designer profile owner or an admin can update their firm listing.
CREATE POLICY "Designers can update their own profile"
  ON public.designers
  FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- ----------------------------------------------------------------------------
-- REVIEWS POLICIES
-- Social Proof Rule: Reviews are public so prospective clients can read them.
-- Submitting and managing reviews requires authenticating as the author.
-- ----------------------------------------------------------------------------

-- Explanation: Public access. Anyone can read client reviews of designers.
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

-- Explanation: Authenticated users can write a review under their user_id.
CREATE POLICY "Authenticated users can submit reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Explanation: Authors can modify their own reviews, or admins can moderate.
CREATE POLICY "Users can update their own reviews"
  ON public.reviews
  FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Explanation: Authors or admins can remove a review.
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews
  FOR DELETE
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- ----------------------------------------------------------------------------
-- INQUIRIES POLICIES
-- Confidentiality Rule: Project inquiries contain personal contact and budget
-- data. Only the sender (client) and the recipient (designer) can view them.
-- ----------------------------------------------------------------------------

-- Explanation: Senders can view inquiries they submitted. Designers can view inquiries sent to their listing.
CREATE POLICY "Users and recipient designers can view inquiries"
  ON public.inquiries
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM public.designers WHERE id = designer_id)
  );

-- Explanation: Authenticated users can send project inquiries to designers.
CREATE POLICY "Users can submit inquiries"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Explanation: Designers receiving the inquiry or the client can update inquiry status (e.g. mark as contacted).
CREATE POLICY "Relevant users and designers can update inquiry status"
  ON public.inquiries
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM public.designers WHERE id = designer_id)
  );


-- ----------------------------------------------------------------------------
-- SAVED_DESIGNERS POLICIES
-- Personal Bookmarks Rule: Bookmarks are strictly private to each user.
-- ----------------------------------------------------------------------------

-- Explanation: Users can view only their own saved/bookmarked designers.
CREATE POLICY "Users can view their saved designers"
  ON public.saved_designers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Explanation: Users can add designers to their saved collection under their user_id.
CREATE POLICY "Users can save a designer"
  ON public.saved_designers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Explanation: Users can remove designers from their saved collection.
CREATE POLICY "Users can remove a saved designer"
  ON public.saved_designers
  FOR DELETE
  USING (auth.uid() = user_id);
