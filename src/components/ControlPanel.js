// src/components/ControlPanel.js
import React from "react";

const ControlPanel = ({ onStop }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={onStop}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Stop
      </button>
    </div>
  );
};

export default ControlPanel;
