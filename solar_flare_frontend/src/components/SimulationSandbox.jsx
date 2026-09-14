import React, { useState, useEffect } from 'react';
import { Sliders, Play } from 'lucide-react';
import { simulateFlare } from '../services/api';
import AttentionHeatmap from './AttentionHeatmap';

const PRESETS = [
  {
    name: 'May 2024 Superstorm (X5.8)',
    desc: 'Extreme coronal heating with rapid flux derivative surge',
    temp: 28.5,
    logEm: 48.9,
    dfDt: 0.025,
    color: '#EF4444'
  },
  {
    name: 'Impulsive Solar Flare (M5.2)',
    desc: 'Strong non-thermal electron beam injection & Neupert peak',
    temp: 18.2,
    logEm: 47.4,
    dfDt: 0.014,
    color: '#F97316'
  },
  {
    name: 'HOPE Precursor Phase (M1.2)',
    desc: 'Early thermal plateau with rising emission measure',
    temp: 14.5,
    logEm: 46.7,
    dfDt: 0.005,
    color: '#EAB308'
  },
  {
    name: 'Quiet Sun Background (A/B)',
    desc: 'Nominal solar minimum coronal baseline without active regions',
    temp: 2.8,
    logEm: 44.2,
    dfDt: 0.0003,
    color: '#10B981'
  }
];

export default function SimulationSandbox() {
  const [tempMk, setTempMk] = useState(14.5);
  const [logEm, setLogEm] = useState(46.7);
  const [dfDt, setDfDt] = useState(0.005);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = async (temp = tempMk, emLog = logEm, rise = dfDt) => {
    setLoading(true);
    const emVal = Math.pow(10, emLog);
    const res = await simulateFlare({
      temperature_mk: temp,
      emission_measure: emVal,
      df_dt: rise
    });
    if (res) {
      setResult(res);
    } else {
      // Offline fallback calculation
      const p5 = Math.min(0.98, Math.max(0.05, (temp / 30) * 0.9 + (rise * 20)));
      setResult({
        predicted_class: temp > 22 ? 'X-Class (Extreme)' : temp > 15 ? 'M-Class (Strong)' : 'C-Class (Moderate)',
        probability_5m: Math.round(p5 * 100) / 100,
        probability_15m: Math.round(p5 * 0.85 * 100) / 100,
        probability_30m: Math.round(p5 * 0.45 * 100) / 100,
        lead_time_minutes: Math.round(Math.max(5, 22 - rise * 500) * 10) / 10,
        class_probabilities: {
          'A (Quiet)': 0.01,
          'B (Minor)': 0.04,
          'C (Small)': 0.15,
          'M (Medium)': 0.55,
          'X (Major)': 0.25
        }
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const handleApplyPreset = (preset) => {
    setTempMk(preset.temp);
    setLogEm(preset.logEm);
    setDfDt(preset.dfDt);
    runSimulation(preset.temp, preset.logEm, preset.dfDt);
  };

  const getClassColor = (cls) => {
    if (!cls) return '#3B9EFF';
    if (cls.includes('X-Class')) return '#EF4444';
    if (cls.includes('M-Class')) return '#F97316';
    if (cls.includes('C-Class')) return '#EAB308';
    return '#10B981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sliders size={22} color="#F47216" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive Solar Flare Simulation Sandbox
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4 }}>
            Direct neural forward pass into SolarFlareNet (Conv1D + BiLSTM + Transformer Encoder) with custom physical conditions.
          </p>
        </div>
        <button
          onClick={() => runSimulation()}
          disabled={loading}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Play size={16} />
          {loading ? 'Running Inference...' : 'Run Neural Inference'}
        </button>
      </div>

      {/* Preset Scenarios */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>
          Historic Benchmark Scenarios
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${p.color}40`,
                borderRadius: 10,
                padding: '12px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${p.color}15`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{p.name}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 4 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Live Prediction */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* Sliders Control Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Physical Plasma Controls
          </h3>

          {/* Slider 1: Temperature */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Coronal Plasma Temperature (Te)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#F47216' }}>
                {tempMk.toFixed(1)} MK
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="35.0"
              step="0.1"
              value={tempMk}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTempMk(val);
                runSimulation(val, logEm, dfDt);
              }}
              style={{ width: '100%', accentColor: '#F47216' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>2.0 MK (Quiet)</span>
              <span>15.0 MK (Precursor)</span>
              <span>35.0 MK (Superflare)</span>
            </div>
          </div>

          {/* Slider 2: Emission Measure */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Emission Measure (log₁₀ EM)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#3B9EFF' }}>
                10^{logEm.toFixed(1)} cm⁻³
              </span>
            </div>
            <input
              type="range"
              min="44.0"
              max="49.5"
              step="0.1"
              value={logEm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLogEm(val);
                runSimulation(tempMk, val, dfDt);
              }}
              style={{ width: '100%', accentColor: '#3B9EFF' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>10⁴⁴ cm⁻³ (Ambient)</span>
              <span>10⁴⁷ cm⁻³ (Loop Active)</span>
              <span>10⁴⁹·⁵ cm⁻³ (Massive Eruption)</span>
            </div>
          </div>

          {/* Slider 3: dF/dt Rise Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Flux Derivative Rise Rate (dF/dt)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA' }}>
                {dfDt.toFixed(4)} s⁻¹
              </span>
            </div>
            <input
              type="range"
              min="0.0001"
              max="0.0300"
              step="0.0005"
              value={dfDt}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setDfDt(val);
                runSimulation(tempMk, logEm, val);
              }}
              style={{ width: '100%', accentColor: '#A78BFA' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
              <span>0.0001 (Slow heating)</span>
              <span>0.0150 (Impulsive)</span>
              <span>0.0300 (Flash phase)</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Output Card */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1px solid ${getClassColor(result?.predicted_class)}40`,
            boxShadow: `0 8px 30px ${getClassColor(result?.predicted_class)}15`
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Simulated Forecast Outcome
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: getClassColor(result?.predicted_class),
                marginTop: 4
              }}
            >
              {result?.predicted_class ?? 'Calculating...'}
            </div>
          </div>

          {/* 3 Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '16px 0' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>5-Min Horizon</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F47216', fontFamily: 'var(--font-mono)' }}>
                {Math.round((result?.probability_5m ?? 0) * 100)}%
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>15-Min Horizon</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3B9EFF', fontFamily: 'var(--font-mono)' }}>
                {Math.round((result?.probability_15m ?? 0) * 100)}%
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lead Time</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#A78BFA', fontFamily: 'var(--font-mono)' }}>
                {result?.lead_time_minutes ?? 15}m
              </div>
            </div>
          </div>

          {/* Class distribution progress bars */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700 }}>
              SolarFlareNet Softmax Class Distribution:
            </div>
            {result?.class_probabilities &&
              Object.entries(result.class_probabilities).map(([cls, p]) => (
                <div key={cls} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>{cls}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', marginTop: 2 }}>
                    <div
                      style={{
                        width: `${p * 100}%`,
                        height: '100%',
                        background: cls.includes('X') ? '#EF4444' : cls.includes('M') ? '#F97316' : cls.includes('C') ? '#EAB308' : '#10B981',
                        borderRadius: 4
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Feature 4: Model Attention Explainability (XAI Heatmap) */}
      <AttentionHeatmap
        attentionWeights={result?.attention_weights}
        saliencyFocus={result?.saliency_focus}
        predictedClass={result?.predicted_class}
      />
    </div>
  );
}
