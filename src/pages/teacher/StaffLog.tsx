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

import { FaHome } from "react-icons/fa";

import "./StaffLog.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function StaffLog() {
  const { session } = useSession();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);

  const [showIDModal, setShowIDModal] = useState(false);
  const [idModalStaff, setIdModalStaff] = useState<any | null>(null);
  const [idInput, setIdInput] = useState("");

  const [showActionModal, setShowActionModal] = useState(false);
  const [modalAction, setModalAction] = useState<"in" | "startBreak" | "endBreak" | "out" | null>(null);
  const [modalStaff, setModalStaff] = useState<any | null>(null);
  const [inpStaffID, setInpStaffID] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

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
        const { data, error: le } = await supabase.from("attendance").select("*");
        if (le) throw le;
        setStaffList(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, navigate]);

  const handleNameClick = (staff: any) => {
    if (selectedStaff?.staffID === staff.staffID) {
      setSelectedStaff(null);
      setShowAttendanceTable(false);
      return;
    }
    setIdModalStaff(staff);
    setIdInput("");
    setShowIDModal(true);
  };

  const confirmID = () => {
    if (idInput === idModalStaff?.staffID) {
      setSelectedStaff(idModalStaff);
      setShowIDModal(false);
    } else {
      alert("Staff ID incorrect");
    }
  };

  const openActionModal = (staff: any, action: "in" | "startBreak" | "endBreak" | "out") => {
    const login = staff[`in${D}`];
    const startBreak = staff[`startBreak${D}`];
    const endBreak = staff[`endBreak${D}`];

    if (action === "out") {
      if (!login) return alert("Must log in first.");
      if (startBreak && !endBreak) return alert("Cannot logout before ending the break.");
    }

    if (action === "startBreak" && !login) return alert("Must log in first.");
    if (action === "endBreak" && !startBreak) return alert("Must start break first.");

    setModalStaff(staff);
    setModalAction(action);
    setInpStaffID("");
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (inpStaffID !== modalStaff?.staffID) return alert("Staff ID incorrect");
    setShowActionModal(false);
    performUpdate();
  };

  const performUpdate = async () => {
    if (!modalStaff || !modalAction) return;
    setUpdateLoading(true);
    const now = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const field = `${modalAction}${D}`;
    try {
      await supabase
        .from("attendance")
        .update({ [field]: now })
        .eq("staffID", modalStaff.staffID);

      setStaffList(list =>
        list.map(s => (s.staffID === modalStaff.staffID ? { ...s, [field]: now } : s))
      );

      if (selectedStaff?.staffID === modalStaff.staffID) {
        setSelectedStaff(prev => (prev ? { ...prev, [field]: now } : prev));
      }
    } catch {
      alert("Update failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

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
          const worked =
            oh * 60 + om -
            (ih * 60 + im) -
            ((eh * 60 + em) - (sh * 60 + sm));
          return sum + Math.max(worked, 0) / 60;
        }
        return sum;
      }, 0)
    : 0;

  const hrs = Math.floor(totalHours);
  const mins = Math.round((totalHours - hrs) * 60);
  const presentCount = selectedStaff
    ? daysArray.filter(d => selectedStaff[`in${d}`]).length
    : 0;
  const absentCount = selectedStaff ? daysInMonth - presentCount : 0;
  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [{ data: [presentCount, absentCount] }],
  };

  return (
    <Container fluid className="staffpage-container py-4">
      <FaHome className="home-button" title="Home" onClick={() => navigate("/login")} />

      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <div className="top-table-wrapper">
            <div className="top-table-inner">
              <div className="table-responsive">
                <Table bordered hover className="table-custom text-center">
                  <thead>
                    <tr>
                      <th>Staff Name</th>
                      <th>Login</th>
                      <th>Start Break</th>
                      <th>End Break</th>
                      <th>Logout</th>
                      <th>Staff Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(st => {
                      const li = st[`in${D}`];
                      const sb = st[`startBreak${D}`];
                      const eb = st[`endBreak${D}`];
                      const lo = st[`out${D}`];
                      return (
                        <tr key={st.staffID}>
                          <td className="fw-bold clickable" onClick={() => handleNameClick(st)}>
                            {st.staffName}
                          </td>
                          <td>
                            {li || (
                              <Button size="sm" onClick={() => openActionModal(st, "in")}>
                                Login
                              </Button>
                            )}
                          </td>
                          <td>
                            {sb || (
                              <Button size="sm" onClick={() => openActionModal(st, "startBreak")}>
                                Start Break
                              </Button>
                            )}
                          </td>
                          <td>
                            {eb || (
                              <Button size="sm" className="btn-endbreak" onClick={() => openActionModal(st, "endBreak")}>
                                End Break
                              </Button>
                            )}
                          </td>
                          <td>
                            {lo || (
                              <Button size="sm" className="btn-logout" onClick={() => openActionModal(st, "out")}>
                                Logout
                              </Button>
                            )}
                          </td>
                          <td className="fw-bold clickable" onClick={() => handleNameClick(st)}>
                            {st.staffName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {selectedStaff && (
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <div className="bg-dark p-4 rounded shadow mb-4">
              <div className="header-container d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-primary2 mb-1">{selectedStaff.staffName}</h4>
                <div className="current-month-year">
                  <strong>Date:</strong> {today.toLocaleDateString()}
                </div>
              </div>

              <div className="hours-box text-center mb-3">
                <h5>Total Hours Worked</h5>
                <div className="hours-value">{hrs}h {mins}m</div>
              </div>

              <div className="pie-button-wrapper d-flex justify-content-center align-items-center">
  <div className="pie-container">
    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
  </div>
  <Button
    variant="outline-light"
    className="ms-4 rounded show-attendance-btn"
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
                      {daysArray.map(d => (
                        <tr key={d}>
                          <td className="fw-bold">{d}</td>
                          <td>{selectedStaff[`in${d}`] || "—"}</td>
                          <td>{selectedStaff[`out${d}`] || "—"}</td>
                          <td>{selectedStaff[`startBreak${d}`] || "—"}</td>
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

      {/* ID Modal */}
      <Modal show={showIDModal} onHide={() => setShowIDModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Staff ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Staff ID for {idModalStaff?.staffName}</Form.Label>
            <Form.Control value={idInput} onChange={e => setIdInput(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIDModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmID}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm your Staff ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Staff ID</Form.Label>
            <Form.Control value={inpStaffID} onChange={e => setInpStaffID(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" disabled={updateLoading} onClick={confirmAction}>
            {updateLoading ? "Saving..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default StaffLog;

// // File: src/pages/teacher/StaffLog.tsx

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

// import { FaHome } from "react-icons/fa";

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

//   // Handle clicking staff name
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

//   // Open action modal
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
//         <Spinner /> <span className="ms-2">Loading…</span>
//       </Container>
//     );
//   if (error)
//     return (
//       <Container className="d-flex vh-100 justify-content-center align-items-center">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );

//   // Calculate total hours & pie data
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
//       {/* Home button */}
//       <FaHome className="home-button" title="Home" onClick={() => navigate("/login")} />

//       {/* Staff List */}
//       <Row className="justify-content-center mb-4">
//         <Col xs={12} md={10} lg={8}>
//           <div className="bg-dark p-4 rounded shadow">
//             <h3 className="text-primary2 mb-3">Staff Log</h3>
//             <div className="table-responsive">
//               <Table bordered hover className="table-custom text-center">
//                 <thead>
//                   <tr>
//                     <th>Staff Name</th>
//                     <th>Login</th>
//                     <th>Start Break</th>
//                     <th>End Break</th>
//                     <th>Logout</th>
//                     <th>Staff Name</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {staffList.map(st => {
//                     const li = st[`in${D}`];
//                     const sb = st[`startBreak${D}`];
//                     const eb = st[`endBreak${D}`];
//                     const lo = st[`out${D}`];
//                     return (
//                       <tr key={st.staffID}>
//                         <td
//                           className="fw-bold clickable"
//                           onClick={() => handleNameClick(st)}
//                         >
//                           {st.staffName}
//                         </td>
//                         <td>
//                           {li || (
//                             <Button size="sm" onClick={() => openActionModal(st, "in")}>
//                               Login
//                             </Button>
//                           )}
//                         </td>
//                         <td>
//                           {sb || (
//                             <Button size="sm" onClick={() => openActionModal(st, "startBreak")}>
//                               Start Break
//                             </Button>
//                           )}
//                         </td>
//                         <td>
//                           {eb || (
//                             <Button
//                               size="sm"
//                               className="btn-endbreak"
//                               onClick={() => openActionModal(st, "endBreak")}
//                             >
//                               End Break
//                             </Button>
//                           )}
//                         </td>
//                         <td>
//                           {lo || (
//                             <Button
//                               size="sm"
//                               className="btn-logout"
//                               onClick={() => openActionModal(st, "out")}
//                             >
//                               Logout
//                             </Button>
//                           )}
//                         </td>
//                         <td
//                           className="fw-bold clickable"
//                           onClick={() => handleNameClick(st)}
//                         >
//                           {st.staffName}
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

//       {/* Detail Panel */}
//       {selectedStaff && (
//         <Row className="justify-content-center">
//           <Col xs={12} md={10} lg={8}>
//             <div className="bg-dark p-4 rounded shadow mb-4">
//               <div className="header-container d-flex justify-content-between align-items-center mb-3">
//                 <h4 className="text-primary2 mb-1">{selectedStaff.staffName}</h4>
//                 <div className="current-month-year">
//                   <strong>ID:</strong> {selectedStaff.staffID} | {today.toLocaleDateString()}
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
//                   className="ms-5 align-self-center rounded show-attendance-btn"
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
//           <Modal.Title>Confirm your Staff ID</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Enter Staff ID</Form.Label>
//             <Form.Control value={inpStaffID} onChange={e => setInpStaffID(e.target.value)} />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="danger" onClick={() => setShowActionModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" disabled={updateLoading} onClick={confirmAction}>
//             {updateLoading ? "Saving..." : "Confirm"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default StaffLog;

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

// import { FaHome } from "react-icons/fa";

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

//   // Open confirm‑action modal (enforce sequence)
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
//       {/* Home button */}
//       <FaHome
//         className="home-button"
//         title="Home"
//         onClick={() => navigate("/")}
//       />

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
//                           <Button
//                             size="sm"
//                             onClick={() => openActionModal(st, "in")}
//                           >
//                             Login
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {sb || (
//                           <Button
//                             size="sm"
//                             onClick={() => openActionModal(st, "startBreak")}
//                           >
//                             Start Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {eb || (
//                           <Button
//                             size="sm"
//                             className="btn-endbreak"
//                             onClick={() => openActionModal(st, "endBreak")}
//                           >
//                             End Break
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {lo || (
//                           <Button
//                             size="sm"
//                             className="btn-logout"
//                             onClick={() => openActionModal(st, "out")}
//                           >
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
//                     <strong>ID:</strong> {selectedStaff.staffID}
                    
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
//                   className="ms-5 align-self-center rounded show-attendance-btn"
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
