import { useState } from 'react';

// ── CUSTOM LINE CHART FOR OPERATIONS LOAD ──
interface LineChartProps {
  data: { label: string; value: number }[];
}

export function CustomLineChart({ data }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 500;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...data.map((d) => d.value), 100);
  const minVal = 0;

  // Compute point coordinates
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - minVal) / (maxVal - minVal)) * (height - padding * 2);
    return { x, y, value: d.value, label: d.label };
  });

  // SVG path definition
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
  }

  // SVG Area definition under line
  let areaD = '';
  if (points.length > 0) {
    areaD =
      `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Y Axis Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const y = padding + p * (height - padding * 2);
            const val = Math.round(maxVal - p * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#EAEAEA"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="#666666"
                  fontSize="10px"
                  className="font-mono"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGradient)"
              opacity="0.1"
            />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* The main line path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 5 : 3.5}
                fill={hoveredIndex === i ? '#000000' : '#FFFFFF'}
                stroke="#000000"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-white border border-[#EAEAEA] rounded shadow-md p-1.5 z-10 w-28 text-center"
            style={{
              top: `${points[hoveredIndex].y - 45}px`,
              left: `calc(${(points[hoveredIndex].x / width) * 100}% - 56px)`,
              pointerEvents: 'none',
            }}
          >
            <p className="text-xs font-bold text-black font-mono leading-none">
              {points[hoveredIndex].value.toLocaleString()} ops
            </p>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              {points[hoveredIndex].label}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-neutral-400 font-mono">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

// ── CUSTOM DONUT CHART FOR HEALTH DISTRIBUTION ──
interface DonutChartProps {
  data: { key: string; label: string; value: number; color: string }[];
}

export function CustomDonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = 160;
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentAngle = -90; // Start at the top

  // Map polaris colors to custom hexadecimal web colors for our donut chart
  const getTailwindColor = (color: string) => {
    if (color.includes('success')) return '#10B981'; // Mint Green
    if (color.includes('warning')) return '#F5A623'; // Amber Yellow
    if (color.includes('critical')) return '#FF0000'; // Pure Red
    return '#EAEAEA'; // Light Gray
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F5F5F5"
            strokeWidth={strokeWidth}
          />
          {data.map((item) => {
            const percent = total > 0 ? item.value / total : 0;
            const strokeDashoffset = circumference * (1 - percent);
            const angle = currentAngle;
            currentAngle += percent * 360;

            if (percent === 0) return null;

            return (
              <circle
                key={item.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={getTailwindColor(item.color)}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${angle} ${center} ${center})`}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Central Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-2xl font-extrabold text-black tracking-tight leading-none">
            {total}
          </p>
          <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider mt-0.5">
            Nodes
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 font-sans text-xs">
        {data.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getTailwindColor(item.color) }}
            />
            <span className="text-neutral-600 font-medium">
              {item.label}: <span className="font-bold text-black font-mono ml-0.5">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
