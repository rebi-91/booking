// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import {
//   Container,
//   Row,
//   Col,
//   Table,
//   Spinner,
//   Alert,
//   Button,
//   Modal,
//   Form,
// } from "react-bootstrap";

// import "./StaffPage.css";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffLog() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [staffList, setStaffList] = useState<any[]>([]);
//   const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
//   const [showAttendanceTable, setShowAttendanceTable] = useState(false);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [modalAction, setModalAction] = useState<"in"|"startBreak"|"endBreak"|"out" | null>(null);
//   const [modalStaff, setModalStaff] = useState<any | null>(null);
//   const [inputStaffID, setInputStaffID] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);
  
//   const today = new Date();
//   const D = today.getDate();
//   const Y = today.getFullYear();
//   const M = today.getMonth();
//   const daysInMonth = new Date(Y, M + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   // Fetch staff attendance without role check
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }
//     (async () => {
//       setLoading(true);
//       try {
//         // Fetch all attendance records
//         const { data: list, error: le } = await supabase
//           .from("attendance")
//           .select("*");
//         if (le) throw le;
//         setStaffList(list || []);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session, navigate]);

//   // Helper: format time now
//   const getNow = () => new Date().toLocaleTimeString("en-GB", {
//     hour12: false, hour: "2-digit", minute: "2-digit"
//   });

//   // Open modal
//   const openModal = (staff: any, action: "in"|"startBreak"|"endBreak"|"out") => {
//     setModalStaff(staff);
//     setModalAction(action);
//     setInputStaffID("");
//     setShowModal(true);
//   };

//   const handleModalConfirm = async () => {
//     if (!modalStaff || !modalAction) return;
//     if (inputStaffID !== modalStaff.staffID) {
//       alert("Staff ID incorrect");
//       return;
//     }
//     setUpdateLoading(true);
//     const now = getNow();
//     const field = `${modalAction}${D}`;
//     try {
//       await supabase
//         .from("attendance")
//         .update({ [field]: now })
//         .eq("staffID", modalStaff.staffID);
//       // update local state
//       setStaffList(staffList.map(s => s.staffID === modalStaff.staffID ? { ...s, [field]: now } : s));
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setUpdateLoading(false);
//       setShowModal(false);
//     }
//   };

//   if (loading) return <Container className="d-flex vh-100 justify-content-center align-items-center"><Spinner /> <span>Loading…</span></Container>;
//   if (error) return <Container className="d-flex vh-100 justify-content-center align-items-center"><Alert variant="danger">{error}</Alert></Container>;

//   // Pie data counts presence for selectedStaff
//   const presentCount = selectedStaff
//     ? daysArray.filter(d => selectedStaff[`in${d}`]).length
//     : 0;
//   const absentCount = selectedStaff ? daysInMonth - presentCount : 0;
//   const pieData = {
//     labels: ["Present", "Absent"],
//     datasets: [{ data: [presentCount, absentCount] }]
//   };

//   return (
//     <Container fluid className="staffpage-container py-4">
//       <Row className="justify-content-center mb-4">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark p-4 rounded shadow">
//             <h3 className="text-primary2 mb-3">Staff Log</h3>
//             <Table bordered hover className="table-custom text-center">
//               <thead>
//                 <tr>
//                   <th>Staff Name</th>
//                   <th>Login</th>
//                   <th>Start Break</th>
//                   <th>End Break</th>
//                   <th>Logout</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staffList.map((st) => {
//                   const loggedIn = st[`in${D}`];
//                   const sb = st[`startBreak${D}`];
//                   const eb = st[`endBreak${D}`];
//                   const loggedOut = st[`out${D}`];
//                   return (
//                     <tr key={st.staffID}>
//                       <td
//                         className="fw-bold clickable"
//                         onClick={() => setSelectedStaff(st)}
//                       >{st.staffName}</td>
//                       <td>
//                         {loggedIn
//                           ? loggedIn
//                           : <Button size="sm" onClick={() => openModal(st, "in")}>Login</Button>
//                         }
//                       </td>
//                       <td>
//                         {sb
//                           ? sb
//                           : <Button size="sm" onClick={() => openModal(st,"startBreak")}>Start Break</Button>
//                         }
//                       </td>
//                       <td>
//                         {eb
//                           ? eb
//                           : <Button size="sm" onClick={() => openModal(st,"endBreak")}>End Break</Button>
//                         }
//                       </td>
//                       <td>
//                         {loggedOut
//                           ? loggedOut
//                           : <Button size="sm" onClick={() => openModal(st,"out")}>Logout</Button>
//                         }
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </Col>
//       </Row>

//       {selectedStaff && (
//         <Row className="justify-content-center">
//           <Col xs={12} md={10} lg={8}>
//             <div className="bg-dark p-4 rounded shadow mb-4">
//               <h4 className="text-primary2">{selectedStaff.staffName}</h4>
//               <div style={{ height: 200 }} className="d-flex">
//                 <Pie data={pieData} options={{ maintainAspectRatio: false }} />
//                 <Button
//                   variant="outline-light"
//                   className="ms-3 align-self-center rounded"
//                   onClick={() => setShowAttendanceTable(!showAttendanceTable)}
//                 >
//                   {showAttendanceTable ? "Hide Attendance" : "Show Attendance"}
//                 </Button>
//               </div>
//             </div>
//             {showAttendanceTable && (
//               <div className="bg-dark p-4 rounded shadow">
//                 <Table bordered hover className="table-custom text-center">
//                   <thead>
//                     <tr>
//                       <th>Day</th>
//                       <th>In</th>
//                       <th>Out</th>
//                       <th>SB</th>
//                       <th>EB</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {daysArray.map(d => (
//                       <tr key={d}>
//                         <td className="fw-bold">{d}</td>
//                         <td>{selectedStaff[`in${d}`] || "—"}</td>
//                         <td>{selectedStaff[`out${d}`] || "—"}</td>
//                         <td>{selectedStaff[`startBreak${d}`] || "—"}</td>
//                         <td>{selectedStaff[`endBreak${d}`] || "—"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             )}
//           </Col>
//         </Row>
//       )}

//       {/* Modal for staffID confirmation */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm {modalAction}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Enter Staff ID</Form.Label>
//               <Form.Control
//                 value={inputStaffID}
//                 onChange={e => setInputStaffID(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//           <Button variant="primary" disabled={updateLoading} onClick={handleModalConfirm}>
//             {updateLoading ? 'Saving...' : 'Confirm'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default StaffLog;
// File: src/pages/teacher/StaffLog.tsx

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import {
//   Container,
//   Row,
//   Col,
//   Table,
//   Spinner,
//   Alert,
//   Button,
//   Modal,
//   Form,
// } from "react-bootstrap";

// import "./StaffLog.css";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffLog() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [staffList, setStaffList] = useState<any[]>([]);
//   const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
//   const [showAttendanceTable, setShowAttendanceTable] = useState(false);

//   // ID prompt modal
//   const [showIDModal, setShowIDModal] = useState(false);
//   const [idModalStaff, setIdModalStaff] = useState<any | null>(null);
//   const [idInput, setIdInput] = useState("");

//   // Action confirm modal
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [modalAction, setModalAction] = useState<"in" | "startBreak" | "endBreak" | "out" | null>(null);
//   const [modalStaff, setModalStaff] = useState<any | null>(null);
//   const [inpStaffID, setInpStaffID] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const today = new Date();
//   const D = today.getDate();
//   const Y = today.getFullYear();
//   const M = today.getMonth();
//   const daysInMonth = new Date(Y, M + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   // Fetch all attendance records with async/await
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error: le } = await supabase
//           .from("attendance")
//           .select("*");
//         if (le) throw le;
//         setStaffList(data || []);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session, navigate]);

//   // Handle clicking staff name: ask for ID, then toggle detail panel
//   const handleNameClick = (staff: any) => {
//     if (selectedStaff?.staffID === staff.staffID) {
//       setSelectedStaff(null);
//       setShowAttendanceTable(false);
//       return;
//     }
//     setIdModalStaff(staff);
//     setIdInput("");
//     setShowIDModal(true);
//   };
//   const confirmID = () => {
//     if (idInput === idModalStaff?.staffID) {
//       setSelectedStaff(idModalStaff);
//       setShowIDModal(false);
//     } else {
//       alert("Staff ID incorrect");
//     }
//   };

//   // Open confirm-action modal (enforce sequence)
//   const openActionModal = (staff: any, action: "in" | "startBreak" | "endBreak" | "out") => {
//     if (action === "out" && !staff[`in${D}`]) return alert("Must log in first.");
//     if (action === "startBreak" && !staff[`in${D}`]) return alert("Must log in first.");
//     if (action === "endBreak" && !staff[`startBreak${D}`]) return alert("Must start break first.");
//     setModalStaff(staff);
//     setModalAction(action);
//     setInpStaffID("");
//     setShowActionModal(true);
//   };
//   const confirmAction = () => {
//     if (inpStaffID !== modalStaff?.staffID) return alert("Staff ID incorrect");
//     setShowActionModal(false);
//     performUpdate();
//   };

//   // Perform the Supabase update
//   const performUpdate = async () => {
//     if (!modalStaff || !modalAction) return;
//     setUpdateLoading(true);
//     const now = new Date().toLocaleTimeString("en-GB", {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     const field = `${modalAction}${D}`;
//     try {
//       await supabase
//         .from("attendance")
//         .update({ [field]: now })
//         .eq("staffID", modalStaff.staffID);
//       // Update local state
//       setStaffList(list =>
//         list.map(s =>
//           s.staffID === modalStaff.staffID ? { ...s, [field]: now } : s
//         )
//       );
//       if (selectedStaff?.staffID === modalStaff.staffID) {
//         setSelectedStaff(prev => (prev ? { ...prev, [field]: now } : prev));
//       }
//     } catch {
//       alert("Update failed.");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Loading / Error UI
//   if (loading)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Spinner /> <span>Loading…</span>
//       </Container>
//     );
//   if (error)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   // Calculate total hours & pie chart data
//   const totalHours = selectedStaff
//     ? daysArray.reduce((sum, d) => {
//         const inT = selectedStaff[`in${d}`];
//         const outT = selectedStaff[`out${d}`];
//         const sb = selectedStaff[`startBreak${d}`] || "00:00";
//         const eb = selectedStaff[`endBreak${d}`] || "00:00";
//         if (inT && outT) {
//           const [ih, im] = inT.split(":").map(Number);
//           const [oh, om] = outT.split(":").map(Number);
//           const [sh, sm] = sb.split(":").map(Number);
//           const [eh, em] = eb.split(":").map(Number);
//           const worked =
//             oh * 60 + om -
//             (ih * 60 + im) -
//             ((eh * 60 + em) - (sh * 60 + sm));
//           return sum + Math.max(worked, 0) / 60;
//         }
//         return sum;
//       }, 0)
//     : 0;
//   const hrs = Math.floor(totalHours);
//   const mins = Math.round((totalHours - hrs) * 60);
//   const presentCount = selectedStaff
//     ? daysArray.filter(d => selectedStaff[`in${d}`]).length
//     : 0;
//   const absentCount = selectedStaff ? daysInMonth - presentCount : 0;
//   const pieData = {
//     labels: ["Present", "Absent"],
//     datasets: [{ data: [presentCount, absentCount] }],
//   };

//   return (
//     <Container fluid className="staffpage-container py-4">
//       {/* Staff List */}
//       <Row className="justify-content-center mb-4">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark p-4 rounded shadow">
//             <h3 className="text-primary2 mb-3">Staff Log</h3>
//             <Table bordered hover className="table-custom text-center">
//               <thead>
//                 <tr>
//                   <th>Staff Name</th>
//                   <th>Login</th>
//                   <th>Start Break</th>
//                   <th>End Break</th>
//                   <th>Logout</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staffList.map(st => {
//                   const li = st[`in${D}`];
//                   const sb = st[`startBreak${D}`];
//                   const eb = st[`endBreak${D}`];
//                   const lo = st[`out${D}`];
//                   return (
//                     <tr key={st.staffID}>
//                       <td
//                         className="fw-bold clickable"
//                         onClick={() => handleNameClick(st)}
//                       >
//                         {st.staffName}
//                       </td>
//                       <td>
//                         {li || (
//                           <Button size="sm" onClick={() => openActionModal(st, "in")}>
//                             Login
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {sb || (
//                           <Button size="sm" onClick={() => openActionModal(st, "startBreak")}>
//                             Start Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {eb || (
//                           <Button size="sm" onClick={() => openActionModal(st, "endBreak")}>
//                             End Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {lo || (
//                           <Button size="sm" onClick={() => openActionModal(st, "out")}>
//                             Logout
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </Col>
//       </Row>

//       {/* Detail Panel */}
//       {selectedStaff && (
//         <Row className="justify-content-center">
//           <Col xs={12} md={10} lg={8}>
//             <div className="bg-dark p-4 rounded shadow mb-4">
//               <div className="header-container d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h4 className="text-primary2 mb-1">{selectedStaff.staffName}</h4>
//                   <div className="current-month-year">
//                     <strong>ID:</strong> {selectedStaff.staffID} |{" "}
//                     {today.toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="hours-box text-center mb-3">
//                 <h5>Total Hours Worked</h5>
//                 <div className="hours-value">
//                   {hrs}h {mins}m
//                 </div>
//               </div>

//               <div style={{ height: 240 }} className="d-flex">
//                 <Pie data={pieData} options={{ maintainAspectRatio: false }} />
//                 <Button
//                   variant="outline-light"
//                   className="ms-3 align-self-center rounded"
//                   onClick={() => setShowAttendanceTable(!showAttendanceTable)}
//                 >
//                   {showAttendanceTable ? "Hide Attendance" : "Show Attendance"}
//                 </Button>
//               </div>

//               {showAttendanceTable && (
//                 <div className="table-responsive mt-4">
//                   <Table bordered hover className="table-custom text-center">
//                     <thead>
//                       <tr>
//                         <th className="th-day">Day</th>
//                         <th className="th-morning">In</th>
//                         <th className="th-evening">Out</th>
//                         <th className="th-morning">SB</th>
//                         <th className="th-evening">EB</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {daysArray.map(d => (
//                         <tr key={d}>
//                           <td className="fw-bold">{d}</td>
//                           <td>{selectedStaff[`in${d}`] || "—"}</td>
//                           <td>{selectedStaff[`out${d}`] || "—"}</td>
//                           <td>{selectedStaff[`startBreak${d}`] || "—"}</td>
//                           <td>{selectedStaff[`endBreak${d}`] || "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </div>
//           </Col>
//         </Row>
//       )}

//       {/* ID Entry Modal */}
//       <Modal show={showIDModal} onHide={() => setShowIDModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Enter Staff ID</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Staff ID for {idModalStaff?.staffName}</Form.Label>
//             <Form.Control value={idInput} onChange={e => setIdInput(e.target.value)} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowIDModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={confirmID}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Action Confirmation Modal */}
//       <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm {modalAction}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Enter Staff ID to {modalAction}</Form.Label>
//             <Form.Control value={inpStaffID} onChange={e => setInpStaffID(e.target.value)} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="danger" onClick={() => setShowActionModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="success" disabled={updateLoading} onClick={confirmAction}>
//             {updateLoading ? "Saving..." : "Confirm"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default StaffLog;
// File: src/pages/teacher/StaffLog.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

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
  Modal,
  Form,
} from "react-bootstrap";

import "./StaffLog.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function StaffLog() {
  const { session } = useSession();
  const navigate = useNavigate();

  // ─── Hooks: always declared in the same order ────────────────────────────
  const [roleChecked, setRoleChecked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [modalStaff, setModalStaff] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<
    "in" | "startBreak" | "endBreak" | "out" | null
  >(null);
  const [modalTime, setModalTime] = useState<string>("");

  // ─── Role check: redirect non-ADMIN ────────────────────────────────────
  useEffect(() => {
    if (!session?.user?.id) {
      navigate("/sign-in");
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (error || !data) throw error || new Error("No profile");
        if (data.role !== "ADMIN") {
          navigate("/sign-in");
          return;
        }
      } catch {
        navigate("/sign-in");
      } finally {
        setRoleChecked(true);
      }
    })();
  }, [session, navigate]);

  // ─── Initial attendance fetch ─────────────────────────────────────────
  useEffect(() => {
    if (!session) {
      navigate("/sign-up");
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const { data, error: le } = await supabase
          .from("attendance")
          .select("*");
        if (le) throw le;
        setStaffList(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, navigate]);

  // ─── Early returns after hooks ─────────────────────────────────────────
  if (!roleChecked || loading) {
    return (
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Spinner /> <span>Loading…</span>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // ─── Date helpers ─────────────────────────────────────────────────────
  const today = new Date();
  const D = today.getDate();
  const Y = today.getFullYear();
  const M = today.getMonth();
  const daysInMonth = new Date(Y, M + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleNameClick = (staff: any) => {
    if (selectedStaff?.staffID === staff.staffID) {
      setSelectedStaff(null);
      setShowAttendanceTable(false);
    } else {
      setSelectedStaff(staff);
      setShowAttendanceTable(false);
    }
  };

  const openTimeModal = (
    staff: any,
    action: "in" | "startBreak" | "endBreak" | "out"
  ) => {
    // Enforce sequence
    if (action === "out" && !staff[`in${D}`])
      return alert("Must log in first.");
    if (action === "startBreak" && !staff[`in${D}`])
      return alert("Must log in first.");
    if (action === "endBreak" && !staff[`startBreak${D}`])
      return alert("Must start break first.");

    setModalStaff(staff);
    setModalAction(action);

    // Default to existing time or now
    const existing = staff[`${action}${D}`];
    const now = new Date();
    const hh = String(
      existing ? Number(existing.slice(0, 2)) : now.getHours()
    ).padStart(2, "0");
    const mm = String(
      existing ? Number(existing.slice(3, 5)) : now.getMinutes()
    ).padStart(2, "0");
    setModalTime(`${hh}:${mm}`);

    setShowTimeModal(true);
  };

  const confirmTime = async () => {
    if (!modalStaff || !modalAction) return;
    const [hh, mm] = modalTime.split(":").map(Number);
    const formatted = `${String(hh).padStart(2, "0")}:${String(mm).padStart(
      2,
      "0"
    )}`;

    if (
      !window.confirm(`Are you sure you want to ${modalAction} at ${formatted}?`)
    ) {
      setShowTimeModal(false);
      return;
    }

    const field = `${modalAction}${D}`;
    try {
      await supabase
        .from("attendance")
        .update({ [field]: formatted })
        .eq("staffID", modalStaff.staffID);

      setStaffList((list) =>
        list.map((s) =>
          s.staffID === modalStaff.staffID ? { ...s, [field]: formatted } : s
        )
      );
      if (selectedStaff?.staffID === modalStaff.staffID) {
        setSelectedStaff((prev) =>
          prev ? { ...prev, [field]: formatted } : prev
        );
      }
    } catch {
      alert("Update failed.");
    } finally {
      setShowTimeModal(false);
    }
  };

  // ─── Compute total hours & pie data ───────────────────────────────────
  const totalHours = selectedStaff
    ? daysArray.reduce((sum, d) => {
        const inT = selectedStaff[`in${d}`];
        const outT = selectedStaff[`out${d}`];
        const sb = selectedStaff[`startBreak${d}`] || "00:00";
        const eb = selectedStaff[`endBreak${d}`] || "00:00";
        if (inT && outT) {
          const [ih, im] = inT.split(":").map(Number);
          const [oh, om] = outT.split(":").map(Number);
          const [sh, sm] = sb.split(":").map(Number);
          const [eh, em] = eb.split(":").map(Number);
          const minsWorked =
            oh * 60 +
            om -
            (ih * 60 + im) -
            ((eh * 60 + em) - (sh * 60 + sm));
          return sum + Math.max(minsWorked, 0) / 60;
        }
        return sum;
      }, 0)
    : 0;

  const hrs = Math.floor(totalHours);
  const mins = Math.round((totalHours - hrs) * 60);
  const presentCount = selectedStaff
    ? daysArray.filter((d) => !!selectedStaff[`in${d}`]).length
    : 0;
  const absentCount = selectedStaff ? daysInMonth - presentCount : 0;
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [{ data: [presentCount, absentCount] }],
  };

  // ─── JSX ───────────────────────────────────────────────────────────────
  return (
    <Container fluid className="staffpage-container py-4">
      {/* Staff List */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <div className="bg-dark p-4 rounded shadow">
            <h3 className="text-primary2 mb-3">Staff Log</h3>
            <Table bordered hover className="table-custom text-center">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Login</th>
                  <th>Start Break</th>
                  <th>End Break</th>
                  <th>Logout</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((st) => {
                  const li = st[`in${D}`];
                  const sb = st[`startBreak${D}`];
                  const eb = st[`endBreak${D}`];
                  const lo = st[`out${D}`];
                  return (
                    <tr key={st.staffID}>
                      <td
                        className="fw-bold clickable"
                        onClick={() => handleNameClick(st)}
                      >
                        {st.staffName}
                      </td>
                      <td>
                        {li || (
                          <Button
                            size="sm"
                            onClick={() => openTimeModal(st, "in")}
                          >
                            Login
                          </Button>
                        )}
                      </td>
                      <td>
                        {sb || (
                          <Button
                            size="sm"
                            onClick={() => openTimeModal(st, "startBreak")}
                          >
                            Start Break
                          </Button>
                        )}
                      </td>
                      <td>
                        {eb || (
                          <Button
                            size="sm"
                            onClick={() => openTimeModal(st, "endBreak")}
                          >
                            End Break
                          </Button>
                        )}
                      </td>
                      <td>
                        {lo || (
                          <Button
                            size="sm"
                            onClick={() => openTimeModal(st, "out")}
                          >
                            Logout
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Detail Panel */}
      {selectedStaff && (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <div className="bg-dark p-4 rounded shadow mb-4">
              <div className="header-container d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-primary2 mb-1">
                  {selectedStaff.staffName}
                </h4>
                <div className="current-month-year">
                  <strong>ID:</strong> {selectedStaff.staffID} |{" "}
                  {today.toLocaleDateString()}
                </div>
              </div>
              <div className="hours-box text-center mb-3">
                <h5>Total Hours Worked</h5>
                <div className="hours-value">
                  {hrs}h {mins}m
                </div>
              </div>
              <div style={{ height: 240 }} className="d-flex">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                <Button
                  variant="outline-light"
                  className="ms-3 align-self-center rounded"
                  onClick={() => setShowAttendanceTable(!showAttendanceTable)}
                >
                  {showAttendanceTable ? "Hide Attendance" : "Show Attendance"}
                </Button>
              </div>
              {showAttendanceTable && (
                <div className="table-responsive mt-4">
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
                          <td>{selectedStaff[`in${d}`] || "—"}</td>
                          <td>{selectedStaff[`out${d}`] || "—"}</td>
                          <td>
                            {selectedStaff[`startBreak${d}`] || "—"}
                          </td>
                          <td>{selectedStaff[`endBreak${d}`] || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Col>
        </Row>
      )}

      {/* Time‑Picker Modal */}
      <Modal
        show={showTimeModal}
        onHide={() => setShowTimeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "in"
              ? "Login"
              : modalAction === "out"
              ? "Logout"
              : modalAction === "startBreak"
              ? "Start Break"
              : "End Break"}{" "}
            at…
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select time</Form.Label>
            <Form.Control
              type="time"
              value={modalTime}
              onChange={(e) => setModalTime(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowTimeModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmTime}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StaffLog;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// import {
//   Container,
//   Row,
//   Col,
//   Table,
//   Spinner,
//   Alert,
//   Button,
//   Modal,
//   Form,
// } from "react-bootstrap";

// import "./StaffLog.css";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function StaffLog() {
//   const { session } = useSession();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [staffList, setStaffList] = useState<any[]>([]);
//   const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
//   const [showAttendanceTable, setShowAttendanceTable] = useState(false);

//   // ID prompt modal
//   const [showIDModal, setShowIDModal] = useState(false);
//   const [idModalStaff, setIdModalStaff] = useState<any | null>(null);
//   const [idInput, setIdInput] = useState("");

//   // Action confirm modal
//   const [showActionModal, setShowActionModal] = useState(false);
//   const [modalAction, setModalAction] = useState<"in" | "startBreak" | "endBreak" | "out" | null>(null);
//   const [modalStaff, setModalStaff] = useState<any | null>(null);
//   const [inpStaffID, setInpStaffID] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const today = new Date();
//   const D = today.getDate();
//   const Y = today.getFullYear();
//   const M = today.getMonth();
//   const daysInMonth = new Date(Y, M + 1, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   // Fetch all attendance records
//   useEffect(() => {
//     if (!session) {
//       navigate("/sign-up");
//       return;
//     }
//     (async () => {
//       setLoading(true);
//       try {
//         const { data, error: le } = await supabase.from("attendance").select("*");
//         if (le) throw le;
//         setStaffList(data || []);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [session, navigate]);

//   // Handle clicking staff name: ask for ID, then toggle detail panel
//   const handleNameClick = (staff: any) => {
//     if (selectedStaff?.staffID === staff.staffID) {
//       setSelectedStaff(null);
//       setShowAttendanceTable(false);
//       return;
//     }
//     setIdModalStaff(staff);
//     setIdInput("");
//     setShowIDModal(true);
//   };
//   const confirmID = () => {
//     if (idInput === idModalStaff?.staffID) {
//       setSelectedStaff(idModalStaff);
//       setShowIDModal(false);
//     } else {
//       alert("Staff ID incorrect");
//     }
//   };

//   // Open confirm-action modal (enforce login→break→logout sequence)
//   const openActionModal = (staff: any, action: "in" | "startBreak" | "endBreak" | "out") => {
//     if (action === "out" && !staff[`in${D}`]) return alert("Must log in first.");
//     if (action === "startBreak" && !staff[`in${D}`]) return alert("Must log in first.");
//     if (action === "endBreak" && !staff[`startBreak${D}`]) return alert("Must start break first.");
//     setModalStaff(staff);
//     setModalAction(action);
//     setInpStaffID("");
//     setShowActionModal(true);
//   };
//   const confirmAction = () => {
//     if (inpStaffID !== modalStaff?.staffID) return alert("Staff ID incorrect");
//     setShowActionModal(false);
//     performUpdate();
//   };

//   // Perform the Supabase update
//   const performUpdate = async () => {
//     if (!modalStaff || !modalAction) return;
//     setUpdateLoading(true);
//     const now = new Date().toLocaleTimeString("en-GB", {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     const field = `${modalAction}${D}`;
//     try {
//       await supabase
//         .from("attendance")
//         .update({ [field]: now })
//         .eq("staffID", modalStaff.staffID);
//       // Update local state
//       setStaffList(list =>
//         list.map(s =>
//           s.staffID === modalStaff.staffID ? { ...s, [field]: now } : s
//         )
//       );
//       if (selectedStaff?.staffID === modalStaff.staffID) {
//         setSelectedStaff(prev => (prev ? { ...prev, [field]: now } : prev));
//       }
//     } catch {
//       alert("Update failed.");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Loading / Error
//   if (loading)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Spinner /> <span>Loading…</span>
//       </Container>
//     );
//   if (error)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   // Calculate total hours, pie chart data
//   const totalHours = selectedStaff
//     ? daysArray.reduce((sum, d) => {
//         const inT = selectedStaff[`in${d}`];
//         const outT = selectedStaff[`out${d}`];
//         const sb = selectedStaff[`startBreak${d}`] || "00:00";
//         const eb = selectedStaff[`endBreak${d}`] || "00:00";
//         if (inT && outT) {
//           const [ih, im] = inT.split(":").map(Number);
//           const [oh, om] = outT.split(":").map(Number);
//           const [sh, sm] = sb.split(":").map(Number);
//           const [eh, em] = eb.split(":").map(Number);
//           const worked =
//             oh * 60 + om -
//             (ih * 60 + im) -
//             ((eh * 60 + em) - (sh * 60 + sm));
//           return sum + Math.max(worked, 0) / 60;
//         }
//         return sum;
//       }, 0)
//     : 0;
//   const hrs = Math.floor(totalHours);
//   const mins = Math.round((totalHours - hrs) * 60);
//   const presentCount = selectedStaff
//     ? daysArray.filter(d => selectedStaff[`in${d}`]).length
//     : 0;
//   const absentCount = selectedStaff ? daysInMonth - presentCount : 0;
//   const pieData = {
//     labels: ["Present", "Absent"],
//     datasets: [{ data: [presentCount, absentCount] }],
//   };

//   return (
//     <Container fluid className="staffpage-container py-4">
//       {/* Staff List */}
//       <Row className="justify-content-center mb-4">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark p-4 rounded shadow">
//             <h3 className="text-primary2 mb-3">Staff Log</h3>
//             <Table bordered hover className="table-custom text-center">
//               <thead>
//                 <tr>
//                   <th>Staff Name</th>
//                   <th>Login</th>
//                   <th>Start Break</th>
//                   <th>End Break</th>
//                   <th>Logout</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staffList.map(st => {
//                   const li = st[`in${D}`];
//                   const sb = st[`startBreak${D}`];
//                   const eb = st[`endBreak${D}`];
//                   const lo = st[`out${D}`];
//                   return (
//                     <tr key={st.staffID}>
//                       <td
//                         className="fw-bold clickable"
//                         onClick={() => handleNameClick(st)}
//                       >
//                         {st.staffName}
//                       </td>
//                       <td>
//                         {li || (
//                           <Button size="sm" onClick={() => openActionModal(st, "in")}>
//                             Login
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {sb || (
//                           <Button size="sm" onClick={() => openActionModal(st, "startBreak")}>
//                             Start Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {eb || (
//                           <Button size="sm" onClick={() => openActionModal(st, "endBreak")}>
//                             End Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {lo || (
//                           <Button size="sm" onClick={() => openActionModal(st, "out")}>
//                             Logout
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </Col>
//       </Row>

//       {/* Detail Panel */}
//       {selectedStaff && (
//         <Row className="justify-content-center">
//           <Col xs={12} md={10} lg={8}>
//             <div className="bg-dark p-4 rounded shadow mb-4">
//               <div className="header-container d-flex justify-content-between align-items-center mb-3">
//                 <div>
//                   <h4 className="text-primary2 mb-1">{selectedStaff.staffName}</h4>
//                   <div className="current-month-year">
//                     <strong>ID:</strong> {selectedStaff.staffID} | {today.toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//               <div className="hours-box text-center mb-3">
//                 <h5>Total Hours Worked</h5>
//                 <div className="hours-value">{hrs}h {mins}m</div>
//               </div>
//               <div style={{ height: 240 }} className="d-flex">
//                 <Pie data={pieData} options={{ maintainAspectRatio: false }} />
//                 <Button
//                   variant="outline-light"
//                   className="ms-3 align-self-center rounded"
//                   onClick={() => setShowAttendanceTable(!showAttendanceTable)}
//                 >
//                   {showAttendanceTable ? "Hide Attendance" : "Show Attendance"}
//                 </Button>
//               </div>
//               {showAttendanceTable && (
//                 <div className="table-responsive mt-4">
//                   <Table bordered hover className="table-custom text-center">
//                     <thead>
//                       <tr>
//                         <th className="th-day">Day</th>
//                         <th className="th-morning">In</th>
//                         <th className="th-evening">Out</th>
//                         <th className="th-morning">SB</th>
//                         <th className="th-evening">EB</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {daysArray.map(d => (
//                         <tr key={d}>
//                           <td className="fw-bold">{d}</td>
//                           <td>{selectedStaff[`in${d}`] || "—"}</td>
//                           <td>{selectedStaff[`out${d}`] || "—"}</td>
//                           <td>{selectedStaff[`startBreak${d}`] || "—"}</td>
//                           <td>{selectedStaff[`endBreak${d}`] || "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </div>
//           </Col>
//         </Row>
//       )}

//       {/* ID Entry Modal */}
//       <Modal show={showIDModal} onHide={() => setShowIDModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Enter Staff ID</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Staff ID for {idModalStaff?.staffName}</Form.Label>
//             <Form.Control value={idInput} onChange={e => setIdInput(e.target.value)} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowIDModal(false)}>Cancel</Button>
//           <Button variant="primary" onClick={confirmID}>Confirm</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Action Confirmation Modal */}
//       <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm {modalAction}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Enter Staff ID to {modalAction}</Form.Label>
//             <Form.Control value={inpStaffID} onChange={e => setInpStaffID(e.target.value)} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="danger" onClick={() => setShowActionModal(false)}>Cancel</Button>
//           <Button variant="success" disabled={updateLoading} onClick={confirmAction}>
//             {updateLoading ? "Saving..." : "Confirm"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default StaffLog;
