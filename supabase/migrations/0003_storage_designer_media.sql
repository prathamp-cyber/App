-- ============================================================================
-- MIGRATION: 0003_storage_designer_media.sql
-- PROJECT: Dwellist (Interior Designers & Architects Discovery Platform)
-- DESCRIPTION: Storage bucket initialization and user-level RLS policies for 
--              designer media uploads (avatars, cover images, and portfolio).
-- ============================================================================

-- 1. Create designer-media bucket in storage.buckets if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('designer-media', 'designer-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Read Access: Anyone can view uploaded designer media
DROP POLICY IF EXISTS "Public read access for designer-media" ON storage.objects;
CREATE POLICY "Public read access for designer-media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'designer-media');

-- 3. Scoped Upload Access: Designers can only upload to paths starting with their auth UUID
DROP POLICY IF EXISTS "Designers can upload to their own folder" ON storage.objects;
CREATE POLICY "Designers can upload to their own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'designer-media' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Scoped Update Access: Designers can only update files in their own folder
DROP POLICY IF EXISTS "Designers can update files in their own folder" ON storage.objects;
CREATE POLICY "Designers can update files in their own folder"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'designer-media' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Scoped Delete Access: Designers can only delete files in their own folder
DROP POLICY IF EXISTS "Designers can delete files in their own folder" ON storage.objects;
CREATE POLICY "Designers can delete files in their own folder"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'designer-media' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
