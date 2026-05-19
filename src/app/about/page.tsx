import { ProcessSection } from "@/features/about-process/components/process-section";
import { FadeIn } from "@/shared/components/motion-wrapper";
import { SunsetDivider } from "@/shared/components/sunset-divider";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
              Nuestra Historia
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-forest sm:text-5xl">
              Luz con Propósito
            </h1>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Ocaso nació de la convicción de que la iluminación puede ser algo
              más que funcional. Cada lámpara que creamos es una pieza de diseño
              que transforma espacios y eleva lo cotidiano.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Misión y Visión */}
      <section className="border-y border-sunset/10 bg-sunset/[0.04]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 lg:px-8">
          <FadeIn>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sunset/20 bg-sunset/5">
                <svg className="h-5 w-5 text-sunset" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-forest">
                Misión
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Diseñar y fabricar lámparas de autor que fusionen tecnología de
                impresión 3D con acabado artesanal, utilizando materiales
                sostenibles sin comprometer la estética ni la calidad.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-sunset/20 bg-sunset/5">
                <svg className="h-5 w-5 text-sunset" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-forest">
                Visión
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Ser referentes en iluminación de diseño accesible, demostrando
                que la producción responsable y la belleza van de la mano.
                Queremos que cada hogar tenga una pieza que cuente una historia.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Proceso */}
      <ProcessSection />

      <SunsetDivider className="py-8" />

      {/* Filosofía */}
      <section className="relative overflow-hidden border-t border-sunset/10 bg-sunset/[0.04]">
        <svg
          className="pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-1/4 translate-x-1/4 text-sunset/[0.06]"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="50" />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-sunset">
                Lo Que Nos Mueve
              </p>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-forest">
                Nuestra Filosofía
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Creemos en el poder de la tecnología al servicio del arte. El
                diseño 3D nos permite explorar formas imposibles para la
                fabricación tradicional, mientras que el PLA — un bioplástico
                derivado de recursos renovables — nos garantiza un proceso
                respetuoso con el medio ambiente. Pero la tecnología es solo el
                principio: cada pieza pasa por manos artesanas que le dan su
                carácter único, ese acabado imperfectamente perfecto que ninguna
                máquina puede replicar.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
