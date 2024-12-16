
// // import React, { useState, useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import supabase from "../supabase";
// // import { useSession } from "../context/SessionContext";

// // function PickSchoolPage() {
// //   const [schools, setSchools] = useState([]);
// //   const [selectedSchool, setSelectedSchool] = useState("");
// //   const [schoolID, setSchoolID] = useState("");
// //   const [teacherPassword, setTeacherPassword] = useState("");
// //   const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
// //   const [role, setRole] = useState("Student/Guardian");

// //   const navigate = useNavigate();
// //   const { session } = useSession();

// //   useEffect(() => {
// //     // Ensure the user is signed in
// //     if (!session) {
// //       alert("User not signed in. Redirecting to Sign In page.");
// //       navigate("/auth/sign-in");
// //       return;
// //     }

// //     // Fetch school data
// //     const fetchSchools = async () => {
// //       try {
// //         const { data, error } = await supabase.from("school").select("schoolName");
// //         if (error) {
// //           console.error("Error fetching schools:", error.message);
// //         } else {
// //           setSchools(data.map((school) => school.schoolName));
// //         }
// //       } catch (err) {
// //         console.error("Unexpected error fetching schools:", err);
// //       }
// //     };

// //     fetchSchools();
// //   }, [session, navigate]);

// //   const handleConfirm = async () => {
// //     if (!session) {
// //       alert("User not signed in. Please sign in.");
// //       navigate("/auth/sign-in");
// //       return;
// //     }

// //     if (role === "Teacher") {
// //       if (!selectedSchool || !schoolID || !teacherPassword || !teacherPhoneNumber) {
// //         alert("Please fill in all fields.");
// //         return;
// //       }

// //       try {
// //         // Fetch school details
// //         const { data: schoolData, error: schoolError } = await supabase
// //           .from("school")
// //           .select("schoolID, password")
// //           .eq("schoolName", selectedSchool)
// //           .single();

// //         if (schoolError) {
// //           console.error("Error fetching school details:", schoolError.message);
// //           alert("Error fetching school details. Please try again.");
// //           return;
// //         }

// //         // Validate school ID and password
// //         if (schoolData.schoolID !== schoolID || schoolData.password !== teacherPassword) {
// //           alert("Invalid School ID or Password. Please try again.");
// //           return;
// //         }

// //         // Update profiles table
// //         const { error: profileError } = await supabase
// //           .from("profiles")
// //           .update({
// //             role: "Teacher",
// //             school: selectedSchool,
// //             telNumber: teacherPhoneNumber,
// //           })
// //           .eq("id", session.user.id);

// //         if (profileError) {
// //           console.error("Error updating profile:", profileError.message);
// //           alert("Failed to update profile. Please try again.");
// //           return;
// //         }

// //         alert("Profile updated successfully!");
// //         navigate("/attendance");
// //       } catch (err) {
// //         console.error("Error confirming school:", err.message);
// //         alert("An unexpected error occurred. Please try again.");
// //       }
// //     }
// //   };

// //   return (
// //     <div className="pageContainer">
// //       <h2>Pick a School</h2>

// //       {/* Role Dropdown */}
// //       <div>
// //         <label>Role:</label>
// //         <select value={role} onChange={(e) => setRole(e.target.value)}>
// //           <option value="Student/Guardian">Student/Guardian</option>
// //           <option value="Teacher">Teacher</option>
// //         </select>
// //       </div>

// //       {/* School Selection Dropdown */}
// //       <div>
// //         <label>Select School:</label>
// //         <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
// //           <option value="">Select School</option>
// //           {schools.map((school) => (
// //             <option key={school} value={school}>
// //               {school}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {role === "Teacher" && (
// //         <>
// //           {/* School ID Input */}
// //           <div>
// //             <label>School ID:</label>
// //             <input
// //               type="text"
// //               value={schoolID}
// //               onChange={(e) => setSchoolID(e.target.value)}
// //               placeholder="Enter School ID"
// //             />
// //           </div>

// //           {/* Password Input */}
// //           <div>
// //             <label>Password:</label>
// //             <input
// //               type="password"
// //               value={teacherPassword}
// //               onChange={(e) => setTeacherPassword(e.target.value)}
// //               placeholder="Enter Password"
// //             />
// //           </div>

// //           {/* Phone Number Input */}
// //           <div>
// //             <label>Phone Number:</label>
// //             <input
// //               type="text"
// //               value={teacherPhoneNumber}
// //               onChange={(e) => setTeacherPhoneNumber(e.target.value)}
// //               placeholder="Enter Phone Number"
// //             />
// //           </div>
// //         </>
// //       )}

// //       {/* Confirm Button */}
// //       <button onClick={handleConfirm}>Confirm</button>

// //       {/* Navigation Links */}
// //       <nav>
// //         <Link to="/">Home</Link> | <Link to="/auth/sign-in">Sign In</Link> |{" "}
// //         <Link to="/auth/sign-up">Sign Up</Link>
// //       </nav>
// //     </div>
// //   );
// // }

// // export default PickSchoolPage;
// // import React, { useState, useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import supabase from "../supabase";
// // import { useSession } from "../context/SessionContext";

// // function PickSchoolPage() {
// //   const [schools, setSchools] = useState([]);
// //   const [selectedSchool, setSelectedSchool] = useState("");
// //   const [studentID, setStudentID] = useState("");
// //   const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
// //   const [schoolID, setSchoolID] = useState("");
// //   const [teacherPassword, setTeacherPassword] = useState("");
// //   const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
// //   const [role, setRole] = useState("Student/Guardian");

// //   const navigate = useNavigate();
// //   const { session } = useSession();

// //   useEffect(() => {
// //     if (!session) {
// //       alert("User not signed in. Redirecting to Sign In page.");
// //       navigate("/auth/sign-in");
// //       return;
// //     }

// //     const fetchSchools = async () => {
// //       try {
// //         const { data, error } = await supabase.from("school").select("schoolName");
// //         if (error) {
// //           console.error("Error fetching schools:", error.message);
// //         } else {
// //           setSchools(data.map((school) => school.schoolName));
// //         }
// //       } catch (err) {
// //         console.error("Unexpected error fetching schools:", err);
// //       }
// //     };

// //     fetchSchools();
// //   }, [session, navigate]);

// //   const handleConfirm = async () => {
// //     if (!session) {
// //       alert("User not signed in. Please sign in.");
// //       navigate("/auth/sign-in");
// //       return;
// //     }

// //     if (role === "Student/Guardian") {
// //       if (!studentID || !guardianPhoneNumber || !selectedSchool) {
// //         alert("Please fill in all fields.");
// //         return;
// //       }

// //       try {
// //         // Fetch matching student record
// //         const { data: studentData, error: studentError } = await supabase
// //           .from("student")
// //           .select("studentID, guardianNumber, school")
// //           .eq("studentID", studentID)
// //           .eq("guardianNumber", guardianPhoneNumber)
// //           .eq("school", selectedSchool) // Ensure school matches the selected school
// //           .single();

// //         if (studentError || !studentData) {
// //           alert("Invalid Student ID, Guardian Phone Number, or Selected School.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         // Update profiles table for Student/Guardian
// //         const { error: profileError } = await supabase
// //           .from("profiles")
// //           .update({
// //             role: "USER", // No change to role
// //             school: selectedSchool,
// //             telNumber: guardianPhoneNumber,
// //             password: studentID, // Save student ID as password
// //           })
// //           .eq("id", session.user.id);

// //         if (profileError) {
// //           alert("Failed to update profile.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         alert("Profile updated successfully!");
// //         navigate("/student");
// //       } catch (err) {
// //         console.error("Error confirming school:", err.message);
// //         alert("An unexpected error occurred. Please try again.");
// //       }
// //     }

// //     if (role === "Teacher") {
// //       if (!selectedSchool || !schoolID || !teacherPassword || !teacherPhoneNumber) {
// //         alert("Please fill in all fields.");
// //         return;
// //       }

// //       try {
// //         // Fetch school details
// //         const { data: schoolData, error: schoolError } = await supabase
// //           .from("school")
// //           .select("schoolID, password")
// //           .eq("schoolName", selectedSchool)
// //           .single();

// //         if (schoolError) {
// //           console.error("Error fetching school details:", schoolError.message);
// //           alert("Error fetching school details. Please try again.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         // Validate school ID and password
// //         if (schoolData.schoolID !== schoolID || schoolData.password !== teacherPassword) {
// //           alert("Invalid School ID or Password.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         // Update profiles table for Teacher
// //         const { error: profileError } = await supabase
// //           .from("profiles")
// //           .update({
// //             role: "Teacher", // Change role to Teacher
// //             school: selectedSchool,
// //             telNumber: teacherPhoneNumber,
// //           })
// //           .eq("id", session.user.id);

// //         if (profileError) {
// //           alert("Failed to update profile.");
// //           navigate("/auth/sign-in");
// //           return;
// //         }

// //         alert("Profile updated successfully!");
// //         navigate("/pick-subject");
// //       } catch (err) {
// //         console.error("Error confirming school:", err.message);
// //         alert("An unexpected error occurred. Please try again.");
// //       }
// //     }
// //   };

// //   return (
// //     <div className="pageContainer">
// //       <h2>Pick a School</h2>

// //       {/* Role Dropdown */}
// //       <div>
// //         <label>Role:</label>
// //         <select value={role} onChange={(e) => setRole(e.target.value)}>
// //           <option value="Student/Guardian">Student/Guardian</option>
// //           <option value="Teacher">Teacher</option>
// //         </select>
// //       </div>

// //       {/* School Selection Dropdown */}
// //       <div>
// //         <label>Select School:</label>
// //         <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
// //           <option value="">Select School</option>
// //           {schools.map((school) => (
// //             <option key={school} value={school}>
// //               {school}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {role === "Student/Guardian" && (
// //         <>
// //           {/* Student ID Input */}
// //           <div>
// //             <label>Student ID:</label>
// //             <input
// //               type="text"
// //               value={studentID}
// //               onChange={(e) => setStudentID(e.target.value)}
// //               placeholder="Enter Student ID"
// //             />
// //           </div>

// //           {/* Guardian Phone Number Input */}
// //           <div>
// //             <label>Phone Number:</label>
// //             <input
// //               type="text"
// //               value={guardianPhoneNumber}
// //               onChange={(e) => setGuardianPhoneNumber(e.target.value)}
// //               placeholder="Enter Guardian Phone Number"
// //             />
// //           </div>
// //         </>
// //       )}

// //       {role === "Teacher" && (
// //         <>
// //           {/* School ID Input */}
// //           <div>
// //             <label>School ID:</label>
// //             <input
// //               type="text"
// //               value={schoolID}
// //               onChange={(e) => setSchoolID(e.target.value)}
// //               placeholder="Enter School ID"
// //             />
// //           </div>

// //           {/* Password Input */}
// //           <div>
// //             <label>Password:</label>
// //             <input
// //               type="password"
// //               value={teacherPassword}
// //               onChange={(e) => setTeacherPassword(e.target.value)}
// //               placeholder="Enter Password"
// //             />
// //           </div>

// //           {/* Phone Number Input */}
// //           <div>
// //             <label>Phone Number:</label>
// //             <input
// //               type="text"
// //               value={teacherPhoneNumber}
// //               onChange={(e) => setTeacherPhoneNumber(e.target.value)}
// //               placeholder="Enter Phone Number"
// //             />
// //           </div>
// //         </>
// //       )}

// //       {/* Confirm Button */}
// //       <button onClick={handleConfirm}>Confirm</button>

// //       {/* Navigation Links */}
// //       <nav>
// //         <Link to="/">Home</Link> | <Link to="/auth/sign-in">Sign In</Link> |{" "}
// //         <Link to="/auth/sign-up">Sign Up</Link>
// //       </nav>
// //     </div>
// //   );
// // }

// // export default PickSchoolPage;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import supabase from "../../supabase";
// import { useSession } from "../../context/SessionContext";

// function PickSchoolPage() {
//   const [schools, setSchools] = useState([]);
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [studentID, setStudentID] = useState("");
//   const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
//   const [schoolID, setSchoolID] = useState("");
//   const [teacherPassword, setTeacherPassword] = useState("");
//   const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
//   const [role, setRole] = useState("Student/Guardian");

//   // States for subjects
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [subjectList, setSubjectList] = useState([]);

//   const navigate = useNavigate();
//   const { session } = useSession();

//   useEffect(() => {
//     if (!session) {
//       alert("User not signed in. Redirecting to Sign In page.");
//       navigate("/auth/sign-in");
//       return;
//     }

//     const fetchSchools = async () => {
//       try {
//         const { data, error } = await supabase.from("school").select("schoolName");
//         if (error) {
//           console.error("Error fetching schools:", error.message);
//         } else {
//           setSchools(data.map((school) => school.schoolName));
//         }
//       } catch (err) {
//         console.error("Unexpected error fetching schools:", err);
//       }
//     };

//     fetchSchools();
//   }, [session, navigate]);

//   const fetchSubjects = async (school) => {
//     try {
//       const { data, error } = await supabase.from("subjects").select("id, subjectName").eq("school", school);
//       if (error) {
//         console.error("Error fetching subjects:", error.message);
//         alert("Error fetching subjects. Please try again.");
//         return;
//       }
//       setSubjects(data);
//     } catch (err) {
//       console.error("Unexpected error fetching subjects:", err);
//     }
//   };

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
//     setSelectedSubject("");
//   };

//   const handleRemoveSubject = (subject) => {
//     const updatedList = subjectList.filter((item) => item !== subject);
//     setSubjectList(updatedList);
//   };

//   const handleConfirm = async () => {
//     if (role === "Student/Guardian") {
//       if (!studentID || !guardianPhoneNumber || !selectedSchool) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       try {
//         // Update profiles table for Student/Guardian
//         const { error: profileError } = await supabase
//           .from("profiles")
//           .update({
//             role: "USER",
//             school: selectedSchool,
//             telNumber: guardianPhoneNumber,
//             password: studentID,
//           })
//           .eq("id", session.user.id);

//         if (profileError) {
//           alert("Failed to update profile.");
//           navigate("/auth/sign-in");
//           return;
//         }

//         alert("Profile updated successfully!");
//         navigate("/student");
//       } catch (err) {
//         console.error("Error confirming school:", err.message);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     } else if (role === "Teacher") {
//       if (!selectedSchool || !schoolID || !teacherPassword || !teacherPhoneNumber || subjectList.length === 0) {
//         alert("Please fill in all fields and select at least one subject.");
//         return;
//       }

//       try {
//         // Update profiles table for Teacher
//         const updateData = {
//           role: "Teacher",
//           school: selectedSchool,
//           telNumber: teacherPhoneNumber,
//         };

//         subjectList.forEach((subject, index) => {
//           updateData[`subject${index + 1}`] = subject;
//         });

//         const { error: profileError } = await supabase.from("profiles").update(updateData).eq("id", session.user.id);

//         if (profileError) {
//           alert("Failed to update profile.");
//           navigate("/auth/sign-in");
//           return;
//         }

//         alert("Profile and subjects updated successfully!");
//         navigate("/attendance");
//       } catch (err) {
//         console.error("Error confirming school:", err.message);
//         alert("An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (role === "Teacher" && selectedSchool) {
//       fetchSubjects(selectedSchool);
//     }
//   }, [role, selectedSchool]);

//   return (
//     <div className="pageContainer">
//       <h2>Pick a School</h2>

//       {/* Role Dropdown */}
//       <div>
//         <label>Role:</label>
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="Student/Guardian">Student/Guardian</option>
//           <option value="Teacher">Teacher</option>
//         </select>
//       </div>

//       {/* School Selection Dropdown */}
//       <div>
//         <label>Select School:</label>
//         <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
//           <option value="">Select School</option>
//           {schools.map((school) => (
//             <option key={school} value={school}>
//               {school}
//             </option>
//           ))}
//         </select>
//       </div>

//       {role === "Teacher" && (
//         <>
//           <div>
//             <label>School ID:</label>
//             <input
//               type="text"
//               value={schoolID}
//               onChange={(e) => setSchoolID(e.target.value)}
//               placeholder="Enter School ID"
//             />
//           </div>

//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               value={teacherPassword}
//               onChange={(e) => setTeacherPassword(e.target.value)}
//               placeholder="Enter Password"
//             />
//           </div>

//           <div>
//             <label>Phone Number:</label>
//             <input
//               type="text"
//               value={teacherPhoneNumber}
//               onChange={(e) => setTeacherPhoneNumber(e.target.value)}
//               placeholder="Enter Phone Number"
//             />
//           </div>

//           <h3>Select Subjects</h3>
//           <div>
//             <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//               <option value="">-- Select Subject --</option>
//               {subjects.map((subject) => (
//                 <option key={subject.id} value={subject.subjectName}>
//                   {subject.subjectName}
//                 </option>
//               ))}
//             </select>
//             <button onClick={handleAddSubject}>Add Subject</button>
//           </div>
//           <ul>
//             {subjectList.map((subject, index) => (
//               <li key={index}>
//                 {subject} <button onClick={() => handleRemoveSubject(subject)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//         </>
//       )}

//       <button onClick={handleConfirm}>Confirm</button>

//       <nav>
//         <Link to="/">Home</Link> | <Link to="/auth/sign-in">Sign In</Link> |{" "}
//         <Link to="/auth/sign-up">Sign Up</Link>
//       </nav>
//     </div>
//   );
// }

// export default PickSchoolPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { useSession } from "../../context/SessionContext";

function PickSchoolPage() {
  // State variables for user inputs and selections
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [studentID, setStudentID] = useState("");
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
  const [schoolID, setSchoolID] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherPhoneNumber, setTeacherPhoneNumber] = useState("");
  const [role, setRole] = useState("Student/Guardian");

  // States for subjects (Teacher Only)
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectList, setSubjectList] = useState([]);

  // State to store matched student data
  const [studentData, setStudentData] = useState(null);

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
          navigate("/pick-school");
          return;
        }

        setSchools(data.map((school) => school.schoolName));
      } catch (err) {
        console.error("Unexpected error fetching schools:", err);
        navigate("/pick-school");
      }
    };

    fetchSchools();
  }, [session, navigate]);

  useEffect(() => {
    if (role === "Teacher" && selectedSchool) {
      fetchSubjects(selectedSchool);
    }
  }, [role, selectedSchool]);

  const fetchSubjects = async (school) => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("id, subjectName")
        .eq("school", school);

      if (error) {
        console.error("Error fetching subjects:", error.message);
        navigate("/pick-school");
        return;
      }

      setSubjects(data);
    } catch (err) {
      console.error("Unexpected error fetching subjects:", err);
      navigate("/pick-school");
    }
  };

  // Handlers for adding and removing subjects (Teacher Only)
  const handleAddSubject = () => {
    if (!selectedSubject) {
      return;
    }

    if (subjectList.includes(selectedSubject)) {
      return;
    }

    setSubjectList([...subjectList, selectedSubject]);
    setSelectedSubject("");
  };

  const handleRemoveSubject = (subject) => {
    const updatedList = subjectList.filter((item) => item !== subject);
    setSubjectList(updatedList);
  };

  // Handler to proceed to the next step
  const handleNext = async () => {
    console.log(`Current Step: ${currentStep}, Role: ${role}`);

    // Teacher Verification after entering Password in Step 4
    if (role === "Teacher" && currentStep === 4) {
      try {
        console.log("Verifying Teacher credentials...");

        const { data: school, error: schoolError } = await supabase
          .from("school")
          .select("*")
          .eq("schoolName", selectedSchool)
          .eq("schoolID", schoolID)
          .eq("password", teacherPassword)
          .single();

        if (schoolError || !school) {
          console.error("Teacher verification failed:", schoolError?.message);
          navigate("/pick-school");
          return;
        }

        console.log("Teacher verified successfully.");
        // Verification successful, proceed to next step
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error("Error verifying Teacher details:", err);
        navigate("/pick-school");
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
          navigate("/pick-school");
          return;
        }

        console.log("Student/Guardian verified successfully:", student);
        // Store student data for confirmation
        setStudentData(student);

        // Verification successful, proceed to confirmation
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error("Error verifying Student/Guardian details:", err);
        navigate("/pick-school");
      }
    }
    // For other steps (e.g., Role Selection, School Selection, etc.)
    else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handler to confirm and submit the form
  const handleConfirm = async () => {
    console.log("Confirm button clicked.");

    if (role === "Student/Guardian") {
      // Validate inputs
      if (!studentID || !guardianPhoneNumber || !selectedSchool) {
        console.error("Missing Student/Guardian inputs.");
        navigate("/pick-school");
        return;
      }

      try {
        console.log("Updating profiles table for Student/Guardian...");

        // Update profiles table for Student/Guardian
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: "USER",
            school: selectedSchool,
            telNumber: guardianPhoneNumber,
            password: studentID,
          })
          .eq("id", session.user.id); // Ensure 'id' matches your profiles table's user identifier

        if (profileError) {
          console.error("Error updating profiles:", profileError.message);
          navigate("/pick-school");
          return;
        }

        console.log("Profiles table updated successfully for Student/Guardian.");
        alert("Profile updated successfully!");
        navigate("/student");
      } catch (err) {
        console.error("Error updating Student/Guardian profile:", err);
        navigate("/pick-school");
      }
    } else if (role === "Teacher") {
      // Validate inputs
      if (!selectedSchool || !teacherPhoneNumber || subjectList.length === 0) {
        console.error("Missing Teacher inputs.");
        navigate("/pick-school");
        return;
      }

      try {
        console.log("Updating profiles table for Teacher...");

        // Update profiles table for Teacher
        const updateData = {
          role: "Teacher",
          school: selectedSchool,
          telNumber: teacherPhoneNumber,
        };

        // Dynamically add subjects to subject1, subject2, ..., subject10
        subjectList.forEach((subject, index) => {
          if (index < 10) {
            updateData[`subject${index + 1}`] = subject;
          }
        });

        const { error: profileError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", session.user.id); // Ensure 'id' matches your profiles table's user identifier

        if (profileError) {
          console.error("Error updating profiles:", profileError.message);
          navigate("/pick-school");
          return;
        }

        console.log("Profiles table updated successfully for Teacher.");
        alert("Profile and subjects updated successfully!");
        navigate("/attendance");
      } catch (err) {
        console.error("Error updating Teacher profile:", err);
        navigate("/pick-school");
      }
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        {/* Step Indicators */}
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

        {/* Step 3: Enter Student ID or School ID */}
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

        {/* Step 4: Enter Guardian Phone Number or Password */}
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
                <label style={styles.label}>Enter Password:</label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Password"
                  style={styles.input}
                />
                {teacherPassword && (
                  <button onClick={handleNext} style={styles.nextButton}>
                    Next &rarr;
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 5: Confirmation (Student/Guardian) or Step 5: Enter Phone Number (Teacher) */}
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

        {/* Step 5: Confirmation (Student/Guardian) */}
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
              {/* Display student details */}
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
              {/* Display entered information */}
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

        {/* Step 6: Select Subjects (Teacher Only) */}
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
                Add Subject
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

        {/* Step 7: Confirmation (Teacher) */}
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
                <strong>School ID:</strong> {schoolID}
              </p>
              <p>
                <strong>Password:</strong> {teacherPassword}
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
const styles = {
  // Outer container centers the content with a dark grey background
  outerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#2c2c2c", // Dark grey background
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  // Main container with dark grey background, rounded corners, and shadow
  container: {
    backgroundColor: "#3a3a3a", // Dark grey container
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "500px",
    color: "white",
    textAlign: "center",
  },
  // Title styling
  stepTitle: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "white",
  },
  // Container for each step
  stepContainer: {
    marginBottom: "30px",
  },
  // Label styling for inputs and selects
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
  },
  // Select dropdown styling
  select: {
    width: "80%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    marginBottom: "20px",
    backgroundColor: "#4a4a4a", // Slightly lighter grey
    color: "white",
    outline: "none",
    transition: "background-color 0.3s ease",
  },
  // Input field styling
  input: {
    width: "80%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    marginBottom: "20px",
    backgroundColor: "#4a4a4a", // Slightly lighter grey
    color: "white",
    outline: "none",
    transition: "background-color 0.3s ease",
  },
  // Next button styling
  nextButton: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#007bff", // Blue color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  // Confirm button styling
  confirmButton: {
    padding: "12px 30px",
    fontSize: "18px",
    backgroundColor: "#28a745", // Green color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
  // Subject selection container
  subjectContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  // Add Subject button styling
  addButton: {
    padding: "12px 20px",
    fontSize: "14px",
    backgroundColor: "#17a2b8", // Teal color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
    transition: "background-color 0.3s ease",
  },
  // Subject list styling
  subjectList: {
    listStyleType: "none",
    padding: 0,
    marginBottom: "20px",
    maxHeight: "150px",
    overflowY: "auto",
  },
  // Individual subject item styling
  subjectItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4a4a4a", // Same as input background
    padding: "10px 15px",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  // Remove Subject button styling
  removeButton: {
    backgroundColor: "#dc3545", // Red color
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "25px",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  },
  // Confirmation header styling
  confirmHeader: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "white",
  },
  // Confirmation details styling
  confirmDetails: {
    textAlign: "left",
    marginBottom: "20px",
    color: "#dcdcdc", // Light grey for better readability
  },
  subjectHeader: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "white",
  },
};

