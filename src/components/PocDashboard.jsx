import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyConfig } from '../config/companyConfig';
import LiveMarketStream from './LiveMarketStream';
import TrafficControl from './TrafficControl';
import SystemTopology from './SystemTopology';
import ArchitecturalPitch from './ArchitecturalPitch';

export default function PocDashboard() {
  const { companyId } = useParams();
  const company = getCompanyConfig(companyId);
  const [rps, setRps] = useState(1000);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Header */}
      <header className={`border-b border-slate-700 bg-slate-900/95 backdrop-blur sticky top-0 z-10`}>
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-100">
                Event-Driven Architecture Assessment for{' '}
                <span className={company.color}>{company.name}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                High-Load Bet Ingestion Simulator — Real-time event-driven architecture visualization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${company.bg} animate-pulse`} />
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                {companyId || 'default'} PoC
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-10 gap-4 min-h-[calc(100vh-12rem)]">

          {/* Left: Live Market Stream (30%) */}
          <div className={`col-span-10 lg:col-span-3 bg-slate-800/40 rounded-xl p-4 border border-slate-700`}>
            <LiveMarketStream company={company} />
          </div>

          {/* Middle: Traffic Control (30%) */}
          <div className={`col-span-10 lg:col-span-3 bg-slate-800/40 rounded-xl p-4 border border-slate-700`}>
            <TrafficControl rps={rps} setRps={setRps} company={company} />
          </div>

          {/* Right: System Topology (40%) */}
          <div className={`col-span-10 lg:col-span-4 bg-slate-800/40 rounded-xl p-4 border border-slate-700`}>
            <SystemTopology rps={rps} company={company} />
          </div>
        </div>

        {/* Architectural Pitch */}
        <ArchitecturalPitch company={company} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-4 mt-8">
        <div className="max-w-screen-2xl mx-auto px-6 flex justify-between text-xs text-slate-600">
          <span>High-Load Bet Ingestion Simulator — PoC</span>
          <span>All metrics are simulated for demonstration purposes</span>
        </div>
      </footer>
    </div>
  );
}
