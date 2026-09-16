import React from 'react';
import Section from './Section';

export default function ProjectOverview({ project }) {
  const { metadata, productVision, operatingAssumptions } = project;

  return (
    <Section title="PROJECT REFERENCE: STACK TOWER (SOW)" id="project-overview" className="pt-6 border-t border-slate-200">
      {/* SOW Document Header Block */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#c59b27]">
              {metadata.document} · GAME ID {metadata.gameId}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#071a2e] tracking-tight">
              {metadata.title}
            </h3>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-white text-slate-700 border border-slate-300">
              Version {metadata.version}
            </span>
            <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-[#071a2e] text-white">
              {metadata.status}
            </span>
          </div>
        </div>

        {/* Tagline callout */}
        <p className="text-[15.5px] font-medium text-slate-700 mb-4 italic">
          "{metadata.tagline}"
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs bg-white p-3.5 border border-slate-200">
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Genre</dt>
            <dd className="font-medium text-slate-800 mt-0.5">{metadata.genre}</dd>
          </div>
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Complexity</dt>
            <dd className="font-medium text-slate-800 mt-0.5">{metadata.complexity}</dd>
          </div>
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Target Devices</dt>
            <dd className="font-medium text-slate-800 mt-0.5">{metadata.target}</dd>
          </div>
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Orientation</dt>
            <dd className="font-medium text-slate-800 mt-0.5">Portrait by default</dd>
          </div>
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Connectivity</dt>
            <dd className="font-medium text-slate-800 mt-0.5">Core offline</dd>
          </div>
          <div>
            <dt className="text-slate-400 uppercase font-semibold text-[10px]">Performance Target</dt>
            <dd className="font-semibold text-[#071a2e] mt-0.5">60 FPS Baseline</dd>
          </div>
        </div>

        {/* SOW Baseline Preparation Notice */}
        <div className="mt-3 text-[11.5px] text-slate-500 bg-slate-100/70 p-2.5 border-l-2 border-[#071a2e]">
          <strong className="text-slate-700">Prepared for:</strong> {metadata.preparedFor}
        </div>
      </div>

      {/* Purpose & Product Vision Callout Box */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          1. Purpose & Core Mechanic Statement
        </h3>
        <div className="bg-sky-50/50 border border-sky-200 p-4 mb-4">
          <p className="text-[14px] leading-relaxed text-slate-800 font-medium">
            {productVision.calloutText}
          </p>
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          {productVision.overview}
        </p>
      </div>

      {/* Operating Assumptions & Success Measures in Side-by-Side Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Success Measures Table */}
        <div className="border border-slate-200 bg-white">
          <div className="bg-[#071a2e] text-white px-3.5 py-2">
            <h4 className="text-[11.5px] font-bold uppercase tracking-wider">
              Success Measures (Baseline Target)
            </h4>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {productVision.successMeasures.map((item) => (
              <div key={item.area} className="grid grid-cols-3 p-2.5 hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-800 col-span-1">{item.area}</span>
                <span className="text-slate-600 col-span-2">{item.target}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Platforms & Assumptions Table */}
        <div className="border border-slate-200 bg-white">
          <div className="bg-[#071a2e] text-white px-3.5 py-2">
            <h4 className="text-[11.5px] font-bold uppercase tracking-wider">
              Target Platforms & Operating Assumptions
            </h4>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {operatingAssumptions.map((item) => (
              <div key={item.item} className="grid grid-cols-3 p-2.5 hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-800 col-span-1">{item.item}</span>
                <span className="text-slate-600 col-span-2">{item.baseline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
