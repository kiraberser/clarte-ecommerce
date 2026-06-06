"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Cable,
  DollarSign,
  Leaf,
  Package,
  PenTool,
  Printer,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/shared/components/motion-wrapper";

/* ── The four pillars of digital manufacturing ── */

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Leaf,
    title: "Sostenibilidad",
    body: "Nuestro modelo bajo demanda elimina inventarios estancados y desperdicios. Usamos exclusivamente PLA premium, un bioplástico derivado de fuentes renovables, minimizando nuestro impacto ambiental.",
  },
  {
    icon: Sparkles,
    title: "Libertad de Diseño",
    body: "Al eliminar las limitaciones de los moldes industriales tradicionales, logramos formas orgánicas complejas y texturas acanaladas exclusivas que serían imposibles —o inviables— de otra manera.",
  },
  {
    icon: DollarSign,
    title: "Costo-Beneficio",
    body: "La manufactura digital elimina los costos exorbitantes de maquinaria pesada e intermediarios. Esto nos permite ofrecer piezas de autor y exclusivas por una fracción del precio de la decoración de lujo tradicional.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad Controlada",
    body: "Desarrollamos nuestro propio proceso y gestionamos nuestra fábrica de principio a fin. Desde la primera línea del diseño en 3D hasta la soldadura del casquillo de la lámpara, garantizamos la excelencia en cada detalle.",
  },
];

/* ── The five production steps (scroll-driven) ── */

interface Step {
  n: string;
  tab: string;
  title: string;
  body: string;
  icon: LucideIcon;
  gradient: string;
  /** Optional real image URL. When set, replaces the on-brand placeholder. */
  image?: string;
}

const steps: Step[] = [
  {
    n: "01",
    tab: "Modelado",
    title: "Prototipado y Diseño",
    body: "Nuestro proceso comienza en la pantalla. Utilizando Autodesk Fusion 360, nuestros ingenieros y diseñadores prueban decenas de iteraciones geométricas hasta alcanzar el equilibrio perfecto entre luz, sombra y textura.",
    icon: PenTool,
    gradient: "from-forest via-forest/90 to-sage",
  },
  {
    n: "02",
    tab: "Impresión",
    title: "Impresión FDM",
    body: "Nuestra granja de impresoras 3D transforma el modelo digital en realidad con detalles bellísimos. La deposición cuidadosa del PLA capa por capa es lo que crea nuestra firma visual texturizada.",
    icon: Printer,
    gradient: "from-sunset via-sunset/85 to-[hsl(24_60%_38%)]",
  },
  {
    n: "03",
    tab: "Verificación",
    title: "Acabado e Inspección",
    body: "No hay atajos. Cada pieza que sale de la base de impresión pasa por un lijado de la base y una rigurosa inspección de superficie. Aquí garantizamos que las líneas sean perfectamente orgánicas y fluidas.",
    icon: ScanSearch,
    gradient: "from-sage via-sage/85 to-forest",
  },
  {
    n: "04",
    tab: "Montaje",
    title: "Montaje Eléctrico",
    body: "El diseño se encuentra con la ingeniería. Nuestros especialistas integran cuidadosamente los componentes eléctricos certificados, como los casquillos E27 estándar y los elegantes cables de tela ignífugos.",
    icon: Cable,
    gradient: "from-[hsl(24_55%_32%)] via-sunset/80 to-sunset",
  },
  {
    n: "05",
    tab: "Envío",
    title: "Embalaje y Envío",
    body: "El último paso es garantizar que la obra llegue intacta a tu hogar. Las lámparas se embalan a medida con protección anticaídas y se despachan rápidamente a todo México una vez finalizadas.",
    icon: Package,
    gradient: "from-forest via-sage to-forest/80",
  },
];

/* ── Visual panel for a single step ── */

function StepVisual({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br ${step.gradient}`}
    >
      {step.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={step.image}
          alt={step.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Watermark number */}
          <span className="absolute -right-4 -top-8 font-display text-[12rem] font-bold leading-none text-white/10 sm:text-[15rem]">
            {step.n}
          </span>
          {/* Centered icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-28 w-28 text-white/25" strokeWidth={1} />
          </div>
          {/* Bottom legibility gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute bottom-6 left-6 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
            {step.tab}
          </span>
        </>
      )}
    </div>
  );
}

export function ManufacturingProcess() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(
          Math.max(-el.getBoundingClientRect().top, 0),
          Math.max(total, 1),
        );
        const progress = total > 0 ? scrolled / total : 0;
        const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        setActive(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToStep = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const target =
      el.offsetTop + (i / steps.length) * total + total / (steps.length * 2);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const current = steps[active];

  return (
    <>
      {/* ── Intro: Manufactura Digital ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <FadeIn>
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
              Manufactura Digital
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-forest sm:text-4xl">
              Menos desperdicio. Diseño impecable.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Estamos redefiniendo cómo se hace la alta decoración, combinando
              precisión artesanal con tecnología de punta. La impresión 3D
              revolucionó el prototipado; en Ocaso, la llevamos al producto
              final. ¿El resultado? El primer proceso de manufactura bajo demanda
              para lámparas de alta gama.
            </p>
          </div>
        </FadeIn>

        {/* Four pillars */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-sunset/15 bg-sunset/[0.04] p-7 transition-colors hover:border-sunset/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sunset/20 bg-white">
                  <pillar.icon className="h-5 w-5 text-sunset" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-forest">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Scroll-driven five-step process ── */}
      <section className="relative border-t border-sunset/10 bg-gradient-to-b from-white via-sunset/[0.03] to-white">
        {/* Sticky tab indicator */}
        <div className="sticky top-0 z-20 border-b border-sunset/10 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-4 lg:px-8">
            {steps.map((step, i) => (
              <button
                key={step.tab}
                onClick={() => scrollToStep(i)}
                className={`flex-none rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                  i === active
                    ? "bg-forest text-white"
                    : "text-muted-foreground hover:text-forest"
                }`}
              >
                {step.tab}
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-0.5 w-full bg-sunset/10">
            <motion.div
              className="h-full bg-sunset"
              animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Tall wrapper drives the scroll; inner panel is sticky */}
        <div
          ref={wrapperRef}
          style={{ height: `${steps.length * 100}vh` }}
          className="relative"
        >
          <div className="sticky top-[57px] flex h-[calc(100vh-57px)] items-center">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
              {/* Visual */}
              <div className="relative aspect-[4/3] w-full lg:aspect-[5/6]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.n}
                    initial={{ opacity: 0, y: 40, scale: 1.02 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.99 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    <StepVisual step={current} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Text */}
              <div className="relative min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.n}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <span className="font-display text-sm font-semibold tracking-[0.2em] text-sage">
                      {current.n}
                    </span>
                    <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-forest sm:text-5xl">
                      {current.title}
                    </h3>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                      {current.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
