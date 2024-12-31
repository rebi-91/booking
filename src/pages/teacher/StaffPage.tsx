// // File: StaffPage.tsx

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

//         // build morning array
//         let tempMorning: (boolean | null)[] = [];
//         let tempEvening: (boolean | null)[] = [];

//         for (let day = 1; day <= numberOfDays; day++) {
//           // column name is day => "1", "2", etc => teacherRow["1"]
//           const dayVal = teacherRow[`${day}`]; 
//           // evening => e1, e2 => teacherRow[`e1`]
//           const eveningVal = teacherRow[`e${day}`];
//           // if dayVal===true => present, if null => absent
//           tempMorning.push(dayVal === true ? true : null);
//           // if eveningVal===true => present, else absent
//           tempEvening.push(eveningVal === true ? true : null);
//         }

//         setMorningAttendance(tempMorning);
//         setEveningAttendance(tempEvening);

//       } catch (err) {
//         console.error("Unexpected error:", err);
//         setError("An unexpected error occurred.");
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
//         backgroundColor: ["#007bff", "#ff4d4d"],
//         hoverBackgroundColor: ["#0056b3", "#cc0000"],
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
//         backgroundColor: ["#50B755", "#ff4d4d"],
//         hoverBackgroundColor: ["#379d3a", "#cc0000"],
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
//             <div className="d-flex justify-content-between align-items-start mb-3">
//               <div>
//                 <h2 className="text-primary mb-1">
//                   {teacherName || "Teacher Name"}
//                 </h2>
//                 <p className="mb-0">
//                   <strong>School:</strong> {school}
//                 </p>
//               </div>
//               <div className="d-flex flex-column align-items-end">
//                 {/* Nav Buttons */}
//                 <button
//                   className="teacher-icon-button mb-2"
//                   onClick={handleGraduateClick}
//                   title="Go to Teacher Dashboard"
//                 >
//                   🎓
//                 </button>
//                 <button
//                   className="teacher-icon-button2"
//                   onClick={handleFormClick}
//                   title="Go to Attendance Page"
//                 >
//                   📃
//                 </button>
//                 {/* Optional: HomePage Button */}
//                 <button
//                   className="teacher-icon-button3"
//                   onClick={() => navigate("/homepage")}
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
//             <Row>
//               <Col xs={12} md={6} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#007bff' }}>
//                   Morning Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={morningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {morningPresentCount + morningAbsentCount > 0
//                       ? (
//                         (morningPresentCount /
//                           (morningPresentCount + morningAbsentCount)) *
//                         100
//                       ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>
//               <Col xs={12} md={6} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="chart-title" style={{ backgroundColor: '#50B755' }}>
//                   Evening Attendance
//                 </h5>
//                 <div className="pie-container">
//                   <Pie data={eveningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {eveningPresentCount + eveningAbsentCount > 0
//                       ? (
//                         (eveningPresentCount /
//                           (eveningPresentCount + eveningAbsentCount)) *
//                         100
//                       ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
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
// File: StaffPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Container, Row, Col, Table, Spinner, Alert, Button } from "react-bootstrap";

import './StaffPage.css'; // Our custom CSS

ChartJS.register(ArcElement, Tooltip, Legend);

function StaffPage() {
  const { session } = useSession();
  const navigate = useNavigate();

  // Basic state
  const [teacherName, setTeacherName] = useState("");
  const [school, setSchool] = useState("");
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [logoutTime, setLogoutTime] = useState<string | null>(null);
  const [minLate, setMinLate] = useState<number | null>(null);
  const [totalLate, setTotalLate] = useState<number | null>(null);

  // Columns for days in the month (1..31)
  const today = new Date();
  const currentMonth = today.getMonth(); 
  const currentYear = today.getFullYear();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ] as const;
  const currentMonthName = monthNames[currentMonth];
  const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate(); 
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  // We'll store morning attendance T/F for each day in an array
  // We'll store evening attendance T/F for each day in a separate array
  const [morningAttendance, setMorningAttendance] = useState<(boolean | null)[]>([]);
  const [eveningAttendance, setEveningAttendance] = useState<(boolean | null)[]>([]);

  // Add state variables for present and presentEvening
  const [present, setPresent] = useState<number>(0);
  const [presentEvening, setPresentEvening] = useState<number>(0);

  // For loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // We'll compute for the pie charts
  const [morningPresentCount, setMorningPresentCount] = useState(0);
  const [morningAbsentCount, setMorningAbsentCount] = useState(0);
  const [eveningPresentCount, setEveningPresentCount] = useState(0);
  const [eveningAbsentCount, setEveningAbsentCount] = useState(0);

  // Utility: if a column is TRUE => present, if null => absent
  const isPresent = (val: any) => val === true;

  // 1) Check role => if not Teacher => sign-up
  // 2) Match teacher row => password == teacherID, plus same school
  useEffect(() => {
    if (!session) {
      navigate("/sign-up");
      return;
    }

    const fetchData = async () => {
      try {
        // 1) fetch user role, password, and school
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Not authenticated. Please log in.");
          navigate("/sign-up");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, password, school")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          setError("Failed to retrieve profile data.");
          navigate("/sign-up");
          return;
        }

        if (profileData.role !== "Teacher") {
          setError("You are not authorized as a Teacher.");
          navigate("/sign-up");
          return;
        }

        // password => teacherID
        const teacherID = profileData.password;
        const schoolName = profileData.school || "";

        // 2) fetch teacher row
        const { data: teacherRow, error: teacherError } = await supabase
          .from("teacher")
          .select("*")
          .eq("teacherID", teacherID)
          .eq("school", schoolName)
          .single();

        if (teacherError || !teacherRow) {
          setError("No matching teacher found in 'teacher' table.");
          return;
        }

        // Now we have the teacher row. Extract attendance
        setTeacherName(teacherRow.teacherName || "");
        setSchool(teacherRow.school || "");

        // top stats
        setLoginTime(teacherRow.Login || null);
        setLogoutTime(teacherRow.Logout || null);
        setMinLate(teacherRow.minLate || 0);
        setTotalLate(teacherRow.totalLate || 0);

        // Set present and presentEvening
        const fetchedPresent = teacherRow.present || 0;
        const fetchedPresentEvening = teacherRow.presentEvening || 0;

        setPresent(fetchedPresent);
        setPresentEvening(fetchedPresentEvening);

        // build morning and evening attendance arrays
        let tempMorning: (boolean | null)[] = [];
        let tempEvening: (boolean | null)[] = [];

        for (let day = 1; day <= numberOfDays; day++) {
          const dayVal = teacherRow[`${day}`]; 
          const eveningVal = teacherRow[`e${day}`];
          tempMorning.push(dayVal === true ? true : null);
          tempEvening.push(eveningVal === true ? true : null);
        }

        setMorningAttendance(tempMorning);
        setEveningAttendance(tempEvening);
      } catch (err: any) {
        console.error("Error fetching teacher data:", err);
        setError(err.message || "Unexpected error.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pie Chart calculation
  useEffect(() => {
    if (morningAttendance.length > 0) {
      let presentM = 0;
      let absentM = 0;
      morningAttendance.forEach((val) => {
        if (val === true) presentM++;
        else absentM++;
      });
      setMorningPresentCount(presentM);
      setMorningAbsentCount(absentM);
    }

    if (eveningAttendance.length > 0) {
      let presentE = 0;
      let absentE = 0;
      eveningAttendance.forEach((val) => {
        if (val === true) presentE++;
        else absentE++;
      });
      setEveningPresentCount(presentE);
      setEveningAbsentCount(absentE);
    }
  }, [morningAttendance, eveningAttendance]);

  // Pie data for Morning
  const morningData = {
    labels: ["Present (M)", "Absent (M)"],
    datasets: [
      {
        label: "Morning Attendance",
        data: [morningPresentCount, morningAbsentCount],
        backgroundColor: ["#007bff", "#ff4d4d"], // Blue for present, red for absent
        hoverBackgroundColor: ["#0056b3", "#cc0000"], // Darker blue and darker red on hover
      },
    ],
  };

  // Pie data for Evening
  const eveningData = {
    labels: ["Present (E)", "Absent (E)"],
    datasets: [
      {
        label: "Evening Attendance",
        data: [eveningPresentCount, eveningAbsentCount],
        backgroundColor: ["#50B755", "#ff4d4d"], // Green for present, red for absent
        hoverBackgroundColor: ["#379d3a", "#cc0000"], // Darker green and darker red on hover
      },
    ],
  };

  // Chart options
  const chartOptions = {
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
  };

  // UI Interactions
  const handleGraduateClick = () => {
    navigate("/teacherdashboard");
  };
  const handleFormClick = () => {
    navigate("/attendance");
  };

  // Function to get current month and year
  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Rendering
  if (loading) {
    return (
      <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="staffpage-container vh-100 d-flex flex-column align-items-center justify-content-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="staffpage-container py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="bg-dark text-white p-4 rounded shadow">
            {/* Header / Teacher info */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
              <div>
                <h2 className="text-primary mb-1">
                  {teacherName || "Teacher Name"}
                </h2>
                <p className="mb-0">
                  <strong>School:</strong> {school}
                </p>
                {/* Current Month and Year */}
                <p className="current-month-year">{getCurrentMonthYear()}</p>
              </div>
              <div className="d-flex flex-row align-items-end mt-3 mt-md-0">
                {/* Nav Buttons */}
                <button
                  className="teacher-icon-button me-2"
                  onClick={handleGraduateClick}
                  title="Go to Teacher Dashboard"
                >
                  🎓
                </button>
                <button
                  className="teacher-icon-button2 me-2"
                  onClick={handleFormClick}
                  title="Go to Attendance Page"
                >
                  📃
                </button>
                {/* Optional: HomePage Button */}
                <button
                  className="teacher-icon-button3"
                  onClick={() => navigate("/")}
                  title="Go to Home Page"
                >
                  🏠
                </button>
              </div>
            </div>

            {/* Top container for login, logout, minLate, totalLate */}
            <div className="stats-container mb-4">
              <Row>
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Login</span>
                    <span className="stat-value">{loginTime || "---"}</span>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Logout</span>
                    <span className="stat-value">{logoutTime || "---"}</span>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Minutes Late</span>
                    <span className="stat-value">{minLate !== null ? minLate : "---"}</span>
                  </div>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <div className="stat-box">
                    <span className="stat-label">Total Late</span>
                    <span
                      className="stat-value"
                      style={{
                        color: totalLate === 0 ? "#50B755" : "#ff4d4d",
                        fontWeight: "bold",
                      }}
                    >
                      {totalLate !== null ? totalLate : "---"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Two Pie Charts: Morning & Evening */}
            <Row className="justify-content-center">
              {/* Morning Attendance Pie Chart */}
              <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
                <h5 className="chart-title" style={{ backgroundColor: '#007bff' }}>
                  Morning Attendance
                </h5>
                <div className="pie-container">
                  <Pie data={morningData} options={chartOptions} />
                  <div className="pie-center-text">
                    {morningPresentCount + morningAbsentCount > 0
                      ? (
                          (morningPresentCount /
                            (morningPresentCount + morningAbsentCount)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </Col>

              {/* Evening Attendance Pie Chart */}
              <Col xs={12} md={5} lg={4} className="mb-4 d-flex flex-column align-items-center">
                <h5 className="chart-title" style={{ backgroundColor: '#50B755' }}>
                  Evening Attendance
                </h5>
                <div className="pie-container">
                  <Pie data={eveningData} options={chartOptions} />
                  <div className="pie-center-text">
                    {eveningPresentCount + eveningAbsentCount > 0
                      ? (
                          (eveningPresentCount /
                            (eveningPresentCount + eveningAbsentCount)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </Col>
            </Row>

            {/* New Container for Present and PresentEvening */}
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={6} lg={4} className="d-flex justify-content-center">
                <div className="present-container p-4 rounded shadow">
                  <Row>
                    <Col xs={6} className="text-center">
                      <h6>Morning (Day)</h6>
                      <p className="present-count">{present}</p>
                    </Col>
                    <Col xs={6} className="text-center">
                      <h6>Evening (Day)</h6>
                      <p className="present-evening-count">{presentEvening}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Attendance Table (Day, M, E) */}
            <div className="table-responsive">
              <Table bordered hover className="text-center align-middle w-100 table-custom">
                <thead>
                  <tr>
                    <th className="th-day">Day</th>
                    <th className="th-morning">M</th>
                    <th className="th-evening">E</th>
                  </tr>
                </thead>
                <tbody>
                  {daysArray.map((day) => {
                    const morningVal = morningAttendance[day - 1];
                    const eveningVal = eveningAttendance[day - 1];
                    return (
                      <tr key={day}>
                        <td className="fw-bold day-col">{day}</td>
                        <td>
                          {morningVal === true ? "✅" : "❌"}
                        </td>
                        <td>
                          {eveningVal === true ? "✅" : "❌"}
                        </td>
                      </tr>
                    );
                  })}
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

//         // build morning array
//         let tempMorning: (boolean | null)[] = [];
//         let tempEvening: (boolean | null)[] = [];

//         for (let day = 1; day <= numberOfDays; day++) {
//           // column name is day => "1", "2", etc => teacherRow["1"]
//           const dayVal = teacherRow[`${day}`]; 
//           // evening => e1, e2 => teacherRow[`e1`]
//           const eveningVal = teacherRow[`e${day}`];
//           // if dayVal===true => present, if null => absent
//           tempMorning.push(dayVal === true ? true : null);
//           // if eveningVal===true => present, else absent
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
//         backgroundColor: ["#007bff", "#ff4d4d"],
//         hoverBackgroundColor: ["#0056b3", "#cc0000"],
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
//         backgroundColor: ["#50B755", "#ff4d4d"],
//         hoverBackgroundColor: ["#379d3a", "#cc0000"],
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
//             <div className="d-flex justify-content-between align-items-start mb-3">
//               <div>
//                 <h2 className="text-primary mb-1">
//                   {teacherName || "Teacher Name"}
//                 </h2>
//                 <p className="mb-0">
//                   <strong>School:</strong> {school}
//                 </p>
//               </div>
//               <div className="d-flex flex-column align-items-end">
//                 {/* Nav Buttons */}
//                 <button
//                   className="teacher-icon-button mb-2"
//                   onClick={handleGraduateClick}
//                   title="Go to Teacher Dashboard"
//                 >
//                   🎓
//                 </button>
//                 <button
//                   className="teacher-icon-button2"
//                   onClick={handleFormClick}
//                   title="Go to Attendance Page"
//                 >
//                   📃
//                 </button>
//               </div>
//             </div>

//             {/* top container for login, logout, minLate, totalLate */}
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
//                         color: totalLate === 0 ? "#50b755" : "#ff4d4d",
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
//             <Row>
//               <Col xs={12} md={6} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="text-center text-info">Morning Attendance</h5>
//                 <div className="pie-container">
//                   <Pie data={morningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {morningPresentCount + morningAbsentCount > 0
//                       ? (
//                         (morningPresentCount /
//                           (morningPresentCount + morningAbsentCount)) *
//                         100
//                       ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>
//               <Col xs={12} md={6} className="mb-4 d-flex flex-column align-items-center">
//                 <h5 className="text-center text-success">Evening Attendance</h5>
//                 <div className="pie-container">
//                   <Pie data={eveningData} options={chartOptions} />
//                   <div className="pie-center-text">
//                     {eveningPresentCount + eveningAbsentCount > 0
//                       ? (
//                         (eveningPresentCount /
//                           (eveningPresentCount + eveningAbsentCount)) *
//                         100
//                       ).toFixed(1)
//                       : 0}
//                     %
//                   </div>
//                 </div>
//               </Col>
//             </Row>

//             {/* Attendance Table (Day, M, E) */}
//             <div className="table-responsive">
//               <Table bordered hover className="text-center align-middle w-100">
//                 <thead className="table-primary text-dark">
//                   <tr>
//                     <th>Day</th>
//                     <th>M</th>
//                     <th>E</th>
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
