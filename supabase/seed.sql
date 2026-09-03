-- ============================================================================
-- SEED DATA: seed.sql
-- PROJECT: Dwellist
-- DESCRIPTION: Sample seed data for testing and populating interior designers
--              and architects across Gandhidham and Ahmedabad.
-- ============================================================================

-- Clear existing data (optional during reset)
TRUNCATE public.reviews, public.inquiries, public.saved_designers, public.designers CASCADE;

-- Insert 7 Realistic Sample Designers (3 Gandhidham, 4 Ahmedabad)
INSERT INTO public.designers (
  id,
  name,
  firm,
  area,
  city,
  address,
  rating,
  google_review_count,
  experience,
  completed_projects,
  specialties,
  avatar,
  cover_image,
  portfolio,
  description,
  contact_number,
  email,
  response_time,
  survey_metrics
) VALUES
-- ----------------------------------------------------------------------------
-- DESIGNER 1: Gandhidham
-- ----------------------------------------------------------------------------
(
  '11111111-1111-1111-1111-111111111111',
  'Rajesh Varma',
  'Varma & Associates Design Studio',
  'Tagore Road',
  'Gandhidham',
  'Plot 42, Near Oslo Circle, Tagore Road, Gandhidham, Kutch 370201',
  4.95,
  48,
  12,
  110,
  ARRAY['Residential Luxury', 'Commercial Spaces', 'Vastu Compliant Interiors'],
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'
  ],
  'Varma & Associates specializes in modern luxury residential bungalows and premium commercial office interiors across Kutch. We focus on natural lighting, space optimization, and sustainable materials.',
  '+91 98250 12345',
  'contact@varmadesign.in',
  'Within 2 hours',
  '{"communication": 4.9, "versatility": 4.8, "timeliness": 5.0, "professionalism": 5.0}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 2: Gandhidham
-- ----------------------------------------------------------------------------
(
  '22222222-2222-2222-2222-222222222222',
  'Pooja Kothari',
  'Kothari Design Atelier',
  'Sector 1-A',
  'Gandhidham',
  'Shop 14, Commercial Complex, Sector 1-A, Gandhidham, Kutch 370201',
  4.88,
  36,
  8,
  75,
  ARRAY['Minimalist Apartments', 'Kitchen & Modular Systems', 'Renovation Specialist'],
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop'
  ],
  'At Kothari Design Atelier, we transform compact apartments and homes into aesthetic, functional sanctuaries using modular German hardware, warm color palettes, and smart storage.',
  '+91 94260 54321',
  'pooja@kothariatelier.com',
  'Within 4 hours',
  '{"communication": 5.0, "versatility": 4.7, "timeliness": 4.8, "professionalism": 4.9}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 3: Gandhidham
-- ----------------------------------------------------------------------------
(
  '33333333-3333-3333-3333-333333333333',
  'Harish Patel',
  'Patel Architecture & Interior Lab',
  'GIDC Area',
  'Gandhidham',
  'Plot 105, GIDC Industrial Estate, Near Airport Road, Gandhidham 370201',
  4.75,
  24,
  15,
  160,
  ARRAY['Industrial Design', 'Corporate Offices', 'Showroom Interiors'],
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop'
  ],
  'Harish Patel brings 15+ years of architectural excellence in large scale corporate hubs, warehouses turned chic workspaces, and high-end automotive showrooms in Gandhidham.',
  '+91 98980 99887',
  'info@patelab.in',
  'Within 24 hours',
  '{"communication": 4.6, "versatility": 4.9, "timeliness": 4.6, "professionalism": 4.8}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 4: Ahmedabad
-- ----------------------------------------------------------------------------
(
  '44444444-4444-4444-4444-444444444444',
  'Aarav Mehta & Neha Shah',
  'Urban Living Studio',
  'SG Highway',
  'Ahmedabad',
  '802 Titanium Heights, Opposite Karnavati Club, SG Highway, Ahmedabad 380015',
  4.98,
  112,
  10,
  140,
  ARRAY['Luxury Penthouse', 'Contemporary Villas', 'Lighting Architecture'],
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=800&auto=format&fit=crop'
  ],
  'Urban Living Studio is an award-winning interior architecture firm on SG Highway, famous for opulent 4BHK apartments, farmhouses, and bespoke Italian furniture integrations.',
  '+91 99090 11223',
  'hello@urbanlivingstudio.com',
  'Within 1 hour',
  '{"communication": 5.0, "versatility": 5.0, "timeliness": 4.9, "professionalism": 5.0}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 5: Ahmedabad
-- ----------------------------------------------------------------------------
(
  '55555555-5555-5555-5555-555555555555',
  'Kavita Joshi',
  'Joshi Design Concepts',
  'Bodakdev',
  'Ahmedabad',
  '304 Dev Arc Commercial Complex, Iscon Cross Road, Bodakdev, Ahmedabad 380054',
  4.82,
  59,
  7,
  62,
  ARRAY['Boho Chic Interiors', 'Cafes & Restaurants', 'Eco-Friendly Materials'],
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'
  ],
  'Kavita Joshi specializes in warm, organic, and earth-conscious interior aesthetics. Known for designing vibrant cafes in Bodakdev and cozy homes across Ahmedabad.',
  '+91 97270 33445',
  'kavita@joshiconcepts.in',
  'Within 3 hours',
  '{"communication": 4.8, "versatility": 4.9, "timeliness": 4.7, "professionalism": 4.9}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 6: Ahmedabad
-- ----------------------------------------------------------------------------
(
  '66666666-6666-6666-6666-666666666666',
  'Sanjay Trivedi',
  'Trivedi Architectural Group',
  'Prahlad Nagar',
  'Ahmedabad',
  'A-501 West Gate, Near YMCA Club, Prahlad Nagar, Ahmedabad 380015',
  4.91,
  88,
  18,
  210,
  ARRAY['Classical Architectural Fusion', 'Heritage Restoration', 'Corporate Towers'],
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop'
  ],
  'With nearly two decades of experience, Trivedi Architectural Group creates timeless spaces blending Gujarati craftsmanship with sleek modern functionalism.',
  '+91 98240 66778',
  'sanjay@trivedigroup.co.in',
  'Within 12 hours',
  '{"communication": 4.9, "versatility": 4.8, "timeliness": 5.0, "professionalism": 5.0}'::jsonb
),

-- ----------------------------------------------------------------------------
-- DESIGNER 7: Ahmedabad
-- ----------------------------------------------------------------------------
(
  '77777777-7777-7777-7777-777777777777',
  'Rohan Desai',
  'Studio Craft Ahmedabad',
  'Navrangpura',
  'Ahmedabad',
  '12 Sampatrao Colony, CG Road, Navrangpura, Ahmedabad 380009',
  4.79,
  41,
  6,
  48,
  ARRAY['3D Visualization & Virtual Tours', 'Smart Home Integration', 'Compact Urban Living'],
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop'
  ],
  'Studio Craft leverages state-of-the-art 3D rendering and VR walkthroughs before building, helping clients visualize every accent lighting choice and custom cabinet finish.',
  '+91 98790 44332',
  'rohan@studiocraft.in',
  'Within 2 hours',
  '{"communication": 4.7, "versatility": 5.0, "timeliness": 4.6, "professionalism": 4.8}'::jsonb
);

-- Insert Sample Reviews for testing
INSERT INTO public.reviews (
  designer_id,
  user_name,
  rating,
  comment
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Vikram Thapar',
  5,
  'Rajesh and his team did an outstanding job designing our 4BHK villa near Oslo Circle in Gandhidham. The lighting plan and wood paneling are magnificent!'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Ananya Shah',
  5,
  'Very professional and highly punctual. Delivered the project right on time before Diwali.'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Dhruv Patel',
  5,
  'Urban Living Studio transformed our apartment on SG Highway into a luxury penthouse feel. Truly world-class quality!'
),
(
  '55555555-5555-5555-5555-555555555555',
  'Meera Solanki',
  5,
  'Love the eco-friendly materials and warm boho aesthetic Kavita curated for our boutique cafe.'
);
