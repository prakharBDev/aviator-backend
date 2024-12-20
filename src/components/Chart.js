import React, { useState, useEffect } from "react";
import samplePlaneImage from "../plane-image-frame1.png"; // Replace with your actual image path
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
import { motion } from "framer-motion";

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

const Graph = () => {
  const [planeData, setPlaneData] = useState([1]); // Plane's position on x-axis
  const [timeData, setTimeData] = useState([0]); // Time elapsed on y-axis
  const [planePosition, setPlanePosition] = useState(1); // Plane's current position
  const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed
  const [speed, setSpeed] = useState(0.02); // Slower speed for the plane's horizontal movement
  const [direction, setDirection] = useState(1); // Plane's up/down direction for pendulum motion
  const [verticalSpeed, setVerticalSpeed] = useState(0.05); // Speed of the vertical movement (slow upward motion)

  useEffect(() => {
    let animationFrameId;

    const updatePlanePosition = () => {
      // Plane moves forward horizontally with slower speed
      setPlanePosition((prevPosition) => prevPosition + speed);

      // Vertical motion is constant over time (simulating gradual upward flight)
      setTimeElapsed((prevTime) => prevTime + verticalSpeed);

      // Update plane's vertical position with a sinusoidal up-and-down motion
      const newYPosition = Math.sin(planePosition) * 10 + 2; // Simulate small up-and-down motion

      // Update plane data for chart and time data
      setPlaneData((prevData) => [...prevData, planePosition]);
      setTimeData((prevTime) => [...prevTime, newYPosition]);

      // Stop animation if plane position reaches a certain limit on the x-axis (keep within bounds)
      if (planePosition < 15) {
        animationFrameId = requestAnimationFrame(updatePlanePosition);
      }
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(updatePlanePosition);

    // Cleanup on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [planePosition, verticalSpeed, speed]);

  const chartData = {
    labels: planeData, // Plane's position on the x-axis
    datasets: [
      {
        label: "Plane Flight",
        data: timeData, // Time elapsed on the y-axis
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointRadius: 5,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Flying Plane Progress",
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 1,
        suggestedMax: 15, // Limit plane's progress on the x-axis (to ensure it doesn't go off-screen)
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        type: "linear",
        min: 0,
        suggestedMax: 3,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    animation: {
      duration: 0, // Disable default animation from Chart.js
    },
  };

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <Line data={chartData} options={options} />
      <motion.div
        style={{
          position: "absolute",
          top: `${50 - Math.sin(planePosition) * 10 + timeElapsed * 0.5}px`, // Pendulum-like motion + gradual upward movement
          left: `${(planePosition / 15) * 100}%`, // Plane moves horizontally within the screen (up to 15)
          transition: "all 0.1s linear",
        }}
      >
        <img
          src={samplePlaneImage}
          alt="Plane"
          style={{ width: "50px", height: "50px" }}
        />
      </motion.div>
    </div>
  );
};

export default Graph;
