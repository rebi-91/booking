// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";

// import "./StaffPage.css";

// ChartJS.register(ArcElement, Tooltip, Legend);

// // ----------------------------------------------------------------
// // Campus location (20 m radius):
// const MANUAL_LATITUDE = 52.498084;
// const MANUAL_LONGITUDE = -1.706501;
// // ----------------------------------------------------------------

// function StaffPage() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [staffID, setStaffID] = useState("");
//   const [staffName, setStaffName] = useState("");
//   const [inTimes, setInTimes] = useState<(string | null)[]>([]);
//   const [outTimes, setOutTimes] = useState<(string | null)[]>([]);
//   const [startBreak, setStartBreak] = useState<(string | null)[]>([]);
//   const [endBreak, setEndBreak] = useState<(string | null)[]>([]);
//   const [totalHours, setTotalHours] = useState<number>(0);
//   const [showUpdateMsg, setShowUpdateMsg] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const today = new Date();
//   const D = today.getDate();
//   const Y = today.getFullYear();
//   const M = today.getMonth();
//   const daysInMonth = new Date(Y, M + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }
//     (async () => {
//       setLoading(true);
//       try {
//         const { data: u, error: ue } = await supabase.auth.getUser();
//         if (ue || !u?.user) throw new Error("Not authenticated");

//         const { data: p, error: pe } = await supabase
//           .from("profiles")
//           .select("role, staffID")
//           .eq("id", u.user.id)
//           .single();
//         if (pe || !p || p.role !== "Staff") throw new Error("Unauthorized");
//         setStaffID(p.staffID);

//         const { data: row, error: re } = await supabase
//           .from("attendance")
//           .select("*")
//           .eq("staffID", p.staffID)
//           .single();
//         if (re || !row) throw new Error("No attendance record");

//         setStaffName(row.staffName);

//         const inA: (string | null)[] = [];
//         const outA: (string | null)[] = [];
//         const sb: (string | null)[] = [];
//         const eb: (string | null)[] = [];
//         for (let d = 1; d <= daysInMonth; d++) {
//           inA.push(row[`in${d}`] || null);
//           outA.push(row[`out${d}`] || null);
//           sb.push(row[`startBreak${d}`] || null);
//           eb.push(row[`endBreak${d}`] || null);
//         }
//         setInTimes(inA);
//         setOutTimes(outA);
//         setStartBreak(sb);
//         setEndBreak(eb);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session, navigate, daysInMonth]);

//   const within20 = useCallback(() => {
//     // TODO: replace with real geolocation distance check
//     return true;
//   }, []);

//   const updateDay = async (field: string, value: string) => {
//     await supabase
//       .from("attendance")
//       .update({ [field]: value })
//       .eq("staffID", staffID);
//   };

//   const updateLocal = (
//     arr: (string | null)[],
//     setter: React.Dispatch<React.SetStateAction<(string | null)[]>>,
//     day: number,
//     val: string
//   ) => {
//     const copy = [...arr];
//     copy[day - 1] = val;
//     setter(copy);
//   };

//   const handleAction = async (
//     type: "in" | "out" | "startBreak" | "endBreak"
//   ) => {
//     if (!within20()) {
//       alert("You must be within 20 m of campus.");
//       return;
//     }
//     // enforce one‐time press
//     if (
//       (type === "in" && inTimes[D - 1]) ||
//       (type === "out" && outTimes[D - 1]) ||
//       (type === "startBreak" && startBreak[D - 1]) ||
//       (type === "endBreak" && endBreak[D - 1])
//     ) {
//       const what =
//         type === "in"
//           ? "login"
//           : type === "out"
//           ? "logout"
//           : type === "startBreak"
//           ? "break start"
//           : "break end";
//       alert(`You've already recorded ${what} today.`);
//       return;
//     }
//     // require prior step
//     if ((type === "out" && !inTimes[D - 1]) ||
//         (type === "endBreak" && !startBreak[D - 1])) {
//       alert(
//         type === "out"
//           ? "You must log in first."
//           : "You must start break first."
//       );
//       return;
//     }
//     // confirmation
//     const confirmText = {
//       in: "Log in now?",
//       out: "Log out now?",
//       startBreak: "Start break now?",
//       endBreak: "End break now?"
//     } as const;
//     if (!window.confirm(confirmText[type])) return;

//     const now = new Date().toLocaleTimeString("en-GB", {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//     await updateDay(`${type}${D}`, now);
//     if (type === "in") updateLocal(inTimes, setInTimes, D, now);
//     if (type === "out") updateLocal(outTimes, setOutTimes, D, now);
//     if (type === "startBreak") updateLocal(startBreak, setStartBreak, D, now);
//     if (type === "endBreak") updateLocal(endBreak, setEndBreak, D, now);

//     setShowUpdateMsg(true);
//     setTimeout(() => setShowUpdateMsg(false), 3000);
//   };

//   useEffect(() => {
//     let total = 0;
//     inTimes.forEach((inT, idx) => {
//       const outT = outTimes[idx];
//       if (inT && outT) {
//         const [ih, im] = inT.split(":").map(Number);
//         const [oh, om] = outT.split(":").map(Number);
//         const sb = startBreak[idx] || "00:00";
//         const eb = endBreak[idx] || "00:00";
//         const [sh, sm] = sb.split(":").map(Number);
//         const [eh, em] = eb.split(":").map(Number);
//         const minsWorked =
//           oh * 60 +
//           om -
//           (ih * 60 + im) -
//           ((eh * 60 + em) - (sh * 60 + sm));
//         total += Math.max(minsWorked, 0) / 60;
//       }
//     });
//     setTotalHours(Math.round(total * 100) / 100);
//   }, [inTimes, outTimes, startBreak, endBreak]);

//   if (loading)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Spinner /> <span className="ms-2">Loading…</span>
//       </Container>
//     );
//   if (error)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   const presentCount = inTimes.filter(Boolean).length;
//   const absentCount = daysInMonth - presentCount;
//   const pieData = {
//     labels: ["Present", "Absent"],
//     datasets: [
//       {
//         data: [presentCount, absentCount],
//         backgroundColor: ["#007bff", "#ff4d4d"]
//       }
//     ]
//   };

//   const hrs = Math.floor(totalHours);
//   const mins = Math.round((totalHours - hrs) * 60);

//   return (
//     <Container fluid className="staffpage-container py-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark p-4 rounded shadow">
//             {/* Header */}
//             <div className="header-container d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <h2 className="text-primary2 mb-1">{staffName}</h2>
//                 <div className="current-month-year">
//                   <strong>ID:</strong> {staffID} | {today.toLocaleDateString()}
//                 </div>
//               </div>
//               <Button
//                 variant="link"
//                 className="home-button"
//                 onClick={() => navigate("/login")}
//               >
//                 🏠
//               </Button>
//             </div>

//             {/* Action Buttons */}
//             <Row className="mb-3">
//               <Col>
//                 <Button
//                   variant="primary"
//                   className="w-100 d-flex flex-column align-items-center"
//                   onClick={() => handleAction("in")}
//                 >
//                   <span>Login</span>
//                   <span className="time-text">{inTimes[D - 1] || "--:--"}</span>
//                 </Button>
//               </Col>
//               <Col>
//                 <Button
//                   variant="primary"
//                   className="w-100 d-flex flex-column align-items-center"
//                   onClick={() => handleAction("out")}
//                 >
//                   <span>Logout</span>
//                   <span className="time-text">{outTimes[D - 1] || "--:--"}</span>
//                 </Button>
//               </Col>
//             </Row>
//             <Row className="mb-4">
//               <Col>
//                 <Button
//                   variant="secondary"
//                   className="w-100 d-flex flex-column align-items-center"
//                   onClick={() => handleAction("startBreak")}
//                   disabled={!!startBreak[D - 1]}
//                 >
//                   <span>Start Break</span>
//                   <span className="time-text">
//                     {startBreak[D - 1] || "--:--"}
//                   </span>
//                 </Button>
//               </Col>
//               <Col>
//                 <Button
//                   variant="secondary"
//                   className="w-100 d-flex flex-column align-items-center"
//                   onClick={() => handleAction("endBreak")}
//                   disabled={!!endBreak[D - 1]}
//                 >
//                   <span>End Break</span>
//                   <span className="time-text">
//                     {endBreak[D - 1] || "--:--"}
//                   </span>
//                 </Button>
//               </Col>
//             </Row>

//             {/* Total Hours */}
//             <div className="hours-box text-center mb-3">
//               <h5>Total Hours Worked</h5>
//               <div className="hours-value">
//                 {hrs}h {mins}m
//               </div>
//             </div>
//             {showUpdateMsg && <Alert variant="info">Updated!</Alert>}

//             {/* Pie Chart */}
//             <div style={{ height: 240 }} className="mb-4">
//               <Pie
//                 data={pieData}
//                 options={{ responsive: true, maintainAspectRatio: false }}
//               />
//             </div>

//             {/* Days Present / Absent */}
//             <Row className="mb-4 text-center">
//               <Col className="text-success">
//                 Days Present: {presentCount}
//               </Col>
//               <Col className="text-danger">Days Absent: {absentCount}</Col>
//             </Row>

//             {/* Attendance Table */}
//             <div className="table-responsive">
//               <Table bordered hover className="table-custom text-center">
//               <thead>
//     <tr>
//       <th className="th-day">Day</th>
//       <th className="th-morning">In</th>
//       <th className="th-evening">Out</th>
//       <th className="th-morning">SB</th>
//       <th className="th-evening">EB</th>
//     </tr>
//   </thead>
//                 <tbody>
//                   {daysArray.map((d) => (
//                     <tr key={d}>
//                       <td className="fw-bold">{d}</td>
//                       <td>{inTimes[d - 1] || "—"}</td>
//                       <td>{outTimes[d - 1] || "—"}</td>
//                       <td>{startBreak[d - 1] || "—"}</td>
//                       <td>{endBreak[d - 1] || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default StaffPage;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

import useGeolocation from "../auth/hooks/useGeolocation";
import { getDistanceFromLatLonInMeters } from "../auth/hooks/distance";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import {
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";

import "./StaffPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// ----------------------------------------------------------------
// Campus location (20 m radius):
const MANUAL_LATITUDE = 52.498084;
const MANUAL_LONGITUDE = -1.706501;
// ----------------------------------------------------------------

function StaffPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const geolocation = useGeolocation();

  const [staffID, setStaffID] = useState("");
  const [staffName, setStaffName] = useState("");
  const [inTimes, setInTimes] = useState<(string | null)[]>([]);
  const [outTimes, setOutTimes] = useState<(string | null)[]>([]);
  const [startBreak, setStartBreak] = useState<(string | null)[]>([]);
  const [endBreak, setEndBreak] = useState<(string | null)[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [showUpdateMsg, setShowUpdateMsg] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();
  const D = today.getDate();
  const Y = today.getFullYear();
  const M = today.getMonth();
  const daysInMonth = new Date(Y, M + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (!session) {
      navigate("/sign-up");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: u, error: ue } = await supabase.auth.getUser();
        if (ue || !u?.user) throw new Error("Not authenticated");

        // Fetch profile to get staffID
        const { data: p, error: pe } = await supabase
          .from("profiles")
          .select("role, staffID")
          .eq("id", u.user.id)
          .single();
        if (pe || !p || p.role !== "Staff") throw new Error("Unauthorized");
        setStaffID(p.staffID);

        // Fetch attendance row
        const { data: row, error: re } = await supabase
          .from("attendance")
          .select("*")
          .eq("staffID", p.staffID)
          .single();
        if (re || !row) throw new Error("No attendance record");

        setStaffName(row.staffName);

        // Build arrays for each day
        const inA: (string | null)[] = [];
        const outA: (string | null)[] = [];
        const sb: (string | null)[] = [];
        const eb: (string | null)[] = [];
        for (let d = 1; d <= daysInMonth; d++) {
          inA.push(row[`in${d}`] || null);
          outA.push(row[`out${d}`] || null);
          sb.push(row[`startBreak${d}`] || null);
          eb.push(row[`endBreak${d}`] || null);
        }
        setInTimes(inA);
        setOutTimes(outA);
        setStartBreak(sb);
        setEndBreak(eb);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, navigate, daysInMonth]);

  // Returns true if device is within 20m of campus
  const within20 = useCallback(() => {
    if (geolocation.loading || geolocation.error) return false;
    const dist = getDistanceFromLatLonInMeters(
      geolocation.latitude!,
      geolocation.longitude!,
      MANUAL_LATITUDE,
      MANUAL_LONGITUDE
    );
    return dist <= 200000;
  }, [geolocation]);

  // Persist a single field update
  const updateDay = async (field: string, value: string) => {
    await supabase
      .from("attendance")
      .update({ [field]: value })
      .eq("staffID", staffID);
  };

  // Update local state arrays
  const updateLocal = (
    arr: (string | null)[],
    setter: React.Dispatch<React.SetStateAction<(string | null)[]>>,
    day: number,
    val: string
  ) => {
    const copy = [...arr];
    copy[day - 1] = val;
    setter(copy);
  };

  // Handle Login / Logout / Break start/end
  const handleAction = async (
    type: "in" | "out" | "startBreak" | "endBreak"
  ) => {
    if (!within20()) {
      alert("You must be within 20 m of pharmacy.");
      return;
    }

    // Prevent double presses
    const already =
      (type === "in" && inTimes[D - 1]) ||
      (type === "out" && outTimes[D - 1]) ||
      (type === "startBreak" && startBreak[D - 1]) ||
      (type === "endBreak" && endBreak[D - 1]);
    if (already) {
      const what =
        type === "in"
          ? "login"
          : type === "out"
          ? "logout"
          : type === "startBreak"
          ? "break start"
          : "break end";
      alert(`You've already recorded ${what} today.`);
      return;
    }

    // Enforce sequence
    if ((type === "out" && !inTimes[D - 1]) || (type === "endBreak" && !startBreak[D - 1])) {
      alert(type === "out" ? "You must log in first." : "You must start break first.");
      return;
    }

    // Confirm with user
    const prompts = {
      in: "Log in now?",
      out: "Log out now?",
      startBreak: "Start break now?",
      endBreak: "End break now?",
    } as const;
    if (!window.confirm(prompts[type])) return;

    // Record current time
    const now = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    await updateDay(`${type}${D}`, now);

    // Reflect local state
    if (type === "in") updateLocal(inTimes, setInTimes, D, now);
    if (type === "out") updateLocal(outTimes, setOutTimes, D, now);
    if (type === "startBreak") updateLocal(startBreak, setStartBreak, D, now);
    if (type === "endBreak") updateLocal(endBreak, setEndBreak, D, now);

    setShowUpdateMsg(true);
    setTimeout(() => setShowUpdateMsg(false), 3000);
  };

  // Recalculate total hours worked
  useEffect(() => {
    let total = 0;
    inTimes.forEach((inT, idx) => {
      const outT = outTimes[idx];
      if (inT && outT) {
        const [ih, im] = inT.split(":").map(Number);
        const [oh, om] = outT.split(":").map(Number);
        const sb = startBreak[idx] || "00:00";
        const eb = endBreak[idx] || "00:00";
        const [sh, sm] = sb.split(":").map(Number);
        const [eh, em] = eb.split(":").map(Number);
        const minsWorked =
          oh * 60 +
          om -
          (ih * 60 + im) -
          ((eh * 60 + em) - (sh * 60 + sm));
        total += Math.max(minsWorked, 0) / 60;
      }
    });
    setTotalHours(Math.round(total * 100) / 100);
  }, [inTimes, outTimes, startBreak, endBreak]);

  // Loading / Error states
  if (loading)
    return (
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Spinner /> <span className="ms-2">Loading…</span>
      </Container>
    );
  if (error)
    return (
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  // Pie chart data
  const presentCount = inTimes.filter(Boolean).length;
  const absentCount = daysInMonth - presentCount;
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [{ data: [presentCount, absentCount], backgroundColor: ["#007bff", "#ff4d4d"] }],
  };

  // Format hours and minutes
  const hrs = Math.floor(totalHours);
  const mins = Math.round((totalHours - hrs) * 60);

  return (
    <Container fluid className="staffpage-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="bg-dark p-4 rounded shadow">
            {/* Header */}
            <div className="header-container d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="text-primary2 mb-1">{staffName}</h2>
                <div className="current-month-year">
                  <strong>ID:</strong> {staffID} | {today.toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="link"
                className="home-button"
                onClick={() => navigate("/login")}
              >
                🏠
              </Button>
            </div>

            {/* Action Buttons */}
            <Row className="mb-3">
              <Col>
                <Button
                  variant="primary"
                  className="w-100 d-flex flex-column align-items-center"
                  onClick={() => handleAction("in")}
                >
                  <span>Login</span>
                  <span className="time-text">{inTimes[D - 1] || "--:--"}</span>
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className="w-100 d-flex flex-column align-items-center"
                  onClick={() => handleAction("out")}
                >
                  <span>Logout</span>
                  <span className="time-text">{outTimes[D - 1] || "--:--"}</span>
                </Button>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <Button
                  variant="secondary"
                  className="w-100 d-flex flex-column align-items-center"
                  onClick={() => handleAction("startBreak")}
                  disabled={!!startBreak[D - 1]}
                >
                  <span>Start Break</span>
                  <span className="time-text">{startBreak[D - 1] || "--:--"}</span>
                </Button>
              </Col>
              <Col>
                <Button
                  variant="secondary"
                  className="w-100 d-flex flex-column align-items-center"
                  onClick={() => handleAction("endBreak")}
                  disabled={!!endBreak[D - 1]}
                >
                  <span>End Break</span>
                  <span className="time-text">{endBreak[D - 1] || "--:--"}</span>
                </Button>
              </Col>
            </Row>

            {/* Total Hours */}
            <div className="hours-box text-center mb-3">
              <h5>Total Hours Worked</h5>
              <div className="hours-value">{hrs}h {mins}m</div>
            </div>
            {showUpdateMsg && <Alert variant="info">Updated!</Alert>}

            {/* Pie Chart */}
            <div style={{ height: 240 }} className="mb-4">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            {/* Days Present / Absent */}
            <Row className="mb-4 text-center">
              <Col className="text-success">Days Present: {presentCount}</Col>
              <Col className="text-danger">Days Absent: {absentCount}</Col>
            </Row>

            {/* Attendance Table */}
            <div className="table-responsive">
              <Table bordered hover className="table-custom text-center">
                <thead>
                  <tr>
                    <th className="th-day">Day</th>
                    <th className="th-morning">In</th>
                    <th className="th-evening">Out</th>
                    <th className="th-morning">SB</th>
                    <th className="th-evening">EB</th>
                  </tr>
                </thead>
                <tbody>
                  {daysArray.map((d) => (
                    <tr key={d}>
                      <td className="fw-bold">{d}</td>
                      <td>{inTimes[d - 1] || "—"}</td>
                      <td>{outTimes[d - 1] || "—"}</td>
                      <td>{startBreak[d - 1] || "—"}</td>
                      <td>{endBreak[d - 1] || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default StaffPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";

// import "./StaffPage.css"; // Our custom CSS

// // ----------------------------------------------------------------
// // You can set your desired location coordinates here:
// const MANUAL_LATITUDE = 52.498084;   // Provided latitude
// const MANUAL_LONGITUDE = -1.706501;  // Provided longitude
// // ----------------------------------------------------------------
// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffPage() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // Basic state
//   const [staffName, setStaffName] = useState("");
//   const [loginTime, setLoginTime] = useState<string | null>(null);
//   const [logoutTime, setLogoutTime] = useState<string | null>(null);
//   const [minLate, setMinLate] = useState<number>(0);
//   const [totalLate, setTotalLate] = useState<number>(0);

//   // Columns for days in the month (1..31)
//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ] as const;
//   const currentMonthName = monthNames[currentMonth];
//   const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

//   // We'll store morning and evening attendance T/F for each day
//   const [morningAttendance, setMorningAttendance] = useState<(boolean | null)[]>([]);
//   const [eveningAttendance, setEveningAttendance] = useState<(boolean | null)[]>([]);

//   // Totals
//   const [present, setPresent] = useState<number>(0);
//   const [presentEvening, setPresentEvening] = useState<number>(0);

//   // Loading & error
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Pie chart counts
//   const [morningPresentCount, setMorningPresentCount] = useState(0);
//   const [morningAbsentCount, setMorningAbsentCount] = useState(0);
//   const [eveningPresentCount, setEveningPresentCount] = useState(0);
//   const [eveningAbsentCount, setEveningAbsentCount] = useState(0);

//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // get user
//         const { data: userData, error: userError } = await supabase.auth.getUser();
//         if (userError || !userData?.user) throw new Error("Not authenticated");

//         // get profile role & staffID
//         const { data: profile, error: profErr } = await supabase
//           .from("profiles")
//           .select("role, staffID")
//           .eq("id", userData.user.id)
//           .single();
//         if (profErr || !profile || profile.role !== "Staff") {
//           throw new Error("Unauthorized");
//         }

//         // get attendance row
//         const { data: row, error: attErr } = await supabase
//           .from("attendance")
//           .select("*")
//           .eq("staffID", profile.staffID)
//           .single();
//         if (attErr || !row) throw new Error("No attendance record");

//         // set header stats
//         setStaffName(row.staffName);
//         setLoginTime(row[`in${today.getDate()}`] || null);
//         setLogoutTime(row[`out${today.getDate()}`] || null);
//         setMinLate(row[`minLate${today.getDate()}`] ?? 0);
//         setTotalLate(row.totalLate ?? 0);
//         setPresent(row.present);
//         setPresentEvening(row.presentEvening);

//         // build attendance arrays
//         const m: (boolean | null)[] = [];
//         const e: (boolean | null)[] = [];
//         for (let d = 1; d <= numberOfDays; d++) {
//           m.push(row[`${d}`] === true ? true : null);
//           e.push(row[`e${d}`] === true ? true : null);
//         }
//         setMorningAttendance(m);
//         setEveningAttendance(e);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, navigate, numberOfDays, today]);

//   // recalc pie counts
//   useEffect(() => {
//     let mp = 0, ma = 0;
//     morningAttendance.forEach(v => v ? mp++ : ma++);
//     setMorningPresentCount(mp); setMorningAbsentCount(ma);

//     let ep = 0, ea = 0;
//     eveningAttendance.forEach(v => v ? ep++ : ea++);
//     setEveningPresentCount(ep); setEveningAbsentCount(ea);
//   }, [morningAttendance, eveningAttendance]);

//   // chart data
//   const morningData = {
//     labels: ["Present (M)", "Absent (M)"],
//     datasets: [{ data: [morningPresentCount, morningAbsentCount], backgroundColor: ["#007bff","#ff4d4d"] }]
//   };
//   const eveningData = {
//     labels: ["Present (E)", "Absent (E)"],
//     datasets: [{ data: [eveningPresentCount, eveningAbsentCount], backgroundColor: ["#50B755","#ff4d4d"] }]
//   };
//   const chartOpts = { responsive:true, maintainAspectRatio:false };

//   // nav buttons
//   const gotoDashboard = () => navigate("/teacherdashboard");
//   const gotoAttendance = () => navigate("/attendance");

//   const getCurrentMonthYear = () => `${currentMonthName} ${currentYear}`;

//   if (loading) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Spinner animation="border" /><p className="mt-3">Loading...</p>
//       </Container>
//     );
//   }
//   if (error) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="staffpage-container py-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark text-white p-4 rounded shadow">
//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-start mb-3">
//               <div>
//                 <h2 className="text-primary mb-1">{staffName}</h2>
//                 <p className="current-month-year">{getCurrentMonthYear()}</p>
//               </div>
//               <div className="d-flex">
//                 <Button variant="link" className="text-white me-2" onClick={gotoDashboard}>🎓</Button>
//                 <Button variant="link" className="text-white me-2" onClick={gotoAttendance}>📃</Button>
//                 <Button variant="link" className="text-white" onClick={() => navigate("/")}>🏠</Button>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="stats-container mb-4">
//               <Row>
//                 <Col xs={6} md={3}><div className="stat-box"><span className="stat-label">Login</span><span className="stat-value">{loginTime||"---"}</span></div></Col>
//                 <Col xs={6} md={3}><div className="stat-box"><span className="stat-label">Logout</span><span className="stat-value">{logoutTime||"---"}</span></div></Col>
//                 <Col xs={6} md={3}><div className="stat-box"><span className="stat-label">Min Late</span><span className="stat-value">{minLate}</span></div></Col>
//                 <Col xs={6} md={3}><div className="stat-box"><span className="stat-label">Total Late</span><span className="stat-value" style={{ color: totalLate===0?"#50B755":"#ff4d4d" }}>{totalLate}</span></div></Col>
//               </Row>
//             </div>

//             {/* Pie charts */}
//             <Row className="justify-content-center">
//               <Col xs={12} md={5} lg={4} className="mb-4 text-center">
//                 <h5 className="chart-title bg-primary">Morning</h5>
//                 <div className="pie-container"><Pie data={morningData} options={chartOpts}/>
//                   <div className="pie-center-text">{((morningPresentCount/(morningPresentCount+morningAbsentCount||1))*100).toFixed(1)}%</div>
//                 </div>
//               </Col>
//               <Col xs={12} md={5} lg={4} className="mb-4 text-center">
//                 <h5 className="chart-title bg-success">Evening</h5>
//                 <div className="pie-container"><Pie data={eveningData} options={chartOpts}/>
//                   <div className="pie-center-text">{((eveningPresentCount/(eveningPresentCount+eveningAbsentCount||1))*100).toFixed(1)}%</div>
//                 </div>
//               </Col>
//             </Row>

//             {/* Totals */}
//             <Row className="justify-content-center mb-4">
//               <Col xs={12} md={6} lg={4} className="d-flex justify-content-center">
//                 <div className="present-container p-4 rounded shadow text-center">
//                   <Row>
//                     <Col xs={6}><h6>Morning Days</h6><p className="present-count">{present}</p></Col>
//                     <Col xs={6}><h6>Evening Days</h6><p className="present-evening-count">{presentEvening}</p></Col>
//                   </Row>
//                 </div>
//               </Col>
//             </Row>

//             {/* Table */}
//             <div className="table-responsive">
//               <Table bordered hover className="text-center align-middle table-custom">
//                 <thead>
//                   <tr><th>Day</th><th>M</th><th>E</th></tr>
//                 </thead>
//                 <tbody>
//                   {daysArray.map(day => (
//                     <tr key={day}>
//                       <td className="fw-bold">{day}</td>
//                       <td>{morningAttendance[day-1] ? "✅" : "❌"}</td>
//                       <td>{eveningAttendance[day-1] ? "✅" : "❌"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>

//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default StaffPage;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";

// import './StaffPage.css'; // Our custom CSS

// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffPage() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   // Basic state
//   const [teacherName, setTeacherName] = useState("");
//   const [school, setSchool] = useState("");
//   const [loginTime, setLoginTime] = useState<string | null>(null);
//   const [logoutTime, setLogoutTime] = useState<string | null>(null);
//   const [minLate, setMinLate] = useState<number | null>(null);
//   const [totalLate, setTotalLate] = useState<number | null>(null);

//   // Columns for days in the month (1..31)
//   const today = new Date();
//   const currentMonth = today.getMonth(); 
//   const currentYear = today.getFullYear();
//   const monthNames = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ] as const;
//   const currentMonthName = monthNames[currentMonth];
//   const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate(); 
//   const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

//   // We'll store morning attendance T/F for each day in an array
//   // We'll store evening attendance T/F for each day in a separate array
//   const [morningAttendance, setMorningAttendance] = useState<(boolean | null)[]>([]);
//   const [eveningAttendance, setEveningAttendance] = useState<(boolean | null)[]>([]);

//   // Add state variables for present and presentEvening
//   const [present, setPresent] = useState<number>(0);
//   const [presentEvening, setPresentEvening] = useState<number>(0);

//   // For loading & error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // We'll compute for the pie charts
//   const [morningPresentCount, setMorningPresentCount] = useState(0);
//   const [morningAbsentCount, setMorningAbsentCount] = useState(0);
//   const [eveningPresentCount, setEveningPresentCount] = useState(0);
//   const [eveningAbsentCount, setEveningAbsentCount] = useState(0);

//   // Utility: if a column is TRUE => present, if null => absent
//   const isPresent = (val: any) => val === true;

//   // 1) Check role => if not Teacher => sign-up
//   // 2) Match teacher row => password == teacherID, plus same school
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // 1) fetch user role, password, and school
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.getUser();

//         if (userError || !user) {
//           setError("Not authenticated. Please log in.");
//           navigate("/sign-up");
//           return;
//         }

//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("role, password, school")
//           .eq("id", user.id)
//           .single();

//         if (profileError || !profileData) {
//           setError("Failed to retrieve profile data.");
//           navigate("/sign-up");
//           return;
//         }

//         if (profileData.role !== "Teacher") {
//           setError("You are not authorized as a Teacher.");
//           navigate("/sign-up");
//           return;
//         }

//         // password => teacherID
//         const teacherID = profileData.password;
//         const schoolName = profileData.school || "";

//         // 2) fetch teacher row
//         const { data: teacherRow, error: teacherError } = await supabase
//           .from("teacher")
//           .select("*")
//           .eq("teacherID", teacherID)
//           .eq("school", schoolName)
//           .single();

//         if (teacherError || !teacherRow) {
//           setError("No matching teacher found in 'teacher' table.");
//           return;
//         }

//         // Now we have the teacher row. Extract attendance
//         setTeacherName(teacherRow.teacherName || "");
//         setSchool(teacherRow.school || "");

//         // top stats
//         setLoginTime(teacherRow.Login || null);
//         setLogoutTime(teacherRow.Logout || null);
//         setMinLate(teacherRow.minLate || 0);
//         setTotalLate(teacherRow.totalLate || 0);

//         // Set present and presentEvening
//         const fetchedPresent = teacherRow.present || 0;
//         const fetchedPresentEvening = teacherRow.presentEvening || 0;

//         setPresent(fetchedPresent);
//         setPresentEvening(fetchedPresentEvening);

//         // build morning and evening attendance arrays
//         let tempMorning: (boolean | null)[] = [];
//         let tempEvening: (boolean | null)[] = [];

//         for (let day = 1; day <= numberOfDays; day++) {
//           const dayVal = teacherRow[`${day}`]; 
//           const eveningVal = teacherRow[`e${day}`];
//           tempMorning.push(dayVal === true ? true : null);
//           tempEvening.push(eveningVal === true ? true : null);
//         }

//         setMorningAttendance(tempMorning);
//         setEveningAttendance(tempEvening);
//       } catch (err: any) {
//         console.error("Error fetching teacher data:", err);
//         setError(err.message || "Unexpected error.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Pie Chart calculation
//   useEffect(() => {
//     if (morningAttendance.length > 0) {
//       let presentM = 0;
//       let absentM = 0;
//       morningAttendance.forEach((val) => {
//         if (val === true) presentM++;
//         else absentM++;
//       });
//       setMorningPresentCount(presentM);
//       setMorningAbsentCount(absentM);
//     }

//     if (eveningAttendance.length > 0) {
//       let presentE = 0;
//       let absentE = 0;
//       eveningAttendance.forEach((val) => {
//         if (val === true) presentE++;
//         else absentE++;
//       });
//       setEveningPresentCount(presentE);
//       setEveningAbsentCount(absentE);
//     }
//   }, [morningAttendance, eveningAttendance]);

//   // Pie data for Morning
//   const morningData = {
//     labels: ["Present (M)", "Absent (M)"],
//     datasets: [
//       {
//         label: "Morning Attendance",
//         data: [morningPresentCount, morningAbsentCount],
//         backgroundColor: ["#007bff", "#ff4d4d"], // Blue for present, red for absent
//         hoverBackgroundColor: ["#0056b3", "#cc0000"], // Darker blue and darker red on hover
//       },
//     ],
//   };

//   // Pie data for Evening
//   const eveningData = {
//     labels: ["Present (E)", "Absent (E)"],
//     datasets: [
//       {
//         label: "Evening Attendance",
//         data: [eveningPresentCount, eveningAbsentCount],
//         backgroundColor: ["#50B755", "#ff4d4d"], // Green for present, red for absent
//         hoverBackgroundColor: ["#379d3a", "#cc0000"], // Darker green and darker red on hover
//       },
//     ],
//   };

//   // Chart options
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   };

//   // UI Interactions
//   const handleGraduateClick = () => {
//     navigate("/teacherdashboard");
//   };
//   const handleFormClick = () => {
//     navigate("/attendance");
//   };

//   // Function to get current month and year
//   const getCurrentMonthYear = () => {
//     const date = new Date();
//     const month = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     return `${month} ${year}`;
//   };

//   // Rendering
//   if (loading) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Spinner animation="border" variant="primary" role="status" />
//         <p className="mt-3">Loading...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="staffpage-container py-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark text-white p-4 rounded shadow">
//             {/* Header / Teacher info */}
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
//               <div>
//                 <h2 className="text-primary mb-1">
//                   {teacherName || "Teacher Name"}
//                 </h2>
//                 <p className="mb-0">
//                   <strong>School:</strong> {school}
//                 </p>
//                 {/* Current Month and Year */}
//                 <p className="current-month-year">{getCurrentMonthYear()}</p>
//               </div>
//               <div className="d-flex flex-row align-items-end mt-3 mt-md-0">
//                 {/* Nav Buttons */}
//                 <button
//                   className="teacher-icon-button me-2"
//                   onClick={handleGraduateClick}
//                   title="Go to Teacher Dashboard"
//                 >
//                   🎓
//                 </button>
//                 <button
//                   className="teacher-icon-button2 me-2"
//                   onClick={handleFormClick}
//                   title="Go to Attendance Page"
//                 >
//                   📃
//                 </button>
//                 {/* Optional: HomePage Button */}

//                 <button
//                   className="teacher-icon-button3"
//                   onClick={() => navigate("/")}
//                   title="Go to Home Page"
//                 >
//                   🏠
//                 </button>
//               </div>
//             </div>

//             {/* Top container for login, logout, minLate, totalLate */}
//             <div className="stats-container mb-4">
//               <Row>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Login</span>
//                     <span className="stat-value">{loginTime || "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Logout</span>
//                     <span className="stat-value">{logoutTime || "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Minutes Late</span>
//                     <span className="stat-value">{minLate !== null ? minLate : "---"}</span>
//                   </div>
//                 </Col>
//                 <Col xs={6} md={3} className="mb-2">
//                   <div className="stat-box">
//                     <span className="stat-label">Total Late</span>
//                     <span
//                       className="stat-value"
//                       style={{
//                         color: totalLate === 0 ? "#50B755" : "#ff4d4d",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {totalLate !== null ? totalLate : "---"}
//                     </span>
//                   </div>
//                 </Col>
//               </Row>
//             </div>

//             {/* Two Pie Charts: Morning & Evening */}
//             <Row className="justify-content-center">
//               {/* Morning Attendance Pie Chart */}
//               <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#007bff' }}>
//                   Morning Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={morningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {morningPresentCount + morningAbsentCount > 0
//                       ? (
//                           (morningPresentCount /
//                             (morningPresentCount + morningAbsentCount)) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>

//               {/* Evening Attendance Pie Chart */}
//               <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#50B755' }}>
//                   Evening Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={eveningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {eveningPresentCount + eveningAbsentCount > 0
//                       ? (
//                           (eveningPresentCount /
//                             (eveningPresentCount + eveningAbsentCount)) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* New Container for Present and PresentEvening */}
//             <Row className="justify-content-center mb-4">
//               <Col xs={12} md={6} lg={4} className="d-flex justify-content-center">
//                 <div className="present-container p-4 rounded shadow">
//                   <Row>
//                     <Col xs={6} className="text-center">
//                       <h6>Morning (Day)</h6>
//                       <p className="present-count">{present}</p>
//                     </Col>
//                     <Col xs={6} className="text-center">
//                       <h6>Evening (Day)</h6>
//                       <p className="present-evening-count">{presentEvening}</p>
//                     </Col>
//                   </Row>
//                 </div>
//               </Col>
//             </Row>

//             {/* Attendance Table (Day, M, E) */}
//             <div className="table-responsive">
//               <Table bordered hover className="text-center align-middle w-100 table-custom">
//                 <thead>
//                   <tr>
//                     <th className="th-day">Day</th>
//                     <th className="th-morning">M</th>
//                     <th className="th-evening">E</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {daysArray.map((day) => {
//                     const morningVal = morningAttendance[day - 1];
//                     const eveningVal = eveningAttendance[day - 1];
//                     return (
//                       <tr key={day}>
//                         <td className="fw-bold day-col">{day}</td>
//                         <td>
//                           {morningVal === true ? "✅" : "❌"}
//                         </td>
//                         <td>
//                           {eveningVal === true ? "✅" : "❌"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default StaffPage;
