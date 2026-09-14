import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';

// Generate realistic-looking flare data
function generateData() {
  const data = [];
  const baselineSXR = 1e-8;
  const baselineHXR = 1e-9;
  let sxr = baselineSXR;
  let hxr = baselineHXR;

  for (let i = 0; i < 120; i++) {
    const t = i;
    // Simulate a flare peak around minute 60
    const flareSXR = t > 55 && t < 85
      ? Math.exp(-Math.pow((t - 68) / 8, 2)) * 5e-5
      : 0;
    const flareHXR = t > 52 && t < 78
      ? Math.exp(-Math.pow((t - 62) / 6, 2)) * 2e-5
      : 0;

    sxr = baselineSXR + flareSXR + (Math.random() - 0.5) * 2e-9;
    hxr = baselineHXR + flareHXR + (Math.random() - 0.5) * 5e-10;

    data.push({
      t,
      time: `${String(Math.floor(i / 60)).padStart(2,'0')}:${String(i % 60).padStart(2,'0')}`,
      sxr: Math.max(sxr, 1e-9),
      hxr: Math.max(hxr, 1e-10),
    });
  }
  return data;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(5, 13, 26, 0.95)', border: '1px solid var(--border-soft)',
      borderRadius: 10, padding: '12px 16px', backdropFilter: 'blur(12px)',
    }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
        UT {label}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.85rem', marginBottom: 4, color: p.color }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {p.value?.toExponential(2)} W/m²
          </span>
        </div>
      ))}
    </div>
  );
};

const TelemetryChart = () => {
  const [streamData, setStreamData] = useState(() => generateData().slice(30, 90));
  const [showGOES, setShowGOES] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    let ws = null;
    let fallbackInterval = null;
    let isSubscribed = true;

    const startFallback = () => {
      if (fallbackInterval) clearInterval(fallbackInterval);
      fallbackInterval = setInterval(() => {
        setStreamData(prev => {
          const nextT = prev.length > 0 ? prev[prev.length - 1].t + 1 : 1;
          const now = new Date();
          const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
          const nextPoint = {
            t: nextT,
            time: timeStr,
            sxr: Math.max(1e-9, 2.5e-6 + (Math.random() - 0.5) * 5e-8),
            hxr: Math.max(1e-10, 3.5e-7 + (Math.random() - 0.5) * 2e-8),
          };
          const updated = [...prev, nextPoint];
          return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
        });
      }, 1000);
    };

    const connectWebSocket = () => {
      try {
        const wsUrl = 'ws://127.0.0.1:8000/ws/telemetry';
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (!isSubscribed) return;
          setWsConnected(true);
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
        };

        ws.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const pkt = JSON.parse(event.data);
            setStreamData(prev => {
              const nextT = prev.length > 0 ? prev[prev.length - 1].t + 1 : 1;
              const nextPoint = {
                t: nextT,
                time: pkt.timestamp,
                sxr: pkt.solexs_flux,
                hxr: pkt.helios_hxr * 1e-9,
                temperature_mk: pkt.temperature_mk,
                df_dt: pkt.df_dt
              };
              const updated = [...prev, nextPoint];
              return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
            });
          } catch (err) {
            console.error('Error parsing telemetry packet', err);
          }
        };

        ws.onerror = () => {
          if (isSubscribed) setWsConnected(false);
        };

        ws.onclose = () => {
          if (!isSubscribed) return;
          setWsConnected(false);
          if (!fallbackInterval) startFallback();
          setTimeout(() => {
            if (isSubscribed) connectWebSocket();
          }, 3000);
        };
      } catch (e) {
        setWsConnected(false);
        startFallback();
      }
    };

    connectWebSocket();

    return () => {
      isSubscribed = false;
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  const displayData = streamData;
  const latest = displayData[displayData.length - 1];

  return (
    <div className="glass-card" style={{ height: '440px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 2 }}>
            Aditya-L1 X-Ray Telemetry
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SoLEXS + HEL1OS · 1s Cadence Live Ingest
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            id="chart-goes-toggle"
            onClick={() => setShowGOES(g => !g)}
            className={`btn btn-sm ${showGOES ? 'btn-secondary' : 'btn-ghost'}`}
          >
            {showGOES ? '✓ ' : ''}GOES ref
          </button>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: wsConnected ? '#00C9A7' : '#F59E0B',
              boxShadow: wsConnected ? '0 0 8px #00C9A7' : '0 0 8px #F59E0B',
              animation: 'pulse-ring 2s infinite'
            }}
          />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: wsConnected ? 'var(--accent-teal)' : '#F59E0B',
            letterSpacing: '0.08em' }}>
            {wsConnected ? 'WS STREAMING' : 'SIMULATED FEED'}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {latest && [
          { label: 'SoLEXS SXR', val: latest.sxr, color: '#F47216' },
          { label: 'HEL1OS HXR', val: latest.hxr, color: '#3B9EFF' },
          { label: 'Hardness', val: (latest.hxr / latest.sxr).toFixed(3), color: '#A78BFA', raw: true },
        ].map(({ label, val, color, raw }) => (
          <div key={label} style={{
            flex: 1, padding: '8px 12px',
            background: `${color}10`, border: `1px solid ${color}25`,
            borderRadius: 8,
          }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color, fontWeight: 700, marginTop: 2 }}>
              {raw ? val : Number(val).toExponential(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="var(--text-muted)"
              tick={{ fontSize: 11 }}
              interval={14}
            />
            <YAxis
              yAxisId="sxr"
              stroke="#F47216"
              scale="log"
              domain={['auto', 'auto']}
              tick={{ fontSize: 10 }}
              tickFormatter={v => v.toExponential(0)}
              width={60}
            />
            <YAxis
              yAxisId="hxr"
              orientation="right"
              stroke="#3B9EFF"
              scale="log"
              domain={['auto', 'auto']}
              tick={{ fontSize: 10 }}
              tickFormatter={v => v.toExponential(0)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{val}</span>}
            />
            {/* Flare onset marker */}
            <ReferenceLine yAxisId="sxr" x="00:55" stroke="rgba(255,68,68,0.5)"
              strokeDasharray="4 3"
              label={{ value: 'M5.0 Peak', fill: '#FF6B6B', fontSize: 10, position: 'top' }} />
            <Line
              yAxisId="sxr"
              type="monotone"
              dataKey="sxr"
              name="SoLEXS 2–22 keV"
              stroke="#F47216"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Line
              yAxisId="hxr"
              type="monotone"
              dataKey="hxr"
              name="HEL1OS 10–150 keV"
              stroke="#3B9EFF"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
            {showGOES && (
              <Line
                yAxisId="sxr"
                type="monotone"
                dataKey="sxr"
                name="GOES XRS (ref)"
                stroke="#00C9A7"
                dot={false}
                strokeWidth={1.5}
                strokeDasharray="5 3"
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryChart;
