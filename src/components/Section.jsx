import React from 'react';

export default function Section({ title, children, className = "", id = "" }) {
  return (
    <section id={id} className={`scroll-mt-14 mb-8 sm:mb-9 ${className}`}>
      {title && (
        <h2 className="text-[12.5px] sm:text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#071a2e] mb-3 select-none">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
