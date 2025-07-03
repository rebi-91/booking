import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";
import "./SetupProfilePage.css";

// About 50 most-common country codes
const COUNTRY_CODES = [
  { label: "United States (+1)", value: "1" },
  { label: "Canada (+1)", value: "1" },
  { label: "United Kingdom (+44)", value: "44" },
  { label: "Australia (+61)", value: "61" },
  { label: "India (+91)", value: "91" },
  { label: "Germany (+49)", value: "49" },
  { label: "France (+33)", value: "33" },
  { label: "Italy (+39)", value: "39" },
  { label: "Spain (+34)", value: "34" },
  { label: "Netherlands (+31)", value: "31" },
  { label: "Sweden (+46)", value: "46" },
  { label: "Norway (+47)", value: "47" },
  { label: "Denmark (+45)", value: "45" },
  { label: "Finland (+358)", value: "358" },
  { label: "Belgium (+32)", value: "32" },
  { label: "Switzerland (+41)", value: "41" },
  { label: "Austria (+43)", value: "43" },
  { label: "New Zealand (+64)", value: "64" },
  { label: "South Africa (+27)", value: "27" },
  { label: "Nigeria (+234)", value: "234" },
  { label: "Egypt (+20)", value: "20" },
  { label: "Kenya (+254)", value: "254" },
  { label: "Brazil (+55)", value: "55" },
  { label: "Mexico (+52)", value: "52" },
  { label: "Argentina (+54)", value: "54" },
  { label: "Chile (+56)", value: "56" },
  { label: "Colombia (+57)", value: "57" },
  { label: "Peru (+51)", value: "51" },
  { label: "Venezuela (+58)", value: "58" },
  { label: "Russia (+7)", value: "7" },
  { label: "China (+86)", value: "86" },
  { label: "Japan (+81)", value: "81" },
  { label: "South Korea (+82)", value: "82" },
  { label: "Singapore (+65)", value: "65" },
  { label: "Malaysia (+60)", value: "60" },
  { label: "Indonesia (+62)", value: "62" },
  { label: "Thailand (+66)", value: "66" },
  { label: "Vietnam (+84)", value: "84" },
  { label: "Philippines (+63)", value: "63" },
  { label: "Saudi Arabia (+966)", value: "966" },
  { label: "United Arab Emirates (+971)", value: "971" },
  { label: "Qatar (+974)", value: "974" },
  { label: "Israel (+972)", value: "972" },
  { label: "Turkey (+90)", value: "90" },
  { label: "Poland (+48)", value: "48" },
  { label: "Greece (+30)", value: "30" },
  { label: "Ireland (+353)", value: "353" },
  { label: "Portugal (+351)", value: "351" },
  { label: "Czech Republic (+420)", value: "420" },
  { label: "Hungary (+36)", value: "36" },
  { label: "Romania (+40)", value: "40" },
];

export default function SetupProfilePage() {
  const navigate = useNavigate();
  const { session } = useSession();

  // redirect if not logged in
  useEffect(() => {
    if (!session) navigate("/auth/sign-in");
  }, [session, navigate]);

  // ── INTERNAL STATE ──
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<"Patient" | "Staff">("Patient");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // common fields
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [dobValue, setDobValue] = useState("");       // YYYY-MM-DD
  const [countryCode, setCountryCode] = useState("44"); // default +44
  const [phone, setPhone] = useState("");             // user may type leading zero
  const [email, setEmail] = useState("");

  // patient-only
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  // staff-only
  const [staffID, setStaffID] = useState("");

  // Total steps (excluding the final confirm screen):
  // Patients: 3 (role → personal+address → confirm)
  // Staff:    4 (role → password → personal → confirm+ID)
  const TOTAL_STEPS = role === "Patient" ? 3 : 4;

  // ── HANDLERS ──
  const handleNext = () => {
    // Staff password at step 2
    if (role === "Staff" && currentStep === 2) {
      if (password !== "ColeshillCounty") {
        setPasswordError("Incorrect password");
        return;
      }
      setPasswordError("");
    }
    // Staff ID generation just before confirm
    if (role === "Staff" && currentStep === TOTAL_STEPS - 1) {
      setStaffID(Math.floor(10000 + Math.random() * 90000).toString());
    }
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleConfirm = async () => {
    if (!session?.user) return;

    // strip leading zeros, build E.164 (no '+')
    const national = phone.replace(/^0+/, "");
    const e164 = countryCode + national;

    const payload: Record<string, any> = {
      title,
      name,
      dateBirth: dobValue,
      telNumber: e164,
      email,
      role,
    };
    if (role === "Patient") {
      payload.address = address;
      payload.postcode = postcode;
    } else {
      payload.staffID = staffID;
    }

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", session.user.id);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      navigate("/login");
    }
  };

  // disable Next if required fields empty
  const isNextDisabled = (() => {
    switch (currentStep) {
      case 1:
        return false;
      case 2:
        if (role === "Staff") {
          return password.trim() === "";
        }
        return (
          title === "" ||
          name.trim() === "" ||
          dobValue.trim() === "" ||
          phone.trim() === "" ||
          email.trim() === "" ||
          address.trim() === "" ||
          postcode.trim() === ""
        );
      case 3:
        if (role === "Staff") {
          return (
            name.trim() === "" ||
            dobValue.trim() === "" ||
            phone.trim() === "" ||
            email.trim() === ""
          );
        }
        return false; // patient step 3 = confirm
      case 4:
        return false;
      default:
        return false;
    }
  })();

  // ── RENDER ──
  return (
    <div className="sp-page">
      <div className="sp-card">
        <h2 className="sp-heading">Create Your Account</h2>
        <p className="sp-subheading">
          Step {currentStep} of {TOTAL_STEPS}
        </p>

        {currentStep < TOTAL_STEPS ? (
          <form
            className="sp-form"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleNext();
            }}
          >
            {currentStep > 1 && (
              <button
                type="button"
                className="sp-back"
                onClick={handleBack}
              >
                ‹ Back
              </button>
            )}

            {/* ── STEP 1: ROLE ── */}
            {currentStep === 1 && (
              <>
                <label className="sp-label" htmlFor="role">
                  I am a
                </label>
                <select
                  id="role"
                  className="sp-input"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "Patient" | "Staff")
                  }
                >
                  <option value="Patient">Patient</option>
                  <option value="Staff">Staff</option>
                </select>
              </>
            )}

            {/* ── STEP 2: PATIENT OR STAFF ── */}
            {/* Staff password */}
            {currentStep === 2 && role === "Staff" && (
              <>
                <label className="sp-label" htmlFor="staffPass">
                  Staff Password
                </label>
                <input
                  id="staffPass"
                  type="password"
                  className="sp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div className="sp-error">{passwordError}</div>
                )}
              </>
            )}

            {/* Patient personal + address */}
            {currentStep === 2 && role === "Patient" && (
              <>
                <label className="sp-label" htmlFor="title">
                  Title
                </label>
                <select
                  id="title"
                  className="sp-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Select title
                  </option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Miss</option>
                  <option>Master</option>
                  <option>Dr</option>
                  <option>Prof</option>
                </select>

                <label className="sp-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="sp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label className="sp-label" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  className="sp-input2 sp-input--date"
                  value={dobValue}
                  onChange={(e) => setDobValue(e.target.value)}
                />

                <label className="sp-label" htmlFor="countryCode">
                  Country Code
                </label>
                <select
                  id="countryCode"
                  className="sp-input"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <label className="sp-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="sp-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <label className="sp-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="sp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label className="sp-label" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className="sp-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <label className="sp-label" htmlFor="postcode">
                  Postcode
                </label>
                <input
                  id="postcode"
                  type="text"
                  className="sp-input"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </>
            )}

            {/* ── STEP 3: STAFF PERSONAL ── */}
            {currentStep === 3 && role === "Staff" && (
              <>
                <label className="sp-label" htmlFor="staffName">
                  Full Name
                </label>
                <input
                  id="staffName"
                  type="text"
                  className="sp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label className="sp-label" htmlFor="staffDob">
                  Date of Birth
                </label>
                <input
                  id="staffDob"
                  type="date"
                  className="sp-input sp-input--date"
                  value={dobValue}
                  onChange={(e) => setDobValue(e.target.value)}
                />

                <label className="sp-label" htmlFor="staffCountry">
                  Country Code
                </label>
                <select
                  id="staffCountry"
                  className="sp-input"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <label className="sp-label" htmlFor="staffPhone">
                  Phone Number
                </label>
                <input
                  id="staffPhone"
                  type="tel"
                  className="sp-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <label className="sp-label" htmlFor="staffEmail">
                  Email Address
                </label>
                <input
                  id="staffEmail"
                  type="email"
                  className="sp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}

            <button
              type="submit"
              className="sp-next"
              disabled={isNextDisabled}
            >
              Next →
            </button>
          </form>
        ) : (
          /* ── CONFIRM ── */
          <div className="sp-confirm">
            <h3 className="sp-subheading">Confirm Your Details</h3>
            <ul className="sp-summary">
              <li><strong>Role:</strong> {role}</li>
              <li><strong>Title:</strong> {title}</li>
              <li><strong>Name:</strong> {name}</li>
              <li><strong>DOB:</strong> {dobValue}</li>
              <li>
                <strong>Phone:</strong> +{countryCode}
                {phone.replace(/^0+/, "")}
              </li>
              <li><strong>Email:</strong> {email}</li>
              {role === "Patient" ? (
                <>
                  <li><strong>Address:</strong> {address}</li>
                  <li><strong>Postcode:</strong> {postcode}</li>
                </>
              ) : (
                <li><strong>Staff ID:</strong> {staffID}</li>
              )}
            </ul>
            <button
              className="sp-confirm-btn"
              onClick={handleConfirm}
            >
              Confirm &amp; Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// import React, { useState, useEffect, FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";
// import "./SetupProfilePage.css";

// export default function SetupProfilePage() {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   // redirect if not logged in
//   useEffect(() => {
//     if (!session) navigate("/auth/sign-in");
//   }, [session, navigate]);

//   // --- steps & role/auth ---
//   const finalStep = 5;
//   const [currentStep, setCurrentStep] = useState(1);
//   const [role, setRole] = useState<"Patient" | "Staff">("Patient");
//   const [password, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   // --- common fields ---
//   const [title, setTitle] = useState("");
//   const [name, setName] = useState("");
//   const [dobValue, setDobValue] = useState("");                         // e.g. "1970-01-01"
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");

//   // --- patient-only ---
//   const [address, setAddress] = useState("");
//   const [postcode, setPostcode] = useState("");

//   // --- staff-only ---
//   const [staffID, setStaffID] = useState("");

//   const handleNext = () => {
//     // staff step-2 password check
//     if (currentStep === 2 && role === "Staff") {
//       if (password !== "ColeshillCounty") {
//         setPasswordError("Incorrect password");
//         return;
//       }
//       setPasswordError("");
//     }

//     // staff step-4 generate ID
//     if (currentStep === 4 && role === "Staff") {
//       setStaffID(Math.floor(10000 + Math.random() * 90000).toString());
//     }

//     setCurrentStep((s) => Math.min(finalStep, s + 1));
//   };

//   const handleBack = () => {
//     setCurrentStep((s) => Math.max(1, s - 1));
//   };

//   const handleConfirm = async () => {
//     if (!session?.user) return;
//     const payload: Record<string, any> = {
//       title,
//       name,
//       dateBirth: dobValue,
//       phone,
//       email,
//       role,
//     };
//     if (role === "Patient") {
//       payload.address = address;
//       payload.postcode = postcode;
//     } else {
//       payload.staffID = staffID;
//     }

//     const { error } = await supabase
//       .from("profiles")
//       .update(payload)
//       .eq("id", session.user.id);

//     if (error) {
//       alert("Error saving profile: " + error.message);
//     } else {
//       navigate(role === "Staff" ? "/staff/home" : "/dashboard");
//     }
//   };

//   // --- validation: disable Next unless all required fields on this step are filled ---
//   const isNextDisabled = (() => {
//     switch (currentStep) {
//       case 1:
//         return false; // role always selected
//       case 2:
//         if (role === "Staff") {
//           return password.trim() === "";
//         } else {
//           return (
//             title === "" ||
//             name.trim() === "" ||
//             dobValue.trim() === "" ||
//             phone.trim() === "" ||
//             email.trim() === ""
//           );
//         }
//       case 3:
//         if (role === "Staff") {
//           return (
//             name.trim() === "" ||
//             dobValue.trim() === "" ||
//             phone.trim() === "" ||
//             email.trim() === ""
//           );
//         }
//         return false;
//       case 4:
//         if (role === "Patient") {
//           return address.trim() === "" || postcode.trim() === "";
//         }
//         return false;
//       default:
//         return false;
//     }
//   })();

//   return (
//     <div className="sp-page">
//       <div className="sp-card">
//         <h2 className="sp-heading">Create Your Account</h2>
//         <p className="sp-subheading">Step {currentStep} of {finalStep}</p>

//         {currentStep < finalStep ? (
//           <form
//             className="sp-form"
//             onSubmit={(e: FormEvent) => {
//               e.preventDefault();
//               handleNext();
//             }}
//           >
//             {/* ← Back button for steps 2–4 */}
//             {currentStep > 1 && (
//               <button type="button" className="sp-back" onClick={handleBack}>
//                 ‹ Back
//               </button>
//             )}

//             {/* --- Step 1: Choose role --- */}
//             {currentStep === 1 && (
//               <select
//                 className="sp-input"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value as "Patient" | "Staff")}
//               >
//                 <option value="Patient">Patient</option>
//                 <option value="Staff">Staff</option>
//               </select>
//             )}

//             {/* --- Step 2 --- */}
//             {currentStep === 2 && role === "Staff" && (
//               <>
//                 <input
//                   type="password"
//                   className="sp-input"
//                   placeholder="Enter Staff Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {passwordError && (
//                   <div className="sp-error">{passwordError}</div>
//                 )}
//               </>
//             )}
//             {currentStep === 2 && role === "Patient" && (
//               <>
//                 <select
//                   className="sp-input"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                 >
//                   <option value="" disabled hidden>
//                     Select title
//                   </option>
//                   <option>Mr</option>
//                   <option>Mrs</option>
//                   <option>Miss</option>
//                   <option>Master</option>
//                   <option>Dr</option>
//                   <option>Prof</option>
//                 </select>
//                 <input
//                   type="text"
//                   className="sp-input"
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <label htmlFor="dob" className="sp-label">
//   Date of Birth
// </label>
//                 <input
//   type="date"
//   className="sp-input sp-input--date"
//   placeholder="Date of Birth"
//   value={dobValue}
//   onChange={e => setDobValue(e.target.value)}
// />

//                 <input
//                   type="tel"
//                   className="sp-input"
//                   placeholder="Phone Number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//                 <input
//                   type="email"
//                   className="sp-input"
//                   placeholder="Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </>
//             )}

//             {/* --- Step 3 --- */}
//             {currentStep === 3 && role === "Staff" && (
//               <>
//                 <input
//                   type="text"
//                   className="sp-input"
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <label htmlFor="dob" className="sp-label">
//   Date of Birth
// </label>
//                 <input
//   type="date"
//   className="sp-input sp-input--date"
//   placeholder="Date of Birth"
//   value={dobValue}
//   onChange={e => setDobValue(e.target.value)}
// />
//                 <input
//                   type="tel"
//                   className="sp-input"
//                   placeholder="Phone Number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//                 <input
//                   type="email"
//                   className="sp-input"
//                   placeholder="Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </>
//             )}

//             {/* --- Step 4 --- */}
//             {currentStep === 4 && role === "Patient" && (
//               <>
//                 <input
//                   type="text"
//                   className="sp-input"
//                   placeholder="Address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   className="sp-input"
//                   placeholder="Postcode"
//                   value={postcode}
//                   onChange={(e) => setPostcode(e.target.value)}
//                 />
//               </>
//             )}
//             {currentStep === 4 && role === "Staff" && (
//               <p className="sp-note">Generating your Staff ID…</p>
//             )}

//             <button
//               type="submit"
//               className="sp-next"
//               disabled={isNextDisabled}
//             >
//               Next →
//             </button>
//           </form>
//         ) : (
//           /* --- FINAL Step: confirmation --- */
//           <div className="sp-confirm">
//             <h3 className="sp-subheading">Confirm Your Details</h3>
//             <ul className="sp-summary">
//               <li><strong>Role:</strong> {role}</li>
//               <li><strong>Title:</strong> {title}</li>
//               <li><strong>Name:</strong> {name}</li>
//               <li><strong>DOB:</strong> {dobValue}</li>
//               <li><strong>Phone:</strong> {phone}</li>
//               <li><strong>Email:</strong> {email}</li>
//               {role === "Patient" ? (
//                 <>
//                   <li><strong>Address:</strong> {address}</li>
//                   <li><strong>Postcode:</strong> {postcode}</li>
//                 </>
//               ) : (
//                 <li><strong>Staff ID:</strong> {staffID}</li>
//               )}
//             </ul>
//             <button
//               className="sp-confirm-btn"
//               onClick={handleConfirm}
//             >
//               Confirm &amp; Finish
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
