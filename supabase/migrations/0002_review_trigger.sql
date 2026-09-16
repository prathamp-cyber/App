-- ============================================================================
-- MIGRATION: 0002_review_trigger.sql
-- PROJECT: Dwellist (Interior Designers & Architects Discovery Platform)
-- DESCRIPTION: Automatic calculation of designer ratings and review counts via
--              PostgreSQL trigger.
-- ============================================================================

/*
  DESIGN DECISION / TRIGGER EXPLANATION:
  We pick the Postgres trigger approach because triggers execute atomically inside 
  PostgreSQL whenever a review is inserted, updated, or deleted. This guarantees 
  consistent average rating and review count calculations across all clients (iOS, 
  Android, Web, API) without extra client-side database roundtrips, race conditions, 
  or calculation drift between multiple users submitting reviews simultaneously.
*/

-- Function to recalculate average rating and total review count for a designer
CREATE OR REPLACE FUNCTION public.update_designer_rating_on_review()
RETURNS TRIGGER AS $$
DECLARE
  target_designer_id UUID;
  new_rating NUMERIC(3,2);
  new_count INT;
BEGIN
  -- Identify target designer_id (handles INSERT, UPDATE, and DELETE operations)
  IF (TG_OP = 'DELETE') THEN
    target_designer_id := OLD.designer_id;
  ELSE
    target_designer_id := NEW.designer_id;
  END IF;

  -- Compute new average rating and total review count for the target designer
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 2), 5.00),
    COUNT(id)
  INTO new_rating, new_count
  FROM public.reviews
  WHERE designer_id = target_designer_id;

  -- Update public.designers aggregate fields
  UPDATE public.designers
  SET 
    rating = new_rating,
    google_review_count = new_count
  WHERE id = target_designer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger firing after INSERT, UPDATE, or DELETE on public.reviews
DROP TRIGGER IF EXISTS trigger_update_designer_rating ON public.reviews;
CREATE TRIGGER trigger_update_designer_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_designer_rating_on_review();
