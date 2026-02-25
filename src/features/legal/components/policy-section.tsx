interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export function PolicySection({ title, children, id }: PolicySectionProps) {
  return (
    <section id={id} className="border-b py-8 last:border-b-0">
      <h2 className="mb-4 text-base font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
