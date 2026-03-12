import { useMemo } from 'react';

const MIN_RPS = 100;
const MAX_RPS = 50000;

function formatRps(rps) {
  if (rps >= 1000) return `${(rps / 1000).toFixed(1)}k`;
  return rps.toString();
}

function getTrafficLevel(rps) {
  if (rps < 5000) return { label: 'Normal', color: 'text-green-400', bar: 'bg-green-500' };
  if (rps < 15000) return { label: 'Elevated', color: 'text-yellow-400', bar: 'bg-yellow-500' };
  if (rps < 30000) return { label: 'High Load', color: 'text-orange-400', bar: 'bg-orange-500' };
  return { label: 'CRITICAL SPIKE', color: 'text-red-400', bar: 'bg-red-500' };
}

export default function TrafficControl({ rps, setRps, company }) {
  const pct = useMemo(() => ((rps - MIN_RPS) / (MAX_RPS - MIN_RPS)) * 100, [rps]);
  const level = getTrafficLevel(rps);

  const bars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const threshold = ((i + 1) / 20) * 100;
      return threshold <= pct;
    });
  }, [pct]);

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 mb-4`}>
        <span className={`w-2 h-2 rounded-full ${company.bg} animate-pulse`} />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Traffic Control & Load Injector</h2>
      </div>

      {/* RPS Display */}
      <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700 text-center">
        <div className={`text-5xl font-black font-mono ${level.color} mb-1`}>
          {formatRps(rps)}
        </div>
        <div className="text-slate-400 text-sm">Requests / Second</div>
        <div className={`text-xs font-bold mt-1 ${level.color}`}>{level.label}</div>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <label className="block text-xs text-slate-400 mb-2 uppercase tracking-widest">
          Simulate Live Goal Traffic
        </label>
        <input
          type="range"
          min={MIN_RPS}
          max={MAX_RPS}
          step={100}
          value={rps}
          onChange={(e) => setRps(Number(e.target.value))}
          className="w-full accent-current cursor-pointer"
          style={{ accentColor: company.hex }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>100 RPS</span>
          <span>50,000 RPS</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Injection Rate Visualizer</div>
        <div className="flex items-end gap-0.5 h-12">
          {bars.map((active, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-150 ${active ? level.bar : 'bg-slate-700'}`}
              style={{ height: active ? `${40 + Math.sin(i * 0.5) * 8}px` : '8px' }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <StatCard label="Bets / Min" value={formatRps(rps * 60)} color={level.color} />
        <StatCard label="Bets / Hour" value={formatRps(rps * 3600)} color={level.color} />
        <StatCard label="Peak Concurrency" value={Math.ceil(rps / 1000).toString() + 'k'} color={level.color} />
        <StatCard label="Payload Size" value="~2.1 KB" color="text-slate-300" />
      </div>

      {/* Goal Spike Warning */}
      {rps >= 30000 && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg animate-pulse">
          <div className="text-red-400 text-xs font-bold uppercase">⚡ Goal Spike Detected</div>
          <div className="text-slate-400 text-xs mt-1">
            Auto-scaling triggered. Queue backpressure active.
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
