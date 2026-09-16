import React from 'react';
import Section from './Section';

export default function ProjectFeatures({ project }) {
  const { gameplay, functionalRequirements } = project;

  return (
    <Section title="GAMEPLAY SPECIFICATION & FUNCTIONAL REQUIREMENTS" id="project-features" className="pt-6 border-t border-slate-200">
      {/* Core Mechanics & Mechanics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 p-4 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            01 · Primary Control
          </div>
          <h4 className="text-sm font-bold text-[#071a2e] mb-2">Single-Tap Action</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {gameplay.controls} Input triggers immediate release of the moving block with zero perceptible delay.
          </p>
        </div>

        <div className="border border-slate-200 p-4 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            02 · Alignment & Slicing
          </div>
          <h4 className="text-sm font-bold text-[#071a2e] mb-2">Overlap Mechanics</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Overlapping geometry forms the next platform. Any overhang is dynamically cut away into physics fragments.
          </p>
        </div>

        <div className="border border-slate-200 p-4 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            03 · Scoring & Combos
          </div>
          <h4 className="text-sm font-bold text-[#071a2e] mb-2">Precision Rewards</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {gameplay.scoring}
          </p>
        </div>
      </div>

      {/* Difficulty Escalation and Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="border border-slate-200 p-4 bg-slate-50/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#071a2e] mb-2.5">
            Difficulty Progression Factors
          </h4>
          <p className="text-xs text-slate-700 mb-3 leading-relaxed">
            {gameplay.difficultyProgression}
          </p>
          <div className="bg-white p-3 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">Critical Edge Cases Handled:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {gameplay.criticalEdgeCases.map((edge) => (
                <span key={edge} className="px-2 py-0.5 text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                  {edge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-slate-200 p-4 bg-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#071a2e] mb-2.5">
            Data-Driven Tuning Parameters
          </h4>
          <ul className="gold-bullet-list">
            {gameplay.tuningParameters.map((param, index) => (
              <li key={index} className="text-xs">{param}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Functional Requirements Matrix FR-01 through FR-10 */}
      <div className="border border-slate-200 bg-white">
        <div className="bg-[#071a2e] text-white px-4 py-2.5 flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Functional Requirements Matrix (FR-01 to FR-10)
          </h4>
          <span className="text-[10.5px] font-medium text-slate-300">
            Mandatory Release Scope
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3.5 font-bold w-20">ID</th>
                <th className="py-2.5 px-3.5 font-bold w-44">Requirement</th>
                <th className="py-2.5 px-3.5 font-bold">Acceptance Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {functionalRequirements.map((fr) => (
                <tr key={fr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono font-bold text-[#071a2e]">{fr.id}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-slate-800">{fr.name}</td>
                  <td className="py-2.5 px-3.5 text-slate-600">{fr.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
