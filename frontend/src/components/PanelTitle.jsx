import React from 'react';

export function PanelTitle({ icon: Icon, title, action }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-borderC mb-4 text-textMain">
      <h2 className="flex items-center gap-2 font-semibold text-lg"><Icon size={20} className="text-accent" /> {title}</h2>
      {action}
    </div>
  );
}
