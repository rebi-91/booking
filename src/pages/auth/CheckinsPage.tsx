// import { useEffect, useState } from "react";
// import supabase from "../../supabase";

// type Checkin = {
//   id: string;
//   patient_name: string;
//   option_selected: string;
//   created_at: string;
// };

// type QRRecord = {
//   id: string;
//   patient_name: string;
//   qr_value: string;
// };

// const OPTIONS = [
//   "All",
//   "See Pharmacist",
//   "Have Appointment",
//   "Pick Up Medication",
// ];

// export default function CheckinsPage() {
//   const today = new Date().toISOString().split("T")[0];

//   // Check-ins state
//   const [checkins, setCheckins] = useState<Checkin[]>([]);
//   const [selectedOption, setSelectedOption] = useState("All");
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [loading, setLoading] = useState(false);

//   // QR Creator state
//   const [patientName, setPatientName] = useState("");
//   const [qrRecords, setQRRecords] = useState<QRRecord[]>([]);
//   const [qrLoading, setQRLoading] = useState(false);

//   // Fetch initial data
//   useEffect(() => {
//     fetchCheckins();
//     fetchQRRecords();
//   }, [selectedOption, selectedDate]);

//   // Real-time subscription to checkins table
//   useEffect(() => {
//     const channel = supabase
//       .channel("checkins_realtime")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "checkins" },
//         (payload) => {
//           // Cast payload.new as Checkin
//           const newCheckin = payload.new as Checkin;
  
//           // Only add if the date matches selectedDate
//           const checkinDate = new Date(newCheckin.created_at)
//             .toISOString()
//             .split("T")[0];
  
//           if (checkinDate === selectedDate) {
//             setCheckins((prev) => [newCheckin, ...prev]);
//           }
//         }
//       )
//       .subscribe();
  
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedDate]);
  

//   const fetchCheckins = async () => {
//     setLoading(true);
//     let query = supabase
//       .from("checkins")
//       .select("*")
//       .gte("created_at", `${selectedDate}T00:00:00`)
//       .lte("created_at", `${selectedDate}T23:59:59`)
//       .order("created_at", { ascending: false });

//     if (selectedOption !== "All") {
//       query = query.eq("option_selected", selectedOption);
//     }

//     const { data, error } = await query;
//     if (!error && data) setCheckins(data);
//     setLoading(false);
//   };

//   const fetchQRRecords = async () => {
//     setQRLoading(true);
//     const { data } = await supabase
//       .from("qrcode")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (data) setQRRecords(data);
//     setQRLoading(false);
//   };

//   const handleCreateQR = async () => {
//     if (!patientName.trim()) return;

//     const qrValue = patientName.trim().replace(/ /g, "_");

//     const { error } = await supabase.from("qrcode").insert({
//       patient_name: patientName.trim(),
//       qr_value: qrValue,
//     });

//     if (error) {
//       alert("Error creating QR code: " + error.message);
//       return;
//     }

//     fetchQRRecords();

//     const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//       qrValue
//     )}`;
//     window.open(qrUrl, "_blank");

//     setPatientName("");
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       {/* QR Creator */}
//       <div
//         style={{
//           backgroundColor: "#f5f5f5",
//           padding: 20,
//           borderRadius: 8,
//           marginBottom: 30,
//         }}
//       >
//         <h2 style={{ marginBottom: 10 }}>Create Patient QR Code</h2>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <input
//             type="text"
//             placeholder="Patient Name"
//             style={{ padding: 8, flex: 1, minWidth: 200, borderRadius: 4 }}
//             value={patientName}
//             onChange={(e) => setPatientName(e.target.value)}
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck={false}
//           />
//           <button
//             onClick={handleCreateQR}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#0070f3",
//               color: "#fff",
//               border: "none",
//               borderRadius: 4,
//               cursor: "pointer",
//             }}
//           >
//             Create QR
//           </button>
//         </div>
//         <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
//           QR code will open in a new tab and be saved in the database.
//         </p>

//         {/* Existing QR Records */}
//         <div style={{ marginTop: 20 }}>
//           <h3 style={{ marginBottom: 10 }}>Existing QR Codes</h3>
//           {qrLoading ? (
//             <p>Loading...</p>
//           ) : qrRecords.length === 0 ? (
//             <p>No QR codes yet.</p>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#e0e0e0" }}>
//                   <th style={th}>Patient Name</th>
//                   <th style={th}>QR Value</th>
//                   <th style={th}>QR Link</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {qrRecords.map((r) => (
//                   <tr key={r.id} style={{ backgroundColor: "#fff" }}>
//                     <td style={td}>{r.patient_name}</td>
//                     <td style={td}>{r.qr_value}</td>
//                     <td style={td}>
//                       <a
//                         href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//                           r.qr_value
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ color: "#0070f3" }}
//                       >
//                         View QR
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Check-ins */}
//       <h2>Patient Check-Ins</h2>
//       {/* Filters */}
//       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
//         <div>
//           <label>Date</label>
//           <br />
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Filter by reason</label>
//           <br />
//           <select
//             value={selectedOption}
//             onChange={(e) => setSelectedOption(e.target.value)}
//           >
//             {OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Check-ins Table */}
//       {loading ? (
//         <p>Loading…</p>
//       ) : checkins.length === 0 ? (
//         <p>No check-ins for this date.</p>
//       ) : (
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={th}>Patient</th>
//               <th style={th}>Reason</th>
//               <th style={th}>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {checkins.map((c) => (
//               <tr key={c.id}>
//                 <td style={td}>{c.patient_name}</td>
//                 <td style={td}>{c.option_selected}</td>
//                 <td style={td}>
//                   {new Date(c.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// const th: React.CSSProperties = {
//   borderBottom: "2px solid #ccc",
//   textAlign: "left",
//   padding: 10,
// };

// const td: React.CSSProperties = {
//   borderBottom: "1px solid #eee",
//   padding: 10,
// };
import { useEffect, useState, useRef } from "react";
import supabase from "../../supabase";

type Checkin = {
  id: string;
  patient_name: string;
  option_selected: string;
  created_at: string;
  dob_entered?: string;
  address_entered?: string;
  postcode_entered?: string;
  email_entered?: string;
};

type QRRecord = {
  id: string;
  patient_name: string;
  qr_value: string;
  email?: string;
  dob?: string;
  firstline?: string;
  postcode?: string;
};

type PatientInfo = {
  patient_name: string;
  dob?: string;
  address?: string;
  postcode?: string;
  email?: string;
};

// Define all available options with colors matching the barcode page
const OPTIONS = [
  { label: "All", value: "All", color: "#0070f3" },
  { label: "🧑‍⚕️ See Pharmacist", value: "See Pharmacist", color: "#0070f3" },
  { label: "📅 Have Appointment", value: "Have Appointment", color: "#00b894" },
  { label: "💊 Pick Up Medication", value: "Pick Up Medication", color: "#fdcb6e" },
  { label: "📦 Pick Up Blister Packs", value: "Pick Up Blister Packs", color: "#6c5ce7" },
  { label: "♻️ Return Unwanted Medication", value: "Return Unwanted Medication", color: "#d63031" },
  { label: "🚨 Emergency Supply", value: "Emergency Supply", color: "#e84393" },
];

export default function CheckinsPage() {
  const today = new Date().toISOString().split("T")[0];

  // Check-ins state
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);

  // QR Creator state
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [qrRecords, setQRRecords] = useState<QRRecord[]>([]);
  const [filteredQrRecords, setFilteredQrRecords] = useState<QRRecord[]>([]);
  const [qrSearchTerm, setQrSearchTerm] = useState("");
  const [qrLoading, setQRLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Patient info popup state
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });
  
  // Refs for handling hover/click away
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const [isHoveringInfo, setIsHoveringInfo] = useState(false);

  // Pharmacist toggle state
  const [pharmacistStatus, setPharmacistStatus] = useState<boolean | null>(null);
  const [isLoadingPharmacist, setIsLoadingPharmacist] = useState(true);

  // Filter QR records based on search term
  useEffect(() => {
    if (!qrSearchTerm.trim()) {
      setFilteredQrRecords(qrRecords);
    } else {
      const term = qrSearchTerm.toLowerCase();
      const filtered = qrRecords.filter(record => 
        record.patient_name.toLowerCase().includes(term) ||
        (record.email && record.email.toLowerCase().includes(term))
      );
      setFilteredQrRecords(filtered);
    }
  }, [qrSearchTerm, qrRecords]);

  // Handle click outside of info popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoPopupRef.current && !infoPopupRef.current.contains(event.target as Node)) {
        setShowPatientInfo(false);
      }
    };

    if (showPatientInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPatientInfo]);

  // Fetch initial data
  useEffect(() => {
    fetchCheckins();
    fetchQRRecords();
    fetchPharmacistStatus();
  }, [selectedFilters, selectedDate]);

  // Real-time subscription to checkins table
  useEffect(() => {
    const channel = supabase
      .channel("checkins_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "checkins" },
        (payload) => {
          const newCheckin = payload.new as Checkin;
          const checkinDate = new Date(newCheckin.created_at)
            .toISOString()
            .split("T")[0];

          if (checkinDate === selectedDate) {
            // Check if the new checkin matches current filters
            const matchesFilter = selectedFilters.includes("All") || 
                                selectedFilters.includes(newCheckin.option_selected);
            
            if (matchesFilter) {
              setCheckins((prev) => [newCheckin, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate, selectedFilters]);

  const fetchCheckins = async () => {
    setLoading(true);
    let query = supabase
      .from("checkins")
      .select("*")
      .gte("created_at", `${selectedDate}T00:00:00`)
      .lte("created_at", `${selectedDate}T23:59:59`)
      .order("created_at", { ascending: false });

    // Apply filters if not "All"
    if (!selectedFilters.includes("All") && selectedFilters.length > 0) {
      query = query.in("option_selected", selectedFilters);
    }

    const { data, error } = await query;
    if (!error && data) setCheckins(data);
    setLoading(false);
  };

  const fetchQRRecords = async () => {
    setQRLoading(true);
    const { data } = await supabase
      .from("qrcode")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setQRRecords(data);
      setFilteredQrRecords(data);
    }
    setQRLoading(false);
  };

  const fetchPharmacistStatus = async () => {
    try {
      setIsLoadingPharmacist(true);
      const { data, error } = await supabase
        .from("pharmacist")
        .select("pharmacist_work")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching pharmacist status:", error);
        setPharmacistStatus(null);
      } else {
        setPharmacistStatus(data?.pharmacist_work || false);
      }
    } catch (error) {
      console.error("Error fetching pharmacist status:", error);
      setPharmacistStatus(null);
    } finally {
      setIsLoadingPharmacist(false);
    }
  };

  const togglePharmacistStatus = async () => {
    try {
      const newStatus = !pharmacistStatus;
      
      const { error } = await supabase
        .from("pharmacist")
        .update({ pharmacist_work: newStatus })
        .eq("id", 1); // Assuming there's a row with id=1

      if (error) {
        console.error("Error updating pharmacist status:", error);
        return;
      }

      setPharmacistStatus(newStatus);
    } catch (error) {
      console.error("Error toggling pharmacist status:", error);
    }
  };

  const handleFilterClick = (value: string) => {
    setSelectedFilters(prev => {
      if (value === "All") {
        // If clicking "All", select only "All"
        return ["All"];
      }
      
      // Remove "All" if it exists when selecting other filters
      const newFilters = prev.filter(f => f !== "All");
      
      if (newFilters.includes(value)) {
        // Remove filter if already selected
        const updated = newFilters.filter(f => f !== value);
        // If no filters left, show "All"
        return updated.length === 0 ? ["All"] : updated;
      } else {
        // Add new filter
        return [...newFilters, value];
      }
    });
  };

  const handleCreateQR = async () => {
    if (!patientName.trim()) {
      alert("Please enter a patient name");
      return;
    }

    const qrValue = patientName.trim().replace(/ /g, "_");

    try {
      // Insert into qrcode table
      const { error: dbError } = await supabase.from("qrcode").insert({
        patient_name: patientName.trim(),
        qr_value: qrValue,
        email: patientEmail.trim() || null,
      });

      if (dbError) {
        alert("Error creating QR code: " + dbError.message);
        return;
      }

      // Fetch updated records
      fetchQRRecords();

      // Generate QR image URL
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;

      // Send email if email is provided
      if (patientEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(patientEmail.trim())) {
          alert("Please enter a valid email address");
          return;
        }

        setIsSendingEmail(true);
        
        try {
          const { error: emailError } = await supabase.functions.invoke("send-qr-email", {
            body: { 
              to: patientEmail.trim(), 
              patientName: patientName.trim(), 
              qrValue, 
              qrImage 
            },
          });

          if (emailError) throw emailError;

          alert(`QR code created and sent to ${patientEmail.trim()}!`);
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
          alert("QR code created but failed to send email. You can still view the QR below.");
        } finally {
          setIsSendingEmail(false);
        }
      } else {
        // Open QR in new tab if no email
        window.open(qrImage, "_blank");
        alert("QR code created successfully!");
      }

      // Clear form
      setPatientName("");
      setPatientEmail("");

    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleInfoClick = (event: React.MouseEvent, patientName: string) => {
    const checkin = checkins.find(c => c.patient_name === patientName);
    if (checkin) {
      setPatientInfo({
        patient_name: checkin.patient_name,
        dob: checkin.dob_entered,
        address: checkin.address_entered,
        postcode: checkin.postcode_entered,
        email: checkin.email_entered,
      });
      setInfoPosition({ x: event.clientX, y: event.clientY });
      setShowPatientInfo(true);
    }
  };

  const handleInfoHover = (event: React.MouseEvent, patientName: string) => {
    const checkin = checkins.find(c => c.patient_name === patientName);
    if (checkin) {
      setPatientInfo({
        patient_name: checkin.patient_name,
        dob: checkin.dob_entered,
        address: checkin.address_entered,
        postcode: checkin.postcode_entered,
        email: checkin.email_entered,
      });
      setInfoPosition({ x: event.clientX, y: event.clientY });
      setShowPatientInfo(true);
    }
  };

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      paddingTop: "30px",
    }}>
    <div style={{
      maxWidth: 1400,
      margin: "50px auto",
      padding: "0 20px",
      fontFamily: "sans-serif",
      backgroundColor: "#000", // Dark background
      minHeight: "100vh",
      paddingTop: "30px",
    }}>
      {/* Header with Pharmacist Toggle */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
        padding: "0 20px",
      }}>
        <h1 style={{ 
          textAlign: "center", 
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #0070f3, #00b894)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Coleshill Pharmacy - Check-in System
        </h1>
        
        {/* Pharmacist Toggle Button */}
        <button
          onClick={togglePharmacistStatus}
          disabled={isLoadingPharmacist}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: pharmacistStatus === true ? "#00b894" : 
                          pharmacistStatus === false ? "#d63031" : "#6c757d",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            transition: "all 0.3s ease",
            boxShadow: pharmacistStatus === true ? 
              "0 4px 15px rgba(0, 184, 148, 0.4)" : 
              pharmacistStatus === false ? 
              "0 4px 15px rgba(214, 48, 49, 0.4)" : 
              "0 4px 15px rgba(108, 117, 125, 0.4)",
            minWidth: "180px",
          }}
        >
          {isLoadingPharmacist ? "Loading..." : 
           pharmacistStatus === true ? "Pharmacist: ON ✓" : 
           pharmacistStatus === false ? "Pharmacist: OFF ✗" : 
           "Status: Unknown"}
        </button>
      </div>

      {/* Side-by-side container for QR Creator and Existing QR Codes */}
      <div style={{
        display: "flex",
        gap: 30,
        marginBottom: 30,
        flexWrap: "wrap",
      }}>
        {/* QR Creator Card */}
        <div style={{
          backgroundColor: "#000",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 20px 1px #041E42",
          flex: 1,
          minWidth: 300,
          transition: 'all 0.3s ease',
          border: "1px solid #333",
        }}>
          <h2 style={{ 
            marginBottom: 20, 
            color: "#e0e0e0",
            fontSize: '1.5rem',
            textAlign: "center"
          }}>
            Create Patient QR Code
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Patient Name"
              style={{
                padding: 15,
                borderRadius: 5,
                border: "1px solid #555",
                width: "100%",
                backgroundColor: "#222",
                fontSize: 16,
                color: "#fff",
                fontWeight: 500,
                boxSizing: "border-box",
                transition: 'all 0.3s ease',
              }}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            
            <input
              type="email"
              placeholder="Patient Email (optional - for sending QR code)"
              style={{
                padding: 15,
                borderRadius: 5,
                border: "1px solid #555",
                width: "100%",
                backgroundColor: "#222",
                fontSize: 16,
                color: "#fff",
                fontWeight: 500,
                boxSizing: "border-box",
                transition: 'all 0.3s ease',
              }}
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            
            <button
              onClick={handleCreateQR}
              disabled={isSendingEmail}
              style={{
                padding: "15px 30px",
                backgroundColor: isSendingEmail ? "#555" : "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 16,
                transition: 'all 0.3s ease',
              }}
            >
              {isSendingEmail ? "Creating and Sending..." : "Create QR Code"}
            </button>
          </div>
          
          <p style={{ fontSize: 14, color: "#b0b0b0", marginTop: 10, textAlign: "center" }}>
            {patientEmail.trim() 
              ? "QR code will be created and sent to the email address provided." 
              : "QR code will open in a new tab if no email is provided."}
          </p>
        </div>

        {/* Existing QR Codes Card */}
        <div style={{
          backgroundColor: "#000",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 20px 1px #002366",
          flex: 1,
          minWidth: 300,
          transition: 'all 0.3s ease',
          border: "1px solid #333",
        }}>
          <h3 style={{ 
            marginBottom: 20, 
            color: "#e0e0e0", 
            fontSize: '1.5rem',
            textAlign: "center"
          }}>
            Existing QR Codes
          </h3>
          
          {/* Search Input */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search by patient name or email..."
              style={{
                padding: "12px 20px",
                borderRadius: 5,
                border: "1px solid #555",
                width: "100%",
                backgroundColor: "#222",
                fontSize: 16,
                color: "#fff",
                boxSizing: "border-box",
                transition: 'all 0.3s ease',
              }}
              value={qrSearchTerm}
              onChange={(e) => setQrSearchTerm(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          
          {/* QR Records Table */}
          <div style={{ 
            height: 250, 
            overflowY: "auto",
            borderRadius: 5,
            border: "1px solid #555",
            backgroundColor: "#1a1a1a",
          }}>
            {qrLoading ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: 100,
                color: "#b0b0b0"
              }}>
                <p>Loading QR codes...</p>
              </div>
            ) : filteredQrRecords.length === 0 ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: 100,
                color: "#b0b0b0"
              }}>
                <p>No QR codes found.</p>
              </div>
            ) : (
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse",
                tableLayout: "fixed"
              }}>
                <thead style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#2a2a2a"
                }}>
                  <tr>
                    <th style={{ ...th, width: "30%", backgroundColor: "#002366", color: "white" }}>Patient Name</th>
                    <th style={{ ...th, width: "25%", backgroundColor: "#002366", color: "white" }}>Email</th>
                    <th style={{ ...th, width: "25%", backgroundColor: "#002366", color: "white" }}>QR Value</th>
                    <th style={{ ...th, width: "20%", backgroundColor: "#002366", color: "white" }}>QR Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQrRecords.map((r, index) => (
                    <tr 
                      key={r.id} 
                      style={{ 
                        backgroundColor: index % 2 === 0 ? "#1a1a1a" : "#2a2a2a",
                        borderBottom: "1px solid #555"
                      }}
                    >
                      <td style={{ ...td, width: "30%", color: "#e0e0e0" }}>{r.patient_name}</td>
                      <td style={{ ...td, width: "25%", color: "#e0e0e0" }}>{r.email || "N/A"}</td>
                      <td style={{ ...td, width: "25%", color: "#e0e0e0" }}>{r.qr_value}</td>
                      <td style={{ ...td, width: "20%" }}>
                        <a
                          href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(r.qr_value)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            color: "#0070f3",
                            textDecoration: "none",
                            fontWeight: 500
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                          View QR
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Check-ins Card */}
      <div style={{
        backgroundColor: "#000",
        padding: 30,
        borderRadius: 10,
        boxShadow: "0 4px 20px 1px #002366",
        marginBottom: 30,
        transition: 'all 0.3s ease',
        border: "1px solid #333",
      }}>
        <h2 style={{ 
          marginBottom: 20, 
          color: "#e0e0e0", 
          fontSize: '1.5rem',
          textAlign: "center"
        }}>
          Patient Check-Ins
        </h2>
        
        {/* Date Picker */}
        <div style={{ marginBottom: 25 }}>
          <label style={{ display: "block", marginBottom: 10,   fontWeight: 600, color: "#fff" }}>
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "12px 20px",
              borderRadius: 5,
              border: "1px solid #555",
              fontSize: 16,
              minWidth: 200,
              backgroundColor: "#222",
              color: "#fff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ display: "block", marginBottom: 15, fontWeight: 600, color: "#fff" }}>
            Filter by reason
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFilterClick(opt.value)}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: selectedFilters.includes(opt.value) ? opt.color : `${opt.color}33`,
                  color: selectedFilters.includes(opt.value) ? "#fff" : opt.color,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  boxShadow: selectedFilters.includes(opt.value) ? `0 4px 12px ${opt.color}66` : "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#b0b0b0", marginTop: 10 }}>
            {selectedFilters.length === 0 || selectedFilters.includes("All") 
              ? "Showing all check-ins" 
              : `Showing: ${selectedFilters.map(f => OPTIONS.find(o => o.value === f)?.label).join(", ")}`}
          </p>
        </div>

        {/* Check-ins Table */}
        <div style={{ 
          overflowX: "auto",
          borderRadius: 5,
          border: "1px solid #555",
          backgroundColor: "#1a1a1a",
        }}>
          {loading ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: 100,
              color: "#b0b0b0"
            }}>
              <p>Loading check-ins...</p>
            </div>
          ) : checkins.length === 0 ? (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: 100,
              color: "#b0b0b0"
            }}>
              <p>No check-ins for this date{selectedFilters.length > 0 && !selectedFilters.includes("All") ? " with selected filters" : ""}.</p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#2a2a2a" }}>
                  <th style={{ ...th, width: "35%", backgroundColor: "#002366", color: "white" }}>Patient</th>
                  <th style={{ ...th, width: "35%", backgroundColor: "#002366", color: "white" }}>Reason</th>
                  <th style={{ ...th, width: "20%", backgroundColor: "#002366", color: "white" }}>Time</th>
                  <th style={{ ...th, width: "10%", backgroundColor: "#002366", textAlign: "center", color: "white" }}>Info</th>
                </tr>
              </thead>
              <tbody>
                {checkins.map((c, index) => {
                  const option = OPTIONS.find(o => o.value === c.option_selected);
                  return (
                    <tr 
                      key={c.id} 
                      style={{ 
                        backgroundColor: index % 2 === 0 ? "#1a1a1a" : "#2a2a2a",
                        borderBottom: "1px solid #555"
                      }}
                    >
                      <td style={{...td, color: "#e0e0e0"}}>{c.patient_name}</td>
                      <td style={{...td, color: "#e0e0e0"}}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 16px",
                          borderRadius: 8,
                          backgroundColor: `${option?.color || "#0070f3"}22`,
                          color: option?.color || "#0070f3",
                          fontWeight: 500,
                          fontSize: 14,
                        }}>
                          {OPTIONS.find(o => o.value === c.option_selected)?.label || c.option_selected}
                        </span>
                      </td>
                      <td style={{...td, color: "#e0e0e0"}}>
                        {new Date(c.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <button
                          onClick={(e) => handleInfoClick(e, c.patient_name)}
                          onMouseEnter={(e) => handleInfoHover(e, c.patient_name)}
                          onMouseLeave={() => {
                            if (!isHoveringInfo) {
                              setTimeout(() => setShowPatientInfo(false), 300);
                            }
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            borderRadius: "50%",
                            transition: "all 0.2s ease",
                            backgroundColor: "transparent",
                            color: "#fff",
                          }}
                          title="View patient information"
                        >
                          ℹ️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Patient Information Popup */}
      {showPatientInfo && patientInfo && (
        <div
          ref={infoPopupRef}
          onMouseEnter={() => setIsHoveringInfo(true)}
          onMouseLeave={() => {
            setIsHoveringInfo(false);
            setTimeout(() => setShowPatientInfo(false), 300);
          }}
          style={{
            position: "fixed",
            left: Math.min(infoPosition.x, window.innerWidth - 350),
            top: Math.min(infoPosition.y, window.innerHeight - 250),
            backgroundColor: "#000",
            borderRadius: 10,
            boxShadow: "0 4px 20px 1px #041E42",
            padding: 25,
            zIndex: 1000,
            minWidth: 300,
            maxWidth: 350,
            border: "1px solid #333",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: 18, 
              fontWeight: 700,
              color: "#0070f3",
              textAlign: "center"
            }}>
              {patientInfo.patient_name}
            </h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {patientInfo.dob && (
              <div>
                <div style={{ fontSize: 12, color: "#b0b0b0", fontWeight: 600, marginBottom: 4 }}>
                  Date of Birth
                </div>
                <div style={{ fontSize: 14, color: "#e0e0e0" }}>
                  {patientInfo.dob}
                </div>
              </div>
            )}
            
            {patientInfo.address && (
              <div>
                <div style={{ fontSize: 12, color: "#b0b0b0", fontWeight: 600, marginBottom: 4 }}>
                  Address
                </div>
                <div style={{ fontSize: 14, color: "#e0e0e0" }}>
                  {patientInfo.address}
                </div>
              </div>
            )}
            
            {patientInfo.postcode && (
              <div>
                <div style={{ fontSize: 12, color: "#b0b0b0", fontWeight: 600, marginBottom: 4 }}>
                  Postcode
                </div>
                <div style={{ fontSize: 14, color: "#e0e0e0" }}>
                  {patientInfo.postcode}
                </div>
              </div>
            )}
            
            {patientInfo.email && (
              <div>
                <div style={{ fontSize: 12, color: "#b0b0b0", fontWeight: 600, marginBottom: 4 }}>
                  Email
                </div>
                <div style={{ fontSize: 14, color: "#e0e0e0" }}>
                  {patientInfo.email}
                </div>
              </div>
            )}
            
            {!patientInfo.dob && !patientInfo.address && !patientInfo.postcode && !patientInfo.email && (
              <div style={{ fontSize: 14, color: "#b0b0b0", fontStyle: "italic", textAlign: "center" }}>
                No additional information available
              </div>
            )}
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            marginTop: 20,
            paddingTop: 15,
            borderTop: "1px solid #333"
          }}>
            <button
              onClick={() => setShowPatientInfo(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#333",
                border: "1px solid #555",
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                color: "#e0e0e0",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#555";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
                e.currentTarget.style.color = "#e0e0e0";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>
        {`
         body, html {
      margin: 0;
      padding: 0;
      background-color: #000 !important;
    }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Scrollbar styling */
          div::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: #333;
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: #777;
          }
          
          /* Smooth hover effects */
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 167, 0.4);
          }
          
          button:active:not(:disabled) {
            transform: translateY(1px);
          }
          
          /* Input focus effects */
          input:focus, select:focus, textarea:focus {
            border-color: #041E42 !important;
            box-shadow: 0 0 5px rgba(0, 123, 167, 0.5) !important;
            outline: none;
          }
        `}
      </style>
    </div>
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "2px solid #555",
  textAlign: "left",
  padding: 15,
  fontWeight: 600,
  fontSize: 14,
  position: "sticky",
  top: 0,
};

const td: React.CSSProperties = {
  padding: 15,
  fontSize: 14,
  verticalAlign: "middle",
};
// import { useEffect, useState } from "react";
// import supabase from "../../supabase";

// type Checkin = {
//   id: string;
//   patient_name: string;
//   option_selected: string;
//   created_at: string;
// };

// type QRRecord = {
//   id: string;
//   patient_name: string;
//   qr_value: string;
// };

// // Define all available options with colors matching the barcode page
// const OPTIONS = [
//   { label: "All", value: "All", color: "#0070f3" },
//   { label: "🧑‍⚕️ See Pharmacist", value: "See Pharmacist", color: "#0070f3" },
//   { label: "📅 Have Appointment", value: "Have Appointment", color: "#00b894" },
//   { label: "💊 Pick Up Medication", value: "Pick Up Medication", color: "#fdcb6e" },
//   { label: "📦 Pick Up Blister Packs", value: "Pick Up Blister Packs", color: "#6c5ce7" },
//   { label: "♻️ Return Unwanted Medication", value: "Return Unwanted Medication", color: "#d63031" },
//   { label: "🚨 Emergency Supply", value: "Emergency Supply", color: "#e84393" },
// ];

// export default function CheckinsPage() {
//   const today = new Date().toISOString().split("T")[0];

//   // Check-ins state
//   const [checkins, setCheckins] = useState<Checkin[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"]);
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [loading, setLoading] = useState(false);

//   // QR Creator state
//   const [patientName, setPatientName] = useState("");
//   const [qrRecords, setQRRecords] = useState<QRRecord[]>([]);
//   const [qrLoading, setQRLoading] = useState(false);

//   // Fetch initial data
//   useEffect(() => {
//     fetchCheckins();
//     fetchQRRecords();
//   }, [selectedFilters, selectedDate]);

//   // Real-time subscription to checkins table
//   useEffect(() => {
//     const channel = supabase
//       .channel("checkins_realtime")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "checkins" },
//         (payload) => {
//           const newCheckin = payload.new as Checkin;
//           const checkinDate = new Date(newCheckin.created_at)
//             .toISOString()
//             .split("T")[0];

//           if (checkinDate === selectedDate) {
//             // Check if the new checkin matches current filters
//             const matchesFilter = selectedFilters.includes("All") || 
//                                 selectedFilters.includes(newCheckin.option_selected);
            
//             if (matchesFilter) {
//               setCheckins((prev) => [newCheckin, ...prev]);
//             }
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedDate, selectedFilters]);

//   const fetchCheckins = async () => {
//     setLoading(true);
//     let query = supabase
//       .from("checkins")
//       .select("*")
//       .gte("created_at", `${selectedDate}T00:00:00`)
//       .lte("created_at", `${selectedDate}T23:59:59`)
//       .order("created_at", { ascending: false });

//     // Apply filters if not "All"
//     if (!selectedFilters.includes("All") && selectedFilters.length > 0) {
//       query = query.in("option_selected", selectedFilters);
//     }

//     const { data, error } = await query;
//     if (!error && data) setCheckins(data);
//     setLoading(false);
//   };

//   const fetchQRRecords = async () => {
//     setQRLoading(true);
//     const { data } = await supabase
//       .from("qrcode")
//       .select("*")
//       .order("created_at", { ascending: false });
//     if (data) setQRRecords(data);
//     setQRLoading(false);
//   };

//   const handleFilterClick = (value: string) => {
//     setSelectedFilters(prev => {
//       if (value === "All") {
//         // If clicking "All", select only "All"
//         return ["All"];
//       }
      
//       // Remove "All" if it exists when selecting other filters
//       const newFilters = prev.filter(f => f !== "All");
      
//       if (newFilters.includes(value)) {
//         // Remove filter if already selected
//         const updated = newFilters.filter(f => f !== value);
//         // If no filters left, show "All"
//         return updated.length === 0 ? ["All"] : updated;
//       } else {
//         // Add new filter
//         return [...newFilters, value];
//       }
//     });
//   };

//   const handleCreateQR = async () => {
//     if (!patientName.trim()) return;

//     const qrValue = patientName.trim().replace(/ /g, "_");

//     const { error } = await supabase.from("qrcode").insert({
//       patient_name: patientName.trim(),
//       qr_value: qrValue,
//     });

//     if (error) {
//       alert("Error creating QR code: " + error.message);
//       return;
//     }

//     fetchQRRecords();

//     const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//       qrValue
//     )}`;
//     window.open(qrUrl, "_blank");

//     setPatientName("");
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       {/* QR Creator */}
//       <div
//         style={{
//           backgroundColor: "#f5f5f5",
//           padding: 20,
//           borderRadius: 8,
//           marginBottom: 30,
//         }}
//       >
//         <h2 style={{ marginBottom: 10 }}>Create Patient QR Code</h2>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <input
//             type="text"
//             placeholder="Patient Name"
//             style={{ padding: 8, flex: 1, minWidth: 200, borderRadius: 4 }}
//             value={patientName}
//             onChange={(e) => setPatientName(e.target.value)}
//             autoComplete="off"
//             autoCorrect="off"
//             spellCheck={false}
//           />
//           <button
//             onClick={handleCreateQR}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#0070f3",
//               color: "#fff",
//               border: "none",
//               borderRadius: 4,
//               cursor: "pointer",
//             }}
//           >
//             Create QR
//           </button>
//         </div>
//         <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
//           QR code will open in a new tab and be saved in the database.
//         </p>

//         {/* Existing QR Records */}
//         <div style={{ marginTop: 20 }}>
//           <h3 style={{ marginBottom: 10 }}>Existing QR Codes</h3>
//           {qrLoading ? (
//             <p>Loading...</p>
//           ) : qrRecords.length === 0 ? (
//             <p>No QR codes yet.</p>
//           ) : (
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#e0e0e0" }}>
//                   <th style={th}>Patient Name</th>
//                   <th style={th}>QR Value</th>
//                   <th style={th}>QR Link</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {qrRecords.map((r) => (
//                   <tr key={r.id} style={{ backgroundColor: "#fff" }}>
//                     <td style={td}>{r.patient_name}</td>
//                     <td style={td}>{r.qr_value}</td>
//                     <td style={td}>
//                       <a
//                         href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//                           r.qr_value
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ color: "#0070f3" }}
//                       >
//                         View QR
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Check-ins */}
//       <h2>Patient Check-Ins</h2>
      
//       {/* Date Picker */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Date</label>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           style={{
//             padding: "10px 15px",
//             borderRadius: 8,
//             border: "1px solid #ccc",
//             fontSize: 16,
//             minWidth: 200
//           }}
//         />
//       </div>

//       {/* Filter Buttons - Same style as barcode page */}
//       <div style={{ marginBottom: 30 }}>
//         <label style={{ display: "block", marginBottom: 15, fontWeight: 600 }}>Filter by reason</label>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
//           {OPTIONS.map((opt) => (
//             <button
//               key={opt.value}
//               onClick={() => handleFilterClick(opt.value)}
//               style={{
//                 padding: "12px 20px",
//                 borderRadius: 8,
//                 border: "none",
//                 backgroundColor: selectedFilters.includes(opt.value) ? opt.color : `${opt.color}33`,
//                 color: selectedFilters.includes(opt.value) ? "#fff" : opt.color,
//                 cursor: "pointer",
//                 fontSize: 16,
//                 fontWeight: 600,
//                 transition: "all 0.2s ease",
//                 boxShadow: selectedFilters.includes(opt.value) ? `0 4px 12px ${opt.color}66` : "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>
//         <p style={{ fontSize: 14, color: "#666", marginTop: 10 }}>
//           {selectedFilters.length === 0 || selectedFilters.includes("All") 
//             ? "Showing all check-ins" 
//             : `Showing: ${selectedFilters.map(f => OPTIONS.find(o => o.value === f)?.label).join(", ")}`}
//         </p>
//       </div>

//       {/* Check-ins Table */}
//       {loading ? (
//         <p>Loading…</p>
//       ) : checkins.length === 0 ? (
//         <p>No check-ins for this date{selectedFilters.length > 0 && !selectedFilters.includes("All") ? " with selected filters" : ""}.</p>
//       ) : (
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             borderRadius: 8,
//             overflow: "hidden",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#f8f9fa" }}>
//               <th style={{ ...th, borderTopLeftRadius: 8 }}>Patient</th>
//               <th style={th}>Reason</th>
//               <th style={{ ...th, borderTopRightRadius: 8 }}>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {checkins.map((c, index) => {
//               const option = OPTIONS.find(o => o.value === c.option_selected);
//               return (
//                 <tr 
//                   key={c.id} 
//                   style={{ 
//                     backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",
//                     borderBottom: index === checkins.length - 1 ? "none" : "1px solid #eee"
//                   }}
//                 >
//                   <td style={td}>{c.patient_name}</td>
//                   <td style={td}>
//                     <span style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 8,
//                       padding: "6px 12px",
//                       borderRadius: 6,
//                       backgroundColor: `${option?.color || "#0070f3"}22`,
//                       color: option?.color || "#0070f3",
//                       fontWeight: 500
//                     }}>
//                       {OPTIONS.find(o => o.value === c.option_selected)?.label || c.option_selected}
//                     </span>
//                   </td>
//                   <td style={td}>
//                     {new Date(c.created_at).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// const th: React.CSSProperties = {
//   borderBottom: "2px solid #dee2e6",
//   textAlign: "left",
//   padding: 15,
//   fontWeight: 600,
//   fontSize: 14,
//   color: "#495057",
// };

// const td: React.CSSProperties = {
//   padding: 15,
//   fontSize: 14,
//   color: "#212529",
// };
// import { useEffect, useState } from "react";
// import supabase from "../../supabase";

// type Checkin = {
//   id: string;
//   patient_name: string;
//   option_selected: string;
//   created_at: string;
// };

// const OPTIONS = [
//   "All",
//   "See Pharmacist",
//   "Have Appointment",
//   "Pick Up Medication",
// ];

// export default function CheckinsPage() {
//   const today = new Date().toISOString().split("T")[0];

//   const [checkins, setCheckins] = useState<Checkin[]>([]);
//   const [selectedOption, setSelectedOption] = useState("All");
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCheckins();
//   }, [selectedOption, selectedDate]);

//   const fetchCheckins = async () => {
//     setLoading(true);

//     let query = supabase
//       .from("checkins")
//       .select("*")
//       .gte("created_at", `${selectedDate}T00:00:00`)
//       .lte("created_at", `${selectedDate}T23:59:59`)
//       .order("created_at", { ascending: false });

//     if (selectedOption !== "All") {
//       query = query.eq("option_selected", selectedOption);
//     }

//     const { data, error } = await query;

//     if (!error && data) {
//       setCheckins(data);
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Patient Check-Ins</h2>

//       {/* Filters */}
//       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
//         <div>
//           <label>Date</label>
//           <br />
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Filter by reason</label>
//           <br />
//           <select
//             value={selectedOption}
//             onChange={(e) => setSelectedOption(e.target.value)}
//           >
//             {OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading…</p>
//       ) : checkins.length === 0 ? (
//         <p>No check-ins for this date.</p>
//       ) : (
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={th}>Patient</th>
//               <th style={th}>Reason</th>
//               <th style={th}>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {checkins.map((c) => (
//               <tr key={c.id}>
//                 <td style={td}>{c.patient_name}</td>
//                 <td style={td}>{c.option_selected}</td>
//                 <td style={td}>
//                   {new Date(c.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// const th: React.CSSProperties = {
//   borderBottom: "2px solid #ccc",
//   textAlign: "left",
//   padding: 10,
// };

// const td: React.CSSProperties = {
//   borderBottom: "1px solid #eee",
//   padding: 10,
// };
