import React, { useState } from "react";
import Button from "./Button";

const BettingPanel = ({ onBet, isRunning, disabled = false }) => {
  const [activeButton, setActiveButton] = useState("bet");
  const [betAmount, setBetAmount] = useState(10.00);

  const presetAmounts = [100.00, 200.00, 500.00, 1000.00];

  const handleBet = () => {
    if (onBet) {
      onBet(betAmount);
    }
  };

  const incrementBet = () => {
    setBetAmount(prev => Math.min(prev + 10, 10000));
  };

  const decrementBet = () => {
    setBetAmount(prev => Math.max(prev - 10, 10));
  };

  return (
    <div style={{
      backgroundColor: "rgba(20, 21, 22, 0.9)",
      borderRadius: "12px",
      padding: "15px",
      margin: "10px",
      minWidth: "300px",
      border: "1px solid #333"
    }}>
      {/* Bet/Auto Toggle */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "15px" 
      }}>
        <div style={{
          position: "relative",
          width: "160px",
          height: "30px",
          backgroundColor: "#141516",
          borderRadius: "15px",
          border: "2px solid #333",
          overflow: "hidden"
        }}>
          {/* Sliding background */}
          <div
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: activeButton === "bet" ? "0" : "50%",
              width: "50%",
              backgroundColor: "#444",
              borderRadius: "12px",
              transition: "left 0.3s ease"
            }}
          />

          {/* Buttons */}
          <div style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            height: "100%"
          }}>
            <button
              onClick={() => setActiveButton("bet")}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                color: activeButton === "bet" ? "white" : "#9ea0a3",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Bet
            </button>
            <button
              onClick={() => setActiveButton("auto")}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                color: activeButton === "auto" ? "white" : "#9ea0a3",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Bet Amount Controls */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "15px"
      }}>
        <div>
          {/* Amount Input */}
          <div style={{
            backgroundColor: "black",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 15px",
            marginBottom: "8px",
            minWidth: "150px"
          }}>
            <button
              onClick={decrementBet}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              −
            </button>
            <span style={{ 
              color: "white", 
              fontWeight: "bold",
              fontSize: "16px"
            }}>
              ₹{betAmount.toFixed(2)}
            </span>
            <button
              onClick={incrementBet}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              +
            </button>
          </div>

          {/* Preset Amount Buttons */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px"
          }}>
            {presetAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                style={{
                  backgroundColor: "#141516",
                  color: "rgba(255,255,255,0.5)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#333";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#141516";
                  e.target.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Button */}
        <div>
          <Button 
            betAmount={betAmount.toFixed(2)} 
            onBet={handleBet}
            disabled={disabled || !isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default BettingPanel; 