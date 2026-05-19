export function SunsetDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`} aria-hidden="true">
      <div className="h-px w-20 bg-gradient-to-r from-transparent to-sunset/30" />
      <svg viewBox="0 0 32 32" className="h-5 w-5 text-sunset/50" fill="currentColor">
        <circle cx="16" cy="20" r="8" />
        <rect x="0" y="20" width="32" height="12" fill="white" />
        <line x1="0" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="0.5" />
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((angle) => (
          <line
            key={angle}
            x1={16 + 10 * Math.cos((angle * Math.PI) / 180)}
            y1={20 - 10 * Math.sin((angle * Math.PI) / 180)}
            x2={16 + 15 * Math.cos((angle * Math.PI) / 180)}
            y2={20 - 15 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.4"
          />
        ))}
      </svg>
      <div className="h-px w-20 bg-gradient-to-l from-transparent to-sunset/30" />
    </div>
  );
}
