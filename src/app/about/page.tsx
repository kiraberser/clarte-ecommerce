import { ProcessSection } from "@/features/about-process/components/process-section";
import { FadeIn } from "@/shared/components/motion-wrapper";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Nuestra Historia
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              Luz con Propósito
            </h1>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Clarté nació de la convicción de que la iluminación puede ser algo
              más que funcional. Cada lámpara que creamos es una pieza de diseño
              que transforma espacios y eleva lo cotidiano.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Misión y Visión */}
      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 lg:px-8">
          <FadeIn>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
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
              <h2 className="text-xl font-semibold tracking-tight">
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

      {/* Filosofía */}
      <section className="border-t bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
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
