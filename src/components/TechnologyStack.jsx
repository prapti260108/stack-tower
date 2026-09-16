import React from 'react';
import Section from './Section';

export default function TechnologyStack({ stack }) {
  const groups = [
    {
      key: 'frontend',
      data: stack.frontend,
      borderAccent: 'border-l-[#0a1a2e]',
      tagBg: 'bg-slate-100 text-slate-800 border-slate-200'
    },
    {
      key: 'backend',
      data: stack.backend,
      borderAccent: 'border-l-[#0a1a2e]',
      tagBg: 'bg-slate-100 text-slate-800 border-slate-200'
    },
    {
      key: 'database',
      data: stack.database,
      borderAccent: 'border-l-[#0a1a2e]',
      tagBg: 'bg-slate-100 text-slate-800 border-slate-200'
    },
    {
      key: 'aiDevelopment',
      data: stack.aiDevelopment,
      borderAccent: 'border-l-[#c59b27]',
      tagBg: 'bg-amber-50/70 text-slate-800 border-amber-200/60'
    }
  ];

  return (
    <Section title="TECHNOLOGY STACK" id="technology-stack" className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <div
            key={group.key}
            className={`bg-white border border-[#e2e8f0] border-l-4 ${group.borderAccent} p-4 rounded-none transition-all duration-150 hover:border-slate-400`}
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#071a2e]">
                {group.data.category}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {group.data.technologies.length} {group.data.technologies.length === 1 ? 'skill' : 'skills'}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mb-3 leading-snug">
              {group.data.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.data.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium border rounded-none ${group.tagBg}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
