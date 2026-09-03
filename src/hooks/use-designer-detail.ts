import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Designer, Review } from '../types/designer';
import { mapDbDesignerToDesigner } from './use-designers';
import { MOCK_DESIGNERS } from '../constants/mockData';

export function useDesignerDetail(designerId: string | null) {
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDesignerDetail = useCallback(async () => {
    if (!designerId) {
      setDesigner(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch designer row from database
      const { data: dbDesigner, error: designerErr } = await supabase
        .from('designers')
        .select('*')
        .eq('id', designerId)
        .maybeSingle();

      // 2. Fetch reviews associated with this designer
      const { data: dbReviews, error: reviewsErr } = await supabase
        .from('reviews')
        .select('*')
        .eq('designer_id', designerId)
        .order('created_at', { ascending: false });

      if (dbDesigner) {
        const mappedDesigner = mapDbDesignerToDesigner(dbDesigner);
        if (dbReviews && dbReviews.length > 0) {
          mappedDesigner.reviews = dbReviews.map((r: any): Review => ({
            id: r.id,
            userName: r.user_name || 'Verified Client',
            rating: r.rating || 5,
            comment: r.comment || '',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
          }));
        }
        setDesigner(mappedDesigner);
      } else {
        // Fallback to MOCK_DESIGNERS if designer ID is from mock set
        const mockMatch = MOCK_DESIGNERS.find((d) => d.id === designerId);
        setDesigner(mockMatch || null);
      }
    } catch (err: any) {
      console.error('Error fetching designer details:', err);
      setError(err.message || 'Failed to load designer details.');
      const mockMatch = MOCK_DESIGNERS.find((d) => d.id === designerId);
      setDesigner(mockMatch || null);
    } finally {
      setLoading(false);
    }
  }, [designerId]);

  useEffect(() => {
    fetchDesignerDetail();
  }, [fetchDesignerDetail]);

  return {
    designer,
    loading,
    error,
    refetch: fetchDesignerDetail,
  };
}
