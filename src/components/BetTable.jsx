import React from "react";

const BetTable = ({ betData = {} }) => {
  return (
    <div style={{ 
      backgroundColor: "rgba(0,0,0,0.8)", 
      borderRadius: "10px", 
      padding: "10px",
      minHeight: "200px",
      maxHeight: "300px",
      overflowY: "auto"
    }}>
      <h3 style={{ 
        color: "white", 
        textAlign: "center", 
        marginBottom: "10px",
        fontSize: "16px"
      }}>
        Active Bets
      </h3>
      <table
        style={{
          width: "100%",
          border: "1px solid #333",
          borderCollapse: "collapse",
          color: "white",
          fontSize: "14px"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#333" }}>
            <th style={{ 
              border: "1px solid #555", 
              padding: "8px",
              textAlign: "left"
            }}>
              Player
            </th>
            <th style={{ 
              border: "1px solid #555", 
              padding: "8px",
              textAlign: "right"
            }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(betData).length > 0 ? (
            Object.entries(betData).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: "1px solid #444" }}>
                <td style={{ 
                  border: "1px solid #555", 
                  padding: "6px",
                  color: "#ccc"
                }}>
                  {key}
                </td>
                <td style={{ 
                  border: "1px solid #555", 
                  padding: "6px",
                  textAlign: "right",
                  color: "#00ff88"
                }}>
                  ₹{value?.initialBet || "0.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan="2" 
                style={{ 
                  padding: "20px", 
                  textAlign: "center", 
                  color: "#666",
                  fontStyle: "italic"
                }}
              >
                No active bets
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BetTable; 