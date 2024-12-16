// src/components/AlertModal.jsx

import React from "react";

function AlertModal({ message, onClose }) {
  // Define inline styles
  const styles = {
    alertOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%", // Cover the full width
      height: "100%", // Cover the full height
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000, // Ensure it's above other elements
      padding: "20px", // Added padding for smaller screens
      boxSizing: "border-box",
    },
    alertContent: {
      position: "relative", // To position the close 'X' button absolutely
      backgroundColor: "#fff",
      padding: "30px 40px",
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
      maxWidth: "600px",
      width: "100%",
      height: "80vh", // 80% of the viewport height
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      boxSizing: "border-box",
    },
    closeXButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      width: "30px",
      height: "30px",
      backgroundColor: "#ccc", // Grey background
      border: "none",
      borderRadius: "50%",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "background-color 0.3s, transform 0.3s",
    },
    closeXButtonHover: {
      backgroundColor: "#bbb", // Darker grey on hover
      transform: "scale(1.05)",
    },
    message: {
      flex: 1,
      fontSize: "1.2em",
      marginBottom: "20px",
    },
    closeAlertButton: {
      padding: "12px 24px",
      backgroundColor: "#007bff", // Blue color
      color: "#fff", // White text for better contrast
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.3s",
      alignSelf: "center",
      fontSize: "1em",
    },
    closeAlertButtonHover: {
      backgroundColor: "#0056b3", // Darker blue on hover
      transform: "scale(1.05)",
    },
  };

  // Handle hover states for buttons
  const [isHoveredCloseX, setIsHoveredCloseX] = React.useState(false);
  const [isHoveredClose, setIsHoveredClose] = React.useState(false);

  return (
    <div style={styles.alertOverlay}>
      <div style={styles.alertContent}>
        {/* "X" Close Button */}
        <button
          style={{
            ...styles.closeXButton,
            ...(isHoveredCloseX ? styles.closeXButtonHover : {}),
          }}
          onClick={onClose}
          onMouseEnter={() => setIsHoveredCloseX(true)}
          onMouseLeave={() => setIsHoveredCloseX(false)}
          aria-label="Close Alert"
        >
          &times;
        </button>

        {/* Alert Message */}
        <p style={styles.message}>{message}</p>

        {/* "Close" Button */}
        <button
          style={{
            ...styles.closeAlertButton,
            ...(isHoveredClose ? styles.closeAlertButtonHover : {}),
          }}
          onClick={onClose}
          onMouseEnter={() => setIsHoveredClose(true)}
          onMouseLeave={() => setIsHoveredClose(false)}
          aria-label="Close Alert"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
