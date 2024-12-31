// // StaffAttendance.tsx - Part 1

// import React, { useState, useEffect, useRef, CSSProperties } from "react";
// import supabase from "../../supabase";
// import { useNavigate } from "react-router-dom";
// import { Modal, Button, Spinner, Form } from 'react-bootstrap';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'chart.js/auto';
// import { Bar } from "react-chartjs-2";

// // Define interfaces for Attendance and Staff Rows
// interface AttendanceRow {
//   index: number;
//   Login: string | null;
//   Logout: string | null;
//   telNumber: string | null;
//   teacherID: string | null;
//   teacherName: string | null;
//   Today: boolean | number | null;
//   minLate: number | null;
//   totalLate: number | null;
//   present: number | null;
//   days: Record<string, boolean | number | null>;
// }

// function StaffAttendance() {
//   const navigate = useNavigate();
//   const [userSchool, setUserSchool] = useState("");
//   const [teachers, setTeachers] = useState<AttendanceRow[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // For filtering and searching
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredTeachers, setFilteredTeachers] = useState<AttendanceRow[]>([]);
//   const [filterNotPresent, setFilterNotPresent] = useState(false);

//   // For editing
//   const [editingField, setEditingField] = useState<{ teacherID: string | null; field: string | null }>({
//     teacherID: null,
//     field: null
//   });
//   const [fieldValues, setFieldValues] = useState<{ telNumber: string; teacherName: string }>({
//     telNumber: "",
//     teacherName: ""
//   });

//   // For selection
//   const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
//   const [selectAll, setSelectAll] = useState(false);

//   // For adding new staff
//   const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
//   const [newStaff, setNewStaff] = useState<{ teacherName: string; teacherID: string; telNumber: string }>({
//     teacherName: "",
//     teacherID: "",
//     telNumber: ""
//   });

//   // For deleting staff
//   const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

//   // Long press ref
//   const longPressRef = useRef<number | null>(null);

//   // Utility functions
//   const formatPhoneNumber = (value: string) => {
//     const numeric = value.replace(/\D/g, "");
//     if (!numeric) return "";
//     return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   // Fetch user data on mount
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
//         .select("school")
//         .eq("id", user.id)
//         .single();

//       if (profileError || !profileData) {
//         throw new Error("Failed to retrieve profile information.");
//       }

//       setUserSchool(profileData.school);
//       fetchTeachers(profileData.school);
//     } catch (error: any) {
//       console.error("Error fetching user data:", error.message);
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch teachers
//   const fetchTeachers = async (school: string) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("teacher")
//         .select("*")
//         .eq("school", school)
//         .order("teacherName", { ascending: true });

//       if (error) throw error;

//       const today = new Date().getDate();
//       const todayStr = today.toString();

//       const formattedData = (data as any[]).map((teacher) => {
//         const days: Record<string, boolean | number | null> = {};
//         for (let i = 1; i <= 31; i++) {
//           const dayStr = i.toString();
//           days[dayStr] = teacher[dayStr] !== undefined ? teacher[dayStr] : null;
//         }

//         return {
//           index: teacher.id,
//           Login: teacher.Login,
//           Logout: teacher.Logout,
//           telNumber: teacher.telNumber,
//           teacherID: teacher.teacherID,
//           teacherName: teacher.teacherName,
//           Today: days[todayStr] !== undefined ? days[todayStr] : null,
//           minLate: teacher.minLate || 0,
//           totalLate: teacher.totalLate || 0,
//           present: teacher.present || 0,
//           days,
//         };
//       });

//       // Calculate Days Absent and update 'present' column
//       for (let teacher of formattedData) {
//         const daysAbsent = calculateDaysAbsent(teacher.days, today);
//         if (teacher.present !== daysAbsent) {
//           await supabase
//             .from("teacher")
//             .update({ present: daysAbsent })
//             .eq("teacherID", teacher.teacherID);
//           teacher.present = daysAbsent;
//         }
//       }

//       setTeachers(formattedData);
//       setFilteredTeachers(formattedData);
//     } catch (error: any) {
//       console.error("Error fetching teachers:", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle search and filters
//   useEffect(() => {
//     let temp = [...teachers];
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       temp = temp.filter(
//         (teacher) =>
//           (teacher.teacherName && teacher.teacherName.toLowerCase().includes(term)) ||
//           (teacher.teacherID && teacher.teacherID.toLowerCase().includes(term))
//       );
//     }

//     if (filterNotPresent) {
//       temp = temp.filter((teacher) => teacher.Today !== true);
//     }

//     setFilteredTeachers(temp);
//   }, [searchTerm, teachers, filterNotPresent]);

//   // Handle long press for editing
//   const handleLongPressStart = (
//     e: React.MouseEvent | React.TouchEvent,
//     teacherID: string,
//     field: string,
//     currentValue: any
//   ) => {
//     e.preventDefault();
//     longPressRef.current = window.setTimeout(() => {
//       setEditingField({ teacherID, field });
//       if (field === "telNumber" || field === "teacherName") {
//         setFieldValues({ ...fieldValues, [field]: currentValue || "" });
//       }
//     }, 500);
//   };

//   const handleLongPressEnd = () => {
//     if (longPressRef.current) {
//       clearTimeout(longPressRef.current);
//       longPressRef.current = null;
//     }
//   };

//   // Handle field blur to save changes
//   const handleFieldBlur = async (teacherID: string, field: string) => {
//     const newValue = fieldValues[field as keyof typeof fieldValues].trim();
//     try {
//       const updateData: any = {};
//       updateData[field] = newValue || null;

//       const { error } = await supabase
//         .from("teacher")
//         .update(updateData)
//         .eq("teacherID", teacherID);

//       if (error) throw error;

//       fetchTeachers(userSchool);
//       setEditingField({ teacherID: null, field: null });
//       setFieldValues({ ...fieldValues, [field]: "" });
//     } catch (error: any) {
//       console.error(`Error updating ${field}:`, error.message);
//     }
//   };

//   // Generate WhatsApp link
//   const generateWhatsAppLink = (number: string) => {
//     if (!number) return null;
//     const sanitizedNumber = number.replace(/\D/g, "");
//     if (!sanitizedNumber) return null;

//     return `https://wa.me/${sanitizedNumber}`;
//   };

//   // Handle checkbox selection
//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       setSelectedTeachers(new Set());
//     } else {
//       const allIDs = filteredTeachers.map((teacher) => teacher.teacherID);
//       setSelectedTeachers(new Set(allIDs));
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleRowSelect = (teacherID: string) => {
//     const newSelected = new Set(selectedTeachers);
//     if (newSelected.has(teacherID)) {
//       newSelected.delete(teacherID);
//     } else {
//       newSelected.add(teacherID);
//     }
//     setSelectedTeachers(newSelected);
//     setSelectAll(newSelected.size === filteredTeachers.length);
//   };

//   // Handle Delete Staff
//   const handleDeleteStaff = async () => {
//     try {
//       for (let teacherID of selectedTeachers) {
//         const { error } = await supabase
//           .from("teacher")
//           .delete()
//           .eq("teacherID", teacherID);
//         if (error) throw error;
//       }
//       fetchTeachers(userSchool);
//       setSelectedTeachers(new Set());
//       setDeleteConfirmVisible(false);
//     } catch (error: any) {
//       console.error("Error deleting staff:", error.message);
//     }
//   };

//   // Handle adding new staff
//   const handleAddStaff = async () => {
//     const { teacherName, teacherID, telNumber } = newStaff;
//     if (!teacherName || !teacherID || !telNumber) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       const { error } = await supabase.from("teacher").insert([
//         {
//           teacherName,
//           teacherID,
//           telNumber,
//           school: userSchool,
//           present: 0,
//           minLate: 0,
//           totalLate: 0,
//         },
//       ]);

//       if (error) throw error;

//       fetchTeachers(userSchool);
//       setAddStaffModalVisible(false);
//       setNewStaff({ teacherName: "", teacherID: "", telNumber: "" });
//     } catch (error: any) {
//       console.error("Error adding new staff:", error.message);
//     }
//   };

//   // Current day for 'Today' column
//   const currentDay = new Date().getDate();
//   const currentDayStr = currentDay.toString();

//   // Function to calculate Days Absent up to today
//   const calculateDaysAbsent = (days: Record<string, boolean | number | null>, today: number) => {
//     let count = 0;
//     for (let i = 1; i <= today; i++) {
//       const dayStr = i.toString();
//       if (days[dayStr] === false) {
//         count += 1;
//       }
//     }
//     return count;
//   };

//   // Function to get Today display
//   const getTodayDisplay = (todayValue: boolean | number | null) => {
//     if (todayValue === true) {
//       return (
//         <input
//           type="checkbox"
//           checked={true}
//           readOnly
//           style={{
//             width: "20px",
//             height: "20px",
//             cursor: "default",
//             backgroundColor: "#28a745",
//             border: "none",
//             borderRadius: "4px",
//           }}
//         />
//       );
//     } else if (todayValue === false || todayValue === null) {
//       return (
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <span style={{ color: "#dc3545", fontSize: "18px" }}>✗</span>
//         </div>
//       );
//     } else if (typeof todayValue === "number") {
//       return (
//         <span style={{ color: "#dc3545", fontWeight: "bold" }}>{todayValue}</span>
//       );
//     } else {
//       return "---";
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Staff Attendance</h1>
//       <p style={styles.schoolName}>{userSchool}</p>

//       {/* Top Section: Filters and Add Staff */}
//       <div style={styles.topSection}>
//         {/* Filter Container */}
//         <div style={styles.filterContainer}>
//           <h2 style={styles.subHeader}>Filters</h2>

//           {/* Search Field */}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Search:</label>
//             <input
//               type="text"
//               placeholder="Search by Full Name or Staff ID..."
//               style={styles.searchInput}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Filter Not Present Today Button */}
//           <div style={styles.formGroup}>
//             <Button
//               onClick={() => setFilterNotPresent(!filterNotPresent)}
//               variant="secondary"
//               style={styles.filterButton}
//               title="Filter staff who are not present today"
//             >
//               {filterNotPresent ? "🔴 Show All" : "🕒 Show Not Present"}
//             </Button>
//           </div>
//         </div>

//         {/* Add Staff Container */}
//         <div style={styles.addStaffContainer}>
//           <h2 style={styles.subHeader}>Add New Staff</h2>
//           <Button
//             onClick={() => setAddStaffModalVisible(true)}
//             variant="primary"
//             style={styles.addStaffButton}
//           >
//             ➕ Add Staff
//           </Button>
//         </div>
//       </div>

//       {/* Delete Staff Button */}
//       {selectedTeachers.size > 0 && (
//         <div style={styles.deleteButtonContainer}>
//           <Button
//             onClick={() => setDeleteConfirmVisible(true)}
//             variant="danger"
//             style={styles.deleteStaffButton}
//           >
//             Delete Staff
//           </Button>
//         </div>
//       )}

//       {/* Teachers Table */}
//       <div style={styles.tableContainer}>
//         {isLoading ? (
//           <div style={styles.loadingContainer}>
//             <Spinner animation="border" variant="primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//             <p>Loading...</p>
//           </div>
//         ) : filteredTeachers.length > 0 ? (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 {/* Select All Checkbox */}
//                 <th style={styles.th}>
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAllChange}
//                     style={styles.checkbox}
//                   />
//                 </th>
//                 <th style={styles.th}>Login</th>
//                 <th style={styles.th}>Logout</th>
//                 <th style={styles.th}>Phone Number</th>
//                 <th style={styles.th}>Staff ID</th>
//                 <th style={styles.th}>Full Name</th>
//                 <th style={styles.th}>Today</th>
//                 <th style={styles.th}>mins Late</th>
//                 <th style={styles.th}>Total mins Late</th>
//                 <th style={styles.th}>Present Days</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTeachers.map((teacher) => (
//                 <tr key={teacher.teacherID} style={styles.tr}>
//                   {/* Select Checkbox */}
//                   <td style={styles.td}>
//                     <input
//                       type="checkbox"
//                       checked={selectedTeachers.has(teacher.teacherID!)}
//                       onChange={() => handleRowSelect(teacher.teacherID!)}
//                       style={styles.checkbox}
//                     />
//                   </td>

//                   {/* Login */}
//                   <td style={styles.td}>
//                     {teacher.Login || "---"}
//                   </td>

//                   {/* Logout */}
//                   <td style={styles.td}>
//                     {teacher.Logout || "---"}
//                   </td>

//                   {/* Phone Number */}
//                   <td style={styles.td}>
//                     {editingField.teacherID === teacher.teacherID && editingField.field === "telNumber" ? (
//                       <input
//                         type="text"
//                         value={fieldValues.telNumber}
//                         onChange={(e) => setFieldValues({ ...fieldValues, telNumber: e.target.value })}
//                         onBlur={() => handleFieldBlur(teacher.teacherID!, "telNumber")}
//                         autoFocus
//                         style={styles.editInput}
//                         onFocus={(e) => e.target.select()}
//                       />
//                     ) : (
//                       <a
//                         href={generateWhatsAppLink(teacher.telNumber!) || undefined}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={styles.phoneLink}
//                         onMouseDown={(e) => handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)}
//                         onMouseUp={handleLongPressEnd}
//                         onMouseLeave={handleLongPressEnd}
//                         onTouchStart={(e) => handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)}
//                         onTouchEnd={handleLongPressEnd}
//                         title="Click to message on WhatsApp or hold to edit"
//                       >
//                         {teacher.telNumber || "---"}
//                       </a>
//                     )}
//                   </td>

//                   {/* Staff ID */}
//                   <td style={styles.td}>{teacher.teacherID || "---"}</td>

//                   {/* Full Name */}
//                   <td style={styles.td}>
//                     {editingField.teacherID === teacher.teacherID && editingField.field === "teacherName" ? (
//                       <input
//                         type="text"
//                         value={fieldValues.teacherName}
//                         onChange={(e) => setFieldValues({ ...fieldValues, teacherName: e.target.value })}
//                         onBlur={() => handleFieldBlur(teacher.teacherID!, "teacherName")}
//                         autoFocus
//                         style={styles.editInput}
//                         onFocus={(e) => e.target.select()}
//                       />
//                     ) : (
//                       <span
//                         style={styles.editableText}
//                         onMouseDown={(e) => handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)}
//                         onMouseUp={handleLongPressEnd}
//                         onMouseLeave={handleLongPressEnd}
//                         onTouchStart={(e) => handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)}
//                         onTouchEnd={handleLongPressEnd}
//                         title="Hold to edit"
//                       >
//                         {teacher.teacherName || "---"}
//                       </span>
//                     )}
//                   </td>

//                   {/* Today */}
//                   <td style={styles.td}>
//                     {getTodayDisplay(teacher.Today)}
//                   </td>

//                   {/* mins Late */}
//                   <td style={styles.td}>{teacher.minLate || 0}</td>

//                   {/* Total mins Late */}
//                   <td style={styles.td}>{teacher.totalLate || 0}</td>

//                   {/* Present Days */}
//                   <td style={styles.td}>
//                     {teacher.present}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p style={styles.noDataText}>No staff found for the selected filters.</p>
//         )}
//       </div>

//       {/* Add Staff Modal */}
//       <Modal show={addStaffModalVisible} onHide={() => setAddStaffModalVisible(false)} centered>
//         <Modal.Header closeButton style={styles.modalHeader}>
//           <Modal.Title>Add New Staff</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={styles.modalBody}>
//           <Form>
//             <Form.Group controlId="staffFullName" className="mb-3">
//               <Form.Label>Full Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter full name"
//                 value={newStaff.teacherName}
//                 onChange={(e) => setNewStaff({ ...newStaff, teacherName: e.target.value })}
//                 style={styles.modalInput}
//               />
//             </Form.Group>

//             <Form.Group controlId="staffID" className="mb-3">
//               <Form.Label>Staff ID</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter staff ID"
//                 value={newStaff.teacherID}
//                 onChange={(e) => setNewStaff({ ...newStaff, teacherID: e.target.value })}
//                 style={styles.modalInput}
//               />
//             </Form.Group>

//             <Form.Group controlId="staffPhone" className="mb-3">
//               <Form.Label>Phone Number</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter phone number"
//                 value={newStaff.telNumber}
//                 onChange={(e) => setNewStaff({ ...newStaff, telNumber: e.target.value })}
//                 style={styles.modalInput}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer style={styles.modalFooter}>
//           <Button variant="secondary" onClick={() => setAddStaffModalVisible(false)} style={styles.modalCloseButton}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleAddStaff} style={styles.modalSubmitButton}>
//             Add Staff
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={deleteConfirmVisible} onHide={() => setDeleteConfirmVisible(false)} centered>
//         <Modal.Header closeButton style={styles.modalHeader}>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={styles.modalBody}>
//           Are you sure you want to delete the selected staff members?
//         </Modal.Body>
//         <Modal.Footer style={styles.modalFooter}>
//           <Button variant="secondary" onClick={() => setDeleteConfirmVisible(false)} style={styles.modalCloseButton}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteStaff} style={styles.modalDeleteButton}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }


// // StaffAttendance.tsx - Part 2

// // Styles
// const styles: Record<string, CSSProperties> = {
//   container: {
//     width: "95%",
//     maxWidth: "1400px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#121212",
//     boxShadow: "0 4px 20px 1px #007BA7",
//     borderRadius: "10px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     color: "#ffffff",
//   },
//   header: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "10px",
//     color: "#e0e0e0",
//     textAlign: "center",
//   },
//   schoolName: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     color: "#b0b0b0",
//     textAlign: "center",
//   },
//   topSection: {
//     marginBottom: "30px",
//     display: "flex",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     gap: "20px",
//   },
//   filterContainer: {
//     backgroundColor: "#2a2a2a",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 12px 1px #000",
//     flex: "1",
//     minWidth: "280px",
//   },
//   addStaffContainer: {
//     backgroundColor: "#2a2a2a",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 12px 1px #000",
//     flex: "1",
//     minWidth: "280px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   subHeader: {
//     fontSize: "22px",
//     fontWeight: "600",
//     marginBottom: "15px",
//     color: "#fff",
//     textAlign: "center",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//     color: "#fff",
//   },
//   searchInput: {
//     backgroundColor: "#555",
//     color: "#fff",
//     border: "1px solid #555",
//     borderRadius: "5px",
//     padding: "10px",
//     fontSize: "16px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   filterButton: {
//     backgroundColor: "#6c757d",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//   },
//   addStaffButton: {
//     backgroundColor: "#28a745",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//   },
//   deleteButtonContainer: {
//     marginBottom: "20px",
//     display: "flex",
//     justifyContent: "flex-start",
//   },
//   deleteStaffButton: {
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "20px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//   },
//   tableContainer: {
//     overflowX: "auto",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#1e1e1e",
//     padding: "12px",
//     position: "relative",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "800px",
//     color: "#fff",
//     fontSize: "16px",
//   },
//   th: {
//     border: "1px solid #555",
//     textAlign: "center",
//     padding: "10px",
//     backgroundColor: "#3ecf8e",
//     color: "#000",
//     fontSize: "18px",
//   },
//   td: {
//     border: "1px solid #555",
//     textAlign: "center",
//     padding: "10px",
//     color: "#fff",
//     cursor: "pointer",
//     position: "relative",
//   },
//   tr: {
//     borderBottom: "1px solid #555",
//   },
//   checkbox: {
//     width: "20px",
//     height: "20px",
//     cursor: "pointer",
//   },
//   editableText: {
//     cursor: "pointer",
//     textDecoration: "underline",
//     color: "#3ecf8e",
//   },
//   editInput: {
//     backgroundColor: "#555",
//     color: "#fff",
//     border: "1px solid #555",
//     borderRadius: "5px",
//     padding: "5px",
//     fontSize: "14px",
//     outline: "none",
//     width: "100%",
//   },
//   phoneLink: {
//     color: '#3ecf8e',
//     textDecoration: 'underline',
//     cursor: 'pointer',
//     backgroundColor: '#1e1e1e',
//   },
//   noDataText: {
//     textAlign: "center",
//     color: "#fff",
//     fontSize: "18px",
//     padding: "20px",
//   },
//   loadingContainer: {
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: '18px',
//   },
//   modalHeader: {
//     backgroundColor: "#1e1e1e",
//     color: "#fff",
//     borderBottom: "1px solid #555",
//   },
//   modalBody: {
//     backgroundColor: "#1e1e1e",
//     color: "#fff",
//   },
//   modalFooter: {
//     backgroundColor: "#1e1e1e",
//     borderTop: "1px solid #555",
//   },
//   modalInput: {
//     backgroundColor: "#555",
//     color: "#fff",
//     border: "1px solid #555",
//     borderRadius: "5px",
//     padding: "10px",
//     fontSize: "16px",
//     outline: "none",
//     width: "100%",
//   },
//   modalSubmitButton: {
//     backgroundColor: "#28a745",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//   },
//   modalDeleteButton: {
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//     marginRight: "10px",
//   },
//   modalCloseButton: {
//     backgroundColor: "#6c757d",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//     transition: "background-color 0.3s",
//     marginRight: "10px",
//   },

//   numberText: {
//     color: "#dc3545",
//     fontWeight: "bold",
//   },
// };

// export default StaffAttendance;
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import { Bar } from "react-chartjs-2";

// Define interfaces for Attendance and Staff Rows
interface AttendanceRow {
  index: number;
  Login: string | null;
  Logout: string | null;
  telNumber: string | null;
  teacherID: string | null;
  teacherName: string | null;
  Morning: boolean | number | null;      // Updated from Today
  Evening: boolean | number | null;      // New column
  minLate: number | null;
  totalLate: number | null;
  presentMorning: number | null;         // Renamed from present
  presentEvening: number | null;         // New column
  days: Record<string, boolean | number | null>;
}

function StaffAttendance() {
  const navigate = useNavigate();
  const [userSchool, setUserSchool] = useState("");
  const [teachers, setTeachers] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // For filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState<AttendanceRow[]>([]);
  
  // Updated filter states for Morning and Evening
  const [filterNotPresentMorning, setFilterNotPresentMorning] = useState(false);
  const [filterNotPresentEvening, setFilterNotPresentEvening] = useState(false);

  // For editing
  const [editingField, setEditingField] = useState<{ teacherID: string | null; field: string | null }>({
    teacherID: null,
    field: null
  });
  const [fieldValues, setFieldValues] = useState<{ telNumber: string; teacherName: string }>({
    telNumber: "",
    teacherName: ""
  });

  // For selection
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // For adding new staff
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [newStaff, setNewStaff] = useState<{ teacherName: string; teacherID: string; telNumber: string }>({
    teacherName: "",
    teacherID: "",
    telNumber: ""
  });

  // For deleting staff
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // Long press ref
  const longPressRef = useRef<number | null>(null);

  // Utility functions
  const formatPhoneNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Fetch user data on mount
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
        .select("school")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        throw new Error("Failed to retrieve profile information.");
      }

      setUserSchool(profileData.school);
      fetchTeachers(profileData.school);
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teachers
  const fetchTeachers = async (school: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("teacher")
        .select("*")
        .eq("school", school)
        .order("teacherName", { ascending: true });

      if (error) throw error;

      const today = new Date().getDate();
      const todayStr = today.toString();
      const eveningTodayStr = `e${today}`;

      const formattedData = (data as any[]).map((teacher) => {
        const days: Record<string, boolean | number | null> = {};
        for (let i = 1; i <= 31; i++) {
          const dayStr = i.toString();
          const eveningDayStr = `e${i}`;
          days[dayStr] = teacher[dayStr] !== undefined ? teacher[dayStr] : null;
          days[eveningDayStr] = teacher[eveningDayStr] !== undefined ? teacher[eveningDayStr] : null;
        }

        return {
          index: teacher.id,
          Login: teacher.Login,
          Logout: teacher.Logout,
          telNumber: teacher.telNumber,
          teacherID: teacher.teacherID,
          teacherName: teacher.teacherName,
          Morning: days[todayStr] !== undefined ? days[todayStr] : null,       // Updated
          Evening: days[eveningTodayStr] !== undefined ? days[eveningTodayStr] : null, // New
          minLate: teacher.minLate || 0,
          totalLate: teacher.totalLate || 0,
          presentMorning: teacher.present || 0,                             // Renamed
          presentEvening: teacher.presentEvening || 0,                       // New
          days,
        };
      });

      // Calculate Days Absent and update 'present' columns
      for (let teacher of formattedData) {
        const daysAbsentMorning = calculateDaysAbsent(teacher.days, today, false);
        const daysAbsentEvening = calculateDaysAbsent(teacher.days, today, true);
        let updateNeeded = false;
        const updateData: any = {};

        if (teacher.presentMorning !== daysAbsentMorning) {
          updateData.present = daysAbsentMorning;
          teacher.presentMorning = daysAbsentMorning;
          updateNeeded = true;
        }

        if (teacher.presentEvening !== daysAbsentEvening) {
          updateData.presentEvening = daysAbsentEvening;
          teacher.presentEvening = daysAbsentEvening;
          updateNeeded = true;
        }

        if (updateNeeded) {
          await supabase
            .from("teacher")
            .update(updateData)
            .eq("teacherID", teacher.teacherID);
        }
      }

      setTeachers(formattedData);
      setFilteredTeachers(formattedData);
    } catch (error: any) {
      console.error("Error fetching teachers:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search and filters
  useEffect(() => {
    let temp = [...teachers];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        (teacher) =>
          (teacher.teacherName && teacher.teacherName.toLowerCase().includes(term)) ||
          (teacher.teacherID && teacher.teacherID.toLowerCase().includes(term))
      );
    }

    if (filterNotPresentMorning) {
      temp = temp.filter((teacher) => teacher.Morning === null);
    }

    if (filterNotPresentEvening) {
      temp = temp.filter((teacher) => teacher.Evening === null);
    }

    setFilteredTeachers(temp);
  }, [searchTerm, teachers, filterNotPresentMorning, filterNotPresentEvening]);

  // Handle long press for editing
  const handleLongPressStart = (
    e: React.MouseEvent | React.TouchEvent,
    teacherID: string,
    field: string,
    currentValue: any
  ) => {
    e.preventDefault();
    longPressRef.current = window.setTimeout(() => {
      setEditingField({ teacherID, field });
      if (field === "telNumber" || field === "teacherName") {
        setFieldValues({ ...fieldValues, [field]: currentValue || "" });
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  // Handle field blur to save changes
  const handleFieldBlur = async (teacherID: string, field: string) => {
    const newValue = fieldValues[field as keyof typeof fieldValues].trim();
    try {
      const updateData: any = {};
      updateData[field] = newValue || null;

      const { error } = await supabase
        .from("teacher")
        .update(updateData)
        .eq("teacherID", teacherID);

      if (error) throw error;

      fetchTeachers(userSchool);
      setEditingField({ teacherID: null, field: null });
      setFieldValues({ ...fieldValues, [field]: "" });
    } catch (error: any) {
      console.error(`Error updating ${field}:`, error.message);
    }
  };

  // Generate WhatsApp link
  const generateWhatsAppLink = (number: string) => {
    if (!number) return null;
    const sanitizedNumber = number.replace(/\D/g, "");
    if (!sanitizedNumber) return null;

    return `https://wa.me/${sanitizedNumber}`;
  };

  // Handle checkbox selection
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedTeachers(new Set());
    } else {
      const allIDs = filteredTeachers.map((teacher) => teacher.teacherID);
      setSelectedTeachers(new Set(allIDs));
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (teacherID: string) => {
    const newSelected = new Set(selectedTeachers);
    if (newSelected.has(teacherID)) {
      newSelected.delete(teacherID);
    } else {
      newSelected.add(teacherID);
    }
    setSelectedTeachers(newSelected);
    setSelectAll(newSelected.size === filteredTeachers.length);
  };

  // Handle Delete Staff
  const handleDeleteStaff = async () => {
    try {
      for (let teacherID of selectedTeachers) {
        const { error } = await supabase
          .from("teacher")
          .delete()
          .eq("teacherID", teacherID);
        if (error) throw error;
      }
      fetchTeachers(userSchool);
      setSelectedTeachers(new Set());
      setDeleteConfirmVisible(false);
    } catch (error: any) {
      console.error("Error deleting staff:", error.message);
    }
  };

  // Handle adding new staff
  const handleAddStaff = async () => {
    const { teacherName, teacherID, telNumber } = newStaff;
    if (!teacherName || !teacherID || !telNumber) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { error } = await supabase.from("teacher").insert([
        {
          teacherName,
          teacherID,
          telNumber,
          school: userSchool,
          present: 0,
          presentEvening: 0, // Initialize presentEvening
          minLate: 0,
          totalLate: 0,
        },
      ]);

      if (error) throw error;

      fetchTeachers(userSchool);
      setAddStaffModalVisible(false);
      setNewStaff({ teacherName: "", teacherID: "", telNumber: "" });
    } catch (error: any) {
      console.error("Error adding new staff:", error.message);
    }
  };

  // Current day for 'Morning' and 'Evening' columns
  const currentDay = new Date().getDate();
  const currentDayStr = currentDay.toString();
  const eveningCurrentDayStr = `e${currentDay}`;

  // Function to calculate Days Absent up to today
  const calculateDaysAbsent = (days: Record<string, boolean | number | null>, today: number, isEvening: boolean) => {
    let count = 0;
    for (let i = 1; i <= today; i++) {
      const dayStr = isEvening ? `e${i}` : i.toString();
      if (days[dayStr] === false) {
        count += 1;
      }
    }
    return count;
  };

  // Function to get Morning or Evening display
  const getAttendanceDisplay = (value: boolean | number | null) => {
    if (value === true) {
      return (
        <input
          type="checkbox"
          checked={true}
          readOnly
          style={{
            width: "20px",
            height: "20px",
            cursor: "default",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "4px",
          }}
        />
      );
    } else if (value === false || value === null) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ color: "#dc3545", fontSize: "18px" }}>❌</span>
        </div>
      );
    } else if (typeof value === "number") {
      return (
        <span style={{ color: "#dc3545", fontWeight: "bold" }}>{value}</span>
      );
    } else {
      return "---";
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Staff Attendance</h1>
      <p style={styles.schoolName}>{userSchool}</p>

      {/* Top Section: Filters and Add Staff */}
      <div style={styles.topSection}>
        {/* Filter Container */}
        <div style={styles.filterContainer}>
          <h2 style={styles.subHeader}>Filters</h2>

          {/* Search Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Search:</label>
            <input
              type="text"
              placeholder="Search by Full Name or Staff ID..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* New Filter Buttons */}
          <div style={styles.formGroup}>
            <Button
              onClick={() => setFilterNotPresentMorning(!filterNotPresentMorning)}
              variant={filterNotPresentMorning ? "danger" : "secondary"}
              style={{ ...styles.filterButton, marginBottom: '10px', width: '100%' }}
              title="Filter staff who are not present in the Morning"
            >
              {filterNotPresentMorning ? "🔴 Not Present (Morning)" : "🕒 Not Present (Morning)"}
            </Button>
            <Button
              onClick={() => setFilterNotPresentEvening(!filterNotPresentEvening)}
              variant={filterNotPresentEvening ? "danger" : "secondary"}
              style={{ ...styles.filterButton, width: '100%' }}
              title="Filter staff who are not present in the Evening"
            >
              {filterNotPresentEvening ? "🔴 Not Present (Evening)" : "🕒 Not Present (Evening)"}
            </Button>
          </div>
        </div>

        {/* Add Staff Container */}
        <div style={styles.addStaffContainer}>
          <h2 style={styles.subHeader}>Add New Staff</h2>
          <Button
            onClick={() => setAddStaffModalVisible(true)}
            variant="primary"
            style={styles.addStaffButton}
          >
            ➕ Add Staff
          </Button>
        </div>
      </div>

      {/* Delete Staff Button */}
      {selectedTeachers.size > 0 && (
        <div style={styles.deleteButtonContainer}>
          <Button
            onClick={() => setDeleteConfirmVisible(true)}
            variant="danger"
            style={styles.deleteStaffButton}
          >
            Delete Staff
          </Button>
        </div>
      )}

      {/* Teachers Table */}
      <div style={styles.tableContainer}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Loading...</p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                {/* Select All Checkbox */}
                <th style={styles.th}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    style={styles.checkbox}
                  />
                </th>
                <th style={styles.th}>Login</th>
                <th style={styles.th}>Logout</th>
                <th style={styles.th}>Phone Number</th>
                <th style={styles.th}>Staff ID</th>
                <th style={styles.th}>Full Name</th>
                {/* Updated Columns: Morning and Evening */}
                <th style={styles.th}>Morning</th>
                <th style={styles.th}>Evening</th>
                <th style={styles.th}>mins Late</th>
                <th style={styles.th}>Total mins Late</th>
                {/* Updated Columns: Morning (Days) and Evening (Days) */}
                <th style={styles.th}>Morning (Days)</th>
                <th style={styles.th}>Evening (Days)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.teacherID} style={styles.tr}>
                  {/* Select Checkbox */}
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selectedTeachers.has(teacher.teacherID!)}
                      onChange={() => handleRowSelect(teacher.teacherID!)}
                      style={styles.checkbox}
                    />
                  </td>

                  {/* Login */}
                  <td style={styles.td}>
                    {teacher.Login || "---"}
                  </td>

                  {/* Logout */}
                  <td style={styles.td}>
                    {teacher.Logout || "---"}
                  </td>

                  {/* Phone Number */}
                  <td style={styles.td}>
                    {editingField.teacherID === teacher.teacherID && editingField.field === "telNumber" ? (
                      <input
                        type="text"
                        value={fieldValues.telNumber}
                        onChange={(e) => setFieldValues({ ...fieldValues, telNumber: e.target.value })}
                        onBlur={() => handleFieldBlur(teacher.teacherID!, "telNumber")}
                        autoFocus
                        style={styles.editInput}
                        onFocus={(e) => e.target.select()}
                      />
                    ) : (
                      <a
                        href={generateWhatsAppLink(teacher.telNumber!) || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.phoneLink}
                        onMouseDown={(e) => handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)}
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressEnd}
                        onTouchStart={(e) => handleLongPressStart(e, teacher.teacherID!, "telNumber", teacher.telNumber)}
                        onTouchEnd={handleLongPressEnd}
                        title="Click to message on WhatsApp or hold to edit"
                      >
                        {teacher.telNumber || "---"}
                      </a>
                    )}
                  </td>

                  {/* Staff ID */}
                  <td style={styles.td}>{teacher.teacherID || "---"}</td>

                  {/* Full Name */}
                  <td style={styles.td}>
                    {editingField.teacherID === teacher.teacherID && editingField.field === "teacherName" ? (
                      <input
                        type="text"
                        value={fieldValues.teacherName}
                        onChange={(e) => setFieldValues({ ...fieldValues, teacherName: e.target.value })}
                        onBlur={() => handleFieldBlur(teacher.teacherID!, "teacherName")}
                        autoFocus
                        style={styles.editInput}
                        onFocus={(e) => e.target.select()}
                      />
                    ) : (
                      <span
                        style={styles.editableText}
                        onMouseDown={(e) => handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)}
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressEnd}
                        onTouchStart={(e) => handleLongPressStart(e, teacher.teacherID!, "teacherName", teacher.teacherName)}
                        onTouchEnd={handleLongPressEnd}
                        title="Hold to edit"
                      >
                        {teacher.teacherName || "---"}
                      </span>
                    )}
                  </td>

                  {/* Morning */}
                  <td style={styles.td}>
                    {getAttendanceDisplay(teacher.Morning)}
                  </td>

                  {/* Evening */}
                  <td style={styles.td}>
                    {getAttendanceDisplay(teacher.Evening)}
                  </td>

                  {/* mins Late */}
                  <td style={styles.td}>{teacher.minLate || 0}</td>

                  {/* Total mins Late */}
                  <td style={styles.td}>{teacher.totalLate || 0}</td>

                  {/* Morning (Days) */}
                  <td style={styles.td}>
                    {teacher.presentMorning}
                  </td>

                  {/* Evening (Days) */}
                  <td style={styles.td}>
                    {teacher.presentEvening}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noDataText}>No staff found for the selected filters.</p>
        )}
      </div>

      {/* Add Staff Modal */}
      <Modal show={addStaffModalVisible} onHide={() => setAddStaffModalVisible(false)} centered>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title>Add New Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Form>
            <Form.Group controlId="staffFullName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={newStaff.teacherName}
                onChange={(e) => setNewStaff({ ...newStaff, teacherName: e.target.value })}
                style={styles.modalInput}
              />
            </Form.Group>

            <Form.Group controlId="staffID" className="mb-3">
              <Form.Label>Staff ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter staff ID"
                value={newStaff.teacherID}
                onChange={(e) => setNewStaff({ ...newStaff, teacherID: e.target.value })}
                style={styles.modalInput}
              />
            </Form.Group>

            <Form.Group controlId="staffPhone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={newStaff.telNumber}
                onChange={(e) => setNewStaff({ ...newStaff, telNumber: e.target.value })}
                style={styles.modalInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="secondary" onClick={() => setAddStaffModalVisible(false)} style={styles.modalCloseButton}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStaff} style={styles.modalSubmitButton}>
            Add Staff
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmVisible} onHide={() => setDeleteConfirmVisible(false)} centered>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          Are you sure you want to delete the selected staff members?
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="secondary" onClick={() => setDeleteConfirmVisible(false)} style={styles.modalCloseButton}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStaff} style={styles.modalDeleteButton}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


// StaffAttendance.tsx - Part 2

// Styles
const styles: Record<string, CSSProperties> = {
  container: {
    width: "95%",
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#121212",
    boxShadow: "0 4px 20px 1px #007BA7",
    borderRadius: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#ffffff",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#e0e0e0",
    textAlign: "center",
  },
  schoolName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#b0b0b0",
    textAlign: "center",
  },
  topSection: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },
  filterContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px 1px #000",
    flex: "1",
    minWidth: "280px",
  },
  addStaffContainer: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px 1px #000",
    flex: "1",
    minWidth: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
    color: "#fff",
  },
  searchInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  filterButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginBottom: "10px", // Added for spacing between buttons
  },
  addStaffButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteButtonContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "flex-start",
  },
  deleteStaffButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#1e1e1e",
    padding: "12px",
    position: "relative",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px", // Adjusted to accommodate new columns
    color: "#fff",
    fontSize: "16px",
  },
  th: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#3ecf8e",
    color: "#000",
    fontSize: "18px",
  },
  td: {
    border: "1px solid #555",
    textAlign: "center",
    padding: "10px",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
  },
  tr: {
    borderBottom: "1px solid #555",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  editableText: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#3ecf8e",
  },
  editInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "5px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  },
  phoneLink: {
    color: '#3ecf8e',
    textDecoration: 'underline',
    cursor: 'pointer',
    backgroundColor: '#1e1e1e',
  },
  noDataText: {
    textAlign: "center",
    color: "#fff",
    fontSize: "18px",
    padding: "20px",
  },
  loadingContainer: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '18px',
  },
  modalHeader: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderBottom: "1px solid #555",
  },
  modalBody: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
  },
  modalFooter: {
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #555",
  },
  modalInput: {
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    width: "100%",
  },
  modalSubmitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  modalDeleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },
  modalCloseButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginRight: "10px",
  },

  numberText: {
    color: "#dc3545",
    fontWeight: "bold",
  },
};

export default StaffAttendance;
