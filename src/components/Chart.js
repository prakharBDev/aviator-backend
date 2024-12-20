import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ multiplier }) => {
  const [planeData, setPlaneData] = useState([0]); // Plane's position on x-axis (starts at 0)
  const [timeData, setTimeData] = useState([0]); // Plane's vertical position (starts at 0)
  const [speed] = useState(0.1); // Speed for the plane's horizontal movement
  const planePosition = useRef(0); // Ref for plane's current position (starts at 0)
  const animationFrameRef = useRef(null); // For storing the animation frame ID to cancel it later
  const startTimeRef = useRef(Date.now()); // Ref to store the start time
  const [initialPendulumPosition, setInitialPendulumPosition] = useState(0); // Store the initial position for pendulum motion
  const [sineWaveStarted, setSineWaveStarted] = useState(false); // Check if the sine wave has started
  const [lastVerticalPosition, setLastVerticalPosition] = useState(0); // Store the last vertical position before sine wave starts
  const [sineWaveStartTime, setSineWaveStartTime] = useState(0); // Store the start time of the sine wave

  useEffect(() => {
    const updatePlanePosition = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      // Get the current position of the plane
      const newPlanePosition = planePosition.current + speed;

      let newVerticalPosition;
      if (elapsedTime < 5000) {
        // Parabolic motion for the vertical position
        newVerticalPosition = 0.1 * Math.pow(newPlanePosition, 2);
        setInitialPendulumPosition(newVerticalPosition); // Update the initial pendulum position
      } else {
        if (!sineWaveStarted) {
          // Store the last vertical position before starting the sine wave
          setLastVerticalPosition(initialPendulumPosition);
          setSineWaveStarted(true);
          setSineWaveStartTime(newPlanePosition); // Store the start position of the sine wave
        }
        // Pendulum motion for the vertical position, starting from the last parabolic position
        newVerticalPosition = lastVerticalPosition + 20 * Math.sin((newPlanePosition - sineWaveStartTime) / 2);
      }

      // Update the position reference and chart data
      planePosition.current = newPlanePosition;
      setPlaneData((prevData) => [...prevData, newPlanePosition]);
      setTimeData((prevTime) => [...prevTime, newVerticalPosition]);

      // Continue the animation
      animationFrameRef.current = requestAnimationFrame(updatePlanePosition);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updatePlanePosition);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [speed, initialPendulumPosition, sineWaveStarted, lastVerticalPosition, sineWaveStartTime]); // Only trigger when dependencies change

  // Chart.js data
  const chartData = {
    labels: planeData, // Plane's position on the x-axis
    datasets: [
      {
        label: "Parabolic and Pendulum Motion",
        data: timeData, // Vertical position on the y-axis
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointRadius: 5,
        tension: 0.1,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Parabolic and Pendulum Motion Chart",
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        suggestedMax: 15, // Limit plane's progress on the x-axis
        grid: { display: true },
        ticks: { display: true },
      },
      y: {
        type: "linear",
        min: 0,
        suggestedMax: 25, // Adjust the vertical range to fit the parabolic and pendulum motion
        grid: { display: true },
        ticks: { display: true },
      },
    },
    animation: {
      duration: 0, // Disable default animation from Chart.js
    },
  };

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;