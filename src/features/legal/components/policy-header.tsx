interface PolicyHeaderProps {
  title: string;
  description: string;
  updatedAt: string;
}

export function PolicyHeader({ title, description, updatedAt }: PolicyHeaderProps) {
  return (
    <div className="mb-12 border-b pb-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
        {description}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Última actualización: {updatedAt}
      </p>
    </div>
  );
}
