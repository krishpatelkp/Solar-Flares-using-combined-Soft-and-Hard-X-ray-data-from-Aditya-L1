import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, Download } from 'lucide-react';

const TARGET_DATE = new Date('2026-08-01T00:00:00');

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = TARGET_DATE - new Date();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, []);
  return timeLeft;
}

const SunOrbit = () => (
  <div style={{ position: 'relative', width: 420, height: 420, margin: '0 auto' }}>
    {/* Outer glow */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(244,114,22,0.15) 0%, transparent 70%)',
      animation: 'corona-pulse 4s ease-in-out infinite',
    }} />
    {/* Orbit ring 1 */}
    <div style={{
      position: 'absolute', inset: '10%', borderRadius: '50%',
      border: '1px solid rgba(244,114,22,0.15)',
    }} />
    {/* Orbit ring 2 */}
    <div style={{
      position: 'absolute', inset: '25%', borderRadius: '50%',
      border: '1px dashed rgba(59,158,255,0.2)',
    }} />
    {/* Sun core */}
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 100, height: 100, borderRadius: '50%',
      background: 'radial-gradient(circle, #FFD700 0%, #F47216 50%, #FF6B2B 100%)',
      boxShadow: '0 0 40px rgba(244,114,22,0.8), 0 0 80px rgba(244,114,22,0.4), 0 0 120px rgba(244,114,22,0.2)',
      animation: 'float 5s ease-in-out infinite',
    }} />
    {/* Satellite — Aditya-L1 */}
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 0, height: 0,
      animation: 'orbit 12s linear infinite',
    }}>
      <div style={{
        position: 'absolute', top: -10, left: -10,
        width: 20, height: 20,
        background: 'var(--gradient-blue)',
        borderRadius: 4,
        boxShadow: '0 0 12px rgba(59,158,255,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10,
      }}>🛰️</div>
    </div>
    {/* Data pulse */}
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 110, height: 110, borderRadius: '50%',
      border: '2px solid rgba(244,114,22,0.4)',
      animation: 'pulse-ring 2s infinite',
    }} />
    {/* Label */}
    <div style={{
      position: 'absolute', bottom: '8%', left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '0.7rem', fontWeight: 700,
      color: 'rgba(59,158,255,0.8)', letterSpacing: '0.1em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      Aditya-L1 @ L1 Point
    </div>
  </div>
);

const CountdownUnit = ({ val, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800,
      color: 'var(--text-primary)',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-soft)',
      borderRadius: 12, padding: '12px 20px',
      minWidth: 72,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {String(val ?? 0).padStart(2, '0')}
    </div>
    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 8 }}>
      {label}
    </div>
  </div>
);

const HackathonHero = ({ onJoin }) => {
  const { d, h, m, s } = useCountdown();
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', zIndex: 1,
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', top: '-10%', left: '-10%',
        background: 'radial-gradient(circle, rgba(244,114,22,0.12) 0%, transparent 70%)',
        animation: 'glow-flare 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', bottom: '-5%', right: '-5%',
        background: 'radial-gradient(circle, rgba(59,158,255,0.1) 0%, transparent 70%)',
        animation: 'glow-flare 10s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 64, alignItems: 'center', width: '100%',
      }}>
        {/* Left: text */}
        <div style={{ animation: 'fadeInLeft 0.8s ease both' }}>
          {/* Mission badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div className="badge badge-orange">
              <span className="live-dot" />
              ISRO Aditya-L1
            </div>
            <div className="badge badge-blue">Hackathon 2026</div>
          </div>

          <h1 className="display-1" style={{ marginBottom: 24, lineHeight: 1.05 }}>
            Predict<br />
            <span className="gradient-text-orange">Solar Flares</span><br />
            from Space
          </h1>

          <p className="body-lg" style={{ color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 480 }}>
            Use real Aditya-L1 X-ray instrument data — <strong style={{ color: 'var(--text-primary)' }}>SoLEXS</strong> and <strong style={{ color: 'var(--text-primary)' }}>HEL1OS</strong> — to build ML models that forecast M/X-class solar flares up to 24 hours ahead.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            <button className="btn btn-primary" id="hero-join-btn" onClick={onJoin} style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <Zap size={18} />
              Join Challenge
            </button>
            <a href="https://pradan.issdc.gov.in" target="_blank" rel="noreferrer" className="btn btn-secondary" id="hero-data-btn">
              <Download size={18} />
              Get Data
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Countdown */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              Challenge Closes In
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <CountdownUnit val={d} label="Days" />
              <span style={{ fontSize: '2rem', color: 'var(--text-muted)', fontWeight: 300, paddingBottom: 24 }}>:</span>
              <CountdownUnit val={h} label="Hours" />
              <span style={{ fontSize: '2rem', color: 'var(--text-muted)', fontWeight: 300, paddingBottom: 24 }}>:</span>
              <CountdownUnit val={m} label="Min" />
              <span style={{ fontSize: '2rem', color: 'var(--text-muted)', fontWeight: 300, paddingBottom: 24 }}>:</span>
              <CountdownUnit val={s} label="Sec" />
            </div>
          </div>
        </div>

        {/* Right: solar orbit visual */}
        <div style={{ animation: 'fadeInRight 0.8s ease both 0.2s', animationFillMode: 'both' }}>
          <SunOrbit />

          {/* Quick stats below orbit */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24 }}>
            {[
              { val: '2–150', unit: 'keV', label: 'Energy Coverage' },
              { val: '2s', unit: '', label: 'SoLEXS Cadence' },
              { val: '24h', unit: '', label: 'Forecast Window' },
            ].map(({ val, unit, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
                  color: 'var(--text-primary)' }}>
                  {val}<span style={{ fontSize: '0.9rem', color: 'var(--solar-orange)' }}>{unit}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'float 2s ease-in-out infinite',
      }}>
        <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, transparent, var(--solar-orange))' }} />
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em',
          textTransform: 'uppercase', fontWeight: 600 }}>Scroll</div>
      </div>
    </section>
  );
};

export default HackathonHero;
