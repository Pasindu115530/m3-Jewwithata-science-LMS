'use client';

import React, { useState, useEffect } from 'react';
import { FlaskConical, Play, RotateCcw, CheckCircle, Sparkles, X, Info, Download, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveLabModalProps {
  labType: 'titration' | 'optics' | 'pendulum' | 'dna' | null;
  onClose: () => void;
}

export const InteractiveLabModal: React.FC<InteractiveLabModalProps> = ({ labType, onClose }) => {
  if (!labType) return null;

  // Titration state
  const [naohVolume, setNaohVolume] = useState(0); // mL
  const [isTitrating, setIsTitrating] = useState(false);
  const [titrationComplete, setTitrationComplete] = useState(false);

  // Optics state
  const [incidentAngle, setIncidentAngle] = useState(30); // degrees
  const [refractiveIndex, setRefractiveIndex] = useState(1.52); // Glass

  // Pendulum state
  const [length, setLength] = useState(1.0); // meters
  const [gravity, setGravity] = useState(9.81); // m/s^2

  // Titration auto-add effect
  useEffect(() => {
    let interval: any;
    if (isTitrating && naohVolume < 40) {
      interval = setInterval(() => {
        setNaohVolume((prev) => {
          const next = Number((prev + 0.5).toFixed(1));
          if (next >= 24.5 && next <= 25.5 && !titrationComplete) {
            setTitrationComplete(true);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
          return next;
        });
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTitrating, naohVolume, titrationComplete]);

  // Calculations
  const calculatedpH = naohVolume < 24.5
    ? (1.0 + (naohVolume / 24.5) * 5.0).toFixed(2)
    : naohVolume <= 25.5
    ? (7.00).toFixed(2)
    : (7.0 + (naohVolume - 25.5) * 0.4).toFixed(2);

  // Optics calculation: Snell's Law sin(r) = sin(i) / n
  const radIncident = (incidentAngle * Math.PI) / 180;
  const sinRefracted = Math.sin(radIncident) / refractiveIndex;
  const refractedAngle = Math.asin(sinRefracted) * (180 / Math.PI);

  // Pendulum period T = 2 * pi * sqrt(L / g)
  const period = (2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden border border-purple-200 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {labType === 'titration' && 'Interactive Chemistry Titration Simulator'}
                {labType === 'optics' && 'Interactive Light Refraction Optics Simulator'}
                {(labType === 'pendulum' || labType === 'dna') && 'Physics Simple Pendulum Oscillation Simulator'}
              </h3>
              <p className="text-purple-300 text-xs">Real-time parameters, live graph visualizer & formula calculations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* SIMULATOR 1: CHEMISTRY TITRATION */}
          {labType === 'titration' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Graphic Stage */}
              <div className="md:col-span-6 bg-purple-50/80 rounded-3xl p-6 border border-purple-100 flex flex-col items-center justify-center relative min-h-[320px]">
                {/* Burette Visual */}
                <div className="w-6 h-40 bg-purple-200/60 rounded-t-lg border-2 border-purple-400 relative overflow-hidden flex flex-col justify-end">
                  <div
                    className="w-full bg-purple-500/80 transition-all duration-300"
                    style={{ height: `${Math.max(0, 100 - (naohVolume / 40) * 100)}%` }}
                  ></div>
                  <div className="absolute top-2 left-1 text-[8px] font-bold text-purple-900">0 mL</div>
                  <div className="absolute bottom-2 left-1 text-[8px] font-bold text-purple-900">40 mL</div>
                </div>

                {/* Burette Valve Drop Animation */}
                <div className="w-2 h-8 bg-purple-300 my-1 relative flex items-center justify-center">
                  {isTitrating && (
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></div>
                  )}
                </div>

                {/* Flask Visual */}
                <div className="w-32 h-32 relative flex items-end justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Flask outline */}
                    <path
                      d="M 40 10 L 60 10 L 60 35 L 85 85 C 88 90, 85 95, 75 95 L 25 95 C 15 95, 12 90, 15 85 L 40 35 Z"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                    />
                    {/* Liquid fill */}
                    <path
                      d="M 22 72 L 78 72 C 85 90, 75 93, 75 93 L 25 93 C 25 93, 15 90, 22 72 Z"
                      fill={naohVolume >= 24.5 ? '#F472B6' : '#E9D5FF'}
                      className="transition-colors duration-500"
                    />
                  </svg>
                </div>

                {/* Color Status Indicator */}
                <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-purple-200 text-purple-950 shadow-xs flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${naohVolume >= 24.5 ? 'bg-pink-500 animate-pulse' : 'bg-purple-200'}`}></span>
                  <span>
                    {naohVolume < 24.5 ? 'Clear Solution (Acidic)' : naohVolume <= 25.5 ? '🌸 Light Pink (ENDPOINT REACHED!)' : 'Dark Pink (Excess Base)'}
                  </span>
                </div>
              </div>

              {/* Controls & Readings */}
              <div className="md:col-span-6 space-y-4">
                <div className="clay-card p-5 space-y-3">
                  <h4 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Reaction Parameters
                  </h4>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-purple-900">
                      <span>0.1 M NaOH Volume Added:</span>
                      <span className="text-purple-600">{naohVolume} mL</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.5"
                      value={naohVolume}
                      onChange={(e) => setNaohVolume(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                      <p className="text-[10px] text-purple-500 font-bold uppercase">Calculated pH</p>
                      <p className="text-xl font-black text-purple-950">{calculatedpH}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100">
                      <p className="text-[10px] text-pink-500 font-bold uppercase">Calculated Molarity</p>
                      <p className="text-xl font-black text-pink-950">
                        {naohVolume > 0 ? (0.1 * (naohVolume / 25.0)).toFixed(3) : '0.000'} M
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setIsTitrating(!isTitrating)}
                      className="flex-1 clay-btn py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isTitrating ? 'Pause Drop Rate' : 'Auto Add NaOH'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setNaohVolume(0);
                        setIsTitrating(false);
                        setTitrationComplete(false);
                      }}
                      className="px-4 py-2.5 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  </div>
                </div>

                {titrationComplete && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1 animate-bounce">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" /> Lab Success! Endpoint Confirmed!
                    </p>
                    <p>Exact stoichiometric equivalence reached at 24.5 - 25.0 mL NaOH. Molarity = 0.098 M HCl.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIMULATOR 2: PHYSICS OPTICS */}
          {labType === 'optics' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 bg-slate-950 rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center relative min-h-[320px]">
                {/* Ray Optics Canvas Mock */}
                <div className="relative w-full h-64 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                  {/* Air/Glass Interface Line */}
                  <div className="absolute w-full h-0.5 bg-purple-400/60 top-1/2"></div>
                  {/* Normal Line */}
                  <div className="absolute h-full w-0.5 bg-slate-700 top-0 left-1/2 stroke-dasharray-2"></div>

                  <div className="absolute top-4 left-4 text-[10px] text-slate-400 font-bold">Medium 1: Air (n1 = 1.0)</div>
                  <div className="absolute bottom-4 left-4 text-[10px] text-purple-400 font-bold">Medium 2: Glass (n2 = {refractiveIndex})</div>

                  {/* Incident Ray Line */}
                  <div
                    className="absolute w-32 h-1 bg-amber-400 origin-right transition-all duration-200 shadow-md shadow-amber-400/50"
                    style={{
                      left: 'calc(50% - 128px)',
                      top: 'calc(50% - 2px)',
                      transform: `rotate(${incidentAngle}deg)`
                    }}
                  ></div>

                  {/* Refracted Ray Line */}
                  <div
                    className="absolute w-32 h-1 bg-cyan-400 origin-left transition-all duration-200 shadow-md shadow-cyan-400/50"
                    style={{
                      left: '50%',
                      top: 'calc(50% - 2px)',
                      transform: `rotate(${refractedAngle}deg)`
                    }}
                  ></div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span className="text-amber-400 font-bold">● Incident Ray ({incidentAngle}°)</span>
                  <span className="text-cyan-400 font-bold">● Refracted Ray ({refractedAngle.toFixed(1)}°)</span>
                </div>
              </div>

              {/* Controls */}
              <div className="md:col-span-6 space-y-4">
                <div className="clay-card p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-purple-950">Snell’s Law Refraction Controls</h4>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Incident Angle (θ1):</span>
                      <span className="text-purple-600">{incidentAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={incidentAngle}
                      onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Glass Refractive Index (n2):</span>
                      <span className="text-purple-600">{refractiveIndex}</span>
                    </div>
                    <input
                      type="range"
                      min="1.1"
                      max="2.4"
                      step="0.05"
                      value={refractiveIndex}
                      onChange={(e) => setRefractiveIndex(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-xs space-y-1">
                    <p className="font-bold text-purple-950">Formula Applied:</p>
                    <p className="font-mono text-purple-700">1.0 × sin({incidentAngle}°) = {refractiveIndex} × sin(θ2)</p>
                    <p className="font-extrabold text-purple-900 text-sm pt-1">θ2 = {refractedAngle.toFixed(2)}°</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR 3: PENDULUM */}
          {(labType === 'pendulum' || labType === 'dna') && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 bg-purple-50/80 rounded-3xl p-6 border border-purple-100 flex flex-col items-center justify-center relative min-h-[300px]">
                {/* Ceiling */}
                <div className="w-48 h-3 bg-purple-300 rounded-full mb-2"></div>
                {/* String */}
                <div
                  className="w-1 bg-purple-500 origin-top transition-all duration-300 relative flex items-end justify-center"
                  style={{ height: `${length * 150}px` }}
                >
                  {/* Bob */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 border-2 border-white shadow-lg animate-float-slow -mb-5"></div>
                </div>
              </div>

              <div className="md:col-span-6 space-y-4">
                <div className="clay-card p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-purple-950">Simple Pendulum Oscillation</h4>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>String Length (L):</span>
                      <span className="text-purple-600">{length} meters</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.0"
                      step="0.1"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Gravitational Accel (g):</span>
                      <span className="text-purple-600">{gravity} m/s²</span>
                    </div>
                    <input
                      type="range"
                      min="1.6"
                      max="15.0"
                      step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(parseFloat(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-900">Oscillation Period (T):</p>
                    <p className="text-3xl font-black text-indigo-950 mt-1">{period} seconds</p>
                    <p className="text-[10px] text-indigo-600 font-mono mt-1">Formula: T = 2π √(L / g)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
