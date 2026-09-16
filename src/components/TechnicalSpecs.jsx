import React from 'react';
import Section from './Section';

export default function TechnicalSpecs({ project }) {
  const { technicalScope, analyticsEvents, deliverables, acceptanceCriteria } = project;

  return (
    <Section title="TECHNICAL SCOPE, ANALYTICS & QA ACCEPTANCE" id="technical-scope" className="pt-6 border-t border-slate-200">
      {/* Technical Non-Functional Requirements Grid */}
      <div className="border border-slate-200 bg-white mb-6">
        <div className="bg-[#071a2e] text-white px-4 py-2.5 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Technical & Non-Functional Specifications
          </h4>
          <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
            Mobile Baseline Standard
          </span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {technicalScope.map((item) => (
            <div key={item.area} className="grid grid-cols-1 sm:grid-cols-4 p-3 hover:bg-slate-50 transition-colors gap-1 sm:gap-4">
              <span className="font-bold text-[#071a2e] sm:col-span-1">{item.area}</span>
              <span className="text-slate-600 sm:col-span-3 leading-relaxed">{item.requirement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Deliverables Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Recommended Analytics Events */}
        <div className="border border-slate-200 bg-white p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#071a2e] mb-3">
            Recommended Telemetry & Analytics Events
          </h4>
          <div className="space-y-2">
            {analyticsEvents.map((evt) => (
              <div key={evt.event} className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
                <code className="font-mono font-bold text-sky-800 text-[11px] block mb-0.5">
                  {evt.event}
                </code>
                <span className="text-slate-600">Parameters: {evt.parameters}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9 Deliverables from SOW */}
        <div className="border border-slate-200 bg-white p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#071a2e] mb-3">
            SOW Deliverables Baseline (Items 1–9)
          </h4>
          <ol className="space-y-1.5 text-xs text-slate-700">
            {deliverables.map((item) => (
              <li key={item.id} className="flex items-start gap-2 py-1 border-b border-slate-100 last:border-b-0">
                <span className="font-mono font-bold text-[#c59b27] w-5 text-right shrink-0">
                  0{item.id}
                </span>
                <span className="leading-snug">{item.deliverable}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Release Acceptance Criteria with Gold Bullets */}
      <div className="border border-slate-200 bg-slate-50/70 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#071a2e] mb-3">
          Release Acceptance Criteria
        </h4>
        <ul className="gold-bullet-list">
          {acceptanceCriteria.map((criterion, idx) => (
            <li key={idx} className="text-xs text-slate-700">
              {criterion}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
