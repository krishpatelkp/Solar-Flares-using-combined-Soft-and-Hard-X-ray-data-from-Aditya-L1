import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

function SystemConfig() {
  const [config, setConfig] = useState({
    sigmaMultiplier: 3,
    baselineWindowMin: 5,
    neupertCorrelationThreshold: 0.85,
    apiEndpoint: 'https://pradan.issdc.gov.in/api',
  });

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Mock save action
    alert('System configuration updated successfully!');
  };

  return (
    <div className="glass-card" style={{ padding: '24px', maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings color="#00C9A7" />
        System Configuration
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Sigma Multiplier Threshold (σ)
          </label>
          <input 
            type="number" 
            name="sigmaMultiplier" 
            value={config.sigmaMultiplier} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} 
          />
          <small style={{ color: 'var(--text-secondary)' }}>Trigger when flux &gt; μ + σ*std</small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Baseline Sliding Window (minutes)
          </label>
          <input 
            type="number" 
            name="baselineWindowMin" 
            value={config.baselineWindowMin} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Neupert Effect Correlation Threshold
          </label>
          <input 
            type="number" 
            step="0.01"
            name="neupertCorrelationThreshold" 
            value={config.neupertCorrelationThreshold} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            PRADAN Data API Endpoint
          </label>
          <input 
            type="text" 
            name="apiEndpoint" 
            value={config.apiEndpoint} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} 
          />
        </div>

        <button onClick={handleSave} style={{
          marginTop: '16px',
          padding: '12px',
          background: '#F47216',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Save size={18} /> Save Configuration
        </button>
      </div>
    </div>
  );
}

export default SystemConfig;
