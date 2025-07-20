import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AirplaneAnimation.css';

const AirplaneAnimation = ({ isRunning = true }) => {
  const airplaneRef = useRef(null);
  const trailRef = useRef(null);
  const animationContainerRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const lastTimeRef = useRef(null);
  const trailPointsRef = useRef([]);
  const lastRotationRef = useRef(0); // Add ref to track last rotation

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const TOTAL_DURATION = 12000; // 12 seconds
  const OSCILLATION_START_THRESHOLD_X = 0.65; // Start oscillation after 65% of horizontal travel
  const CURVE_POWER = 0.6; // Lower for a quicker upward curve, higher for slower (needs to be < 1 for leveling off)
  const PEAK_HEIGHT_FACTOR = 0.6; // Plane reaches 60% of container height from the top
  
  const OSCILLATION_AMPLITUDE = 15; // Pixels
  const OSCILLATION_FREQUENCY = 3; // Controls speed of bobbing, higher is faster

  const drawTrail = useCallback((ctx, points, containerHeight) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, []);

  const clearTrail = useCallback(() => {
    if (trailRef.current) {
      const canvas = trailRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trailPointsRef.current = [];
    }
  }, []);

  const animate = useCallback((timestamp) => {
    if (!animationContainerRef.current || !airplaneRef.current || !isRunning) {
      return;
    }

    const container = animationContainerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Set canvas dimensions if not set or changed
    if (trailRef.current) {
        const canvas = trailRef.current;
        if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
            canvas.width = containerWidth;
            canvas.height = containerHeight;
        }
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
      clearTrail(); // Clear trail at the very beginning
      trailPointsRef.current.push({ x: 0, y: containerHeight }); // Start trail from bottom-left
    }
    const elapsedTime = timestamp - lastTimeRef.current;

    let progress = (elapsedTime / TOTAL_DURATION);

    if (progress >= 1) {
      progress = 0;
      lastTimeRef.current = timestamp; // Reset start time for the new loop
      clearTrail();
      trailPointsRef.current.push({ x: 0, y: containerHeight });
    }

    // Exponential curve for path
    // X moves linearly with progress
    let currentX = progress * containerWidth;

    // Y starts from containerHeight (bottom) and moves up
    // The curve should make it rise quickly and then level off.
    // y = initial_y - height_of_climb * (progress_x ^ curve_power)
    // We want y to go from containerHeight to containerHeight * (1 - PEAK_HEIGHT_FACTOR)
    const targetPeakY = containerHeight * (1 - PEAK_HEIGHT_FACTOR); // From top
    const totalClimbHeight = containerHeight - targetPeakY;

    let currentY = containerHeight - (totalClimbHeight * Math.pow(currentX / containerWidth, CURVE_POWER));
    
    // Ensure plane does not go above its intended peak before oscillation
    if (currentY < targetPeakY && (currentX / containerWidth) < OSCILLATION_START_THRESHOLD_X) {
        currentY = targetPeakY;
    }

    // Oscillation after reaching a certain horizontal point and while moving forward
    if (currentX / containerWidth >= OSCILLATION_START_THRESHOLD_X) {
      const timeInOscillation = (currentX - (OSCILLATION_START_THRESHOLD_X * containerWidth)) / 
                                ((1 - OSCILLATION_START_THRESHOLD_X) * containerWidth); // Progress within oscillation phase
      const oscillationValue = OSCILLATION_AMPLITUDE * Math.sin(timeInOscillation * Math.PI * 2 * OSCILLATION_FREQUENCY);
      currentY = targetPeakY + oscillationValue;
    }
    
    // Ensure plane doesn't go below the screen due to oscillation near the start of oscillation phase
    currentY = Math.min(currentY, containerHeight - airplaneRef.current.offsetHeight / 2);
    currentY = Math.max(currentY, 0 + airplaneRef.current.offsetHeight / 2); // Prevent going off top

    // Rotation
    let newRotation = 0;
    if (trailPointsRef.current.length > 0) {
      const prevPoint = trailPointsRef.current[trailPointsRef.current.length - 1];
      const dx = currentX - prevPoint.x;
      const dy = currentY - prevPoint.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) { // Only rotate if there's movement
          newRotation = Math.atan2(dy, dx) * (180 / Math.PI);
      } else {
          // Keep last rotation if no significant movement - use ref instead of state
          newRotation = lastRotationRef.current;
      }
    }
    
    setPosition({ x: currentX, y: currentY });
    setRotation(newRotation);

    // Add current point to trail
    // For trail, we need to map position to where the emoji center is.
    // The `position` state is for the top-left of the emoji div by default with `transform`.
    // Let's assume the trail should emanate from the visual center of the emoji.
    // For simplicity, drawing from currentX, currentY which is top-left of the airplane div.
    // If emoji is centered in its div, this might look slightly off. We'll adjust if needed.
    trailPointsRef.current.push({ x: currentX, y: currentY });

    if (trailRef.current) {
      const canvas = trailRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame's trail
      drawTrail(ctx, trailPointsRef.current, containerHeight);
    }

    lastRotationRef.current = newRotation;
    
    if (isRunning) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
  }, [drawTrail, clearTrail, isRunning]);

  useEffect(() => {
    if (isRunning) {
      // Start animation when isRunning becomes true
      lastTimeRef.current = null; // Reset time for a fresh start
      clearTrail(); // Clear any previous trail data
      trailPointsRef.current = []; // Reset trail points
      
      // Start the animation loop
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else {
      // Stop animation when isRunning becomes false
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [animate, clearTrail, isRunning]);

  return (
    <div ref={animationContainerRef} className="animation-container">
      <canvas ref={trailRef} className="trail-canvas"></canvas>
      <div
        ref={airplaneRef}
        className="airplane"
        style={{
          // Position is relative to container, transform origin is bottom-left for initial state
          // but airplane emoji is centered, so we adjust to make it look like it starts at bottom-left edge
          transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%)) rotate(${rotation}deg)`,
        }}
      >
        ✈️
      </div>
    </div>
  );
};

export default AirplaneAnimation; 