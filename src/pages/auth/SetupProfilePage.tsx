// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// function SetupProfilePage() {
//   const navigate = useNavigate();
//   const { session } = useSession();
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [role, setRole] = useState<"Patient" | "Staff">("Patient");

//   // Common fields
//   const [patientName, setPatientName] = useState<string>("");
//   const [dateBirth, setDateBirth] = useState<string>("");
//   const [telNumber, setTelNumber] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [address, setAddress] = useState<string>("");
//   const [postcode, setPostcode] = useState<string>("");

//   // Staff-specific
//   const [password, setPassword] = useState<string>("");
//   const [staffID, setStaffID] = useState<string>("");
//   const [passwordError, setPasswordError] = useState<string>("");

//   const handleNext = () => {
//     if (currentStep === 1) {
//       setCurrentStep(3);
//       return;
//     }

//     // Step 3: Gather details or verify staff password
//     if (currentStep === 3 && role === "Staff") {
//       if (password !== "ColeshillCounty") {
//         setPasswordError("Incorrect password");
//         return;
//       }
//       const id = Math.floor(10000 + Math.random() * 90000).toString();
//       setStaffID(id);
//     }
//     setPasswordError("");
//     setCurrentStep((s) => s + 1);
//   };

//   const handleConfirm = async () => {
//     if (!session || !session.user) {
//       alert("You must be logged in to complete setup.");
//       navigate("/auth/sign-in");
//       return;
//     }

//     const updateData: Record<string, any> = {
//       patientName,
//       dateBirth,
//       telNumber,
//       email,
//     };

//     if (role === "Patient") {
//       updateData.address = address;
//       updateData.postcode = postcode;
//     } else {
//       updateData.staffID = staffID;
//     }

//     const { error } = await supabase
//       .from("profiles")
//       .update(updateData)
//       .eq("id", session.user.id);

//     if (error) {
//       alert("Error updating profile: " + error.message);
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       {/* Step 1: Select Role */}
//       {currentStep === 1 && (
//         <div>
//           <label>Select Role:</label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value as any)}
//           >
//             <option value="Patient">Patient</option>
//             <option value="Staff">Staff</option>
//           </select>
//           <button onClick={handleNext}>Next →</button>
//         </div>
//       )}

//       {/* Step 3: Details */}
//       {currentStep === 3 && (
//         <div>
//           {role === "Staff" ? (
//             <>
//               <label>Enter Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               {passwordError && (
//                 <p style={{ color: "red" }}>{passwordError}</p>
//               )}
//               <button onClick={handleNext}>Verify & Next →</button>
//             </>
//           ) : (
//             <>
//               <label>Name:</label>
//               <input
//                 value={patientName}
//                 onChange={(e) => setPatientName(e.target.value)}
//               />

//               <label>Date of Birth:</label>
//               <input
//                 type="date"
//                 value={dateBirth}
//                 onChange={(e) => setDateBirth(e.target.value)}
//               />

//               <label>Phone:</label>
//               <input
//                 value={telNumber}
//                 onChange={(e) => setTelNumber(e.target.value)}
//               />

//               <label>Email:</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <button onClick={handleNext}>Next →</button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Step 4: Address (Patient only) */}
//       {currentStep === 4 && role === "Patient" && (
//         <div>
//           <label>Address:</label>
//           <input
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />

//           <label>Postcode:</label>
//           <input
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//           />

//           <button onClick={() => setCurrentStep(5)}>Next →</button>
//         </div>
//       )}

//       {/* Step 5: Confirmation */}
//       {currentStep === 5 && (
//         <div>
//           <h3>Confirm Your Details</h3>
//           <p>
//             <strong>Role:</strong> {role}
//           </p>
//           <p>
//             <strong>Name:</strong> {patientName}
//           </p>
//           <p>
//             <strong>Date of Birth:</strong> {dateBirth}
//           </p>
//           <p>
//             <strong>Phone:</strong> {telNumber}
//           </p>
//           <p>
//             <strong>Email:</strong> {email}
//           </p>
//           {role === "Patient" && (
//             <>
//               <p>
//                 <strong>Address:</strong> {address}
//               </p>
//               <p>
//                 <strong>Postcode:</strong> {postcode}
//               </p>
//             </>
//           )}
//           {role === "Staff" && (
//             <p>
//               <strong>Staff ID:</strong> {staffID}
//             </p>
//           )}

//           <button onClick={handleConfirm}>Confirm</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SetupProfilePage;
import React, { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

export default function SetupProfilePage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("Patient");

  // Common fields
  const [name, setName] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [telNumber, setTelNumber] = useState("");
  const [email, setEmail] = useState("");

  // Patient-specific
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  // Staff-specific
  const [staffID, setStaffID] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/auth/sign-in");
    }
  }, [session, navigate]);

  const handleNext = () => {
    if (currentStep === 2 && role === "Staff") {
      if (password !== "ColeshillCounty") {
        setPasswordError("Incorrect password");
        return;
      }
      setPasswordError("");
      setCurrentStep(3);
      return;
    }

    if (currentStep === 4 && role === "Staff") {
      const id = Math.floor(10000 + Math.random() * 90000).toString();
      setStaffID(id);
      setCurrentStep(5);
      return;
    }

    setCurrentStep((s) => s + 1);
  };

  const handleConfirm = async () => {
    if (!session?.user) return;

    const updateData: Record<string, any> = {
      name,
      dateBirth,
      telNumber,
      email,
      role: role === "Staff" ? "Staff" : "Patient",
    };

    if (role === "Patient") {
      updateData.address = address;
      updateData.postcode = postcode;
    } else {
      updateData.staffID = staffID;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", session.user.id);

    if (error) {
      alert("Error updating profile: " + error.message);
    } else {
      navigate(role === "Patient" ? "/dashboard" : "/staff/home");
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Setup Your Profile</h2>

        {/* Step 1 */}
        {currentStep === 1 && (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="Patient">Patient</option>
              <option value="Staff">Staff</option>
            </select>
            <button onClick={handleNext} style={styles.button}>
              Next →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div style={styles.stepContainer}>
            {role === "Staff" && (
              <>
                <label style={styles.label}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                {passwordError && <p style={styles.error}>{passwordError}</p>}
              </>
            )}
            {role === "Patient" && (
              <>
                <label style={styles.label}>Name:</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
                <label style={styles.label}>DOB:</label>
                <input
                  type="date"
                  value={dateBirth}
                  onChange={(e) => setDateBirth(e.target.value)}
                  style={styles.input}
                />
                <label style={styles.label}>Phone:</label>
                <input
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                  style={styles.input}
                />
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </>
            )}
            <button onClick={handleNext} style={styles.button}>
              Next →
            </button>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && role === "Staff" && (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label}>DOB:</label>
            <input
              type="date"
              value={dateBirth}
              onChange={(e) => setDateBirth(e.target.value)}
              style={styles.input}
            />
            <label style={styles.label}>Phone:</label>
            <input
              value={telNumber}
              onChange={(e) => setTelNumber(e.target.value)}
                  style={styles.input}
                />
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button onClick={() => setCurrentStep(4)} style={styles.button}>
              Next →
            </button>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div style={styles.stepContainer}>
            {role === "Patient" && (
              <>
                <label style={styles.label}>Address:</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={styles.input}
                />
                <label style={styles.label}>Postcode:</label>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  style={styles.input}
                />
                <button onClick={handleNext} style={styles.button}>
                  Next →
                </button>
              </>
            )}
            {role === "Staff" && (
              <button onClick={handleNext} style={styles.button}>
                Next →
              </button>
            )}
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.subTitle}>Confirm Details</h3>
            <div style={styles.summary}>
              <p><strong>Role:</strong> {role}</p>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>DOB:</strong> {dateBirth}</p>
              <p><strong>Phone:</strong> {telNumber}</p>
              <p><strong>Email:</strong> {email}</p>
              {role === "Patient" ? (
                <>
                  <p><strong>Address:</strong> {address}</p>
                  <p><strong>Postcode:</strong> {postcode}</p>
                </>
              ) : (
                <p><strong>Staff ID:</strong> {staffID}</p>
              )}
            </div>
            <button onClick={handleConfirm} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
  },
  container: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 500,
    textAlign: "center",
  },
  title: { fontSize: 24, marginBottom: 20, color: "#333" },
  stepContainer: { marginBottom: 30 },
  label: { display: "block", marginBottom: 8, fontWeight: "bold" },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  select: {
    width: "80%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 5,
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  confirmButton: {
    padding: "12px 30px",
    border: "none",
    borderRadius: 5,
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
  error: { color: "red", marginBottom: 15 },
  subTitle: { fontSize: 20, marginBottom: 15 },
  summary: { textAlign: "left", margin: "0 auto 20px" },
};
