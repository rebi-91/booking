// StudentPage.tsx
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
import "./StudentPage.css"; // Import the CSS file

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function StudentPage() {
  const navigate = useNavigate();
  const { session } = useSession();

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
        <td className="checkbox-cell">
          <label className="checkbox-label">
            <input type="checkbox" checked={true} disabled className="hidden-checkbox" />
            <span className="custom-checkbox red-cross" title="Absent">
              ❌
            </span>
          </label>
        </td>
      );
    } else if (attendance === false) {
      return (
        <td className="checkbox-cell">
          <label className="checkbox-label">
            <input type="checkbox" checked={false} disabled className="hidden-checkbox" />
            <span className="custom-checkbox" title="Present"></span>
          </label>
        </td>
      );
    } else {
      return (
        <td className="checkbox-cell">
          <label className="checkbox-label">
            <input type="checkbox" checked={false} disabled className="hidden-checkbox" />
            <span className="custom-checkbox" title="No Data"></span>
          </label>
        </td>
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        className={`graduation-cap-button ${
          isActiveGraduation ? "active" : ""
        }`}
        onClick={handleGraduationCapClick}
        onMouseEnter={() => setIsHoveredGraduation(true)}
        onMouseLeave={() => setIsHoveredGraduation(false)}
        onMouseDown={() => setIsActiveGraduation(true)}
        onMouseUp={() => setIsActiveGraduation(false)}
        aria-label="Navigate to Grade Page"
      >
        🎓
      </button>

      <div className="card">
        <div className="student-info-container">
          <div className="student-info">
            <h2 className="student-name">
              {studentName} ({studentID})
            </h2>
            <p className="school-name">{school}</p>
            <p className="class-section">
              Class Name: {className} | Section: {section}
            </p>
          </div>

          <div className="pie-chart-container">
            <Pie
              data={attendanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
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
            <div className="center-percentage">
              <span className="percentage-text">
                {presentCount + absentCount > 0
                  ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(2)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <h3 className="attendance-title">
          Attendance for {currentMonthName} {currentYear}
        </h3>

        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="table-header">Day</th>
                {classInfo.map((info, index) => (
                  <th key={index} className="table-header">
                    {info.classTime}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="day-cell">{day}</td>
                  {classInfo.map((info, index) => (
                    <React.Fragment key={index}>
                      {renderAttendanceCell(info.attendance[day - 1])}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function handleGraduationCapClick() {
    navigate("/grade");
  }
}

export default StudentPage;


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
//         <td style={styles.checkboxCell as React.CSSProperties}>
//           <label style={styles.checkboxLabel as React.CSSProperties}>
//             <input type="checkbox" checked={true} disabled style={styles.hiddenCheckbox as React.CSSProperties} />
//             <span style={{ ...styles.customCheckbox, ...styles.redCross }} title="Absent">
//               ❌
//             </span>
//           </label>
//         </td>
//       );
//     } else if (attendance === false) {
//       return (
//         <td style={styles.checkboxCell as React.CSSProperties}>
//           <label style={styles.checkboxLabel as React.CSSProperties}>
//             <input type="checkbox" checked={false} disabled style={styles.hiddenCheckbox as React.CSSProperties} />
//             <span style={styles.customCheckbox} title="Present"></span>
//           </label>
//         </td>
//       );
//     } else {
//       return (
//         <td style={styles.checkboxCell as React.CSSProperties}>
//           <label style={styles.checkboxLabel as React.CSSProperties}>
//             <input type="checkbox" checked={false} disabled style={styles.hiddenCheckbox as React.CSSProperties} />
//             <span style={styles.customCheckbox} title="No Data"></span>
//           </label>
//         </td>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer as React.CSSProperties}>
//         <div style={styles.spinner as React.CSSProperties}></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.errorContainer as React.CSSProperties}>
//         <p style={styles.errorMessage as React.CSSProperties}>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer as React.CSSProperties}>
//       <button
//         style={{
//           ...styles.graduationCapButton,
//           transform: isHoveredGraduation
//             ? "translateX(-50%) scale(1.2)"
//             : "translateX(-50%) scale(1)",
//           backgroundColor: isActiveGraduation ? "#000000" : "#d3d3d3",
//         } as React.CSSProperties}
//         onClick={handleGraduationCapClick}
//         onMouseEnter={() => setIsHoveredGraduation(true)}
//         onMouseLeave={() => setIsHoveredGraduation(false)}
//         onMouseDown={() => setIsActiveGraduation(true)}
//         onMouseUp={() => setIsActiveGraduation(false)}
//       >
//         🎓
//       </button>

//       <div style={styles.card as React.CSSProperties}>
//         <div style={styles.studentInfoContainer as React.CSSProperties}>
//           <div style={styles.studentInfo as React.CSSProperties}>
//             <h2 style={styles.studentName as React.CSSProperties}>
//               {studentName} ({studentID})
//             </h2>
//             <p style={styles.schoolName as React.CSSProperties}>{school}</p>
//             <p style={styles.classSection as React.CSSProperties}>
//               Class Name: {className} | Section: {section}
//             </p>
//           </div>

//           <div style={styles.pieChartContainer as React.CSSProperties}>
//             <Pie
//               data={attendanceData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: "bottom",
//                   },
//                   tooltip: {
//                     enabled: true,
//                   },
//                 },
//                 animation: {
//                   animateRotate: true,
//                   animateScale: true,
//                 },
//               }}
//             />
//             <div style={styles.centerPercentage as React.CSSProperties}>
//               <span style={styles.percentageText as React.CSSProperties}>
//                 {presentCount + absentCount > 0
//                   ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(2)
//                   : 0}
//                 %
//               </span>
//             </div>
//           </div>
//         </div>

//         <h3 style={styles.attendanceTitle as React.CSSProperties}>
//           Attendance for {currentMonthName} {currentYear}
//         </h3>

//         <div style={styles.attendanceTableContainer as React.CSSProperties}>
//           <table style={styles.attendanceTable as React.CSSProperties}>
//             <thead>
//               <tr>
//                 <th style={styles.tableHeader as React.CSSProperties}>Day</th>
//                 {classInfo.map((info, index) => (
//                   <th key={index} style={styles.tableHeader as React.CSSProperties}>
//                     {info.classTime}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {days.map((day) => (
//                 <tr key={day}>
//                   <td style={styles.dayCell as React.CSSProperties}>{day}</td>
//                   {classInfo.map((info, index) => (
//                     <React.Fragment key={index}>
//                       {renderAttendanceCell(info.attendance[day - 1])}
//                     </React.Fragment>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   function handleGraduationCapClick() {
//     navigate("/grade");
//   }
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   pageContainer: {
//     position: "relative" as const,
//     display: "flex",
//     flexDirection: "column" as const,
//     alignItems: "center",
//     padding: "20px",
//     backgroundColor: "#f5f5f5",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//     width: "100%",
//     maxWidth: "1200px",
//   },
//   studentInfoContainer: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "20px",
//     flexWrap: "wrap" as const,
//   },
//   studentInfo: {
//     marginBottom: "20px",
//     flex: "1 1 300px",
//   },
//   studentName: {
//     color: '#000',
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginBottom: "5px",
//   },
//   schoolName: {
//     fontSize: "18px",
//     color: "#333",
//     marginBottom: "5px",
//   },
//   classSection: {
//     fontSize: "16px",
//     color: "#666",
//   },
//   pieChartContainer: {
//     position: "relative" as const,
//     width: "250px",
//     height: "250px",
//   },
//   centerPercentage: {
//     position: "absolute" as const,
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     pointerEvents: "none" as const,
//   },
//   percentageText: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     color: "#000",
//   },
//   attendanceTitle: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     marginBottom: "15px",
//     textAlign: "center" as const,
//   },
//   attendanceTableContainer: {
//     overflowX: "auto" as const,
//   },
//   attendanceTable: {
//     width: "100%",
//     borderCollapse: "collapse" as const,
//   },
//   tableHeader: {
//     border: "1px solid #dddddd",
//     textAlign: "center" as const,
//     padding: "8px",
//     backgroundColor: "#007bff",
//     color: "white",
//   },
//   dayCell: {
//     backgroundColor: "#f2f2f2",
//     fontWeight: "bold",
//     color: "#777",
//     border: "1px solid #dddddd",
//     textAlign: "center" as const,
//     padding: "8px",
//   },
//   checkboxCell: {
//     border: "1px solid #dddddd",
//     textAlign: "center" as const,
//     padding: "8px",
//     width: "50px",
//   },
//   checkboxLabel: {
//     position: "relative" as const,
//     display: "inline-block" as const,
//     width: "20px",
//     height: "20px",
//     cursor: "default",
//   },
//   hiddenCheckbox: {
//     opacity: 0 as const,
//     width: 0,
//     height: 0,
//   },
//   customCheckbox: {
//     position: "absolute" as const,
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffffff",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   redCross: {
//     color: "red",
//     fontSize: "16px",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column" as const,
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//   },
//   spinner: {
//     border: "8px solid #f3f3f3",
//     borderTop: "8px solid #007bff",
//     borderRadius: "50%",
//     width: "60px",
//     height: "60px",
//     animation: "spin 1s linear infinite",
//     marginBottom: "20px",
//   },
//   errorContainer: {
//     display: "flex",
//     flexDirection: "column" as const,
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//   },
//   errorMessage: {
//     color: "red",
//     fontSize: "18px",
//   },
//   graduationCapButton: {
//     position: "absolute" as const,
//     top: "20px",
//     left: "50%",
//     backgroundColor: "#d3d3d3",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "50%",
//     width: "40px",
//     height: "40px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "44px",
//     cursor: "pointer",
//     transition: "transform 0.3s ease, background-color 0.3s ease",
//     zIndex: 1000,
//     transform: "translateX(-50%) scale(1)",
//   },
// };

// // Keyframes for spinner animation
// const styleSheet = document.styleSheets[0];
// const keyframes =
//   `@keyframes spin {
//     to { transform: rotate(360deg); }
//   }`;
// styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

// export default StudentPage;
