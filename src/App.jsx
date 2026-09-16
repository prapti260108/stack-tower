import React, { useState } from 'react';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import Section from './components/Section';
import TechnologyStack from './components/TechnologyStack';
import ProjectOverview from './components/ProjectOverview';
import ProjectFeatures from './components/ProjectFeatures';
import GameStatesViewer from './components/GameStatesViewer';
import TechnicalSpecs from './components/TechnicalSpecs';
import InteractiveMechanicPreview from './components/InteractiveMechanicPreview';
import { roleData } from './data/roleData';
import { projectData } from './data/projectData';

export default function App() {
  const [activeTab, setActiveTab] = useState('full-stack');

  // Sync active tab based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'full-stack', elementId: 'overview' },
        { id: 'ai-native', elementId: 'technology-stack' },
        { id: 'saas-paas', elementId: 'project-overview' },
        { id: 'cursor-ai', elementId: 'technical-scope' }
      ];

      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].elementId);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveTab(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabSelect = (tabId, href) => {
    setActiveTab(tabId);
    if (href && href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      {/* 1. Page Header matching reference screenshot */}
      <Header 
        eyebrow={roleData.eyebrow}
        title={roleData.title}
      />

      {/* 2. Category Navigation Bar matching reference screenshot */}
      <CategoryTabs 
        tabs={roleData.navigationTabs}
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 pt-7 pb-16">
        
        {/* 3. Introduction Paragraph */}
        <div id="overview" className="scroll-mt-16 mb-7">
          <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed max-w-4xl">
            {roleData.introduction}
          </p>
        </div>

        {/* 4. Key Responsibilities with Gold Bullets */}
        <Section title="KEY RESPONSIBILITIES">
          <ul className="gold-bullet-list">
            {roleData.keyResponsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </Section>

        {/* 5. Requirements with Gold Bullets */}
        <Section title="REQUIREMENTS">
          <ul className="gold-bullet-list">
            {roleData.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </Section>

        {/* 6. Technology Stack Section */}
        <TechnologyStack stack={roleData.technologyStack} />

        {/* 7. Stack Tower SOW Project Overview */}
        <ProjectOverview project={projectData} />

        {/* 8. Gameplay Specification & FR-01 - FR-10 */}
        <ProjectFeatures project={projectData} />

        {/* 9. Interactive SOW Mechanic Demonstration */}
        <InteractiveMechanicPreview />

        {/* 10. Game States, Screens & Visual/Audio Scope */}
        <GameStatesViewer project={projectData} />

        {/* 11. Technical Non-Functional Scope & QA Acceptance */}
        <TechnicalSpecs project={projectData} />
      </main>

      {/* Corporate Document Footer */}
      <footer className="w-full bg-[#071a2e] text-slate-400 text-xs border-t border-slate-800 py-6">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c59b27]"></span>
            <span className="font-semibold text-slate-200">AI Full-Stack Developer Profile</span>
            <span className="text-slate-600">|</span>
            <span>Stack Tower SOW Baseline v1.0</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Confidential · Project Planning & Engineering Specification Document
          </div>
        </div>
      </footer>
    </div>
  );
}
