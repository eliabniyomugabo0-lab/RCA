import React from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Gauge, 
  Wind, 
  Sun, 
  CheckCircle2, 
  Clock,
  Layers,
  Shield
} from 'lucide-react';

export const StadiumFacilityView: React.FC = () => {
  const pitches = [
    { id: 1, name: 'Pitch #1 (Eastern)', status: 'Rest & Soil Recovery', moisture: '18.2%', grassHeight: '6.5mm', compaction: 'Low (Resting)' },
    { id: 2, name: 'Pitch #2 (Center-East)', status: 'Rolling in Progress', moisture: '15.4%', grassHeight: '4.8mm', compaction: 'Medium' },
    { id: 3, name: 'Pitch #3 (Main Match Oval)', status: 'Match Ready (ICC Certified)', moisture: '14.8%', grassHeight: '4.0mm', compaction: 'High (Optimal)' },
    { id: 4, name: 'Pitch #4 (Center-West)', status: 'Academy League Reserved', moisture: '16.0%', grassHeight: '5.0mm', compaction: 'Medium' },
    { id: 5, name: 'Pitch #5 (Western Practice)', status: 'Daily Squad Net Sessions', moisture: '15.9%', grassHeight: '5.2mm', compaction: 'Medium' }
  ];

  const netBays = [
    { id: 1, name: 'Net Lane 1 (Fast Bowling Track)', surface: 'Turf / Natural Clay', speedGun: 'Active (Stalker Radar)', machine: 'Aero-Bowl 140' },
    { id: 2, name: 'Net Lane 2 (Spin Variation Track)', surface: 'Slow Turning Clay', speedGun: 'Off', machine: 'Paceman Pro' },
    { id: 3, name: 'Net Lane 3 (All-Weather Synthetic)', surface: 'Poly-turf shockpad', speedGun: 'Active', machine: 'Manual Drills' },
    { id: 4, name: 'Net Lane 4 (Batting Technical Net)', surface: 'Turf', speedGun: 'Off', machine: 'Video Analysis Mounted' }
  ];

  const upcomingFixtures = [
    { date: 'Oct 15, 2026 · 09:30 AM', event: 'East Africa T20 Challenge: Rwanda vs Uganda', pitch: 'Center Pitch #3', referee: 'ICC Technical Panel' },
    { date: 'Oct 17, 2026 · 02:00 PM', event: 'Rwanda Women U-19 Development Series (Match 1)', pitch: 'Center Pitch #3', referee: 'RCA National Panel' },
    { date: 'Oct 20, 2026 · 10:00 AM', event: 'Kigali Premier Cricket League Championship Final', pitch: 'Center Pitch #2', referee: 'RCA Senior Umpire' }
  ];

  return (
    <div className="space-y-6">
      {/* Stadium Architectural Hero Anchor */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src="/src/assets/images/gcs_stadium_exterior_1791894260939.jpg"
            alt="Gahanga Cricket Stadium Kigali"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Gahanga Sector, Kicukiro District, Kigali, Rwanda</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Gahanga Cricket Stadium (GCS)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                Home of Rwandan Cricket. Iconic curved earth-vault pavilion with 5 center turf strips, 4 practice nets, and media broadcasting facilities.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shrink-0">
              <Sun className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="font-semibold text-white">24°C Sunny</span>
                <span className="text-slate-400 block text-[10px]">Humidity: 58% · Wind: 8 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Oval Pitch Strip Readiness */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Center Pitch Square Status (5 Strips)
            </h2>
            <p className="text-xs text-slate-400">
              Real-time curation metrics monitored by Cricket Operations and Ground teams
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400 tabular-nums">
            Square Curfew: 18:00 Today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pitches.map((p) => {
            const isMatchReady = p.status.includes('Match Ready');
            return (
              <div
                key={p.id}
                className={`p-3 rounded-lg border flex flex-col justify-between ${
                  isMatchReady 
                    ? 'bg-teal-950/40 border-teal-800/80 shadow-xs' 
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{p.name}</span>
                    {isMatchReady && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <p className={`text-[11px] font-semibold mt-1 ${isMatchReady ? 'text-teal-400' : 'text-slate-400'}`}>
                    {p.status}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Moisture:</span>
                    <strong className="font-mono text-slate-200">{p.moisture}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cut:</span>
                    <strong className="font-mono text-slate-200">{p.grassHeight}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Roll:</span>
                    <strong className="text-slate-300">{p.compaction}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Practice Nets & Upcoming Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Nets */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            High Performance Practice Nets (4 Lanes)
          </h3>
          <p className="text-xs text-slate-400">
            Training bay availability and bowling machine status
          </p>

          <div className="space-y-2.5 mt-2">
            {netBays.map((bay) => (
              <div key={bay.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-slate-200">{bay.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Surface: {bay.surface} · Machine: {bay.machine}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-teal-400 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                  {bay.speedGun}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Upcoming Match Fixtures
          </h3>
          <p className="text-xs text-slate-400">
            Official operational calendar and pitch assignments
          </p>

          <div className="space-y-2.5 mt-2">
            {upcomingFixtures.map((f, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono">
                  <span>{f.date}</span>
                  <span className="text-slate-400">{f.pitch}</span>
                </div>
                <h4 className="font-semibold text-slate-100">{f.event}</h4>
                <p className="text-[11px] text-slate-400">Officiating: {f.referee}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
