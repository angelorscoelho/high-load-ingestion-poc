import { useState, useEffect, useRef } from 'react';

const MIN_RPS = 100;
const MAX_RPS = 50000;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function useSimulation(rps) {
  const [state, setState] = useState({
    queueDepth: 0,
    latency: 15,
    workerCount: 2,
    gatewayLatency: 12,
    droppedPackets: 0,
    throughput: 0,
    scaling: false,
  });

  const workerCountRef = useRef(2);
  const targetWorkers = useRef(2);
  const scaleTimerRef = useRef(null);

  useEffect(() => {
    const normalizedRps = (rps - MIN_RPS) / (MAX_RPS - MIN_RPS);
    const isSpike = rps >= 30000;
    const isHigh = rps >= 15000;
    const isElevated = rps >= 5000;

    // Determine target workers
    let targetW = 2;
    if (isSpike) targetW = 10;
    else if (isHigh) targetW = 6;
    else if (isElevated) targetW = 3;
    targetWorkers.current = targetW;

    // Queue depth: spikes when RPS is high
    const targetQueueDepth = isSpike
      ? Math.round(normalizedRps * 120000)
      : isHigh
      ? Math.round(normalizedRps * 8000)
      : isElevated
      ? Math.round(normalizedRps * 500)
      : 0;

    // Latency
    const targetLatency = isSpike
      ? Math.round(lerp(150, 220, normalizedRps))
      : isHigh
      ? Math.round(lerp(30, 80, normalizedRps))
      : isElevated
      ? Math.round(lerp(15, 30, normalizedRps))
      : Math.round(lerp(10, 18, normalizedRps));

    const targetGatewayLatency = isSpike ? Math.round(lerp(80, 200, normalizedRps)) : Math.round(lerp(5, 25, normalizedRps));

    // Throughput
    const targetThroughput = Math.round(rps * 0.97);

    const interval = setInterval(() => {
      setState((prev) => {
        // Gradually scale workers
        if (workerCountRef.current < targetWorkers.current) {
          workerCountRef.current = Math.min(workerCountRef.current + 1, targetWorkers.current);
        } else if (workerCountRef.current > targetWorkers.current) {
          workerCountRef.current = Math.max(workerCountRef.current - 1, targetWorkers.current);
        }

        const jitter = () => (Math.random() - 0.5) * 4;

        return {
          queueDepth: Math.max(0, Math.round(lerp(prev.queueDepth, targetQueueDepth, 0.15) + jitter() * 10)),
          latency: Math.max(5, Math.round(lerp(prev.latency, targetLatency, 0.2) + jitter())),
          workerCount: workerCountRef.current,
          gatewayLatency: Math.max(2, Math.round(lerp(prev.gatewayLatency, targetGatewayLatency, 0.2) + jitter())),
          droppedPackets: 0,
          throughput: Math.max(0, Math.round(lerp(prev.throughput, targetThroughput, 0.2))),
          scaling: workerCountRef.current < targetWorkers.current,
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [rps]);

  return state;
}

function Arrow({ active, company }) {
  return (
    <div className="flex items-center justify-center px-1">
      <div className={`flex items-center gap-0.5`}>
        <div
          className="h-0.5 w-6 transition-colors duration-300"
          style={{ backgroundColor: active ? company.hex : '#475569' }}
        />
        <div
          className="w-0 h-0 border-y-4 border-y-transparent border-l-8 transition-colors duration-300"
          style={{ borderLeftColor: active ? company.hex : '#475569' }}
        />
      </div>
    </div>
  );
}

function TopologyBlock({ title, subtitle, status, statusColor, children, borderColor }) {
  return (
    <div className={`bg-slate-800 rounded-lg p-3 border-2 ${borderColor} min-w-0 flex-1`}>
      <div className="text-xs font-bold text-slate-300 text-center mb-1">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 text-center mb-2">{subtitle}</div>}
      {children}
      {status && (
        <div className={`text-xs font-semibold text-center mt-2 ${statusColor}`}>{status}</div>
      )}
    </div>
  );
}

export default function SystemTopology({ rps, company }) {
  const sim = useSimulation(rps);
  const isSpike = rps >= 30000;
  const isHigh = rps >= 5000;

  const queuePct = Math.min(100, (sim.queueDepth / 120000) * 100);
  const queueColor = queuePct > 80 ? 'bg-red-500' : queuePct > 50 ? 'bg-yellow-500' : 'bg-green-500';
  const queueTextColor = queuePct > 80 ? 'text-red-400' : queuePct > 50 ? 'text-yellow-400' : 'text-green-400';

  const workerNodes = Array.from({ length: sim.workerCount });

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 mb-4`}>
        <span className={`w-2 h-2 rounded-full ${company.bg} animate-pulse`} />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">System Topology & Real-time Metrics</h2>
      </div>

      {/* Block Diagram */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
        <div className="flex items-stretch gap-1 min-h-24">

          {/* API Gateway */}
          <TopologyBlock
            title="API Gateway"
            subtitle="Load Balancer"
            borderColor={isHigh ? company.border : 'border-slate-600'}
          >
            <div className="text-center">
              <div className={`text-lg font-mono font-bold ${company.color}`}>{sim.gatewayLatency}ms</div>
              <div className="text-xs text-slate-500">p99 latency</div>
            </div>
            <div className={`text-xs text-center mt-1 ${isSpike ? 'text-yellow-400' : 'text-green-400'}`}>
              {isSpike ? '⚠ Throttling' : '✓ Healthy'}
            </div>
          </TopologyBlock>

          <Arrow active={isHigh} company={company} />

          {/* Message Broker */}
          <TopologyBlock
            title="Message Broker"
            subtitle="Kafka / RabbitMQ"
            borderColor={isSpike ? 'border-red-500' : isHigh ? 'border-yellow-500' : 'border-slate-600'}
          >
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Queue</span>
                <span className={`font-mono font-bold ${queueTextColor}`}>{sim.queueDepth.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${queueColor} rounded-full transition-all duration-300`}
                  style={{ width: `${queuePct}%` }}
                />
              </div>
            </div>
            <div className={`text-xs text-center ${queueTextColor}`}>
              {isSpike ? '🔴 Backpressure' : isHigh ? '🟡 Building' : '🟢 Empty'}
            </div>
          </TopologyBlock>

          <Arrow active={isHigh} company={company} />

          {/* Worker Nodes */}
          <TopologyBlock
            title="Worker Nodes"
            subtitle={sim.scaling ? '⚡ Auto-Scaling...' : `${sim.workerCount} Active`}
            borderColor={sim.scaling ? 'border-yellow-400' : isHigh ? company.border : 'border-slate-600'}
          >
            <div className="flex flex-wrap gap-1 justify-center">
              {workerNodes.map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${
                    i < 2 ? company.bg : 'bg-yellow-500'
                  } transition-all duration-300`}
                  title={`Worker ${i + 1}`}
                />
              ))}
            </div>
          </TopologyBlock>

          <Arrow active={isHigh} company={company} />

          {/* Database */}
          <TopologyBlock
            title="NoSQL DB"
            subtitle="Scylla / Cassandra"
            borderColor={isHigh ? company.border : 'border-slate-600'}
          >
            <div className="text-center">
              <div className={`text-lg font-mono font-bold ${company.color}`}>
                {sim.throughput.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">writes/sec</div>
            </div>
            <div className="text-xs text-center mt-1 text-green-400">✓ Persisted</div>
          </TopologyBlock>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard
          label="Queue Depth"
          value={sim.queueDepth.toLocaleString()}
          unit="messages"
          color={queueTextColor}
          icon="📬"
        />
        <MetricCard
          label="Avg Processing Latency"
          value={sim.latency}
          unit="ms"
          color={sim.latency > 100 ? 'text-red-400' : sim.latency > 40 ? 'text-yellow-400' : 'text-green-400'}
          icon="⏱"
        />
        <MetricCard
          label="Dropped Packets"
          value="0"
          unit="guaranteed delivery"
          color="text-green-400"
          icon="🛡"
        />
        <MetricCard
          label="Active Workers"
          value={sim.workerCount}
          unit={`/ 10 max ${sim.scaling ? '(scaling)' : ''}`}
          color={company.color}
          icon="⚙"
        />
      </div>

      {/* Throughput Bar */}
      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400 uppercase tracking-wider">System Throughput</span>
          <span className={`font-mono font-bold ${company.color}`}>{sim.throughput.toLocaleString()} ops/s</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${company.bg} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, (sim.throughput / MAX_RPS) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, color, icon }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-slate-500 truncate">{label}</span>
      </div>
      <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{unit}</div>
    </div>
  );
}
