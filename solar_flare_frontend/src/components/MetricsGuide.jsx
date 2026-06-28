import React, { useState } from 'react';

const METRICS = [
  {
    id: 'tss',
    name: 'True Skill Statistic',
    abbr: 'TSS',
    color: '#00C9A7',
    range: '−1 to +1',
    ideal: '+1 = perfect',
    formula: 'TSS = TPR + TNR − 1',
    formulaFull: 'TSS = TP/(TP+FN) + TN/(TN+FP) − 1',
    description: 'The recommended primary metric for solar flare forecasting. Insensitive to class imbalance, making it ideal when flares are rare. A value > 0.4 is generally considered skillful.',
    when: 'Use when class imbalance is severe (rare flares). Recommended by Bloomfield et al. (2012).',
    icon: '🎯',
  },
  {
    id: 'hss',
    name: 'Heidke Skill Score',
    abbr: 'HSS',
    color: '#3B9EFF',
    range: '−∞ to +1',
    ideal: '+1 = perfect',
    formula: 'HSS = 2(TP·TN − FN·FP) / [(TP+FN)(FN+TN) + (TP+FP)(FP+TN)]',
    formulaFull: 'HSS = (Correct − Chance) / (Total − Chance)',
    description: 'Measures skill relative to random chance. Sensitive to base rate and class imbalance — less reliable for rare events than TSS. Commonly reported alongside TSS for comparison.',
    when: 'Useful for balanced datasets. Compare with TSS to check for bias from class imbalance.',
    icon: '📐',
  },
  {
    id: 'f1',
    name: 'F1 Score',
    abbr: 'F1',
    color: '#A78BFA',
    range: '0 to 1',
    ideal: '1 = perfect',
    formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
    formulaFull: 'F1 = 2TP / (2TP + FP + FN)',
    description: 'Harmonic mean of Precision and Recall. Good for balancing false positives vs. false negatives. Ignores true negatives — so be cautious when the dominant class matters.',
    when: 'Use when you want to balance false alarms vs. missed flares. Pair with TSS for full picture.',
    icon: '⚖️',
  },
  {
    id: 'rmse',
    name: 'Root Mean Squared Error',
    abbr: 'RMSE',
    color: '#FFB347',
    range: '0 to ∞',
    ideal: '0 = perfect',
    formula: 'RMSE = √( 1/n × Σ(ŷᵢ − yᵢ)² )',
    formulaFull: 'RMSE = √( mean( (y_pred − y_true)² ) )',
    description: 'For regression tasks (predicting peak flux magnitude). Penalizes large errors. Pair with Pearson correlation to measure directional skill.',
    when: 'Use for flux prediction or multi-class regression, not binary classification.',
    icon: '📏',
  },
];

const ConfusionMatrix = ({ color }) => {
  const cells = [
    { label: 'TP', desc: 'Flare predicted\n& occurred', bg: `${color}20`, border: `${color}50`, corner: 'top-left good' },
    { label: 'FP', desc: 'Predicted flare,\nnone occurred', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)', corner: 'top-right bad' },
    { label: 'FN', desc: 'Missed flare\n(no prediction)', bg: 'rgba(255,100,0,0.1)', border: 'rgba(255,100,0,0.3)', corner: 'bottom-left bad' },
    { label: 'TN', desc: 'Quiet sun,\ncorrect', bg: `${color}10`, border: `${color}30`, corner: 'bottom-right good' },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 12,
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
        Confusion Matrix
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {cells.map(({ label, desc, bg, border }) => (
          <div key={label} style={{
            padding: '14px 10px', textAlign: 'center', borderRadius: 8,
            background: bg, border: `1px solid ${border}`,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800,
              color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
              {desc}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 2 }}>
        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '4px' }}>
          ← Predicted Flare
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', padding: '4px' }}>
          Predicted Quiet →
        </div>
      </div>
    </div>
  );
};

const MetricsGuide = () => {
  const [active, setActive] = useState('tss');
  const selected = METRICS.find(m => m.id === active);

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Evaluation</div>
          <h2 className="section-title">Performance Metrics</h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Standard flare forecast evaluation metrics. TSS is the primary recommended metric for imbalanced solar event data.
          </p>
        </div>

        {/* Metric cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {METRICS.map(m => (
            <div
              key={m.id}
              id={`metric-card-${m.id}`}
              onClick={() => setActive(m.id)}
              className="glass-card"
              style={{
                cursor: 'pointer', textAlign: 'center',
                border: active === m.id ? `1px solid ${m.color}60` : '1px solid var(--border-subtle)',
                boxShadow: active === m.id ? `0 8px 30px ${m.color}20` : 'var(--shadow-card)',
                transform: active === m.id ? 'translateY(-4px)' : 'none',
                transition: 'all 0.25s ease',
                padding: '20px 16px',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{m.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800,
                color: m.color, marginBottom: 4,
              }}>{m.abbr}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>
                {m.name}
              </div>
              <div style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--text-secondary)',
                background: `${m.color}12`, border: `1px solid ${m.color}25`,
                borderRadius: 6, padding: '4px 8px' }}>
                {m.ideal}
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div key={selected.id} style={{ animation: 'fadeInUp 0.2s ease both' }}>
            <div className="glass-card" style={{
              border: `1px solid ${selected.color}25`,
              boxShadow: `0 8px 40px ${selected.color}10`,
            }}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <span style={{ fontSize: '2rem' }}>{selected.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                        fontWeight: 800, color: selected.color }}>{selected.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Range: {selected.range}
                      </div>
                    </div>
                  </div>

                  {/* Formula box */}
                  <div style={{
                    background: '#0d1117', border: `1px solid ${selected.color}30`,
                    borderRadius: 10, padding: '16px 20px', marginBottom: 16,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6,
                      fontFamily: 'var(--font-body)', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em' }}>Formula</div>
                    <div style={{ fontSize: '1rem', color: selected.color, fontWeight: 700 }}>
                      {selected.formula}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7B90B8', marginTop: 6 }}>
                      {selected.formulaFull}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                    marginBottom: 16 }}>
                    {selected.description}
                  </p>

                  <div style={{
                    padding: '12px 16px', background: `${selected.color}08`,
                    border: `1px solid ${selected.color}20`, borderRadius: 8,
                    fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                  }}>
                    <span style={{ color: selected.color, fontWeight: 700 }}>When to use: </span>
                    {selected.when}
                  </div>
                </div>

                {/* Confusion matrix */}
                <div style={{ flex: '0 0 220px' }}>
                  <ConfusionMatrix color={selected.color} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MetricsGuide;
