// AttendancePage.tsx
import React, { useState, useEffect } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import "./AttendancePage.css"; // Import the CSS file

function AttendancePage() {
  const [userSchool, setUserSchool] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState<{ id: number; name: string; checked: boolean }[]>([]);
  const [day, setDay] = useState(new Date().getDate());
  const [selectAll, setSelectAll] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const navigate = useNavigate();

  const currentMonthDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  useEffect(() => {
    checkUserSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserSchool = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("school")
          .eq("id", user.id)
          .single();

        if (!error && profileData) {
          setUserSchool(profileData?.school || "Unknown School");
          if (profileData?.school) await fetchClassNames(profileData.school);
        }
      }
    } catch (error) {
      console.error("Error checking user school:", error);
    }
  };

  const fetchClassNames = async (school: string) => {
    try {
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school);

      if (!error && data) {
        const uniqueClassNames = [...new Set((data as any[]).map((item) => item.className))];
        setClassNames(uniqueClassNames);
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
    }
  };

  const fetchSections = async (className: string) => {
    try {
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("school", userSchool)
        .eq("className", className);

      if (!error && data) {
        const uniqueSections = [...new Set((data as any[]).map((item) => item.section))];
        setSections(uniqueSections);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const fetchStudents = async () => {
    if (!classTime || !selectedClassName || !selectedSection) return;

    try {
      const { data: studentData } = await supabase
        .from(classTime)
        .select("id, studentName")
        .eq("school", userSchool)
        .eq("className", selectedClassName)
        .eq("section", selectedSection);

      if (!studentData) return;

      const ids = (studentData as any[]).map((item) => item.id);
      const { data: attendanceData } = await supabase
        .from(classTime)
        .select(`${day}, id`)
        .in("id", ids);

      const combinedData = (studentData as any[]).map((student) => {
        const attendance = (attendanceData as any[]).find((a) => a.id === student.id);
        return {
          id: student.id,
          name: student.studentName,
          checked: attendance ? attendance[day] === true : false,
        };
      });

      setStudents(combinedData.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const saveAttendance = async () => {
    try {
      await Promise.all(
        students.map(async (student) => {
          const { error } = await supabase
            .from(classTime)
            .update({ [day]: student.checked || null })
            .eq("id", student.id);

          if (error) throw error;
        })
      );
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  const toggleStudentCheckbox = (id: number) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, checked: !student.checked } : student
      )
    );
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setStudents((prev) =>
      prev.map((student) => ({ ...student, checked: newSelectAll }))
    );
  };

  const toggleContainerSize = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleGraduationCapClick = () => {
    navigate("/teacherdashboard");
  };

  const handleMouseEnterGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = "scale(1.2)";
  };

  const handleMouseLeaveGraduation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = "scale(1)";
  };

  return (
    <div className="page-container">
      <h1 className="heading">Student Attendance</h1>
      {userSchool && <h2 className="subheading">{userSchool}</h2>}
      <button
        onClick={handleGraduationCapClick}
        className="graduation-cap-button"
        onMouseEnter={handleMouseEnterGraduation}
        onMouseLeave={handleMouseLeaveGraduation}
        aria-label="Navigate to Teacher Dashboard"
      >
        🎓
      </button>
      <div className={`form-container ${isMinimized ? "minimized" : ""}`}>
        {!isMinimized && (
          <>
            <div className="form-group">
              <label htmlFor="class-time-select">Class Time</label>
              <select
                id="class-time-select"
                value={classTime}
                onChange={(e) => {
                  setClassTime(e.target.value);
                  setSelectedClassName("");
                  setSections([]);
                  setStudents([]);
                }}
              >
                <option value="">Select Class Time</option>
                {["C1", "C2", "C3", "C4", "C5", "C6"].map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="class-name-select">Class Name</label>
              <select
                id="class-name-select"
                value={selectedClassName}
                onChange={(e) => {
                  setSelectedClassName(e.target.value);
                  fetchSections(e.target.value);
                }}
              >
                <option value="">Select Class Name</option>
                {classNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="section-select">Section</label>
              <select
                id="section-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="day-select">Day of the Month</label>
              <select
                id="day-select"
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
              >
                {Array.from({ length: currentMonthDays }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={fetchStudents} className="fetch-button">
              Fetch Students
            </button>
          </>
        )}
        <button onClick={toggleContainerSize} className="chevron-button">
          {isMinimized ? "\u25BC" : "\u25B2"}
        </button>
      </div>

      <div className={`student-list-container ${isMinimized ? "minimized" : ""}`}>
        <div className="select-all-container">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label>Select All</label>
        </div>
        {students.map((student) => (
          <div
            key={student.id}
            className={`student-item ${student.checked ? "checked" : ""}`}
            onClick={() => toggleStudentCheckbox(student.id)}
          >
            <label className="student-label">
              <input
                type="checkbox"
                checked={student.checked}
                onChange={() => toggleStudentCheckbox(student.id)}
                onClick={(e) => e.stopPropagation()}
              />
              {student.name}
            </label>
          </div>
        ))}
      </div>

      <button onClick={saveAttendance} className="save-attendance-button">
        Save Attendance
      </button>
    </div>
  );
}

export default AttendancePage;


// import React, { useState, useEffect } from "react";
// import supabase from "../../supabase";
// import { useNavigate } from "react-router-dom";

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
//     <div style={pageStyle as React.CSSProperties}>
//       <h1 style={headingStyle as React.CSSProperties}>Student Attendance</h1>
//       {userSchool && <h2 style={subHeadingStyle as React.CSSProperties}>{userSchool}</h2>}
//       <button
//         onClick={handleGraduationCapClick}
//         style={graduationCapButtonStyle as React.CSSProperties}
//         onMouseEnter={handleMouseEnterGraduation}
//         onMouseLeave={handleMouseLeaveGraduation}
//       >
//         🎓
//       </button>
//       <div style={formContainerStyle(isMinimized) as React.CSSProperties}>
//         {!isMinimized && (
//           <>
//             <div style={formGroupStyle as React.CSSProperties}>
//               <label style={labelStyle as React.CSSProperties}>Class Time</label>
//               <select
//                 value={classTime}
//                 onChange={(e) => {
//                   setClassTime(e.target.value);
//                   setSelectedClassName("");
//                   setSections([]);
//                   setStudents([]);
//                 }}
//                 style={selectStyle as React.CSSProperties}
//               >
//                 <option value="">Select Class Time</option>
//                 {["C1", "C2", "C3", "C4", "C5", "C6"].map((time) => (
//                   <option key={time} value={time}>
//                     {time}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={formGroupStyle as React.CSSProperties}>
//               <label style={labelStyle as React.CSSProperties}>Class Name</label>
//               <select
//                 value={selectedClassName}
//                 onChange={(e) => {
//                   setSelectedClassName(e.target.value);
//                   fetchSections(e.target.value);
//                 }}
//                 style={selectStyle as React.CSSProperties}
//               >
//                 <option value="">Select Class Name</option>
//                 {classNames.map((name) => (
//                   <option key={name} value={name}>
//                     {name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={formGroupStyle as React.CSSProperties}>
//               <label style={labelStyle as React.CSSProperties}>Section</label>
//               <select
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//                 style={selectStyle as React.CSSProperties}
//               >
//                 <option value="">Select Section</option>
//                 {sections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={formGroupStyle as React.CSSProperties}>
//               <label style={labelStyle as React.CSSProperties}>Day of the Month</label>
//               <select
//                 value={day}
//                 onChange={(e) => setDay(parseInt(e.target.value))}
//                 style={selectStyle as React.CSSProperties}
//               >
//                 {Array.from({ length: currentMonthDays }, (_, i) => i + 1).map((d) => (
//                   <option key={d} value={d}>
//                     {d}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button onClick={fetchStudents} style={buttonStyle as React.CSSProperties}>
//               Fetch Students
//             </button>
//           </>
//         )}
//         <button onClick={toggleContainerSize} style={chevronButtonStyle(isMinimized) as React.CSSProperties}>
//           {isMinimized ? "\u25BC" : "\u25B2"}
//         </button>
//       </div>

//       <div style={studentListContainerStyle(isMinimized) as React.CSSProperties}>
//         <div>
//           <label style={checkboxLabelStyle as React.CSSProperties}>
//             <input
//               type="checkbox"
//               checked={selectAll}
//               onChange={handleSelectAll}
//               style={checkboxStyle as React.CSSProperties}
//             />
//             Select All
//           </label>
//         </div>
//         {students.map((student) => (
//           <div
//             key={student.id}
//             style={{
//               ...studentContainerStyle,
//               border: student.checked ? "2px solid blue" : "2px solid transparent",
//             } as React.CSSProperties}
//             onClick={() => toggleStudentCheckbox(student.id)}
//           >
//             <label style={studentLabelStyle as React.CSSProperties}>
//               <input
//                 type="checkbox"
//                 checked={student.checked}
//                 onChange={() => toggleStudentCheckbox(student.id)}
//                 style={{
//                   ...checkboxStyle,
//                   appearance: "none" as const,
//                   backgroundColor: student.checked ? "#0056b3" : "#1e1e1e",
//                   color: student.checked ? "#ffffff" : "#000000",
//                 } as React.CSSProperties}
//               />
//               {student.name}
//             </label>
//           </div>
//         ))}
//       </div>

//       <button onClick={saveAttendance} style={saveButtonStyle as React.CSSProperties}>
//         Save Attendance
//       </button>
//     </div>
//   );
// }

// /* Styles */
// const pageStyle = {
//   backgroundColor: "#121212",
//   minHeight: "100vh",
//   color: "#ffffff",
//   display: "flex",
//   flexDirection: "column" as const,
//   alignItems: "center",
//   justifyContent: "center",
//   fontFamily: "'Roboto', sans-serif",
//   padding: "10px",
// };

// const headingStyle = {
//   fontSize: "36px",
//   fontWeight: "bold",
//   marginBottom: "15px",
//   marginTop: "-5px",
//   textAlign: "center" as const,
//   color: "#e0e0e0",
// };

// const subHeadingStyle = {
//   fontSize: "25px",
//   marginBottom: "10px",
//   textAlign: "center" as const,
//   color: "#b0b0b0",
// };

// const graduationCapButtonStyle = {
//   position: "absolute" as const,
//   right: "560px",
//   top: "-20px",
//   backgroundColor: "#2a2a2a",
//   color: "#ffffff",
//   border: "none",
//   borderRadius: "50%",
//   width: "55px",
//   height: "55px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "45px",
//   cursor: "pointer",
//   transition: "transform 0.3s ease, background-color 0.3s ease",
//   zIndex: 1000,
// };

// const formContainerStyle = (minimized: boolean) => ({
//   backgroundColor: "#1e1e1e",
//   padding: minimized ? "10px" : "25px",
//   borderRadius: "12px",
//   boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
//   marginBottom: minimized ? "20px" : "20px",
//   width: "100%",
//   maxWidth: "600px",
//   overflow: "visible",
//   height: minimized ? "60px" : "auto",
//   position: "relative" as const,
//   transition: "height 0.3s ease, padding 0.3s ease",
// });

// const formGroupStyle = {
//   marginBottom: "10px",
// };

// const labelStyle = {
//   display: "block",
//   marginBottom: "6px",
//   fontSize: "18px",
//   fontWeight: "500",
//   color: "#c0c0c0",
// };

// const selectStyle = {
//   width: "100%",
//   padding: "35px",
//   fontSize: "22px",
//   borderRadius: "8px",
//   backgroundColor: "#2a2a2a",
//   color: "#ffffff",
//   border: "1px solid #444",
//   outline: "none",
//   transition: "border-color 0.3s",
//   boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
// } as React.CSSProperties;

// const buttonStyle = {
//   width: "100%",
//   padding: "28px",
//   backgroundColor: "#28a745",
//   color: "#ffffff",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "22px",
//   fontWeight: "bold",
//   textAlign: "center" as const,
//   transition: "transform 0.2s ease, opacity 0.3s ease",
// } as React.CSSProperties;

// const saveButtonStyle = {
//   ...buttonStyle,
//   marginTop: "0px",
//   width: "590px",
// } as React.CSSProperties;

// const studentListContainerStyle = (expanded: boolean) => ({
//   backgroundColor: "#1e1e1e",
//   borderRadius: "12px",
//   padding: "20px",
//   width: "100%",
//   maxWidth: "600px",
//   maxHeight: expanded ? "600px" : "300px",
//   overflowY: "auto" as const,
//   marginBottom: "25px",
//   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
//   transition: "max-height 0.3s ease",
// });

// const studentContainerStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "12px",
//   marginBottom: "12px",
//   borderRadius: "10px",
//   backgroundColor: "#2a2a2a",
//   cursor: "pointer",
//   transition: "border 0.3s ease, background-color 0.3s ease",
// } as React.CSSProperties;

// const studentLabelStyle = {
//   display: "flex",
//   alignItems: "center",
//   fontSize: "23px",
//   fontWeight: "500",
//   color: "#ffffff",
// } as React.CSSProperties;

// const checkboxStyle = {
//   width: "24px",
//   height: "24px",
//   marginRight: "10px",
//   appearance: "none" as const,
//   backgroundColor: "#1e1e1e",
//   border: "2px solid #444",
//   borderRadius: "4px",
//   cursor: "pointer",
//   position: "relative" as const,
//   transition: "all 0.3s ease",
// } as React.CSSProperties;

// const chevronButtonStyle = (expanded: boolean) => ({
//   position: "absolute" as const,
//   bottom: "-29px",
//   left: "50%",
//   transform: "translateX(-50%)",
//   backgroundColor: "#2a2a2a",
//   color: "#ffffff",
//   borderRadius: "50%",
//   width: "50px",
//   height: "50px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "20px",
//   cursor: "pointer",
//   transition: "transform 0.3s ease, background-color 0.3s ease",
//   zIndex: 1000,
// });

// const checkboxLabelStyle = {
//   display: "flex",
//   alignItems: "center",
//   marginBottom: "15px",
//   fontSize: "18px",
//   color: "#ffffff",
// } as React.CSSProperties;

// export default AttendancePage;
