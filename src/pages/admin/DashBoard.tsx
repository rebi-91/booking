// import React, { useState } from "react";
// import AlertModal from "./AlertModal"; // Ensure you have this component

// // Define interfaces
// interface Student {
//   id: number;
//   studentName: string;
//   className: string;
//   section: string;
//   studentNumber: string | null;
//   guardianNumber: string | null;
// }

// interface AttendanceMap {
//   [studentId: number]: {
//     [classTime: string]: boolean;
//   };
// }

// interface StudentsGrouped {
//   [group: string]: Student[];
// }

// function DashBoard() {
//   // State variables with mock data
//   const [userSchool, setUserSchool] = useState<string>("Example School");
//   const [classNames, setClassNames] = useState<string[]>(["Class 1", "Class 2", "Class 3"]);
//   const [sections, setSections] = useState<string[]>(["A", "B", "C"]);
//   const [selectedClassName, setSelectedClassName] = useState<string>("");
//   const [selectedSection, setSelectedSection] = useState<string>("");
//   const [studentsGrouped, setStudentsGrouped] = useState<StudentsGrouped>({
//     "Class 1 - Section A": [
//       {
//         id: 1,
//         studentName: "John Doe",
//         className: "Class 1",
//         section: "A",
//         studentNumber: "1234567890",
//         guardianNumber: "0987654321",
//       },
//       // Add more mock students as needed
//     ],
//     "Class 2 - Section B": [
//       {
//         id: 2,
//         studentName: "Jane Smith",
//         className: "Class 2",
//         section: "B",
//         studentNumber: "2345678901",
//         guardianNumber: "1987654321",
//       },
//       // Add more mock students as needed
//     ],
//   });
//   const [attendanceData, setAttendanceData] = useState<AttendanceMap>({
//     1: { C1: true, C2: false, C3: false, C4: false, C5: true, C6: false },
//     2: { C1: false, C2: false, C3: true, C4: false, C5: false, C6: true },
//     // Add more mock attendance data as needed
//   });
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string>("");
//   const [custMessage, setCustMessage] = useState<string>("Welcome to our school!");
//   const [tempCustMessage, setTempCustMessage] = useState<string>("Welcome to our school!");
//   const [searchTerm, setSearchTerm] = useState<string>(""); // State for Student ID search input

//   // State to track which cell is being edited
//   const [editingCell, setEditingCell] = useState<{ studentId: number | null; field: string | null }>({
//     studentId: null,
//     field: null,
//   });
//   const [editValue, setEditValue] = useState<string>("");

//   // States for Filter Functionality
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState<boolean>(false);

//   // Define class times
//   const classTimes: string[] = ["C1", "C2", "C3", "C4", "C5", "C6"];

//   // Handle saving the custom message
//   const handleCustomMessageSave = (): void => {
//     if (!tempCustMessage.trim()) {
//       setAlertMessage("Custom message cannot be empty.");
//       return;
//     }

//     setCustMessage(tempCustMessage);
//     setAlertMessage("Custom message saved successfully!");
//   };

//   // Generate WhatsApp link
//   const generateWhatsAppLink = (number: string): string | undefined => {
//     if (!number) return undefined;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return undefined;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   // Handle phone number or student name edit initiation
//   const handleEditClick = (studentId: number, field: string, currentValue: string | null): void => {
//     setEditingCell({ studentId, field });
//     setEditValue(currentValue || "");
//   };

//   // Handle input change
//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     setEditValue(e.target.value);
//   };

//   // Handle save on blur
//   const handleEditBlur = (studentId: number, field: string): void => {
//     // For demonstration purposes, we'll update the local state directly
//     const updatedStudentsGrouped = { ...studentsGrouped };

//     Object.keys(updatedStudentsGrouped).forEach((group) => {
//       updatedStudentsGrouped[group] = updatedStudentsGrouped[group].map((student) => {
//         if (student.id === studentId) {
//           return {
//             ...student,
//             [field]: editValue || null,
//           };
//         }
//         return student;
//       });
//     });

//     setStudentsGrouped(updatedStudentsGrouped);
//     setAlertMessage(
//       `${field === "studentName" ? "Student Name" : field === "studentNumber" ? "Student Number" : "Guardian Number"} updated successfully!`
//     );
//     setEditingCell({ studentId: null, field: null });
//     setEditValue("");
//   };

//   // Handle Filter Button Click
//   const handleFilterButtonClick = (): void => {
//     setIsFilterByAbsence((prev) => !prev);
//   };

//   // Determine if a student has at least one absence
//   const hasAbsence = (studentId: number): boolean => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((time: string) => attendance[time] === true);
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Dashboard</h1>
//       <p style={styles.schoolName}>School: {userSchool}</p>

//       {/* Top Section: Filters and Custom Message Side by Side */}
//       <div style={styles.topSection}>
//         {/* Filters Container */}
//         <div style={styles.filterContainer}>
//           <h2 style={styles.subHeader}>Filters</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Class:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedClassName}
//               onChange={(e) => setSelectedClassName(e.target.value)}
//             >
//               <option value="">All Classes</option>
//               {classNames.map((className: string) => (
//                 <option key={className} value={className}>
//                   {className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Section:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               disabled={!selectedClassName}
//             >
//               <option value="">All Sections</option>
//               {sections.map((section: string) => (
//                 <option key={section} value={section}>
//                   {section}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Search by Student ID:</label>
//             <div style={styles.searchContainer}>
//               <input
//                 type="text"
//                 placeholder="Enter Student ID"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={styles.searchInput}
//               />
//               <button
//                 onClick={() => {
//                   // Implement search logic if needed
//                   setAlertMessage(`Search functionality not implemented in static mode.`);
//                 }}
//                 style={styles.searchButton}
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Custom Message Container */}
//         <div style={styles.customMessageContainer}>
//           <div style={styles.customMessageInnerContainer}>
//             <textarea
//               placeholder="Type your custom message here..."
//               value={tempCustMessage}
//               onChange={(e) => setTempCustMessage(e.target.value)}
//               style={styles.customMessageInput}
//             />
//             <button
//               onClick={handleCustomMessageSave}
//               style={styles.saveButton}
//               title="Save Message"
//             >
//               ✓
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Button */}
//       <div style={styles.filterButtonContainer}>
//         <button
//           onClick={handleFilterButtonClick}
//           style={{
//             ...styles.filterButton,
//             backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//             color: isFilterByAbsence ? "#fff" : "#000",
//           }}
//         >
//           Filter by absence
//         </button>
//       </div>

//       {/* Student Attendance Table */}
//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : Object.keys(studentsGrouped).length > 0 ? (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Student No</th>
//                 <th style={styles.th}>Guardian No</th>
//                 <th style={styles.th}>Student ID</th>
//                 <th style={styles.th}>Student Name</th>
//                 {classTimes.map((classTime: string) => (
//                   <th key={classTime} style={styles.th}>
//                     {classTime}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentsGrouped).map(([group, students]: [string, Student[]]) => (
//                 <React.Fragment key={group}>
//                   {/* Group Header */}
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                     </td>
//                   </tr>
//                   {/* Students */}
//                   {students.map((student: Student) => (
//                     <tr key={student.id} style={styles.tr}>
//                       {/* Student Number */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "studentNumber" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "studentNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.studentNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.studentNumber) || "#"}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onDoubleClick={() => handleEditClick(student.id, "studentNumber", student.studentNumber)}
//                             title="Double-click to edit"
//                           >
//                             {student.studentNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       {/* Guardian Number */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "guardianNumber" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "guardianNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.guardianNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.guardianNumber) || "#"}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onDoubleClick={() => handleEditClick(student.id, "guardianNumber", student.guardianNumber)}
//                             title="Double-click to edit"
//                           >
//                             {student.guardianNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       {/* Student ID */}
//                       <td style={styles.td}>{student.id}</td>

//                       {/* Student Name */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "studentName" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "studentName")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <span
//                             onDoubleClick={() => handleEditClick(student.id, "studentName", student.studentName)}
//                             title="Double-click to edit"
//                             style={{ cursor: "pointer", display: "inline-block", width: "100%" }}
//                           >
//                             {student.studentName}
//                           </span>
//                         )}
//                       </td>

//                       {/* Attendance Columns */}
//                       {classTimes.map((classTime: string) => (
//                         <td key={classTime} style={styles.td}>
//                           {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={true}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.redCross} title="Absent">
//                                 ❌
//                               </span>
//                             </label>
//                           ) : (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={false}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.emptyCheckbox} title="Present">
//                                 {/* Empty checkbox */}
//                               </span>
//                             </label>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p style={styles.noDataMessage}>
//             No students found for the selected filters.
//           </p>
//         )}
//       </div>

//       {/* Alert Modal */}
//       {alertMessage && (
//         <AlertModal
//           message={alertMessage}
//           onClose={() => setAlertMessage("")}
//         />
//       )}
//     </div>
//   );
// }

// /* Inline Styles */

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     width: "95%",
//     maxWidth: "1400px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#ffffff",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     borderRadius: "10px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   header: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "10px",
//     textAlign: "center",
//     color: "#333",
//   },
//   schoolName: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     textAlign: "center",
//     color: "#555",
//   },
//   topSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "30px",
//     flexWrap: "wrap",
//   },
//   filterContainer: {
//     backgroundColor: "#f2f2f2",
//     padding: "15px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "46%", // Decreased width to fit side by side
//     minWidth: "300px",
//   },
//   subHeader: {
//     fontSize: "22px",
//     fontWeight: "600",
//     marginBottom: "15px",
//     color: "#444",
//     textAlign: "center",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     display: "flex",
//     flexDirection: "column",
//     width: "100%", // Ensure it takes up available width
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//     color: "#333",
//   },
//   dropdown: {
//     padding: "10px",
//     fontSize: "16px", // Adjusted font size for better UI
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//     width: "100%",
//   },
//   searchContainer: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   searchInput: {
//     padding: "8px",
//     width: "70%",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     outline: "none",
//   },
//   searchButton: {
//     padding: "8px 12px",
//     marginLeft: "10px",
//     fontSize: "16px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   customMessageContainer: {
//     backgroundColor: "#f9f9f9",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "45%", // Decreased width to fit side by side
//     minWidth: "280px",
//     display: "flex",
//     alignItems: "flex-start",
//   },
//   customMessageInnerContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//   },
//   customMessageInput: {
//     width: "100%",
//     height: "100px", // Adjusted height for better usability
//     padding: "10px 15px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     outline: "none",
//     resize: "vertical",
//   },
//   saveButton: {
//     marginTop: "10px",
//     padding: "10px",
//     fontSize: "18px",
//     color: "#ffffff",
//     backgroundColor: "#28a745",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//     width: "100%", // Same width as input
//   },
//   tableContainer: {
//     overflowX: "auto",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#fff",
//     padding: "20px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "1000px",
//   },
//   th: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "white",
//   },
//   tr: {
//     borderBottom: "1px solid #dddddd",
//   },
//   td: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     color: "#555",
//     position: "relative",
//   },
//   groupHeaderRow: {
//     backgroundColor: "#f1f1f1",
//   },
//   groupHeader: {
//     fontSize: "18px",
//     fontWeight: "600",
//     textAlign: "left",
//     padding: "10px",
//     color: "#333",
//   },
//   phoneLink: {
//     color: "#007bff",
//     textDecoration: "underline",
//     cursor: "pointer",
//   },
//   absentIcon: {
//     color: "#ff4d4d",
//     fontSize: "18px",
//   },
//   presentIcon: {
//     color: "#28a745",
//     fontSize: "18px",
//   },
//   noDataMessage: {
//     textAlign: "center",
//     color: "#777",
//     fontSize: "18px",
//   },
//   loadingText: {
//     textAlign: "center",
//     color: "#555",
//     fontSize: "18px",
//   },
//   editInput: {
//     width: "100%",
//     padding: "5px 10px",
//     fontSize: "14px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     outline: "none",
//   },
//   checkboxLabel: {
//     position: "relative",
//     display: "inline-block",
//     width: "20px",
//     height: "20px",
//     cursor: "default", // Prevent cursor change since it's disabled
//   },
//   hiddenCheckbox: {
//     opacity: 0,
//     width: 0,
//     height: 0,
//   },
//   redCross: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffcccc",
//     border: "1px solid #ff4d4d",
//     borderRadius: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#ff0000",
//     fontSize: "14px",
//   },
//   emptyCheckbox: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffffff",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     // Optional: add hover effects or other styles
//   },
//   filterButtonContainer: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginBottom: "10px",
//   },
//   filterButton: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     transition: "background-color 0.3s, color 0.3s",
//   },
// };

// export default DashBoard;

// import React, { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabase";
// import AlertModal from "./AlertModal"; // Ensure you have this component
// import { useNavigate } from "react-router-dom";
// import { useSession } from "../context/SessionContext";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState({});
//   const [attendanceData, setAttendanceData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//      const [searchTerm, setSearchTerm] = useState(""); // State for Student ID search input

//   // State to track which cell is being edited
//   const [editingCell, setEditingCell] = useState({ studentId: null, field: null });
//   const [editValue, setEditValue] = useState("");

//   const inputRef = useRef(null);

//   // New States for Filter Functionality
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);
//   const filterInterval = useRef(null);

//   // Define class times
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];

//   // Get today's date
//   const today = new Date();
//   const currentDay = today.getDate(); // 1 - 31

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       fetchStudents(userSchool);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedClassName]);

//   useEffect(() => {
//     fetchStudents(userSchool);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedSection]);

//   // Effect to handle Filter By Absence Interval
//   useEffect(() => {
//     if (isFilterByAbsence) {
//       // Fetch students immediately with filter
//       fetchStudents(userSchool);

//       // Set up interval to fetch every 2 minutes
//       filterInterval.current = setInterval(() => {
//         fetchStudents(userSchool);
//       }, 120000); // 120,000 ms = 2 minutes
//     } else {
//       // If filter is off, clear the interval
//       if (filterInterval.current) {
//         clearInterval(filterInterval.current);
//         filterInterval.current = null;
//       }
//       // Fetch students without filter
//       fetchStudents(userSchool);
//     }

//     // Cleanup on unmount
//     return () => {
//       if (filterInterval.current) {
//         clearInterval(filterInterval.current);
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isFilterByAbsence, userSchool]);

//   // Fetch user data: school and custMessage
//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("User not authenticated.");
//       }

//       // Fetch the user's school and custMessage from the profiles table
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("school, custMessage")
//         .eq("id", user.id)
//         .single();

//       if (profileError || !profileData) {
//         throw new Error("Failed to retrieve profile information.");
//       }

//       setUserSchool(profileData.school);
//       setCustMessage(profileData.custMessage || "");
//       setTempCustMessage(profileData.custMessage || "");

//       // Fetch class names for the school
//       fetchClassNames(profileData.school);

//       // Fetch all students initially
//       fetchStudents(profileData.school);
//     } catch (error) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch class names based on the school
//   const fetchClassNames = async (school) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);

//       if (error) throw error;

//       const uniqueClassNames = [...new Set(data.map((item) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch sections based on the selected class
//   const fetchSections = async (className) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("className", className)
//         .neq("section", null);

//       if (error) throw error;

//       const uniqueSections = [...new Set(data.map((item) => item.section))];
//       setSections(uniqueSections);
//     } catch (error) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

// const fetchStudents = async (school) => {
//   try {
//     setIsLoading(true);
//     let query = supabase
//       .from("student")
//       .select("id, studentName, className, section, studentNumber, guardianNumber")
//       .eq("school", school)
//       .order("className", { ascending: true })
//       .order("section", { ascending: true })
//       .order("id", { ascending: true });

//     if (selectedClassName) {
//       query = query.eq("className", selectedClassName);
//     }

//     if (selectedSection) {
//       query = query.eq("section", selectedSection);
//     }

//     const { data, error } = await query;

//     if (error) throw error;

//     // Fetch attendance data
//     await fetchAttendanceData(data);

//     // Apply Filter if active
//     let filteredData = data;
//     if (isFilterByAbsence) {
//       filteredData = data.filter((student) => {
//         const attendance = attendanceData[student.id];
//         if (!attendance) return false;
//         return classTimes.some((time) => attendance[time]);
//       });
//     }

//     // Filter by Student ID
//     if (searchTerm) {
//       filteredData = filteredData.filter((student) =>
//         student.id.toString().includes(searchTerm)
//       );
//     }

//     // Group students by className and section
//     const grouped = {};
//     filteredData.forEach((student) => {
//       const key = `${student.className} - Section ${student.section}`;
//       if (!grouped[key]) {
//         grouped[key] = [];
//       }
//       grouped[key].push(student);
//     });

//     setStudentsGrouped(grouped);
//   } catch (error) {
//     console.error("Error fetching students:", error.message);
//     setAlertMessage("Error fetching students. Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// };


//   // Fetch attendance data for all students
//   const fetchAttendanceData = async (studentsList) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap = {};

//       // Fetch attendance data for each class time
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }

//           // Fetch attendance for the current day from the respective attendance table
//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));

//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }

//           // Map attendance data
//           attendanceDataFetched.forEach((record) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );

//       setAttendanceData(attendanceMap);
//     } catch (error) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Map classTime to attendance table. Adjust this mapping based on your actual table names.
//   const getAttendanceTable = (classTime) => {
//     const mapping = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };

//     return mapping[classTime] || null;
//   };

//   // Handle saving the custom message
//   const handleCustomMessageSave = async () => {
//     try {
//       if (!tempCustMessage.trim()) {
//         setAlertMessage("Custom message cannot be empty.");
//         return;
//       }

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("User not authenticated.");
//       }

//       const { data, error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);

//       if (error) throw error;

//       setCustMessage(tempCustMessage);
//       setAlertMessage("Custom message saved successfully!");
//     } catch (error) {
//       console.error("Error saving custom message:", error.message);
//       setAlertMessage("Error saving custom message. Please try again.");
//     }
//   };

//   // Generate WhatsApp link
//   const generateWhatsAppLink = (number) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   // Handle phone number or student name edit initiation
//   const handleEditClick = (studentId, field, currentValue) => {
//     setEditingCell({ studentId, field });
//     setEditValue(currentValue);
//   };

//   // Handle input change
//   const handleEditChange = (e) => {
//     setEditValue(e.target.value);
//   };

//   // Handle save on blur
//   const handleEditBlur = async (studentId, field) => {
//     try {
//       const updatedValue = editValue.trim();
//       let column = "";

//       if (field === "studentNumber") {
//         column = "studentNumber";
//       } else if (field === "guardianNumber") {
//         column = "guardianNumber";
//       } else if (field === "studentName") {
//         column = "studentName";
//       } else {
//         throw new Error("Invalid field type.");
//       }

//       const { data, error } = await supabase
//         .from("student")
//         .update({ [column]: updatedValue || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       // Update the local state
//       fetchStudents(userSchool);

//       setAlertMessage(
//         `${field === "studentName" ? "Student Name" : field === "studentNumber" ? "Student Number" : "Guardian Number"} updated successfully!`
//       );
//       setEditingCell({ studentId: null, field: null });
//       setEditValue("");
//     } catch (error) {
//       console.error(`Error updating ${field}:`, error.message);
//       setAlertMessage(`Error updating ${field}. Please try again.`);
//     }
//   };

//   // Handle Filter Button Click
//   const handleFilterButtonClick = () => {
//     setIsFilterByAbsence((prev) => !prev);
//   };

//   // Determine if a student has at least one absence
//   const hasAbsence = (studentId) => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((time) => attendance[time] === true);
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Dashboard</h1>
//       <p style={styles.schoolName}>School: {userSchool}</p>

//       {/* Top Section: Filters and Custom Message Side by Side */}
//       <div style={styles.topSection}>
//         {/* Filters Container */}
//         <div style={styles.filterContainer}>
//           <h2 style={styles.subHeader}>Filters</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Class:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedClassName}
//               onChange={(e) => setSelectedClassName(e.target.value)}
//             >
//               <option value="">All Classes</option>
//               {classNames.map((className) => (
//                 <option key={className} value={className}>
//                   {className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Section:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               disabled={!selectedClassName}
//             >
//               <option value="">All Sections</option>
//               {sections.map((section) => (
//                 <option key={section} value={section}>
//                   {section}
//                 </option>
//               ))}
//             </select>
//           </div>

// <div style={styles.formGroup}>
// <label style={styles.label}>Search by Student ID:</label>
// <div style={styles.searchContainer}>
//   <input
//     type="text"
//     placeholder="Enter Student ID"
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//     style={styles.searchInput}
//   />
//   <button
//     onClick={() => fetchStudents(userSchool)} // Trigger the fetchStudents function on search
//     style={styles.searchButton}
//   >
//     Search
//   </button>
// </div>
// </div>
//         </div>




//         <div style={styles.customMessageContainer}>
//           <div style={styles.customMessageInnerContainer}>
//             <textarea
//               placeholder="Type your custom message here..."
//               value={tempCustMessage}
//               onChange={(e) => setTempCustMessage(e.target.value)}
//               style={styles.customMessageInput}
//             />
//             <button
//               onClick={handleCustomMessageSave}
//               style={styles.saveButton}
//               title="Save Message"
//             >
//               ✓
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Button */}
//       <div style={styles.filterButtonContainer}>
//         <button
//           onClick={handleFilterButtonClick}
//           style={{
//             ...styles.filterButton,
//             backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//             color: isFilterByAbsence ? "#fff" : "#000",
//           }}
//         >
//           Filter by absence
//         </button>
//       </div>

//       {/* Student Attendance Table */}
//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : Object.keys(studentsGrouped).length > 0 ? (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Student No</th>
//                 <th style={styles.th}>Guardian No</th>
//                 <th style={styles.th}>Student ID</th>
//                 <th style={styles.th}>Student Name</th>
//                 {classTimes.map((classTime) => (
//                   <th key={classTime} style={styles.th}>
//                     {classTime}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(studentsGrouped).map(([group, students]) => (
//                 <React.Fragment key={group}>
//                   {/* Group Header */}
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                     </td>
//                   </tr>
//                   {/* Students */}
//                   {students.map((student) => (
//                     <tr key={student.id} style={styles.tr}>
//                       {/* Student Number */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "studentNumber" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "studentNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.studentNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.studentNumber)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onDoubleClick={() => handleEditClick(student.id, "studentNumber", student.studentNumber)}
//                             title="Double-click to edit"
//                           >
//                             {student.studentNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       {/* Guardian Number */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "guardianNumber" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "guardianNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.guardianNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.guardianNumber)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onDoubleClick={() => handleEditClick(student.id, "guardianNumber", student.guardianNumber)}
//                             title="Double-click to edit"
//                           >
//                             {student.guardianNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       {/* Student ID */}
//                       <td style={styles.td}>{student.id}</td>

//                       {/* Student Name */}
//                       <td style={styles.td}>
//                         {editingCell.studentId === student.id && editingCell.field === "studentName" ? (
//                           <input
//                             type="text"
//                             value={editValue}
//                             onChange={handleEditChange}
//                             onBlur={() => handleEditBlur(student.id, "studentName")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <span
//                             onDoubleClick={() => handleEditClick(student.id, "studentName", student.studentName)}
//                             title="Double-click to edit"
//                             style={{ cursor: "pointer", display: "inline-block", width: "100%" }}
//                           >
//                             {student.studentName}
//                           </span>
//                         )}
//                       </td>

//                       {/* Attendance Columns */}
//                       {classTimes.map((classTime) => (
//                         <td key={classTime} style={styles.td}>
//                           {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={true}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.redCross} title="Absent">
//                                 ❌
//                               </span>
//                             </label>
//                           ) : (
//                             <label style={styles.checkboxLabel}>
//                               <input
//                                 type="checkbox"
//                                 checked={false}
//                                 disabled
//                                 style={styles.hiddenCheckbox}
//                               />
//                               <span style={styles.emptyCheckbox} title="Present">
//                                 {/* Empty checkbox */}
//                               </span>
//                             </label>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p style={styles.noDataMessage}>
//             No students found for the selected filters.
//           </p>
//         )}
//       </div>

//       {/* Alert Modal */}
//       {alertMessage && (
//         <AlertModal
//           message={alertMessage}
//           onClose={() => setAlertMessage("")}
//         />
//       )}
//     </div>
//   );
// }

// /* Inline Styles */

// const styles = {
//   container: {
//     width: "95%",
//     maxWidth: "1400px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#ffffff",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     borderRadius: "10px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   header: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "10px",
//     textAlign: "center",
//     color: "#333",
//   },
//   schoolName: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     textAlign: "center",
//     color: "#555",
//   },
//   topSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "30px",
//     flexWrap: "wrap",
//   },
//   filterContainer: {
//     backgroundColor: "#f2f2f2",
//     padding: "15px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "46%", // Decreased width to fit side by side
//     minWidth: "300px",
//   },
//   subHeader: {
//     fontSize: "22px",
//     fontWeight: "600",
//     marginBottom: "15px",
//     color: "#444",
//     textAlign: "center",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     display: "flex",
//     flexDirection: "column",
//      width: "100%",  // Ensure it takes up available width
 
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//     color: "#333",
//   },
//   dropdown: {
//     paddingh: "10px",
//     fontSize: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//     width: "100%" 
//   },

// searchContainer: {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// },
// searchInput: {
//   padding: "15px",
//   width: "100%",
// },
// searchButton: {
//   padding: "12px",
//   marginBottom: "17px",
//   marginLeft: "10px",
//   width: "30%",
// },

//   customMessageContainer: {
//     backgroundColor: "#f9f9f9",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     width: "45%", // Decreased width to fit side by side
//     minWidth: "280px",
//     display: "flex",
//     alignItems: "flex-start",
//   },
//   customMessageInnerContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//   },
//   customMessageInput: {
//     width: "95%",
//     height: "192px", // Increased height
//     padding: "10px 15px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     outline: "none",
//     resize: "vertical",
//   },
//   saveButton: {
//     marginTop: "10px",
//     padding: "12px 0",
//     fontSize: "18px",
//     color: "#ffffff",
//     backgroundColor: "#28a745",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//     width: "100%", // Same width as input
//   },
//   tableContainer: {
//     overflowX: "auto",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#fff",
//     padding: "20px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "1000px",
//   },
//   th: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "white",
//   },
//   tr: {
//     borderBottom: "1px solid #dddddd",
//   },
//   td: {
//     border: "1px solid #dddddd",
//     textAlign: "center",
//     padding: "12px",
//     color: "#555",
//     position: "relative",
//   },
//   groupHeaderRow: {
//     backgroundColor: "#f1f1f1",
//   },
//   groupHeader: {
//     fontSize: "18px",
//     fontWeight: "600",
//     textAlign: "left",
//     padding: "10px",
//     color: "#333",
//   },
//   phoneLink: {
//     color: "#007bff",
//     textDecoration: "underline",
//     cursor: "pointer",
//   },
//   absentIcon: {
//     color: "#ff4d4d",
//     fontSize: "18px",
//   },
//   presentIcon: {
//     color: "#28a745",
//     fontSize: "18px",
//   },
//   noDataMessage: {
//     textAlign: "center",
//     color: "#777",
//     fontSize: "18px",
//   },
//   loadingText: {
//     textAlign: "center",
//     color: "#555",
//     fontSize: "18px",
//   },
//   editInput: {
//     width: "100%",
//     padding: "5px 10px",
//     fontSize: "14px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     outline: "none",
//   },
//   checkboxLabel: {
//     position: "relative",
//     display: "inline-block",
//     width: "20px",
//     height: "20px",
//     cursor: "default", // Prevent cursor change since it's disabled
//   },
//   hiddenCheckbox: {
//     opacity: 0,
//     width: 0,
//     height: 0,
//   },
//   redCross: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffcccc",
//     border: "1px solid #ff4d4d",
//     borderRadius: "4px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#ff0000",
//     fontSize: "14px",
//   },
//   emptyCheckbox: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "20px",
//     width: "20px",
//     backgroundColor: "#ffffff",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     // Optional: add hover effects or other styles
//   },
//   filterButtonContainer: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginBottom: "10px",
//   },
//   filterButton: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     transition: "background-color 0.3s, color 0.3s",
//   },
// };

// export default DashBoard;


import React, { useState, useEffect, useRef } from "react";
import supabase from "../../supabase";
import AlertModal from "./../AlertModal"; // Ensure you have this component
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentsGrouped, setStudentsGrouped] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState({ studentId: null, type: null });
  const [phoneValues, setPhoneValues] = useState({ studentNumber: "", guardianNumber: "" });
  const inputRef = useRef(null);
  const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);

const hasAbsence = (studentId) => {
  const attendance = attendanceData[studentId];
  if (!attendance) return false;
  return classTimes.some((classTime) => !attendance[classTime]);
};


  // Define class times
  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];

  // Get today's date
  const today = new Date();
  const currentDay = today.getDate(); // 1 - 31

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassName) {
      fetchSections(selectedClassName);
    } else {
      setSections([]);
      setSelectedSection("");
      fetchStudents(userSchool);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassName]);

  useEffect(() => {
    fetchStudents(userSchool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  // Fetch user data: school and custMessage
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated.");
      }

      // Fetch the user's school and custMessage from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("school, custMessage")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        throw new Error("Failed to retrieve profile information.");
      }

      setUserSchool(profileData.school);
      setCustMessage(profileData.custMessage || "");
      setTempCustMessage(profileData.custMessage || "");

      // Fetch class names for the school
      fetchClassNames(profileData.school);

      // Fetch all students initially
      fetchStudents(profileData.school);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setAlertMessage("Error fetching user information. Please try again.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch class names based on the school
  const fetchClassNames = async (school) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school)
        .neq("className", null);

      if (error) throw error;

      const uniqueClassNames = [...new Set(data.map((item) => item.className))];
      setClassNames(uniqueClassNames);
    } catch (error) {
      console.error("Error fetching class names:", error.message);
      setAlertMessage("Error fetching class names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sections based on the selected class
  const fetchSections = async (className) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("className", className)
        .neq("section", null);

      if (error) throw error;

      const uniqueSections = [...new Set(data.map((item) => item.section))];
      setSections(uniqueSections);
    } catch (error) {
      console.error("Error fetching sections:", error.message);
      setAlertMessage("Error fetching sections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch students based on selected filters
  const fetchStudents = async (school) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("student")
        .select("id, studentName, className, section, studentNumber, guardianNumber")
        .eq("school", school)
        .order("className", { ascending: true })
        .order("section", { ascending: true })
        .order("id", { ascending: true });

      if (selectedClassName) {
        query = query.eq("className", selectedClassName);
      }

      if (selectedSection) {
        query = query.eq("section", selectedSection);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group students by className and section
      const grouped = {};
      data.forEach((student) => {
        const key = `${student.className} - Section ${student.section}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(student);
      });

      setStudentsGrouped(grouped);

      // Fetch attendance data
      await fetchAttendanceData(data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
      setAlertMessage("Error fetching students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attendance data for all students
  const fetchAttendanceData = async (studentsList) => {
    try {
      setIsLoading(true);
      const attendanceMap = {};

      // Fetch attendance data for each class time
      await Promise.all(
        classTimes.map(async (classTime) => {
          const attendanceTable = getAttendanceTable(classTime);
          if (!attendanceTable) {
            console.warn(`No attendance table mapped for class time: ${classTime}`);
            return;
          }

          // Fetch attendance for the current day from the respective attendance table
          const { data: attendanceDataFetched, error: attendanceError } = await supabase
            .from(attendanceTable)
            .select(`id, "${currentDay}"`)
            .in("id", studentsList.map((student) => student.id));

          if (attendanceError) {
            console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
            return;
          }

          // Map attendance data
          attendanceDataFetched.forEach((record) => {
            if (!attendanceMap[record.id]) {
              attendanceMap[record.id] = {};
            }
            attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
          });
        })
      );

      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error("Error fetching attendance data:", error.message);
      setAlertMessage("Error fetching attendance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Map classTime to attendance table. Adjust this mapping based on your actual table names.
  const getAttendanceTable = (classTime) => {
    const mapping = {
      C1: "C1",
      C2: "C2",
      C3: "C3",
      C4: "C4",
      C5: "C5",
      C6: "C6",
    };

    return mapping[classTime] || null;
  };

  // Handle saving the custom message
  const handleCustomMessageSave = async () => {
    try {
      if (!tempCustMessage.trim()) {
        setAlertMessage("Custom message cannot be empty.");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ custMessage: tempCustMessage })
        .eq("id", user.id);

      if (error) throw error;

      setCustMessage(tempCustMessage);
      setAlertMessage("Custom message saved successfully!");
    } catch (error) {
      console.error("Error saving custom message:", error.message);
      setAlertMessage("Error saving custom message. Please try again.");
    }
  };

  // Generate WhatsApp link
  const generateWhatsAppLink = (number) => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;

    if (custMessage.trim()) {
      return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
    } else {
      return `https://wa.me/${sanitizedNumber}`;
    }
  };

  // Handle phone number edit initiation
  const handleEditClick = (studentId, type, currentValue) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };

  // Handle phone number change
  const handlePhoneChange = (e) => {
    setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
  };

  // Handle phone number save on blur
  const handlePhoneBlur = async (studentId, type) => {
    try {
      const updatedNumber = phoneValues[type].trim();
      let column = "";

      if (type === "studentNumber") {
        column = "studentNumber";
      } else if (type === "guardianNumber") {
        column = "guardianNumber";
      } else {
        throw new Error("Invalid phone type.");
      }

      const { data, error } = await supabase
        .from("student")
        .update({ [column]: updatedNumber || null })
        .eq("id", studentId);

      if (error) throw error;

      // Update the local state
      fetchStudents(userSchool);

      setAlertMessage("Phone number updated successfully!");
      setEditingPhone({ studentId: null, type: null });
      setPhoneValues({ studentNumber: "", guardianNumber: "" });
    } catch (error) {
      console.error("Error updating phone number:", error.message);
      setAlertMessage("Error updating phone number. Please try again.");
    }
  };

  // Handle phone number cancel (optional since save is on blur)
  const handlePhoneCancel = () => {
    setEditingPhone({ studentId: null, type: null });
    setPhoneValues({ studentNumber: "", guardianNumber: "" });
  };

  const handleLongPress = (studentId, type, currentValue) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };
  
  const handlePointerDown = (studentId, type, currentValue) => {
    const longPressTimeout = setTimeout(() => {
      handleLongPress(studentId, type, currentValue);
    }, 500); // 500ms for long press
  
    inputRef.current = longPressTimeout;
  };
  
  const handlePointerUpOrLeave = () => {
    clearTimeout(inputRef.current);
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Dashboard</h1>
      <p style={styles.schoolName}>{userSchool}</p>

      {/* Top Section: Filters and Custom Message Side by Side */}
      <div style={styles.topSection}>
        {/* Filters Container */}
        <div style={styles.filterContainer}>
          <h2 style={styles.subHeader}>Filters</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Class:</label>
            <select
              style={styles.dropdown}
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
            >
              <option value="">All Classes</option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Section:</label>
            <select
              style={styles.dropdown}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClassName}
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Message Container */}
        <div style={styles.customMessageContainer}>
          <div style={styles.customMessageInnerContainer}>
            <textarea
              placeholder="Type your custom message here..."
              value={tempCustMessage}
              onChange={(e) => setTempCustMessage(e.target.value)}
              style={styles.customMessageInput}
            />
            <button
              onClick={handleCustomMessageSave}
              style={styles.saveButton}
              title="Save Message"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: "20px" }}>
  {/* Button Container */}
  <div style={{ position: "absolute", right: "0" }}>
    <button
      style={{
        padding: "15px 30px",
        marginTop: '-30px',
        marginRight: '20px',
        fontSize: "16px",
        backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
        color: isFilterByAbsence ? "#fff" : "#000",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
      }}
      onClick={() => setIsFilterByAbsence((prev) => !prev)}
    >
      Filter by Absence
    </button>
  </div>
</div>


      {/* Student Attendance Table */}
      <div style={styles.tableContainer}>
        {isLoading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : Object.keys(studentsGrouped).length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student No</th>
                <th style={styles.th}>Guardian No</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Student Name</th>
                {classTimes.map((classTime) => (
                  <th key={classTime} style={styles.th}>
                    {classTime}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(studentsGrouped).map(([group, students]) => (
                <React.Fragment key={group}>
                  {/* Group Header */}
                  <tr style={styles.groupHeaderRow}>
                    <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
                      {group}
                    </td>
                  </tr>
                  {/* Students */}
                  {students
                  .filter((student) => !isFilterByAbsence || hasAbsence(student.id))
                  .map((student) => (
                    <tr key={student.id} style={styles.tr}>
                      {/* Student Number */}
                      <td style={styles.td}>
  {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
    <input
      type="text"
      name="studentNumber"
      value={phoneValues.studentNumber}
      onChange={handlePhoneChange}
      onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
      autoFocus
      style={styles.editInput}
    />
  ) : student.studentNumber ? (
    <a
      href={generateWhatsAppLink(student.studentNumber)}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.phoneLink}
      onPointerDown={() =>
        handlePointerDown(student.id, "studentNumber", student.studentNumber)
      }
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      title="Hold to edit"
    >
      {student.studentNumber}
    </a>
  ) : (
    ""
  )}
</td>

{/* Guardian Number */}
<td style={styles.td}>
  {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
    <input
      type="text"
      name="guardianNumber"
      value={phoneValues.guardianNumber}
      onChange={handlePhoneChange}
      onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
      autoFocus
      style={styles.editInput}
    />
  ) : student.guardianNumber ? (
    <a
      href={generateWhatsAppLink(student.guardianNumber)}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.phoneLink}
      onPointerDown={() =>
        handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
      }
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      title="Hold to edit"
    >
      {student.guardianNumber}
    </a>
  ) : (
    ""
  )}
</td>

                      {/* Student ID */}
                      <td style={styles.td}>{student.id}</td>

                      {/* Student Name */}
                      <td style={styles.td}>{student.studentName}</td>

                      {/* Attendance Columns */}
                      {classTimes.map((classTime) => (
                        <td key={classTime} style={styles.td}>
                          {attendanceData[student.id] && attendanceData[student.id][classTime] === true ? (
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={true}
                                disabled
                                style={styles.hiddenCheckbox}
                              />
                              <span style={styles.redCross} title="Absent">
                                ❌
                              </span>
                            </label>
                          ) : (
                            <label style={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={false}
                                disabled
                                style={styles.hiddenCheckbox}
                              />
                              <span style={styles.emptyCheckbox} title="Present">
                                {/* Empty checkbox */}
                              </span>
                            </label>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noDataMessage}>
            No students found for the selected filters.
          </p>
        )}
      </div>

      {/* Alert Modal */}
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
}

/* Inline Styles */

const styles = {
  container: {
    width: "95%",
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#000",
    boxShadow: "0 4px 20px 1px #007BA7",
  
    borderRadius: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    textAlign: "center",
    color: "#e0e0e0",
  },
  schoolName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
    color: "#b0b0b0",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  filterContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "48%",
    minWidth: "280px",
    boxShadow: "0 2px 12px 1px #000",
  },
  subHeader: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#555",
    color: "#fff",
    padding: "15px",
    fontSize: "22px",
    border: "1px solid #555",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  customMessageContainer: {
    backgroundColor: "#000",
    paddingHorizontal: "25px",
    marginRight: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "48%",
    minWidth: "280px",
    display: "flex",
    alignItems: "flex-start",
  },
  customMessageInnerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",

  },
  customMessageInput: {
    width: "100%",
    height: "160px", // Increased height
    padding: "12px 15px",
    fontSize: "16px",
    color: "#000",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    outline: "none",
    resize: "vertical",
    backgroundColor: "#f1f1f1",
  },
  saveButton: {
    marginTop: "10px",
    padding: "10px 0",
    fontSize: "18px",
    color: "#ffffff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "100%", // Same width as input
  },
  tableContainer: {
    marginTop: '50px',
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  table: {
    
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },
  th: {
    border: "1px solid #dddddd",
    textAlign: "center",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
  },
  tr: {
    borderBottom: "1px solid #dddddd",
  },
  td: {
    border: "1px solid #dddddd",
    textAlign: "center",
    padding: "12px",
    color: "#555",
    position: "relative",
  },
  groupHeaderRow: {
    backgroundColor: "#f1f1f1",
  },
  groupHeader: {
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "left",
    padding: "10px",
    color: "#333",
  },
  phoneLink: {
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    backgroundColor: "#f9f9f9"
  },
  absentIcon: {
    color: "#ff4d4d",
    fontSize: "18px",
  },
  presentIcon: {
    color: "#28a745",
    fontSize: "18px",
  },
  noDataMessage: {
    textAlign: "center",
    color: "#777",
    fontSize: "18px",
  },
  loadingText: {
    textAlign: "center",
    color: "#555",
    fontSize: "18px",
  },
  editInput: {
    width: "100%",
    padding: "5px 10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
  checkboxLabel: {
    position: "relative",
    display: "inline-block",
    width: "20px",
    height: "20px",
    cursor: "default", // Prevent cursor change since it's disabled
  },
  hiddenCheckbox: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  redCross: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "20px",
    width: "20px",
    backgroundColor: "#ffcccc",
    border: "1px solid #ff4d4d",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff0000",
    fontSize: "14px",
  },
  emptyCheckbox: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "20px",
    width: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    // Optional: add hover effects or other styles
  },
};

export default DashBoard;
