/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from "./components/SnakeGame";
import { MusicPlayer } from "./components/MusicPlayer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Header */}
      <header className="mb-8 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
          SYNTH<span className="text-white">SNAKE</span>
        </h1>
        <p className="text-cyan-400 font-mono tracking-[0.2em] uppercase text-xs mt-2 opacity-80">
          Terminal UI v2.4
        </p>
      </header>

      {/* Main Content Layout */}
      <div className="w-full max-w-6xl z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
        {/* Game Container */}
        <div className="flex-1 w-full flex justify-center">
          <SnakeGame />
        </div>

        {/* Music Player Container */}
        <div className="w-full lg:w-96 flex flex-col gap-6 items-center">
          <MusicPlayer />
          
          {/* Aesthetic Decor Panel */}
          <div className="w-full max-w-sm border border-cyan-500/20 bg-slate-900/50 backdrop-blur rounded-xl p-4 hidden md:block relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
             <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
             <h3 className="text-cyan-400 font-mono text-xs mb-3 tracking-widest uppercase">System Stats</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-mono mb-1">
                   <span className="text-slate-500">Core Engine Usage</span>
                   <span className="text-slate-300 animate-pulse">42%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-[42%] h-full bg-cyan-500 rounded-full" />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-mono mb-1">
                   <span className="text-slate-500">Audio Sync</span>
                   <span className="text-fuchsia-400 font-bold">LOCKED</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-full h-full bg-fuchsia-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
