import React from 'react';

export default function SectionContainer({ children }) {
  return (
    <div className="container pb-0 mb-0 mt-4">
      <section className="py-3 pt-0">
        <div className="container py-3 mt-0 pt-3">
          {children}
        </div>
      </section>
      <section>
        <header></header>
      </section>
    </div>
  );
}
