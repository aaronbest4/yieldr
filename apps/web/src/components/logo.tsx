/** The Yieldr mark (three rising columns) with the live-type wordmark. Colours follow the theme. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
        <rect x="3" y="17" width="7" height="12" rx="2" fill="var(--brand)" />
        <rect x="12.5" y="11" width="7" height="18" rx="2" fill="var(--fern)" />
        <rect x="22" y="3" width="7" height="26" rx="2" fill="var(--wattle)" />
      </svg>
      <span className="font-display text-[22px] font-bold leading-none tracking-[-0.02em] text-brand">
        yieldr
      </span>
    </span>
  );
}
