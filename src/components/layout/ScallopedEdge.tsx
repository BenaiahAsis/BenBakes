// SVG scalloped edge — renders as the bottom of the dark hero section.
// color should match the section above (default: ganache #2B1810)
// bgColor should match the section below (default: buttercream #FBF1DE)
interface ScallopedEdgeProps {
  color?: string;
  bgColor?: string;
}

export default function ScallopedEdge({
  color = '#2B1810',
  bgColor = '#FBF1DE',
}: ScallopedEdgeProps) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: bgColor }}>
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full block"
        style={{ height: 60, display: 'block' }}
        aria-hidden="true"
      >
        <path
          d={
            // 12 arcs across the width — approximates a scallop/petal edge
            Array.from({ length: 12 }, (_, i) => {
              const w = 1440 / 12;
              const x = i * w;
              return `M${x},0 Q${x + w / 2},60 ${x + w},0`;
            }).join(' ') + ' L1440,0 Z'
          }
          fill={color}
        />
      </svg>
    </div>
  );
}
