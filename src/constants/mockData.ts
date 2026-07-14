export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SurveyMetrics {
  communication: number; // out of 5
  versatility: number; // out of 5
  timeliness: number; // out of 5
  professionalism: number; // out of 5
}

export interface Designer {
  id: string;
  name: string;
  firm: string;
  area: string; // Sector 1A, Ward 12/B, etc.
  city: "Gandhidham" | "Ahmedabad";
  address: string;
  rating: number; // Google Review average
  googleReviewCount: number;
  experience: number; // Years of experience
  completedProjects: number;
  specialties: string[];
  avatar: string; // Profile picture URL
  coverImage: string; // Main portfolio cover URL
  portfolio: string[]; // List of gallery images
  description: string;
  contactNumber: string;
  email: string;
  responseTime: string; // e.g. "Same day", "Within 24 hours"
  surveyMetrics: SurveyMetrics;
  reviews: Review[];
}

export const GANDHIDHAM_AREAS = [
  "All Areas",
  "Sector 1A",
  "Sector 8",
  "Ward 12/B",
  "Adipur",
  "Oslo Road",
  "Tagore Road"
];

export const AHMEDABAD_AREAS = [
  "All Areas",
  "Satellite",
  "SG Highway",
  "Bodakdev",
  "Prahlad Nagar",
  "Vastrapur",
  "CG Road"
];

export const MOCK_DESIGNERS: Designer[] = [
  // --- GANDHIDHAM DESIGNERS ---
  {
    id: "1",
    name: "Rajesh Sheth",
    firm: "Designer's Circle",
    area: "Tagore Road",
    city: "Gandhidham",
    address: "302, Sunrise Arcade, Tagore Road, Gandhidham, Gujarat 370201",
    rating: 4.8,
    googleReviewCount: 142,
    experience: 32,
    completedProjects: 850,
    specialties: ["Modern Luxury", "Corporate Offices", "Hospitality", "Residential Bungalows"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Designer's Circle is one of the premier architectural and interior design consulting firms in Kutch. With over three decades of design excellence under Rajesh Sheth, we create luxury environments that perfectly blend functionality with high-end style.",
    contactNumber: "+91 98252 23412",
    email: "info@designerscircle.co.in",
    responseTime: "Same day",
    surveyMetrics: {
      communication: 4.9,
      versatility: 4.8,
      timeliness: 4.7,
      professionalism: 4.9
    },
    reviews: [
      {
        id: "r1_1",
        userName: "Manish Shah",
        rating: 5,
        comment: "Excellent high-end work for my office space on Tagore Road. The attention to detail and material choices are unmatched. Highly professional!",
        date: "2 months ago"
      },
      {
        id: "r1_2",
        userName: "Neha Gidwani",
        rating: 4,
        comment: "Designed our family bungalow in Gandhidham. Premium outcomes, though the timelines extended slightly. The wood and gold finishes are gorgeous.",
        date: "5 months ago"
      }
    ]
  },
  {
    id: "2",
    name: "Ar. Amit Patel",
    firm: "Sthapatya Design Studio",
    area: "Sector 1A",
    city: "Gandhidham",
    address: "Shop 12, Sector 1A, Near Oslo Cinema, Gandhidham, Gujarat 370201",
    rating: 4.7,
    googleReviewCount: 89,
    experience: 15,
    completedProjects: 340,
    specialties: ["Minimalist", "Sustainable Design", "Residential Flats", "Showrooms"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1616486038857-8975b77ea61a?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1616486038857-8975b77ea61a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Sthapatya Design Studio provides contemporary architectural planning and interior design solutions. Led by Amit Patel, the studio focuses on space-saving, modern minimalist designs tailored for urban apartments and retail outlets.",
    contactNumber: "+91 94263 87401",
    email: "amit.patel@sthapatyastudio.com",
    responseTime: "Within 24 hours",
    surveyMetrics: {
      communication: 4.6,
      versatility: 4.5,
      timeliness: 4.8,
      professionalism: 4.7
    },
    reviews: [
      {
        id: "r2_1",
        userName: "Sanjay Thacker",
        rating: 5,
        comment: "Great experience working with Amit. They transformed our 3BHK flat in Sector 1A with a very clean, minimalist, and spacious layout.",
        date: "1 month ago"
      },
      {
        id: "r2_2",
        userName: "Deepa Ramchandani",
        rating: 4.5,
        comment: "Very budget-friendly solutions and modern designs. They stick to the timeline, which is rare in interior projects.",
        date: "3 months ago"
      }
    ]
  },
  {
    id: "3",
    name: "Karan Maheshwari",
    firm: "Kavya Interior",
    area: "Ward 12/B",
    city: "Gandhidham",
    address: "Plot 245, Ward 12/B, Gandhidham, Gujarat 370201",
    rating: 4.6,
    googleReviewCount: 74,
    experience: 12,
    completedProjects: 260,
    specialties: ["Modular Kitchens", "Modern Apartments", "Wardrobes & Custom Furniture"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Kavya Interior is a full-service residential design studio in Ward 12/B. We excel in custom modular furniture, high-end kitchens, and complete home transformations that emphasize comfort and space optimization.",
    contactNumber: "+91 99092 11223",
    email: "contact@kavyainterior.com",
    responseTime: "Within 24 hours",
    surveyMetrics: {
      communication: 4.7,
      versatility: 4.3,
      timeliness: 4.5,
      professionalism: 4.6
    },
    reviews: [
      {
        id: "r3_1",
        userName: "Hardik Vora",
        rating: 4,
        comment: "Kavya Interior designed our modular kitchen. Excellent finish and heavy-duty materials used. Very satisfied with the service.",
        date: "4 months ago"
      },
      {
        id: "r3_2",
        userName: "Pinky Jadeja",
        rating: 5,
        comment: "They handled the complete interior of my apartment in Ward 12/B. Extremely cooperative team and beautiful final output.",
        date: "6 months ago"
      }
    ]
  },
  {
    id: "4",
    name: "Ar. Parth Mehta",
    firm: "Wallcraft Architects & Interiors",
    area: "Oslo Road",
    city: "Gandhidham",
    address: "Second Floor, Metro Plaza, Oslo Road, Gandhidham, Gujarat 370201",
    rating: 4.9,
    googleReviewCount: 110,
    experience: 8,
    completedProjects: 180,
    specialties: ["Industrial Design", "Boutique Cafes", "Contemporary Villas", "Biophilic Interiors"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
    ],
    description: "At Wallcraft, we believe that design should connect people with their environments. Parth Mehta leads a young, dynamic team focusing on fresh, contemporary styles, commercial spaces, and incorporating biophilic green elements into workspaces.",
    contactNumber: "+91 97241 55621",
    email: "parth@wallcraft.in",
    responseTime: "Same day",
    surveyMetrics: {
      communication: 4.9,
      versatility: 4.9,
      timeliness: 4.6,
      professionalism: 4.8
    },
    reviews: [
      {
        id: "r4_1",
        userName: "Aarav Mehta",
        rating: 5,
        comment: "Excellent design choices for our local cafe. The integration of metal, brick walls, and hanging plants is getting great feedback from our clients.",
        date: "3 weeks ago"
      },
      {
        id: "r4_2",
        userName: "Meera Maheshwari",
        rating: 5,
        comment: "They created a contemporary masterpiece for our villa. Absolute professionals with creative designs. Easily the best young team in Gandhidham.",
        date: "2 months ago"
      }
    ]
  },
  {
    id: "5",
    name: "Suresh Patel",
    firm: "Sarvam Interior",
    area: "Ward 12/B",
    city: "Gandhidham",
    address: "Shop 4, Patel Trade Centre, Ward 12/B, Gandhidham, Gujarat 370201",
    rating: 4.5,
    googleReviewCount: 52,
    experience: 18,
    completedProjects: 410,
    specialties: ["Classic Indian", "Wooden Handcrafts", "Pooja Rooms", "Traditional Gujarati Interiors"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Sarvam Interior specializes in integrating traditional Indian aesthetics with modern utility. Led by Suresh Patel, we bring exquisite woodwork, custom-carved screens, and traditional Gujarati patterns into premium residential spaces.",
    contactNumber: "+91 94274 33202",
    email: "sarvam_gd@yahoo.com",
    responseTime: "1-2 days",
    surveyMetrics: {
      communication: 4.4,
      versatility: 4.2,
      timeliness: 4.4,
      professionalism: 4.5
    },
    reviews: [
      {
        id: "r5_1",
        userName: "Gopal Patel",
        rating: 4.5,
        comment: "Excellent wooden carvings and custom swings (jhulas) provided. Best place if you want a classic, warm Indian home styling.",
        date: "8 months ago"
      },
      {
        id: "r5_2",
        userName: "Kiran Bhanushali",
        rating: 4.0,
        comment: "Very beautiful woodwork and pooja mandir designs. Responsive, though sometimes took a few days to coordinate updates.",
        date: "1 year ago"
      }
    ]
  },
  {
    id: "6",
    name: "Ramesh Thawani",
    firm: "Perfect Interior",
    area: "Adipur",
    city: "Gandhidham",
    address: "Main Market, Adipur, Gandhidham, Gujarat 370205",
    rating: 4.3,
    googleReviewCount: 45,
    experience: 7,
    completedProjects: 150,
    specialties: ["Budget Residential", "Office Workstations", "PVC & Gypsum Ceilings"],
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Perfect Interior provides highly functional and budget-optimized interior solutions for homes and small businesses in the Gandhidham-Adipur twin cities. We specialize in ceiling designs, TV units, and office workstation partition systems.",
    contactNumber: "+91 98254 99012",
    email: "perfectinteriors@adipur.com",
    responseTime: "Within 24 hours",
    surveyMetrics: {
      communication: 4.2,
      versatility: 4.0,
      timeliness: 4.6,
      professionalism: 4.3
    },
    reviews: [
      {
        id: "r6_1",
        userName: "Vikram Rathod",
        rating: 5,
        comment: "They did an amazing job with our office workstations. The space utilization is great and the cost was very reasonable.",
        date: "5 months ago"
      },
      {
        id: "r6_2",
        userName: "Aarti Joshi",
        rating: 4,
        comment: "Nice false ceiling work in our living room. Fast completion and minimal dust during installation.",
        date: "7 months ago"
      }
    ]
  },
  {
    id: "7",
    name: "Devendra Chavda",
    firm: "Build And Design",
    area: "Sector 8",
    city: "Gandhidham",
    address: "Block B-45, Sector 8, Gandhidham, Gujarat 370201",
    rating: 4.8,
    googleReviewCount: 95,
    experience: 10,
    completedProjects: 210,
    specialties: ["Modern Luxury", "Smart Home Automation", "Home Theatres", "Duplex Interiors"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558882224-cca166733360?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Build And Design specializes in smart, high-tech interiors. We integrate the latest automated lighting, custom-designed private home theaters, and contemporary space management for duplexes and luxury apartments in Gandhidham.",
    contactNumber: "+91 98980 44321",
    email: "devendra@buildanddesign.co.in",
    responseTime: "Same day",
    surveyMetrics: {
      communication: 4.8,
      versatility: 4.7,
      timeliness: 4.5,
      professionalism: 4.8
    },
    reviews: [
      {
        id: "r7_1",
        userName: "Manoj Ghelani",
        rating: 5,
        comment: "Excellent smart-home automation setup. I can control all lighting and AV systems in my home. Very professional work by Devendra and team.",
        date: "2 months ago"
      },
      {
        id: "r7_2",
        userName: "Rupa Shah",
        rating: 4.5,
        comment: "Our home theatre is the best part of our duplex! Great sound dampening and beautiful seating setup. Highly recommended.",
        date: "4 months ago"
      }
    ]
  },

  // --- AHMEDABAD DESIGNERS ---
  {
    id: "8",
    name: "Snehal Suthar",
    firm: "The Grid Architects",
    area: "Satellite",
    city: "Ahmedabad",
    address: "10, Sunrise Park, Near Vastrapur Lake, Satellite, Ahmedabad, Gujarat 380015",
    rating: 4.9,
    googleReviewCount: 182,
    experience: 22,
    completedProjects: 480,
    specialties: ["Biophilic Design", "Modern Luxury Villa", "Eco-friendly Interiors", "Brutalist Spaces"],
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80"
    ],
    description: "The Grid Architects, led by Snehal and Bhadri Suthar, is internationally acclaimed for integrating biophilic green concepts with modern luxury. We design spaces that elevate the soul and honor sustainability.",
    contactNumber: "+91 79268 53412",
    email: "design@thegridarchitects.com",
    responseTime: "Same day",
    surveyMetrics: {
      communication: 4.9,
      versatility: 4.9,
      timeliness: 4.7,
      professionalism: 4.9
    },
    reviews: [
      {
        id: "r8_1",
        userName: "Anil Kothari",
        rating: 5,
        comment: "Exceptional design that brings nature indoors. The play of natural light, plants, and raw stone textures in my house is amazing.",
        date: "1 month ago"
      },
      {
        id: "r8_2",
        userName: "Richa Patel",
        rating: 5,
        comment: "Absolutely outstanding. True visionaries in sustainable luxury design.",
        date: "3 months ago"
      }
    ]
  },
  {
    id: "9",
    name: "Arpan Shah",
    firm: "Modo Design",
    area: "Bodakdev",
    city: "Ahmedabad",
    address: "A-201, Shivalik Plaza, Bodakdev, Ahmedabad, Gujarat 380054",
    rating: 4.8,
    googleReviewCount: 96,
    experience: 18,
    completedProjects: 310,
    specialties: ["Contemporary Villas", "Minimalist Residential", "Boutique Offices"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Modo Design is a contemporary architecture and interior design firm specializing in custom residential flat designs, private villas, and unique retail outlets. We focus on play of natural light and raw textures.",
    contactNumber: "+91 98240 12345",
    email: "info@mododesign.in",
    responseTime: "Within 24 hours",
    surveyMetrics: {
      communication: 4.8,
      versatility: 4.7,
      timeliness: 4.6,
      professionalism: 4.8
    },
    reviews: [
      {
        id: "r9_1",
        userName: "Jaimin Trivedi",
        rating: 5,
        comment: "Arpan and his team built our villa in Bodakdev. Outstanding concrete finish and minimalist design. Very pleased.",
        date: "2 months ago"
      }
    ]
  },
  {
    id: "10",
    name: "Malvi Gajjar",
    firm: "Malvi Gajjar Architects",
    area: "Satellite",
    city: "Ahmedabad",
    address: "305, Satellite Plaza, Opposite Mansi Tower, Satellite, Ahmedabad, Gujarat 380015",
    rating: 4.7,
    googleReviewCount: 124,
    experience: 20,
    completedProjects: 390,
    specialties: ["Turnkey Home Interiors", "Luxury Living Rooms", "Italian Kitchens"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Malvi Gajjar Architects is a top interior designing studio offering premium turnkey home styling and architectural consulting in Ahmedabad. We translate your lifestyle into high-end, comfortable living environments.",
    contactNumber: "+91 98250 54321",
    email: "design@malvigajjar.com",
    responseTime: "Within 24 hours",
    surveyMetrics: {
      communication: 4.7,
      versatility: 4.6,
      timeliness: 4.5,
      professionalism: 4.7
    },
    reviews: [
      {
        id: "r10_1",
        userName: "Rita Patel",
        rating: 4.5,
        comment: "Excellent design choices for our living room and master bedroom. They managed everything from materials to execution.",
        date: "3 months ago"
      }
    ]
  },
  {
    id: "11",
    name: "Jignesh Patel",
    firm: "Montdor Interior",
    area: "SG Highway",
    city: "Ahmedabad",
    address: "First Floor, Signature Complex, S.G. Highway, Ahmedabad, Gujarat 380054",
    rating: 4.8,
    googleReviewCount: 320,
    experience: 11,
    completedProjects: 1200,
    specialties: ["Custom Modular Wardrobes", "Modern Apartments", "Commercial Showrooms"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    description: "Montdor Interior is a leading turnkey design company on SG Highway. Known for prompt execution and high-quality modular furniture factory finishes, we design ready-to-move-in homes and offices.",
    contactNumber: "+91 79400 98765",
    email: "info@montdorinterior.com",
    responseTime: "Same day",
    surveyMetrics: {
      communication: 4.7,
      versatility: 4.5,
      timeliness: 4.8,
      professionalism: 4.8
    },
    reviews: [
      {
        id: "r11_1",
        userName: "Kamlesh Vyas",
        rating: 5,
        comment: "Fitted our entire apartment with modular wardrobes and kitchen in just 45 days. The factory finish quality is superb.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: "12",
    name: "Himanshu Patel",
    firm: "d6thD Design Studio",
    area: "CG Road",
    city: "Ahmedabad",
    address: "Block C, CG Square, C.G. Road, Ahmedabad, Gujarat 380009",
    rating: 4.9,
    googleReviewCount: 156,
    experience: 16,
    completedProjects: 270,
    specialties: ["Vernacular Architecture", "Earthy Interiors", "Reclaimed Wood Design"],
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    description: "d6thD Design Studio is spearheaded by Himanshu Patel. The studio promotes vernacular and eco-friendly design practices, reusing local crafts, brick arches, and earthy elements to make homes that feel rooted in culture.",
    contactNumber: "+91 94260 88990",
    email: "himanshu@d6thd.com",
    responseTime: "1-2 days",
    surveyMetrics: {
      communication: 4.8,
      versatility: 4.9,
      timeliness: 4.6,
      professionalism: 4.9
    },
    reviews: [
      {
        id: "r12_1",
        userName: "Devang Bhatt",
        rating: 5,
        comment: "Excellent use of local materials and traditional brick domes. Our farmhouse feels so earthy and serene.",
        date: "3 months ago"
      }
    ]
  }
];
