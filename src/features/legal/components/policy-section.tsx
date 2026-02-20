interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

export function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <section className="border-b py-8 last:border-b-0">
      <h2 className="mb-4 text-base font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
