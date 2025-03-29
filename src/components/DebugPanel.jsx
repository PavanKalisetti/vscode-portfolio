import React from 'react';

const DebugPanel = () => {
  return (
    <div className="sidebar-section debug-panel">
      <div className="section-header">
        <span>RUN AND DEBUG</span>
      </div>
      <div className="content-placeholder">
        <p>No active debugging sessions.</p>
        <p className="small-text">This panel would normally show debug configurations and active debug sessions in VS Code.</p>
      </div>
    </div>
  );
};

export default DebugPanel; 