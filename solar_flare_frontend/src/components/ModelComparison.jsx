import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const MODELS = [
  {
    id: 'statistical',
    title: 'Statistical',
    icon: '📉',
    color: '#00C9A7',
    examples: ['Poisson Regression', 'ARIMA', 'Persistence Model', 'Climatology'],
    compute: 'Low (CPU)',
    computeLevel: 1,
    pros: [
      'Interpretable and transparent',
      'Fast training on small datasets',
      'Strong baselines for benchmarking',
      'No GPU required',
    ],
    cons: [
      'Assumes linear / stationary processes',
      'Cannot capture complex nonlinearity',
      'Requires manual feature selection',
      'Limited by hand-crafted input',
    ],
    badge: 'Baseline',
    badgeColor: '#00C9A7',
    rec: 'Start here. Establishes the performance floor every model must beat.',
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    icon: '🌲',
    color: '#3B9EFF',
    examples: ['Random Forest', 'XGBoost / LightGBM', 'SVM', 'Gradient Boosting'],
    compute: 'Moderate (CPU/GPU)',
    computeLevel: 2,
    pros: [
      'Flexible nonparametric learning',
      'Handles heterogeneous feature sets',
      'Feature importance for interpretability',
      'Robust to outliers & skew',
    ],
    cons: [
      'Still requires feature engineering',
      'Prone to overfit without tuning',
      'Sensitive to class imbalance',
      'Less effective on raw time series',
    ],
    badge: 'Recommended',
    badgeColor: '#3B9EFF',
    rec: 'Best bang-for-buck. RF/XGBoost on engineered features (hardness, gradients) is a strong hackathon submission.',
  },
  {
    id: 'dl',
    title: 'Deep Learning',
    icon: '🧠',
    color: '#A78BFA',
    examples: ['LSTM / GRU', '1D-CNN', 'Transformer', 'Multi-head Attention'],
    compute: 'High (GPU recommended)',
    computeLevel: 4,
    pros: [
      'Learns features from raw time series',
      'Captures long-range temporal patterns',
      'Multi-channel fusion (SXR + HXR)',
      'State-of-the-art on large datasets',
    ],
    cons: [
      'Data-hungry — overfitting risk',
      'Longer training time',
      'Harder to interpret (black box)',
      'Requires GPU for large models',
    ],
    badge: 'Advanced',
    badgeColor: '#A78BFA',
    rec: 'High potential if data volume is sufficient. Use with dropout, early stopping, and walk-forward validation.',
  },
  {
    id: 'piml',
    title: 'Physics-Informed ML',
    icon: '⚛️',
    color: '#FFB347',
    examples: ['Physics-informed NNs', 'Neupert-constrained LSTM', 'Energy-regularized RF', 'Hybrid PIML'],
    compute: 'High',
    computeLevel: 4,
    pros: [
      'Embeds physical constraints (E ∝ T)',
      'Better generalization with less data',
      'Reduces physically implausible outputs',
      'Improved TSS in studies',
    ],
    cons: [
      'Complex to design and implement',
      'Requires deep domain knowledge',
      'Fewer off-the-shelf libraries',
      'Ambitious for a hackathon sprint',
    ],
    badge: 'Bonus Track',
    badgeColor: '#FFB347',
    rec: 'For bonus points. Even adding simple physics constraints (non-negative flux, smoothness) can improve results.',
  },
];

const ComputeBar = ({ level }) => (
  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} style={{
        height: 4, flex: 1, borderRadius: 2,
        background: i < level ? '#A78BFA' : 'rgba(255,255,255,0.08)',
        transition: 'background 0.3s ease',
      }} />
    ))}
  </div>
);

const ModelComparison = () => {
  const [active, setActive] = useState('ml');
  const [view, setView] = useState('cards');
  const selected = MODELS.find(m => m.id === active);

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <div className="section-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="section-label">Models</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Forecasting Approaches</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['cards', 'table'].map(v => (
              <button
                key={v}
                className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-ghost'}`}
                id={`model-view-${v}`}
                onClick={() => setView(v)}
              >
                {v === 'cards' ? '⊞ Cards' : '☰ Table'}
              </button>
            ))}
          </div>
        </div>

        {view === 'cards' && (
          <>
            {/* Model selector tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  id={`model-tab-${m.id}`}
                  onClick={() => setActive(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 20px', borderRadius: 'var(--radius-full)',
                    border: `1px solid ${active === m.id ? m.color + '80' : 'var(--border-subtle)'}`,
                    background: active === m.id ? `${m.color}15` : 'transparent',
                    color: active === m.id ? m.color : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  {m.icon} {m.title}
                  <span style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                    background: `${m.badgeColor}25`, color: m.badgeColor, fontWeight: 700,
                  }}>{m.badge}</span>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            {selected && (
              <div key={selected.id} style={{ animation: 'fadeInUp 0.25s ease both' }}>
                <div className="glass-card" style={{
                  border: `1px solid ${selected.color}30`,
                  boxShadow: `0 8px 40px ${selected.color}15`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '3rem' }}>{selected.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                          fontWeight: 800, color: 'var(--text-primary)' }}>{selected.title}</h3>
                        <span className="badge" style={{ background: `${selected.badgeColor}20`,
                          color: selected.badgeColor, border: `1px solid ${selected.badgeColor}40` }}>
                          {selected.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                        {selected.rec}
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {selected.examples.map(ex => (
                          <span key={ex} style={{
                            padding: '4px 12px', borderRadius: 'var(--radius-full)',
                            background: `${selected.color}12`, color: selected.color,
                            border: `1px solid ${selected.color}30`,
                            fontSize: '0.78rem', fontWeight: 600,
                          }}>{ex}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ minWidth: 140 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                        Compute Needs
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {selected.compute}
                      </div>
                      <ComputeBar level={selected.computeLevel} />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <CheckCircle size={16} color="#00C9A7" />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#00C9A7' }}>Pros</span>
                      </div>
                      {selected.pros.map(p => (
                        <div key={p} style={{
                          padding: '8px 12px', marginBottom: 6,
                          background: 'rgba(0,201,167,0.06)', borderRadius: 8,
                          borderLeft: '3px solid rgba(0,201,167,0.4)',
                          fontSize: '0.85rem', color: 'var(--text-secondary)',
                        }}>{p}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <XCircle size={16} color="#FF6B6B" />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FF6B6B' }}>Cons</span>
                      </div>
                      {selected.cons.map(c => (
                        <div key={c} style={{
                          padding: '8px 12px', marginBottom: 6,
                          background: 'rgba(255,68,68,0.06)', borderRadius: 8,
                          borderLeft: '3px solid rgba(255,68,68,0.4)',
                          fontSize: '0.85rem', color: 'var(--text-secondary)',
                        }}>{c}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'table' && (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeInUp 0.2s ease both' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Model Class</th>
                    <th>Examples</th>
                    <th>Compute</th>
                    <th>Best Pros</th>
                    <th>Main Con</th>
                    <th>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, color: m.color }}>{m.title}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {m.examples.slice(0, 2).join(', ')}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.compute}</div>
                        <ComputeBar level={m.computeLevel} />
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 200 }}>
                        {m.pros[0]}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 200 }}>
                        {m.cons[0]}
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 'var(--radius-full)',
                          background: `${m.badgeColor}20`, color: m.badgeColor,
                          fontSize: '0.72rem', fontWeight: 700,
                          border: `1px solid ${m.badgeColor}40`,
                        }}>{m.badge}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ModelComparison;
