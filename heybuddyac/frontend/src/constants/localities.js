// Noida/Greater Noida localities with 5km neighbor interlinking
// Auto-generated from locality_5km_map + agents table

export const NOIDA_LOCALITIES = [
  { id: 70239, name: 'Sector 15', city: 'Noida', slug: 'sector-15-noida', neighbors: [70244] },
  { id: 70244, name: 'Sector 18', city: 'Noida', slug: 'sector-18-noida', neighbors: [70239, 70290] },
  { id: 70290, name: 'Sector 44', city: 'Noida', slug: 'sector-44-noida', neighbors: [70244, 88411] },
  { id: 88411, name: 'Sector 45', city: 'Noida', slug: 'sector-45-noida', neighbors: [70290, 86523, 86524] },
  { id: 70293, name: 'Sector 50', city: 'Noida', slug: 'sector-50-noida', neighbors: [88347, 88387, 88413] },
  { id: 70297, name: 'Sector 62', city: 'Noida', slug: 'sector-62-noida', neighbors: [70296] },
  { id: 70296, name: 'Sector 63', city: 'Noida', slug: 'sector-63-noida', neighbors: [70297] },
  { id: 88387, name: 'Sector 75', city: 'Noida', slug: 'sector-75-noida', neighbors: [70293, 88347, 88413] },
  { id: 88413, name: 'Sector 78', city: 'Noida', slug: 'sector-78-noida', neighbors: [70293, 86523, 88347, 88387] },
  { id: 86523, name: 'Sector 100', city: 'Noida', slug: 'sector-100-noida', neighbors: [86524, 88348, 88411, 88413] },
  { id: 88348, name: 'Sector 110', city: 'Noida', slug: 'sector-110-noida', neighbors: [86523, 86524] },
  { id: 88347, name: 'Sector 120', city: 'Noida', slug: 'sector-120-noida', neighbors: [70293, 88387, 88413] },
  { id: 86524, name: 'Sector 128', city: 'Noida', slug: 'sector-128-noida', neighbors: [86523, 88348, 88411] },
  { id: 88350, name: 'Sector 137', city: 'Noida', slug: 'sector-137-noida', neighbors: [] },
  { id: 95690, name: 'Greater Noida West', city: 'Noida', slug: 'greater-noida-west', neighbors: [] },
  { id: 70202, name: 'Sector 34', city: 'Greater Noida', slug: 'sector-34-greater-noida', neighbors: [] },
  { id: 70217, name: 'Sector 37', city: 'Greater Noida', slug: 'sector-37-greater-noida', neighbors: [] },
  { id: 70208, name: 'Alpha 1', city: 'Greater Noida', slug: 'alpha-greater-noida', neighbors: [70197, 70212, 70213, 70231] },
  { id: 70212, name: 'Beta 2', city: 'Greater Noida', slug: 'beta-greater-noida', neighbors: [70197, 70208, 70213] },
  { id: 70213, name: 'Gamma 1', city: 'Greater Noida', slug: 'gamma-greater-noida', neighbors: [70197, 70208, 70212] },
  { id: 70231, name: 'Omega 1', city: 'Greater Noida', slug: 'omega-greater-noida', neighbors: [70197, 70208] },
  { id: 70197, name: 'Knowledge Park', city: 'Greater Noida', slug: 'knowledge-park-greater-noida', neighbors: [70208, 70212, 70213, 70231] },
];

// Lookup helpers
export const LOC_BY_ID = Object.fromEntries(NOIDA_LOCALITIES.map(l => [l.id, l]));
export const LOC_BY_SLUG = Object.fromEntries(NOIDA_LOCALITIES.map(l => [l.slug, l]));
