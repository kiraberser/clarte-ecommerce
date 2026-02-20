import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactInfo } from "@/features/contact/components/contact-info";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Ocaso
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hablemos
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
          Ya sea una consulta sobre un producto, un proyecto de diseño o
          simplemente quieres conocer más sobre nuestra colección, estamos aquí.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </main>
  );
}
