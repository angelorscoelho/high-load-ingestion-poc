export default function ArchitecturalPitch({ company }) {
  return (
    <section className="mt-8 border-t border-slate-700 pt-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        Why this architecture matters for{' '}
        <span className={company.color}>{company.name}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PitchCard
          icon="💥"
          title="The Problem: Synchronous REST Under Goal Spike"
          company={company}
        >
          <p className="text-slate-400 text-sm leading-relaxed">
            Traditional synchronous HTTP REST APIs fail catastrophically under the "Goal Spike" load. When 30,000+ simultaneous
            bettors react to a live goal, each request blocks a thread waiting for database writes, creating a{' '}
            <span className="text-red-400 font-semibold">thundering herd</span> that collapses connection pools, drives p99
            latency to seconds, and forces the system to either queue-drop or error out — resulting in{' '}
            <span className="text-red-400 font-semibold">lost revenue and regulatory non-compliance</span>.
          </p>
        </PitchCard>

        <PitchCard
          icon="⚡"
          title="The Solution: Event-Driven Async Architecture"
          company={company}
        >
          <p className="text-slate-400 text-sm leading-relaxed">
            This topology mirrors a production-grade Event-Driven architecture leveraging{' '}
            <span className={`${company.color} font-semibold`}>Apache Kafka, RabbitMQ, or Solace PubSub+</span>.
            The API Gateway immediately acknowledges each bet request (
            <span className={`${company.color} font-semibold`}>HTTP 202 Accepted</span>) and drops the payload
            into an immutable, durable event stream. The caller receives confirmation in{' '}
            <span className={`${company.color} font-semibold`}>&lt;15ms</span> regardless of downstream load.
          </p>
        </PitchCard>

        <PitchCard
          icon="🛡"
          title="Guarantees: Zero Drops, Infinite Scale"
          company={company}
        >
          <p className="text-slate-400 text-sm leading-relaxed">
            Worker nodes asynchronously consume the event stream, applying bet validation business logic
            and persisting to a{' '}
            <span className={`${company.color} font-semibold`}>horizontally-sharded NoSQL datastore</span>{' '}
            (ScyllaDB, Cassandra, or DynamoDB). Kubernetes{' '}
            <span className={`${company.color} font-semibold`}>Horizontal Pod Autoscaler (HPA)</span> scales
            workers from 2 to 10+ pods within seconds, ensuring{' '}
            <span className="text-green-400 font-semibold">zero dropped transactions</span>,{' '}
            backpressure management, and five-nines high availability.
          </p>
        </PitchCard>
      </div>

      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">
          Architecture Decision Record (ADR-001)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pattern', value: 'CQRS + Event Sourcing' },
            { label: 'Broker', value: 'Kafka (3-broker cluster)' },
            { label: 'Storage', value: 'ScyllaDB + Redis Cache' },
            { label: 'Orchestration', value: 'Kubernetes + HPA' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-xs text-slate-500 uppercase mb-1">{item.label}</div>
              <div className={`text-sm font-bold ${company.color}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PitchCard({ icon, title, company, children }) {
  return (
    <div className={`bg-slate-800 rounded-xl p-5 border border-slate-700`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className={`text-sm font-bold ${company.color} uppercase tracking-wide mb-3`}>{title}</h3>
      {children}
    </div>
  );
}
