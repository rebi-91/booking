import React, { useEffect } from "react";

export default function App() {
    const handleClick = () => {
    const emails = ["a@example.com", "b@example.com", "c@example.com"];

    function sendEmail(address: string) {
      console.log("Sending email to:", address);
    }

    emails.forEach(sendEmail);
  }; // runs once when component loads

  return <div><h1>Check the browser console</h1>
  <button style={{ width: "100%" }} onClick={handleClick}>Press me</button></div>;
}
