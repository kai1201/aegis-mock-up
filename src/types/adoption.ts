// TypeScript types for adoption data

export type Confidence = 'Verified' | 'Estimated';

export interface AdoptionSummary { 
  companyCount: number; // e.g., 342 
  confidence: Confidence; // Verified | Estimated 
  asOf: string; // ISO date 
  segments: Array<{ name: string; sharePct: number }>; // e.g., Automotive 45% 
  topNotables?: Array<{ 
    displayName: string; // "Global OEM (Automotive, Tier-1)" or real name if allowed 
    logoUrl?: string; // only if permitted 
    disclose: boolean; // true if we can show name/logo 
  }>;
}

export interface AdoptionMini {
  companyCount: number;
  confidence: Confidence;
  segmentsTop2?: string[]; // ["Automotive","Industrial"]
  notableShort?: string[]; // ["BrandA","BrandB"] or sectors
}

export interface PartDetail { 
  meta: any; // PartMeta would be defined elsewhere
  specs: any; // CategorySpecs would be defined elsewhere
  packageInfo: any; // PackageInfo would be defined elsewhere
  supplyChain: any; // SupplyChain would be defined elsewhere
  adoption?: AdoptionSummary; // NEW
}

export interface SearchCardData { 
  mpn: string; 
  manufacturer: string; 
  series?: string; 
  category?: string; 
  lifecycle: string; // Lifecycle type would be defined elsewhere
  longevityYears?: number; 
  packageShort?: string; // "LQFP-100" 
  keySpecs: string[]; // 3–5 items 
  supplySnapshot: { 
    leadTimeWeeks?: number; 
    priceRange?: [number, number]; 
    stock?: number; 
    MOQ?: number; 
    fpq?: number; 
  }; 
  adoptionMini?: AdoptionMini;
  datasheetUrl?: string;
}

// Segment names for industry categories
export const INDUSTRY_SEGMENTS = [
  'Automotive',
  'Industrial', 
  'Consumer',
  'Medical',
  'Telecom'
] as const;

export type IndustrySegment = typeof INDUSTRY_SEGMENTS[number];

// Adoption count ranges for faceting
export const ADOPTION_RANGES = [
  { label: '0-10', min: 0, max: 10 },
  { label: '11-100', min: 11, max: 100 },
  { label: '101-1k', min: 101, max: 1000 },
  { label: '1k+', min: 1001, max: Infinity }
] as const;

export type AdoptionRange = typeof ADOPTION_RANGES[number];
