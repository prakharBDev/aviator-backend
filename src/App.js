// src/App.js
import React, { useState, useEffect, useRef } from "react";
import Graph from "./components/Graph";
import ControlPanel from "./components/ControlPanel";
import BettingPanel from "./components/BettingPanel";
import BetTable from "./components/BetTable";

const App = () => {
  const [speed, setSpeed] = useState(1); // Initial speed
  const [position, setPosition] = useState({ x: 0, y: 550 }); // Initial position
  const [motionType, setMotionType] = useState("takeoff"); // Current motion type
  const [isStarted, setIsStarted] = useState(false); // Game start state
  const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed since start
  const [sineOffset, setSineOffset] = useState(0); // Offset for sine wave start
  const [countdown, setCountdown] = useState(3); // Countdown timer
  const [transitioning, setTransitioning] = useState(false); // Smooth transition state
  const [multiplier, setMultiplier] = useState(1.00); // Multiplier for display
  const [viewportOffset, setViewportOffset] = useState(0); // For continuous movement effect
  const [betData, setBetData] = useState({}); // Store betting data
  const [userBets, setUserBets] = useState({}); // Store user bets
  
  const startTimeRef = useRef(null);

  useEffect(() => {
    let countdownInterval;

    // Start countdown when component mounts
    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            startGame(); // Start the game when countdown reaches 0
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, []);

  const startGame = () => {
    setSpeed(1); // Reset speed
    setPosition({ x: 0, y: 550 }); // Reset position
    setMotionType("takeoff"); // Start with takeoff motion
    setIsStarted(true); // Start the game
    setTimeElapsed(0); // Reset elapsed time
    setSineOffset(0); // Reset sine offset
    setMultiplier(1.00); // Reset multiplier
    setCountdown(0); // Reset countdown
    setViewportOffset(0); // Reset viewport offset
    startTimeRef.current = Date.now();
  };

  const stopGame = () => {
    setIsStarted(false); // Stop the game
    setSpeed(1); // Reset speed
    setPosition({ x: 0, y: 550 }); // Reset position to starting point
    setMotionType("takeoff"); // Reset motion type
    setTimeElapsed(0); // Reset elapsed time
    setSineOffset(0); // Reset sine offset
    setMultiplier(1.00); // Reset multiplier
    setViewportOffset(0); // Reset viewport offset
    // Clear user bets for next round
    setUserBets({});
  };

  const handleRestart = () => {
    stopGame();
    setCountdown(3); // Start new countdown
  };

  const handleBet = (amount) => {
    if (isStarted) {
      const playerName = `Player${Object.keys(userBets).length + 1}`;
      setUserBets(prev => ({
        ...prev,
        [playerName]: {
          initialBet: amount,
          multiplier: multiplier,
          timestamp: Date.now()
        }
      }));
      
      // Add some demo bets for realism
      if (Math.random() > 0.7) {
        const demoPlayer = `User${Math.floor(Math.random() * 1000)}`;
        const demoAmount = [50, 100, 200, 500][Math.floor(Math.random() * 4)];
        setBetData(prev => ({
          ...prev,
          [demoPlayer]: {
            initialBet: demoAmount
          }
        }));
      }
    }
  };

  useEffect(() => {
    let motionInterval;
    let speedInterval;
    let timer;
    let multiplierInterval;

    if (isStarted) {
      // Timer to track elapsed time
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 50);
      }, 50);

      // Update multiplier based on elapsed time (exponential growth like Aviator)
      multiplierInterval = setInterval(() => {
        if (startTimeRef.current) {
          const deltaTime = (Date.now() - startTimeRef.current) / 1000;
          const newMultiplier = Math.exp(0.15 * deltaTime);
          setMultiplier(newMultiplier);
        }
      }, 50);

      // Gradually increase speed
      speedInterval = setInterval(() => {
        setSpeed((prevSpeed) => Math.min(prevSpeed + 0.02, 10)); // Increment speed up to 10x
      }, 100);

      // Update position based on motion type
      motionInterval = setInterval(() => {
        setPosition((prev) => {
          const nextX = prev.x + speed * 2;
          let nextY;

          if (motionType === "takeoff") {
            nextY = prev.y - 1.5 * speed; // Realistic takeoff
            if (prev.y <= 400) {
              setMotionType("parabolic"); // Switch to parabolic after takeoff
            }
          } else if (motionType === "parabolic") {
            nextY = 550 - 0.002 * (nextX - 300) ** 2; // Parabolic motion
          } else if (motionType === "sine") {
            if (transitioning) {
              // Gradual interpolation during transition
              const targetY = 300 + 50 * Math.sin(((nextX - sineOffset) / 100) * Math.PI); // Sine wave target
              nextY = prev.y + (targetY - prev.y) * 0.2; // Smooth weighted interpolation
              if (Math.abs(nextY - targetY) < 0.5) {
                setTransitioning(false); // End transition once aligned
              }
            } else {
              // Normal sine wave motion
              const sineX = nextX - sineOffset;
              nextY = 300 + 50 * Math.sin((sineX / 100) * Math.PI);
            }
          } else if (motionType === "flat") {
            nextY = 300; // Flat motion
          }

          // When plane reaches the edge, shift the viewport to create continuous movement
          if (nextX > 700) {
            // Shift viewport to keep plane visible and create illusion of continuous flight
            setViewportOffset(prevOffset => prevOffset + 100);
            return { x: nextX - 100, y: Math.max(nextY, 50) }; // Keep plane on screen
          }

          return { x: nextX, y: Math.max(nextY, 50) }; // Ensure Y stays in bounds
        });
      }, 50);

      // Transition from parabolic to sine after 5 seconds
      if (timeElapsed >= 5000 && motionType === "parabolic") {
        setTransitioning(true); // Trigger smooth transition
        setMotionType("sine");
        setSineOffset(position.x); // Set the sine wave offset
      }

      return () => {
        clearInterval(motionInterval);
        clearInterval(speedInterval);
        clearInterval(timer);
        clearInterval(multiplierInterval);
      };
    }
  }, [isStarted, motionType, position.x, speed, timeElapsed, transitioning]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1a1a2e",
        color: "white"
      }}
    >
      {/* Header */}
      <h1 style={{ 
        margin: "10px 0", 
        fontSize: "2rem", 
        textAlign: "center",
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
      }}>
        Aviator Game - Multiplier: <span style={{ color: "#00ff88" }}>{multiplier.toFixed(2)}x</span>
      </h1>
      
      {/* Main Game Area */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "flex-start",
        height: "calc(100vh - 250px)",
        padding: "0 20px"
      }}>
        {/* Left Side - Bet Table */}
        <div style={{ 
          width: "250px",
          marginRight: "20px"
        }}>
          <BetTable betData={{ ...betData, ...userBets }} />
        </div>

        {/* Center - Game Area */}
        <div style={{ 
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}>
          <Graph 
            position={position} 
            speed={speed} 
            isFlat={motionType === "flat"}
            isStarted={isStarted}
            viewportOffset={viewportOffset}
          />
          {!isStarted && countdown > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "48px",
                color: "#ff4757",
                textAlign: "center",
                zIndex: 10,
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}
            >
              Starting in: {countdown}
            </div>
          )}
        </div>

        {/* Right Side - Another Bet Table or Stats */}
        <div style={{ 
          width: "250px",
          marginLeft: "20px"
        }}>
          <div style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "10px", color: "#00ff88" }}>Game Stats</h3>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#ccc" }}>Time: </span>
              <span style={{ color: "white" }}>{(timeElapsed / 1000).toFixed(1)}s</span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#ccc" }}>Speed: </span>
              <span style={{ color: "white" }}>{speed.toFixed(2)}x</span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#ccc" }}>Phase: </span>
              <span style={{ color: "#ff4757", textTransform: "capitalize" }}>{motionType}</span>
            </div>
            <div>
              <span style={{ color: "#ccc" }}>Active Bets: </span>
              <span style={{ color: "#00ff88" }}>{Object.keys({ ...betData, ...userBets }).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Betting Panels */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "20px",
        alignItems: "center"
      }}>
        <BettingPanel 
          onBet={handleBet}
          isRunning={isStarted}
          disabled={!isStarted}
        />
        
        <BettingPanel 
          onBet={handleBet}
          isRunning={isStarted}
          disabled={!isStarted}
        />

        <ControlPanel 
          onStop={stopGame} 
          onRestart={handleRestart} 
          isRunning={isStarted} 
        />
      </div>
    </div>
  );
};

export default App;
