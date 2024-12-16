

// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import AlertModal from "./AlertModal";

// function StudentForm() {
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [students, setStudents] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editStudent, setEditStudent] = useState(null);
//   const [alertMessage, setAlertMessage] = useState("");

//   useEffect(() => {
//     fetchUserSchool();
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//       setSelectedSection(""); // Reset section when class changes
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       setStudents([]);
//     }
//   }, [selectedClassName]);

//   useEffect(() => {
//     if (selectedClassName && selectedSection) {
//       fetchStudents(selectedClassName, selectedSection);
//     } else {
//       setStudents([]);
//     }
//   }, [selectedClassName, selectedSection]);

//   const fetchUserSchool = async () => {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data: profile, error } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", user.id)
//           .single();

//         if (error) throw error;

//         setUserSchool(profile.school);
//         fetchClassNames(profile.school);
//       }
//     } catch (error) {
//       console.error("Error fetching user school:", error.message);
//       setAlertMessage("Error fetching user school. Please try again.");
//     }
//   };

//   const fetchClassNames = async (school) => {
//     try {
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
//     }
//   };

//   const fetchSections = async (className) => {
//     try {
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
//     }
//   };

//   const fetchStudents = async (className, section) => {
//     try {
//       const { data, error } = await supabase
//         .from("student")
//         .select("id, studentName, className, section")
//         .eq("className", className)
//         .eq("section", section)
//         .order("id", { ascending: true });

//       if (error) throw error;

//       setStudents(
//         data.map((item) => ({
//           id: item.id,
//           name: item.studentName,
//           checked: false,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     }
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);
//     setStudents((prev) =>
//       prev.map((student) => ({ ...student, checked: newSelectAll }))
//     );
//   };

//   const saveChanges = async () => {
//     try {
//       const updates = students
//         .filter((student) => student.checked)
//         .map((student) => ({
//           id: student.id,
//           className: selectedClassName,
//           section: selectedSection,
//         }));

//       for (const update of updates) {
//         const { error } = await supabase
//           .from("student")
//           .update(update)
//           .eq("id", update.id);

//         if (error) throw error;
//       }

//       setAlertMessage("Changes saved successfully!");
//       // Optionally, refetch students to reflect changes
//       fetchStudents(selectedClassName, selectedSection);
//     } catch (error) {
//       console.error("Error saving changes:", error.message);
//       setAlertMessage("Error saving changes. Please try again.");
//     }
//   };

//   const openEditModal = (student) => {
//     setEditStudent(student);
//   };

//   const updateStudent = async () => {
//     try {
//       const { id, name, studentNumber, guardianNumber, className, section } =
//         editStudent;

//       const { error } = await supabase
//         .from("student")
//         .update({
//           studentName: name,
//           studentNumber,
//           guardianNumber,
//           className,
//           section,
//         })
//         .eq("id", id);

//       if (error) throw error;

//       setEditStudent(null);
//       fetchStudents(selectedClassName, selectedSection); // Refresh student list
//       setAlertMessage("Student updated successfully!");
//     } catch (error) {
//       console.error("Error updating student:", error.message);
//       setAlertMessage("Error updating student. Please try again.");
//     }
//   };

//   // Fetch sections for the edit modal when editStudent.className changes
//   useEffect(() => {
//     const fetchSectionsForEdit = async () => {
//       if (editStudent && editStudent.className) {
//         try {
//           const { data, error } = await supabase
//             .from("student")
//             .select("section")
//             .eq("className", editStudent.className)
//             .neq("section", null);

//           if (error) throw error;

//           const uniqueSections = [...new Set(data.map((item) => item.section))];
//           setEditSections(uniqueSections);
//         } catch (error) {
//           console.error("Error fetching sections for edit:", error.message);
//           setAlertMessage("Error fetching sections. Please try again.");
//         }
//       }
//     };

//     fetchSectionsForEdit();
//   }, [editStudent?.className]);

//   // Separate sections state for the edit modal
//   const [editSections, setEditSections] = useState([]);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Student Form</h1>
//       <p style={styles.schoolName}>School: {userSchool}</p>

//       <div style={styles.formGroup}>
//         <label>Class</label>
//         <select
//           style={styles.dropdown}
//           value={selectedClassName}
//           onChange={(e) => {
//             setSelectedClassName(e.target.value);
//           }}
//         >
//           <option value="">Select Class</option>
//           {classNames.map((className) => (
//             <option key={className} value={className}>
//               {className}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedClassName && (
//         <div style={styles.formGroup}>
//           <label>Section</label>
//           <select
//             style={styles.dropdown}
//             value={selectedSection}
//             onChange={(e) => {
//               setSelectedSection(e.target.value);
//             }}
//           >
//             <option value="">Select Section</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {students.length > 0 && (
//         <>
//           <div style={styles.selectAll}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//                 style={styles.selectAllCheckbox}
//               />
//               Select All
//             </label>
//           </div>

//           <div style={styles.studentsList}>
//             {students.map((student) => (
//               <div key={student.id} style={styles.studentItem}>
//                 <input
//                   type="text"
//                   value={student.id}
//                   style={styles.idInput}
//                   readOnly
//                 />
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={student.checked}
//                     onChange={() =>
//                       setStudents((prev) =>
//                         prev.map((s) =>
//                           s.id === student.id
//                             ? { ...s, checked: !s.checked }
//                             : s
//                         )
//                       )
//                     }
//                     style={styles.studentCheckbox}
//                   />
//                   <input
//                     type="text"
//                     value={student.name}
//                     readOnly
//                     style={styles.studentNameInput}
//                   />
//                 </label>
//                 <button
//                   onClick={() => openEditModal(student)}
//                   style={styles.editBtn}
//                 >
//                   ✏️
//                 </button>
//               </div>
//             ))}
//           </div>

//           <button onClick={saveChanges} style={styles.saveBtn}>
//             Save
//           </button>
//         </>
//       )}

//       {editStudent && (
//         <div style={styles.editModal}>
//           <h2>Edit Student</h2>
//           <label>
//             Name
//             <input
//               value={editStudent.name}
//               onChange={(e) =>
//                 setEditStudent((prev) => ({ ...prev, name: e.target.value }))
//               }
//               style={styles.input}
//             />
//           </label>
//           <label>
//             Student Number
//             <input
//               value={editStudent.studentNumber || ""}
//               onChange={(e) =>
//                 setEditStudent((prev) => ({
//                   ...prev,
//                   studentNumber: e.target.value,
//                 }))
//               }
//               style={styles.input}
//             />
//           </label>
//           <label>
//             Guardian Number
//             <input
//               value={editStudent.guardianNumber || ""}
//               onChange={(e) =>
//                 setEditStudent((prev) => ({
//                   ...prev,
//                   guardianNumber: e.target.value,
//                 }))
//               }
//               style={styles.input}
//             />
//           </label>
//           <label>
//             Class
//             <select
//               value={editStudent.className}
//               onChange={(e) =>
//                 setEditStudent((prev) => ({
//                   ...prev,
//                   className: e.target.value,
//                 }))
//               }
//               style={styles.dropdown}
//             >
//               <option value="">Select Class</option>
//               {classNames.map((className) => (
//                 <option key={className} value={className}>
//                   {className}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <label>
//             Section
//             <select
//               value={editStudent.section}
//               onChange={(e) =>
//                 setEditStudent((prev) => ({
//                   ...prev,
//                   section: e.target.value,
//                 }))
//               }
//               style={styles.dropdown}
//             >
//               <option value="">Select Section</option>
//               {editSections.map((section) => (
//                 <option key={section} value={section}>
//                   {section}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <button onClick={updateStudent} style={styles.updateBtn}>
//             Update
//           </button>
//           <button
//             onClick={() => setEditStudent(null)}
//             style={styles.closeBtn}
//           >
//             Close
//           </button>
//         </div>
//       )}

//       {alertMessage && (
//         <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: "60%",
//     margin: "0 auto",
//     padding: "20px",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     borderRadius: "8px",
//     textAlign: "center",
//     position: "relative",
//   },
//   header: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginBottom: "10px",
//   },
//   schoolName: {
//     fontSize: "18px",
//     fontWeight: "600",
//     marginBottom: "20px",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     textAlign: "left",
//   },
//   dropdown: {
//     width: "100%",
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//   },
//   selectAll: {
//     marginBottom: "20px",
//     textAlign: "left",
//   },
//   selectAllCheckbox: {
//     marginRight: "10px",
//   },
//   studentsList: {
//     maxHeight: "300px",
//     overflowY: "auto",
//     marginBottom: "20px",
//     textAlign: "left",
//   },
//   studentItem: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   studentCheckbox: {
//     marginRight: "10px",
//   },
//   studentNameInput: {
//     width: "200px",
//     padding: "8px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     marginLeft: "10px",
//   },
//   idInput: {
//     width: "100px",
//     padding: "8px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     marginRight: "10px",
//   },
//   editBtn: {
//     backgroundColor: "#f1f1f1",
//     border: "none",
//     borderRadius: "50%",
//     padding: "10px",
//     marginLeft: "10px",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     backgroundColor: "#28a745",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   updateBtn: {
//     backgroundColor: "#007bff",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginRight: "10px",
//   },
//   closeBtn: {
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   editModal: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     position: "absolute",
//     top: "20%",
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: "50%",
//     zIndex: 1000,
//     textAlign: "left",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     marginBottom: "10px",
//   },
// };

// export default StudentForm;

// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import AlertModal from "./AlertModal";

// function StudentForm() {
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [students, setStudents] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editStudent, setEditStudent] = useState(null);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [newStudent, setNewStudent] = useState({
//     studentName: "",
//     studentNumber: "",
//     guardianNumber: "",
//     className: "",
//     section: "",
//   });
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     fetchUserSchool();
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//       setSelectedSection(""); // Reset section when class changes
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       setStudents([]);
//     }
//   }, [selectedClassName]);

//   useEffect(() => {
//     if (selectedClassName && selectedSection) {
//       fetchStudents(selectedClassName, selectedSection);
//     } else {
//       setStudents([]);
//     }
//   }, [selectedClassName, selectedSection]);

//   const fetchUserSchool = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data: profile, error } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", user.id)
//           .single();

//         if (error) throw error;

//         setUserSchool(profile.school);
//         fetchClassNames(profile.school);
//       }
//     } catch (error) {
//       console.error("Error fetching user school:", error.message);
//       setAlertMessage("Error fetching user school. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//   const fetchStudents = async (className, section) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("id, studentName, className, section, studentNumber, guardianNumber, school")
//         .eq("className", className)
//         .eq("section", section)
//         .order("id", { ascending: true });

//       if (error) throw error;

//       const mappedStudents = data.map((item) => ({
//         id: item.id,
//         studentName: item.studentName,
//         className: item.className,
//         section: item.section,
//         studentNumber: item.studentNumber || "",
//         guardianNumber: item.guardianNumber || "",
//         school: item.school || "",
//         checked: false,
//       }));
//       setStudents(mappedStudents);
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);
//     setStudents((prev) =>
//       prev.map((student) => ({ ...student, checked: newSelectAll }))
//     );
//   };

//   const saveChanges = async () => {
//     try {
//       setIsLoading(true);
//       const updates = students
//         .filter((student) => student.checked)
//         .map((student) => ({
//           id: student.id,
//           className: selectedClassName,
//           section: selectedSection,
//         }));

//       if (updates.length === 0) {
//         setAlertMessage("No students selected for update.");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("student")
//         .upsert(updates, { onConflict: "id" });

//       if (error) throw error;

//       setAlertMessage("Changes saved successfully!");
//       // Refresh student list
//       fetchStudents(selectedClassName, selectedSection);
//     } catch (error) {
//       console.error("Error saving changes:", error.message);
//       setAlertMessage("Error saving changes. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteSelectedStudents = async () => {
//     const selectedIds = students
//       .filter((student) => student.checked)
//       .map((student) => student.id);

//     if (selectedIds.length === 0) {
//       setAlertMessage("No students selected for deletion.");
//       return;
//     }

//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} selected student(s)? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .delete()
//         .in("id", selectedIds);

//       if (error) throw error;

//       setAlertMessage("Selected students deleted successfully!");
//       // Refresh student list
//       fetchStudents(selectedClassName, selectedSection);
//     } catch (error) {
//       console.error("Error deleting students:", error.message);
//       setAlertMessage("Error deleting students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openEditModal = (student) => {
//     setEditStudent(student);
//   };

//   const updateStudent = async () => {
//     try {
//       setIsLoading(true);
//       const { id, studentName, studentNumber, guardianNumber, className, section } =
//         editStudent;

//       const { error } = await supabase
//         .from("student")
//         .update({
//           studentName,
//           studentNumber,
//           guardianNumber,
//           className,
//           section,
//         })
//         .eq("id", id);

//       if (error) throw error;

//       setAlertMessage("Student updated successfully!");
//       setEditStudent(null);
//       fetchStudents(selectedClassName, selectedSection); // Refresh student list
//     } catch (error) {
//       console.error("Error updating student:", error.message);
//       setAlertMessage("Error updating student. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddStudent = async () => {
//     const { studentName, studentNumber, guardianNumber, className, section } =
//       newStudent;

//     if (
//       !studentName ||
//       !studentNumber ||
//       !guardianNumber ||
//       !className ||
//       !section
//     ) {
//       setAlertMessage("Please fill in all fields to add a new student.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase.from("student").insert([
//         {
//           studentName,
//           studentNumber,
//           guardianNumber,
//           className,
//           section,
//           school: userSchool,
//         },
//       ]);

//       if (error) throw error;

//       setAlertMessage("New student added successfully!");
//       setNewStudent({
//         studentName: "",
//         studentNumber: "",
//         guardianNumber: "",
//         className: "",
//         section: "",
//       });
//       // Refresh student list if the new student matches the selected class and section
//       if (className === selectedClassName && section === selectedSection) {
//         fetchStudents(selectedClassName, selectedSection);
//       }
//     } catch (error) {
//       console.error("Error adding student:", error.message);
//       setAlertMessage("Error adding student. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch sections for the edit modal when editStudent.className changes
//   useEffect(() => {
//     const fetchSectionsForEdit = async () => {
//       if (editStudent && editStudent.className) {
//         try {
//           setIsLoading(true);
//           const { data, error } = await supabase
//             .from("student")
//             .select("section")
//             .eq("className", editStudent.className)
//             .neq("section", null);

//           if (error) throw error;

//           const uniqueSections = [...new Set(data.map((item) => item.section))];
//           setEditSections(uniqueSections);
//         } catch (error) {
//           console.error("Error fetching sections for edit:", error.message);
//           setAlertMessage("Error fetching sections. Please try again.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchSectionsForEdit();
//   }, [editStudent?.className]);

//   // Separate sections state for the edit modal
//   const [editSections, setEditSections] = useState([]);

//   // Handle search
//   const filteredStudents = students.filter((student) =>
//     student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Student Management</h1>
//       <p style={styles.schoolName}>School: {userSchool}</p>

//       {/* Class Selection */}
//       <div style={styles.formGroup}>
//         <label style={styles.label}>Class:</label>
//         <select
//           style={styles.dropdown}
//           value={selectedClassName}
//           onChange={(e) => {
//             setSelectedClassName(e.target.value);
//           }}
//         >
//           <option value="">Select Class</option>
//           {classNames.map((className) => (
//             <option key={className} value={className}>
//               {className}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Section Selection */}
//       {selectedClassName && (
//         <div style={styles.formGroup}>
//           <label style={styles.label}>Section:</label>
//           <select
//             style={styles.dropdown}
//             value={selectedSection}
//             onChange={(e) => {
//               setSelectedSection(e.target.value);
//             }}
//           >
//             <option value="">Select Section</option>
//             {sections.map((section) => (
//               <option key={section} value={section}>
//                 {section}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Search Bar */}
//       {students.length > 0 && (
//         <div style={styles.formGroup}>
//           <input
//             type="text"
//             placeholder="Search by student name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={styles.searchInput}
//           />
//         </div>
//       )}

//       {/* Student List */}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         selectedClassName &&
//         selectedSection && (
//           <>
//             {/* Action Buttons */}
//             <div style={styles.actionButtons}>
//               <button onClick={handleSelectAll} style={styles.selectAllBtn}>
//                 {selectAll ? "Deselect All" : "Select All"}
//               </button>
//               <button onClick={saveChanges} style={styles.saveBtn}>
//                 Save Changes
//               </button>
//               <button
//                 onClick={deleteSelectedStudents}
//                 style={styles.deleteBtn}
//               >
//                 Delete Selected
//               </button>
//             </div>

//             {/* Student Table */}
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th style={styles.th}>ID</th>
//                   <th style={styles.th}>Name</th>
//                   <th style={styles.th}>Student Number</th>
//                   <th style={styles.th}>Guardian Number</th>
//                   <th style={styles.th}>Class</th>
//                   <th style={styles.th}>Section</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((student) => (
//                     <tr key={student.id} style={styles.tr}>
//                       <td style={styles.td}>
//                         <input
//                           type="checkbox"
//                           checked={student.checked}
//                           onChange={() =>
//                             setStudents((prev) =>
//                               prev.map((s) =>
//                                 s.id === student.id
//                                   ? { ...s, checked: !s.checked }
//                                   : s
//                               )
//                             )
//                           }
//                         />
//                       </td>
//                       <td style={styles.td}>{student.id}</td>
//                       <td style={styles.td}>{student.studentName}</td>
//                       <td style={styles.td}>{student.studentNumber}</td>
//                       <td style={styles.td}>{student.guardianNumber}</td>
//                       <td style={styles.td}>{student.className}</td>
//                       <td style={styles.td}>{student.section}</td>
//                       <td style={styles.td}>
//                         <button
//                           onClick={() => openEditModal(student)}
//                           style={styles.editBtn}
//                         >
//                           ✏️
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" style={styles.noData}>
//                       No students found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             {/* Add New Student Form */}
//             <div style={styles.addStudentContainer}>
//               <h2>Add New Student</h2>
//               <div style={styles.addForm}>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Name:</label>
//                   <input
//                     type="text"
//                     value={newStudent.studentName}
//                     onChange={(e) =>
//                       setNewStudent((prev) => ({
//                         ...prev,
//                         studentName: e.target.value,
//                       }))
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Student Number:</label>
//                   <input
//                     type="text"
//                     value={newStudent.studentNumber}
//                     onChange={(e) =>
//                       setNewStudent((prev) => ({
//                         ...prev,
//                         studentNumber: e.target.value,
//                       }))
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Guardian Number:</label>
//                   <input
//                     type="text"
//                     value={newStudent.guardianNumber}
//                     onChange={(e) =>
//                       setNewStudent((prev) => ({
//                         ...prev,
//                         guardianNumber: e.target.value,
//                       }))
//                     }
//                     style={styles.input}
//                   />
//                 </div>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Class:</label>
//                   <select
//                     value={newStudent.className}
//                     onChange={(e) =>
//                       setNewStudent((prev) => ({
//                         ...prev,
//                         className: e.target.value,
//                       }))
//                     }
//                     style={styles.dropdown}
//                   >
//                     <option value="">Select Class</option>
//                     {classNames.map((className) => (
//                       <option key={className} value={className}>
//                         {className}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Section:</label>
//                   <select
//                     value={newStudent.section}
//                     onChange={(e) =>
//                       setNewStudent((prev) => ({
//                         ...prev,
//                         section: e.target.value,
//                       }))
//                     }
//                     style={styles.dropdown}
//                   >
//                     <option value="">Select Section</option>
//                     {sections.map((section) => (
//                       <option key={section} value={section}>
//                         {section}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <button onClick={handleAddStudent} style={styles.addBtn}>
//                   Add Student
//                 </button>
//               </div>
//             </div>
//           </>
//         )
//       )}

//       {/* Edit Student Modal */}
//       {editStudent && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.editModal}>
//             <h2>Edit Student</h2>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Name:</label>
//               <input
//                 type="text"
//                 value={editStudent.studentName}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     studentName: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Student Number:</label>
//               <input
//                 type="text"
//                 value={editStudent.studentNumber}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     studentNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Guardian Number:</label>
//               <input
//                 type="text"
//                 value={editStudent.guardianNumber}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     guardianNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Class:</label>
//               <select
//                 value={editStudent.className}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     className: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Class</option>
//                 {classNames.map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 value={editStudent.section}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     section: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Section</option>
//                 {editSections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.modalButtons}>
//               <button onClick={updateStudent} style={styles.updateBtn}>
//                 Update
//               </button>
//               <button
//                 onClick={() => setEditStudent(null)}
//                 style={styles.closeBtn}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

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

// const styles = {
//   container: {
//     width: "90%",
//     maxWidth: "1200px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     borderRadius: "10px",
//     position: "relative",
//     fontFamily: "Arial, sans-serif",
//   },
//   header: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "10px",
//     textAlign: "center",
//   },
//   schoolName: {
//     fontSize: "20px",
//     fontWeight: "600",
//     marginBottom: "20px",
//     textAlign: "center",
//   },
//   formGroup: {
//     marginBottom: "15px",
//     display: "flex",
//     flexDirection: "column",
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//   },
//   dropdown: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//   },
//   searchInput: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     width: "100%",
//     boxSizing: "border-box",
//   },
//   actionButtons: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "10px",
//   },
//   selectAllBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#6c757d",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   saveBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#28a745",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   deleteBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginBottom: "20px",
//   },
//   th: {
//     border: "1px solid #ddd",
//     padding: "12px",
//     backgroundColor: "#f2f2f2",
//     textAlign: "left",
//   },
//   tr: {
//     borderBottom: "1px solid #ddd",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "12px",
//   },
//   editBtn: {
//     backgroundColor: "#ffc107",
//     border: "none",
//     borderRadius: "5px",
//     padding: "8px 12px",
//     cursor: "pointer",
//     color: "#fff",
//     fontSize: "14px",
//   },
//   noData: {
//     textAlign: "center",
//     padding: "20px",
//     color: "#777",
//   },
//   addStudentContainer: {
//     padding: "20px",
//     backgroundColor: "#e9ecef",
//     borderRadius: "8px",
//   },
//   addForm: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "15px",
//   },
//   addBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     alignSelf: "flex-end",
//     marginTop: "10px",
//   },
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   editModal: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     width: "90%",
//     maxWidth: "500px",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//     position: "relative",
//     fontFamily: "Arial, sans-serif",
//   },
//   modalButtons: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "10px",
//     marginTop: "20px",
//   },
//   updateBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#28a745",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   closeBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default StudentForm;


// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import AlertModal from "./AlertModal";

// function StudentForm() {
//   const [userSchool, setUserSchool] = useState("");
//   const [classNames, setClassNames] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [selectedClassName, setSelectedClassName] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [students, setStudents] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [editStudent, setEditStudent] = useState(null);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [newStudent, setNewStudent] = useState({
//     studentName: "",
//     studentNumber: "",
//     guardianNumber: "",
//     className: "",
//     section: "",
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeContainer, setActiveContainer] = useState(null); // 'filters' or 'add'

//   useEffect(() => {
//     fetchUserSchool();
//   }, []);

//   useEffect(() => {
//     if (selectedClassName) {
//       fetchSections(selectedClassName);
//       setSelectedSection(""); // Reset section when class changes
//     } else {
//       setSections([]);
//       setSelectedSection("");
//       setStudents([]);
//     }
//   }, [selectedClassName]);

//   useEffect(() => {
//     if (selectedClassName && selectedSection) {
//       fetchStudents(selectedClassName, selectedSection);
//     } else {
//       setStudents([]);
//     }
//   }, [selectedClassName, selectedSection]);

//   const fetchUserSchool = async () => {
//     try {
//       setIsLoading(true);
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data: profile, error } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", user.id)
//           .single();

//         if (error) throw error;

//         setUserSchool(profile.school);
//         fetchClassNames(profile.school);
//       }
//     } catch (error) {
//       console.error("Error fetching user school:", error.message);
//       setAlertMessage("Error fetching user school. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//   const fetchStudents = async (className, section) => {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .select("id, studentName, className, section, studentNumber, guardianNumber, school")
//         .eq("className", className)
//         .eq("section", section)
//         .order("id", { ascending: true });

//       if (error) throw error;

//       const mappedStudents = data.map((item) => ({
//         id: item.id,
//         studentName: item.studentName,
//         className: item.className,
//         section: item.section,
//         studentNumber: item.studentNumber || "",
//         guardianNumber: item.guardianNumber || "",
//         school: item.school || "",
//         checked: false,
//       }));
//       setStudents(mappedStudents);
//     } catch (error) {
//       console.error("Error fetching students:", error.message);
//       setAlertMessage("Error fetching students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelectAll = () => {
//     const newSelectAll = !selectAll;
//     setSelectAll(newSelectAll);
//     setStudents((prev) =>
//       prev.map((student) => ({ ...student, checked: newSelectAll }))
//     );
//   };

//   const saveChanges = async () => {
//     try {
//       setIsLoading(true);
//       const updates = students
//         .filter((student) => student.checked)
//         .map((student) => ({
//           id: student.id,
//           className: selectedClassName,
//           section: selectedSection,
//         }));

//       if (updates.length === 0) {
//         setAlertMessage("No students selected for update.");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("student")
//         .upsert(updates, { onConflict: "id" });

//       if (error) throw error;

//       setAlertMessage("Changes saved successfully!");
//       // Refresh student list
//       fetchStudents(selectedClassName, selectedSection);
//     } catch (error) {
//       console.error("Error saving changes:", error.message);
//       setAlertMessage("Error saving changes. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteSelectedStudents = async () => {
//     const selectedIds = students
//       .filter((student) => student.checked)
//       .map((student) => student.id);

//     if (selectedIds.length === 0) {
//       setAlertMessage("No students selected for deletion.");
//       return;
//     }

//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} selected student(s)? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from("student")
//         .delete()
//         .in("id", selectedIds);

//       if (error) throw error;

//       setAlertMessage("Selected students deleted successfully!");
//       // Refresh student list
//       fetchStudents(selectedClassName, selectedSection);
//     } catch (error) {
//       console.error("Error deleting students:", error.message);
//       setAlertMessage("Error deleting students. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openEditModal = (student) => {
//     setEditStudent(student);
//   };

//   const updateStudent = async () => {
//     try {
//       setIsLoading(true);
//       const { id, studentName, studentNumber, guardianNumber, className, section } =
//         editStudent;

//       const { error } = await supabase
//         .from("student")
//         .update({
//           studentName,
//           studentNumber,
//           guardianNumber,
//           className,
//           section,
//         })
//         .eq("id", id);

//       if (error) throw error;

//       setAlertMessage("Student updated successfully!");
//       setEditStudent(null);
//       fetchStudents(selectedClassName, selectedSection); // Refresh student list
//     } catch (error) {
//       console.error("Error updating student:", error.message);
//       setAlertMessage("Error updating student. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddStudent = async () => {
//     const { studentName, studentNumber, guardianNumber, className, section } =
//       newStudent;

//     if (
//       !studentName ||
//       !studentNumber ||
//       !guardianNumber ||
//       !className ||
//       !section
//     ) {
//       setAlertMessage("Please fill in all fields to add a new student.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase.from("student").insert([
//         {
//           studentName,
//           studentNumber,
//           guardianNumber,
//           className,
//           section,
//           school: userSchool,
//         },
//       ]);

//       if (error) throw error;

//       setAlertMessage("New student added successfully!");
//       setNewStudent({
//         studentName: "",
//         studentNumber: "",
//         guardianNumber: "",
//         className: "",
//         section: "",
//       });
//       // Refresh student list if the new student matches the selected class and section
//       if (className === selectedClassName && section === selectedSection) {
//         fetchStudents(selectedClassName, selectedSection);
//       }
//     } catch (error) {
//       console.error("Error adding student:", error.message);
//       setAlertMessage("Error adding student. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch sections for the edit modal when editStudent.className changes
//   useEffect(() => {
//     const fetchSectionsForEdit = async () => {
//       if (editStudent && editStudent.className) {
//         try {
//           setIsLoading(true);
//           const { data, error } = await supabase
//             .from("student")
//             .select("section")
//             .eq("className", editStudent.className)
//             .neq("section", null);

//           if (error) throw error;

//           const uniqueSections = [...new Set(data.map((item) => item.section))];
//           setEditSections(uniqueSections);
//         } catch (error) {
//           console.error("Error fetching sections for edit:", error.message);
//           setAlertMessage("Error fetching sections. Please try again.");
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchSectionsForEdit();
//   }, [editStudent?.className]);

//   // Separate sections state for the edit modal
//   const [editSections, setEditSections] = useState([]);

//   // Handle search
//   const filteredStudents = students.filter((student) =>
//     student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle container activation
//   const handleContainerClick = (container) => {
//     setActiveContainer(container);
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Student Management</h1>
//       <p style={styles.schoolName}>School: {userSchool}</p>

//       {/* Top Section: Filters and Add New Student */}
//       <div style={styles.topSection}>
//         {/* Filters Container */}
//         <div
//           style={{
//             ...styles.topContainer,
//             opacity: activeContainer === "filters" || activeContainer === null ? 1 : 0.6,
//           }}
//           onClick={() => handleContainerClick("filters")}
//         >
//           <h2 style={styles.subHeader}>Filters</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Class:</label>
//             <select
//               style={styles.dropdown}
//               value={selectedClassName}
//               onChange={(e) => {
//                 setSelectedClassName(e.target.value);
//               }}
//             >
//               <option value="">Select Class</option>
//               {classNames.map((className) => (
//                 <option key={className} value={className}>
//                   {className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedClassName && (
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 style={styles.dropdown}
//                 value={selectedSection}
//                 onChange={(e) => {
//                   setSelectedSection(e.target.value);
//                 }}
//               >
//                 <option value="">Select Section</option>
//                 {sections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Add New Student Container */}
//         <div
//           style={{
//             ...styles.topContainer,
//             opacity: activeContainer === "add" || activeContainer === null ? 1 : 0.6,
//           }}
//           onClick={() => handleContainerClick("add")}
//         >
//           <h2 style={styles.subHeader}>Add New Student</h2>
//           <div style={styles.addForm}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Name:</label>
//               <input
//                 type="text"
//                 value={newStudent.studentName}
//                 onChange={(e) =>
//                   setNewStudent((prev) => ({
//                     ...prev,
//                     studentName: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Student Number:</label>
//               <input
//                 type="text"
//                 value={newStudent.studentNumber}
//                 onChange={(e) =>
//                   setNewStudent((prev) => ({
//                     ...prev,
//                     studentNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Guardian Number:</label>
//               <input
//                 type="text"
//                 value={newStudent.guardianNumber}
//                 onChange={(e) =>
//                   setNewStudent((prev) => ({
//                     ...prev,
//                     guardianNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Class:</label>
//               <select
//                 value={newStudent.className}
//                 onChange={(e) =>
//                   setNewStudent((prev) => ({
//                     ...prev,
//                     className: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Class</option>
//                 {classNames.map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 value={newStudent.section}
//                 onChange={(e) =>
//                   setNewStudent((prev) => ({
//                     ...prev,
//                     section: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Section</option>
//                 {sections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button onClick={handleAddStudent} style={styles.addBtn}>
//               Add Student
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       {students.length > 0 && (
//         <div style={styles.formGroup}>
//           <input
//             type="text"
//             placeholder="Search by student name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={styles.searchInput}
//           />
//         </div>
//       )}

//       {/* Student List */}
//       {isLoading ? (
//         <p style={styles.loadingText}>Loading...</p>
//       ) : (
//         selectedClassName &&
//         selectedSection && (
//           <>
//             {/* Action Buttons */}
//             <div style={styles.actionButtons}>
//               <button onClick={handleSelectAll} style={styles.selectAllBtn}>
//                 {selectAll ? "Deselect All" : "Select All"}
//               </button>
//               <button onClick={saveChanges} style={styles.saveBtn}>
//                 Save Changes
//               </button>
//               <button
//                 onClick={deleteSelectedStudents}
//                 style={styles.deleteBtn}
//               >
//                 Delete Selected
//               </button>
//             </div>

//             {/* Student Table */}
//             <div style={styles.tableContainer}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>
//                       <input
//                         type="checkbox"
//                         checked={selectAll}
//                         onChange={handleSelectAll}
//                       />
//                     </th>
//                     <th style={styles.th}>ID</th>
//                     <th style={styles.th}>Name</th>
//                     <th style={styles.th}>Student Number</th>
//                     <th style={styles.th}>Guardian Number</th>
//                     <th style={styles.th}>Class</th>
//                     <th style={styles.th}>Section</th>
//                     <th style={styles.th}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredStudents.length > 0 ? (
//                     filteredStudents.map((student) => (
//                       <tr key={student.id} style={styles.tr}>
//                         <td style={styles.td}>
//                           <input
//                             type="checkbox"
//                             checked={student.checked}
//                             onChange={() =>
//                               setStudents((prev) =>
//                                 prev.map((s) =>
//                                   s.id === student.id
//                                     ? { ...s, checked: !s.checked }
//                                     : s
//                                 )
//                               )
//                             }
//                           />
//                         </td>
//                         <td style={styles.td}>{student.id}</td>
//                         <td style={styles.td}>{student.studentName}</td>
//                         <td style={styles.td}>{student.studentNumber}</td>
//                         <td style={styles.td}>{student.guardianNumber}</td>
//                         <td style={styles.td}>{student.className}</td>
//                         <td style={styles.td}>{student.section}</td>
//                         <td style={styles.td}>
//                           <button
//                             onClick={() => openEditModal(student)}
//                             style={styles.editBtn}
//                           >
//                             ✏️
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="8" style={styles.noData}>
//                         No students found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Add New Student Form (Optional Duplicate, since it's moved to top) */}
//             {/* If needed, remove this section as the add form is now at the top */}
//           </>
//         )
//       )}

//       {/* Edit Student Modal */}
//       {editStudent && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.editModal}>
//             <h2>Edit Student</h2>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Name:</label>
//               <input
//                 type="text"
//                 value={editStudent.studentName}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     studentName: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Student Number:</label>
//               <input
//                 type="text"
//                 value={editStudent.studentNumber}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     studentNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Guardian Number:</label>
//               <input
//                 type="text"
//                 value={editStudent.guardianNumber}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     guardianNumber: e.target.value,
//                   }))
//                 }
//                 style={styles.input}
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Class:</label>
//               <select
//                 value={editStudent.className}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     className: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Class</option>
//                 {classNames.map((className) => (
//                   <option key={className} value={className}>
//                     {className}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Section:</label>
//               <select
//                 value={editStudent.section}
//                 onChange={(e) =>
//                   setEditStudent((prev) => ({
//                     ...prev,
//                     section: e.target.value,
//                   }))
//                 }
//                 style={styles.dropdown}
//               >
//                 <option value="">Select Section</option>
//                 {editSections.map((section) => (
//                   <option key={section} value={section}>
//                     {section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div style={styles.modalButtons}>
//               <button onClick={updateStudent} style={styles.updateBtn}>
//                 Update
//               </button>
//               <button
//                 onClick={() => setEditStudent(null)}
//                 style={styles.closeBtn}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

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

// const styles = {
//   container: {
//     width: "90%",
//     maxWidth: "1200px",
//     margin: "20px auto",
//     padding: "20px",
//     backgroundColor: "#f9f9f9",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     borderRadius: "10px",
//     position: "relative",
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
//     marginBottom: "30px",
//     textAlign: "center",
//     color: "#555",
//   },
//   topSection: {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "20px",
//     marginBottom: "30px",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   topContainer: {
//     flex: "1 1 45%",
//     backgroundColor: "#ffffff",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     cursor: "pointer",
//     transition: "opacity 0.3s ease",
//     minWidth: "280px",
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
//   },
//   label: {
//     marginBottom: "5px",
//     fontWeight: "500",
//     color: "#333",
//   },
//   dropdown: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   searchInput: {
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     width: "100%",
//     boxSizing: "border-box",
//     marginBottom: "20px",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   actionButtons: {
//     display: "flex",
//     justifyContent: "flex-start",
//     gap: "15px",
//     marginBottom: "15px",
//     flexWrap: "wrap",
//   },
//   selectAllBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#6c757d",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
//   saveBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#28a745",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
//   deleteBtn: {
//     padding: "10px 15px",
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
//   tableContainer: {
//     overflowX: "auto",
//     borderRadius: "10px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#fff",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     minWidth: "800px",
//   },
//   th: {
//     border: "1px solid #ddd",
//     padding: "12px",
//     backgroundColor: "#f2f2f2",
//     textAlign: "left",
//     color: "#333",
//   },
//   tr: {
//     borderBottom: "1px solid #ddd",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "12px",
//     color: "#555",
//   },
//   editBtn: {
//     backgroundColor: "#17a2b8",
//     border: "none",
//     borderRadius: "5px",
//     padding: "8px 12px",
//     cursor: "pointer",
//     color: "#fff",
//     fontSize: "14px",
//     transition: "background-color 0.3s ease",
//   },
//   noData: {
//     textAlign: "center",
//     padding: "20px",
//     color: "#777",
//   },
//   addStudentContainer: {
//     padding: "20px",
//     backgroundColor: "#e9ecef",
//     borderRadius: "8px",
//   },
//   addForm: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   addBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     alignSelf: "flex-end",
//     transition: "background-color 0.3s ease",
//   },
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   editModal: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     width: "90%",
//     maxWidth: "500px",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
//     position: "relative",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   modalButtons: {
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "10px",
//     marginTop: "20px",
//   },
//   updateBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#28a745",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
//   closeBtn: {
//     padding: "10px 20px",
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease",
//   },
//   loadingText: {
//     textAlign: "center",
//     color: "#555",
//     fontSize: "18px",
//   },
// };

// export default StudentForm;
import React, { useState, useEffect } from "react";
import supabase from "../../supabase";
import AlertModal from "./../AlertModal";

function StudentForm() {
  const [userSchool, setUserSchool] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    studentNumber: "",
    guardianNumber: "",
    className: "",
    section: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContainer, setActiveContainer] = useState(null); // 'filters' or 'add'

  useEffect(() => {
    fetchUserSchool();
  }, []);

  useEffect(() => {
    if (selectedClassName) {
      fetchSections(selectedClassName);
      setSelectedSection(""); // Reset section when class changes
    } else {
      setSections([]);
      setSelectedSection("");
      setStudents([]);
    }
  }, [selectedClassName]);

  useEffect(() => {
    if (selectedClassName && selectedSection) {
      fetchStudents(selectedClassName, selectedSection);
    } else {
      setStudents([]);
    }
  }, [selectedClassName, selectedSection]);

  const fetchUserSchool = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("school")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserSchool(profile.school);
        fetchClassNames(profile.school);
      }
    } catch (error) {
      console.error("Error fetching user school:", error.message);
      setAlertMessage("Error fetching user school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchStudents = async (className, section) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("student")
        .select("id, studentName, className, section, studentNumber, guardianNumber, school")
        .eq("className", className)
        .eq("section", section)
        .order("id", { ascending: true });

      if (error) throw error;

      const mappedStudents = data.map((item) => ({
        id: item.id,
        studentName: item.studentName,
        className: item.className,
        section: item.section,
        studentNumber: item.studentNumber || "",
        guardianNumber: item.guardianNumber || "",
        school: item.school || "",
        checked: false,
      }));
      setStudents(mappedStudents);
    } catch (error) {
      console.error("Error fetching students:", error.message);
      setAlertMessage("Error fetching students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setStudents((prev) =>
      prev.map((student) => ({ ...student, checked: newSelectAll }))
    );
  };

  const saveChanges = async () => {
    try {
      setIsLoading(true);
      const updates = students
        .filter((student) => student.checked)
        .map((student) => ({
          id: student.id,
          className: selectedClassName,
          section: selectedSection,
        }));

      if (updates.length === 0) {
        setAlertMessage("No students selected for update.");
        return;
      }

      const { data, error } = await supabase
        .from("student")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      setAlertMessage("Changes saved successfully!");
      // Refresh student list
      fetchStudents(selectedClassName, selectedSection);
    } catch (error) {
      console.error("Error saving changes:", error.message);
      setAlertMessage("Error saving changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSelectedStudents = async () => {
    const selectedIds = students
      .filter((student) => student.checked)
      .map((student) => student.id);
  
    if (selectedIds.length === 0) {
      setAlertMessage("No students selected for update.");
      return;
    }
  
    if (
      !window.confirm(
        `Are you sure you want to remove the school for ${selectedIds.length} selected student(s)? This action cannot be undone.`
      )
    ) {
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Update the school column to NULL for selected students
      const { data, error } = await supabase
        .from("student")
        .update({ school: null })
        .in("id", selectedIds);
  
      if (error) throw error;
  
      setAlertMessage("School field removed for selected students successfully!");
      // Refresh student list after the update
      fetchStudents(selectedClassName, selectedSection);
    } catch (error) {
      console.error("Error removing school from students:", error.message);
      setAlertMessage("Error removing school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  


  const openEditModal = (student) => {
    setEditStudent(student);
  };

  const updateStudent = async () => {
    try {
      setIsLoading(true);
      const { id, studentName, studentNumber, guardianNumber, className, section } =
        editStudent;

      const { error } = await supabase
        .from("student")
        .update({
          studentName,
          studentNumber,
          guardianNumber,
          className,
          section,
        })
        .eq("id", id);

      if (error) throw error;

      setAlertMessage("Student updated successfully!");
      setEditStudent(null);
      fetchStudents(selectedClassName, selectedSection); // Refresh student list
    } catch (error) {
      console.error("Error updating student:", error.message);
      setAlertMessage("Error updating student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    const { studentName, studentNumber, guardianNumber, className, section } =
      newStudent;

    if (
      !studentName ||
      !studentNumber ||
      !guardianNumber ||
      !className ||
      !section
    ) {
      setAlertMessage("Please fill in all fields to add a new student.");
      return;
    }

    try {
      setIsLoading(true);

      // Fetch the current maximum ID in the student table
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("student")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (maxIdError) throw maxIdError;

      const maxId = maxIdData.length > 0 ? maxIdData[0].id : 0;
      const newId = maxId + 1;

      // Insert the new student with the new ID
      const { data: insertData, error: insertError } = await supabase
        .from("student")
        .insert([
          {
            id: newId,
            studentName,
            studentNumber,
            guardianNumber,
            className,
            section,
            school: userSchool,
          },
        ]);

      if (insertError) throw insertError;

      // Fetch all students with ID >= newId to shift their IDs by +1
      const { data: shiftingData, error: shiftingError } = await supabase
        .from("student")
        .select("id")
        .gte("id", newId);

      if (shiftingError) throw shiftingError;

      // Shift the IDs
      const shiftingPromises = shiftingData.map((student) =>
        supabase
          .from("student")
          .update({ id: student.id + 1 })
          .eq("id", student.id)
      );

      const shiftingResults = await Promise.all(shiftingPromises);

      // Check for errors during shifting
      const shiftingErrors = shiftingResults.filter((result) => result.error);
      if (shiftingErrors.length > 0) {
        throw shiftingErrors[0].error;
      }

      setAlertMessage("New student added successfully!");
      setNewStudent({
        studentName: "",
        studentNumber: "",
        guardianNumber: "",
        className: "",
        section: "",
      });

      // Refresh student list if the new student matches the selected class and section
      if (className === selectedClassName && section === selectedSection) {
        fetchStudents(selectedClassName, selectedSection);
      }
    } catch (error) {
      console.error("Error adding student:", error.message);
      setAlertMessage("Error adding student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sections for the edit modal when editStudent.className changes
  useEffect(() => {
    const fetchSectionsForEdit = async () => {
      if (editStudent && editStudent.className) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from("student")
            .select("section")
            .eq("className", editStudent.className)
            .neq("section", null);

          if (error) throw error;

          const uniqueSections = [...new Set(data.map((item) => item.section))];
          setEditSections(uniqueSections);
        } catch (error) {
          console.error("Error fetching sections for edit:", error.message);
          setAlertMessage("Error fetching sections. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSectionsForEdit();
  }, [editStudent?.className]);

  // Separate sections state for the edit modal
  const [editSections, setEditSections] = useState([]);

  // Handle search
  const filteredStudents = students.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle container activation
  const handleContainerClick = (container) => {
    setActiveContainer(container);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Student Management</h1>
      <p style={styles.schoolName}>School: {userSchool}</p>

      {/* Top Section: Filters and Add New Student */}
      <div style={styles.topSection}>
        {/* Filters Container */}
        <div
          style={{
            ...styles.topContainer,
            opacity:
              activeContainer === "filters" || activeContainer === null
                ? 1
                : 0.6,
          }}
          onClick={() => handleContainerClick("filters")}
        >
          <h2 style={styles.subHeader}>Filters</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Class:</label>
            <select
              style={styles.dropdown}
              value={selectedClassName}
              onChange={(e) => {
                setSelectedClassName(e.target.value);
              }}
            >
              <option value="">Select Class</option>
              {classNames.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          {selectedClassName && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Section:</label>
              <select
                style={styles.dropdown}
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                }}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Add New Student Container */}
        <div
          style={{
            ...styles.topContainer,
            opacity:
              activeContainer === "add" || activeContainer === null
                ? 1
                : 0.6,
          }}
          onClick={() => handleContainerClick("add")}
        >
          <h2 style={styles.subHeader}>Add New Student</h2>
          <div style={styles.addForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={newStudent.studentName}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    studentName: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Student Number:</label>
              <input
                type="text"
                value={newStudent.studentNumber}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    studentNumber: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Guardian Number:</label>
              <input
                type="text"
                value={newStudent.guardianNumber}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    guardianNumber: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class:</label>
              <select
                value={newStudent.className}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                style={styles.dropdown}
              >
                <option value="">Select Class</option>
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
                value={newStudent.section}
                onChange={(e) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    section: e.target.value,
                  }))
                }
                style={styles.dropdown}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddStudent} style={styles.addBtn}>
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {students.length > 0 && (
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      )}

      {/* Student List */}
      {isLoading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : (
        selectedClassName &&
        selectedSection && (
          <>
            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button onClick={handleSelectAll} style={styles.selectAllBtn}>
                {selectAll ? "Deselect All" : "Select All"}
              </button>
              <button onClick={saveChanges} style={styles.saveBtn}>
                Save Changes
              </button>
              <button
                onClick={deleteSelectedStudents}
                style={styles.deleteBtn}
              >
                Delete Selected
              </button>
            </div>

            {/* Student Table */}
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Student Number</th>
                    <th style={styles.th}>Guardian Number</th>
                    <th style={styles.th}>Class</th>
                    <th style={styles.th}>Section</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} style={styles.tr}>
                        <td style={styles.td}>
                          <input
                            type="checkbox"
                            checked={student.checked}
                            onChange={() =>
                              setStudents((prev) =>
                                prev.map((s) =>
                                  s.id === student.id
                                    ? { ...s, checked: !s.checked }
                                    : s
                                )
                              )
                            }
                          />
                        </td>
                        <td style={styles.td}>{student.id}</td>
                        <td style={styles.td}>{student.studentName}</td>
                        <td style={styles.td}>{student.studentNumber}</td>
                        <td style={styles.td}>{student.guardianNumber}</td>
                        <td style={styles.td}>{student.className}</td>
                        <td style={styles.td}>{student.section}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => openEditModal(student)}
                            style={styles.editBtn}
                          >
                            ✏️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={styles.noData}>
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div style={styles.modalOverlay}>
          <div style={styles.editModal}>
            <h2>Edit Student</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={editStudent.studentName}
                onChange={(e) =>
                  setEditStudent((prev) => ({
                    ...prev,
                    studentName: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Student Number:</label>
              <input
                type="text"
                value={editStudent.studentNumber}
                onChange={(e) =>
                  setEditStudent((prev) => ({
                    ...prev,
                    studentNumber: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Guardian Number:</label>
              <input
                type="text"
                value={editStudent.guardianNumber}
                onChange={(e) =>
                  setEditStudent((prev) => ({
                    ...prev,
                    guardianNumber: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class:</label>
              <select
                value={editStudent.className}
                onChange={(e) =>
                  setEditStudent((prev) => ({
                    ...prev,
                    className: e.target.value,
                  }))
                }
                style={styles.dropdown}
              >
                <option value="">Select Class</option>
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
                value={editStudent.section}
                onChange={(e) =>
                  setEditStudent((prev) => ({
                    ...prev,
                    section: e.target.value,
                  }))
                }
                style={styles.dropdown}
              >
                <option value="">Select Section</option>
                {editSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.modalButtons}>
              <button onClick={updateStudent} style={styles.updateBtn}>
                Update
              </button>
              <button
                onClick={() => setEditStudent(null)}
                style={styles.closeBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

const styles = {
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    position: "relative",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    textAlign: "center",
    color: "#333",
  },
  schoolName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "30px",
    textAlign: "center",
    color: "#555",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  topContainer: {
    flex: "1 1 45%",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
    minWidth: "280px",
  },
  subHeader: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#444",
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
    color: "#333",
  },
  dropdown: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  searchInput: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "20px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "15px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  selectAllBtn: {
    padding: "10px 15px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  saveBtn: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  deleteBtn: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    color: "#333",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
    color: "#555",
  },
  editBtn: {
    backgroundColor: "#17a2b8",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "#fff",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
  addStudentContainer: {
    padding: "20px",
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
  },
  addForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-end",
    transition: "background-color 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  editModal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    position: "relative",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  updateBtn: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  closeBtn: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  loadingText: {
    textAlign: "center",
    color: "#555",
    fontSize: "18px",
  },
};

export default StudentForm;
