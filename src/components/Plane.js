// src/components/Plane.js
import React from "react";
import { motion } from "framer-motion";
import samplePlaneImage from "../plane-image-frame1.png";

const Plane = ({ multiplier }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: `${50 - multiplier * 10}px`,
        left: `${50 + multiplier * 20}px`,
        transition: "all 0.1s linear",
      }}
    >
      <img
        src={samplePlaneImage}
        alt="Plane"
        style={{ width: "50px", height: "50px" }}
      />
    </motion.div>
  );
};

export default Plane;
