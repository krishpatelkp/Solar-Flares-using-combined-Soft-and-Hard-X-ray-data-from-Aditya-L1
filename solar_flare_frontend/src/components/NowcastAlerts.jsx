import React, { useState } from 'react';
import { ShieldAlert, Clock, Info, Filter } from 'lucide-react';

const ALERTS = [
  {
    id: 1, type: 'M-Class Flux Spike', time: '14:23:01 UTC',
    description: 'Count rate exceeded 3σ baseline for 5 consecutive seconds in SoLEXS.',
    severity: 'high', instrument: 'SoLEXS',
    detail: 'Flux rose from 1.2×10⁻⁷ to 3.4×10⁻⁶ W/m². Classified M2.1 per GOES cross-calibration.',
  },
  {
    id: 2, type: 'Neupert Effect Detected', time: '14:24:12 UTC',
    description: 'High SXR derivative shows significant correlation with HEL1OS HXR signal.',
    severity: 'high', instrument: 'SoLEXS + HEL1OS',
    detail: 'Neupert effect (∂SXR/∂t ∝ HXR) confirmed at >0.85 Pearson correlation over 90s window.',
  },
  {
    id: 3, type: 'Emission Measure Rise', time: '14:15:30 UTC',
    description: 'Stable plasma temperature (12 MK) with rapidly rising emission measure detected.',
    severity: 'medium', instrument: 'SoLEXS',
    detail: 'EM rose by 1.8×10⁴⁶ cm⁻³ over 5 minutes. Consistent with pre-flare heating signature.',
  },
  {
    id: 4, type: 'Hardness Ratio Elevated', time: '14:10:05 UTC',
    description: 'HXR/SXR hardness ratio crossed threshold of 0.12 — indicating non-thermal emission.',
    severity: 'medium', instrument: 'HEL1OS',
    detail: 'Hardness ratio = 0.142. CdTe band (10–40 keV) shows power-law spectral index γ ≈ 3.2.',
  },
  {
    id: 5, type: 'Data gap recovered', time: '13:55:40 UTC',
    description: 'Brief 45-second telemetry gap in HEL1OS PHA data stream resolved.',
    severity: 'low', instrument: 'HEL1OS',
    detail: 'Gap attributed to ground-station handover. Data interpolated in Level-2 product.',
  },
];

const SEV_COLORS = { high: '#FF4444', medium: '#F47216', low: '#00C9A7' };
const SEV_LABELS = { high: 'HIGH', medium: 'MED', low: 'LOW' };

function NowcastAlerts() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'all' ? ALERTS : ALERTS.filter(a => a.severity === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldAlert color="#3B9EFF" size={22} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Nowcast Alert Feed
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {filtered.length} alert{filtered.length !== 1 ? 's' : ''} · Auto-refresh every 10s
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} color="var(--text-muted)" />
          {['all', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              id={`alert-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                padding: '5px 12px',
                color: f !== 'all' && filter === f ? SEV_COLORS[f] : undefined,
                borderColor: f !== 'all' && filter === f ? `${SEV_COLORS[f]}60` : undefined,
                background: f !== 'all' && filter === f ? `${SEV_COLORS[f]}15` : undefined,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(alert => {
          const color = SEV_COLORS[alert.severity];
          const isOpen = expanded === alert.id;
          return (
            <div
              key={alert.id}
              id={`alert-${alert.id}`}
              className="glass-card"
              style={{
                padding: '16px 20px', cursor: 'pointer',
                borderLeft: `4px solid ${color}`,
                transition: 'all 0.25s ease',
                boxShadow: isOpen ? `0 4px 30px ${color}15` : 'var(--shadow-card)',
                border: `1px solid ${isOpen ? color + '40' : 'var(--border-subtle)'}`,
                borderLeft: `4px solid ${color}`,
              }}
              onClick={() => setExpanded(isOpen ? null : alert.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      padding: '2px 8px', borderRadius: 4,
                      background: `${color}20`, color, fontSize: '0.65rem', fontWeight: 800,
                      letterSpacing: '0.1em', border: `1px solid ${color}40`,
                    }}>
                      {SEV_LABELS[alert.severity]}
                    </div>
                    <div style={{
                      padding: '2px 8px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600,
                    }}>{alert.instrument}</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {alert.type}
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {alert.description}
                  </div>
                  {isOpen && (
                    <div style={{
                      marginTop: 12, padding: '10px 14px',
                      background: `${color}08`, borderRadius: 8,
                      border: `1px solid ${color}25`, fontSize: '0.83rem',
                      color: 'var(--text-secondary)', lineHeight: 1.6,
                      animation: 'fadeInUp 0.2s ease both',
                    }}>
                      <span style={{ color, fontWeight: 700 }}>Detail: </span>
                      {alert.detail}
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                  gap: 6, flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4,
                    color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <Clock size={12} />
                    {alert.time}
                  </div>
                  <div style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>
                    {isOpen ? '▲ Collapse' : '▼ Expand'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NowcastAlerts;
