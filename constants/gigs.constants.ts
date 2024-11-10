export const COMMON_SKILLS = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Video Editing",
  "Digital Marketing",
  "SEO",
  "Social Media",
  "Data Analysis",
  "Business Strategy",
  "Translation",
  "Voice Over",
  "Music Production",
  "Photography",
  "3D Modeling",
  "Animation",
  "Illustration",
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: 500, label: "$200 - $500" },
  { min: 500, max: null, label: "$500+" },
] as const;

export const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
] as const;

export const GIG_CATEGORIES = [
  { id: "digital", label: "Digital Services" },
  { id: "design", label: "Design & Creative" },
  { id: "tech", label: "Programming & Tech" },
  { id: "writing", label: "Writing & Translation" },
  { id: "video", label: "Video & Animation" },
  { id: "music", label: "Music & Audio" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
] as const;
