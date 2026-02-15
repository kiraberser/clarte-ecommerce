import { notFound } from "next/navigation";
import { getProductBySlug } from "@/shared/lib/services/products";
import { ProductDetail } from "@/features/products/components/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    return <ProductDetail product={product} />;
  } catch {
    notFound();
  }
}
