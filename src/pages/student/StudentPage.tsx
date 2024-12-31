
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { 
//   Button, 
//   Container, 
//   Row, 
//   Col, 
//   Table, 
//   Spinner, 
//   Alert, 
//   Form, 
//   Modal 
// } from 'react-bootstrap'; // Importing react-bootstrap components
// import './StudentPage.css'; // Import custom CSS

// // Register necessary Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// function StudentPage() {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   const [studentName, setStudentName] = useState("");
//   const [studentID, setStudentID] = useState("");
//   const [school, setSchool] = useState("");
//   const [classInfo, setClassInfo] = useState<any[]>([]); 
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;
//   const today = new Date();
//   const currentMonth = today.getMonth(); 
//   const currentYear = today.getFullYear();
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ] as const;
//   const currentMonthName = monthNames[currentMonth];
//   const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate(); 
//   const days = Array.from({ length: numberOfDays }, (_, i) => i + 1);

//   const [presentCount, setPresentCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);
//   const [attendanceData, setAttendanceData] = useState({
//     labels: ["Present", "Absent"],
//     datasets: [
//       {
//         label: "Attendance",
//         data: [0, 0],
//         backgroundColor: ["#007bff", "#ff4d4d"],
//         hoverBackgroundColor: ["#0056b3", "#cc0000"],
//       },
//     ],
//   });

//   const [isHoveredGraduation, setIsHoveredGraduation] = useState<boolean>(false);
//   const [isActiveGraduation, setIsActiveGraduation] = useState<boolean>(false);

//   // State for Modal and Selected Day
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [selectedDay, setSelectedDay] = useState<number | null>(null);

//   useEffect(() => {
//     fetchStudentData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchStudentData = async () => {
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user:", userError?.message);
//         setError("Failed to retrieve user information.");
//         navigate("/login");
//         return;
//       }

//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("password, school")
//         .eq("id", user.id)
//         .single();

//       if (profileError || !profileData) {
//         console.error("Error fetching profile:", profileError?.message);
//         setError("Failed to retrieve profile information.");
//         navigate("/login");
//         return;
//       }

//       const fetchedStudentID = profileData.password;
//       const fetchedSchool = profileData.school;

//       if (!fetchedStudentID || !fetchedSchool) {
//         setError("Incomplete profile information. Please contact support.");
//         return;
//       }

//       setStudentID(fetchedStudentID);
//       setSchool(fetchedSchool);

//       let fetchedStudentName = "";
//       const fetchedClassInfo: any[] = [];
//       let fetchedClassName = "";
//       let fetchedSection = "";

//       for (const classTime of classTimes) {
//         const { data, error } = await supabase
//           .from(classTime)
//           .select(`studentName, className, section, ${days.join(", ")}`)
//           .eq("studentID", fetchedStudentID)
//           .single();

//         if (error) {
//           console.error(`Error fetching data from ${classTime}:`, error.message);
//           continue;
//         }

//         if (data && typeof data === "object") {
//           const row = data as any;
//           fetchedStudentName = row.studentName;
//           const attendance = days.map((day) => row[day] === true);

//           fetchedClassInfo.push({
//             classTime,
//             attendance,
//           });

//           if (!fetchedClassName && !fetchedSection) {
//             fetchedClassName = row.className;
//             fetchedSection = row.section;
//           }
//         }
//       }

//       if (fetchedClassInfo.length === 0) {
//         setError("No attendance records found for this student.");
//       } else {
//         setStudentName(fetchedStudentName);
//         setClassInfo(fetchedClassInfo);
//         setClassName(fetchedClassName);
//         setSection(fetchedSection);
//         calculateAttendance(fetchedClassInfo);
//       }
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       setError("An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAttendance = (classInfoArray: any[]) => {
//     let present = 0;
//     let absent = 0;

//     classInfoArray.forEach((info) => {
//       const relevantAttendance = info.attendance.slice(0, today.getDate());
//       relevantAttendance.forEach((attended: boolean) => {
//         if (attended === true) {
//           absent += 1;
//         } else if (attended === false) {
//           present += 1;
//         }
//       });
//     });

//     setPresentCount(present);
//     setAbsentCount(absent);

//     setAttendanceData({
//       labels: ["Present", "Absent"],
//       datasets: [
//         {
//           label: "Attendance",
//           data: [present, absent],
//           backgroundColor: ["#007bff", "#ff4d4d"],
//           hoverBackgroundColor: ["#0056b3", "#cc0000"],
//         },
//       ],
//     });
//   };

//   const renderAttendanceCell = (attendance: boolean | undefined) => {
//     if (attendance === true) {
//       return (
//         <td className="text-center align-middle attendance-cell">
//           <Form.Check 
//             type="checkbox" 
//             checked={false} 
//             disabled 
//             className="pointer-events-none"
//           />
//           <span className="attendance-cross" title="Absent">
//             ❌
//           </span>
//         </td>
//       );
//     } else if (attendance === false) {
//       return (
//         <td className="text-center align-middle">
//           <Form.Check 
//             type="checkbox" 
//             checked={false} 
//             disabled 
//             className="pointer-events-none"
//           />
//         </td>
//       );
//     } else {
//       return (
//         <td className="text-center align-middle">
//           <Form.Check 
//             type="checkbox" 
//             checked={false} 
//             disabled 
//             className="pointer-events-none"
//           />
//         </td>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
//         <Spinner animation="border" variant="primary" role="status" />
//         <p className="mt-3">Loading...</p>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="py-1">
//       <Row className="justify-content-center">
//         <Col xs={12} md={12} lg={12}>
//         <div className="bg-white p-4 rounded shadow">
//         {/* Student Information and Graduation Cap Button */}
//         <Row className="align-items-center">
//           <Col xs={12} md="auto">
//             <div>
//               <h2 className="text-primary">
//                 {studentName} ({studentID})
//               </h2>
//               <p className="mb-1">
//                 <strong>School:</strong> {school}
//               </p>
//               <p className="mb-0">
//                 <strong>Class:</strong> {className} | <strong>Section:</strong> {section}
//               </p>
//             </div>
//           </Col>
//           <Col xs="auto" className="ms-auto">
//           {/* Graduation Cap Button */}
//             {/* Graduation Cap Button */}
//       <Button
//         variant={isActiveGraduation ? "dark" : "secondary"}
//         className="position-relative z-index-200  end-0 translate-middle-x mt-3 rounded-circle shadow"
//         style={{ width: "55px", height: "55px", fontSize: "28px" }}
//         onClick={handleGraduationCapClick}
//         onMouseEnter={() => setIsHoveredGraduation(true)}
//         onMouseLeave={() => setIsHoveredGraduation(false)}
//         onMouseDown={() => setIsActiveGraduation(true)}
//         onMouseUp={() => setIsActiveGraduation(false)}
//         aria-label="Navigate to Grade Page"
//       >
//         🎓
//       </Button>
//       </Col>
//       </Row>

//             {/* Attendance Pie Chart */}
//             <Row className="mb-4">
//               <Col xs={12} className="d-flex justify-content-center">
//                 <div className="position-relative" style={{ width: "150px", height: "150px" }}>
//                   <Pie
//                     data={attendanceData}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           display: false,
//                         },
//                         tooltip: {
//                           enabled: true,
//                         },
//                       },
//                       animation: {
//                         animateRotate: true,
//                         animateScale: true,
//                       },
//                     }}
//                   />
//                   <div
//                     className="position-absolute top-50 start-50 translate-middle text-center"
//                     style={{ pointerEvents: "none" }}
//                   >
//                     <span className="h5 font-weight-bold">
//                       {presentCount + absentCount > 0
//                         ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(2)
//                         : 0}
//                       %
//                     </span>
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* Legend */}
//             <Row className="mb-4">
//               <Col xs={12} className="d-flex justify-content-center">
//                 <div className="d-flex align-items-center">
//                   {/* Present Line */}
//                   <div className="me-2 legend-line" style={{ backgroundColor: '#007bff' }}></div>
//                   <span className="me-4">Present</span>
//                   {/* Absent Line */}
//                   <div className="me-2 legend-line" style={{ backgroundColor: '#ff4d4d' }}></div>
//                   <span>Absent</span>
//                 </div>
//               </Col>
//             </Row>

//             {/* Dynamic Header with Calendar Emoji */}
//             <Row className="mb-3">
//               <Col xs={12} className="d-flex justify-content-center align-items-center">
//                 <h4 className="text-center me-2">
//                   {selectedDay
//                     ? `${selectedDay} ${currentMonthName} ${currentYear}`
//                     : `${currentMonthName} ${currentYear}`}
//                 </h4>
//                 <Button
//                   variant="light"
//                   onClick={() => setShowModal(true)}
//                   aria-label="Open Calendar Modal"
//                   className="border-0"
//                   style={{ fontSize: '24px' }}
//                 >
//                   📅
//                 </Button>
//               </Col>
//             </Row>

//             {/* Modal for Selecting Day */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//               <Modal.Header closeButton className="rounded-top">
//                 <Modal.Title>Select a Day</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Row>
//                   {days.map((day) => (
//                     <Col xs={3} className="mb-2" key={day}>
//                       <Button
//                         variant={selectedDay === day ? "primary" : "outline-primary"}
//                         onClick={() => {
//                           setSelectedDay(day);
//                           setShowModal(false);
//                         }}
//                         className="w-100"
//                       >
//                         {day}
//                       </Button>
//                     </Col>
//                   ))}
//                 </Row>
//               </Modal.Body>
//             </Modal>

//             {/* Attendance Table */}
//             <div className="table-container">
//               <Table bordered hover className="text-center w-100">
//                 <thead className="table-primary">
//                   <tr>
//                     <th>Day</th>
//                     {classInfo.map((info, index) => (
//                       <th key={index}>{info.classTime}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(selectedDay ? [selectedDay] : days).map((day) => (
//                     <tr key={day}>
//                       <td className="align-middle"><strong>{day}</strong></td>
//                       {classInfo.map((info, index) => (
//                         <React.Fragment key={index}>
//                           {renderAttendanceCell(info.attendance[day - 1])}
//                         </React.Fragment>
//                       ))}
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

//   function handleGraduationCapClick() {
//     navigate("/grade");
//   }
// }

// export default StudentPage;
// src/pages/student/StudentPage.tsx

// File: StudentPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  Button, 
  Container, 
  Row, 
  Col, 
  Table, 
  Spinner, 
  Alert, 
  Form, 
  Modal 
} from 'react-bootstrap'; // Importing react-bootstrap components
import { FaCoins } from 'react-icons/fa'; // Import the FaCoins icon
import './StudentPage.css'; // Import custom CSS

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Interfaces (Define if using TypeScript)
interface Profile {
  school: string;
  password: string;
}

interface Student {
  className: string;
  section: string;
}

interface ClassData {
  class: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  sub4?: string;
  sub5?: string;
  sub6?: string;
  sub7?: string;
  sub8?: string;
  sub9?: string;
  sub10?: string;
  sub11?: string;
  sub12?: string;
  sub13?: string;
  sub14?: string;
  sub15?: string;
}

interface GradeData {
  subject: string;
  classAverage: string;
  average: string;
  examMarks: { [key: string]: number | string };
  classExamMarks?: { [key: string]: number };
}

interface ExamType {
  examType: string;
  columnNumber: number;
  term: string;
  weight: number;
}

function StudentPage() {
  const navigate = useNavigate();
  const { session } = useSession();

  // State Hooks
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [school, setSchool] = useState("");
  const [classInfo, setClassInfo] = useState<any[]>([]); 
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"] as const;
  const today = new Date();
  const currentMonth = today.getMonth(); 
  const currentYear = today.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;
  const currentMonthName = monthNames[currentMonth];
  const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate(); 
  const days = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [attendanceData, setAttendanceData] = useState({
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [0, 0],
        backgroundColor: ["#007bff", "#ff4d4d"],
        hoverBackgroundColor: ["#0056b3", "#cc0000"],
      },
    ],
  });

  const [isHoveredGraduation, setIsHoveredGraduation] = useState<boolean>(false);
  const [isActiveGraduation, setIsActiveGraduation] = useState<boolean>(false);

  // State for Modal and Selected Day
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudentData = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        setError("Failed to retrieve user information.");
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("password, school")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Error fetching profile:", profileError?.message);
        setError("Failed to retrieve profile information.");
        navigate("/login");
        return;
      }

      const fetchedStudentID = profileData.password;
      const fetchedSchool = profileData.school;

      if (!fetchedStudentID || !fetchedSchool) {
        setError("Incomplete profile information. Please contact support.");
        return;
      }

      setStudentID(fetchedStudentID);
      setSchool(fetchedSchool);

      let fetchedStudentName = "";
      const fetchedClassInfo: any[] = [];
      let fetchedClassName = "";
      let fetchedSection = "";

      for (const classTime of classTimes) {
        const { data, error } = await supabase
          .from(classTime)
          .select(`studentName, className, section, ${days.join(", ")}`)
          .eq("studentID", fetchedStudentID)
          .single();

        if (error) {
          console.error(`Error fetching data from ${classTime}:`, error.message);
          continue;
        }

        if (data && typeof data === "object") {
          const row = data as any;
          fetchedStudentName = row.studentName;
          const attendance = days.map((day) => row[day] === true);

          fetchedClassInfo.push({
            classTime,
            attendance,
          });

          if (!fetchedClassName && !fetchedSection) {
            fetchedClassName = row.className;
            fetchedSection = row.section;
          }
        }
      }

      if (fetchedClassInfo.length === 0) {
        setError("No attendance records found for this student.");
      } else {
        setStudentName(fetchedStudentName);
        setClassInfo(fetchedClassInfo);
        setClassName(fetchedClassName);
        setSection(fetchedSection);
        calculateAttendance(fetchedClassInfo);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendance = (classInfoArray: any[]) => {
    let present = 0;
    let absent = 0;

    classInfoArray.forEach((info) => {
      const relevantAttendance = info.attendance.slice(0, today.getDate());
      relevantAttendance.forEach((attended: boolean) => {
        if (attended === true) {
          absent += 1;
        } else if (attended === false) {
          present += 1;
        }
      });
    });

    setPresentCount(present);
    setAbsentCount(absent);

    setAttendanceData({
      labels: ["Present", "Absent"],
      datasets: [
        {
          label: "Attendance",
          data: [present, absent],
          backgroundColor: ["#007bff", "#ff4d4d"],
          hoverBackgroundColor: ["#0056b3", "#cc0000"],
        },
      ],
    });
  };

  const renderAttendanceCell = (attendance: boolean | undefined) => {
    if (attendance === true) {
      return (
        <td className="text-center align-middle attendance-cell">
          <Form.Check 
            type="checkbox" 
            checked={false} 
            disabled 
            className="pointer-events-none"
          />
          <span className="attendance-cross" title="Absent">
            ❌
          </span>
        </td>
      );
    } else if (attendance === false) {
      return (
        <td className="text-center align-middle">
          <Form.Check 
            type="checkbox" 
            checked={false} 
            disabled 
            className="pointer-events-none"
          />
        </td>
      );
    } else {
      return (
        <td className="text-center align-middle">
          <Form.Check 
            type="checkbox" 
            checked={false} 
            disabled 
            className="pointer-events-none"
          />
        </td>
      );
    }
  };

  // Event Handlers declared before the return statement
  // Function to handle Graduation Cap button click
  const handleGraduationCapClick = () => {
    navigate("/grade");
  };

  // Function to handle Gold Coin button click
  const handleGoldCoinClick = () => {
    navigate("/student-fee");
  };

  // Function to handle HomePage button click
  const handlehomePageClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-1">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={12}>
          <div className="bg-white p-4 rounded shadow">
            {/* Student Information and Buttons */}
            <Row className="align-items-center">
              <Col xs={12} md="auto">
                <div>
                  <h2 className="text-primary">
                    {studentName} ({studentID})
                  </h2>
                  <p className="mb-1">
                    <strong>School:</strong> {school}
                  </p>
                  <p className="mb-0">
                    <strong>Class:</strong> {className} | <strong>Section:</strong> {section}
                  </p>
                </div>
              </Col>
              <Col xs="auto" className="ms-auto d-flex flex-column align-items-center">
                {/* Graduation Cap Button */}
                <Button
                  variant={isActiveGraduation ? "dark" : "secondary"}
                  className="position-relative z-index-200 end-0 translate-middle-x mt-3 rounded-circle shadow mb-3"
                  style={{ width: "55px", height: "55px", fontSize: "28px" }}
                  onClick={handleGraduationCapClick}
                  onMouseEnter={() => setIsHoveredGraduation(true)}
                  onMouseLeave={() => setIsHoveredGraduation(false)}
                  onMouseDown={() => setIsActiveGraduation(true)}
                  onMouseUp={() => setIsActiveGraduation(false)}
                  aria-label="Navigate to Grade Page"
                >
                  🎓
                </Button>

                {/* Gold Coin Button */}
                <button
                  className="coin-button position-relative z-index-200 end-0 translate-middle-x mt-1 rounded-circle shadow mb-3"
                  onClick={handleGoldCoinClick}
                  aria-label="Navigate to Student Fee Page"
                >
                  <FaCoins className="coin-icon" />
                </button>
                {/* HomePage Button */}
                <button
                  className="coin-button2 position-relative z-index-200 end-0 translate-middle-x mt-1 rounded-circle shadow mb-3"
                  onClick={handlehomePageClick}
                  aria-label="Navigate to Home Page"
                >
                  👤
                </button>
              </Col>
            </Row>

            {/* Attendance Pie Chart */}
            <Row className="mb-4">
              <Col xs={12} className="d-flex justify-content-center">
                <div className="position-relative" style={{ width: "150px", height: "150px" }}>
                  <Pie
                    data={attendanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          enabled: true,
                        },
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                      },
                    }}
                  />
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-center"
                    style={{ pointerEvents: "none" }}
                  >
                    <span className="h5 font-weight-bold">
                      {presentCount + absentCount > 0
                        ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(2)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Legend */}
            <Row className="mb-4">
              <Col xs={12} className="d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  {/* Present Line */}
                  <div className="me-2 legend-line" style={{ backgroundColor: '#007bff' }}></div>
                  <span className="me-4">Present</span>
                  {/* Absent Line */}
                  <div className="me-2 legend-line" style={{ backgroundColor: '#ff4d4d' }}></div>
                  <span>Absent</span>
                </div>
              </Col>
            </Row>

            {/* Dynamic Header with Calendar Emoji */}
            <Row className="mb-3">
              <Col xs={12} className="d-flex justify-content-center align-items-center">
                <h4 className="text-center me-2">
                  {selectedDay
                    ? `${selectedDay} ${currentMonthName} ${currentYear}`
                    : `${currentMonthName} ${currentYear}`}
                </h4>
                <Button
                  variant="light"
                  onClick={() => setShowModal(true)}
                  aria-label="Open Calendar Modal"
                  className="border-0"
                  style={{ fontSize: '24px' }}
                >
                  📅
                </Button>
              </Col>
            </Row>

            {/* Modal for Selecting Day */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton className="rounded-top">
                <Modal.Title>Select a Day</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  {days.map((day) => (
                    <Col xs={3} className="mb-2" key={day}>
                      <Button
                        variant={selectedDay === day ? "primary" : "outline-primary"}
                        onClick={() => {
                          setSelectedDay(day);
                          setShowModal(false);
                        }}
                        className="w-100"
                      >
                        {day}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Modal.Body>
            </Modal>

            {/* Attendance Table */}
            <div className="table-container">
              <Table bordered hover className="text-center w-100">
                <thead>
                  <tr>
                    <th className="th-custom">Day</th>
                    {classInfo.map((info, index) => (
                      <th key={index} className="th-custom">
                        {info.classTime}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(selectedDay ? [selectedDay] : days).map((day) => (
                    <tr key={day}>
                      <td className="align-middle"><strong>{day}</strong></td>
                      {classInfo.map((info, index) => (
                        <React.Fragment key={index}>
                          {renderAttendanceCell(info.attendance[day - 1])}
                        </React.Fragment>
                      ))}
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

export default StudentPage;
