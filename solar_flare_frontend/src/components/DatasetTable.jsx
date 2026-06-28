import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

const DATASETS = [
  {
    name: 'SoLEXS Level-2',
    content: 'Soft X-ray spectra (2–22 keV)',
    period: '2025 (full year)',
    format: 'FITS / CSV',
    size: '~40 MB/mo',
    access: 'https://pradan.issdc.gov.in',
    notes: '2-s binned spectra, calibrated counts → flux',
    color: '#F47216',
    icon: '☀️',
  },
  {
    name: 'HEL1OS Level-2',
    content: 'Hard X-ray counts (10–150 keV)',
    period: '2025 (full year)',
    format: 'FITS (OGIP)',
    size: '~80 MB/mo',
    access: 'https://pradan.issdc.gov.in',
    notes: '1-s light curves, CdTe & CZT channels separate',
    color: '#3B9EFF',
    icon: '⚡',
  },
  {
    name: 'GOES XRS Flux',
    content: 'Solar flux (1–8 Å, 0.5–4 Å)',
    period: '2025 (full year)',
    format: 'NetCDF / ASCII',
    size: '~5 MB/mo',
    access: 'https://www.ngdc.noaa.gov/stp/satellite/goes/',
    notes: '1-min cadence; GOES-16/18 primary; cross-calibration reference',
    color: '#00C9A7',
    icon: '🛰️',
  },
  {
    name: 'NOAA Flare Catalog',
    content: 'Flare start/peak/end + class',
    period: '2025',
    format: 'CSV / JSON',
    size: '< 1 MB',
    access: 'https://www.swpc.noaa.gov/products/solar-flare-reports',
    notes: 'Official A–X classification labels; use for supervised targets',
    color: '#A78BFA',
    icon: '📋',
  },
  {
    name: 'Kaggle SoLEXS Sample',
    content: 'Pre-packaged SoLEXS lightcurves',
    period: 'Selected periods',
    format: 'CSV',
    size: '< 50 MB',
    access: 'https://www.kaggle.com',
    notes: 'Great for quick-start; no PRADAN registration needed',
    color: '#FFB347',
    icon: '🐠',
  },
  {
    name: 'SDO/HMI SHARP (Optional)',
    content: 'Magnetogram SHARP parameters',
    period: '2025',
    format: 'FITS',
    size: '> 500 MB',
    access: 'http://jsoc.stanford.edu/ajax/lookdata.html',
    notes: 'Add magnetic complexity features for bonus track',
    color: '#7B90B8',
    icon: '🧲',
  },
];

const DatasetTable = () => (
  <section className="section" style={{ zIndex: 1, position: 'relative' }}>
    <div className="section-inner">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label">Datasets</div>
        <h2 className="section-title">Starter Dataset Catalog</h2>
        <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
          Recommended minimal dataset for a hackathon submission targeting M/X-class 24-hour flare forecasting.
        </p>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Dataset</th>
                <th>Content</th>
                <th>Period</th>
                <th>Format</th>
                <th>Size</th>
                <th>Notes</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {DATASETS.map((d, i) => (
                <tr key={d.name} style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={{ textAlign: 'center', fontSize: '1.2rem' }}>{d.icon}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: d.color, whiteSpace: 'nowrap' }}>{d.name}</div>
                  </td>
                  <td style={{ maxWidth: 200, fontSize: '0.85rem' }}>{d.content}</td>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{d.period}</td>
                  <td>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                      background: `${d.color}15`, color: d.color,
                      border: `1px solid ${d.color}30`, padding: '2px 8px', borderRadius: 4,
                    }}>{d.format}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.size}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 220 }}>
                    {d.notes}
                  </td>
                  <td>
                    <a
                      href={d.access}
                      target="_blank"
                      rel="noreferrer"
                      id={`dataset-link-${d.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '5px 12px', borderRadius: 6,
                        background: 'rgba(59,158,255,0.1)',
                        border: '1px solid rgba(59,158,255,0.25)',
                        color: '#3B9EFF', fontSize: '0.75rem', fontWeight: 600,
                        textDecoration: 'none', transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <ExternalLink size={12} />
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div style={{
        marginTop: 20, padding: '12px 20px',
        background: 'rgba(244,114,22,0.06)', border: '1px solid rgba(244,114,22,0.2)',
        borderRadius: 10, fontSize: '0.85rem', color: 'var(--text-secondary)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
        <span>
          <strong style={{ color: 'var(--solar-orange)' }}>PRADAN registration required</strong> for SoLEXS & HEL1OS data. Registration is free and scientific in nature. GOES and NOAA catalog data are fully open access. Always cite ISRO/ISSDC in published work.
        </span>
      </div>
    </div>
  </section>
);

export default DatasetTable;
