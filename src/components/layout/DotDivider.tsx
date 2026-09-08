// Pearl-dot repeating divider (piped border motif)
// Renders a horizontal rule with 3 caramel dots in the centre

interface DotDividerProps {
  className?: string;
}

export default function DotDivider({ className = '' }: DotDividerProps) {
  return (
    <div className={`dot-divider ${className}`} aria-hidden="true">
      <span>
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
