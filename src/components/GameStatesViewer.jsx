import React, { useState } from 'react';
import Section from './Section';

export default function GameStatesViewer({ project }) {
  const { gameStates, screens, visualAudioScope } = project;
  const [selectedTab, setSelectedTab] = useState('states');

  return (
    <Section title="GAME STATES, SCREENS & ASSET SPECIFICATIONS" id="game-states" className="pt-6 border-t border-slate-200">
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          onClick={() => setSelectedTab('states')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            selectedTab === 'states'
              ? 'border-[#071a2e] text-[#071a2e] bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gameplay State Flow
        </button>
        <button
          onClick={() => setSelectedTab('screens')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            selectedTab === 'screens'
              ? 'border-[#071a2e] text-[#071a2e] bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Screen Specifications
        </button>
        <button
          onClick={() => setSelectedTab('assets')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
            selectedTab === 'assets'
              ? 'border-[#071a2e] text-[#071a2e] bg-slate-50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Visual & Audio Scope
        </button>
      </div>

      {/* State Flow View */}
      {selectedTab === 'states' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {gameStates.map((gs, idx) => (
            <div key={gs.state} className="border border-slate-200 p-3.5 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    State 0{idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
                </div>
                <h4 className="text-[13.5px] font-bold text-[#071a2e] mb-1.5">{gs.state}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{gs.behavior}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screen Breakdown View */}
      {selectedTab === 'screens' && (
        <div className="border border-slate-200 bg-white">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 grid grid-cols-3 text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
            <span className="col-span-1">Screen / Overlay</span>
            <span className="col-span-2">Functional Scope</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {screens.map((sc) => (
              <div key={sc.screen} className="grid grid-cols-3 p-3 hover:bg-slate-50/70 transition-colors">
                <span className="font-bold text-[#071a2e] col-span-1">{sc.screen}</span>
                <span className="text-slate-600 col-span-2">{sc.scope}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual & Audio Asset Scope View */}
      {selectedTab === 'assets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 p-4 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c59b27] block mb-1">
                Visual Production Scope
              </span>
              <h4 className="text-sm font-bold text-[#071a2e] mb-2">Graphics & Particles</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {visualAudioScope.visualProduction}
              </p>
            </div>

            <div className="border border-slate-200 p-4 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c59b27] block mb-1">
                Audio Production Scope
              </span>
              <h4 className="text-sm font-bold text-[#071a2e] mb-2">Sound Design & Mixers</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {visualAudioScope.audioProduction}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 bg-white">
            <div className="bg-[#071a2e] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
              Asset Category Delivery Expectations
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {visualAudioScope.categories.map((cat) => (
                <div key={cat.category} className="grid grid-cols-4 p-3 hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-[#071a2e] col-span-1">{cat.category}</span>
                  <span className="text-slate-600 col-span-3">{cat.delivery}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
