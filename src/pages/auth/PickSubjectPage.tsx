
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// function PickSubjectPage() {
//   const navigate = useNavigate();
//   const { session } = useSession();

//   // State Variables
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [subjectList, setSubjectList] = useState([]);
//   const [userSchool, setUserSchool] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Redirect to /auth/sign-in if no session
//   useEffect(() => {
//     if (!session) {
//       navigate("/auth/sign-in");
//       return;
//     }
//   }, [session, navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!session) return;

//       try {
//         // Fetch the user's school from profiles table
//         const { data: profileData, error: profileError } = await supabase
//           .from("profiles")
//           .select("school")
//           .eq("id", session.user.id)
//           .single();

//         if (profileError || !profileData) {
//           console.error("Error fetching profile:", profileError?.message);
//           setError("Failed to retrieve profile information.");
//           navigate("/auth/sign-in");
//           return;
//         }

//         const fetchedSchool = profileData.school;

//         if (!fetchedSchool) {
//           setError("School information is missing in your profile.");
//           return;
//         }

//         setUserSchool(fetchedSchool);

//         // Fetch subjects that match the user's school
//         const { data: subjectsData, error: subjectsError } = await supabase
//           .from("subjects")
//           .select("id, subjectName")
//           .eq("school", fetchedSchool);

//         if (subjectsError) {
//           console.error("Error fetching subjects:", subjectsError.message);
//           setError("Failed to fetch subjects.");
//           return;
//         }

//         setSubjects(subjectsData);
//       } catch (err) {
//         console.error("Unexpected error:", err);
//         setError("An unexpected error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, navigate]);

//   const handleAddSubject = () => {
//     if (!selectedSubject) {
//       alert("Please select a subject to add.");
//       return;
//     }

//     if (subjectList.includes(selectedSubject)) {
//       alert("Subject already added.");
//       return;
//     }

//     setSubjectList([...subjectList, selectedSubject]);
//     setSelectedSubject(""); // Reset dropdown
//   };

//   const handleRemoveSubject = (subject) => {
//     const updatedList = subjectList.filter((item) => item !== subject);
//     setSubjectList(updatedList);
//   };

//   const handleConfirm = async () => {
//     if (subjectList.length === 0) {
//       alert("Please add at least one subject before confirming.");
//       return;
//     }

//     try {
//       const updateData = {};

//       subjectList.forEach((subject, index) => {
//         updateData[`subject${index + 1}`] = subject;
//       });

//       const { data: existingProfile, error: profileError } = await supabase
//         .from("profiles")
//         .select("subject1, subject2, subject3, subject4, subject5, subject6, subject7, subject8, subject9, subject10")
//         .eq("id", session.user.id)
//         .single();

//       if (profileError) {
//         console.error("Error fetching existing profile:", profileError.message);
//         alert("Failed to fetch existing profile information.");
//         return;
//       }

//       for (let i = subjectList.length + 1; i <= 10; i++) {
//         if (existingProfile[`subject${i}`]) {
//           updateData[`subject${i}`] = null;
//         }
//       }

//       const { error: updateError } = await supabase
//         .from("profiles")
//         .update(updateData)
//         .eq("id", session.user.id);

//       if (updateError) {
//         console.error("Error updating profile with subjects:", updateError.message);
//         alert("Failed to update subjects. Please try again.");
//         return;
//       }

//       alert("Subjects successfully updated!");
//       navigate("/attendance");
//     } catch (err) {
//       console.error("Error confirming subjects:", err.message);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p>Loading subjects...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.errorContainer}>
//         <p style={styles.errorMessage}>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.card}>
//         <h2 style={styles.heading}>Pick Your Subjects</h2>
//         <div style={styles.selectionContainer}>
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             style={styles.dropdown}
//           >
//             <option value="">-- Select Subject --</option>
//             {subjects.map((subject) => (
//               <option key={subject.id} value={subject.subjectName}>
//                 {subject.subjectName}
//               </option>
//             ))}
//           </select>
//           <button onClick={handleAddSubject} style={styles.addButton}>
//             +
//           </button>
//         </div>
//         <div style={styles.subjectListContainer}>
//           {subjectList.map((subject, index) => (
//             <div key={index} style={styles.subjectItem}>
//               <span>{subject}</span>
//               <button onClick={() => handleRemoveSubject(subject)} style={styles.removeButton}>
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//         <button onClick={handleConfirm} style={styles.confirmButton}>
//           Confirm
//         </button>
//       </div>
//     </div>
//   );
// }

// // Inline styles for the component
// const styles = {
//   pageContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//     backgroundColor: "#f0f2f5",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     width: "100%",
//     maxWidth: "500px",
//   },
//   heading: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//     textAlign: "center",
//     color: "#333333",
//   },
//   selectionContainer: {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "20px",
//   },
//   dropdown: {
//     flex: "1",
//     padding: "10px",
//     fontSize: "16px",
//     border: "1px solid #cccccc",
//     borderRadius: "5px 0 0 5px",
//     outline: "none",
//   },
//   addButton: {
//     padding: "10px 15px",
//     fontSize: "20px",
//     color: "#ffffff",
//     backgroundColor: "#6c757d",
//     border: "none",
//     borderRadius: "0 5px 5px 0",
//     cursor: "pointer",
//   },
//   subjectListContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     marginBottom: "20px",
//   },
//   subjectItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#e9ecef",
//     padding: "10px 15px",
//     borderRadius: "20px",
//     fontSize: "16px",
//     color: "#333333",
//   },
//   removeButton: {
//     backgroundColor: "#dc3545",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "50%",
//     width: "25px",
//     height: "25px",
//     cursor: "pointer",
//     fontSize: "16px",
//     lineHeight: "25px",
//     textAlign: "center",
//   },
//   confirmButton: {
//     width: "100%",
//     padding: "12px",
//     backgroundColor: "#28a745",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "18px",
//     cursor: "pointer",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f0f2f5",
//     fontFamily: "Arial, sans-serif",
//   },
//   spinner: {
//     border: "8px solid #f3f3f3", // Light grey
//     borderTop: "8px solid #007bff", // Blue
//     borderRadius: "50%",
//     width: "60px",
//     height: "60px",
//     animation: "spin 1s linear infinite",
//     marginBottom: "20px",
//   },
//   errorContainer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "100vh",
//     backgroundColor: "#f0f2f5",
//     fontFamily: "Arial, sans-serif",
//   },
//   errorMessage: {
//     color: "#dc3545",
//     fontSize: "18px",
//     textAlign: "center",
//   },
// };

// export default PickSubjectPage;

// // Styles remain the same.

// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import supabase from "../supabase";
// // import { useSession } from "../context/SessionContext";

// // function PickSubjectPage() {
// //   const navigate = useNavigate();
// //   const { session } = useSession(); // Get current session

// //   // State Variables
// //   const [subjects, setSubjects] = useState([]); // Available subjects from Supabase
// //   const [selectedSubject, setSelectedSubject] = useState(""); // Currently selected subject in dropdown
// //   const [subjectList, setSubjectList] = useState([]); // List of subjects user has added
// //   const [userSchool, setUserSchool] = useState(""); // User's school from profiles
// //   const [loading, setLoading] = useState(true); // Loading state
// //   const [error, setError] = useState(""); // Error message

// //   // Redirect to /auth/sign-in if no session
// //   useEffect(() => {
// //     if (!session) {
// //       navigate("/auth/sign-in");
// //     }
// //   }, [session, navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       if (!session) return;

// //       try {
// //         // Fetch the user's school from profiles table
// //         const { data: profileData, error: profileError } = await supabase
// //           .from("profiles")
// //           .select("school")
// //           .eq("id", session.user.id)
// //           .single();

// //         if (profileError || !profileData) {
// //           console.error("Error fetching profile:", profileError?.message);
// //           setError("Failed to retrieve profile information.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         const fetchedSchool = profileData.school;

// //         if (!fetchedSchool) {
// //           setError("School information is missing in your profile.");
// //           return;
// //         }

// //         setUserSchool(fetchedSchool);

// //         // Fetch subjects that match the user's school
// //         const { data: subjectsData, error: subjectsError } = await supabase
// //           .from("subjects")
// //           .select("id, subjectName")
// //           .eq("school", fetchedSchool);

// //         if (subjectsError) {
// //           console.error("Error fetching subjects:", subjectsError.message);
// //           setError("Failed to fetch subjects.");
// //           return;
// //         }

// //         setSubjects(subjectsData);
// //       } catch (err) {
// //         console.error("Unexpected error:", err);
// //         setError("An unexpected error occurred.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [session, navigate]);

// //   const handleAddSubject = () => {
// //     if (!selectedSubject) {
// //       alert("Please select a subject to add.");
// //       return;
// //     }

// //     // Prevent adding duplicates
// //     if (subjectList.includes(selectedSubject)) {
// //       alert("Subject already added.");
// //       return;
// //     }

// //     setSubjectList([...subjectList, selectedSubject]);
// //     setSelectedSubject(""); // Reset dropdown
// //   };

// //   const handleRemoveSubject = (subject) => {
// //     const updatedList = subjectList.filter((item) => item !== subject);
// //     setSubjectList(updatedList);
// //   };

// //   const handleConfirm = async () => {
// //     if (subjectList.length === 0) {
// //       alert("Please add at least one subject before confirming.");
// //       return;
// //     }

// //     try {
// //       // Prepare the update data
// //       const updateData = {};

// //       // Map subjects to subject1, subject2, etc.
// //       subjectList.forEach((subject, index) => {
// //         updateData[`subject${index + 1}`] = subject;
// //       });

// //       // Optionally clear remaining subject columns if less than existing
// //       const { data: existingProfile, error: profileError } = await supabase
// //         .from("profiles")
// //         .select("subject1, subject2, subject3, subject4, subject5, subject6, subject7, subject8, subject9, subject10")
// //         .eq("id", session.user.id)
// //         .single();

// //       if (profileError) {
// //         console.error("Error fetching existing profile:", profileError.message);
// //         alert("Failed to fetch existing profile information.");
// //         return;
// //       }

// //       for (let i = subjectList.length + 1; i <= 10; i++) {
// //         if (existingProfile[`subject${i}`]) {
// //           updateData[`subject${i}`] = null;
// //         }
// //       }

// //       // Update the profiles table
// //       const { error: updateError } = await supabase
// //         .from("profiles")
// //         .update(updateData)
// //         .eq("id", session.user.id);

// //       if (updateError) {
// //         console.error("Error updating profile with subjects:", updateError.message);
// //         alert("Failed to update subjects. Please try again.");
// //         return;
// //       }

// //       alert("Subjects successfully updated!");
// //       navigate("/attendance"); // Redirect to Attendance Page
// //     } catch (err) {
// //       console.error("Error confirming subjects:", err.message);
// //       alert("An unexpected error occurred. Please try again.");
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div style={styles.loadingContainer}>
// //         <div style={styles.spinner}></div>
// //         <p>Loading subjects...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.errorContainer}>
// //         <p style={styles.errorMessage}>{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.pageContainer}>
// //       <div style={styles.card}>
// //         <h2 style={styles.heading}>Pick Your Subjects</h2>
// //         <div style={styles.selectionContainer}>
// //           <select
// //             value={selectedSubject}
// //             onChange={(e) => setSelectedSubject(e.target.value)}
// //             style={styles.dropdown}
// //             aria-label="Select Subject"
// //           >
// //             <option value="">-- Select Subject --</option>
// //             {subjects.map((subject) => (
// //               <option key={subject.id} value={subject.subjectName}>
// //                 {subject.subjectName}
// //               </option>
// //             ))}
// //           </select>
// //           <button onClick={handleAddSubject} style={styles.addButton}>
// //             +
// //           </button>
// //         </div>
// //         <div style={styles.subjectListContainer}>
// //           {subjectList.map((subject, index) => (
// //             <div key={index} style={styles.subjectItem}>
// //               <span>{subject}</span>
// //               <button
// //                 onClick={() => handleRemoveSubject(subject)}
// //                 style={styles.removeButton}
// //               >
// //                 ×
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //         <button onClick={handleConfirm} style={styles.confirmButton}>
// //           Confirm
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default PickSubjectPage;

// // // Inline styles remain unchanged
// // const styles = {
// //   /* Styles */
// // };

// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import supabase from "../supabase";
// // import { useSession } from "../context/SessionContext";

// // function PickSubjectPage() {
// //   const navigate = useNavigate();
// //   const { session } = useSession(); // Get current session

// //   // State Variables
// //   const [subjects, setSubjects] = useState([]); // Available subjects from Supabase
// //   const [selectedSubject, setSelectedSubject] = useState(""); // Currently selected subject in dropdown
// //   const [subjectList, setSubjectList] = useState([]); // List of subjects user has added
// //   const [userSchool, setUserSchool] = useState(""); // User's school from profiles
// //   const [loading, setLoading] = useState(true); // Loading state
// //   const [error, setError] = useState(""); // Error message

// //   // Redirect to /auth/sign-in if no session
// //   useEffect(() => {
// //     if (!session) {
// //       navigate("/auth/sign-in");
// //     }
// //   }, [session, navigate]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         // Fetch the user's school from profiles table
// //         const { data: profileData, error: profileError } = await supabase
// //           .from("profiles")
// //           .select("school")
// //           .eq("id", session.user.id)
// //           .single();

// //         if (profileError || !profileData) {
// //           console.error("Error fetching profile:", profileError?.message);
// //           setError("Failed to retrieve profile information.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         const fetchedSchool = profileData.school;

// //         if (!fetchedSchool) {
// //           setError("School information is missing in your profile.");
// //           return;
// //         }

// //         setUserSchool(fetchedSchool);

// //         // Fetch subjects that match the user's school
// //         const { data: subjectsData, error: subjectsError } = await supabase
// //           .from("subjects")
// //           .select("id, subjectName")
// //           .eq("school", fetchedSchool);

// //         if (subjectsError) {
// //           console.error("Error fetching subjects:", subjectsError.message);
// //           setError("Failed to fetch subjects.");
// //           return;
// //         }

// //         setSubjects(subjectsData);
// //       } catch (err) {
// //         console.error("Unexpected error:", err);
// //         setError("An unexpected error occurred.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [session, navigate]);

// //   const handleAddSubject = () => {
// //     if (!selectedSubject) {
// //       alert("Please select a subject to add.");
// //       return;
// //     }

// //     // Prevent adding duplicates
// //     if (subjectList.includes(selectedSubject)) {
// //       alert("Subject already added.");
// //       return;
// //     }

// //     setSubjectList([...subjectList, selectedSubject]);
// //     setSelectedSubject(""); // Reset dropdown
// //   };

// //   const handleRemoveSubject = (subject) => {
// //     const updatedList = subjectList.filter((item) => item !== subject);
// //     setSubjectList(updatedList);
// //   };

// //   const handleConfirm = async () => {
// //     if (subjectList.length === 0) {
// //       alert("Please add at least one subject before confirming.");
// //       return;
// //     }

// //     try {
// //       // Prepare the update data
// //       const updateData = {};

// //       // Map subjects to subject1, subject2, etc.
// //       subjectList.forEach((subject, index) => {
// //         updateData[`subject${index + 1}`] = subject;
// //       });

// //       // Optionally clear remaining subject columns if less than existing
// //       const { data: existingProfile, error: profileError } = await supabase
// //         .from("profiles")
// //         .select("subject1, subject2, subject3, subject4, subject5, subject6, subject7, subject8, subject9, subject10") // Adjust as per your schema
// //         .eq("id", session.user.id)
// //         .single();

// //       if (profileError) {
// //         console.error("Error fetching existing profile:", profileError.message);
// //         alert("Failed to fetch existing profile information.");
// //         return;
// //       }

// //       for (let i = subjectList.length + 1; i <= 10; i++) {
// //         if (existingProfile[`subject${i}`]) {
// //           updateData[`subject${i}`] = null;
// //         }
// //       }

// //       // Update the profiles table
// //       const { error: updateError } = await supabase
// //         .from("profiles")
// //         .update(updateData)
// //         .eq("id", session.user.id);

// //       if (updateError) {
// //         console.error("Error updating profile with subjects:", updateError.message);
// //         alert("Failed to update subjects. Please try again.");
// //         return;
// //       }

// //       alert("Subjects successfully updated!");
// //       navigate("/attendance"); // Redirect to StudentPage
// //     } catch (err) {
// //       console.error("Error confirming subjects:", err.message);
// //       alert("An unexpected error occurred. Please try again.");
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div style={styles.loadingContainer}>
// //         <div style={styles.spinner}></div>
// //         <p>Loading subjects...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.errorContainer}>
// //         <p style={styles.errorMessage}>{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.pageContainer}>
// //       <div style={styles.card}>
// //         <h2 style={styles.heading}>Pick Your Subjects</h2>
// //         <div style={styles.selectionContainer}>
// //           <select
// //             value={selectedSubject}
// //             onChange={(e) => setSelectedSubject(e.target.value)}
// //             style={styles.dropdown}
// //             aria-label="Select Subject"
// //           >
// //             <option value="">-- Select Subject --</option>
// //             {subjects.map((subject) => (
// //               <option key={subject.id} value={subject.subjectName}>
// //                 {subject.subjectName}
// //               </option>
// //             ))}
// //           </select>
// //           <button onClick={handleAddSubject} style={styles.addButton}>
// //             +
// //           </button>
// //         </div>
// //         <div style={styles.subjectListContainer}>
// //           {subjectList.map((subject, index) => (
// //             <div key={index} style={styles.subjectItem}>
// //               <span>{subject}</span>
// //               <button
// //                 onClick={() => handleRemoveSubject(subject)}
// //                 style={styles.removeButton}
// //               >
// //                 ×
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //         <button onClick={handleConfirm} style={styles.confirmButton}>
// //           Confirm
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default PickSubjectPage;

// // // Inline styles and spinner animation remain unchanged.
