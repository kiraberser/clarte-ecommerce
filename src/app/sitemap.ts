import type { MetadataRoute } from "next";

const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:8000/api/v1";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ocaso.mx";

interface SitemapProduct {
  slug: string;
  updated_at: string;
}

interface SitemapCategory {
  slug: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/collection`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let productEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const productsRes = await fetch(
      `${API_BASE_URL}/productos/?page_size=1000`,
      { next: { revalidate: 3600 } },
    );
    if (productsRes.ok) {
      const json = await productsRes.json();
      const products: SitemapProduct[] = json?.data?.results ?? [];
      productEntries = products.map((p) => ({
        url: `${SITE_URL}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // silently fail — sitemap degrades gracefully
  }

  try {
    const categoriesRes = await fetch(
      `${API_BASE_URL}/productos/categorias/`,
      { next: { revalidate: 3600 } },
    );
    if (categoriesRes.ok) {
      const json = await categoriesRes.json();
      const categories: SitemapCategory[] = json?.data ?? [];
      categoryEntries = categories.map((c) => ({
        url: `${SITE_URL}/collection?category=${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    }
  } catch {
    // silently fail
  }

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
