import React from 'react';

const ProbabilityGauge = ({ probability = 0.42 }) => {
  const pct = Math.min(100, Math.max(0, Math.round(probability * 100)));

  let fill = '#00C9A7';
  let label = 'LOW';
  let glowColor = 'rgba(0,201,167,0.3)';

  if (pct > 75) {
    fill = '#FF4444'; label = 'CRITICAL'; glowColor = 'rgba(255,68,68,0.4)';
  } else if (pct > 50) {
    fill = '#F47216'; label = 'ELEVATED'; glowColor = 'rgba(244,114,22,0.3)';
  } else if (pct > 25) {
    fill = '#FFB347'; label = 'MODERATE'; glowColor = 'rgba(255,179,71,0.3)';
  }

  // ── Semicircle speedometer gauge ──────────────────────────────────────────
  // viewBox 0 0 200 120, center at (100, 110), radius 90
  // Arc spans from 180° (left) → 360°/0° (right), i.e. the top half of a circle
  // (SVG y-axis is flipped, so going from 180→360 clockwise draws the TOP arc)
  const W = 200, H = 120;
  const cx = 100, cy = 110, r = 90;
  const toRad = d => (d * Math.PI) / 180;

  // Angle for a given percentage: 180° at 0%, 360° at 100%
  const angleForPct = p => 180 + 1.8 * p; // 1.8 = 180/100

  const polarToXY = (angleDeg, radius) => ({
    x: cx + radius * Math.cos(toRad(angleDeg)),
    y: cy + radius * Math.sin(toRad(angleDeg)),
  });

  // Build SVG arc path (always a large arc since we span up to 180°)
  const describeArc = (startDeg, endDeg, radius) => {
    const s = polarToXY(startDeg, radius);
    const e = polarToXY(endDeg, radius);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  };

  const progressAngle = angleForPct(pct); // e.g. 85% → 333°

  // Tick marks at 0, 25, 50, 75, 100%
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        border: `1px solid ${fill}25`,
        boxShadow: `0 8px 40px ${glowColor}`,
        padding: '20px 24px 16px',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        5-Min Flare Forecast
      </div>

      {/* SVG gauge */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track: 180° → 360° */}
          <path
            d={describeArc(180, 360, r)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored progress arc */}
          {pct > 0 && (
            <path
              d={describeArc(180, progressAngle, r)}
              fill="none"
              stroke={fill}
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#gauge-glow)"
            />
          )}

          {/* Tick marks */}
          {ticks.map(tick => {
            const a = angleForPct(tick);
            const inner = polarToXY(a, r - 16);
            const outer = polarToXY(a, r - 6);
            const lbl = polarToXY(a, r + 16);
            return (
              <g key={tick}>
                <line
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                />
                <text
                  x={lbl.x} y={lbl.y}
                  fill="rgba(255,255,255,0.3)"
                  fontSize="8"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Center value text */}
          <text
            x={cx} y={cy - 18}
            textAnchor="middle" dominantBaseline="central"
            fill={fill}
            fontSize="40" fontWeight="900"
            fontFamily="'Outfit', sans-serif"
            style={{ filter: `drop-shadow(0 0 10px ${fill})` }}
          >
            {pct}
          </text>
          <text
            x={cx} y={cy + 12}
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,255,255,0.35)"
            fontSize="11"
            fontFamily="'Inter', sans-serif"
          >
            %  probability
          </text>
        </svg>
      </div>

      {/* Status label */}
      <div style={{
        marginTop: 8, padding: '5px 24px',
        background: `${fill}15`, border: `1px solid ${fill}35`,
        borderRadius: 'var(--radius-full)',
        fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 800,
        color: fill, letterSpacing: '0.12em',
        animation: pct > 75 ? 'pulse-ring 2s infinite' : 'none',
      }}>
        {label}
      </div>
    </div>
  );
};

export default ProbabilityGauge;
