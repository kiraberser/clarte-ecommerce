import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Leaf } from "lucide-react";
import {
  differentiators,
  getDifferentiator,
} from "@/features/about-process/data/differentiators";
import { ManufacturingProcess } from "@/features/about-process/components/manufacturing-process";
import { FadeIn } from "@/shared/components/motion-wrapper";
import { SunsetDivider } from "@/shared/components/sunset-divider";

interface ProcesoPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return differentiators.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: ProcesoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getDifferentiator(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Ocaso`,
    description: item.intro.slice(0, 155),
    openGraph: {
      title: `${item.title} — Ocaso`,
      description: item.intro.slice(0, 155),
    },
  };
}

export default async function ProcesoPage({ params }: ProcesoPageProps) {
  const { slug } = await params;
  const item = getDifferentiator(slug);
  if (!item) notFound();

  const index = differentiators.findIndex((d) => d.slug === item.slug);
  const next = differentiators[(index + 1) % differentiators.length];

  return (
    <>
      {/* Hero */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${item.gradient}`}
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <FadeIn>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} />
              Nuestro Proceso
            </Link>
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-white/80">
              {item.label}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              {item.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80">
              {item.intro}
            </p>
            {item.ecoBadge && (
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                <Leaf size={12} />
                Material renovable
              </span>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Tecnología 3D gets the rich digital-manufacturing experience */}
      {item.slug === "tecnologia-3d" && <ManufacturingProcess />}

      {/* Explanatory blocks */}
      {item.slug !== "tecnologia-3d" && (
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_300px]">
          {/* Long-form content */}
          <div className="space-y-14">
            {item.blocks.map((block, i) => (
              <FadeIn key={block.heading} delay={i * 0.1}>
                <article>
                  <span className="font-display text-5xl font-light text-sunset/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-forest">
                    {block.heading}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {block.body}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* Highlights sidebar */}
          <FadeIn delay={0.2}>
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-sunset/15 bg-sunset/[0.04] p-7">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sunset">
                  En resumen
                </p>
                <ul className="mt-5 space-y-4">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm text-forest">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-sage/15 text-sage">
                        <Check size={12} />
                      </span>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/collection"
                  className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-lg bg-sunset px-6 text-sm font-medium text-white transition-colors hover:bg-sunset/85"
                >
                  Ver Colección
                </Link>
              </div>
            </aside>
          </FadeIn>
        </div>
      </section>
      )}

      <SunsetDivider className="py-8" />

      {/* Next differentiator */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <FadeIn>
          <Link
            href={`/proceso/${next.slug}`}
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${next.gradient} p-8 transition-all duration-500 hover:-translate-y-1 sm:p-10`}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                Siguiente · {next.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {next.title}
              </p>
            </div>
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-forest">
              <ArrowRight size={20} />
            </span>
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
