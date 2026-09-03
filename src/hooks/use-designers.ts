import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Designer } from '../types/designer';
import { MOCK_DESIGNERS } from '../constants/mockData';

export interface DesignerFilters {
  city?: string;
  area?: string;
  search?: string;
  minRating?: number;
  minExperience?: number;
  page?: number;
  pageSize?: number;
}

export const mapDbDesignerToDesigner = (db: any): Designer => ({
  id: db.id,
  name: db.name || '',
  firm: db.firm || '',
  area: db.area || '',
  city: (db.city as 'Gandhidham' | 'Ahmedabad') || 'Gandhidham',
  address: db.address || '',
  rating: typeof db.rating === 'number' ? db.rating : parseFloat(db.rating) || 5.0,
  googleReviewCount: db.google_review_count || 0,
  experience: db.experience || 0,
  completedProjects: db.completed_projects || 0,
  specialties: Array.isArray(db.specialties) ? db.specialties : [],
  avatar: db.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  coverImage: db.cover_image || db.avatar || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  portfolio: Array.isArray(db.portfolio) ? db.portfolio : [],
  description: db.description || '',
  contactNumber: db.contact_number || '',
  email: db.email || '',
  responseTime: db.response_time || 'Within 24 hours',
  surveyMetrics: db.survey_metrics || {
    communication: 5.0,
    versatility: 5.0,
    timeliness: 5.0,
    professionalism: 5.0,
  },
  reviews: [],
});

export function useDesigners(filters: DesignerFilters = {}) {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDesigners = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('designers').select('*', { count: 'exact' });

      // Apply Filter: City
      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      // Apply Filter: Area
      if (filters.area && filters.area !== 'All Areas') {
        query = query.eq('area', filters.area);
      }

      // Apply Filter: Search Query (Firm Name or Designer Name)
      if (filters.search && filters.search.trim() !== '') {
        const s = `%${filters.search.trim()}%`;
        query = query.or(`firm.ilike.${s},name.ilike.${s}`);
      }

      // Apply Filter: Minimum Rating
      if (filters.minRating !== undefined && filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }

      // Apply Filter: Minimum Experience
      if (filters.minExperience !== undefined && filters.minExperience > 0) {
        query = query.gte('experience', filters.minExperience);
      }

      // Pagination
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 50;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to).order('rating', { ascending: false });

      const { data, count, error: fetchError } = await query;

      if (fetchError) {
        console.warn('Supabase query warning, falling back to mock dataset:', fetchError.message);
        // Fallback to mock data if database table is empty or error occurs
        let fallback = MOCK_DESIGNERS;
        if (filters.city) {
          fallback = fallback.filter((d) => d.city === filters.city);
        }
        if (filters.area && filters.area !== 'All Areas') {
          fallback = fallback.filter((d) => d.area === filters.area);
        }
        if (filters.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          fallback = fallback.filter(
            (d) =>
              d.firm.toLowerCase().includes(q) ||
              d.name.toLowerCase().includes(q) ||
              d.specialties.some((s) => s.toLowerCase().includes(q))
          );
        }
        setDesigners(fallback);
        setTotalCount(fallback.length);
      } else if (data && data.length > 0) {
        setDesigners(data.map(mapDbDesignerToDesigner));
        setTotalCount(count || data.length);
      } else {
        // Handle empty table gracefully with mock fallback for preview
        let fallback = MOCK_DESIGNERS;
        if (filters.city) {
          fallback = fallback.filter((d) => d.city === filters.city);
        }
        if (filters.area && filters.area !== 'All Areas') {
          fallback = fallback.filter((d) => d.area === filters.area);
        }
        if (filters.search && filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          fallback = fallback.filter(
            (d) =>
              d.firm.toLowerCase().includes(q) ||
              d.name.toLowerCase().includes(q) ||
              d.specialties.some((s) => s.toLowerCase().includes(q))
          );
        }
        setDesigners(fallback);
        setTotalCount(fallback.length);
      }
    } catch (err: any) {
      console.error('Error in useDesigners:', err);
      setError(err.message || 'Failed to fetch interior designers.');
    } finally {
      setLoading(false);
    }
  }, [
    filters.city,
    filters.area,
    filters.search,
    filters.minRating,
    filters.minExperience,
    filters.page,
    filters.pageSize,
  ]);

  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  return {
    designers,
    loading,
    error,
    totalCount,
    refetch: fetchDesigners,
  };
}
