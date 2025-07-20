import React from "react";

const ControlPanel = ({ onStop, onRestart, isRunning }) => {
  return (
    <div style={{ 
      position: "fixed", 
      bottom: "30px", 
      left: "50%", 
      transform: "translateX(-50%)",
      display: "flex",
      gap: "20px"
    }}>
      <button
        onClick={onStop}
        disabled={!isRunning}
        style={{ 
          padding: "15px 30px", 
          fontSize: "18px",
          backgroundColor: isRunning ? "#ff4757" : "#666",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: isRunning ? "pointer" : "not-allowed",
          fontWeight: "bold"
        }}
      >
        Stop Flight
      </button>
      <button
        onClick={onRestart}
        disabled={isRunning}
        style={{ 
          padding: "15px 30px", 
          fontSize: "18px",
          backgroundColor: !isRunning ? "#00ff88" : "#666",
          color: !isRunning ? "#1a1a2e" : "white",
          border: "none",
          borderRadius: "8px",
          cursor: !isRunning ? "pointer" : "not-allowed",
          fontWeight: "bold"
        }}
      >
        New Flight
      </button>
    </div>
  );
};

export default ControlPanel;
