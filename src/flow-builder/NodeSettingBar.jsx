import React from 'react';

export default ({ selectedNode = null }) => {
  return (
    <aside className="w-1/4 box-border bg-slate-50">
      {selectedNode && <p>Node selected</p>}
    </aside>
  );
};