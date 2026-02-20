import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/shared/lib/services/products";
import { ProductDetail } from "@/features/products/components/product-detail";
import { ProductInformation } from "@/features/products/components/product-information";
import { ProductDesignSection } from "@/features/products/components/product-design-section";
import { RelatedProductsCarousel } from "@/features/products/components/related-products-carousel";
import { ProductReviews } from "@/features/products/components/product-reviews";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    const description =
      product.descripcion?.slice(0, 155) || "Lámpara artesanal Ocaso";
    return {
      title: `${product.nombre} — Ocaso`,
      description,
      openGraph: {
        title: product.nombre,
        description,
        images: product.imagen_principal
          ? [{ url: product.imagen_principal }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.nombre,
      description: product.descripcion,
      image: product.imagen_principal,
      offers: {
        "@type": "Offer",
        price: product.precio_final,
        priceCurrency: "MXN",
        availability: product.en_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetail product={product} />
        <ProductInformation product={product} />
        <ProductDesignSection product={product} />
        <RelatedProductsCarousel />
        <ProductReviews slug={slug} />
      </>
    );
  } catch {
    notFound();
  }
}
