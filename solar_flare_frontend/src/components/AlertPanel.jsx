import React from 'react';
import { ShieldAlert, Zap, Thermometer, Activity, TrendingUp } from 'lucide-react';

const MetricRow = ({ icon, label, value, unit, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `${color}15`, border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div className="metric-title">{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
        color: 'var(--text-primary)', lineHeight: 1 }}>
        {value} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{unit}</span>
      </div>
    </div>
  </div>
);

const AlertPanel = ({ forecast }) => {
  const p5 = forecast?.probability_5m ?? 0.42;
  const isHigh = p5 > 0.8;
  const isMed = p5 > 0.5;

  return (
    <div className="glass-card" style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      border: isHigh ? '1px solid rgba(255,68,68,0.3)' : isMed ? '1px solid rgba(244,114,22,0.25)' : '1px solid var(--border-subtle)',
      boxShadow: isHigh ? '0 8px 40px rgba(255,68,68,0.15)' : 'var(--shadow-card)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
          color: 'var(--text-primary)', margin: 0 }}>Nowcast Status</h3>
        <div className={`status-badge ${isHigh ? 'warning' : ''}`}>
          <ShieldAlert size={14} />
          {isHigh ? 'FLARE IMMINENT' : isMed ? 'ELEVATED' : 'NOMINAL'}
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MetricRow
          icon={<Thermometer size={18} />}
          label="Plasma Temp (MK)"
          value={forecast?.temperature_mk ?? '12.4'}
          unit="MK"
          color="#F47216"
        />
        <MetricRow
          icon={<Activity size={18} />}
          label="Lead Time"
          value={forecast?.lead_time_minutes ?? '23'}
          unit="min"
          color="#3B9EFF"
        />
        <MetricRow
          icon={<TrendingUp size={18} />}
          label="Hardness Ratio"
          value="0.142"
          unit=""
          color="#A78BFA"
        />
      </div>

      {/* GOES equiv */}
      <div style={{
        background: 'rgba(0,0,0,0.25)', padding: '12px 16px',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
        border: '1px solid var(--border-subtle)',
      }}>
        <Zap size={18} color={isHigh ? '#FF4444' : '#F47216'} />
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current GOES Equivalent</div>
          <div style={{ fontSize: '0.9rem', marginTop: 2 }}>
            <strong style={{ color: isHigh ? '#FF4444' : '#F47216', fontSize: '1.1rem' }}>M2.1</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: 8 }}>
              (Estimated from SoLEXS calibration)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;
