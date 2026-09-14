import React, { useState, useEffect } from 'react';
import { Activity, Radio, Database, Settings, CloudLightning, Globe, Sliders, ShieldAlert, FileText } from 'lucide-react';

import TelemetryChart from './components/TelemetryChart';
import ProbabilityGauge from './components/ProbabilityGauge';
import AlertPanel from './components/AlertPanel';
import NowcastAlerts from './components/NowcastAlerts';
import FlareCatalogue from './components/FlareCatalogue';
import SystemConfig from './components/SystemConfig';
import LandingPage from './components/LandingPage';
import SimulationSandbox from './components/SimulationSandbox';
import ThreatMatrix from './components/ThreatMatrix';
import AdvisoryBulletinModal from './components/AdvisoryBulletinModal';
import AttentionHeatmap from './components/AttentionHeatmap';
import { getForecast, triggerIngestion } from './services/api';

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNav = ({ mode, setMode, scrolled }) => (
  <nav className={`top-nav ${scrolled ? 'scrolled' : ''}`}>
    {/* Brand */}
    <a href="#hero" className="nav-brand" onClick={() => setMode('landing')}>
      <div className="nav-brand-icon">
        <CloudLightning size={20} color="#fff" />
      </div>
      <div>
        <div className="nav-brand-text">Aditya-L1</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: -2,
          fontFamily: 'var(--font-body)', letterSpacing: '0.08em' }}>
          SPACE WEATHER CHALLENGE
        </div>
      </div>
    </a>

    {/* Mode tabs */}
    <div className="nav-tabs">
      <button
        id="nav-tab-landing"
        className={`nav-tab ${mode === 'landing' ? 'active' : ''}`}
        onClick={() => setMode('landing')}
      >
        <Globe size={16} />
        Challenge Info
      </button>
      <button
        id="nav-tab-dashboard"
        className={`nav-tab ${mode === 'dashboard' ? 'active' : ''}`}
        onClick={() => setMode('dashboard')}
      >
        <Activity size={16} />
        Live Dashboard
      </button>
    </div>

    {/* Status */}
    <div className="nav-status">
      <span className="live-dot" />
      ADITYA-L1 ONLINE
    </div>
  </nav>
);

// ─── Dashboard Sidebar ────────────────────────────────────────────────────────
const Sidebar = ({ activeTab, setActiveTab, isIngesting, handleManualIngest }) => (
  <aside className="sidebar">
    {/* Nav items */}
    <div>
      <div className="sidebar-section-label">Instruments</div>
      <nav className="nav-menu">
        <button
          id="sidebar-telemetry"
          className={`nav-item ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <Activity size={18} />
          Live Telemetry
        </button>
        <button
          id="sidebar-alerts"
          className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Radio size={18} />
          Nowcast Alerts
        </button>
      </nav>
    </div>

    <div>
      <div className="sidebar-section-label">Archive</div>
      <nav className="nav-menu">
        <button
          id="sidebar-catalogue"
          className={`nav-item ${activeTab === 'catalogue' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalogue')}
        >
          <Database size={18} />
          Flare Catalogue
        </button>
        <button
          id="sidebar-config"
          className={`nav-item ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={18} />
          System Config
        </button>
      </nav>
    </div>

    <div>
      <div className="sidebar-section-label">Intelligence</div>
      <nav className="nav-menu">
        <button
          id="sidebar-sandbox"
          className={`nav-item ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
        >
          <Sliders size={18} />
          Simulation Sandbox
        </button>
        <button
          id="sidebar-threat"
          className={`nav-item ${activeTab === 'threat' ? 'active' : ''}`}
          onClick={() => setActiveTab('threat')}
        >
          <ShieldAlert size={18} />
          Threat Matrix
        </button>
      </nav>
    </div>

    {/* Instrument status */}
    <div style={{ marginTop: 'auto' }}>
      <div className="sidebar-section-label" style={{ marginBottom: 12 }}>Instrument Status</div>
      {[
        { name: 'SoLEXS', status: 'Nominal', band: '2–22 keV', color: '#F47216' },
        { name: 'HEL1OS', status: 'Nominal', band: '10–150 keV', color: '#3B9EFF' },
      ].map(({ name, status, band, color }) => (
        <div key={name} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', marginBottom: 6,
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: `1px solid ${color}30`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C9A7',
            boxShadow: '0 0 6px #00C9A7', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{band}</div>
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00C9A7', letterSpacing: '0.06em' }}>
            {status}
          </div>
        </div>
      ))}

      {/* Force sync button */}
      <button
        id="force-sync-btn"
        onClick={handleManualIngest}
        disabled={isIngesting}
        className="btn btn-secondary"
        style={{ width: '100%', marginTop: 12, justifyContent: 'center',
          opacity: isIngesting ? 0.6 : 1 }}
      >
        {isIngesting ? '⟳ Syncing...' : '↻ Force ISRO Sync'}
      </button>
    </div>
  </aside>
);

// ─── Dashboard View ───────────────────────────────────────────────────────────
const DashboardView = ({ forecast, loading, isIngesting, handleManualIngest }) => {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [bulletinOpen, setBulletinOpen] = useState(false);

  return (
    <div
      className="dashboard-container"
      style={{ background: 'var(--bg-void)', backgroundImage: 'var(--gradient-hero)' }}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isIngesting={isIngesting}
        handleManualIngest={handleManualIngest}
      />

      <main className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800,
              color: 'var(--text-primary)' }}>
              Solar Flare Nowcasting
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.9rem' }}>
              Real-time telemetry · SoLEXS & HEL1OS payloads · Aditya-L1
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              id="open-bulletin-btn"
              onClick={() => setBulletinOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderColor: 'rgba(244,114,22,0.4)',
                background: 'rgba(244,114,22,0.1)'
              }}
            >
              <FileText size={15} color="var(--solar-orange)" />
              <span>ISRO Space Weather Bulletin</span>
            </button>
            <div className={`status-badge ${forecast?.probability_5m > 0.8 ? 'warning' : ''}`}>
              <span style={{
                width: 8, height: 8, background: forecast?.probability_5m > 0.8 ? '#FF4444' : '#00C9A7',
                borderRadius: '50%', display: 'inline-block',
                animation: 'pulse-ring 2s infinite',
              }} />
              {forecast?.probability_5m > 0.8 ? 'ALERT' : 'SYSTEM ONLINE'}
            </div>
          </div>
        </div>

        {/* Tab: Telemetry */}
        {activeTab === 'telemetry' && (
          loading && !forecast ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
              height: 400, flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '2rem', animation: 'spin-slow 2s linear infinite' }}>🛰️</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
                Connecting to ISRO Backend…
              </h2>
            </div>
          ) : (
            <>
              {/* Main 2-col grid */}
              <div className="grid-main">
                <TelemetryChart />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <ProbabilityGauge probability={forecast?.probability_5m ?? 0.42} />
                  <AlertPanel forecast={forecast ?? {}} />
                </div>
              </div>

              {/* 3-col metric cards */}
              <div className="grid-3">
                {[
                  { label: '15-Min Forecast', val: Math.round((forecast?.probability_15m ?? 0.38) * 100), unit: '%', color: '#F47216' },
                  { label: '30-Min Forecast', val: Math.round((forecast?.probability_30m ?? 0.29) * 100), unit: '%', color: '#3B9EFF' },
                  { label: '24-Hr Forecast', val: Math.round((forecast?.probability_24h ?? 0.61) * 100), unit: '%', color: '#A78BFA' },
                ].map(({ label, val, unit, color }) => (
                  <div key={label} className="glass-card" style={{ border: `1px solid ${color}20` }}>
                    <div className="metric-title">{label}</div>
                    <div className="metric-value" style={{ color }}>
                      {val}<span className="metric-unit">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature 4: Model Attention Explainability (XAI Heatmap) */}
              <div style={{ marginTop: 20 }}>
                <AttentionHeatmap
                  attentionWeights={forecast?.attention_weights}
                  saliencyFocus={forecast?.saliency_focus}
                  predictedClass={forecast?.predicted_class}
                />
              </div>
            </>
          )
        )}

        {activeTab === 'alerts' && <NowcastAlerts />}
        {activeTab === 'catalogue' && <FlareCatalogue />}
        {activeTab === 'sandbox' && <SimulationSandbox />}
        {activeTab === 'threat' && <ThreatMatrix forecast={forecast} />}
        {activeTab === 'config' && <SystemConfig />}

        <AdvisoryBulletinModal
          isOpen={bulletinOpen}
          onClose={() => setBulletinOpen(false)}
          forecast={forecast}
        />
      </main>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const [mode, setMode] = useState('landing');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for nav styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch live forecast from backend API with periodic refresh
  const fetchLiveForecast = async () => {
    try {
      const data = await getForecast();
      if (data) {
        setForecast(prev => ({
          ...prev,
          ...data,
          probability_24h: data.probability_24h ?? 0.61,
        }));
      }
    } catch (err) {
      console.warn('Backend forecast offline, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveForecast();
    // Poll backend every 10 seconds for updated Aditya-L1 telemetry forecasts
    const iv = setInterval(fetchLiveForecast, 10000);
    return () => clearInterval(iv);
  }, []);

  const handleManualIngest = async () => {
    setIsIngesting(true);
    try {
      await triggerIngestion();
      await fetchLiveForecast();
    } catch (err) {
      console.error('Ingestion error:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <TopNav mode={mode} setMode={setMode} scrolled={scrolled} />
      <div className="app-wrapper">
        {mode === 'landing' ? (
          <LandingPage onSwitchToDashboard={() => setMode('dashboard')} />
        ) : (
          <DashboardView
            forecast={forecast}
            loading={loading}
            isIngesting={isIngesting}
            handleManualIngest={handleManualIngest}
          />
        )}
      </div>
    </div>
  );
}

export default App;
