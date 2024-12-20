// src/App.js
import React, { useState, useEffect } from "react";
import Plane from "./components/Plane";
import Graph from "./components/Chart";
import ControlPanel from "./components/ControlPanel";

const App = () => {
  const [multiplier, setMultiplier] = useState(1); // Initial multiplier
  const [data, setData] = useState([1]); // Graph data
  const [isRunning, setIsRunning] = useState(true); // Control animation

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMultiplier((prev) => {
        const nextMultiplier = parseFloat((prev + 0.1).toFixed(2)); // Increment multiplier
        setData((prevData) => [...prevData, nextMultiplier]); // Add to graph data
        return nextMultiplier;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStop = () => setIsRunning(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Current Multiplier: <b>{multiplier.toFixed(2)}x</b>
      </h1>
      {/* <Plane multiplier={multiplier} /> */}
      <div style={{ marginTop: "50px" }}>
        <Graph data={data}  multiplier = {multiplier.toFixed(2)}/>
      </div>
      <ControlPanel onStop={handleStop} />
    </div>
  );
};

export default App;
