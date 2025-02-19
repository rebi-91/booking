
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// function PickSchoolPage() {
//   // State variables for user inputs and selections
//   const [schools, setSchools] = useState<string[]>([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [studentID, setStudentID] = useState("");
//   const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
//   const [schoolID, setSchoolID] = useState("");
//   const [teacherID, setTeacherID] = useState(""); // Changed from teacherPassword
//   const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
//   const [role, setRole] = useState("Student/Guardian");

//   // States for subjects (Teacher Only)
//   const [subjects, setSubjects] = useState<any[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [subjectList, setSubjectList] = useState<string[]>([]);

//   // State to store matched student data
//   const [studentData, setStudentData] = useState<any>(null);

//   const navigate = useNavigate();
//   const { session } = useSession();

//   // Step management for the wizard-like interface
//   const [currentStep, setCurrentStep] = useState(1);

//   useEffect(() => {
//     // Redirect to login if not authenticated
//     if (!session) {
//       navigate("/auth/sign-in");
//       return;
//     }

//     const fetchSchools = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("school")
//           .select("schoolName");

//         if (error) {
//           console.error("Error fetching schools:", error.message);
//           alert("Failed to fetch schools. Please try again.");
//           return;
//         }

//         setSchools((data as any[]).map((school) => school.schoolName));
//       } catch (err) {
//         console.error("Unexpected error fetching schools:", err);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     };

//     fetchSchools();
//   }, [session, navigate]);

//   useEffect(() => {
//     if (role === "Teacher" && selectedSchool) {
//       fetchSubjects(selectedSchool);
//     }
//   }, [role, selectedSchool]);

//   const fetchSubjects = async (school: string) => {
//     try {
//       const { data, error } = await supabase
//         .from("subjects")
//         .select("id, subjectName")
//         .eq("school", school);

//       if (error) {
//         console.error("Error fetching subjects:", error.message);
//         alert("Failed to fetch subjects. Please try again.");
//         return;
//       }

//       setSubjects(data as any[]);
//     } catch (err) {
//       console.error("Unexpected error fetching subjects:", err);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   // Handlers for adding and removing subjects (Teacher Only)
//   const handleAddSubject = () => {
//     if (!selectedSubject) {
//       return;
//     }

//     if (subjectList.includes(selectedSubject)) {
//       return;
//     }

//     setSubjectList([...subjectList, selectedSubject]);
//     setSelectedSubject("");
//   };

//   const handleRemoveSubject = (subject: string) => {
//     const updatedList = subjectList.filter((item) => item !== subject);
//     setSubjectList(updatedList);
//   };

//   // Handler to proceed to the next step
//   const handleNext = async () => {
//     console.log(`Current Step: ${currentStep}, Role: ${role}`);

//     // Teacher Verification after entering Teacher ID in Step 4
//     if (role === "Teacher" && currentStep === 4) {
//       try {
//         console.log("Verifying Teacher credentials...");

//         const { data: teacher, error: teacherError } = await supabase
//           .from("teacher") // Ensure this matches your table name
//           .select("*")
//           .eq("schoolName", selectedSchool) // Adjust if the column name differs
//           .eq("teacherID", teacherID)
//           .single();

//         if (teacherError || !teacher) {
//           console.error("Teacher verification failed:", teacherError?.message);
//           alert("Invalid Teacher ID or School.");
//           return;
//         }

//         console.log("Teacher verified successfully.");
//         setCurrentStep(currentStep + 1);
//       } catch (err) {
//         console.error("Error verifying Teacher details:", err);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     }
//     // Student/Guardian Verification after entering Guardian Phone Number in Step 4
//     else if (role === "Student/Guardian" && currentStep === 4) {
//       try {
//         console.log("Verifying Student/Guardian credentials...");

//         const { data: student, error: studentError } = await supabase
//           .from("student")
//           .select("*")
//           .eq("school", selectedSchool)
//           .eq("studentID", studentID)
//           .eq("guardianNumber", guardianPhoneNumber)
//           .single();

//         if (studentError || !student) {
//           console.error("Student/Guardian verification failed:", studentError?.message);
//           alert("Invalid Student ID or Guardian Phone Number.");
//           return;
//         }

//         console.log("Student/Guardian verified successfully:", student);
//         setStudentData(student);
//         setCurrentStep(currentStep + 1);
//       } catch (err) {
//         console.error("Error verifying Student/Guardian details:", err);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     } else {
//       // For other steps
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   // Handler to confirm and submit the form
//   const handleConfirm = async () => {
//     console.log("Confirm button clicked.");

//     if (role === "Student/Guardian") {
//       if (!studentID || !guardianPhoneNumber || !selectedSchool) {
//         console.error("Missing Student/Guardian inputs.");
//         alert("Please fill in all required fields.");
//         return;
//       }

//       try {
//         console.log("Updating profiles table for Student/Guardian...");

//         const { error: profileError } = await supabase
//           .from("profiles")
//           .update({
//             role: "USER",
//             school: selectedSchool,
//             telNumber: guardianPhoneNumber,
//             password: studentID, // Assuming password is being used to store Student ID
//           })
//           .eq("id", session.user.id);

//         if (profileError) {
//           console.error("Error updating profiles:", profileError.message);
//           alert("Failed to update profile. Please try again.");
//           return;
//         }

//         console.log("Profiles table updated successfully for Student/Guardian.");
//         alert("Profile updated successfully!");
//         navigate("/student");
//       } catch (err) {
//         console.error("Error updating Student/Guardian profile:", err);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     } else if (role === "Teacher") {
//       if (!selectedSchool || !teacherPhoneNumber || subjectList.length === 0) {
//         console.error("Missing Teacher inputs.");
//         alert("Please fill in all required fields.");
//         return;
//       }

//       try {
//         console.log("Updating profiles table for Teacher...");

//         const updateData: Record<string, string> = {
//           role: "Teacher",
//           school: selectedSchool,
//           telNumber: teacherPhoneNumber,
//           password: teacherID, // Writing Teacher ID into the password column
//         };

//         subjectList.forEach((subject, index) => {
//           if (index < 10) {
//             updateData[`subject${index + 1}`] = subject;
//           }
//         });

//         const { error: profileError } = await supabase
//           .from("profiles")
//           .update(updateData)
//           .eq("id", session.user.id);

//         if (profileError) {
//           console.error("Error updating profiles:", profileError.message);
//           alert("Failed to update profile. Please try again.");
//           return;
//         }

//         console.log("Profiles table updated successfully for Teacher.");
//         alert("Profile and subjects updated successfully!");
//         navigate("/attendance");
//       } catch (err) {
//         console.error("Error updating Teacher profile:", err);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <div style={styles.outerContainer}>
//       <div style={styles.container}>
//         <h2 style={styles.stepTitle}>Setup Your Profile</h2>

//         {/* Step 1: Select Role */}
//         {currentStep === 1 && (
//           <div style={styles.stepContainer}>
//             <label style={styles.label}>Select Role:</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               style={styles.select}
//             >
//               <option value="Student/Guardian">Student/Guardian</option>
//               <option value="Teacher">Teacher</option>
//             </select>
//             {role && (
//               <button onClick={handleNext} style={styles.nextButton}>
//                 Next &rarr;
//               </button>
//             )}
//           </div>
//         )}

//         {/* Step 2: Select School */}
//         {currentStep === 2 && (
//           <div style={styles.stepContainer}>
//             <label style={styles.label}>Select School:</label>
//             <select
//               value={selectedSchool}
//               onChange={(e) => setSelectedSchool(e.target.value)}
//               style={styles.select}
//             >
//               <option value="">Select School</option>
//               {schools.map((school) => (
//                 <option key={school} value={school}>
//                   {school}
//                 </option>
//               ))}
//             </select>
//             {selectedSchool && (
//               <button onClick={handleNext} style={styles.nextButton}>
//                 Next &rarr;
//               </button>
//             )}
//           </div>
//         )}

//         {/* Step 3: Enter Student ID or Teacher ID */}
//         {currentStep === 3 && (
//           <div style={styles.stepContainer}>
//             {role === "Student/Guardian" ? (
//               <>
//                 <label style={styles.label}>Enter Student ID:</label>
//                 <input
//                   type="text"
//                   value={studentID}
//                   onChange={(e) => setStudentID(e.target.value)}
//                   placeholder="Student ID"
//                   style={styles.input}
//                 />
//                 {studentID && (
//                   <button onClick={handleNext} style={styles.nextButton}>
//                     Next &rarr;
//                   </button>
//                 )}
//               </>
//             ) : (
//               <>
//                 <label style={styles.label}>Enter School ID:</label>
//                 <input
//                   type="text"
//                   value={schoolID}
//                   onChange={(e) => setSchoolID(e.target.value)}
//                   placeholder="School ID"
//                   style={styles.input}
//                 />
//                 {schoolID && (
//                   <button onClick={handleNext} style={styles.nextButton}>
//                     Next &rarr;
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 4: Enter Guardian Phone Number or Teacher ID */}
//         {currentStep === 4 && (
//           <div style={styles.stepContainer}>
//             {role === "Student/Guardian" ? (
//               <>
//                 <label style={styles.label}>Enter Guardian Phone Number:</label>
//                 <input
//                   type="text"
//                   value={guardianPhoneNumber}
//                   onChange={(e) => setGuardianPhoneNumber(e.target.value)}
//                   placeholder="Guardian Phone Number"
//                   style={styles.input}
//                 />
//                 {guardianPhoneNumber && (
//                   <button onClick={handleNext} style={styles.nextButton}>
//                     Next &rarr;
//                   </button>
//                 )}
//               </>
//             ) : (
//               <>
//                 <label style={styles.label}>Enter Teacher ID:</label>
//                 <input
//                   type="text"
//                   value={teacherID}
//                   onChange={(e) => setTeacherID(e.target.value)}
//                   placeholder="Teacher ID"
//                   style={styles.input}
//                 />
//                 {teacherID && (
//                   <button onClick={handleNext} style={styles.nextButton}>
//                     Next &rarr;
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 5 (Teacher): Enter Phone Number */}
//         {currentStep === 5 && role === "Teacher" && (
//           <div style={styles.stepContainer}>
//             <label style={styles.label}>Enter Phone Number:</label>
//             <input
//               type="text"
//               value={teacherPhoneNumber}
//               onChange={(e) => setTeacherPhoneNumber(e.target.value)}
//               placeholder="Phone Number"
//               style={styles.input}
//             />
//             {teacherPhoneNumber && (
//               <button onClick={handleNext} style={styles.nextButton}>
//                 Next &rarr;
//               </button>
//             )}
//           </div>
//         )}

//         {/* Step 5 (Student/Guardian): Confirmation */}
//         {currentStep === 5 && role === "Student/Guardian" && (
//           <div style={styles.stepContainer}>
//             <h3 style={styles.confirmHeader}>Confirm Your Details</h3>
//             <div style={styles.confirmDetails}>
//               <p>
//                 <strong>Role:</strong> {role}
//               </p>
//               <p>
//                 <strong>School:</strong> {selectedSchool}
//               </p>
//               {studentData && (
//                 <>
//                   <p>
//                     <strong>Student Name:</strong> {studentData.studentName}
//                   </p>
//                   <p>
//                     <strong>Class:</strong> {studentData.className}
//                   </p>
//                   <p>
//                     <strong>Section:</strong> {studentData.section}
//                   </p>
//                 </>
//               )}
//               <p>
//                 <strong>Student ID:</strong> {studentID}
//               </p>
//               <p>
//                 <strong>Guardian Phone Number:</strong> {guardianPhoneNumber}
//               </p>
//             </div>
//             <button onClick={handleConfirm} style={styles.confirmButton}>
//               Confirm
//             </button>
//           </div>
//         )}

//         {/* Step 6 (Teacher): Select Subjects */}
//         {currentStep === 6 && role === "Teacher" && (
//           <div style={styles.stepContainer}>
//             <h3 style={styles.subjectHeader}>Select Subjects</h3>
//             <div style={styles.subjectContainer}>
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 style={styles.select}
//               >
//                 <option value="">-- Select Subject --</option>
//                 {subjects.map((subject) => (
//                   <option key={subject.id} value={subject.subjectName}>
//                     {subject.subjectName}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleAddSubject}
//                 style={styles.addButton}
//                 disabled={!selectedSubject}
//               >
//                 +
//               </button>
//             </div>
//             <ul style={styles.subjectList}>
//               {subjectList.map((subject, index) => (
//                 <li key={index} style={styles.subjectItem}>
//                   {subject}
//                   <button
//                     onClick={() => handleRemoveSubject(subject)}
//                     style={styles.removeButton}
//                   >
//                     &times;
//                   </button>
//                 </li>
//               ))}
//             </ul>
//             {subjectList.length > 0 && (
//               <button onClick={handleNext} style={styles.nextButton}>
//                 Next &rarr;
//               </button>
//             )}
//           </div>
//         )}

//         {/* Step 7 (Teacher): Confirmation */}
//         {currentStep === 7 && role === "Teacher" && (
//           <div style={styles.stepContainer}>
//             <h3 style={styles.confirmHeader}>Confirm Your Details</h3>
//             <div style={styles.confirmDetails}>
//               <p>
//                 <strong>Role:</strong> {role}
//               </p>
//               <p>
//                 <strong>School:</strong> {selectedSchool}
//               </p>
//               <p>
//                 <strong>Teacher ID:</strong> {teacherID}
//               </p>
//               <p>
//                 <strong>Phone Number:</strong> {teacherPhoneNumber}
//               </p>
//               <p>
//                 <strong>Subjects:</strong> {subjectList.join(", ")}
//               </p>
//             </div>
//             <button onClick={handleConfirm} style={styles.confirmButton}>
//               Confirm
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PickSchoolPage;

// // Inline styles for the component with descriptive labels
// const styles: { [key: string]: React.CSSProperties } = {
//   outerContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "20px",
//     backgroundColor: "#f0f0f0", // Changed to a lighter color for better contrast
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   container: {
//     backgroundColor: "#ffffff", // Changed to white for better readability
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Lighter shadow
//     width: "100%",
//     maxWidth: "500px",
//     color: "#333333", // Darker text color
//     textAlign: "center" as const,
//   },
//   stepTitle: {
//     fontSize: "28px",
//     marginBottom: "20px",
//     color: "#333333",
//   },
//   stepContainer: {
//     marginBottom: "30px",
//   },
//   label: {
//     display: "block",
//     marginBottom: "10px",
//     fontSize: "18px",
//     fontWeight: "bold",
//     color: "#333333",
//   },
//   select: {
//     width: "80%",
//     padding: "12px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #cccccc",
//     marginBottom: "20px",
//     backgroundColor: "#ffffff",
//     color: "#333333",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   input: {
//     width: "80%",
//     padding: "12px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #cccccc",
//     marginBottom: "20px",
//     backgroundColor: "#ffffff",
//     color: "#333333",
//     outline: "none",
//     transition: "border-color 0.3s ease",
//   },
//   nextButton: {
//     padding: "12px 25px",
//     fontSize: "16px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "10px",
//     display: "block",
//     marginLeft: "auto",
//     marginRight: "auto",
//     width: "80%",
//     transition: "background-color 0.3s ease",
//   },
//   confirmButton: {
//     padding: "12px 30px",
//     fontSize: "18px",
//     backgroundColor: "#28a745",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "20px",
//     transition: "background-color 0.3s ease",
//   },
//   subjectContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: "20px",
//   },
//   addButton: {
//     padding: "0",
//     height: "40px",
//     width: "40px",
//     fontSize: "24px",
//     backgroundColor: "#17a2b8",
//     color: "white",
//     border: "none",
//     borderRadius: "50%",
//     cursor: "pointer",
//     marginLeft: "10px",
//     transition: "background-color 0.3s ease",
//   },
//   subjectList: {
//     listStyleType: "none" as const,
//     padding: 0,
//     marginBottom: "20px",
//     maxHeight: "200px",
//     overflowY: "auto" as const,
//   },
//   subjectItem: {
//     display: "flex",
//     width: "80%",
//     marginLeft: "auto",
//     marginRight: "auto",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     padding: "10px 15px",
//     borderRadius: "5px",
//     marginBottom: "10px",
//   },
//   removeButton: {
//     backgroundColor: "#dc3545",
//     color: "white",
//     border: "none",
//     borderRadius: "50%",
//     width: "25px",
//     height: "25px",
//     cursor: "pointer",
//     fontSize: "16px",
//     lineHeight: "25px",
//     textAlign: "center" as const,
//     transition: "background-color 0.3s ease",
//   },
//   confirmHeader: {
//     fontSize: "22px",
//     marginBottom: "20px",
//     color: "#333333",
//   },
//   confirmDetails: {
//     textAlign: "left" as const,
//     marginBottom: "20px",
//     color: "#555555",
//   },
//   subjectHeader: {
//     fontSize: "22px",
//     marginBottom: "20px",
//     color: "#333333",
//   },
// };
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

function PickSchoolPage() {
  // State variables for user inputs and selections
  const [schools, setSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [studentID, setStudentID] = useState("");
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
  const [schoolID, setSchoolID] = useState("");
  const [teacherID, setTeacherID] = useState(""); // Changed from teacherPassword
  const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
  const [role, setRole] = useState("Student/Guardian");

  // New state: to track if the School ID is valid.
  const [isSchoolIDValid, setIsSchoolIDValid] = useState(true);

  // States for subjects (Teacher Only)
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectList, setSubjectList] = useState<string[]>([]);

  // State to store matched student data
  const [studentData, setStudentData] = useState<any>(null);

  const navigate = useNavigate();
  const { session } = useSession();

  // Step management for the wizard-like interface
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session) {
      navigate("/auth/sign-in");
      return;
    }

    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from("school")
          .select("schoolName");

        if (error) {
          console.error("Error fetching schools:", error.message);
          alert("Failed to fetch schools. Please try again.");
          return;
        }

        setSchools((data as any[]).map((school) => school.schoolName));
      } catch (err) {
        console.error("Unexpected error fetching schools:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    };

    fetchSchools();
  }, [session, navigate]);

  useEffect(() => {
    if (role === "Teacher" && selectedSchool) {
      fetchSubjects(selectedSchool);
    }
  }, [role, selectedSchool]);

  const fetchSubjects = async (school: string) => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("id, subjectName")
        .eq("school", school);

      if (error) {
        console.error("Error fetching subjects:", error.message);
        alert("Failed to fetch subjects. Please try again.");
        return;
      }

      setSubjects(data as any[]);
    } catch (err) {
      console.error("Unexpected error fetching subjects:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Handlers for adding and removing subjects (Teacher Only)
  const handleAddSubject = () => {
    if (!selectedSubject) return;
    if (subjectList.includes(selectedSubject)) return;
    setSubjectList([...subjectList, selectedSubject]);
    setSelectedSubject("");
  };

  const handleRemoveSubject = (subject: string) => {
    const updatedList = subjectList.filter((item) => item !== subject);
    setSubjectList(updatedList);
  };

  // Handler to proceed to the next step
  const handleNext = async () => {
    console.log(`Current Step: ${currentStep}, Role: ${role}`);

    // Step 3 for Teachers: Verify School ID matches the selected school's record.
    if (role === "Teacher" && currentStep === 3) {
      try {
        console.log("Verifying School ID for the selected school...");

        // Query the school table to retrieve the official schoolID for the selected school (using schoolName)
        const { data: schoolRecord, error: schoolError } = await supabase
          .from("school")
          .select("schoolID")
          .eq("schoolName", selectedSchool)
          .single();

        if (schoolError || !schoolRecord) {
          console.error("Error retrieving school record:", schoolError?.message);
          // Do not alert here; just mark as invalid.
          setIsSchoolIDValid(false);
        } else {
          // Compare the retrieved schoolID with the one entered by the teacher.
          if (schoolRecord.schoolID !== schoolID) {
            setIsSchoolIDValid(false);
          } else {
            setIsSchoolIDValid(true);
          }
        }
        // Proceed to Step 4 regardless; alert will be shown later if necessary.
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error("Error verifying School ID:", err);
        // Proceed to Step 4 without alerting.
        setIsSchoolIDValid(false);
        setCurrentStep(currentStep + 1);
      }
    }
    // Step 4 for Teachers: Verify Teacher ID against teacher table, and also check the school ID flag.
    else if (role === "Teacher" && currentStep === 4) {
      // Only show alert here if the School ID was invalid or teacher verification fails.
      if (!isSchoolIDValid) {
        alert("Invalid School ID or Teacher ID entered.");
        return;
      }
      try {
        console.log("Verifying Teacher credentials...");

        const { data: teacher, error: teacherError } = await supabase
          .from("teacher") // Ensure this matches your table name
          .select("*")
          .eq("school", selectedSchool) // Here, 'school' represents schoolName in teacher table
          .eq("teacherID", teacherID)
          .single();

        if (teacherError || !teacher) {
          console.error("Teacher verification failed:", teacherError?.message);
          alert("Invalid School ID or Teacher ID entered.");
          return;
        }

        console.log("Teacher verified successfully.");
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error("Error verifying Teacher details:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    }
    // Student/Guardian Verification after entering Guardian Phone Number in Step 4
    else if (role === "Student/Guardian" && currentStep === 4) {
      try {
        console.log("Verifying Student/Guardian credentials...");

        const { data: student, error: studentError } = await supabase
          .from("student")
          .select("*")
          .eq("school", selectedSchool)
          .eq("studentID", studentID)
          .eq("guardianNumber", guardianPhoneNumber)
          .single();

        if (studentError || !student) {
          console.error("Student/Guardian verification failed:", studentError?.message);
          alert("Invalid Student ID or Guardian Phone Number.");
          return;
        }

        console.log("Student/Guardian verified successfully:", student);
        setStudentData(student);
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error("Error verifying Student/Guardian details:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    } else {
      // For other steps
      setCurrentStep(currentStep + 1);
    }
  };

  // Handler to confirm and submit the form
  const handleConfirm = async () => {
    console.log("Confirm button clicked.");

    if (role === "Student/Guardian") {
      if (!studentID || !guardianPhoneNumber || !selectedSchool) {
        console.error("Missing Student/Guardian inputs.");
        alert("Please fill in all required fields.");
        return;
      }

      try {
        console.log("Updating profiles table for Student/Guardian...");

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: "USER",
            school: selectedSchool,
            telNumber: guardianPhoneNumber,
            password: studentID, // Assuming password stores Student ID
          })
          .eq("id", session.user.id);

        if (profileError) {
          console.error("Error updating profiles:", profileError.message);
          alert("Failed to update profile. Please try again.");
          return;
        }

        console.log("Profiles table updated successfully for Student/Guardian.");
        alert("Profile updated successfully!");
        navigate("/student");
      } catch (err) {
        console.error("Error updating Student/Guardian profile:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    } else if (role === "Teacher") {
      if (!selectedSchool || !teacherPhoneNumber || subjectList.length === 0) {
        console.error("Missing Teacher inputs.");
        alert("Please fill in all required fields.");
        return;
      }

      try {
        console.log("Updating profiles table for Teacher...");

        const updateData: Record<string, string> = {
          role: "Teacher",
          school: selectedSchool,
          telNumber: teacherPhoneNumber,
          password: teacherID, // Storing Teacher ID into password column
        };

        subjectList.forEach((subject, index) => {
          if (index < 10) {
            updateData[`subject${index + 1}`] = subject;
          }
        });

        const { error: profileError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", session.user.id);

        if (profileError) {
          console.error("Error updating profiles:", profileError.message);
          alert("Failed to update profile. Please try again.");
          return;
        }

        console.log("Profiles table updated successfully for Teacher.");
        alert("Profile and subjects updated successfully!");
        navigate("/attendance");
      } catch (err) {
        console.error("Error updating Teacher profile:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.stepTitle}>Setup Your Profile</h2>

        {/* Step 1: Select Role */}
        {currentStep === 1 && (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Select Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="Student/Guardian">Student/Guardian</option>
              <option value="Teacher">Teacher</option>
            </select>
            {role && (
              <button onClick={handleNext} style={styles.nextButton}>
                Next &rarr;
              </button>
            )}
          </div>
        )}

        {/* Step 2: Select School */}
        {currentStep === 2 && (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Select School:</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              style={styles.select}
            >
              <option value="">Select School</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            {selectedSchool && (
              <button onClick={handleNext} style={styles.nextButton}>
                Next &rarr;
              </button>
            )}
          </div>
        )}

        {/* Step 3: Enter Student ID or Teacher's School ID */}
        {currentStep === 3 && (
          <div style={styles.stepContainer}>
            {role === "Student/Guardian" ? (
              <>
                <label style={styles.label}>Enter Student ID:</label>
                <input
                  type="text"
                  value={studentID}
                  onChange={(e) => setStudentID(e.target.value)}
                  placeholder="Student ID"
                  style={styles.input}
                />
                {studentID && (
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next &rarr;
                  </button>
                )}
              </>
            ) : (
              <>
                <label style={styles.label}>Enter School ID:</label>
                <input
                  type="text"
                  value={schoolID}
                  onChange={(e) => setSchoolID(e.target.value)}
                  placeholder="School ID"
                  style={styles.input}
                />
                {schoolID && (
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next &rarr;
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: Enter Guardian Phone Number or Teacher ID */}
        {currentStep === 4 && (
          <div style={styles.stepContainer}>
            {role === "Student/Guardian" ? (
              <>
                <label style={styles.label}>Enter Guardian Phone Number:</label>
                <input
                  type="text"
                  value={guardianPhoneNumber}
                  onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                  placeholder="Guardian Phone Number"
                  style={styles.input}
                />
                {guardianPhoneNumber && (
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next &rarr;
                  </button>
                )}
              </>
            ) : (
              <>
                <label style={styles.label}>Enter Teacher ID:</label>
                <input
                  type="text"
                  value={teacherID}
                  onChange={(e) => setTeacherID(e.target.value)}
                  placeholder="Teacher ID"
                  style={styles.input}
                />
                {teacherID && (
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next &rarr;
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 5 (Teacher): Enter Phone Number */}
        {currentStep === 5 && role === "Teacher" && (
          <div style={styles.stepContainer}>
            <label style={styles.label}>Enter Phone Number:</label>
            <input
              type="text"
              value={teacherPhoneNumber}
              onChange={(e) => setTeacherPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              style={styles.input}
            />
            {teacherPhoneNumber && (
              <button onClick={handleNext} style={styles.nextButton}>
                Next &rarr;
              </button>
            )}
          </div>
        )}

        {/* Step 5 (Student/Guardian): Confirmation */}
        {currentStep === 5 && role === "Student/Guardian" && (
          <div style={styles.stepContainer}>
            <h3 style={styles.confirmHeader}>Confirm Your Details</h3>
            <div style={styles.confirmDetails}>
              <p>
                <strong>Role:</strong> {role}
              </p>
              <p>
                <strong>School:</strong> {selectedSchool}
              </p>
              {studentData && (
                <>
                  <p>
                    <strong>Student Name:</strong> {studentData.studentName}
                  </p>
                  <p>
                    <strong>Class:</strong> {studentData.className}
                  </p>
                  <p>
                    <strong>Section:</strong> {studentData.section}
                  </p>
                </>
              )}
              <p>
                <strong>Student ID:</strong> {studentID}
              </p>
              <p>
                <strong>Guardian Phone Number:</strong> {guardianPhoneNumber}
              </p>
            </div>
            <button onClick={handleConfirm} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        )}

        {/* Step 6 (Teacher): Select Subjects */}
        {currentStep === 6 && role === "Teacher" && (
          <div style={styles.stepContainer}>
            <h3 style={styles.subjectHeader}>Select Subjects</h3>
            <div style={styles.subjectContainer}>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.subjectName}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSubject}
                style={styles.addButton}
                disabled={!selectedSubject}
              >
                +
              </button>
            </div>
            <ul style={styles.subjectList}>
              {subjectList.map((subject, index) => (
                <li key={index} style={styles.subjectItem}>
                  {subject}
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    style={styles.removeButton}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            {subjectList.length > 0 && (
              <button onClick={handleNext} style={styles.nextButton}>
                Next &rarr;
              </button>
            )}
          </div>
        )}

        {/* Step 7 (Teacher): Confirmation */}
        {currentStep === 7 && role === "Teacher" && (
          <div style={styles.stepContainer}>
            <h3 style={styles.confirmHeader}>Confirm Your Details</h3>
            <div style={styles.confirmDetails}>
              <p>
                <strong>Role:</strong> {role}
              </p>
              <p>
                <strong>School:</strong> {selectedSchool}
              </p>
              <p>
                <strong>Teacher ID:</strong> {teacherID}
              </p>
              <p>
                <strong>Phone Number:</strong> {teacherPhoneNumber}
              </p>
              <p>
                <strong>Subjects:</strong> {subjectList.join(", ")}
              </p>
            </div>
            <button onClick={handleConfirm} style={styles.confirmButton}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PickSchoolPage;

// Inline styles for the component with descriptive labels
const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    color: "#333333",
    textAlign: "center" as const,
  },
  stepTitle: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333333",
  },
  stepContainer: {
    marginBottom: "30px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333333",
  },
  select: {
    width: "80%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #cccccc",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    color: "#333333",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  input: {
    width: "80%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #cccccc",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    color: "#333333",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  nextButton: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
    transition: "background-color 0.3s ease",
  },
  confirmButton: {
    padding: "12px 30px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
  subjectContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  addButton: {
    padding: "0",
    height: "40px",
    width: "40px",
    fontSize: "24px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    marginLeft: "10px",
    transition: "background-color 0.3s ease",
  },
  subjectList: {
    listStyleType: "none" as const,
    padding: 0,
    marginBottom: "20px",
    maxHeight: "200px",
    overflowY: "auto" as const,
  },
  subjectItem: {
    display: "flex",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "25px",
    textAlign: "center" as const,
    transition: "background-color 0.3s ease",
  },
  confirmHeader: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#333333",
  },
  confirmDetails: {
    textAlign: "left" as const,
    marginBottom: "20px",
    color: "#555555",
  },
  subjectHeader: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#333333",
  },
};
