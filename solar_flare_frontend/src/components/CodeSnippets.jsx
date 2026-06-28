import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const highlightPython = (code) => {
  // Simple token-based highlighter
  const tokens = [];
  const lines = code.split('\n');
  return lines.map((line, li) => {
    // Comments
    if (line.trimStart().startsWith('#')) {
      return (
        <div key={li}>
          <span className="syn-comment">{line}</span>
        </div>
      );
    }
    // keyword highlighting via regex replace on the raw string
    const rendered = line
      .replace(/\b(import|from|as|def|return|if|else|elif|for|in|with|class|and|or|not|True|False|None|async|await|lambda|yield)\b/g, (m) => `<KW>${m}</KW>`)
      .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, (m) => `<STR>${m}</STR>`)
      .replace(/\b(\d+[\d.e+\-]*)\b/g, (m) => `<NUM>${m}</NUM>`)
      .replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, (m, fn) => `<FN>${fn}</FN>(`)
      .split(/(<KW>.*?<\/KW>|<STR>.*?<\/STR>|<NUM>.*?<\/NUM>|<FN>.*?<\/FN>)/);

    return (
      <div key={li}>
        {rendered.map((part, pi) => {
          if (part.startsWith('<KW>')) return <span key={pi} className="syn-keyword">{part.replace(/<\/?KW>/g, '')}</span>;
          if (part.startsWith('<STR>')) return <span key={pi} className="syn-string">{part.replace(/<\/?STR>/g, '')}</span>;
          if (part.startsWith('<NUM>')) return <span key={pi} className="syn-number">{part.replace(/<\/?NUM>/g, '')}</span>;
          if (part.startsWith('<FN>')) return <span key={pi} className="syn-function">{part.replace(/<\/?FN>/g, '')}</span>;
          return <span key={pi}>{part}</span>;
        })}
      </div>
    );
  });
};

const CodeSnippet = ({ title, lang = 'python', code, id }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block" id={id}>
      <div className="code-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="code-dots">
            <div className="code-dot" style={{ background: '#FF5F56' }} />
            <div className="code-dot" style={{ background: '#FFBD2E' }} />
            <div className="code-dot" style={{ background: '#27C93F' }} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#3B9EFF',
            background: 'rgba(59,158,255,0.1)', padding: '2px 8px',
            borderRadius: 4, border: '1px solid rgba(59,158,255,0.2)',
          }}>{lang}</span>
          <button
            onClick={handleCopy}
            id={`${id}-copy`}
            style={{
              background: copied ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? 'rgba(0,201,167,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 6, padding: '4px 10px',
              color: copied ? '#00C9A7' : 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="code-content">
        {/* Line numbers + code */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ color: '#3D4A5C', userSelect: 'none', textAlign: 'right', minWidth: 24 }}>
            {code.split('\n').map((_, i) => (
              <div key={i} style={{ lineHeight: '1.6' }}>{i + 1}</div>
            ))}
          </div>
          <pre style={{ flex: 1, margin: 0, overflow: 'visible', whiteSpace: 'pre-wrap' }}>
            {highlightPython(code)}
          </pre>
        </div>
      </div>
    </div>
  );
};

const GOES_CODE = `from sunpy.net import Fido, attrs as a
from sunpy.time import TimeRange

# Search GOES XRS data (1–8 Å channel) for a 1-day interval
timerange = TimeRange('2025-01-01 00:00', '2025-01-02 00:00')
result = Fido.search(a.Time(timerange), a.Instrument.xrs)
files = Fido.fetch(result)  # Downloads FITS files locally

# Read the GOES flux using SunPy
import sunpy
goes_data = sunpy.io.read_file(files[0])
print(goes_data)`;

const RF_CODE = `import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load precomputed features (flux history, hardness ratio, gradients)
df = pd.read_csv('features.csv')
X = df.drop('label', axis=1)   # 1 = M/X-class flare in next 24h
y = df['label']

# Walk-forward split — train past, test future
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False
)

clf = RandomForestClassifier(
    n_estimators=200, class_weight='balanced', random_state=42
)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)
print(classification_report(y_test, preds))`;

const TSS_CODE = `import numpy as np
from sklearn.metrics import confusion_matrix

def true_skill_statistic(y_true, y_pred):
    """Compute TSS = TPR + TNR - 1 (range: -1 to 1, 1=perfect)."""
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    tpr = tp / (tp + fn)   # Sensitivity / recall
    tnr = tn / (tn + fp)   # Specificity
    return tpr + tnr - 1

tss = true_skill_statistic(y_test, preds)
print(f"True Skill Statistic (TSS): {tss:.3f}")
# TSS > 0.4 is generally considered skillful for flare forecasting`;

const CodeSnippets = () => {
  const [tab, setTab] = useState('goes');
  const snippets = {
    goes: { title: 'data_access.py', code: GOES_CODE },
    rf: { title: 'baseline_model.py', code: RF_CODE },
    tss: { title: 'evaluation_metrics.py', code: TSS_CODE },
  };

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Starter Code</div>
          <h2 className="section-title">Jump-Start Your Pipeline</h2>
          <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
            Copy-paste ready Python snippets to get from zero to a working model in minutes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { id: 'goes', label: '📡 Data Access', subtitle: 'Download GOES XRS' },
            { id: 'rf', label: '🌲 Baseline Model', subtitle: 'Random Forest classifier' },
            { id: 'tss', label: '📊 TSS Metric', subtitle: 'True Skill Statistic' },
          ].map(({ id, label, subtitle }) => (
            <button
              key={id}
              id={`snippet-tab-${id}`}
              onClick={() => setTab(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                border: `1px solid ${tab === id ? 'rgba(59,158,255,0.4)' : 'var(--border-subtle)'}`,
                background: tab === id ? 'rgba(59,158,255,0.1)' : 'transparent',
                color: tab === id ? '#3B9EFF' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-body)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>
            </button>
          ))}
        </div>

        <CodeSnippet
          id={`snippet-${tab}`}
          key={tab}
          title={snippets[tab].title}
          lang="python"
          code={snippets[tab].code}
        />

        <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          💡 Requires: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>sunpy</code>,{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>astropy</code>,{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>scikit-learn</code>,{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>pandas</code>
        </p>
      </div>
    </section>
  );
};

export default CodeSnippets;
