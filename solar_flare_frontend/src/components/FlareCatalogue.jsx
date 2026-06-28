import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { getFlares } from '../services/api';

const CLASS_COLORS = {
  A: { color: '#4ADE80', bg: 'rgba(74,222,128,0.15)' },
  B: { color: '#22D3EE', bg: 'rgba(34,211,238,0.15)' },
  C: { color: '#FACC15', bg: 'rgba(250,204,21,0.15)' },
  M: { color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
  X: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

// Fallback mock flares if API not available
const MOCK_FLARES = [
  { id: 'FL-001', peak_time: '2025-06-15T14:23:00Z', goes_class: 'M2.1', peak_sxr_flux: 2.1e-5, neupert_score: 0.87 },
  { id: 'FL-002', peak_time: '2025-06-14T09:11:00Z', goes_class: 'X1.4', peak_sxr_flux: 1.4e-4, neupert_score: 0.94 },
  { id: 'FL-003', peak_time: '2025-06-13T21:45:00Z', goes_class: 'C9.2', peak_sxr_flux: 9.2e-6, neupert_score: 0.53 },
  { id: 'FL-004', peak_time: '2025-06-12T06:30:00Z', goes_class: 'M5.7', peak_sxr_flux: 5.7e-5, neupert_score: 0.91 },
  { id: 'FL-005', peak_time: '2025-06-11T18:02:00Z', goes_class: 'B7.3', peak_sxr_flux: 7.3e-7, neupert_score: 0.21 },
  { id: 'FL-006', peak_time: '2025-06-10T12:55:00Z', goes_class: 'M1.2', peak_sxr_flux: 1.2e-5, neupert_score: 0.78 },
  { id: 'FL-007', peak_time: '2025-06-09T03:44:00Z', goes_class: 'X2.8', peak_sxr_flux: 2.8e-4, neupert_score: 0.97 },
];

function FlareCatalogue() {
  const [flares, setFlares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('peak_time');
  const [sortDir, setSortDir] = useState('desc');
  const [filter, setFilter] = useState('all');

  const fetchCatalogue = async () => {
    setLoading(true);
    try {
      const data = await getFlares();
      setFlares(data?.length > 0 ? data : MOCK_FLARES);
    } catch {
      setFlares(MOCK_FLARES);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCatalogue(); }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const CLASS_LETTERS = ['X', 'M', 'C', 'B', 'A'];

  let displayed = [...flares];
  if (filter !== 'all') displayed = displayed.filter(f => f.goes_class.startsWith(filter));
  displayed.sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'peak_time') { va = new Date(va); vb = new Date(vb); }
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Database color="#F47216" size={22} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Master Flare Catalogue
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {displayed.length} events · SoLEXS + GOES cross-reference
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Class filter */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', ...CLASS_LETTERS].map(c => {
              const cfg = CLASS_COLORS[c];
              return (
                <button
                  key={c}
                  id={`catalogue-filter-${c}`}
                  onClick={() => setFilter(c)}
                  style={{
                    padding: '4px 10px', borderRadius: 6,
                    border: `1px solid ${filter === c && c !== 'all' ? cfg?.color + '60' : 'var(--border-subtle)'}`,
                    background: filter === c && c !== 'all' ? cfg?.bg : filter === c ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: filter === c && c !== 'all' ? cfg?.color : 'var(--text-secondary)',
                    fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              );
            })}
          </div>
          <button
            id="catalogue-refresh"
            onClick={fetchCatalogue}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin-slow 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>⏳</div>
          Loading catalogue from PRADAN...
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    { key: 'id', label: 'Event ID' },
                    { key: 'peak_time', label: 'Peak Time (UTC)' },
                    { key: 'goes_class', label: 'Class' },
                    { key: 'peak_sxr_flux', label: 'Peak SXR Flux' },
                    { key: 'neupert_score', label: 'Neupert Score' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {col.label}
                        <SortIcon col={col.key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(flare => {
                  const cls = flare.goes_class[0];
                  const cfg = CLASS_COLORS[cls] || CLASS_COLORS['C'];
                  const score = flare.neupert_score;
                  return (
                    <tr key={flare.id} id={`flare-row-${flare.id}`}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                          color: 'var(--text-muted)' }}>{flare.id}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {new Date(flare.peak_time).toLocaleString('en-US', { timeZone: 'UTC',
                          year: 'numeric', month: 'short', day: '2-digit',
                          hour: '2-digit', minute: '2-digit', hour12: false })} UTC
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 52, padding: '3px 10px', borderRadius: 6,
                          background: cfg.bg, color: cfg.color,
                          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem',
                          border: `1px solid ${cfg.color}40`,
                        }}>
                          {flare.goes_class}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem',
                          color: cfg.color }}>
                          {flare.peak_sxr_flux.toExponential(2)}
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem', marginLeft: 4 }}>W/m²</span>
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            height: 6, width: 80, background: 'rgba(255,255,255,0.06)',
                            borderRadius: 3, overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', width: `${score * 100}%`,
                              background: score > 0.8 ? '#00C9A7' : score > 0.5 ? '#F47216' : '#FF4444',
                              borderRadius: 3, transition: 'width 0.8s ease',
                            }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                            color: 'var(--text-secondary)' }}>{score.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlareCatalogue;
