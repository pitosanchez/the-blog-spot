import { STORIES_MENU, CATEGORY_SEO_DATA } from "../constants";

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export const generateSitemapEntries = (): SitemapEntry[] => {
  const baseUrl = "https://theblogspot.com";
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const staticPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Generate entries for story categories
  const categoryPages: SitemapEntry[] = STORIES_MENU.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages];
};

export const generateSitemapXML = (): string => {
  const entries = generateSitemapEntries();

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = "</urlset>";

  const urls = entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("");

  return `${xmlHeader}\n${urlsetOpen}${urls}\n${urlsetClose}`;
};

// Function to get canonical URL for a given path
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = "https://theblogspot.com";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Function to get SEO data for a category
export const getCategorySEO = (categorySlug: string) => {
  return CATEGORY_SEO_DATA[categorySlug as keyof typeof CATEGORY_SEO_DATA];
};
