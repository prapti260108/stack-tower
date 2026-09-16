import React from 'react';

export default function CategoryTabs({ tabs, activeTab, onTabSelect }) {
  return (
    <nav 
      aria-label="Role and Project Navigation" 
      className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] shadow-[0_1px_2px_rgba(0,0,0,0.03)] sticky top-0 z-30"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex border-x border-[#e2e8f0] bg-[#f8fafc] overflow-x-auto no-scrollbar divide-x divide-[#e2e8f0]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  e.preventDefault();
                  onTabSelect(tab.id, tab.href);
                }}
                className={`
                  flex-1 min-w-[120px] sm:min-w-0 h-[34px] sm:h-[36px] flex items-center justify-center text-center
                  text-[12px] sm:text-[13px] font-semibold tracking-tight transition-all duration-150 select-none
                  ${
                    isActive
                      ? 'bg-white text-[#071a2e] font-bold shadow-[inset_0_-2.5px_0_0_#c59b27]'
                      : 'text-slate-700 hover:text-[#071a2e] hover:bg-slate-100/70'
                  }
                  focus:outline-none focus-visible:ring-1 focus-visible:ring-[#071a2e]
                `}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

