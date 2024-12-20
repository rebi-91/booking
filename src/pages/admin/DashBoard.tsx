// //Show simple succesfull alerts
// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import supabase from "../../supabase";
// import AlertModal from "./../AlertModal";
// import { useNavigate } from "react-router-dom";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
//   const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef<number | null>(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);
  
  
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
//   const today = new Date();
//   const currentDay = today.getDate();
//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [showCalendar, setShowCalendar] = useState(false); // Show/hide calendar
// const [displayDate, setDisplayDate] = useState(
//   `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
// );

//   const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

//   // For Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);

//   //Handle Group Collapse/Expand
//   const toggleGroup = (group: string) => {
//     setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
//   };  

//   // For Editing Student Name
//   const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
//   const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

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

//   // Re-fetch students every 2 minutes if filter by absence is ON
//   useEffect(() => {
//     let intervalId: number | undefined;
//     if (isFilterByAbsence) {
//       intervalId = window.setInterval(() => {
//         fetchStudents(userSchool);
//       }, 120000); // 2 minutes
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isFilterByAbsence, userSchool]);

//   const hasAbsence = (studentId: string): boolean => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((classTime) => attendance[classTime]);
//   };

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

//       fetchClassNames(profileData.school);
//       fetchStudents(profileData.school);
//     } catch (error: any) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/sign-up");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchClassNames = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);

//       if (error) throw error;

//       const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error: any) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSections = async (className: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("className", className)
//         .neq("section", null);

//       if (error) throw error;

//       const uniqueSections = [...new Set(data.map((item: any) => item.section))];
//       setSections(uniqueSections);
//     } catch (error: any) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStudents = async (school: string) => {
//     try {
//       setIsLoading(true);
//       let query = supabase
//         .from("student")
//         .select("id, studentName, className, section, studentNumber, guardianNumber")
//         .eq("school", school)
//         .order("className", { ascending: true })
//         .order("section", { ascending: true })
//         .order("id", { ascending: true });

//       if (selectedClassName) {
//         query = query.eq("className", selectedClassName);
//       }

//       if (selectedSection) {
//         query = query.eq("section", selectedSection);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const grouped: Record<string, any[]> = {};
//       data.forEach((student: any) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });

//       setStudentsGrouped(grouped);
//       await fetchAttendanceData(data);

//       // Handle Search Suggestions
//       if (searchTerm) {
//         // filter suggestions from data
//         // const matchSuggestions = data.filter((student: any) => {
//         //   const name = student.studentName.toLowerCase();
//         //   const term = searchTerm.toLowerCase();
//         //   return name.includes(term);
//         // });
//         const matchSuggestions = data.filter((student: any) => {
//           const name = student.studentName.toLowerCase();
//           const id = student.id.toString();
//           const term = searchTerm.toLowerCase();
//           return name.includes(term) || id.includes(term);
//         });
//         setSuggestions(matchSuggestions);
//       } else {
//         setSuggestions([]);
//       }

//     } catch (error: any) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     //Calendar date 
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const day = parseInt(e.target.value, 10);
//     setSelectedDate(day);
//     fetchAttendanceDataForDay(day);
//   };

//   const fetchAttendanceDataForDay = async (day: number) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const { data, error } = await supabase
//             .from(classTime)
//             .select(`id, "${day}"`)
//             .in("id", Object.values(studentsGrouped).flat().map((s) => s.id));
  
//           if (!error) {
//             data.forEach((record: any) => {
//               if (!attendanceMap[record.id]) attendanceMap[record.id] = {};
//               attendanceMap[record.id][classTime] = record[day] === true;
//             });
//           }
//         })
//       );
//       setAttendanceData(attendanceMap);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
  
//   const fetchAttendanceData = async (studentsList: any[]) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};

//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }

//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));

//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }

//           attendanceDataFetched.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );

//       setAttendanceData(attendanceMap);
//     } catch (error: any) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getAttendanceTable = (classTime: string) => {
//     const mapping: Record<string, string> = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };

//     return mapping[classTime] || null;
//   };

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

//       const { error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);

//       if (error) throw error;

//       setCustMessage(tempCustMessage);
//       setAlertMessage("Custom message saved successfully!");
//     } catch (error: any) {
//       console.error("Error saving custom message:", error.message);
//       setAlertMessage("Error saving custom message. Please try again.");
//     }
//   };

//   const generateWhatsAppLink = (number: string) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   const handleEditClick = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   const handlePhoneBlur = async (studentId: number, type: string) => {
//     try {
//       const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
//       let column = type;

//       const { error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       fetchStudents(userSchool);
//       setAlertMessage("Phone number updated successfully!");
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error: any) {
//       console.error("Error updating phone number:", error.message);
//       setAlertMessage("Error updating phone number. Please try again.");
//     }
//   };

//   const handlePhoneCancel = () => {
//     setEditingPhone({ studentId: null, type: null });
//     setPhoneValues({ studentNumber: "", guardianNumber: "" });
//   };

//   const handleLongPress = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePointerDown = (studentId: number, type: string, currentValue: string) => {
//     const longPressTimeout = window.setTimeout(() => {
//       handleLongPress(studentId, type, currentValue);
//     }, 500);
//     inputRef.current = longPressTimeout;
//   };

//   const handlePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   // Editing Student Name logic
//   const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
//     const timeoutId = window.setTimeout(() => {
//       setEditingStudentNameId(studentId);
//       setEditingStudentNameValue(currentValue);
//     }, 500);
//     inputRef.current = timeoutId;
//   };

//   const handleStudentNamePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleStudentNameBlur = async (studentId: number) => {
//     try {
//       const updatedName = editingStudentNameValue.trim();
//       if (!updatedName) {
//         setEditingStudentNameId(null);
//         return;
//       }

//       const { error } = await supabase
//         .from("student")
//         .update({ studentName: updatedName })
//         .eq("id", studentId);

//       if (error) throw error;

//       setEditingStudentNameId(null);
//       fetchStudents(userSchool);
//       setAlertMessage("Student name updated successfully!");
//     } catch (error: any) {
//       console.error("Error updating student name:", error.message);
//       setAlertMessage("Error updating student name. Please try again.");
//     }
//   };

//   // Search logic
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (!value) {
//       setSuggestions([]);
//       setFilteredStudentId(null);
//     } else {
//       // suggestions are generated in fetchStudents after the list is fetched.
//       // Just trigger fetch to update suggestions.
//       fetchStudents(userSchool);
//     }
//   };

//   const handleSuggestionClick = (student: any) => {
//     setSearchTerm(student.studentName);
//     setFilteredStudentId(student.id);
//     setSuggestions([]);
//   };

//   const filteredStudents = () => {
//     let allStudents: any[] = [];
//     Object.values(studentsGrouped).forEach((list) => {
//       allStudents = allStudents.concat(list);
//     });

//     if (isFilterByAbsence) {
//       allStudents = allStudents.filter((student) => hasAbsence(student.id));
//     }

//     if (filteredStudentId !== null) {
//       allStudents = allStudents.filter((student) => student.id === filteredStudentId);
//     }

//     return allStudents;
//   };

//   const groupedFilteredStudents = () => {
//     const grouped: Record<string, any[]> = {};
//     filteredStudents().forEach((student) => {
//       const key = `${student.className} - Section ${student.section}`;
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(student);
//     });
//     return grouped;
//   };

//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#000",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     header: {
//       fontSize: "32px",
//       fontWeight: "700",
//       marginBottom: "5px",
//       textAlign: "center",
//       color: "#e0e0e0",
//     },
//     schoolName: {
//       fontSize: "20px",
//       fontWeight: "600",
//       marginBottom: "25px",
//       textAlign: "center",
//       color: "#b0b0b0",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "13px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       width: "48%",
//       minWidth: "280px",
//     },
//     subHeader: {
//       fontSize: "22px",
//       fontWeight: "600",
//       marginBottom: "0px",
//       color: "#fff",
//       textAlign: "center",
//     },
//     formGroup: {
//       marginBottom: "3px",
//       marginTop: "13px",
//       display: "flex",
//       flexDirection: "column",
//     },
//     label: {
//       marginBottom: "4px",
//       marginTop: "4px",
//       fontWeight: "500",
//       color: "#fff",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "20px",
//       fontSize: "22px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//       marginTop: "-4px"
//     },
//     inputField: {
//       backgroundColor: "#555",
//       marginTop: "-1px",
//       color: "#fff",
//       padding: "12px",
//       width: '100%',
//       fontSize: "18px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//     },
//     customMessageContainer: {
//       backgroundColor: "#000",
//       padding: "0 25px",
//       marginRight: "-15px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       width: "53%",
//       minWidth: "280px",
//       display: "flex",
//       alignItems: "flex-start",
//     },
//     customMessageInnerContainer: {
//       width: "100%",
//       display: "flex",
//       flexDirection: "column",
//     },
//     customMessageInput: {
//       width: "100%",
//       height: "200px",
//       padding: "12px 15px",
//       fontSize: "16px",
//       color: "#000",
//       border: "1px solid #2a2a2a",
//       borderRadius: "8px",
//       outline: "none",
//       resize: "vertical",
//       backgroundColor: "#f1f1f1",
//     },
//     saveButton: {
//       marginTop: "10px",
//       padding: "10px",
//       fontSize: "20px",
//       color: "#ffffff",
//       backgroundColor: "#007bff",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "background-color 0.3s",
//       width: "100%",
//     },
//     tableContainer: {
//       marginTop: "50px",
//       overflowX: "auto",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       backgroundColor: "#f9f9f9",
//       padding: "12px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       minWidth: "1000px",
//       // tableLayout: "fixed"
//     },
//     th: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "2px 2px",
//       backgroundColor: "#007bff",
//       color: "white",
//     },
//     tr: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: '18px',
//       textAlign: "right",
      
//     },
//     tr2: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: '18px',
//       textAlign: "center",
      
//     },
//     td: {
//       border: "1px solid #dddddd",
//       textAlign: "right",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     td2: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     groupHeaderRow: {
//       backgroundColor: "#f1f1f1",
//     },
//     groupHeader: {
//       fontSize: "18px",
//       fontWeight: "600",
//       textAlign: "left",
//       padding: "10px",
//       color: "#333",
//     },
//     phoneLink: {
//       color: "#007bff",
//       textDecoration: "underline",
//       cursor: "pointer",
//       backgroundColor: "#f9f9f9"
//     },
//     noDataMessage: {
//       textAlign: "center",
//       color: "#777",
//       fontSize: "18px",
//     },
//     loadingText: {
//       textAlign: "center",
//       color: "#555",
//       fontSize: "18px",
//     },
//     editInput: {
//       width: "100%",
//       padding: "5px 10px",
//       fontSize: "14px",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//       outline: "none",
//     },
//     checkboxLabel: {
//       position: "relative",
//       display: "inline-block",
//       width: "20px",
//       height: "20px",
//       cursor: "default",
//     },
//     hiddenCheckbox: {
//       opacity: 0,
//       width: 0,
//       height: 0,
//     },
//     redCross: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffcccc",
//       border: "1px solid #ff4d4d",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#ff0000",
//       fontSize: "14px",
//     },
//     emptyCheckbox: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffffff",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//     },
//     suggestionContainer: {
//       position: "relative",
//     },
//     suggestionsList: {
//       position: "absolute",
//       top: "100%",
//       left: 0,
//       width: "100%",
//       backgroundColor: "#222",
//       border: "1px solid #ccc",
//       borderRadius: "5px",
//       zIndex: 999,
//       maxHeight: "200px",
//       overflowY: "auto",
//     },
//     suggestionItem: {
//       padding: "10px",
//       cursor: "pointer",
//       borderBottom: "1px solid #ddd",
//       color: "#007bff", // Blue text
//       backgroundColor: "#e0e1e0", // Light grey background
//       transition: "background-color 0.3s",
//     },    
//   };

//   const groupedStudentsToShow = groupedFilteredStudents();

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Dashboard</h1>
//       <p style={styles.schoolName}>{userSchool}</p>

//       {/* Top Section */}
//       <div style={styles.topSection}>
//         {/* Filter Container */}
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

//           {/* Search Input */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Search by Name:</label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 style={styles.inputField}
//                 placeholder="Student Name or Student ID..."
//               />
//               {suggestions.length > 0 && (
//                 <div style={styles.suggestionsList}>
//                   {suggestions.map((student: any) => (
//                     <div
//                       key={student.id}
//                       style={styles.suggestionItem}
//                       onClick={() => handleSuggestionClick(student)}
//                     >
//                       {/* {student.studentName} */}
//                       {`${student.studentName} (ID: ${student.id})`}
//                     </div>
//                   ))}
//                 </div>
//               )}
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
      
      
// {/* Container for both the "Filter by Absence" and "Select Date" */}
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "0px",
//   }}
// >
//   {/* Select Date Section */}
//   <div style={{ position: "relative", marginBottom: "-45px" }}>
//   <div style={{ display: "flex", alignItems: "center" }}>
//     <input
//       type="text"
//       value={displayDate}
//       readOnly
//       style={{
//         padding: "7px",
//         borderRadius: "5px",
//         border: "1px solid #ccc",
//         fontSize: "16px",
//         width: "220px",
//         height: "40px",
//         marginRight: "10px",
//       }}
//     />
//     <span
//       style={{ cursor: "pointer", fontSize: "39px",marginTop: "12px" }}
//       onClick={() => setShowCalendar((prev) => !prev)}
//       title="Open Calendar"
//     >
//       📅
//     </span>
//   </div>

//   {showCalendar && (
//     <div
//       style={{
//         position: "absolute",
//         top: "calc(100% + 5px)", // Positions below the input
//         backgroundColor: "#f9f9f9",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         padding: "10px",
//         zIndex: 999,
//         boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//       }}
//     >
//       <h4 style={{ margin: "0 0 10px", textAlign: "center", color: "black" }}>Select a Day</h4>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(7, 1fr)",
//           gap: "5px",
//         }}
//       >
//         {Array.from(
//           { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
//           (_, index) => index + 1
//         ).map((day) => (
//           <div
//             key={day}
//             onClick={() => {
//               setSelectedDate(day);
//               setDisplayDate(
//                 `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
//               );
//               setShowCalendar(false); // Hide calendar
//               fetchAttendanceDataForDay(day); // Fetch attendance for selected day
//             }}
//             style={{
//               textAlign: "center",
//               cursor: "pointer",
//               padding: "8px",
//               borderRadius: "50%",
//               backgroundColor: day === selectedDate ? "#007BFF" : "#fff",
//               color: day === selectedDate ? "#fff" : "#000",
//               fontWeight: "bold",
//               transition: "background-color 0.2s",
//             }}
//           >
//             {day}
//           </div>
//         ))}
//       </div>
//     </div>
//   )}
// </div>


//   {/* Filter by Absence Section */}
//   <div>
//     <button
//       style={{
//         padding: "10px 20px",
//         fontSize: "16px",
//         backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//         color: isFilterByAbsence ? "#fff" : "#000",
//         border: "none",
//         borderRadius: "10px",
//         cursor: "pointer",
//         boxSizing: "border-box",
//         marginBottom: "-40px"
//       }}
//       onClick={() => setIsFilterByAbsence((prev) => !prev)}
//     >
//       Filter by Absence
//     </button>
//   </div>
// </div>


//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : Object.keys(groupedStudentsToShow).length > 0 ? (
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
//               {Object.entries(groupedStudentsToShow).map(([group, students]) => (
//                 <React.Fragment key={group}>
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                       {/* <button
//                       onClick={() => toggleGroup(group)}
//                       style={{
//                         float: "right",
//                         background: "black",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: "16px",
//                         width: "230px"
//                       }}
//                       title="Toggle Group"
//                     >
//                       {collapsedGroups[group] ? "▼" : "▲"}
//                     </button> */}
//                     </td>
//                   </tr>
//                   {!collapsedGroups[group] &&
//                   students.map((student: any) => (
//                     <tr key={student.id} style={styles.tr}>
//                       {/* Student No Edit */}
//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//                           <input
//                             type="text"
//                             name="studentNumber"
//                             value={phoneValues.studentNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.studentNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.studentNumber) || undefined}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "studentNumber", student.studentNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.studentNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       {/* Guardian No Edit */}
//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//                           <input
//                             type="text"
//                             name="guardianNumber"
//                             value={phoneValues.guardianNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : student.guardianNumber ? (
//                           <a
//                             href={generateWhatsAppLink(student.guardianNumber) || undefined}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.guardianNumber}
//                           </a>
//                         ) : (
//                           ""
//                         )}
//                       </td>

//                       <td style={styles.td2}>{student.id}</td>

//                       {/* Student Name Edit on Long Press */}
//                       <td style={styles.td}>
//                         {editingStudentNameId === student.id ? (
//                           <input
//                             type="text"
//                             value={editingStudentNameValue}
//                             onChange={(e) => setEditingStudentNameValue(e.target.value)}
//                             onBlur={() => handleStudentNameBlur(student.id)}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <span
//                             onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
//                             onPointerUp={handleStudentNamePointerUpOrLeave}
//                             onPointerLeave={handleStudentNamePointerUpOrLeave}
//                             title="Hold to edit"
//                             style={{ cursor: "pointer" }}
//                           >
//                             {student.studentName}
//                           </span>
//                         )}
//                       </td>

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
//                               <span style={styles.emptyCheckbox} title="Present" />
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
//           <p style={styles.noDataMessage}>No students found for the selected filters.</p>
//         )}
//       </div>

//       {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
//     </div>
//   );
// }

// export default DashBoard;



//Show simple succesfull alerts + PDF save 


// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import supabase from "../../supabase";
// import AlertModal from "./../AlertModal";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import domtoimage from "dom-to-image-more";

// function DashBoard() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
//   const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [custMessage, setCustMessage] = useState("");
//   const [tempCustMessage, setTempCustMessage] = useState("");
//   const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
//   const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
//   const inputRef = useRef<number | null>(null);
//   const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);
//   const container = document.querySelector("#your-container-id");
  
//   domtoimage.toPng(container)
//     .then((dataUrl) => {
//       // Set the preview image source
//       setPdfPreview(dataUrl);
  
//       // Show the preview modal
//       setShowPreviewModal(true);
//     })
//     .catch((error) => {
//       console.error("Error generating image:", error);
//     });
  
  
//   const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
//   const today = new Date();
//   const currentDay = today.getDate();
//   const [selectedDate, setSelectedDate] = useState(today.getDate());
//   const [showCalendar, setShowCalendar] = useState(false); // Show/hide calendar
//   const [displayDate, setDisplayDate] = useState(
//     `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
//   );
  
//   const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  
//   // For Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);
//   const [pdfPreview, setPdfPreview] = useState<string | null>(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);



//   const generatePreview = () => {
//     const container = document.getElementById("your-container-id");
//     if (!container) {
//       showSuccessAlert("No content available to generate preview.");
//       return;
//     }
  
//     html2canvas(container, { scale: 2, useCORS: true })
//       .then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         setPdfPreview(imgData); // Store preview image
//         setShowPreviewModal(true); // Show the modal
//       })
//       .catch((error) => {
//         console.error("Error generating preview:", error);
//         showSuccessAlert("Error generating preview. Please try again.");
//       });
//   };
//   const savePDF = () => {
//     if (!pdfPreview) {
//       showSuccessAlert("No preview available to save.");
//       return;
//     }
  
//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgWidth = 210; // A4 width in mm
//     const imgHeight = (297 * imgWidth) / 210; // Maintain aspect ratio
  
//     pdf.addImage(pdfPreview, "PNG", 0, 0, imgWidth, imgHeight);
//     pdf.save(`Attendance_${userSchool}_${displayDate}.pdf`);
//     showSuccessAlert("PDF saved successfully!");
//     setShowPreviewModal(false);
//   };
  
  
//   //Handle Group Collapse/Expand
//   const toggleGroup = (group: string) => {
//     setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
//   };  

//   // For Editing Student Name
//   const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
//   const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

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

//   // Re-fetch students every 2 minutes if filter by absence is ON
//   useEffect(() => {
//     let intervalId: number | undefined;
//     if (isFilterByAbsence) {
//       intervalId = window.setInterval(() => {
//         fetchStudents(userSchool);
//       }, 120000); // 2 minutes
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [isFilterByAbsence, userSchool]);

//   const hasAbsence = (studentId: string): boolean => {
//     const attendance = attendanceData[studentId];
//     if (!attendance) return false;
//     return classTimes.some((classTime) => attendance[classTime]);
//   };

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

//       fetchClassNames(profileData.school);
//       fetchStudents(profileData.school);
//     } catch (error: any) {
//       console.error("Error fetching user data:", error.message);
//       setAlertMessage("Error fetching user information. Please try again.");
//       navigate("/sign-up");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchClassNames = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("className")
//         .eq("school", school)
//         .neq("className", null);

//       if (error) throw error;

//       const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
//       setClassNames(uniqueClassNames);
//     } catch (error: any) {
//       console.error("Error fetching class names:", error.message);
//       setAlertMessage("Error fetching class names. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSections = async (className: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("section")
//         .eq("className", className)
//         .neq("section", null);

//       if (error) throw error;

//       const uniqueSections = [...new Set(data.map((item: any) => item.section))];
//       setSections(uniqueSections);
//     } catch (error: any) {
//       console.error("Error fetching sections:", error.message);
//       setAlertMessage("Error fetching sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchStudents = async (school: string) => {
//     try {
//       setIsLoading(true);
//       let query = supabase
//         .from("student")
//         .select("id, studentName, className, section, studentNumber, guardianNumber")
//         .eq("school", school)
//         .order("className", { ascending: true })
//         .order("section", { ascending: true })
//         .order("id", { ascending: true });

//       if (selectedClassName) {
//         query = query.eq("className", selectedClassName);
//       }

//       if (selectedSection) {
//         query = query.eq("section", selectedSection);
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const grouped: Record<string, any[]> = {};
//       data.forEach((student: any) => {
//         const key = `${student.className} - Section ${student.section}`;
//         if (!grouped[key]) {
//           grouped[key] = [];
//         }
//         grouped[key].push(student);
//       });

//       setStudentsGrouped(grouped);
//       await fetchAttendanceData(data);

//       // Handle Search Suggestions
//       if (searchTerm) {
//         // filter suggestions from data
//         // const matchSuggestions = data.filter((student: any) => {
//         //   const name = student.studentName.toLowerCase();
//         //   const term = searchTerm.toLowerCase();
//         //   return name.includes(term);
//         // });
//         const matchSuggestions = data.filter((student: any) => {
//           const name = student.studentName.toLowerCase();
//           const id = student.id.toString();
//           const term = searchTerm.toLowerCase();
//           return name.includes(term) || id.includes(term);
//         });
//         setSuggestions(matchSuggestions);
//       } else {
//         setSuggestions([]);
//       }

//     } catch (error: any) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     //Calendar date 
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const day = parseInt(e.target.value, 10);
//     setSelectedDate(day);
//     fetchAttendanceDataForDay(day);
//   };

//   const fetchAttendanceDataForDay = async (day: number) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};
//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const { data, error } = await supabase
//             .from(classTime)
//             .select(`id, "${day}"`)
//             .in("id", Object.values(studentsGrouped).flat().map((s) => s.id));
  
//           if (!error) {
//             data.forEach((record: any) => {
//               if (!attendanceMap[record.id]) attendanceMap[record.id] = {};
//               attendanceMap[record.id][classTime] = record[day] === true;
//             });
//           }
//         })
//       );
//       setAttendanceData(attendanceMap);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
  
//   const fetchAttendanceData = async (studentsList: any[]) => {
//     try {
//       setIsLoading(true);
//       const attendanceMap: Record<string, Record<string, boolean>> = {};

//       await Promise.all(
//         classTimes.map(async (classTime) => {
//           const attendanceTable = getAttendanceTable(classTime);
//           if (!attendanceTable) {
//             console.warn(`No attendance table mapped for class time: ${classTime}`);
//             return;
//           }

//           const { data: attendanceDataFetched, error: attendanceError } = await supabase
//             .from(attendanceTable)
//             .select(`id, "${currentDay}"`)
//             .in("id", studentsList.map((student) => student.id));

//           if (attendanceError) {
//             console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
//             return;
//           }

//           attendanceDataFetched.forEach((record: any) => {
//             if (!attendanceMap[record.id]) {
//               attendanceMap[record.id] = {};
//             }
//             attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
//           });
//         })
//       );

//       setAttendanceData(attendanceMap);
//     } catch (error: any) {
//       console.error("Error fetching attendance data:", error.message);
//       setAlertMessage("Error fetching attendance data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getAttendanceTable = (classTime: string) => {
//     const mapping: Record<string, string> = {
//       C1: "C1",
//       C2: "C2",
//       C3: "C3",
//       C4: "C4",
//       C5: "C5",
//       C6: "C6",
//     };

//     return mapping[classTime] || null;
//   };

//   //Alert simple
//   const showSuccessAlert = (message: string) => {
//     const alertBox = document.createElement("div");
//     alertBox.style.position = "fixed";
//     alertBox.style.top = "20px";
//     alertBox.style.right = "20px";
//     alertBox.style.backgroundColor = "#28a745";
//     alertBox.style.color = "white";
//     alertBox.style.padding = "10px 20px";
//     alertBox.style.borderRadius = "8px";
//     alertBox.style.zIndex = "9999";
//     alertBox.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
//     alertBox.textContent = message;
  
//     document.body.appendChild(alertBox);
//     setTimeout(() => document.body.removeChild(alertBox), 3000);
//   };
  
//   const handleCustomMessageSave = async () => {
//     try {
//       if (!tempCustMessage.trim()) {
//         showSuccessAlert("Custom message cannot be empty.");
//         return;
//       }
  
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();
  
//       if (userError || !user) throw new Error("User not authenticated.");
  
//       const { error } = await supabase
//         .from("profiles")
//         .update({ custMessage: tempCustMessage })
//         .eq("id", user.id);
  
//       if (error) throw error;
  
//       setCustMessage(tempCustMessage);
//       showSuccessAlert("Custom message saved successfully!");
//     } catch (error: any) {
//       console.error("Error saving custom message:", error.message);
//       showSuccessAlert("Error saving custom message. Please try again.");
//     }
//   };
  
//   const generateWhatsAppLink = (number: string) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     if (custMessage.trim()) {
//       return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
//     } else {
//       return `https://wa.me/${sanitizedNumber}`;
//     }
//   };

//   const handleEditClick = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
//   };

//   const handlePhoneBlur = async (studentId: number, type: string) => {
//     try {
//       const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
//       let column = type;

//       const { error } = await supabase
//         .from("student")
//         .update({ [column]: updatedNumber || null })
//         .eq("id", studentId);

//       if (error) throw error;

//       fetchStudents(userSchool);
//       setAlertMessage("Phone number updated successfully!");
//       setEditingPhone({ studentId: null, type: null });
//       setPhoneValues({ studentNumber: "", guardianNumber: "" });
//     } catch (error: any) {
//       console.error("Error updating phone number:", error.message);
//       setAlertMessage("Error updating phone number. Please try again.");
//     }
//   };

//   const handlePhoneCancel = () => {
//     setEditingPhone({ studentId: null, type: null });
//     setPhoneValues({ studentNumber: "", guardianNumber: "" });
//   };

//   const handleLongPress = (studentId: number, type: string, currentValue: string) => {
//     setEditingPhone({ studentId, type });
//     setPhoneValues({ ...phoneValues, [type]: currentValue });
//   };

//   const handlePointerDown = (studentId: number, type: string, currentValue: string | null) => {
//     const longPressTimeout = window.setTimeout(() => {
//       handleLongPress(studentId, type, currentValue || ""); // Default to an empty string if value is null
//     }, 500);
//     inputRef.current = longPressTimeout;
//   };
  

//   const handlePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   // Editing Student Name logic
//   const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
//     const timeoutId = window.setTimeout(() => {
//       setEditingStudentNameId(studentId);
//       setEditingStudentNameValue(currentValue);
//     }, 500);
//     inputRef.current = timeoutId;
//   };

//   const handleStudentNamePointerUpOrLeave = () => {
//     if (inputRef.current) {
//       clearTimeout(inputRef.current);
//       inputRef.current = null;
//     }
//   };

//   const handleStudentNameBlur = async (studentId: number) => {
//     try {
//       const updatedName = editingStudentNameValue.trim();
//       if (!updatedName) {
//         setEditingStudentNameId(null);
//         return;
//       }

//       const { error } = await supabase
//         .from("student")
//         .update({ studentName: updatedName })
//         .eq("id", studentId);

//       if (error) throw error;

//       setEditingStudentNameId(null);
//       fetchStudents(userSchool);
//       setAlertMessage("Student name updated successfully!");
//     } catch (error: any) {
//       console.error("Error updating student name:", error.message);
//       setAlertMessage("Error updating student name. Please try again.");
//     }
//   };

//   // Search logic
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (!value) {
//       setSuggestions([]);
//       setFilteredStudentId(null);
//     } else {
//       // suggestions are generated in fetchStudents after the list is fetched.
//       // Just trigger fetch to update suggestions.
//       fetchStudents(userSchool);
//     }
//   };

//   const handleSuggestionClick = (student: any) => {
//     setSearchTerm(student.studentName);
//     setFilteredStudentId(student.id);
//     setSuggestions([]);
//   };

//   const filteredStudents = () => {
//     let allStudents: any[] = [];
//     Object.values(studentsGrouped).forEach((list) => {
//       allStudents = allStudents.concat(list);
//     });

//     if (isFilterByAbsence) {
//       allStudents = allStudents.filter((student) => hasAbsence(student.id));
//     }

//     if (filteredStudentId !== null) {
//       allStudents = allStudents.filter((student) => student.id === filteredStudentId);
//     }

//     return allStudents;
//   };

//   const groupedFilteredStudents = () => {
//     const grouped: Record<string, any[]> = {};
//     filteredStudents().forEach((student) => {
//       const key = `${student.className} - Section ${student.section}`;
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(student);
//     });
//     return grouped;
//   };

//   const handleCancelPreview = () => {
//     setShowPreviewModal(false); // Close the modal
//     setPdfPreview(null); // Clear the preview to avoid re-triggering
//   };
  

//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#000",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     header: {
//       fontSize: "32px",
//       fontWeight: "700",
//       marginBottom: "5px",
//       textAlign: "center",
//       color: "#e0e0e0",
//     },
//     schoolName: {
//       fontSize: "20px",
//       fontWeight: "600",
//       marginBottom: "25px",
//       textAlign: "center",
//       color: "#b0b0b0",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "13px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       width: "48%",
//       minWidth: "280px",
//     },
//     subHeader: {
//       fontSize: "22px",
//       fontWeight: "600",
//       marginBottom: "0px",
//       color: "#fff",
//       textAlign: "center",
//     },
//     formGroup: {
//       marginBottom: "3px",
//       marginTop: "13px",
//       display: "flex",
//       flexDirection: "column",
//     },
//     label: {
//       marginBottom: "4px",
//       marginTop: "4px",
//       fontWeight: "500",
//       color: "#fff",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "20px",
//       fontSize: "22px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//       marginTop: "-4px"
//     },
//     inputField: {
//       backgroundColor: "#555",
//       marginTop: "-1px",
//       color: "#fff",
//       padding: "12px",
//       width: '100%',
//       fontSize: "18px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       transition: "border-color 0.3s ease",
//     },
//     customMessageContainer: {
//       backgroundColor: "#000",
//       padding: "0 25px",
//       marginRight: "-15px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       width: "53%",
//       minWidth: "280px",
//       display: "flex",
//       alignItems: "flex-start",
//     },
//     customMessageInnerContainer: {
//       width: "100%",
//       display: "flex",
//       flexDirection: "column",
//     },
//     customMessageInput: {
//       width: "100%",
//       height: "200px",
//       padding: "12px 15px",
//       fontSize: "16px",
//       color: "#000",
//       border: "1px solid #2a2a2a",
//       borderRadius: "8px",
//       outline: "none",
//       resize: "vertical",
//       backgroundColor: "#f1f1f1",
//     },
//     saveButton: {
//       marginTop: "10px",
//       padding: "10px",
//       fontSize: "20px",
//       color: "#ffffff",
//       backgroundColor: "#007bff",
//       border: "none",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "background-color 0.3s",
//       width: "100%",
//     },
//     tableContainer: {
//       marginTop: "50px",
//       overflowX: "auto",
//       borderRadius: "10px",
//       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//       backgroundColor: "#f9f9f9",
//       padding: "12px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       minWidth: "1000px",
//       // tableLayout: "fixed"
//     },
//     th: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "2px 2px",
//       backgroundColor: "#007bff",
//       color: "white",
//     },
//     tr: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: '18px',
//       textAlign: "right",
      
//     },
//     tr2: {
//       borderBottom: "1px solid #dddddd",
//       fontSize: '18px',
//       textAlign: "center",
      
//     },
//     td: {
//       border: "1px solid #dddddd",
//       textAlign: "right",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     td2: {
//       border: "1px solid #dddddd",
//       textAlign: "center",
//       padding: "4px 9px",
//       color: "#555",
//       position: "relative",
//     },
//     groupHeaderRow: {
//       backgroundColor: "#f1f1f1",
//     },
//     groupHeader: {
//       fontSize: "18px",
//       fontWeight: "600",
//       textAlign: "left",
//       padding: "10px",
//       color: "#333",
//     },
//     phoneLink: {
//       color: "#007bff",
//       textDecoration: "underline",
//       cursor: "pointer",
//       backgroundColor: "#f9f9f9"
//     },
//     noDataMessage: {
//       textAlign: "center",
//       color: "#777",
//       fontSize: "18px",
//     },
//     loadingText: {
//       textAlign: "center",
//       color: "#555",
//       fontSize: "18px",
//     },
//     editInput: {
//       width: "100%",
//       padding: "5px 10px",
//       fontSize: "14px",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//       outline: "none",
//     },
//     checkboxLabel: {
//       position: "relative",
//       display: "inline-block",
//       width: "20px",
//       height: "20px",
//       cursor: "default",
//     },
//     hiddenCheckbox: {
//       opacity: 0,
//       width: 0,
//       height: 0,
//     },
//     redCross: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffcccc",
//       border: "1px solid #ff4d4d",
//       borderRadius: "4px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       color: "#ff0000",
//       fontSize: "14px",
//     },
//     emptyCheckbox: {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       height: "20px",
//       width: "20px",
//       backgroundColor: "#ffffff",
//       border: "1px solid #ccc",
//       borderRadius: "4px",
//     },
//     suggestionContainer: {
//       position: "relative",
//     },
//     suggestionsList: {
//       position: "absolute",
//       top: "100%",
//       left: 0,
//       width: "100%",
//       backgroundColor: "#222",
//       border: "1px solid #ccc",
//       borderRadius: "5px",
//       zIndex: 999,
//       maxHeight: "200px",
//       overflowY: "auto",
//     },
//     suggestionItem: {
//       padding: "10px",
//       cursor: "pointer",
//       borderBottom: "1px solid #ddd",
//       color: "#007bff", // Blue text
//       backgroundColor: "#e0e1e0", // Light grey background
//       transition: "background-color 0.3s",
//     },    
//   };

//   const groupedStudentsToShow = groupedFilteredStudents();

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Dashboard</h1>
//       <p style={styles.schoolName}>{userSchool}</p>

//       {/* Top Section */}
//       <div style={styles.topSection}>
//         {/* Filter Container */}
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

//           {/* Search Input */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Search by Name:</label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 style={styles.inputField}
//                 placeholder="Student Name or Student ID..."
//               />
//               {suggestions.length > 0 && (
//                 <div style={styles.suggestionsList}>
//                   {suggestions.map((student: any) => (
//                     <div
//                       key={student.id}
//                       style={styles.suggestionItem}
//                       onClick={() => handleSuggestionClick(student)}
//                     >
//                       {/* {student.studentName} */}
//                       {`${student.studentName} (ID: ${student.id})`}
//                     </div>
//                   ))}
//                 </div>
//               )}
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
      
      
// {/* Container for both the "Filter by Absence" and "Select Date" */}
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "0px",
//   }}
// >
//   {/* Select Date Section */}
//   <div style={{ position: "relative", marginBottom: "-45px" }}>
//   <div style={{ display: "flex", alignItems: "center" }}>
//     <input
//       type="text"
//       value={displayDate}
//       readOnly
//       style={{
//         padding: "7px",
//         borderRadius: "5px",
//         border: "1px solid #ccc",
//         fontSize: "16px",
//         width: "220px",
//         height: "40px",
//         marginRight: "10px",
//       }}
//     />
//     <span
//       style={{ cursor: "pointer", fontSize: "39px",marginTop: "12px" }}
//       onClick={() => setShowCalendar((prev) => !prev)}
//       title="Open Calendar"
//     >
//       📅
//     </span>
//     <button
//   onClick={generatePreview}
//   style={{
//     padding: "10px 15px",
//     backgroundColor: "#d3d3d3",
//     color: "#000",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "16px",
//     cursor: "pointer",
//     marginLeft: "10px",
//     transition: "background-color 0.3s ease",
//   }}
//   onMouseDown={(e) => (e.target.style.backgroundColor = "#007bff")}
//   onMouseUp={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
// >
//   Save as PDF
// </button>

//   </div>

//   {showCalendar && (
//     <div
//       style={{
//         position: "absolute",
//         top: "calc(100% + 5px)", // Positions below the input
//         backgroundColor: "#f9f9f9",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         padding: "10px",
//         zIndex: 999,
//         boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//       }}
//     >
//       <h4 style={{ margin: "0 0 10px", textAlign: "center", color: "black" }}>Select a Day</h4>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(7, 1fr)",
//           gap: "5px",
//         }}
//       >
//         {Array.from(
//           { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
//           (_, index) => index + 1
//         ).map((day) => (
//           <div
//             key={day}
//             onClick={() => {
//               setSelectedDate(day);
//               setDisplayDate(
//                 `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
//               );
//               setShowCalendar(false); // Hide calendar
//               fetchAttendanceDataForDay(day); // Fetch attendance for selected day
//             }}
//             style={{
//               textAlign: "center",
//               cursor: "pointer",
//               padding: "8px",
//               borderRadius: "50%",
//               backgroundColor: day === selectedDate ? "#007BFF" : "#fff",
//               color: day === selectedDate ? "#fff" : "#000",
//               fontWeight: "bold",
//               transition: "background-color 0.2s",
//             }}
//           >
//             {day}
//           </div>
//         ))}
//       </div>
//     </div>
//   )}
// </div>


//   {/* Filter by Absence Section */}
//   <div>
//     <button
//       style={{
//         padding: "10px 20px",
//         fontSize: "16px",
//         backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
//         color: isFilterByAbsence ? "#fff" : "#000",
//         border: "none",
//         borderRadius: "10px",
//         cursor: "pointer",
//         boxSizing: "border-box",
//         marginBottom: "-40px"
//       }}
//       onClick={() => setIsFilterByAbsence((prev) => !prev)}
//     >
//       Filter by Absence
//     </button>
//   </div>
// </div>

//  {/* NEW: Hidden container for rendering content as an image */}
//  <div id="your-container-id" style={{ display: "block" }}>
//   <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//     School: {userSchool} | Date: {displayDate}
//   </h2>
//   <table style={styles.table}>
//     <thead>
//       <tr>
//         <th style={styles.th}>Student No</th>
//         <th style={styles.th}>Guardian No</th>
//         <th style={styles.th}>Student ID</th>
//         <th style={styles.th}>Student Name</th>
//         {classTimes.map((classTime) => (
//           <th key={classTime} style={styles.th}>
//             {classTime}
//           </th>
//         ))}
//       </tr>
//     </thead>
//     <tbody>
//       {Object.entries(groupedStudentsToShow).map(([group, students]) => (
//         <React.Fragment key={group}>
//           <tr style={styles.groupHeaderRow}>
//             <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//               {group}
//             </td>
//           </tr>
//           {students.map((student) => (
//             <tr key={student.id} style={styles.tr}>
//               <td style={styles.td}>{student.studentNumber || "—"}</td>
//               <td style={styles.td}>{student.guardianNumber || "—"}</td>
//               <td style={styles.td2}>{student.id}</td>
//               <td style={styles.td}>{student.studentName}</td>
//               {classTimes.map((classTime) => (
//                 <td key={classTime} style={styles.td}>
//                   {attendanceData[student.id]?.[classTime] ? "Absent" : "Present"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </React.Fragment>
//       ))}
//     </tbody>
//   </table>
// </div>


//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : Object.keys(groupedStudentsToShow).length > 0 ? (
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
//               {Object.entries(groupedStudentsToShow).map(([group, students]) => (
//                 <React.Fragment key={group}>
//                   <tr style={styles.groupHeaderRow}>
//                     <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
//                       {group}
//                       {/* <button
//                       onClick={() => toggleGroup(group)}
//                       style={{
//                         float: "right",
//                         background: "black",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: "16px",
//                         width: "230px"
//                       }}
//                       title="Toggle Group"
//                     >
//                       {collapsedGroups[group] ? "▼" : "▲"}
//                     </button> */}
//                     </td>
//                   </tr>
//                   {!collapsedGroups[group] &&
//                   students.map((student: any) => (
//                     <tr key={student.id} style={styles.tr}>
//                       {/* Student No Edit */}
//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "studentNumber" ? (
//                           <input
//                             type="text"
//                             name="studentNumber"
//                             value={phoneValues.studentNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "studentNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <a
//                             href={student.studentNumber ? generateWhatsAppLink(student.studentNumber) || undefined : undefined}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "studentNumber", student.studentNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.studentNumber || "—"} {/* Show dash if number is empty */}
//                           </a>
//                         )}
//                       </td>

//                       {/* Guardian No Edit */}
//                       <td style={styles.td}>
//                         {editingPhone.studentId === student.id && editingPhone.type === "guardianNumber" ? (
//                           <input
//                             type="text"
//                             name="guardianNumber"
//                             value={phoneValues.guardianNumber}
//                             onChange={handlePhoneChange}
//                             onBlur={() => handlePhoneBlur(student.id, "guardianNumber")}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <a
//                             href={student.guardianNumber ? generateWhatsAppLink(student.guardianNumber) || undefined : undefined}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={styles.phoneLink}
//                             onPointerDown={() =>
//                               handlePointerDown(student.id, "guardianNumber", student.guardianNumber)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                             title="Hold to edit"
//                           >
//                             {student.guardianNumber || "—"} {/* Show dash if number is empty */}
//                           </a>
//                         )}
//                       </td>


//                       <td style={styles.td2}>{student.id}</td>

//                       {/* Student Name Edit on Long Press */}
//                       <td style={styles.td}>
//                         {editingStudentNameId === student.id ? (
//                           <input
//                             type="text"
//                             value={editingStudentNameValue}
//                             onChange={(e) => setEditingStudentNameValue(e.target.value)}
//                             onBlur={() => handleStudentNameBlur(student.id)}
//                             autoFocus
//                             style={styles.editInput}
//                           />
//                         ) : (
//                           <span
//                             onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
//                             onPointerUp={handleStudentNamePointerUpOrLeave}
//                             onPointerLeave={handleStudentNamePointerUpOrLeave}
//                             title="Hold to edit"
//                             style={{ cursor: "pointer" }}
//                           >
//                             {student.studentName}
//                           </span>
//                         )}
//                       </td>

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
//                               <span style={styles.emptyCheckbox} title="Present" />
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
//           <p style={styles.noDataMessage}>No students found for the selected filters.</p>
//         )}
//       </div>
    
//     {/* Preview Modal */}
//     {showPreviewModal && pdfPreview && (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(0, 0, 0, 0.7)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 9999,
//         }}
//       >
//         <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", position: "relative" }}>
//           <h2 style={{ textAlign: "center", marginBottom: "10px" }}>PDF Preview</h2>
//           <img
//             src={pdfPreview}
//             alt="PDF Preview"
//             style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc", borderRadius: "8px" }}
//           />
//           <div style={{ textAlign: "center", marginTop: "15px" }}>
//             <button
//               onClick={savePDF}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 marginRight: "10px",
//               }}
//             >
//               Save PDF
//             </button>
//             <button
//               onClick={() => setShowPreviewModal(false)}
//               style={{
//                 padding: "10px 20px",
//                 backgroundColor: "#dc3545",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )}

//       {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
//     </div>
//   );
// }

// export default DashBoard;



import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import AlertModal from "./../AlertModal";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [studentsGrouped, setStudentsGrouped] = useState<Record<string, any[]>>({});
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [custMessage, setCustMessage] = useState("");
  const [tempCustMessage, setTempCustMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState<{ studentId: number | null; type: string | null }>({ studentId: null, type: null });
  const [phoneValues, setPhoneValues] = useState<{ studentNumber: string; guardianNumber: string }>({ studentNumber: "", guardianNumber: "" });
  const inputRef = useRef<number | null>(null);
  const [isFilterByAbsence, setIsFilterByAbsence] = useState(false);
  
  
  const classTimes = ["C1", "C2", "C3", "C4", "C5", "C6"];
  const today = new Date();
  const currentDay = today.getDate();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showCalendar, setShowCalendar] = useState(false); // Show/hide calendar
const [displayDate, setDisplayDate] = useState(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
);

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // For Search
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [filteredStudentId, setFilteredStudentId] = useState<number | null>(null);

  //Handle Group Collapse/Expand
  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };  

  // For Editing Student Name
  const [editingStudentNameId, setEditingStudentNameId] = useState<number | null>(null);
  const [editingStudentNameValue, setEditingStudentNameValue] = useState("");

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

  // Re-fetch students every 2 minutes if filter by absence is ON
  useEffect(() => {
    let intervalId: number | undefined;
    if (isFilterByAbsence) {
      intervalId = window.setInterval(() => {
        fetchStudents(userSchool);
      }, 120000); // 2 minutes
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFilterByAbsence, userSchool]);

  const hasAbsence = (studentId: string): boolean => {
    const attendance = attendanceData[studentId];
    if (!attendance) return false;
    return classTimes.some((classTime) => attendance[classTime]);
  };

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

      fetchClassNames(profileData.school);
      fetchStudents(profileData.school);
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      setAlertMessage("Error fetching user information. Please try again.");
      navigate("/sign-up");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClassNames = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("className")
        .eq("school", school)
        .neq("className", null);

      if (error) throw error;

      const uniqueClassNames = [...new Set(data.map((item: any) => item.className))];
      setClassNames(uniqueClassNames);
    } catch (error: any) {
      console.error("Error fetching class names:", error.message);
      setAlertMessage("Error fetching class names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSections = async (className: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("section")
        .eq("className", className)
        .neq("section", null);

      if (error) throw error;

      const uniqueSections = [...new Set(data.map((item: any) => item.section))];
      setSections(uniqueSections);
    } catch (error: any) {
      console.error("Error fetching sections:", error.message);
      setAlertMessage("Error fetching sections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (school: string) => {
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

      const grouped: Record<string, any[]> = {};
      data.forEach((student: any) => {
        const key = `${student.className} - Section ${student.section}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(student);
      });

      setStudentsGrouped(grouped);
      await fetchAttendanceData(data);

      // Handle Search Suggestions
      if (searchTerm) {
        // filter suggestions from data
        // const matchSuggestions = data.filter((student: any) => {
        //   const name = student.studentName.toLowerCase();
        //   const term = searchTerm.toLowerCase();
        //   return name.includes(term);
        // });
        const matchSuggestions = data.filter((student: any) => {
          const name = student.studentName.toLowerCase();
          const id = student.id.toString();
          const term = searchTerm.toLowerCase();
          return name.includes(term) || id.includes(term);
        });
        setSuggestions(matchSuggestions);
      } else {
        setSuggestions([]);
      }

    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      setAlertMessage("Error fetching students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

    //Calendar date 
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = parseInt(e.target.value, 10);
    setSelectedDate(day);
    fetchAttendanceDataForDay(day);
  };

  const fetchAttendanceDataForDay = async (day: number) => {
    try {
      setIsLoading(true);
      const attendanceMap: Record<string, Record<string, boolean>> = {};
      await Promise.all(
        classTimes.map(async (classTime) => {
          const { data, error } = await supabase
            .from(classTime)
            .select(`id, "${day}"`)
            .in("id", Object.values(studentsGrouped).flat().map((s) => s.id));
  
          if (!error) {
            data.forEach((record: any) => {
              if (!attendanceMap[record.id]) attendanceMap[record.id] = {};
              attendanceMap[record.id][classTime] = record[day] === true;
            });
          }
        })
      );
      setAttendanceData(attendanceMap);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const fetchAttendanceData = async (studentsList: any[]) => {
    try {
      setIsLoading(true);
      const attendanceMap: Record<string, Record<string, boolean>> = {};

      await Promise.all(
        classTimes.map(async (classTime) => {
          const attendanceTable = getAttendanceTable(classTime);
          if (!attendanceTable) {
            console.warn(`No attendance table mapped for class time: ${classTime}`);
            return;
          }

          const { data: attendanceDataFetched, error: attendanceError } = await supabase
            .from(attendanceTable)
            .select(`id, "${currentDay}"`)
            .in("id", studentsList.map((student) => student.id));

          if (attendanceError) {
            console.error(`Error fetching attendance from ${attendanceTable}:`, attendanceError.message);
            return;
          }

          attendanceDataFetched.forEach((record: any) => {
            if (!attendanceMap[record.id]) {
              attendanceMap[record.id] = {};
            }
            attendanceMap[record.id][classTime] = record[`${currentDay}`] === true;
          });
        })
      );

      setAttendanceData(attendanceMap);
    } catch (error: any) {
      console.error("Error fetching attendance data:", error.message);
      setAlertMessage("Error fetching attendance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceTable = (classTime: string) => {
    const mapping: Record<string, string> = {
      C1: "C1",
      C2: "C2",
      C3: "C3",
      C4: "C4",
      C5: "C5",
      C6: "C6",
    };

    return mapping[classTime] || null;
  };

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

      const { error } = await supabase
        .from("profiles")
        .update({ custMessage: tempCustMessage })
        .eq("id", user.id);

      if (error) throw error;

      setCustMessage(tempCustMessage);
      setAlertMessage("Custom message saved successfully!");
    } catch (error: any) {
      console.error("Error saving custom message:", error.message);
      setAlertMessage("Error saving custom message. Please try again.");
    }
  };

  const generateWhatsAppLink = (number: string) => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;

    if (custMessage.trim()) {
      return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(custMessage)}`;
    } else {
      return `https://wa.me/${sanitizedNumber}`;
    }
  };

  const handleEditClick = (studentId: number, type: string, currentValue: string) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneValues({ ...phoneValues, [e.target.name]: e.target.value });
  };

  const handlePhoneBlur = async (studentId: number, type: string) => {
    try {
      const updatedNumber = phoneValues[type as "studentNumber" | "guardianNumber"].trim();
      let column = type;

      const { error } = await supabase
        .from("student")
        .update({ [column]: updatedNumber || null })
        .eq("id", studentId);

      if (error) throw error;

      fetchStudents(userSchool);
      setAlertMessage("Phone number updated successfully!");
      setEditingPhone({ studentId: null, type: null });
      setPhoneValues({ studentNumber: "", guardianNumber: "" });
    } catch (error: any) {
      console.error("Error updating phone number:", error.message);
      setAlertMessage("Error updating phone number. Please try again.");
    }
  };

  const handlePhoneCancel = () => {
    setEditingPhone({ studentId: null, type: null });
    setPhoneValues({ studentNumber: "", guardianNumber: "" });
  };

  const handleLongPress = (studentId: number, type: string, currentValue: string) => {
    setEditingPhone({ studentId, type });
    setPhoneValues({ ...phoneValues, [type]: currentValue });
  };

  const handlePointerDown = (studentId: number, type: string, currentValue: string | null) => {
    const longPressTimeout = window.setTimeout(() => {
      handleLongPress(studentId, type, currentValue || ""); // Default to an empty string if value is null
    }, 500);
    inputRef.current = longPressTimeout;
  };
  

  const handlePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  // Editing Student Name logic
  const handleStudentNamePointerDown = (studentId: number, currentValue: string) => {
    const timeoutId = window.setTimeout(() => {
      setEditingStudentNameId(studentId);
      setEditingStudentNameValue(currentValue);
    }, 500);
    inputRef.current = timeoutId;
  };

  const handleStudentNamePointerUpOrLeave = () => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
      inputRef.current = null;
    }
  };

  const handleStudentNameBlur = async (studentId: number) => {
    try {
      const updatedName = editingStudentNameValue.trim();
      if (!updatedName) {
        setEditingStudentNameId(null);
        return;
      }

      const { error } = await supabase
        .from("student")
        .update({ studentName: updatedName })
        .eq("id", studentId);

      if (error) throw error;

      setEditingStudentNameId(null);
      fetchStudents(userSchool);
      setAlertMessage("Student name updated successfully!");
    } catch (error: any) {
      console.error("Error updating student name:", error.message);
      setAlertMessage("Error updating student name. Please try again.");
    }
  };

  // Search logic
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setSuggestions([]);
      setFilteredStudentId(null);
    } else {
      // suggestions are generated in fetchStudents after the list is fetched.
      // Just trigger fetch to update suggestions.
      fetchStudents(userSchool);
    }
  };

  const handleSuggestionClick = (student: any) => {
    setSearchTerm(student.studentName);
    setFilteredStudentId(student.id);
    setSuggestions([]);
  };

  const filteredStudents = () => {
    let allStudents: any[] = [];
    Object.values(studentsGrouped).forEach((list) => {
      allStudents = allStudents.concat(list);
    });

    if (isFilterByAbsence) {
      allStudents = allStudents.filter((student) => hasAbsence(student.id));
    }

    if (filteredStudentId !== null) {
      allStudents = allStudents.filter((student) => student.id === filteredStudentId);
    }

    return allStudents;
  };

  const groupedFilteredStudents = () => {
    const grouped: Record<string, any[]> = {};
    filteredStudents().forEach((student) => {
      const key = `${student.className} - Section ${student.section}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(student);
    });
    return grouped;
  };

  const styles: Record<string, CSSProperties> = {
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
      marginBottom: "5px",
      textAlign: "center",
      color: "#e0e0e0",
    },
    schoolName: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "25px",
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
      padding: "13px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 1px #000",
      width: "48%",
      minWidth: "280px",
    },
    subHeader: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "0px",
      color: "#fff",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "3px",
      marginTop: "13px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "4px",
      marginTop: "4px",
      fontWeight: "500",
      color: "#fff",
    },
    dropdown: {
      backgroundColor: "#555",
      color: "#fff",
      padding: "20px",
      fontSize: "22px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
      marginTop: "-4px"
    },
    inputField: {
      backgroundColor: "#555",
      marginTop: "-1px",
      color: "#fff",
      padding: "12px",
      width: '100%',
      fontSize: "18px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    customMessageContainer: {
      backgroundColor: "#000",
      padding: "0 25px",
      marginRight: "-15px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      width: "53%",
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
      height: "200px",
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
      padding: "10px",
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
    },
    tableContainer: {
      marginTop: "50px",
      overflowX: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9",
      padding: "12px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1000px",
      // tableLayout: "fixed"
    },
    th: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "10px 2px",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: '18px',
    },
    tr: {
      borderBottom: "1px solid #dddddd",
      fontSize: '18px',
      textAlign: "right",
      
    },
    tr2: {
      borderBottom: "1px solid #dddddd",
      fontSize: '18px',
      textAlign: "center",
      
    },
    td: {
      border: "1px solid #dddddd",
      textAlign: "right",
      padding: "4px 9px",
      color: "#555",
      position: "relative",
      fontSize: "22px"
    },
    td2: {
      border: "1px solid #dddddd",
      textAlign: "center",
      padding: "4px 9px",
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
      fontSize: "22px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
      textAlign: "right",
    },
    checkboxLabel: {
      position: "relative",
      display: "inline-block",
      width: "20px",
      height: "20px",
      cursor: "default",
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
    },
    suggestionContainer: {
      position: "relative",
    },
    suggestionsList: {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      backgroundColor: "#222",
      border: "1px solid #ccc",
      borderRadius: "5px",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
    },
    suggestionItem: {
      padding: "10px",
      cursor: "pointer",
      borderBottom: "1px solid #ddd",
      color: "#007bff", // Blue text
      backgroundColor: "#e0e1e0", // Light grey background
      transition: "background-color 0.3s",
    },    
    iconButton: {
      width: "60px", // Increased button size
      height: "60px", // Increased button size
      margin: "12px 0",
      fontSize: "28px", // Larger font size for icons
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#Dfff", // Slightly brighter grey for buttons
      color: "#fff", // Darker text color for contrast
      border: "1px solid #Dfff", // Border for button definition
      borderRadius: "10px", // Slightly rounded edges for a modern look
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow for button depth
    },
    iconButton2: {
      width: "60px", // Increased button size
      height: "60px", // Increased button size
      margin: "12px 0",
      fontSize: "34px", // Larger font size for icons
      padding: "20px",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#Dfff", // Slightly brighter grey for buttons
      color: "#fff", // Darker text color for contrast
      border: "1px solid #Dfff", // Border for button definition
      borderRadius: "10px", // Slightly rounded edges for a modern look
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow for button depth
    },
    iconButtonHover: {
      transform: "translateY(-2px)", // Button "lifts" slightly on hover
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Enhanced shadow for hover
      backgroundColor: "#e8e8e8", // Slightly brighter grey on hover
    },
    pageContainer: {
      display: "flex", // Flexbox layout
      flexDirection: "row", // Row layout to position elements side-by-side
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    
    floatingContainer: {
      position: "fixed", // Keep it fixed so it does not grow/shrink
      top: "20px",
      left: "15px", // Adjust for 10px spacing
      width: "85px", // Fixed width
      height: "auto", // Allow content height
      backgroundColor: "#000", // Light grey background
      borderRadius: "20px",
      boxShadow: "0 1px 5px 1px #007BA7",
      padding: "5px 10px",
      zIndex: 1000,
      flexShrink: 0, // Prevent shrinking or growing
      border: "1px solid #000",
    },
    
    
    card: {
      flex: 1, // Take up the remaining space
      maxWidth: "1400px",
      backgroundColor: "#000",
      padding: "10px 0px",
      borderRadius: "10px",
      boxShadow: "0 10px 10px rgba(0, 0, 0, 0.6)",
      textAlign: "center",
      
      marginLeft: "20px", // Fixed 10px gap between float container and card
    },
  };

  const groupedStudentsToShow = groupedFilteredStudents();

  return (
    <div style={styles.container}>
      <div style={styles.floatingContainer}>
  <button
    style={{...styles.iconButton2, backgroundColor: "#007BA7"}}
    onClick={() => navigate("/dashboard2")}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
     🎓
  </button>
  <button
    style={{ ...styles.iconButton, backgroundColor: "#50B755" }}
    onClick={() => navigate("/dashboard3")}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    +
  </button>
  <button
    style={styles.iconButton}
    onClick={() => navigate("/")}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    👤
  </button>
</div>
<div style={styles.card}>
      <h1 style={styles.header}>Dashboard</h1>
      <p style={styles.schoolName}>{userSchool}</p>

      {/* Top Section */}
      <div style={styles.topSection}>
        {/* Filter Container */}
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

          {/* Search Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Search by Name:</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                style={styles.inputField}
                placeholder="Student Name or Student ID..."
              />
              {suggestions.length > 0 && (
                <div style={styles.suggestionsList}>
                  {suggestions.map((student: any) => (
                    <div
                      key={student.id}
                      style={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(student)}
                    >
                      {/* {student.studentName} */}
                      {`${student.studentName} (ID: ${student.id})`}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
      
      
{/* Container for both the "Filter by Absence" and "Select Date" */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0px",
  }}
>
  {/* Select Date Section */}
  <div style={{ position: "relative", marginBottom: "-45px" }}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="text"
      value={displayDate}
      readOnly
      style={{
        padding: "7px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
        width: "220px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <span
      style={{ cursor: "pointer", fontSize: "39px",marginTop: "12px" }}
      onClick={() => setShowCalendar((prev) => !prev)}
      title="Open Calendar"
    >
      📅
    </span>
  </div>

  {showCalendar && (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 5px)", // Positions below the input
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        zIndex: 999,
        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h4 style={{ margin: "0 0 10px", textAlign: "center", color: "black" }}>Select a Day</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {Array.from(
          { length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() },
          (_, index) => index + 1
        ).map((day) => (
          <div
            key={day}
            onClick={() => {
              setSelectedDate(day);
              setDisplayDate(
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              );
              setShowCalendar(false); // Hide calendar
              fetchAttendanceDataForDay(day); // Fetch attendance for selected day
            }}
            style={{
              textAlign: "center",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: day === selectedDate ? "#007BFF" : "#fff",
              color: day === selectedDate ? "#fff" : "#000",
              fontWeight: "bold",
              transition: "background-color 0.2s",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )}
</div>


  {/* Filter by Absence Section */}
  <div>
    <button
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: isFilterByAbsence ? "#ff4d4d" : "#d3d3d3",
        color: isFilterByAbsence ? "#fff" : "#000",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxSizing: "border-box",
        marginBottom: "-40px"
      }}
      onClick={() => setIsFilterByAbsence((prev) => !prev)}
    >
      Filter by Absence
    </button>
  </div>
</div>


      <div style={styles.tableContainer}>
        {isLoading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : Object.keys(groupedStudentsToShow).length > 0 ? (
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
              {Object.entries(groupedStudentsToShow).map(([group, students]) => (
                <React.Fragment key={group}>
                  <tr style={styles.groupHeaderRow}>
                    <td colSpan={4 + classTimes.length} style={styles.groupHeader}>
                      {group}
                      {/* <button
                      onClick={() => toggleGroup(group)}
                      style={{
                        float: "right",
                        background: "black",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        width: "230px"
                      }}
                      title="Toggle Group"
                    >
                      {collapsedGroups[group] ? "▼" : "▲"}
                    </button> */}
                    </td>
                  </tr>
                  {!collapsedGroups[group] &&
                  students.map((student: any) => (
                    <tr key={student.id} style={styles.tr}>
                      {/* Student No Edit */}
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
                        ) : (
                          <a
                            href={student.studentNumber ? generateWhatsAppLink(student.studentNumber) || undefined : undefined}
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
                            {student.studentNumber || "—"} {/* Show dash if number is empty */}
                          </a>
                        )}
                      </td>

                      {/* Guardian No Edit */}
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
                        ) : (
                          <a
                            href={student.guardianNumber ? generateWhatsAppLink(student.guardianNumber) || undefined : undefined}
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
                            {student.guardianNumber || "—"} {/* Show dash if number is empty */}
                          </a>
                        )}
                      </td>


                      <td style={styles.td2}>{student.id}</td>

                      {/* Student Name Edit on Long Press */}
                      <td style={styles.td}>
                        {editingStudentNameId === student.id ? (
                          <input
                            type="text"
                            value={editingStudentNameValue}
                            onChange={(e) => setEditingStudentNameValue(e.target.value)}
                            onBlur={() => handleStudentNameBlur(student.id)}
                            autoFocus
                            style={styles.editInput}
                          />
                        ) : (
                          <span
                            onPointerDown={() => handleStudentNamePointerDown(student.id, student.studentName)}
                            onPointerUp={handleStudentNamePointerUpOrLeave}
                            onPointerLeave={handleStudentNamePointerUpOrLeave}
                            title="Hold to edit"
                            style={{ cursor: "pointer" }}
                          >
                            {student.studentName}
                          </span>
                        )}
                      </td>

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
                              <span style={styles.emptyCheckbox} title="Present" />
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
          <p style={styles.noDataMessage}>No students found for the selected filters.</p>
        )}
      </div>

      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}
    </div>
    </div>
  );
}

export default DashBoard;


