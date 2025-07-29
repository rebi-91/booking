
// import React, { useState, useEffect } from "react";
// import supabase from "../../supabase";
// import { useNavigate } from "react-router-dom";
// import "./AttendancePage.css"; // Import the custom CSS
// import { Container, Row, Col } from "react-bootstrap";

// function AttendancePage() {
//   const [userSchool, setUserSchool] = useState("");
//   // Instead of a single classTime, we now use a grouped value (e.g., "C1-C2")
//   const [classGroup, setClassGroup] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   // Each student now has independent booleans for primary and secondary checkboxes.
//   const [students, setStudents] = useState<
//     {
//       id: number;
//       name: string;
//       primaryChecked: boolean;
//       secondaryChecked: boolean;
//       request: boolean;
//     }[]
//   >([]);
//   const [day, setDay] = useState(new Date().getDate());
//   const [selectAll, setSelectAll] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);

//   const navigate = useNavigate();

//   const currentMonthDays = new Date(
//     new Date().getFullYear(),
//     new Date().getMonth() + 1,
//     0
//   ).getDate();

//   useEffect(() => {
//     checkUserSchool();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const checkUserSchool = async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data: profileData, error } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", user.id)
//           .single();

//         if (!error && profileData) {
//           setUserSchool(profileData?.school || "Unknown School");
//           if (profileData?.school) {
//             // Instead of fetching class names immediately, fetch all sections first
//             await fetchAllSections(profileData.school);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error checking user school:", error);
//     }
//   };

//   // Fetch all sections for the school
//   const fetchAllSections = async (school: string) => {
//     try {
//       const { data, error } = await supabase.from("student").select("section, school");
//       if (!error && data) {
//         // Filter sections based on school and remove duplicates
//         const filteredSections = data
//           .filter((item: any) => item.school === school || !item.school)
//           .map((item: any) => item.section);
//         setSections([...new Set(filteredSections)]);
//       }
//     } catch (error) {
//       console.error("Error fetching sections:", error);
//     }
//   };

//   // Fetch class names based on the selected section
//   const fetchClassNamesBySection = async (section: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", userSchool)
//         .eq("section", section);

//       if (!error && data) {
//         setClassNames([
//           ...new Set((data as any[]).map((item) => item.className)),
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching class names by section:", error);
//     }
//   };

//   const fetchStudents = async () => {
//     // Ensure all required fields are selected
//     if (!classGroup || !selectedClassName || !selectedSection) return;

//     try {
//       // Fetch student records including the request flag
//       const { data: studentData } = await supabase
//         .from("student")
//         .select("id, studentName, request")
//         .eq("school", userSchool)
//         .eq("className", selectedClassName)
//         .eq("section", selectedSection);

//       if (!studentData) return;

//       const ids = (studentData as any[]).map((item) => item.id);
//       // Derive the primary table from the group (the first part)
//       const primaryTable = classGroup.split("-")[0];

//       const { data: attendanceData } = await supabase
//         .from(primaryTable)
//         .select(`${day}, id`)
//         .in("id", ids);

//       const combinedData = (studentData as any[]).map((student) => {
//         const attendance = (attendanceData as any[]).find(
//           (a) => a.id === student.id
//         );
//         // Initialize both checkboxes with the same value from primary table
//         const isChecked = attendance ? attendance[day] === true : false;
//         return {
//           id: student.id,
//           name: student.studentName,
//           primaryChecked: isChecked,
//           secondaryChecked: isChecked,
//           request: student.request === true,
//         };
//       });

//       setStudents(combinedData.sort((a, b) => a.id - b.id));
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   const saveAttendance = async () => {
//     if (!classGroup) return;
//     try {
//       // Derive both tables from the group.
//       const [primaryTable, secondaryTable] = classGroup.split("-");
//       await Promise.all(
//         students.map(async (student) => {
//           // Update both tables concurrently with the respective checkbox values.
//           await Promise.all([
//             supabase
//               .from(primaryTable)
//               .update({ [day]: student.primaryChecked || null })
//               .eq("id", student.id),
//             supabase
//               .from(secondaryTable)
//               .update({ [day]: student.secondaryChecked || null })
//               .eq("id", student.id),
//           ]);
//         })
//       );
//       alert("Attendance saved successfully!");
//     } catch (error) {
//       console.error("Error saving attendance:", error);
//       alert("Failed to save attendance.");
//     }
//   };

//   // Container click toggles both checkboxes together.
//   const toggleStudentContainer = (id: number) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === id
//           ? {
//               ...student,
//               primaryChecked: !student.primaryChecked,
//               secondaryChecked: !student.secondaryChecked,
//             }
//           : student
//       )
//     );
//   };

//   // Toggle only the primary checkbox.
//   const togglePrimaryCheckbox = (id: number) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === id
//           ? { ...student, primaryChecked: !student.primaryChecked }
//           : student
//       )
//     );
//   };

//   // Toggle only the secondary checkbox.
//   const toggleSecondaryCheckbox = (id: number) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === id
//           ? { ...student, secondaryChecked: !student.secondaryChecked }
//           : student
//       )
//     );
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);
//     setStudents((prev) =>
//       prev.map((student) => ({
//         ...student,
//         primaryChecked: newSelectAll,
//         secondaryChecked: newSelectAll,
//       }))
//     );
//   };

//   const toggleContainerSize = () => {
//     setIsMinimized((prev) => !prev);
//   };

//   const handleGraduationCapClick = () => {
//     navigate("/teacherdashboard");
//   };

//   const handleMouseEnterGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.currentTarget as HTMLButtonElement;
//     target.style.transform = "scale(1.2)";
//   };

//   const handleMouseLeaveGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.currentTarget as HTMLButtonElement;
//     target.style.transform = "scale(1)";
//   };

//   return (
//     <div className="attendance-page d-flex flex-column align-items-center">
//       <h1>Student Attendance</h1>
//       {userSchool && <h2>{userSchool}</h2>}

//       <div className="button-row d-flex justify-content-center gap-2 my-3">
//         <button
//           className="teacher-icon-button3 me-2"
//           onClick={() => navigate("/")}
//           title="Go to Home Page"
//         >
//           🏠
//         </button>
//         <button
//           className="teacher-icon-button2"
//           onClick={() => navigate("/my-attendance")}
//           title="Go to My Attendance Page"
//         >
//           ⏰
//         </button>
//       </div>

//       {/* Form Container */}
//       <div
//         className={`card w-100 mt-4 ${isMinimized ? "p-4" : "p-4"}`}
//         style={{
//           maxWidth: "600px",
//           backgroundColor: "#1e1e1e",
//           borderRadius: "12px",
//           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
//           transition: "all 0.3s ease",
//         }}
//       >
//         <div className="position-relative">
//           {!isMinimized && (
//             <div className="row g-3">
//               {/* Class Group Dropdown */}
//               <div className="col-md-6">
//                 <select
//                   id="classGroup"
//                   className="form-select custom-select-bright"
//                   value={classGroup}
//                   onChange={(e) => {
//                     setClassGroup(e.target.value);
//                     setSelectedClassName("");
//                     // Reset class names and students when group changes
//                     setClassNames([]);
//                     setStudents([]);
//                   }}
//                 >
//                   <option value="">Select Class Time Group</option>
//                   {["C1-C2", "C3-C4", "C5-C6"].map((group) => (
//                     <option key={group} value={group}>
//                       {group}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Section Dropdown */}
//               <div className="col-md-6">
//                 <select
//                   id="section"
//                   className="form-select custom-select-bright"
//                   value={selectedSection}
//                   onChange={(e) => {
//                     const section = e.target.value;
//                     setSelectedSection(section);
//                     setSelectedClassName("");
//                     setStudents([]);
//                     // Fetch class names filtered by the selected section
//                     fetchClassNamesBySection(section);
//                   }}
//                 >
//                   <option value="">Select Section</option>
//                   {sections.map((section) => (
//                     <option key={section} value={section}>
//                       {section}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Class Name Dropdown */}
//               <div className="col-md-6">
//                 <select
//                   id="className"
//                   className="form-select custom-select-bright"
//                   value={selectedClassName}
//                   onChange={(e) => {
//                     setSelectedClassName(e.target.value);
//                     setStudents([]);
//                   }}
//                 >
//                   <option value="">Select Class Name</option>
//                   {classNames.map((name) => (
//                     <option key={name} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Day of the Month */}
//               <div className="col-md-6">
//                 <select
//                   id="day"
//                   className="form-select custom-select-bright"
//                   value={day}
//                   onChange={(e) => setDay(parseInt(e.target.value))}
//                 >
//                   {Array.from({ length: currentMonthDays }, (_, i) => i + 1).map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Fetch Students Button */}
//               <div className="col-12">
//                 <button className="btn btn-success w-100" onClick={fetchStudents}>
//                   Fetch Students
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Chevron Button */}
//           <button
//             onClick={toggleContainerSize}
//             className="chevron-btn"
//             aria-label={isMinimized ? "Expand Form" : "Minimize Form"}
//           >
//             {isMinimized ? "\u25BC" : "\u25B2"}
//           </button>
//         </div>
//       </div>

//       {/* Student List Container */}
//       <div
//         className="card w-100 mt-4"
//         style={{
//           maxWidth: "600px",
//           backgroundColor: "#1e1e1e",
//           borderRadius: "12px",
//           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
//           maxHeight: isMinimized ? "500px" : "245px",
//           overflowY: "auto",
//           transition: "max-height 0.3s ease",
//         }}
//       >
//         <div className="card-body">
//           {/* Select All Checkbox */}
//           <div className="form-check mb-3">
//             <input
//               className="form-check-input custom-select-bright"
//               type="checkbox"
//               checked={selectAll}
//               onChange={handleSelectAll}
//               id="selectAll"
//               style={{ backgroundColor: "#2a2a2a", color: "#ffffff" }}
//             />
//             <label className="form-check-label text-white" htmlFor="selectAll">
//               Select All
//             </label>
//           </div>

//           {/* List of Students */}
//           {students.map((student) => {
//             // Determine container border style – blue border if at least one checkbox is ticked.
//             const containerBorder = student.primaryChecked || student.secondaryChecked
//               ? "2px solid blue"
//               : "1px solid #444";
//             return (
//               <div
//                 key={student.id}
//                 className={`student-container ${isMinimized ? "student-container-minimized" : "student-container-maximized"}`}
//                 // Container click toggles both checkboxes together.
//                 onClick={() => toggleStudentContainer(student.id)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "5px 10px",
//                   marginBottom: "5px",
//                   border: containerBorder,
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 <div className="d-flex align-items-center">
//                   {/* Two checkboxes side by side */}
//                   <input
//                     type="checkbox"
//                     checked={student.primaryChecked}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       togglePrimaryCheckbox(student.id);
//                     }}
//                     className="custom-checkbox me-1"
//                     style={
//                       student.primaryChecked
//                         ? { outline: "2px solid blue", borderRadius: "3px" }
//                         : {}
//                     }
//                   />
//                   <input
//                     type="checkbox"
//                     checked={student.secondaryChecked}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       toggleSecondaryCheckbox(student.id);
//                     }}
//                     className="custom-checkbox me-2"
//                     style={
//                       student.secondaryChecked
//                         ? { outline: "2px solid blue", borderRadius: "3px" }
//                         : {}
//                     }
//                   />
//                   <span>{student.name}</span>
//                 </div>
//                 {/* If student.request is true, show the call logo icon */}
//                 {student.request && (
//                   <img
//                     src="/callLogo.png"
//                     alt="Call Logo"
//                     style={{ width: "24px", backgroundColor: 'red', height: "24px" }}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="footer">
//         <Container>
//           <Row>
//             <Col className="text-center">
//               &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
//             </Col>
//           </Row>
//         </Container>
//       </footer>

//       {/* Save Attendance Button */}
//       <button
//         onClick={saveAttendance}
//         className="btn btn-primary save-attendance-btn"
//       >
//         Save Attendance
//       </button>
//     </div>
//   );
// }

// export default AttendancePage;
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

function StaffAttendance() {
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

export default StaffAttendance;

// import React, { useState, useEffect } from "react";
// import supabase from "../../supabase";
// import { useNavigate } from "react-router-dom";
// import './AttendancePage.css'; // Import the custom CSS
// import {
//   Container,
//   Row,
//   Col,
// } from 'react-bootstrap';

// function AttendancePage() {
//   const [userSchool, setUserSchool] = useState("");
//   const [classTime, setClassTime] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [students, setStudents] = useState<{id:number;name:string;checked:boolean}[]>([]);
//   const [day, setDay] = useState(new Date().getDate());
//   const [selectAll, setSelectAll] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);

//   const navigate = useNavigate();

//   const currentMonthDays = new Date(
//     new Date().getFullYear(),
//     new Date().getMonth() + 1,
//     0
//   ).getDate();

//   useEffect(() => {
//     checkUserSchool();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const checkUserSchool = async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data: profileData, error } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", user.id)
//           .single();

//         if (!error && profileData) {
//           setUserSchool(profileData?.school || "Unknown School");
//           if (profileData?.school) await fetchClassNames(profileData.school);
//         }
//       }
//     } catch (error) {
//       console.error("Error checking user school:", error);
//     }
//   };

//   const fetchClassNames = async (school: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school);

//       if (!error && data) {
//         setClassNames([...new Set((data as any[]).map((item) => item.className))]);
//       }
//     } catch (error) {
//       console.error("Error fetching class names:", error);
//     }
//   };

//   const fetchSections = async (className: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("school", userSchool)
//         .eq("className", className);

//       if (!error && data) {
//         setSections([...new Set((data as any[]).map((item) => item.section))]);
//       }
//     } catch (error) {
//       console.error("Error fetching sections:", error);
//     }
//   };

//   const fetchStudents = async () => {
//     if (!classTime || !selectedClassName || !selectedSection) return;

//     try {
//       const { data: studentData } = await supabase
//         .from("student")
//         .select("id, studentName")
//         .eq("school", userSchool)
//         .eq("className", selectedClassName)
//         .eq("section", selectedSection);

//       if (!studentData) return;

//       const ids = (studentData as any[]).map((item) => item.id);
//       const { data: attendanceData } = await supabase
//         .from(classTime)
//         .select(`${day}, id`)
//         .in("id", ids);

//       const combinedData = (studentData as any[]).map((student) => {
//         const attendance = (attendanceData as any[]).find((a) => a.id === student.id);
//         return {
//           id: student.id,
//           name: student.studentName,
//           checked: attendance ? attendance[day] === true : false,
//         };
//       });

//       setStudents(combinedData.sort((a, b) => a.id - b.id));
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   const saveAttendance = async () => {
//     try {
//       await Promise.all(
//         students.map(async (student) => {
//           const { error } = await supabase
//             .from(classTime)
//             .update({ [day]: student.checked || null })
//             .eq("id", student.id);

//           if (error) throw error;
//         })
//       );
//       alert("Attendance saved successfully!");
//     } catch (error) {
//       console.error("Error saving attendance:", error);
//       alert("Failed to save attendance.");
//     }
//   };

//   const toggleStudentCheckbox = (id: number) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === id ? { ...student, checked: !student.checked } : student
//       )
//     );
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);
//     setStudents((prev) =>
//       prev.map((student) => ({ ...student, checked: newSelectAll }))
//     );
//   };

//   const toggleContainerSize = () => {
//     setIsMinimized((prev) => !prev);
//   };

//   const handleGraduationCapClick = () => {
//     navigate("/teacherdashboard");
//   };

//   const handleMouseEnterGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.currentTarget as HTMLButtonElement;
//     target.style.transform = "scale(1.2)";
//   };

//   const handleMouseLeaveGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const target = e.currentTarget as HTMLButtonElement;
//     target.style.transform = "scale(1)";
//   };

//   return (
//     <div className="attendance-page d-flex flex-column align-items-center">
//       <h1>Student Attendance</h1>
//       {userSchool && <h2>{userSchool}</h2>}

//       <div className="button-row d-flex justify-content-center gap-2 my-3">
//                 {/* <button
//                   className="teacher-icon-button me-2"
//                   onClick={() => navigate("/teacherdashboard")}
//                   title="Go to Teacher Dashboard"
//                 >
//                   🎓
//                 </button> */}
//                 <button
//                   className="teacher-icon-button3 me-2 "
//                   onClick={() => navigate("/")}
//                   title="Go to Home Page"
//                 >
//                   🏠
//                 </button>
//                 <button
//                   className="teacher-icon-button2 "
//                   onClick={() => navigate("/my-attendance")}
//                   title="Go to My Attendance Page"
//                 >
//                   ⏰ 
//                 </button>
//                 </div>
              
//       {/* Form Container */}
//       <div
//         className={`card w-100 mt-4 ${isMinimized ? 'p-4' : 'p-4'}`}
//         style={{
//           maxWidth: '600px',
//           backgroundColor: '#1e1e1e',
//           borderRadius: '12px',
//           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
//           transition: 'all 0.3s ease',
//         }}
//       >
//         <div className="position-relative">
//           {!isMinimized && (
//             <div className="row g-3">
//               {/* Class Time */}
//               <div className="col-md-6">
//                 <select
//                   id="classTime"
//                   className="form-select custom-select-bright"
//                   value={classTime}
//                   onChange={(e) => {
//                     setClassTime(e.target.value);
//                     setSelectedClassName("");
//                     setSections([]);
//                     setStudents([]);
//                   }}
//                 >
//                   <option value="">Select Class Time</option>
//                   {["C1", "C2", "C3", "C4", "C5", "C6"].map((time) => (
//                     <option key={time} value={time}>
//                       {time}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Class Name */}
//               <div className="col-md-5">
//                 <select
//                   id="className"
//                   className="form-select custom-select-bright"
//                   value={selectedClassName}
//                   onChange={(e) => {
//                     setSelectedClassName(e.target.value);
//                     fetchSections(e.target.value);
//                   }}
//                 >
//                   <option value="">Select Class Name</option>
//                   {classNames.map((name) => (
//                     <option key={name} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Section */}
//               <div className="col-md-6">
//                 <select
//                   id="section"
//                   className="form-select custom-select-bright"
//                   value={selectedSection}
//                   onChange={(e) => setSelectedSection(e.target.value)}
//                 >
//                   <option value="">Select Section</option>
//                   {sections.map((section) => (
//                     <option key={section} value={section}>
//                       {section}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Day of the Month */}
//               <div className="col-md-6">
//                 <select
//                   id="day"
//                   className="form-select custom-select-bright"
//                   value={day}
//                   onChange={(e) => setDay(parseInt(e.target.value))}
//                 >
//                   {Array.from({ length: currentMonthDays }, (_, i) => i + 1).map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Fetch Students Button */}
//               <div className="col-12">
//                 <button className="btn btn-success w-100" onClick={fetchStudents}>
//                   Fetch Students
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Chevron Button */}
//           <button
//             onClick={toggleContainerSize}
//             className="chevron-btn"
//             aria-label={isMinimized ? "Expand Form" : "Minimize Form"}
//           >
//             {isMinimized ? "\u25BC" : "\u25B2"}
//           </button>
//         </div>
//       </div>

//       {/* Student List Container */}
//       <div
//         className="card w-100 mt-4"
//         style={{
//           maxWidth: '600px',
//           backgroundColor: '#1e1e1e',
//           borderRadius: '12px',
//           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
//           maxHeight: isMinimized ? '500px' : '245px',
//           overflowY: 'auto',
//           transition: 'max-height 0.3s ease',
//         }}
//       >
//         <div className="card-body">
//           {/* Select All Checkbox */}
//           <div className="form-check mb-3">
//             <input
//               className="form-check-input custom-select-bright"
//               type="checkbox"
//               checked={selectAll}
//               onChange={handleSelectAll}
//               id="selectAll"
//               style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }} // Optional inline styles
//             />
//             <label className="form-check-label text-white" htmlFor="selectAll">
//               Select All
//             </label>
//           </div>

//                   {/* List of Students */}
//           {students.map((student) => (
//             <div
//               key={student.id}
//               className={`student-container ${student.checked ? 'checked' : ''} ${isMinimized ? 'student-container-minimized' : 'student-container-maximized'}`}
//               onClick={() => toggleStudentCheckbox(student.id)}
//             >
//               <div className="d-flex align-items-center w-100">
//                 <input
//                   type="checkbox"
//                   checked={student.checked}
//                   onChange={() => toggleStudentCheckbox(student.id)}
//                   className="custom-checkbox me-2"
//                   onClick={(e) => e.stopPropagation()} // Prevent parent onClick
//                 />
//                 <span className="ms-auto">{student.name}</span>
//               </div>
//             </div>
//           ))}

//         </div>
//       </div>
//       {/* Footer */}
//       <footer className="footer">
//         <Container>
//           <Row>
//             <Col className="text-center">
//               &copy; {new Date().getFullYear()} SchoolMood. All rights reserved.
//             </Col>
//           </Row>
//         </Container>
//       </footer>

//       {/* Save Attendance Button */}
//       <button
//         onClick={saveAttendance}
//         className="btn btn-primary save-attendance-btn"
//       >
//         Save Attendance
//       </button>
//     </div>
//   );
// }

// export default AttendancePage;
