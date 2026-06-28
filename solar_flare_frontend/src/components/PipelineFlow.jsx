import React, { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 'ingest',
    icon: '📡',
    title: 'Data Ingestion',
    color: '#3B9EFF',
    items: ['SoLEXS FITS spectra', 'HEL1OS light curves', 'GOES XRS flux', 'NOAA flare catalog'],
    detail: 'Download Level-1/2 FITS files from ISSDC PRADAN. Fetch GOES XRS 1–8 Å flux and official NOAA flare event lists via SunPy Fido.',
  },
  {
    id: 'preprocess',
    icon: '🔧',
    title: 'Preprocessing',
    color: '#F47216',
    items: ['Time alignment (UTC)', 'Counts → flux calibration', 'Gap imputation', 'Cosmic-ray filtering'],
    detail: 'Synchronize timestamps to 1s grid. Apply instrument response matrices (ARF/RMF). Forward-fill short gaps; sigma-clip spike events. Drop flagged housekeeping intervals.',
  },
  {
    id: 'features',
    icon: '📊',
    title: 'Feature Engineering',
    color: '#00C9A7',
    items: ['Rolling means & gradients', 'Hardness ratio (HXR/SXR)', 'Spectral slopes', 'Flare history features'],
    detail: 'Compute sliding-window statistics (1–10 min). Calculate hardness ratio = flux(20–40 keV) / flux(2–10 keV). Fit isothermal+power-law to extract T and spectral index.',
  },
  {
    id: 'model',
    icon: '🧠',
    title: 'Model Training',
    color: '#A78BFA',
    items: ['Baseline: threshold', 'RF / XGBoost', 'LSTM / CNN', 'Physics-informed ML'],
    detail: 'Walk-forward train/test split (past → future). Handle class imbalance with SMOTE or weighted loss. Tune hyperparameters with cross-validation.',
  },
  {
    id: 'eval',
    icon: '📈',
    title: 'Evaluation',
    color: '#FFB347',
    items: ['TSS & HSS scores', 'ROC / PR curves', 'Reliability diagrams', 'Skill vs GOES baseline'],
    detail: 'Compute True Skill Statistic (TSS = TPR + TNR – 1). Compare against persistence and climatology baselines. Plot ROC curves and calibration diagrams.',
  },
];

const StreamDot = ({ color, delay }) => (
  <div style={{
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 8, height: 8,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 8px ${color}`,
    animation: `stream-dot 2s ${delay}s linear infinite`,
    zIndex: 2,
  }} />
);

const Arrow = ({ color }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 4, position: 'relative',
    width: 48, flexShrink: 0,
  }}>
    <div style={{
      width: '100%', height: 2,
      background: `linear-gradient(90deg, ${color}40, ${color}a0)`,
      borderRadius: 1, position: 'relative', overflow: 'visible',
    }}>
      <StreamDot color={color} delay={0} />
      <StreamDot color={color} delay={0.6} />
      <StreamDot color={color} delay={1.2} />
    </div>
    <svg width="12" height="8" viewBox="0 0 12 8" style={{ marginLeft: 36, marginTop: -5 }}>
      <path d="M0 4H10M10 4L6 0M10 4L6 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

const PipelineFlow = () => {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">Pipeline</div>
          <h2 className="section-title">End-to-End Hackathon Workflow</h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            From raw satellite telemetry to a validated flare forecast — the full data pipeline in 5 stages.
          </p>
        </div>

        {/* Pipeline nodes */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 16,
        }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <div
                id={`pipeline-step-${step.id}`}
                className="glass-card"
                style={{
                  width: 160, flexShrink: 0, cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.3s ease',
                  transform: hovered === step.id ? 'translateY(-8px) scale(1.05)' : 'none',
                  border: hovered === step.id ? `1px solid ${step.color}60` : '1px solid var(--border-subtle)',
                  boxShadow: hovered === step.id ? `0 12px 40px ${step.color}30` : 'var(--shadow-card)',
                  opacity: visible ? 1 : 0,
                  animation: visible ? `fadeInUp 0.5s ease ${i * 0.1}s both` : 'none',
                  padding: '20px 16px',
                }}
                onMouseEnter={() => setHovered(step.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  fontSize: '2rem', marginBottom: 10,
                  filter: hovered === step.id ? `drop-shadow(0 0 8px ${step.color})` : 'none',
                  transition: 'filter 0.3s ease',
                }}>
                  {step.icon}
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `${step.color}20`,
                  border: `2px solid ${step.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: '0.75rem', color: step.color,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 10 }}>
                  {step.title}
                </div>
                <ul style={{ listStyle: 'none', textAlign: 'left' }}>
                  {step.items.map(item => (
                    <li key={item} style={{
                      fontSize: '0.72rem', color: 'var(--text-muted)',
                      padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ color: step.color, fontSize: '0.6rem' }}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {i < STEPS.length - 1 && (
                <Arrow color={STEPS[i + 1].color} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{
          marginTop: 24,
          transition: 'all 0.3s ease',
          minHeight: 80,
        }}>
          {hovered && (() => {
            const step = STEPS.find(s => s.id === hovered);
            return (
              <div className="glass-card" style={{
                border: `1px solid ${step.color}40`,
                boxShadow: `0 4px 30px ${step.color}20`,
                display: 'flex', alignItems: 'center', gap: 20,
                animation: 'fadeInUp 0.2s ease both',
              }}>
                <div style={{ fontSize: '2.5rem' }}>{step.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                    color: step.color, marginBottom: 6 }}>{step.title}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })()}
          {!hovered && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ↑ Hover any stage for details
            </div>
          )}
        </div>

        {/* Tools row */}
        <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { name: 'Astropy', icon: '🌌', color: '#3B9EFF' },
            { name: 'SunPy', icon: '☀️', color: '#F47216' },
            { name: 'Pandas', icon: '🐼', color: '#00C9A7' },
            { name: 'scikit-learn', icon: '🤖', color: '#A78BFA' },
            { name: 'TensorFlow', icon: '🧠', color: '#FFB347' },
            { name: 'PyTorch', icon: '🔥', color: '#FF6B6B' },
            { name: 'FITS/OGIP', icon: '📁', color: '#7B90B8' },
          ].map(({ name, icon, color }) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px',
              background: `${color}12`,
              border: `1px solid ${color}30`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
            }}>
              <span>{icon}</span>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineFlow;
