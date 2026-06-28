import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const solexsData = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  v: Math.exp(-Math.pow(i / 30 - 0.65, 2) * 80) * 1e-4 + 1e-8 + Math.random() * 2e-9,
}));

const heliosData = Array.from({ length: 30 }, (_, i) => ({
  t: i,
  v: Math.exp(-Math.pow(i / 30 - 0.55, 2) * 100) * 5e-5 + 1e-9 + Math.random() * 5e-10,
}));

const MiniChart = ({ data, color, label }) => (
  <div style={{ height: 60 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line dataKey="v" stroke={color} dot={false} strokeWidth={2} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const SpecGrid = ({ label, value, unit, color }) => (
  <div style={{
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    borderLeft: `3px solid ${color}`,
  }}>
    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
      color: 'var(--text-primary)' }}>
      {value} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{unit}</span>
    </div>
  </div>
);

const InstrumentCards = () => {
  const [active, setActive] = useState(null);

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">Instruments</div>
          <h2 className="section-title">Aditya-L1 X-Ray Payload</h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Two complementary sensors deliver continuous, uninterrupted solar X-ray coverage from the L1 halo orbit.
          </p>
        </div>

        <div className="grid-2">
          {/* SoLEXS Card */}
          <div
            id="solexs-card"
            className="glass-card glass-card-orange"
            style={{ cursor: 'default' }}
            onMouseEnter={() => setActive('solexs')}
            onMouseLeave={() => setActive(null)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(244,114,22,0.15)',
                  border: '1px solid rgba(244,114,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12, fontSize: '1.4rem',
                }}>☀️</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800,
                  color: 'var(--text-primary)', marginBottom: 4 }}>SoLEXS</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Solar Low-Energy X-ray Spectrometer
                </p>
              </div>
              <div className="badge badge-orange">2–22 keV</div>
            </div>

            <MiniChart data={solexsData} color="#F47216" label="SXR" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20, marginBottom: 20 }}>
              <SpecGrid label="Detectors" value="Si-Drift" unit="(dual)" color="#F47216" />
              <SpecGrid label="Aperture" value="7.1 + 0.1" unit="mm²" color="#F47216" />
              <SpecGrid label="Cadence" value="~2" unit="sec" color="#F47216" />
              <SpecGrid label="Resolution" value="~150" unit="eV" color="#F47216" />
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Dual silicon-drift detectors with large (7.1 mm²) and small (0.1 mm²) apertures. Captures A-class through X-class flares. Outputs histogrammed spectral counts every ~2 seconds.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-orange">Sun-as-a-star spectra</span>
              <span className="badge badge-orange">A–X class flares</span>
              <span className="badge badge-orange">Level 1 & 2 products</span>
            </div>
          </div>

          {/* HEL1OS Card */}
          <div
            id="helios-card"
            className="glass-card glass-card-blue"
            style={{ cursor: 'default' }}
            onMouseEnter={() => setActive('helios')}
            onMouseLeave={() => setActive(null)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(59,158,255,0.15)',
                  border: '1px solid rgba(59,158,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12, fontSize: '1.4rem',
                }}>⚡</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800,
                  color: 'var(--text-primary)', marginBottom: 4 }}>HEL1OS</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  High Energy L1 Orbiting Spectrometer
                </p>
              </div>
              <div className="badge badge-blue">10–150 keV</div>
            </div>

            <MiniChart data={heliosData} color="#3B9EFF" label="HXR" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20, marginBottom: 20 }}>
              <SpecGrid label="CdTe Band" value="10–40" unit="keV" color="#3B9EFF" />
              <SpecGrid label="CZT Band" value="20–150" unit="keV" color="#3B9EFF" />
              <SpecGrid label="Light Curves" value="1" unit="sec" color="#3B9EFF" />
              <SpecGrid label="PHA Spectra" value="20" unit="sec" color="#3B9EFF" />
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              CdTe (10–40 keV) and CZT (20–150 keV) detectors capture hard X-ray emission. Fixed L1 orbit eliminates Earth occultation — 100% solar duty cycle. Outputs Type-II PHA FITS files.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">Hard X-ray spectra</span>
              <span className="badge badge-blue">10ms event list</span>
              <span className="badge badge-blue">OGIP FITS format</span>
            </div>
          </div>
        </div>

        {/* Data access bar */}
        <div className="glass-card" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,201,167,0.15)', border: '1px solid rgba(0,201,167,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛰️</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                ISSDC PRADAN Portal
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official Aditya-L1 science data archive — registration required
              </div>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://pradan.issdc.gov.in" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" id="pradan-link">
              Access PRADAN
            </a>
            <a href="https://www.kaggle.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" id="kaggle-link">
              Kaggle Sample Data
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentCards;
