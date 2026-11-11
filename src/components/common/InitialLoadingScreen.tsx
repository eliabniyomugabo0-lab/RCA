import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, ChevronRight } from 'lucide-react';

interface InitialLoadingScreenProps {
  onComplete: () => void;
  minDurationMs?: number;
}

const BOOT_STAGES = [
  { progress: 15, text: 'Initializing ICC Associate Venue Protocols...' },
  { progress: 35, text: 'Calibrating Pitch 3 Hybrid Bermuda Grass Sensors...' },
  { progress: 60, text: 'Syncing Rwanda Cricket Association System...' },
  { progress: 82, text: 'Testing Floodlight Arena 1,480 Lux Phase Balances...' },
  { progress: 95, text: 'Securing Personnel & Operations Workspaces...' },
  { progress: 100, text: 'Gahanga Cricket Stadium Operations Ready.' }
];

export const InitialLoadingScreen: React.FC<InitialLoadingScreenProps> = ({
  onComplete,
  minDurationMs = 2200
}) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalMs = 30;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));

      setProgress(rawProgress);

      // Determine active stage text
      const nextStageIdx = BOOT_STAGES.findIndex((s) => rawProgress <= s.progress);
      if (nextStageIdx !== -1) {
        setStageIndex(nextStageIdx);
      } else {
        setStageIndex(BOOT_STAGES.length - 1);
      }

      if (rawProgress >= 100) {
        clearInterval(timer);
        // Begin smooth fade-out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 350);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [minDurationMs, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Stadium Ambient Night Glows & Floodlight Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-center arena floodlight aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full"></div>
        {/* Ground level pitch turf glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-t from-emerald-600/15 via-teal-900/10 to-transparent blur-3xl rounded-full"></div>
        {/* Subtle grid texture overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Multi-layered Kinetic Stadium Vault & Cricket Orbit Spinner */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-8">
          {/* Subtle Ambient Radar Ping */}
          <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping opacity-40"></div>

          {/* Layer 1: Outermost SVG Precision Dial */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="none"
              stroke="url(#gradient-teal)"
              strokeWidth="3"
              strokeDasharray="40 180"
              strokeLinecap="round"
            />
            {/* North, East, South, West stadium markers */}
            <circle cx="80" cy="4" r="2.5" fill="#14b8a6" />
            <circle cx="156" cy="80" r="2.5" fill="#10b981" />
            <circle cx="80" cy="156" r="2.5" fill="#14b8a6" />
            <circle cx="4" cy="80" r="2.5" fill="#10b981" />
            <defs>
              <linearGradient id="gradient-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Layer 2: Middle Counter-Rotating Parabolic Vault Arc */}
          <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-[spin_5s_linear_infinite_reverse]" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="4 8"
            />
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeDasharray="80 120"
              strokeLinecap="round"
            />
          </svg>

          {/* Layer 3: Dynamic Glow Ring with Pulse */}
          <div className="absolute inset-5 rounded-full border border-teal-500/40 bg-teal-500/5 backdrop-blur-xs shadow-[0_0_25px_rgba(20,184,166,0.25)]"></div>

          {/* Layer 4: Center Core Logo Hub (Gahanga GCS Monogram & Seam) */}
          <div className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-teal-500/50 shadow-2xl flex flex-col items-center justify-center p-2 transform group-hover:scale-105 transition-transform">
            {/* Glowing inner shadow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-teal-500/10 to-transparent pointer-events-none"></div>

            {/* Stadium Monogram Badge */}
            <div className="flex items-center justify-center font-black tracking-tight text-white text-lg sm:text-xl drop-shadow-md">
              <span className="text-teal-400">G</span>
              <span className="text-white">C</span>
              <span className="text-emerald-400">S</span>
            </div>

            {/* Stylized Cricket Ball Seam & Pulse */}
            <div className="mt-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[9px] font-mono tracking-widest text-teal-300 font-bold uppercase">
                RWANDA
              </span>
            </div>

            {/* Rwandan Tri-Color Accent Ribbon */}
            <div className="absolute -bottom-1 left-3 right-3 h-[2.5px] rounded-full overflow-hidden flex shadow-xs">
              <div className="flex-1 bg-[#00A1DE]"></div>
              <div className="flex-1 bg-[#FAD201]"></div>
              <div className="flex-1 bg-[#20603D]"></div>
            </div>
          </div>
        </div>

        {/* Stadium Identity Typography */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-semibold text-teal-300 shadow-md">
            <Shield className="w-3 h-3 text-teal-400 shrink-0" />
            <span className="tracking-wide uppercase">ICC Certified Ground · Associate Grade A</span>
          </div>

          <h1 className="text-lg sm:text-xl font-extrabold tracking-[0.2em] uppercase text-white drop-shadow-md">
            Gahanga Cricket Stadium
          </h1>

          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Operations & Venue Management Hub · Kigali
          </p>
        </div>

        {/* Dynamic Progress Engine */}
        <div className="w-full space-y-2.5">
          {/* Progress Bar Container */}
          <div className="relative w-full h-2 rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden shadow-inner p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(20,184,166,0.6)] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light across bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[pulse_1.5s_infinite]"></div>
            </div>
          </div>

          {/* Real-Time Telemetry & Progress Readout */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 min-w-0 flex-1 text-left">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 animate-pulse" />
              <span className="truncate text-[11px] text-slate-300 font-medium">
                {BOOT_STAGES[stageIndex]?.text || 'Loading GCS Platform...'}
              </span>
            </div>

            <div className="font-mono font-bold text-teal-400 tabular-nums text-xs ml-3 shrink-0">
              {progress}%
            </div>
          </div>
        </div>

        {/* Quick Skip Button */}
        <div className="mt-8 pt-4 border-t border-slate-900/80 w-full flex justify-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
          >
            <span>Skip to Landing Page</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
