import { notFound } from "next/navigation";
import { getProductBySlug } from "@/shared/lib/services/products";
import { ProductDetail } from "@/features/products/components/product-detail";
import { ProductInformation } from "@/features/products/components/product-information";
import { ProductDesignSection } from "@/features/products/components/product-design-section";
import { RelatedProductsCarousel } from "@/features/products/components/related-products-carousel";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    return (
      <>
        <ProductDetail product={product} />
        <ProductInformation product={product} />
        <ProductDesignSection product={product} />
        <RelatedProductsCarousel />
      </>
    );
  } catch {
    notFound();
  }
}
