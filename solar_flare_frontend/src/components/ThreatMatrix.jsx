import React, { useState } from 'react';
import { ShieldAlert, Radio, Satellite, Compass, CheckCircle2 } from 'lucide-react';

const RISK_LEVELS = {
  R: [
    { scale: 'R1', name: 'Minor Radio Blackout', flux: 'M1 (10⁻⁵)', dgca: 'Degraded HF over sunlit equatorial paths. Minimal commercial airline impact.', action: 'Monitor 5–15 MHz frequencies.' },
    { scale: 'R2', name: 'Moderate Radio Blackout', flux: 'M5 (5×10⁻⁵)', dgca: 'Limited blackout of HF radio on sunlit side; loss of radio contact for 10–30 minutes.', action: 'Prepare VHF relay backup for DGCA trans-oceanic routes.' },
    { scale: 'R3', name: 'Strong Radio Blackout', flux: 'X1 (10⁻⁴)', dgca: 'Wide area blackout of HF radio communication; loss of radio contact for ~1 hour.', action: 'Alert DGCA Flight Dispatch; activate SATCOM primary voice.' },
    { scale: 'R4', name: 'Severe Radio Blackout', flux: 'X10 (10⁻³)', dgca: 'HF radio communication blacked out across most of sunlit hemisphere for 1–2 hours.', action: 'Mandatory trans-polar flight diversions; alert Indian Coast Guard.' },
    { scale: 'R5', name: 'Extreme Radio Blackout', flux: 'X20+ (>2×10⁻³)', dgca: 'Complete HF radio blackout on entire dayside of Earth. No HF contact possible.', action: 'Immediate national airspace space weather emergency protocol.' },
  ],
  S: [
    { scale: 'S1', name: 'Minor Radiation Storm', flux: 'Flux > 10 pfu', isro: 'No spacecraft anomalies expected. Astronauts on Gaganyaan safe inside shielding.', action: 'Routine radiation dosimetry monitoring.' },
    { scale: 'S2', name: 'Moderate Radiation Storm', flux: 'Flux > 10² pfu', isro: 'Infrequent single-event upsets (SEUs) in high-inclination and GEO satellites.', action: 'Enable EDAC error-correcting memory scrubbing on GSAT bus.' },
    { scale: 'S3', name: 'Strong Radiation Storm', flux: 'Flux > 10³ pfu', isro: 'Degradation of satellite solar panels; memory upsets in Cartosat/RISAT payloads.', action: 'Orient solar arrays to feather angle; safe sensitive optical sensors.' },
    { scale: 'S4', name: 'Severe Radiation Storm', flux: 'Flux > 10⁴ pfu', isro: 'Star tracker blindness, satellite lock-loss; payload memory latch-ups.', action: 'Place GSAT-7A/6 communications payloads into safe standby mode.' },
    { scale: 'S5', name: 'Extreme Radiation Storm', flux: 'Flux > 10⁵ pfu', isro: 'Permanent damage to satellite microelectronics; loss of payload control.', action: 'Execute critical sovereign constellation protection commands.' },
  ],
  G: [
    { scale: 'G1', name: 'Minor Geomagnetic Storm', flux: 'Kp = 5', navic: 'Weak fluctuations in low-latitude ionosphere; minor NAVIC L5 phase jitter.', action: 'Apply standard ionospheric delay grid models.' },
    { scale: 'G2', name: 'Moderate Geomagnetic Storm', flux: 'Kp = 6', navic: 'Equatorial plasma bubbles trigger NAVIC positioning error drift to 5–10m.', action: 'Alert survey, maritime, and defense NAVIC users of degraded DOP.' },
    { scale: 'G3', name: 'Strong Geomagnetic Storm', flux: 'Kp = 7', navic: 'Severe scintillation; loss of L5/S carrier lock. PGCIL 765kV grid voltage alarms.', action: 'PGCIL power grid operators activate reactive power reserves.' },
    { scale: 'G4', name: 'Severe Geomagnetic Storm', flux: 'Kp = 8', navic: 'Widespread NAVIC/GPS outages; transformer heating and protective tripping.', action: 'Isolate vulnerable regional power substations; switch to inertial nav.' },
    { scale: 'G5', name: 'Extreme Geomagnetic Storm', flux: 'Kp = 9', navic: 'Total NAVIC loss of lock across India; potential grid collapses & transformer burnouts.', action: 'Activate National Disaster Management Authority (NDMA) grid protocols.' },
  ]
};

export default function ThreatMatrix({ forecast }) {
  const p5 = forecast?.probability_5m ?? 0.42;
  const p15 = forecast?.probability_15m ?? 0.35;
  const p30 = forecast?.probability_30m ?? 0.25;

  // Derive current threat indices
  const currentRIndex = p30 > 0.4 ? 2 : p15 > 0.6 ? 1 : p5 > 0.5 ? 1 : 0;
  const currentSIndex = p30 > 0.4 ? 2 : p15 > 0.5 ? 1 : 0;
  const currentGIndex = p30 > 0.5 ? 2 : p15 > 0.5 ? 1 : 0;

  const [activeDomain, setActiveDomain] = useState('R');
  const [selectedScale, setSelectedScale] = useState(null);

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'R': return '#F47216'; // Orange: Radio
      case 'S': return '#EF4444'; // Red: Radiation
      case 'G': return '#3B9EFF'; // Blue: Geomagnetic / NAVIC
      default: return '#00C9A7';
    }
  };

  const domainData = RISK_LEVELS[activeDomain];
  const activeIndex = activeDomain === 'R' ? currentRIndex : activeDomain === 'S' ? currentSIndex : currentGIndex;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={22} color="#EF4444" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              National Infrastructure Threat & Sovereign Asset Risk Matrix
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4 }}>
            Cross-calibrating Aditya-L1 SoLEXS & HEL1OS telemetry into operational directives for NAVIC, ISRO Satellites, DGCA Aviation, and PGCIL Power Grids.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveDomain('R')}
            className={`btn btn-sm ${activeDomain === 'R' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Radio size={14} /> R-Scale (Radio / Aviation)
          </button>
          <button
            onClick={() => setActiveDomain('S')}
            className={`btn btn-sm ${activeDomain === 'S' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Satellite size={14} /> S-Scale (Satellite / Spacecraft)
          </button>
          <button
            onClick={() => setActiveDomain('G')}
            className={`btn btn-sm ${activeDomain === 'G' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Compass size={14} /> G-Scale (NAVIC / Power Grid)
          </button>
        </div>
      </div>

      {/* Summary Status Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="glass-card" style={{ borderLeft: '4px solid #F47216', padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>HF RADIO BLACKOUT</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#F47216', fontFamily: 'var(--font-mono)' }}>
              {RISK_LEVELS.R[currentRIndex].scale}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {RISK_LEVELS.R[currentRIndex].name}
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #EF4444', padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SATELLITE RADIATION</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
              {RISK_LEVELS.S[currentSIndex].scale}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {RISK_LEVELS.S[currentSIndex].name}
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid #3B9EFF', padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>NAVIC & GRID STORM</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#3B9EFF', fontFamily: 'var(--font-mono)' }}>
              {RISK_LEVELS.G[currentGIndex].scale}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {RISK_LEVELS.G[currentGIndex].name}
          </div>
        </div>
      </div>

      {/* Domain Scale Level Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {domainData.map((item, idx) => {
          const isCurrentLive = idx === activeIndex;
          const isSelected = selectedScale === item.scale || (!selectedScale && isCurrentLive);
          const color = getDomainColor(activeDomain);

          return (
            <div
              key={item.scale}
              onClick={() => setSelectedScale(item.scale)}
              style={{
                background: isSelected ? `${color}20` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? color : 'var(--border-subtle)'}`,
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {isCurrentLive && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: 8,
                    background: color,
                    color: '#000',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: 4,
                    letterSpacing: '0.05em',
                  }}
                >
                  LIVE ACTIVE
                </span>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 900, color }}>
                {item.scale}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                {item.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {item.flux}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Impact & Action Directive Box */}
      {(() => {
        const activeItem = domainData.find((d) => d.scale === selectedScale) || domainData[activeIndex];
        const color = getDomainColor(activeDomain);

        return (
          <div className="glass-card" style={{ border: `1px solid ${color}40`, boxShadow: `0 8px 30px ${color}10` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 900, color }}>
                  {activeItem.scale}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeItem.name}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 20, background: `${color}20`, color, fontWeight: 700 }}>
                Threshold: {activeItem.flux}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  {activeDomain === 'R' ? 'Aviation & Maritime HF Impact' : activeDomain === 'S' ? 'Spacecraft & Payload Electronics Impact' : 'NAVIC GNSS & National Power Grid Impact'}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {activeItem.dgca || activeItem.isro || activeItem.navic}
                </p>
              </div>

              <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color, fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  <CheckCircle2 size={16} /> Recommended Sovereign Operational Directive
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5 }}>
                  {activeItem.action}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
