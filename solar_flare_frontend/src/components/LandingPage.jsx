import React from 'react';
import { ExternalLink } from 'lucide-react';
import StarField from './StarField';
import HackathonHero from './HackathonHero';
import InstrumentCards from './InstrumentCards';
import PipelineFlow from './PipelineFlow';
import ModelComparison from './ModelComparison';
import DatasetTable from './DatasetTable';
import HackathonTimeline from './HackathonTimeline';
import CodeSnippets from './CodeSnippets';
import MetricsGuide from './MetricsGuide';

const SectionDivider = () => (
  <div style={{
    maxWidth: 1200, margin: '0 auto', padding: '0 32px',
  }}>
    <div className="section-divider" />
  </div>
);

const Footer = () => (
  <footer style={{
    position: 'relative', zIndex: 1,
    background: 'rgba(2, 8, 16, 0.9)',
    borderTop: '1px solid var(--border-subtle)',
    padding: '48px 32px',
  }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, marginBottom: 40, flexWrap: 'wrap' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-solar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: '0 0 16px rgba(244,114,22,0.4)',
            }}>🛰️</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
              background: 'linear-gradient(90deg, #F47216, #FFB347)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Aditya-L1 Hackathon
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            ISRO Space Weather Challenge 2026. Predict solar flares using India's first solar mission data.
          </p>
        </div>

        {/* Links */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
            color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 16 }}>Data Sources</div>
          {[
            { label: 'ISSDC PRADAN Portal', url: 'https://pradan.issdc.gov.in' },
            { label: 'NOAA SWPC Flare Reports', url: 'https://www.swpc.noaa.gov/products/solar-flare-reports' },
            { label: 'GOES XRS Data', url: 'https://www.ngdc.noaa.gov/stp/satellite/goes/' },
            { label: 'SunPy Documentation', url: 'https://docs.sunpy.org' },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 8,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#3B9EFF'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              <ExternalLink size={12} /> {label}
            </a>
          ))}
        </div>

        {/* Challenge info */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
            color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 16 }}>Challenge</div>
          {[
            '🛰️ Instruments: SoLEXS & HEL1OS',
            '📅 Duration: 2 weeks',
            '🎯 Goal: M/X-class 24h forecast',
            '📊 Metric: True Skill Statistic',
            '⚖️ Data: Open-science (ISRO/ISSDC)',
          ].map(item => (
            <div key={item} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          © 2026 Aditya-L1 Hackathon · Data courtesy ISRO/ISSDC · NOAA SWPC · Always cite your sources.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="#hero" style={{
            fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none',
          }}>↑ Back to top</a>
        </div>
      </div>
    </div>
  </footer>
);

const LandingPage = ({ onSwitchToDashboard }) => (
  <div className="landing-page">
    <StarField />

    {/* Hero */}
    <div id="hero" style={{ position: 'relative', zIndex: 1 }}>
      <HackathonHero onJoin={onSwitchToDashboard} />
    </div>

    <SectionDivider />

    {/* Instruments */}
    <InstrumentCards />

    <SectionDivider />

    {/* Pipeline */}
    <PipelineFlow />

    <SectionDivider />

    {/* Models */}
    <ModelComparison />

    <SectionDivider />

    {/* Datasets */}
    <DatasetTable />

    <SectionDivider />

    {/* Timeline */}
    <HackathonTimeline />

    <SectionDivider />

    {/* Code */}
    <CodeSnippets />

    <SectionDivider />

    {/* Metrics */}
    <MetricsGuide />

    {/* Footer */}
    <Footer />
  </div>
);

export default LandingPage;
