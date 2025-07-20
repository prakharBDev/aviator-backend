import React, { useState, useEffect, useRef } from "react";
import Plane0 from "../assets/plane-0.svg";
import Plane1 from "../assets/plane-1.svg";
import Plane2 from "../assets/plane-2.svg";
import BgSun from "../assets/bg-sun.svg";

const Graph = ({ position, speed, isFlat, isStarted, viewportOffset = 0 }) => {
  const [currentPlane, setCurrentPlane] = useState(Plane0);
  const trailRef = useRef(null);
  const trailPointsRef = useRef([]);

  useEffect(() => {
    const planes = [Plane0, Plane1, Plane2];
    let currentIndex = 0;

    const animationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % planes.length; // Cycle through the planes
      setCurrentPlane(planes[currentIndex]);
    }, 150); // Change image every 0.15 seconds

    return () => clearInterval(animationInterval); // Clean up the interval
  }, []);

  // Draw red trail with improved rendering
  const drawTrail = (ctx, points, offset) => {
    if (points.length < 2) return;
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
    
    ctx.beginPath();
    // Adjust trail points based on viewport offset to maintain continuity
    const adjustedPoints = points.map(point => ({
      x: point.x - offset,
      y: point.y
    })).filter(point => point.x >= -50 && point.x <= 850); // Keep points within visible range
    
    if (adjustedPoints.length > 1) {
      ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
      for (let i = 1; i < adjustedPoints.length; i++) {
        ctx.lineTo(adjustedPoints[i].x, adjustedPoints[i].y);
      }
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0; // Reset shadow
  };

  // Update trail when position changes
  useEffect(() => {
    if (isStarted && trailRef.current) {
      const canvas = trailRef.current;
      const ctx = canvas.getContext('2d');
      
      // Add current position to trail (center of plane) - use absolute position
      const absoluteX = position.x + viewportOffset;
      const trailX = position.x;
      const trailY = position.y;
      trailPointsRef.current.push({ x: absoluteX, y: trailY });
      
      // Limit trail length to prevent memory issues but keep it longer for better visual
      if (trailPointsRef.current.length > 300) {
        trailPointsRef.current = trailPointsRef.current.slice(-300);
      }
      
      // Clear canvas and redraw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrail(ctx, trailPointsRef.current, viewportOffset);
    }
  }, [position, isStarted, viewportOffset]);

  // Reset trail when game restarts
  useEffect(() => {
    if (!isStarted) {
      trailPointsRef.current = [];
      if (trailRef.current) {
        const canvas = trailRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isStarted]);

  // Add some visual effects for speed
  const getPlaneRotation = () => {
    if (isFlat) return -5;
    // Add slight rotation based on speed for more dynamic feel
    const speedRotation = Math.min(speed * 2, 15);
    return 5 + speedRotation;
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Background SVG */}
      <svg
        viewBox="0 0 800 600"
        style={{
          position: "relative",
          height: "600px",
          width: "800px",
          backgroundColor: "black",
          display: "block",
          overflow: "hidden"
        }}
      >
        {/* Background - add some movement effect */}
        <image 
          href={BgSun} 
          width="800" 
          height="600" 
          alt="background"
          style={{
            transform: `translateX(${-(viewportOffset * 0.1) % 800}px)` // Subtle parallax effect
          }}
        />
        
        {/* Additional background for seamless scrolling */}
        <image 
          href={BgSun} 
          width="800" 
          height="600" 
          alt="background"
          x="800"
          style={{
            transform: `translateX(${-(viewportOffset * 0.1) % 800}px)` // Subtle parallax effect
          }}
        />
        
        {/* Speed Display */}
        <text
          x="400"
          y="100"
          textAnchor="middle"
          fill="white"
          fontSize="80"
          fontWeight="bold"
          style={{
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))"
          }}
        >
          {`${speed.toFixed(2)}x`}
        </text>

        {/* Animated Plane */}
        <image
          href={currentPlane}
          x={position.x - 50} // Center plane horizontally
          y={position.y - 30} // Center plane vertically  
          width="100"
          height="60"
          transform={`rotate(${getPlaneRotation()} ${position.x} ${position.y})`}
          style={{
            transition: "transform 0.1s ease-out",
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
          }}
        />

        {/* Add some motion lines behind the plane for speed effect */}
        {isStarted && speed > 2 && (
          <g opacity="0.6">
            {[...Array(3)].map((_, i) => (
              <line
                key={i}
                x1={position.x - 60 - (i * 20)}
                y1={position.y - 10 + (i * 5)}
                x2={position.x - 100 - (i * 20)}
                y2={position.y - 10 + (i * 5)}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}
      </svg>

      {/* Trail Canvas - positioned absolutely over the SVG */}
      <canvas
        ref={trailRef}
        width={800}
        height={600}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 1 // Place trail above background but below plane
        }}
      />
    </div>
  );
};

export default Graph;
