import { useState, useEffect, useRef } from 'react';

const MATCHES = [
  { id: 1, home: 'Benfica', away: 'Porto', league: 'Primeira Liga' },
  { id: 2, home: 'Man City', away: 'Liverpool', league: 'Premier League' },
  { id: 3, home: 'Real Madrid', away: 'Barcelona', league: 'La Liga' },
  { id: 4, home: 'Bayern', away: 'Dortmund', league: 'Bundesliga' },
  { id: 5, home: 'PSG', away: 'Monaco', league: 'Ligue 1' },
];

function randomOdds(base, spread = 0.4) {
  return (base + (Math.random() - 0.5) * spread).toFixed(2);
}

function initialOdds() {
  return MATCHES.map((m) => ({
    ...m,
    home: parseFloat(randomOdds(2.1)),
    draw: parseFloat(randomOdds(3.2)),
    away: parseFloat(randomOdds(3.5)),
  }));
}

export default function LiveMarketStream({ company }) {
  const [odds, setOdds] = useState(initialOdds);
  const [flash, setFlash] = useState({});
  const prevOdds = useRef({});

  useEffect(() => {
    const interval = setInterval(() => {
      setOdds((prev) => {
        const newOdds = prev.map((match) => {
          const changed = Math.random() > 0.4;
          if (!changed) return match;
          const newHome = parseFloat(randomOdds(match.home, 0.25));
          const newDraw = parseFloat(randomOdds(match.draw, 0.15));
          const newAway = parseFloat(randomOdds(match.away, 0.25));
          const flashInfo = {};
          if (newHome !== match.home) flashInfo[`${match.id}-home`] = newHome > match.home ? 'green' : 'red';
          if (newDraw !== match.draw) flashInfo[`${match.id}-draw`] = newDraw > match.draw ? 'green' : 'red';
          if (newAway !== match.away) flashInfo[`${match.id}-away`] = newAway > match.away ? 'green' : 'red';
          prevOdds.current = { ...prevOdds.current, ...flashInfo };
          return { ...match, home: newHome, draw: newDraw, away: newAway };
        });
        setFlash({ ...prevOdds.current });
        setTimeout(() => setFlash({}), 600);
        return newOdds;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 mb-4`}>
        <span className={`w-2 h-2 rounded-full ${company.bg} animate-pulse`} />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Live Market Stream</h2>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-auto">
        {odds.map((match) => (
          <div key={match.id} className={`bg-slate-800 rounded-lg p-3 border border-slate-700`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">{match.league}</span>
              <span className={`text-xs font-bold ${company.color} animate-pulse`}>LIVE</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 mb-2 text-center">
              {match.home} <span className="text-slate-500">vs</span> {match.away}
            </div>
            <div className="grid grid-cols-3 gap-1">
              <OddCell label="1" value={match.home} flash={flash[`${match.id}-home`]} company={company} />
              <OddCell label="X" value={match.draw} flash={flash[`${match.id}-draw`]} company={company} />
              <OddCell label="2" value={match.away} flash={flash[`${match.id}-away`]} company={company} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Update interval: <span className="text-slate-300">800ms</span></span>
          <span>Markets: <span className={company.color}>{MATCHES.length * 3}</span></span>
        </div>
      </div>
    </div>
  );
}

function OddCell({ label, value, flash, company }) {
  const bg = flash === 'green' ? 'bg-green-500/30' : flash === 'red' ? 'bg-red-500/30' : 'bg-slate-700';
  return (
    <div
      className={`rounded p-1.5 text-center transition-colors duration-300 ${bg}`}
      style={{ transition: 'background-color 0.3s' }}
    >
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-sm font-bold ${flash === 'green' ? 'text-green-400' : flash === 'red' ? 'text-red-400' : company.color}`}>
        {value.toFixed(2)}
      </div>
    </div>
  );
}
