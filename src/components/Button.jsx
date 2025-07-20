import React from "react";

const Button = ({ betAmount = "10.00", onBet, disabled = false }) => {
  return (
    <div>
      <button 
        onClick={onBet}
        disabled={disabled}
        style={{
          width: "200px",
          height: "70px",
          backgroundColor: disabled ? "#666" : "#28a909",
          border: "2px solid #b2f2a3",
          color: "white",
          borderRadius: "27px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.3s",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = "#22a006";
            e.target.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = "#28a909";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        BET <br /> {betAmount} INR
      </button>
    </div>
  );
};

export default Button; 