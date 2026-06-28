import React from 'react';

const PHASES = [
  {
    section: '🗂️ Data Preparation',
    color: '#3B9EFF',
    tasks: [
      { label: 'Acquire Aditya-L1 & GOES data', start: 0, duration: 14, done: true },
      { label: 'Clean & align time-series', start: 14, duration: 28, done: true },
      { label: 'Feature engineering (rolling stats)', start: 28, duration: 21, done: false },
    ],
  },
  {
    section: '🧠 Modeling',
    color: '#A78BFA',
    tasks: [
      { label: 'Baseline model (threshold + RF)', start: 28, duration: 21, done: false },
      { label: 'ML/DL training & tuning', start: 42, duration: 35, done: false },
      { label: 'Physics-informed constraints', start: 63, duration: 28, done: false },
    ],
  },
  {
    section: '📊 Evaluation & Wrap-up',
    color: '#00C9A7',
    tasks: [
      { label: 'Compute TSS/HSS metrics & refine', start: 84, duration: 14, done: false },
      { label: 'Visualization & report prep', start: 91, duration: 21, done: false },
    ],
  },
];

const TOTAL = 112; // 16 days in % units

const DAYS = Array.from({ length: 15 }, (_, i) => `D${i + 1}`);

const HackathonTimeline = () => (
  <section className="section" style={{ zIndex: 1, position: 'relative' }}>
    <div className="section-inner">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label">Timeline</div>
        <h2 className="section-title">2-Week Sprint Plan</h2>
        <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
          A suggested hackathon timeline. Tasks can overlap; adjust based on your team size.
        </p>
      </div>

      <div className="glass-card">
        {/* Header row */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 4, paddingLeft: 220 }}>
          {DAYS.map(d => (
            <div key={d} style={{
              flex: `0 0 ${100 / 14}%`,
              fontSize: '0.65rem', fontWeight: 700,
              color: 'var(--text-muted)', textAlign: 'center',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{d}</div>
          ))}
        </div>

        {/* Gantt rows */}
        {PHASES.map(phase => (
          <div key={phase.section} style={{ marginBottom: 20 }}>
            {/* Phase header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 10, paddingBottom: 8,
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: phase.color, boxShadow: `0 0 8px ${phase.color}`,
              }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {phase.section}
              </span>
            </div>

            {phase.tasks.map(task => (
              <div key={task.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                {/* Label */}
                <div style={{
                  minWidth: 200, fontSize: '0.8rem',
                  color: 'var(--text-secondary)', textAlign: 'right',
                }}>
                  {task.done ? (
                    <span style={{ color: '#00C9A7' }}>✓ </span>
                  ) : null}
                  {task.label}
                </div>
                {/* Track */}
                <div style={{
                  flex: 1, height: 28, position: 'relative',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 4,
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${(task.start / TOTAL) * 100}%`,
                    width: `${(task.duration / TOTAL) * 100}%`,
                    height: '100%',
                    background: task.done
                      ? `linear-gradient(90deg, ${phase.color}90, ${phase.color}50)`
                      : `linear-gradient(90deg, ${phase.color}60, ${phase.color}30)`,
                    borderRadius: 4,
                    border: `1px solid ${phase.color}40`,
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                    fontSize: '0.7rem', fontWeight: 600, color: phase.color,
                    overflow: 'hidden', whiteSpace: 'nowrap',
                    animation: 'count-bar 1s ease both',
                    '--target-width': `${(task.duration / TOTAL) * 100}%`,
                    boxShadow: task.done ? `0 0 10px ${phase.color}30` : 'none',
                  }}>
                    {task.done ? '✓ Done' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 24, height: 8, borderRadius: 2,
              background: 'rgba(0,201,167,0.5)', border: '1px solid rgba(0,201,167,0.4)' }} />
            Completed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 24, height: 8, borderRadius: 2,
              background: 'rgba(59,158,255,0.3)', border: '1px solid rgba(59,158,255,0.3)' }} />
            Upcoming
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Dates are illustrative. Tasks can overlap.
          </div>
        </div>
      </div>

      {/* Challenge tasks */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem',
          color: 'var(--text-primary)', marginBottom: 20 }}>
          📋 Subtasks by Track
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              track: 'Baseline Track',
              color: '#00C9A7',
              icon: '🎯',
              tasks: [
                'Threshold model: SXR > 1×10⁻⁵ → predict flare',
                'Persistence model (last observed class)',
                'Plot flux vs flare events on timeline',
                'Compute TSS vs climatology',
              ],
            },
            {
              track: 'ML Track',
              color: '#3B9EFF',
              icon: '🌲',
              tasks: [
                'Engineer features (hardness, gradients, stats)',
                'Train Random Forest / XGBoost',
                'Walk-forward cross-validation',
                'Feature importance analysis',
              ],
            },
            {
              track: 'Advanced Track',
              color: '#A78BFA',
              icon: '🧠',
              tasks: [
                'Build LSTM on raw multi-channel X-ray',
                'Compare to ML baseline via TSS',
                'ROC curve + reliability diagram',
                '(Bonus) Physics-informed constraints',
              ],
            },
          ].map(({ track, color, icon, tasks }) => (
            <div key={track} className="glass-card" style={{
              border: `1px solid ${color}25`,
              boxShadow: `0 4px 20px ${color}10`,
              padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                  color: color, fontSize: '0.95rem' }}>{track}</div>
              </div>
              {tasks.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '6px 0', borderBottom: i < tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <span style={{ color: color, fontSize: '0.7rem', marginTop: 3, flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HackathonTimeline;
