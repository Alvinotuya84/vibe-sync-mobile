import {
  COMMON_SKILLS,
  GIG_CATEGORIES,
  SORT_OPTIONS,
} from "@/constants/gigs.constants";

export type GigSkill = (typeof COMMON_SKILLS)[number];
export type GigCategory = (typeof GIG_CATEGORIES)[number]["id"];
export type SortOption = (typeof SORT_OPTIONS)[number]["id"];

export interface GigFiltersType {
  minPrice?: number;
  maxPrice?: number;
  skills: GigSkill[];
  category?: GigCategory;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  skills: GigSkill[];
  category: GigCategory;
  creator: {
    id: string;
    username: string;
    profileImagePath?: string;
    isVerified: boolean;
  };
  viewCount: number;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}
