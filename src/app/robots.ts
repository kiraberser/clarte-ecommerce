import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ocaso.mx";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account", "/checkout", "/orders"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
